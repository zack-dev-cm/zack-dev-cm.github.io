import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_BASE = 'https://zack-dev-cm.github.io';
const REQUIRED_TERMS = [
  'Answer Engine Optimization',
  'AEO',
  'AI Visibility',
  'Agent Discovery',
  'Structured Data',
  'llms.txt',
  'JSON-LD'
];

const errors = [];

const fail = (message) => {
  errors.push(message);
};

const readText = async (relativePath) => {
  return fs.readFile(path.resolve(ROOT_DIR, relativePath), 'utf8');
};

const fileExists = async (relativePath) => {
  try {
    await fs.access(path.resolve(ROOT_DIR, relativePath));
    return true;
  } catch {
    return false;
  }
};

const includesAll = (label, content, needles) => {
  for (const needle of needles) {
    if (!content.includes(needle)) {
      fail(`${label} is missing "${needle}".`);
    }
  }
};

const parseJson = (label, content) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
};

const extractInlineJsonLd = (label, html) => {
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!match) {
    fail(`${label} is missing inline JSON-LD.`);
    return null;
  }
  return parseJson(`${label} inline JSON-LD`, match[1]);
};

const typeMatches = (node, typeName) => {
  const type = node?.['@type'];
  return Array.isArray(type) ? type.includes(typeName) : type === typeName;
};

const assertSchemaGraph = (label, schema) => {
  const graph = Array.isArray(schema?.['@graph']) ? schema['@graph'] : [];
  if (graph.length === 0) {
    fail(`${label} has no @graph nodes.`);
    return;
  }

  const person = graph.find((node) => typeMatches(node, 'Person'));
  const faq = graph.find((node) => typeMatches(node, 'FAQPage'));
  const serviceNodes = graph.filter((node) => typeMatches(node, 'Service'));
  const catalog = graph.find((node) => typeMatches(node, 'OfferCatalog'));
  const dataCatalog = graph.find((node) => typeMatches(node, 'DataCatalog'));
  const projectList = graph.find((node) => typeMatches(node, 'ItemList'));
  const webPage = graph.find((node) => typeMatches(node, 'WebPage'));

  if (!person) fail(`${label} is missing a Person node.`);
  if (!catalog) fail(`${label} is missing an OfferCatalog node.`);
  if (serviceNodes.length < 4) fail(`${label} should expose at least 4 Service nodes, found ${serviceNodes.length}.`);
  if (!faq || !Array.isArray(faq.mainEntity) || faq.mainEntity.length < 8) {
    fail(`${label} should expose at least 8 FAQ answer targets.`);
  }
  if (!projectList || !Number.isFinite(projectList.numberOfItems) || projectList.numberOfItems < 70) {
    fail(`${label} project ItemList should expose at least 70 projects.`);
  }
  if (!dataCatalog || !JSON.stringify(dataCatalog).includes('Agent context')) {
    fail(`${label} DataCatalog should include agent-context.md.`);
  }
  if (!webPage || !JSON.stringify(webPage).includes('#crawlable-service-signals')) {
    fail(`${label} WebPage should mark crawlable service signals as speakable content.`);
  }

  const knowsAbout = Array.isArray(person?.knowsAbout) ? person.knowsAbout.join(' ') : '';
  includesAll(`${label} Person knowsAbout`, knowsAbout, ['Answer Engine Optimization', 'AEO', 'AI Visibility']);
};

const assertDiscovery = (label, manifest) => {
  if (!manifest) return;
  if (!Array.isArray(manifest.answerTargets) || manifest.answerTargets.length < 8) {
    fail(`${label} should expose at least 8 answerTargets.`);
  }
  if (!Array.isArray(manifest.serviceSignals) || manifest.serviceSignals.length < 4) {
    fail(`${label} should expose at least 4 serviceSignals.`);
  }
  if (!manifest.answerEngineOptimization) {
    fail(`${label} is missing answerEngineOptimization metadata.`);
  }
  const serialized = JSON.stringify(manifest);
  includesAll(label, serialized, ['AI visibility', 'answer engine optimization', 'agent discovery manifest']);
  const tractionMatch = serialized.match(/([\d,]+) tracked ClawHub downloads across (\d+) public skills/);
  const downloads = tractionMatch ? Number(tractionMatch[1].replace(/,/g, '')) : 0;
  const skills = tractionMatch ? Number(tractionMatch[2]) : 0;
  if (downloads < 6000 || skills < 30) {
    fail(`${label} should expose validated ClawHub traction with at least 6,000 downloads across 30 skills.`);
  }
};

const assertHtml = (label, html) => {
  const metaDescription = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] || '';
  if (/<meta\b[^>]*name=["']keywords["']/i.test(html)) {
    fail(`${label} should not include obsolete meta keywords.`);
  }
  if (!metaDescription) {
    fail(`${label} should include a meta description.`);
  }
  if (metaDescription.length > 170) {
    fail(`${label} meta description should stay under 170 characters; found ${metaDescription.length}.`);
  }
  includesAll(label, html, [
    '<link rel="canonical" href="https://zack-dev-cm.github.io/"',
    '<meta name="robots" content="index, follow',
    `${SITE_BASE}/llms.txt`,
    `${SITE_BASE}/llms-full.txt`,
    `${SITE_BASE}/docs/agent-discovery.json`,
    `${SITE_BASE}/schema.jsonld`,
    'crawlable-service-signals',
    'High-intent service signals',
    'Answer targets for search and AI agents',
    'tracked ClawHub downloads'
  ]);
  includesAll(label, html, REQUIRED_TERMS);
  assertSchemaGraph(label, extractInlineJsonLd(label, html));
};

const assertSitemap = (label, xml) => {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (locs.length > 25) {
    fail(`${label} should stay focused; found ${locs.length} URLs.`);
  }
  const machineUrls = locs.filter((url) => /\.(?:json|jsonld|txt)$/i.test(url));
  if (machineUrls.length) {
    fail(`${label} should not promote machine-readable files as primary XML sitemap URLs: ${machineUrls.join(', ')}`);
  }
  const markdownUrls = locs.filter((url) => /\.md$/i.test(url));
  if (markdownUrls.length) {
    fail(`${label} should not include raw Markdown URLs as search-facing sitemap entries: ${markdownUrls.join(', ')}`);
  }
  const projectHtmlUrls = locs.filter((url) => /\/projects\/[^/]+\/$/i.test(url));
  if (projectHtmlUrls.length < 10) {
    fail(`${label} should include at least 10 curated HTML project case-study URLs, found ${projectHtmlUrls.length}.`);
  }
  return locs;
};

const assertProjectHtmlPages = async (label, locs, rootPrefix = '') => {
  const projectUrls = locs.filter((url) => /\/projects\/[^/]+\/$/i.test(url));
  for (const url of projectUrls) {
    const slug = new URL(url).pathname.split('/').filter(Boolean).at(-1);
    const htmlPath = `${rootPrefix}projects/${slug}/index.html`;
    const html = await readText(htmlPath).catch(() => '');
    if (!html) {
      fail(`${label} references missing generated project page ${htmlPath}.`);
      continue;
    }
    includesAll(htmlPath, html, [
      `<link rel="canonical" href="${url}"`,
      '<link rel="alternate" type="text/markdown"',
      '<script type="application/ld+json">',
      '<h1>'
    ]);
    if (/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{171,}["']/i.test(html)) {
      fail(`${htmlPath} has an overlong meta description.`);
    }
  }
};

const assertSourceOrder = async () => {
  const app = await readText('App.tsx');
  const introIndex = app.indexOf('id="intro"');
  const experienceIndex = app.indexOf('id="experience"');
  if (introIndex === -1 || experienceIndex === -1 || introIndex > experienceIndex) {
    fail('App.tsx should render the intent-first #intro hero before #experience proof logos.');
  }
};

const assertRobots = (label, content) => {
  includesAll(label, content, [
    'User-agent: Googlebot',
    'Disallow: /projects/*.md$',
    'Disallow: /agent-discovery.json$',
    'Disallow: /metadata.json$',
    'Disallow: /docs/*.json$',
    'Disallow: /llms.txt$',
    'Disallow: /llms-full.txt$',
    'Disallow: /geo.txt$',
    'Disallow: /schema.jsonld$'
  ]);
};

const main = async () => {
  const indexHtml = await readText('index.html');
  const robots = await readText('robots.txt');
  const llms = await readText('llms.txt');
  const llmsFull = await readText('llms-full.txt');
  const geo = await readText('geo.txt');
  const agentContext = await readText('agent-context.md');
  const sitemap = await readText('sitemap.xml');
  const discovery = parseJson('agent-discovery.json', await readText('agent-discovery.json'));
  const schema = parseJson('schema.jsonld', await readText('schema.jsonld'));

  await assertSourceOrder();
  assertHtml('index.html', indexHtml);
  assertRobots('robots.txt', robots);
  const sitemapLocs = assertSitemap('sitemap.xml', sitemap);
  await assertProjectHtmlPages('sitemap.xml', sitemapLocs);
  assertDiscovery('agent-discovery.json', discovery);
  assertSchemaGraph('schema.jsonld', schema);

  for (const [label, content] of [
    ['llms.txt', llms],
    ['llms-full.txt', llmsFull],
    ['geo.txt', geo],
    ['agent-context.md', agentContext]
  ]) {
    includesAll(label, content, REQUIRED_TERMS);
    includesAll(label, content, ['High-Intent Service Signals', 'Computer vision engineering', 'AI visibility and answer engine optimization']);
  }

  if (await fileExists('docs/index.html')) {
    assertHtml('docs/index.html', await readText('docs/index.html'));
  }
  if (await fileExists('docs/sitemap.xml')) {
    const docsSitemapLocs = assertSitemap('docs/sitemap.xml', await readText('docs/sitemap.xml'));
    await assertProjectHtmlPages('docs/sitemap.xml', docsSitemapLocs, 'docs/');
  }
  if (await fileExists('docs/robots.txt')) {
    assertRobots('docs/robots.txt', await readText('docs/robots.txt'));
  }
  if (await fileExists('docs/agent-discovery.json')) {
    assertDiscovery('docs/agent-discovery.json', parseJson('docs/agent-discovery.json', await readText('docs/agent-discovery.json')));
  }
  if (await fileExists('docs/schema.jsonld')) {
    assertSchemaGraph('docs/schema.jsonld', parseJson('docs/schema.jsonld', await readText('docs/schema.jsonld')));
  }

  if (errors.length) {
    console.error('SEO/AEO validation failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log('SEO/AEO validation passed.');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
