import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');
const GENERATED_PROJECTS_DIR = path.resolve(ROOT_DIR, 'projects');
const SITEMAP_PATH = path.resolve(ROOT_DIR, 'sitemap.xml');
const PUBLIC_UPDATES_PATH = path.resolve(ROOT_DIR, 'public', 'portfolio-updates.json');
const DOCS_UPDATES_PATH = path.resolve(ROOT_DIR, 'docs', 'portfolio-updates.json');

const PLACEHOLDER_PATTERNS = [/new project added from github/i, /recently launched/i, /active development/i];
const GENERIC_KEY_FEATURES = new Set(['recently launched', 'active development']);
const GENERIC_TECH_STACK = new Set(['product']);
const USER_METRIC_PATTERN = /\b(users?|profiles?|installs?|dau|wau|mau|retention|adoption)\b/i;
const TELEGRAM_LINK_PATTERN = /^https:\/\/t\.me\/[A-Za-z0-9_]+(?:\/(?:app|launch))?(?:\?.*)?$/;
const TELEGRAM_APP_PATTERN = /^https:\/\/t\.me\/[A-Za-z0-9_]+\/(?:app|launch)(?:\?.*)?$/;
const CHROME_WEB_STORE_PATTERN = /^https:\/\/chromewebstore\.google\.com\//;
const GITHUB_PATTERN = /^https:\/\/github\.com\/[^/]+\/[^/]+/;
const CLAWHUB_URL_PATTERN = /^https:\/\/clawhub\.ai\/zack-dev-cm\/[a-z0-9-]+$/;
const SITE_BASE = 'https://zack-dev-cm.github.io';
const LEGACY_PROJECT_QUERY_PATTERN = /^https:\/\/zack-dev-cm\.github\.io\/\?project=/;
const MALFORMED_PROJECT_PATH_PATTERN = /^https:\/\/zack-dev-cm\.github\.io\/projects\/\//;
const CRAWLER_SAFE_SOCIAL_IMAGE_PATTERN = /^https:\/\/zack-dev-cm\.github\.io\/docs\/.+\.(?:avif|jpe?g|png|webp)(?:[?#].*)?$/i;
const PROJECT_SOCIAL_IMAGE_PATTERN = /^https:\/\/zack-dev-cm\.github\.io\/docs\/images\/project-social\/[a-z0-9-]+\.png$/;
const CLAWHUB_MIN_EXPECTED_SKILLS = 30;
const CLAWHUB_MIN_EXPECTED_DOWNLOADS = 6000;
const MIN_PORTFOLIO_UPDATES_VERSION = 2;
const REQUIRED_SYNC_REVIEW_GATES = [
  'public-github-api-only',
  'private-repo-default-off',
  'safe-public-links-only',
  'leak-pattern-scan',
  'instruction-bleed-scan',
  'clawpatch-review-ready',
];
const REQUIRED_PORTFOLIO_STATIC_REVIEW_GATES = [
  'portfolio-static-source-backed',
  ...REQUIRED_SYNC_REVIEW_GATES.filter((gate) => gate !== 'public-github-api-only'),
];
const PUBLIC_UPDATE_BLOCK_PATTERNS = [
  ['private key block', /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/i],
  ['credentialed URL', /https?:\/\/[^/\s:@]+:[^/\s@]+@/i],
  ['N/A placeholder', /\bN\/A\b|\bn\/a\b/i],
  ['local absolute path', /(?:^|[^A-Za-z0-9_])(?:\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+)/],
  ['private URL', /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|[^/\s]+\.(?:local|internal))(?:[/:?#][^\s"'<>)]*)?/i],
  ['environment file reference', /(?:^|[\\/])\.env(?:$|[._-])/i],
  ['system prompt wording', /\b(?:system prompt|developer message|hidden instruction|private instruction|tool instruction|model instruction)\b/i],
  ['prompt injection wording', /\b(?:ignore previous instructions|ignore all previous|forget previous instructions|reveal your prompt)\b/i],
  ['private reasoning wording', /\b(?:chain[- ]of[- ]thought|hidden reasoning|scratchpad)\b/i],
  ['Codex runtime wording', /\b(?:CODEX_HOME|request_user_input|sandbox_permissions|You are Codex)\b/i],
  ['deployment secret env name', /\b(?:DEV_CM_GITHUB_TOKEN|SYNC_SECRET|CLOUDFLARE_API_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY)\b/],
];
const POSITIONING_BLOCK_PATTERNS = [
  ['Real users label', /\bReal users\b/],
  ['Extension adoption label', /\bExtension adoption\b/],
  ['Public traction label', /\bPublic traction\b/],
  ['traction validation framing', /\btraction validation\b/i],
  ['marketplace traction framing', /\bmarketplace traction\b/i],
  ['download traction framing', /\bdownload traction\b/i],
  ['competitive landscape filler', /\bcompetitive landscape\b/i],
  ['robust filler', /\brobust\b/i],
  ['showcase runs filler', /\bshowcase runs\b/i],
];
const POSITIONING_SOURCE_PATHS = [
  'README.md',
  'App.tsx',
  'constants.ts',
  'scripts/generate-project-markdown.mjs',
];

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

const extractClawHubStats = (sourceFile) => {
  return extractArrayLiteral(sourceFile, 'CLAWHUB_DOWNLOAD_STATS').elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => ({
      slug: parseString(getPropertyValue(element, 'slug')),
      displayName: parseString(getPropertyValue(element, 'displayName')),
      downloads: parseNumber(getPropertyValue(element, 'downloads')) ?? 0,
      versions: parseNumber(getPropertyValue(element, 'versions')) ?? 0,
      stars: parseNumber(getPropertyValue(element, 'stars')) ?? 0,
      url: parseString(getPropertyValue(element, 'url')),
      checkedAt: parseString(getPropertyValue(element, 'checkedAt')),
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
    if (LEGACY_PROJECT_QUERY_PATTERN.test(url)) {
      fail(`${label} must use /projects/<slug>/ instead of the legacy ?project= route: ${url}`);
    }
    if (MALFORMED_PROJECT_PATH_PATTERN.test(url)) {
      fail(`${label} contains a malformed project path: ${url}`);
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

const validatePortfolioUpdateReview = (review, label, requiredGates = REQUIRED_SYNC_REVIEW_GATES) => {
  if (!review || typeof review !== 'object') {
    fail(`${label} is missing GitHub sync review metadata`);
    return;
  }
  if (review.status !== 'PASS') {
    fail(`${label} review status must be PASS`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.checkedAt || '')) {
    fail(`${label} review checkedAt must use YYYY-MM-DD`);
  }
  if (!Number.isInteger(review.gateVersion) || review.gateVersion < MIN_PORTFOLIO_UPDATES_VERSION) {
    fail(`${label} review gateVersion must be at least ${MIN_PORTFOLIO_UPDATES_VERSION}`);
  }
  if (!Array.isArray(review.gates)) {
    fail(`${label} review gates must be an array`);
    return;
  }
  for (const gate of requiredGates) {
    if (!review.gates.includes(gate)) {
      fail(`${label} review gates must include ${gate}`);
    }
  }
};

const requiredPortfolioUpdateGates = (item) =>
  item?.source === 'portfolio-static' ? REQUIRED_PORTFOLIO_STATIC_REVIEW_GATES : REQUIRED_SYNC_REVIEW_GATES;

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
  if ((project.keyFeatures || []).some((feature) => GENERIC_KEY_FEATURES.has(feature.trim().toLowerCase()))) {
    fail(`${projectLabel} still contains generic key-feature filler`);
  }
  if ((project.techStack || []).some((entry) => GENERIC_TECH_STACK.has(entry.trim().toLowerCase()))) {
    fail(`${projectLabel} still contains generic tech-stack filler`);
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

  const hasCanonicalPublicSurface = Object.values(project.canonicalLinks || {}).some((url) => Boolean(url?.trim()));

  if (project.projectKind === 'user-product' && (project.links || []).length === 0) {
    fail(`${projectLabel} is marked as user-product but has no public surface link`);
  }

  if (project.projectKind === 'user-product' && !hasCanonicalPublicSurface) {
    fail(`${projectLabel} is marked as user-product but is missing canonical public surface links`);
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
        !/(launch|listing|snapshot|reported|public|source review|case study)/i.test(benchmark.context)
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

const validateClawHubStats = (stats) => {
  const totalDownloads = stats.reduce((sum, stat) => sum + stat.downloads, 0);
  const seenSlugs = new Set();

  if (stats.length < CLAWHUB_MIN_EXPECTED_SKILLS) {
    fail(`CLAWHUB_DOWNLOAD_STATS must include at least ${CLAWHUB_MIN_EXPECTED_SKILLS} public skills`);
  }

  if (totalDownloads < CLAWHUB_MIN_EXPECTED_DOWNLOADS) {
    fail(`CLAWHUB_DOWNLOAD_STATS total downloads must be at least ${CLAWHUB_MIN_EXPECTED_DOWNLOADS}`);
  }

  for (const [index, stat] of stats.entries()) {
    const label = `CLAWHUB_DOWNLOAD_STATS entry "${stat.slug || `#${index + 1}`}"`;

    if (!/^[a-z0-9-]+$/.test(stat.slug)) {
      fail(`${label} has an invalid slug`);
    }
    if (!stat.displayName?.trim()) {
      fail(`${label} is missing displayName`);
    }
    if (seenSlugs.has(stat.slug)) {
      fail(`${label} duplicates slug ${stat.slug}`);
    }
    seenSlugs.add(stat.slug);
    if (!Number.isInteger(stat.downloads) || stat.downloads < 0) {
      fail(`${label} has invalid downloads`);
    }
    if (!Number.isInteger(stat.versions) || stat.versions < 1) {
      fail(`${label} has invalid versions`);
    }
    if (!Number.isInteger(stat.stars) || stat.stars < 0) {
      fail(`${label} has invalid stars`);
    }
    if (!CLAWHUB_URL_PATTERN.test(stat.url) || !stat.url.endsWith(`/${stat.slug}`)) {
      fail(`${label} must point to its zack-dev-cm ClawHub listing`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(stat.checkedAt)) {
      fail(`${label} must use YYYY-MM-DD checkedAt`);
    }
    if (index > 0 && stat.downloads > stats[index - 1].downloads) {
      fail(`${label} must be sorted by descending downloads`);
    }
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
  validatePortfolioUpdateReview(project.review, label, requiredPortfolioUpdateGates(project));
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
  validatePortfolioUpdateReview(update.review, label, requiredPortfolioUpdateGates(update));
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

const validatePositioningCopy = async () => {
  for (const relativePath of POSITIONING_SOURCE_PATHS) {
    const content = await fs.readFile(path.resolve(ROOT_DIR, relativePath), 'utf8');
    for (const [label, pattern] of POSITIONING_BLOCK_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(content)) {
        fail(`${relativePath} contains risky positioning copy: ${label}`);
      }
    }
  }
};

const assertGeneratedSocialImageAsset = async (url, label) => {
  if (!CRAWLER_SAFE_SOCIAL_IMAGE_PATTERN.test(url)) {
    fail(`${label} must use a crawler-safe PNG/JPEG/WebP/AVIF image under /docs/: ${url}`);
    return;
  }
  const publicRelativePath = url.slice(`${SITE_BASE}/docs/`.length);
  try {
    await fs.access(path.resolve(ROOT_DIR, 'public', publicRelativePath));
  } catch {
    fail(`${label} points to a missing public asset: ${url}`);
  }
};

const validateSitemapProjectCoverage = async (projectSlugs) => {
  let sitemap = '';
  try {
    sitemap = await fs.readFile(SITEMAP_PATH, 'utf8');
  } catch {
    fail('sitemap.xml is missing; run node scripts/generate-project-markdown.mjs');
    return;
  }

  if (sitemap.includes(`${SITE_BASE}/?project=`)) {
    fail('sitemap.xml contains a legacy ?project= URL');
  }
  if (sitemap.includes(`${SITE_BASE}/projects//`)) {
    fail('sitemap.xml contains a malformed /projects// URL');
  }

  for (const slug of projectSlugs) {
    const loc = `<loc>${SITE_BASE}/projects/${slug}/</loc>`;
    if (!sitemap.includes(loc)) {
      fail(`sitemap.xml is missing generated project page ${SITE_BASE}/projects/${slug}/`);
    }
  }
};

const validateGeneratedProjectPages = async () => {
  let entries = [];
  try {
    entries = await fs.readdir(GENERATED_PROJECTS_DIR, { withFileTypes: true });
  } catch {
    fail('projects/ generated directory is missing; run node scripts/generate-project-markdown.mjs');
    return;
  }

  const projectSlugs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const canonicalSlugs = [];
  const pagePaths = projectSlugs.map((slug) => path.resolve(GENERATED_PROJECTS_DIR, slug, 'index.html'));

  if (pagePaths.length === 0) {
    fail('projects/ contains no generated project index.html pages');
    return;
  }

  for (const pagePath of pagePaths) {
    let html = '';
    try {
      html = await fs.readFile(pagePath, 'utf8');
    } catch {
      fail(`${path.relative(ROOT_DIR, pagePath)} is missing`);
      continue;
    }

    const relativePage = path.relative(ROOT_DIR, pagePath);
    const redirect = html.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/i)?.[1];
    if (redirect) {
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      const targetSlug = redirect.match(/^https:\/\/zack-dev-cm\.github\.io\/projects\/([a-z0-9-]+)\/$/)?.[1];
      if (!targetSlug || canonical !== redirect || !projectSlugs.includes(targetSlug) || path.basename(path.dirname(pagePath)) === targetSlug) {
        fail(`${relativePage} has an invalid canonical redirect`);
      }
      continue;
    }
    canonicalSlugs.push(path.basename(path.dirname(pagePath)));
    if (LEGACY_PROJECT_QUERY_PATTERN.test(html) || html.includes(`${SITE_BASE}/?project=`)) {
      fail(`${relativePage} contains a legacy ?project= URL`);
    }
    if (MALFORMED_PROJECT_PATH_PATTERN.test(html) || html.includes(`${SITE_BASE}/projects//`)) {
      fail(`${relativePage} contains a malformed /projects// URL`);
    }

    const ogImage = html.match(/<meta property="og:image" content="([^"]+)" \/>/)?.[1] || '';
    const ogImageType = html.match(/<meta property="og:image:type" content="([^"]+)" \/>/)?.[1] || '';
    const ogImageWidth = html.match(/<meta property="og:image:width" content="([^"]+)" \/>/)?.[1] || '';
    const ogImageHeight = html.match(/<meta property="og:image:height" content="([^"]+)" \/>/)?.[1] || '';
    const twitterImage = html.match(/<meta name="twitter:image" content="([^"]+)" \/>/)?.[1] || '';

    if (!ogImage) {
      fail(`${relativePage} is missing og:image`);
    } else {
      await assertGeneratedSocialImageAsset(ogImage, `${relativePage} og:image`);
    }
    if (!ogImageType) {
      fail(`${relativePage} is missing og:image:type`);
    }
    if (PROJECT_SOCIAL_IMAGE_PATTERN.test(ogImage)) {
      if (ogImageType !== 'image/png') {
        fail(`${relativePage} generated project social card must declare image/png`);
      }
      if (ogImageWidth !== '1200' || ogImageHeight !== '630') {
        fail(`${relativePage} generated project social card must declare 1200x630 dimensions`);
      }
    }

    if (!twitterImage) {
      fail(`${relativePage} is missing twitter:image`);
    } else {
      await assertGeneratedSocialImageAsset(twitterImage, `${relativePage} twitter:image`);
    }
  }

  await validateSitemapProjectCoverage(canonicalSlugs);
};

const main = async () => {
  await validatePositioningCopy();

  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const projects = extractProjects(sourceFile);
  const latestUpdates = extractLatestUpdates(sourceFile);
  const clawHubStats = extractClawHubStats(sourceFile);
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

  validateClawHubStats(clawHubStats);

  const publicUpdates = JSON.parse(await fs.readFile(PUBLIC_UPDATES_PATH, 'utf8'));
  const docsUpdates = JSON.parse(await fs.readFile(DOCS_UPDATES_PATH, 'utf8'));

  if (JSON.stringify(publicUpdates) !== JSON.stringify(docsUpdates)) {
    fail('public/portfolio-updates.json and docs/portfolio-updates.json must stay identical');
  }

  if (!Number.isInteger(publicUpdates.version) || publicUpdates.version < MIN_PORTFOLIO_UPDATES_VERSION) {
    fail(`portfolio-updates.json version must be at least ${MIN_PORTFOLIO_UPDATES_VERSION}`);
  }

  validatePortfolioUpdateReview(publicUpdates.review, 'portfolio-updates.json top-level review');

  const publicUpdatesSerialized = JSON.stringify(publicUpdates);
  for (const [label, pattern] of PUBLIC_UPDATE_BLOCK_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(publicUpdatesSerialized)) {
      fail(`portfolio-updates.json contains ${label}`);
    }
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

  await validateGeneratedProjectPages();

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
