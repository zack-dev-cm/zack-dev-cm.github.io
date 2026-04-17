import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');
const PUBLIC_UPDATES_PATH = path.resolve(ROOT_DIR, 'public', 'portfolio-updates.json');
const DOCS_UPDATES_PATH = path.resolve(ROOT_DIR, 'docs', 'portfolio-updates.json');

const PLACEHOLDER_PATTERNS = [/new project added from github/i, /recently launched/i, /active development/i];
const USER_METRIC_PATTERN = /\b(users?|profiles?|installs?|dau|wau|mau|retention|adoption)\b/i;
const TELEGRAM_LINK_PATTERN = /^https:\/\/t\.me\/[A-Za-z0-9_]+(?:\/(?:app|launch))?(?:\?.*)?$/;
const TELEGRAM_APP_PATTERN = /^https:\/\/t\.me\/[A-Za-z0-9_]+\/(?:app|launch)(?:\?.*)?$/;
const CHROME_WEB_STORE_PATTERN = /^https:\/\/chromewebstore\.google\.com\//;
const GITHUB_PATTERN = /^https:\/\/github\.com\/[^/]+\/[^/]+/;

const errors = [];

const fail = (message) => {
  errors.push(message);
};

const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const parseString = (node) => {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    let text = node.head.text;
    for (const span of node.templateSpans) {
      if (ts.isStringLiteral(span.expression) || ts.isNoSubstitutionTemplateLiteral(span.expression)) {
        text += span.expression.text;
      } else if (ts.isIdentifier(span.expression)) {
        text += span.expression.text;
      } else {
        text += span.expression.getText();
      }
      text += span.literal.text;
    }
    return text;
  }
  return '';
};

const parseStringArray = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map((element) => parseString(element)).filter(Boolean);
};

const parseBoolean = (node) => {
  if (!node) return undefined;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
};

const parseNumber = (node) => {
  if (!node || !ts.isNumericLiteral(node)) return undefined;
  return Number(node.text);
};

const getPropertyName = (nameNode) => {
  if (!nameNode) return '';
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode)) return nameNode.text;
  return nameNode.getText();
};

const getPropertyValue = (objectNode, key) => {
  const property = objectNode.properties.find((prop) => {
    return ts.isPropertyAssignment(prop) && getPropertyName(prop.name) === key;
  });
  if (!property || !ts.isPropertyAssignment(property)) return null;
  return property.initializer;
};

const parseLinks = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => {
      if (!ts.isObjectLiteralExpression(element)) return null;
      const text = parseString(getPropertyValue(element, 'text'));
      const url = parseString(getPropertyValue(element, 'url'));
      if (!text || !url) return null;
      return { text, url };
    })
    .filter(Boolean);
};

const parseBenchmarks = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => {
      if (!ts.isObjectLiteralExpression(element)) return null;
      const label = parseString(getPropertyValue(element, 'label'));
      const value = parseString(getPropertyValue(element, 'value'));
      const context = parseString(getPropertyValue(element, 'context'));
      if (!label || !value) return null;
      return { label, value, context };
    })
    .filter(Boolean);
};

const parseCanonicalLinks = (node) => {
  if (!node || !ts.isObjectLiteralExpression(node)) return {};
  const result = {};
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const key = getPropertyName(property.name);
    const value = parseString(property.initializer);
    if (key && value) {
      result[key] = value;
    }
  }
  return result;
};

const extractArrayLiteral = (sourceFile, variableName) => {
  let match = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === variableName) {
      if (node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        match = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!match) {
    throw new Error(`Could not find ${variableName} array in constants.ts`);
  }
  return match;
};

const extractProjects = (sourceFile) => {
  return extractArrayLiteral(sourceFile, 'PROJECTS').elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => ({
      id: parseNumber(getPropertyValue(element, 'id')),
      title: parseString(getPropertyValue(element, 'title')),
      legacySlugs: parseStringArray(getPropertyValue(element, 'legacySlugs')),
      aliases: parseStringArray(getPropertyValue(element, 'aliases')),
      description: parseString(getPropertyValue(element, 'description')),
      longDescription: parseString(getPropertyValue(element, 'longDescription')),
      projectKind: parseString(getPropertyValue(element, 'projectKind')),
      surfaceTags: parseStringArray(getPropertyValue(element, 'surfaceTags')),
      mobileReady: parseBoolean(getPropertyValue(element, 'mobileReady')),
      keyFeatures: parseStringArray(getPropertyValue(element, 'keyFeatures')),
      techStack: parseStringArray(getPropertyValue(element, 'techStack')),
      links: parseLinks(getPropertyValue(element, 'links')),
      benchmarks: parseBenchmarks(getPropertyValue(element, 'benchmarks')),
      repoFullName: parseString(getPropertyValue(element, 'repoFullName')),
      repoId: parseNumber(getPropertyValue(element, 'repoId')),
      canonicalLinks: parseCanonicalLinks(getPropertyValue(element, 'canonicalLinks')),
    }));
};

const extractLatestUpdates = (sourceFile) => {
  return extractArrayLiteral(sourceFile, 'LATEST_UPDATES').elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => ({
      title: parseString(getPropertyValue(element, 'title')),
      description: parseString(getPropertyValue(element, 'description')),
      links: parseLinks(getPropertyValue(element, 'links')),
      projectId: parseNumber(getPropertyValue(element, 'projectId')),
      repoFullName: parseString(getPropertyValue(element, 'repoFullName')),
      repoId: parseNumber(getPropertyValue(element, 'repoId')),
    }));
};

const parseGithubRepo = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return '';
    const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
    return owner && repo ? `${owner}/${repo}` : '';
  } catch {
    return '';
  }
};

const getItemRepoKey = (item) => {
  const githubLink = (item.links || []).find((link) => parseGithubRepo(link.url));
  return (
    item.repoFullName ||
    (item.repoId ? `${item.repoId}` : '') ||
    parseGithubRepo(githubLink?.url) ||
    slugify(item.title)
  );
};

const getProjectRouteSlugs = (project) => {
  return Array.from(
    new Set(
      [slugify(project.title), slugify(getItemRepoKey(project)), ...(project.legacySlugs || [])]
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean)
    )
  );
};

const hasPlaceholderText = (value) => {
  const text = (value || '').trim();
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
};

const validateUrl = (url, label) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      fail(`${label} must use https: ${url}`);
    }
  } catch {
    fail(`${label} is not a valid absolute URL: ${url}`);
  }
};

const validateLinks = (links, label) => {
  const seen = new Set();
  for (const [index, link] of links.entries()) {
    if (!link.text?.trim()) {
      fail(`${label} link #${index + 1} is missing text`);
    }
    if (!link.url?.trim()) {
      fail(`${label} link "${link.text || `#${index + 1}`}" is missing a URL`);
      continue;
    }
    validateUrl(link.url, `${label} link "${link.text}"`);
    const key = link.url.trim().toLowerCase();
    if (seen.has(key)) {
      fail(`${label} contains duplicate link URL: ${link.url}`);
    }
    seen.add(key);
  }
};

const validateProject = (project) => {
  const projectLabel = `Project #${project.id} (${project.title || 'untitled'})`;
  if (!project.id || !Number.isInteger(project.id)) {
    fail(`${projectLabel} is missing a valid numeric id`);
  }
  if (!project.title?.trim()) {
    fail(`${projectLabel} is missing a title`);
  }
  if (!project.description?.trim() || project.description.trim().split(/\s+/).length < 5) {
    fail(`${projectLabel} description is too thin`);
  }
  if (hasPlaceholderText(project.description) || hasPlaceholderText(project.longDescription)) {
    fail(`${projectLabel} still contains placeholder/slop copy`);
  }
  if ((project.keyFeatures || []).length < 1) {
    fail(`${projectLabel} must list at least one key feature`);
  }
  if ((project.techStack || []).length < 1) {
    fail(`${projectLabel} must list at least one tech stack entry`);
  }
  validateLinks(project.links || [], projectLabel);

  const aliasKeys = new Set();
  for (const alias of project.aliases || []) {
    const key = alias.trim().toLowerCase();
    if (!key) {
      fail(`${projectLabel} includes an empty alias`);
      continue;
    }
    if (aliasKeys.has(key)) {
      fail(`${projectLabel} includes duplicate alias "${alias}"`);
    }
    aliasKeys.add(key);
  }

  for (const slug of project.legacySlugs || []) {
    if (!/^[a-z0-9-]+$/.test(slug)) {
      fail(`${projectLabel} has invalid legacy slug "${slug}"`);
    }
  }

  const linkUrls = new Set((project.links || []).map((link) => link.url));
  for (const [name, url] of Object.entries(project.canonicalLinks || {})) {
    if (!url) continue;
    validateUrl(url, `${projectLabel} canonical link ${name}`);
    if (!linkUrls.has(url)) {
      fail(`${projectLabel} canonical link ${name} must also appear in links`);
    }
    if (name === 'telegramBot' && (!TELEGRAM_LINK_PATTERN.test(url) || TELEGRAM_APP_PATTERN.test(url))) {
      fail(`${projectLabel} canonical telegramBot must point to a bot/profile handle, not an app path`);
    }
    if (name === 'telegramMiniApp' && !TELEGRAM_APP_PATTERN.test(url)) {
      fail(`${projectLabel} canonical telegramMiniApp must point to a Telegram app/launch URL`);
    }
    if (name === 'telegramChannel' && (!TELEGRAM_LINK_PATTERN.test(url) || TELEGRAM_APP_PATTERN.test(url))) {
      fail(`${projectLabel} canonical telegramChannel must point to a Telegram channel/profile URL`);
    }
    if (name === 'chromeWebStore' && !CHROME_WEB_STORE_PATTERN.test(url)) {
      fail(`${projectLabel} canonical chromeWebStore must point to Chrome Web Store`);
    }
    if (name === 'github' && !GITHUB_PATTERN.test(url)) {
      fail(`${projectLabel} canonical github must point to GitHub`);
    }
  }

  if (project.projectKind === 'user-product' && (project.links || []).length === 0) {
    fail(`${projectLabel} is marked as user-product but has no public proof link`);
  }

  if ((project.surfaceTags || []).map((tag) => tag.toLowerCase()).includes('telegram')) {
    const hasTelegramLink = (project.links || []).some((link) => TELEGRAM_LINK_PATTERN.test(link.url));
    if (!hasTelegramLink) {
      fail(`${projectLabel} is tagged telegram but has no Telegram link`);
    }
  }

  for (const benchmark of project.benchmarks || []) {
    if (USER_METRIC_PATTERN.test(`${benchmark.label} ${benchmark.context || ''}`)) {
      if (!benchmark.context?.trim()) {
        fail(`${projectLabel} benchmark "${benchmark.label}" needs context/source`);
      } else if (
        !/\d/.test(benchmark.context) &&
        !/(launch|listing|snapshot|pulse|slice|reported|internal|public)/i.test(benchmark.context)
      ) {
        fail(`${projectLabel} benchmark "${benchmark.label}" context is too vague`);
      }
    }
  }
};

const validateLatestUpdate = (update, projectIds) => {
  const label = `Latest update "${update.title || 'untitled'}"`;
  if (!update.title?.trim()) {
    fail(`${label} is missing a title`);
  }
  if (hasPlaceholderText(update.description)) {
    fail(`${label} contains placeholder/slop copy`);
  }
  if ((update.links || []).length === 0) {
    fail(`${label} must have at least one public link`);
  }
  validateLinks(update.links || [], label);
  if (update.projectId && !projectIds.has(update.projectId)) {
    fail(`${label} references unknown projectId ${update.projectId}`);
  }
};

const ensureUniqueValues = (items, getValues, labelForItem, thingLabel) => {
  const seen = new Map();
  for (const item of items) {
    for (const value of getValues(item)) {
      if (!value) continue;
      const previous = seen.get(value);
      if (previous) {
        fail(`${thingLabel} "${value}" is duplicated between ${previous} and ${labelForItem(item)}`);
      } else {
        seen.set(value, labelForItem(item));
      }
    }
  }
};

const validateSyncedProject = (project) => {
  const label = `Synced project "${project.title || 'untitled'}"`;
  if (hasPlaceholderText(project.description) || hasPlaceholderText(project.longDescription)) {
    fail(`${label} still contains placeholder/slop copy`);
  }
  if ((project.keyFeatures || []).length < 2) {
    fail(`${label} needs at least two key features before deploy`);
  }
  if ((project.techStack || []).length < 2) {
    fail(`${label} needs at least two tech stack entries before deploy`);
  }
  if ((project.links || []).length === 0 && (project.benchmarks || []).length === 0) {
    fail(`${label} needs at least one public link or benchmark before deploy`);
  }
  validateLinks(project.links || [], label);
};

const validateSyncedLatestUpdate = (update, projectIds) => {
  const label = `Synced latest update "${update.title || 'untitled'}"`;
  if (hasPlaceholderText(update.description)) {
    fail(`${label} contains placeholder/slop copy`);
  }
  if ((update.links || []).length === 0) {
    fail(`${label} must keep at least one public link`);
  }
  validateLinks(update.links || [], label);
  if (update.projectId && !projectIds.has(update.projectId)) {
    fail(`${label} references unknown projectId ${update.projectId}`);
  }
};

const main = async () => {
  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const projects = extractProjects(sourceFile);
  const latestUpdates = extractLatestUpdates(sourceFile);
  const projectIds = new Set(projects.map((project) => project.id).filter(Boolean));

  ensureUniqueValues(
    projects,
    (project) => [project.id ? String(project.id) : ''],
    (project) => `project #${project.id}`,
    'Project id'
  );
  ensureUniqueValues(
    projects,
    (project) => [project.title.trim().toLowerCase()],
    (project) => `project #${project.id}`,
    'Project title'
  );
  ensureUniqueValues(
    projects,
    (project) => getProjectRouteSlugs(project),
    (project) => `project #${project.id}`,
    'Project route slug'
  );

  for (const project of projects) {
    validateProject(project);
  }

  ensureUniqueValues(
    latestUpdates,
    (update) => [getItemRepoKey(update)],
    (update) => `latest update "${update.title}"`,
    'Latest update repo key'
  );

  for (const update of latestUpdates) {
    validateLatestUpdate(update, projectIds);
  }

  const publicUpdates = JSON.parse(await fs.readFile(PUBLIC_UPDATES_PATH, 'utf8'));
  const docsUpdates = JSON.parse(await fs.readFile(DOCS_UPDATES_PATH, 'utf8'));

  if (JSON.stringify(publicUpdates) !== JSON.stringify(docsUpdates)) {
    fail('public/portfolio-updates.json and docs/portfolio-updates.json must stay identical');
  }

  if (!Array.isArray(publicUpdates.projects) || !Array.isArray(publicUpdates.latestUpdates)) {
    fail('portfolio-updates.json must expose projects[] and latestUpdates[] arrays');
  } else {
    const syncedProjectIds = new Set(
      publicUpdates.projects.map((project) => project.id).filter((id) => Number.isInteger(id))
    );
    const allProjectIds = new Set([...projectIds, ...syncedProjectIds]);

    ensureUniqueValues(
      publicUpdates.projects,
      (project) => [getItemRepoKey(project)],
      (project) => `synced project "${project.title}"`,
      'Synced project repo key'
    );
    ensureUniqueValues(
      publicUpdates.latestUpdates,
      (update) => [getItemRepoKey(update)],
      (update) => `synced latest update "${update.title}"`,
      'Synced latest repo key'
    );

    for (const project of publicUpdates.projects) {
      validateSyncedProject(project);
    }
    for (const update of publicUpdates.latestUpdates) {
      validateSyncedLatestUpdate(update, allProjectIds);
    }
  }

  if (errors.length > 0) {
    console.error('Portfolio validation failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Portfolio validation passed.');
};

await main();
