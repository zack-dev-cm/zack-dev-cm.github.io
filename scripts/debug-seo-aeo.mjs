import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_URL = 'https://zack-dev-cm.github.io/';
const live = process.argv.includes('--live');

const issues = [];

const readLocal = async (relativePath) => fs.readFile(path.resolve(ROOT_DIR, relativePath), 'utf8');

const readFirstLocal = async (...relativePaths) => {
  for (const relativePath of relativePaths) {
    try {
      return { status: 200, finalUrl: relativePath, text: await readLocal(relativePath) };
    } catch {
      // Keep trying the next generated/source fallback.
    }
  }
  return { status: 0, finalUrl: relativePaths[0], text: '', error: `Missing ${relativePaths.join(' or ')}` };
};

const fetchText = async (url) => {
  try {
    const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    const text = await response.text();
    return { status: response.status, finalUrl: response.url, text };
  } catch (error) {
    return { status: 0, finalUrl: url, text: '', error: error.message };
  }
};

const source = live
  ? {
      html: await fetchText(SITE_URL),
      sitemap: await fetchText(`${SITE_URL}sitemap.xml`),
      files: {
        llms: await fetchText(`${SITE_URL}llms.txt`),
        llmsFull: await fetchText(`${SITE_URL}llms-full.txt`),
        geo: await fetchText(`${SITE_URL}geo.txt`),
        agentDiscovery: await fetchText(`${SITE_URL}docs/agent-discovery.json`),
        schemaJsonld: await fetchText(`${SITE_URL}schema.jsonld`),
        metadata: await fetchText(`${SITE_URL}metadata.json`)
      },
      appSource: { text: '' }
    }
  : {
      html: await readFirstLocal('docs/index.html', 'index.html'),
      sitemap: await readFirstLocal('docs/sitemap.xml', 'sitemap.xml'),
      files: {
        llms: await readFirstLocal('docs/llms.txt', 'llms.txt'),
        llmsFull: await readFirstLocal('docs/llms-full.txt', 'llms-full.txt'),
        geo: await readFirstLocal('docs/geo.txt', 'geo.txt'),
        agentDiscovery: await readFirstLocal('docs/agent-discovery.json', 'agent-discovery.json'),
        schemaJsonld: await readFirstLocal('docs/schema.jsonld', 'schema.jsonld'),
        metadata: await readFirstLocal('docs/metadata.json', 'metadata.json')
      },
      appSource: { text: await readLocal('App.tsx') }
    };

const html = source.html.text;
const sitemap = source.sitemap.text;
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const tags = (tagName) => [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
const getAttr = (tag, attr) => tag.match(new RegExp(`\\b${attr}=["']([^"']+)["']`, 'i'))?.[1] || '';
const linkTags = tags('link');
const metaTags = tags('meta');
const metaByName = (name) => {
  const tag = metaTags.find((candidate) => getAttr(candidate, 'name').toLowerCase() === name.toLowerCase());
  return tag ? getAttr(tag, 'content') : '';
};
const metaByProperty = (property) => {
  const tag = metaTags.find((candidate) => getAttr(candidate, 'property').toLowerCase() === property.toLowerCase());
  return tag ? getAttr(tag, 'content') : '';
};
const linkByRel = (rel) => {
  const tag = linkTags.find((candidate) => getAttr(candidate, 'rel').toLowerCase().split(/\s+/).includes(rel));
  return tag ? getAttr(tag, 'href') : '';
};
const alternateLinks = linkTags
  .filter((tag) => getAttr(tag, 'rel').toLowerCase().split(/\s+/).includes('alternate'))
  .map((tag) => ({ href: getAttr(tag, 'href'), type: getAttr(tag, 'type') }))
  .filter((link) => link.href);
const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map((match) => match[1]);
const headings = (tag) => [...html.matchAll(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi'))];
const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
const metaDescription = metaByName('description');
const canonical = linkByRel('canonical');
const robots = metaByName('robots');
const ogDescription = metaByProperty('og:description');
const h1 = headings('h1').map((match) => stripTags(match[0]));
const machineSitemapUrls = locs.filter((url) => /\.(?:json|jsonld|txt)$/i.test(url));
const markdownSitemapUrls = locs.filter((url) => /\.md$/i.test(url));
const projectHtmlSitemapUrls = locs.filter((url) => /\/projects\/[^/]+\/$/i.test(url));
const appIntroIndex = source.appSource.text.indexOf('id="intro"');
const appExperienceIndex = source.appSource.text.indexOf('id="experience"');
const discovery = parseJson('agent-discovery.json', source.files.agentDiscovery.text);
const schemaJsonld = parseJson('schema.jsonld', source.files.schemaJsonld.text);
const inlineSchema = parseJson('inline JSON-LD', html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)?.[1] || '');
const metadata = parseJson('metadata.json', source.files.metadata.text);
const schemaTypes = collectSchemaTypes(schemaJsonld);
const inlineSchemaTypes = collectSchemaTypes(inlineSchema);
const aeoTexts = {
  llms: source.files.llms.text,
  llmsFull: source.files.llmsFull.text,
  geo: source.files.geo.text
};

checkStatus('HTML', source.html);
checkStatus('sitemap.xml', source.sitemap);
for (const [label, file] of Object.entries(source.files)) checkStatus(label, file);

if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) issues.push('Obsolete meta keywords tag is present.');
if (canonical !== SITE_URL) issues.push(`Canonical should be ${SITE_URL}, found "${canonical || 'missing'}".`);
if (!/\bindex\b/i.test(robots) || !/\bfollow\b/i.test(robots)) issues.push(`Robots meta should allow index/follow, found "${robots || 'missing'}".`);
if (h1.length !== 1) issues.push(`Expected exactly one H1, found ${h1.length}.`);
if (!/computer vision and ai product engineer/i.test(`${title} ${h1.join(' ')}`)) {
  issues.push('Primary query is not explicit in title/H1.');
}
if (!metaDescription) issues.push('Meta description is missing.');
if (metaDescription.length > 170) issues.push(`Meta description is long: ${metaDescription.length} characters.`);
if (!/computer vision|ocr|segmentation|multimodal/i.test(metaDescription)) {
  issues.push('Meta description does not carry the primary service intent.');
}
if (!ogDescription || !/computer vision|AI product/i.test(ogDescription)) {
  issues.push('OG description does not carry the primary service intent.');
}
if (!alternateLinks.some((link) => link.href === `${SITE_URL}llms.txt`)) issues.push('llms.txt alternate link is missing.');
if (!alternateLinks.some((link) => link.href === `${SITE_URL}llms-full.txt`)) issues.push('llms-full.txt alternate link is missing.');
if (locs.length > 25) issues.push(`Sitemap is broad: ${locs.length} URLs.`);
if (machineSitemapUrls.length) issues.push(`Sitemap includes machine files: ${machineSitemapUrls.join(', ')}`);
if (markdownSitemapUrls.length) issues.push(`Sitemap includes raw Markdown URLs: ${markdownSitemapUrls.join(', ')}`);
if (projectHtmlSitemapUrls.length < 10) issues.push(`Sitemap includes ${projectHtmlSitemapUrls.length} project HTML URLs; expected at least 10 curated cases.`);
if (!live && (appIntroIndex === -1 || appExperienceIndex === -1 || appIntroIndex > appExperienceIndex)) {
  issues.push('React #intro hero is not before #experience proof section.');
}
if (!Array.isArray(discovery?.answerTargets) || discovery.answerTargets.length < 8) {
  issues.push(`agent-discovery.json has too few answerTargets: ${discovery?.answerTargets?.length || 0}.`);
}
if (!Array.isArray(discovery?.serviceSignals) || discovery.serviceSignals.length < 4) {
  issues.push(`agent-discovery.json has too few serviceSignals: ${discovery?.serviceSignals?.length || 0}.`);
}
for (const requiredType of ['Person', 'WebSite', 'WebPage', 'ProfilePage', 'FAQPage', 'Service', 'ItemList']) {
  if (!schemaTypes.includes(requiredType)) issues.push(`schema.jsonld is missing ${requiredType}.`);
  if (!inlineSchemaTypes.includes(requiredType)) issues.push(`inline JSON-LD is missing ${requiredType}.`);
}
for (const [label, text] of Object.entries(aeoTexts)) {
  if (!/Answer Engine Optimization|AEO/i.test(text)) issues.push(`${label} is missing AEO wording.`);
  if (!/Computer vision/i.test(text)) issues.push(`${label} is missing computer vision wording.`);
}
if (!metadata?.description || !/computer vision/i.test(metadata.description) || !/AEO/i.test(metadata.description)) {
  issues.push('metadata.json description is missing computer vision/AEO intent.');
}

const report = {
  ok: issues.length === 0,
  mode: live ? 'live' : 'local',
  html: {
    status: source.html.status,
    finalUrl: source.html.finalUrl,
    bytes: html.length,
    title,
    titleLength: title.length,
    canonical,
    robots,
    metaDescriptionLength: metaDescription.length,
    ogDescriptionLength: ogDescription.length,
    h1,
    h2: headings('h2').length,
    h3: headings('h3').length,
    anchors: anchors.length,
    internalAnchors: anchors.filter((href) => href.startsWith('/') || href.startsWith('#') || href.startsWith(SITE_URL)).length,
    hasMetaKeywords: /<meta\b[^>]*name=["']keywords["']/i.test(html),
    alternateLinks
  },
  sitemap: {
    status: source.sitemap.status,
    finalUrl: source.sitemap.finalUrl,
    urls: locs.length,
    markdownUrls: markdownSitemapUrls.length,
    projectHtmlUrls: projectHtmlSitemapUrls.length,
    machineUrls: machineSitemapUrls.length,
    locs
  },
  aeo: {
    llmsStatus: source.files.llms.status,
    llmsFullStatus: source.files.llmsFull.status,
    geoStatus: source.files.geo.status,
    agentDiscoveryStatus: source.files.agentDiscovery.status,
    schemaJsonldStatus: source.files.schemaJsonld.status,
    metadataStatus: source.files.metadata.status,
    answerTargets: Array.isArray(discovery?.answerTargets) ? discovery.answerTargets.length : 0,
    serviceSignals: Array.isArray(discovery?.serviceSignals) ? discovery.serviceSignals.length : 0,
    schemaTypes,
    inlineSchemaTypes
  },
  issues
};

console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);

function checkStatus(label, file) {
  if (file.status < 200 || file.status >= 400) {
    issues.push(`${label} returned HTTP/status ${file.status}${file.error ? ` (${file.error})` : ''}.`);
  }
}

function collectSchemaTypes(schema) {
  const graph = Array.isArray(schema?.['@graph']) ? schema['@graph'] : [];
  return [
    ...new Set(
      graph.flatMap((node) => {
        const type = node?.['@type'];
        return Array.isArray(type) ? type : [type].filter(Boolean);
      })
    )
  ].sort();
}

function parseJson(label, value) {
  if (!value) {
    issues.push(`${label} is empty or missing.`);
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    issues.push(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
