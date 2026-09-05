import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_BASE = 'https://zack-dev-cm.github.io';
const RESUME_PDF = `${SITE_BASE}/resume/zakhar-pashkin-senior-ml-engineer.pdf`;
const RESUME_HTML = `${SITE_BASE}/resume/zakhar-pashkin-senior-ml-engineer.html`;
const SCAN_DOCS = process.env.SEO_SCAN_DOCS !== 'false';
const errors = [];
const fail = (message) => errors.push(message);
const readText = (relativePath) => fs.readFile(path.resolve(ROOT_DIR, relativePath), 'utf8');
const fileExists = async (relativePath) => {
  try { await fs.access(path.resolve(ROOT_DIR, relativePath)); return true; } catch { return false; }
};
const includesAll = (label, content, needles) => {
  for (const needle of needles) if (!content.includes(needle)) fail(`${label} is missing "${needle}".`);
};
const parseJson = (label, content) => {
  try { return JSON.parse(content); } catch (error) { fail(`${label} is not valid JSON: ${error.message}`); return null; }
};
const typeMatches = (node, type) => Array.isArray(node?.['@type']) ? node['@type'].includes(type) : node?.['@type'] === type;
const extractInlineJsonLd = (label, html) => {
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!match) { fail(`${label} is missing inline JSON-LD.`); return null; }
  return parseJson(`${label} inline JSON-LD`, match[1]);
};
const assertNoTargetingCopy = (label, content) => {
  for (const token of ['Best queries:', 'Query intents:', 'High-Intent Service Signals', 'Answer targets for search and AI agents']) {
    if (content.includes(token)) fail(`${label} retains obsolete crawler-targeting copy: ${token}`);
  }
};

const assertSchemaGraph = (label, schema, discovery) => {
  const graph = Array.isArray(schema?.['@graph']) ? schema['@graph'] : [];
  if (!graph.length) { fail(`${label} has no @graph nodes.`); return; }
  const person = graph.find((node) => typeMatches(node, 'Person'));
  const website = graph.find((node) => typeMatches(node, 'WebSite'));
  const webPage = graph.find((node) => typeMatches(node, 'ProfilePage'));
  const projects = graph.find((node) => typeMatches(node, 'ItemList'));
  if (person?.name !== 'Zakhar Pashkin' || person?.jobTitle !== 'Senior ML Engineer') fail(`${label} has inconsistent person identity.`);
  if (person?.worksFor?.name !== 'Riverstart') fail(`${label} should identify the current Riverstart role.`);
  if (person?.url !== `${SITE_BASE}/` || website?.url !== `${SITE_BASE}/` || webPage?.url !== `${SITE_BASE}/`) fail(`${label} has inconsistent primary URLs.`);
  if (!person?.['@id'] || webPage?.mainEntity?.['@id'] !== person['@id']) fail(`${label} ProfilePage should identify its Person as mainEntity.`);
  includesAll(`${label} focus`, JSON.stringify(person?.knowsAbout || []), ['Computer Vision', 'Document AI', 'Inference Optimization']);
  if (graph.some((node) => ['FAQPage', 'OfferCatalog', 'Service'].some((type) => typeMatches(node, type)))) fail(`${label} describes FAQ/services absent from the current rendered homepage.`);
  if (webPage?.speakable) fail(`${label} retains speakable selectors for the replaced fallback content.`);
  const items = projects?.itemListElement || [];
  if (!items.length || projects.numberOfItems !== items.length) fail(`${label} project count does not match its ItemList.`);
  if (discovery && items.length !== discovery.allProjects?.length) fail(`${label} and project manifest disagree on archive size.`);
  const urls = items.map((entry) => entry.item?.url);
  if (new Set(urls).size !== urls.length) fail(`${label} contains duplicate project URLs.`);
  items.forEach((entry, index) => {
    if (entry.position !== index + 1 || !entry.item?.name || !entry.item?.description) fail(`${label} has incomplete project entry ${index + 1}.`);
    if (!/^https:\/\/zack-dev-cm\.github\.io\/projects\/[^/]+\/$/.test(entry.item?.url || '')) fail(`${label} project entry ${index + 1} lacks a canonical HTML URL.`);
  });
  if (discovery && person?.description !== discovery.entity?.description) fail(`${label} and discovery manifest disagree on the biography.`);
};

const assertDiscovery = (label, manifest) => {
  if (!manifest) return;
  if (manifest.entity?.name !== 'Zakhar Pashkin' || manifest.entity?.role !== 'Senior ML Engineer') fail(`${label} has stale identity.`);
  if (!Array.isArray(manifest.focusAreas) || !manifest.focusAreas.length) fail(`${label} has no engineering focus areas.`);
  if (manifest.answerEngineOptimization || manifest.answerTargets || manifest.serviceSignals) fail(`${label} retains the obsolete targeting contract.`);
  const projects = manifest.allProjects || [];
  const featured = manifest.featuredProjects || [];
  if (!projects.length || !featured.length) fail(`${label} needs a project archive and selected work.`);
  const urls = new Set(projects.map((project) => project.url));
  if (urls.size !== projects.length) fail(`${label} contains duplicate project URLs.`);
  for (const project of featured) if (!urls.has(project.url)) fail(`${label} features a project absent from the archive: ${project.url}`);
  const entries = manifest.entrypoints || [];
  if (!entries.some((entry) => entry.url === RESUME_PDF && entry.mediaType === 'application/pdf')) fail(`${label} is missing the current PDF resume entrypoint.`);
  if (!entries.some((entry) => entry.url === RESUME_HTML && entry.mediaType === 'text/html')) fail(`${label} should label the HTML resume as text/html.`);
  for (const entry of entries) {
    if (entry.url?.endsWith('.html') && entry.mediaType !== 'text/html') fail(`${label} has an incorrect HTML MIME type: ${entry.url}`);
  }
};

const assertHtml = (label, html, schema, discovery) => {
  const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  if (!description || description.length > 170) fail(`${label} needs a concise meta description (found ${description.length} characters).`);
  if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) fail(`${label} should not include obsolete meta keywords.`);
  includesAll(label, html, [
    `<link rel="canonical" href="${SITE_BASE}/"`,
    '<meta name="robots" content="index, follow',
    '<h1>Zakhar Pashkin</h1>',
    'Senior ML Engineer', 'Riverstart',
    'id="featured"', 'id="about"', 'id="projects"',
    `href="${RESUME_PDF}"`
  ]);
  assertNoTargetingCopy(label, html);
  const inline = extractInlineJsonLd(label, html);
  assertSchemaGraph(`${label} inline JSON-LD`, inline, discovery);
  if (inline && schema && JSON.stringify(inline) !== JSON.stringify(schema)) fail(`${label} inline JSON-LD differs from schema.jsonld.`);
  for (const project of discovery?.featuredProjects || []) {
    if (!html.includes(`href="${project.url}"`)) fail(`${label} does not link the featured case study ${project.url}.`);
  }
};

const assertSitemap = (label, xml, discovery) => {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!locs.length || new Set(locs).size !== locs.length) fail(`${label} is empty or contains duplicate URLs.`);
  const nonPages = locs.filter((url) => /\.(?:json|jsonld|txt|md)$/i.test(url));
  if (nonPages.length) fail(`${label} should list primary pages, not machine or Markdown alternates: ${nonPages.join(', ')}`);
  for (const url of [`${SITE_BASE}/`, RESUME_PDF, RESUME_HTML, ...(discovery?.featuredProjects || []).map((project) => project.url)]) {
    if (!locs.includes(url)) fail(`${label} is missing ${url}.`);
  }
  return locs;
};

const assertProjectHtmlPages = async (label, locs, rootPrefix = '') => {
  for (const url of locs.filter((value) => /\/projects\/[^/]+\/$/.test(value))) {
    const slug = new URL(url).pathname.split('/').filter(Boolean).at(-1);
    const file = `${rootPrefix}projects/${slug}/index.html`;
    const html = await readText(file).catch(() => '');
    if (!html) { fail(`${label} references missing ${file}.`); continue; }
    includesAll(file, html, [`<link rel="canonical" href="${url}"`, '<link rel="alternate" type="text/markdown"', '<script type="application/ld+json">', '<h1>']);
    if (/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{171,}["']/i.test(html)) fail(`${file} has an overlong description.`);
    if (html.includes('Public references and qualitative delivery signals are used')) fail(`${file} retains the empty benchmark fallback.`);
  }
};

const assertRobots = (label, content) => {
  includesAll(label, content, [
    'User-agent: Googlebot', 'Allow: /', `Sitemap: ${SITE_BASE}/sitemap.xml`,
    'Disallow: /projects/*.md$', 'Disallow: /agent-discovery.json$', 'Disallow: /metadata.json$',
    'Disallow: /docs/*.json$', 'Disallow: /llms.txt$', 'Disallow: /llms-full.txt$', 'Disallow: /geo.txt$', 'Disallow: /schema.jsonld$'
  ]);
};

const assertArtifacts = async (prefix = '') => {
  const [html, schemaText, manifestText, sitemap] = await Promise.all([
    readText(`${prefix}index.html`), readText(`${prefix}schema.jsonld`),
    readText(`${prefix}agent-discovery.json`), readText(`${prefix}sitemap.xml`)
  ]);
  const schema = parseJson(`${prefix}schema.jsonld`, schemaText);
  const manifest = parseJson(`${prefix}agent-discovery.json`, manifestText);
  assertDiscovery(`${prefix}agent-discovery.json`, manifest);
  assertSchemaGraph(`${prefix}schema.jsonld`, schema, manifest);
  assertHtml(`${prefix}index.html`, html, schema, manifest);
  const locs = assertSitemap(`${prefix}sitemap.xml`, sitemap, manifest);
  await assertProjectHtmlPages(`${prefix}sitemap.xml`, locs, prefix);
  for (const [legacy, current] of [
    ['dishes-recognition-nutrition-goals-telegram-bot', 'calorio-ai-nutrition-service'],
    ['agnitra-ai-inference-optimizer', 'agnitra-ml-profiling-optimization']
  ]) {
    const file = `${prefix}projects/${legacy}/index.html`;
    const redirect = await readText(file).catch(() => '');
    const canonical = `${SITE_BASE}/projects/${current}/`;
    includesAll(file, redirect, [`rel="canonical" href="${canonical}"`, `content="0;url=${canonical}"`]);
    if (locs.includes(`${SITE_BASE}/projects/${legacy}/`)) fail(`${prefix}sitemap.xml promotes a legacy redirect.`);
  }
  for (const file of ['llms.txt', 'llms-full.txt', 'geo.txt', 'agent-context.md']) {
    const text = await readText(`${prefix}${file}`);
    includesAll(`${prefix}${file}`, text, ['Zakhar Pashkin', 'Senior ML Engineer', 'Riverstart']);
    if (file === 'llms.txt') {
      assertNoTargetingCopy(`${prefix}${file}`, text);
      includesAll(`${prefix}${file}`, text, ['## Selected projects', RESUME_PDF, RESUME_HTML]);
      for (const project of manifest?.featuredProjects || []) if (!text.includes(project.url)) fail(`${prefix}${file} omits ${project.url}.`);
    }
  }
  if (await fileExists(`${prefix}robots.txt`)) assertRobots(`${prefix}robots.txt`, await readText(`${prefix}robots.txt`));
};

const main = async () => {
  const app = await readText('App.tsx');
  if (app.indexOf('id="intro"') < 0 || app.indexOf('id="experience"') < app.indexOf('id="intro"')) fail('App.tsx should present the introduction before experience.');
  await assertArtifacts();
  if (SCAN_DOCS && await fileExists('docs/index.html')) await assertArtifacts('docs/');
  if (errors.length) {
    console.error('SEO/discovery validation failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
  } else {
    console.log(`SEO/discovery validation passed (${SCAN_DOCS ? 'source and available build artifacts' : 'source artifacts only'}).`);
  }
};
main().catch((error) => { console.error(error); process.exitCode = 1; });
