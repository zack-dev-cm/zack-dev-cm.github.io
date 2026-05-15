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
  if (!projectList || projectList.numberOfItems < 70) {
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
  includesAll(label, html, [
    '<link rel="canonical" href="https://zack-dev-cm.github.io/"',
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

const main = async () => {
  const indexHtml = await readText('index.html');
  const llms = await readText('llms.txt');
  const llmsFull = await readText('llms-full.txt');
  const geo = await readText('geo.txt');
  const agentContext = await readText('agent-context.md');
  const discovery = parseJson('agent-discovery.json', await readText('agent-discovery.json'));
  const schema = parseJson('schema.jsonld', await readText('schema.jsonld'));

  assertHtml('index.html', indexHtml);
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
