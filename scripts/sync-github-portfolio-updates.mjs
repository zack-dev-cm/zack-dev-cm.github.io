import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { mergeProjects, selectReviewedFeedProjects } from '../utils/project-catalog.mjs';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_OWNER = 'zack-dev-cm';
const DEFAULT_LOOKBACK_DAYS = Number(process.env.NEW_REPO_LOOKBACK_DAYS || 90);
const DEFAULT_PROMOTION_DAYS = Number(process.env.PROJECT_PROMOTION_DAYS || 0);
const DEFAULT_MAX_REPOS = Number(process.env.GITHUB_SYNC_MAX_REPOS || 20);
const PUBLIC_UPDATES_PATH = 'public/portfolio-updates.json';
const DOCS_UPDATES_PATH = 'docs/portfolio-updates.json';
const PLACEHOLDER_IMAGE = 'images/project-placeholder.svg';
const REVIEW_GATE_VERSION = 2;
const REVIEW_GATES = [
  'public-github-api-only',
  'private-repo-default-off',
  'safe-public-links-only',
  'readme-code-blocks-stripped',
  'leak-pattern-scan',
  'instruction-bleed-scan',
  'clawhub-stat-crosslink',
  'clawpatch-review-ready',
];
const PORTFOLIO_STATIC_REVIEW_GATES = [
  'portfolio-static-source-backed',
  ...REVIEW_GATES.filter((gate) => gate !== 'public-github-api-only'),
];
const CLEARML_DERMASELF_PROJECT_ID = 80;
const CLEARML_DERMASELF_SLUG = 'clearml-experiment-tracking-for-dermaself';
const CLEARML_DERMASELF_TITLE = 'ClearML Experiment Tracking for Dermaself';
const CLEARML_DERMASELF_IMAGE = 'images/clearml-dermaself-experiment-tracking-card.png';
const AGNITRA_AI_PROJECT_ID = 81;
const AGNITRA_AI_SLUG = 'agnitra-ai-inference-optimizer';

const BLOCKED_TEXT_PATTERNS = [
  ['private key block', /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/i],
  ['OpenAI API key', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{30,}\b/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['Slack token', /\bxox[baprs]-[0-9A-Za-z-]{20,}\b/],
  ['credentialed URL', /https?:\/\/[^/\s:@]+:[^/\s@]+@/i],
  ['literal bearer token', /\bBearer\s+[A-Za-z0-9._-]{24,}\b/i],
  ['assigned secret literal', /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*['"]?(?!process\.env\b|import\.meta\.env\b)[A-Za-z0-9._~+/=-]{16,}['"]?/i],
  ['internal analytics wording', /\b(?:internal snapshot|prod pulse|DB slice|Profiles in DB|Sessions in DB|DAU\s*\/\s*WAU\s*\/\s*MAU)\b/i],
  ['client-facing process wording', /\b(?:internal process|client-facing claim|should not appear|do not leak|local Mac (?:project )?scan|local Mac repo history reviewed before portfolio add)\b/i],
  ['local source review wording', /\b(?:local source (?:README|review)|documented in local source)\b/i],
  ['private repo/path disclaimer wording', /\b(?:private[-\s]workflow case study|private (?:repo|repository) (?:link|url)s?|private repo link is intentionally omitted|does not publish the private repo URL|omitting private repository links|local source paths?|local artifact paths?)\b/i],
  ['client-data redaction wording', /\b(?:redacts? the client name|client identity.*removed|schema details|endpoint specifics|patient-identifying data)\b/i],
  ['unaudited metric claim wording', /\b(?:>\s*90%\s+accuracy|operator-reported public total|rounded public product snapshot|rounded public launch comparison|publish-ready)\b/i],
  ['Google Drive private link', /https:\/\/drive\.google\.com\/file\/d\//i],
  ['non-public Google Drive or Colab URL', /https?:\/\/(?:drive\.google\.com\/|docs\.google\.com\/|colab\.research\.google\.com\/drive\/)/i],
  ['local absolute path', /(?:^|[^A-Za-z0-9_])(?:\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+)/],
  ['private URL', /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|[^/\s]+\.(?:local|internal))(?:[/:?#][^\s"'<>)]*)?/i],
  ['environment file reference', /(?:^|[\\/])\.env(?:$|[._-])/i],
  ['system prompt wording', /\b(?:system prompt|developer message|hidden instruction|private instruction|tool instruction|model instruction)\b/i],
  ['prompt injection wording', /\b(?:ignore previous instructions|ignore all previous|forget previous instructions|reveal your prompt)\b/i],
  ['private reasoning wording', /\b(?:chain[- ]of[- ]thought|hidden reasoning|scratchpad)\b/i],
  ['Codex runtime wording', /\b(?:CODEX_HOME|request_user_input|sandbox_permissions|You are Codex)\b/i],
  ['deployment secret env name', /\b(?:DEV_CM_GITHUB_TOKEN|SYNC_SECRET|CLOUDFLARE_API_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY)\b/],
];

const parseArgs = (argv) => {
  const options = {
    owner: DEFAULT_OWNER,
    lookbackDays: DEFAULT_LOOKBACK_DAYS,
    promoteDays: DEFAULT_PROMOTION_DAYS,
    maxRepos: DEFAULT_MAX_REPOS,
    write: false,
    verify: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      options.write = true;
    } else if (arg === '--verify') {
      options.verify = true;
    } else if (arg === '--owner') {
      options.owner = argv[index + 1] || DEFAULT_OWNER;
      index += 1;
    } else if (arg.startsWith('--owner=')) {
      options.owner = arg.slice('--owner='.length);
    } else if (arg === '--lookback-days') {
      options.lookbackDays = Number(argv[index + 1] || DEFAULT_LOOKBACK_DAYS);
      index += 1;
    } else if (arg.startsWith('--lookback-days=')) {
      options.lookbackDays = Number(arg.slice('--lookback-days='.length));
    } else if (arg === '--promote-days') {
      options.promoteDays = Number(argv[index + 1] || DEFAULT_PROMOTION_DAYS);
      index += 1;
    } else if (arg.startsWith('--promote-days=')) {
      options.promoteDays = Number(arg.slice('--promote-days='.length));
    } else if (arg === '--max-repos') {
      options.maxRepos = Number(argv[index + 1] || DEFAULT_MAX_REPOS);
      index += 1;
    } else if (arg.startsWith('--max-repos=')) {
      options.maxRepos = Number(arg.slice('--max-repos='.length));
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!Number.isFinite(options.lookbackDays) || options.lookbackDays < 0) {
    throw new Error('--lookback-days must be a non-negative number');
  }
  if (!Number.isFinite(options.promoteDays) || options.promoteDays < 0) {
    throw new Error('--promote-days must be a non-negative number');
  }
  if (!Number.isFinite(options.maxRepos) || options.maxRepos < 1) {
    throw new Error('--max-repos must be a positive number');
  }

  return options;
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toAscii = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const trimSentence = (value, maxLength = 220) => {
  const clean = toAscii(value).replace(/\s+([.,;:!?])/g, '$1');
  if (clean.length <= maxLength) return clean.replace(/[,:;]+$/, '.');
  const clipped = clean.slice(0, maxLength).replace(/\s+\S*$/, '');
  return `${clipped.replace(/[.,;:!?]+$/, '')}.`;
};

const POSITIONING_TEXT_REWRITES = [
  [/\bBrowser Proof\b/g, 'Browser QA Report Pack'],
  [/\bGitHub Proof Tracker\b/g, 'GitHub Signal Tracker'],
  [/\bProof Card Forge\b/g, 'Signal Card Forge'],
  [/\bproof pack\b/gi, 'validation pack'],
  [/\bproof card\b/gi, 'metrics card'],
  [/\bevidence pack\b/gi, 'validation pack'],
  [/\bevidence-backed\b/gi, 'artifact-backed'],
  [/\bevidence\b/gi, 'references'],
  [/\bproof\b/gi, 'signal'],
  [/\bproves\b/gi, 'validates'],
  [/\bprove\b/gi, 'validate']
];

const normalizePositioningText = (value) => {
  let output = String(value || '');
  for (const [pattern, replacement] of POSITIONING_TEXT_REWRITES) {
    output = output.replace(pattern, replacement);
  }
  return output;
};

const normalizeTopicTag = (topic) => slugify(normalizePositioningText(topic));

const isPrivateHostname = (hostname) => {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return true;
  if (
    normalized === 'localhost' ||
    normalized === '0.0.0.0' ||
    normalized === '::1' ||
    normalized.endsWith('.local')
  ) {
    return true;
  }
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(normalized)) {
    const octets = normalized.split('.').map((part) => Number(part));
    if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) return true;
    if (octets[0] === 10 || octets[0] === 127) return true;
    if (octets[0] === 169 && octets[1] === 254) return true;
    if (octets[0] === 192 && octets[1] === 168) return true;
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  }
  return false;
};

const isSafePublicUrl = (value) => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    return !isPrivateHostname(parsed.hostname);
  } catch {
    return false;
  }
};

const scanBlockedText = (label, value) => {
  const text = String(value || '');
  const matches = [];
  for (const [kind, pattern] of BLOCKED_TEXT_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) matches.push(`${label} contains ${kind}`);
  }
  return matches;
};

const publicTextOrFallback = (value, fallback, label, cleanupNotes) => {
  const clean = normalizePositioningText(trimSentence(value));
  const reasons = scanBlockedText(label, clean);
  if (clean && reasons.length === 0) return clean;
  if (reasons.length > 0) cleanupNotes.push(...reasons);
  return normalizePositioningText(fallback);
};

const createReview = (checkedAt, gates = REVIEW_GATES) => ({
  status: 'PASS',
  checkedAt,
  gateVersion: REVIEW_GATE_VERSION,
  gates,
});

const headers = (requestUrl) => {
  const destination = new URL(requestUrl);
  const canAttachToken = destination.hostname === 'api.github.com';
  return {
    accept: 'application/vnd.github+json',
    'user-agent': 'portfolio-local-github-sync',
    ...(canAttachToken && process.env.DEV_CM_GITHUB_TOKEN ? { authorization: `Bearer ${process.env.DEV_CM_GITHUB_TOKEN}` } : {}),
  };
};

const githubJson = async (pathName, accept = 'application/vnd.github+json') => {
  const requestUrl = `${GITHUB_API_BASE}${pathName}`;
  const response = await fetch(requestUrl, {
    headers: { ...headers(requestUrl), accept },
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed with HTTP ${response.status}: ${pathName}`);
  }
  if (accept === 'application/vnd.github.raw') {
    return response.text();
  }
  return response.json();
};

const listRepos = async (owner) => {
  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const data = await githubJson(`/users/${encodeURIComponent(owner)}/repos?type=owner&per_page=100&sort=pushed&direction=desc&page=${page}`);
    if (!Array.isArray(data) || data.length === 0) break;
    repos.push(...data);
    if (data.length < 100) break;
  }
  return repos;
};

const getRepoActivityAt = (repo) => repo.pushed_at || repo.updated_at || repo.created_at;

const fetchReadmeText = async (owner, repo) => {
  try {
    return await githubJson(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, 'application/vnd.github.raw');
  } catch {
    return '';
  }
};

const buildTitle = (name) =>
  normalizePositioningText(
    name
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\bAi\b/g, 'AI')
      .replace(/\bApi\b/g, 'API')
      .replace(/\bClawhub\b/g, 'ClawHub')
      .replace(/\bGithub\b/g, 'GitHub')
      .replace(/\bCv\b/g, 'CV')
      .replace(/\bOcr\b/g, 'OCR')
      .replace(/\bOpenclaw\b/g, 'OpenClaw')
      .replace(/\bPptx\b/g, 'PPTX')
      .replace(/\bTma\b/g, 'TMA')
  );

const stripMarkdown = (value) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_~>#]+/g, ' ');

const extractReadmeSummary = (readme) => {
  const stripped = stripMarkdown(readme)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (stripped.length > 1 && stripped[0].split(/\s+/).length <= 8) {
    stripped.shift();
  }
  const paragraphs = [];
  let current = [];
  for (const line of stripped) {
    if (/^(quick start|install|usage|license|table of contents|what it does|features|architecture)$/i.test(line)) break;
    current.push(line);
    if (current.join(' ').split(/\s+/).length >= 10) {
      paragraphs.push(current.join(' '));
      current = [];
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return trimSentence(paragraphs.find((paragraph) => paragraph.split(/\s+/).length >= 5) || '');
};

const topicLabel = (topic) =>
  normalizePositioningText(topic)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bClawhub\b/g, 'ClawHub')
    .replace(/\bGithub\b/g, 'GitHub')
    .replace(/\bOpenclaw\b/g, 'OpenClaw');

const buildTechStack = (repo) => {
  const stack = [];
  if (repo.language) stack.push(repo.language);
  for (const topic of repo.topics || []) {
    const label = topicLabel(topic);
    if (!stack.some((item) => item.toLowerCase() === label.toLowerCase())) stack.push(label);
  }
  stack.push('GitHub');
  stack.push('Open Source');
  return Array.from(new Set(stack)).slice(0, 8);
};

const buildFeatures = (repo, checkedAt, readme, clawHubStat) => {
  const features = [
    'Public GitHub repository with README-backed source references',
    `Public GitHub API snapshot captured on ${checkedAt}`,
  ];
  if (repo.language) features.push(`${repo.language} code surface is visible in repository metadata`);
  if ((repo.topics || []).length) {
    features.push(`Repository topics include ${(repo.topics || []).slice(0, 4).map(topicLabel).join(', ')}`);
  }
  if (isSafePublicUrl(repo.homepage)) features.push('Public homepage or listing is linked from repository metadata');
  if (/clawhub|openclaw|codex/i.test(`${repo.description || ''} ${readme}`)) {
    features.push('OpenClaw, ClawHub, or Codex workflow scope is explicit in the public source');
  }
  if (clawHubStat) {
    features.push(`ClawHub listing cross-checked with ${clawHubStat.downloads.toLocaleString('en-US')} downloads as of ${clawHubStat.checkedAt}`);
  }
  return Array.from(new Set(features)).slice(0, 6);
};

const buildLinks = (repo, clawHubStat) => {
  const links = [{ text: 'GitHub', url: repo.html_url }];
  if (clawHubStat?.url && isSafePublicUrl(clawHubStat.url)) {
    links.push({ text: 'ClawHub', url: clawHubStat.url });
  }
  if (repo.homepage && isSafePublicUrl(repo.homepage) && repo.homepage !== repo.html_url) {
    links.push({ text: 'Public homepage', url: repo.homepage });
  }
  const seenUrls = new Set();
  return links.filter((link) => {
    const key = link.url.trim().toLowerCase();
    if (seenUrls.has(key)) return false;
    seenUrls.add(key);
    return true;
  });
};

const buildBenchmarks = (repo, checkedAt, clawHubStat) => {
  const benchmarks = [
    { label: 'GitHub stars', value: String(repo.stargazers_count || 0), context: `public GitHub API snapshot, ${checkedAt}` },
    { label: 'GitHub forks', value: String(repo.forks_count || 0), context: `public GitHub API snapshot, ${checkedAt}` },
    { label: 'Created', value: repo.created_at.slice(0, 10), context: 'public GitHub repository metadata' },
    { label: 'Last push', value: getRepoActivityAt(repo).slice(0, 10), context: 'public GitHub repository metadata' },
  ];
  if (clawHubStat) {
    benchmarks.push(
      { label: 'ClawHub downloads', value: String(clawHubStat.downloads), context: `public ClawHub listing, ${clawHubStat.checkedAt}` },
      { label: 'ClawHub versions', value: String(clawHubStat.versions), context: `public ClawHub listing, ${clawHubStat.checkedAt}` },
    );
  }
  return benchmarks;
};

const buildNameOnlyEntries = (repo, checkedAt, shouldPromote, clawHubStat) => {
  if (repo.full_name !== `${DEFAULT_OWNER}/hh-openclaw-agent`) return null;

  const review = createReview(checkedAt);
  const title = 'HH OpenClaw Agent';
  const description = 'HH OpenClaw Agent skill entry retained by name only.';
  const links = buildLinks(repo, clawHubStat);
  const common = {
    repoFullName: repo.full_name,
    repoId: repo.id,
    createdAt: getRepoActivityAt(repo),
    review,
  };
  const latestEntry = {
    title,
    description,
    links,
    ...common,
  };

  if (!shouldPromote) return { latestEntry, projectEntry: null, cleanupNotes: [] };

  const benchmarks = [
    { label: 'GitHub stars', value: String(repo.stargazers_count || 0), context: `public GitHub API snapshot, ${checkedAt}` },
    { label: 'GitHub forks', value: String(repo.forks_count || 0), context: `public GitHub API snapshot, ${checkedAt}` },
    { label: 'Public posture', value: 'name-only', context: 'portfolio copy intentionally keeps only the skill name' },
  ];
  if (clawHubStat) {
    benchmarks.push(
      { label: 'ClawHub downloads', value: String(clawHubStat.downloads), context: `public ClawHub listing, ${clawHubStat.checkedAt}` },
      { label: 'ClawHub versions', value: String(clawHubStat.versions), context: `public ClawHub listing, ${clawHubStat.checkedAt}` },
    );
  }

  return {
    latestEntry: { ...latestEntry, projectId: repo.id },
    projectEntry: {
      id: repo.id,
      title,
      description,
      longDescription: `${description} Synced metadata is kept only for public source continuity.`,
      projectKind: 'open-source',
      surfaceTags: ['open-source', 'openclaw'],
      mobileReady: false,
      keyFeatures: ['Skill name retained only', 'Public listing links retained for source continuity'],
      techStack: ['Python', 'OpenClaw Skills'],
      links,
      images: [{ url: PLACEHOLDER_IMAGE, alt: `${title} preview` }],
      thumbnail: PLACEHOLDER_IMAGE,
      benchmarks,
      canonicalLinks: { github: repo.html_url, ...(clawHubStat?.url ? { website: clawHubStat.url } : {}) },
      ...common,
    },
    cleanupNotes: [],
  };
};

// Read literals, never evaluate portfolio TypeScript. Unsupported expressions fail
// rather than restoring a retired fallback image or a second copy of the claims.
export const readCuratedAgnitra = (source) => {
  const file = ts.createSourceFile('constants.ts', source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const property = (node, name) => node.properties.find((item) => ts.isPropertyAssignment(item)
    && (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) && item.name.text === name)?.initializer;
  const literal = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
    if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((item) => {
      if (!ts.isPropertyAssignment(item) || !(ts.isIdentifier(item.name) || ts.isStringLiteral(item.name))) {
        throw new Error('Agnitra source must use literal properties');
      }
      return [item.name.text, literal(item.initializer)];
    }));
    throw new Error('Agnitra source must use literal values');
  };
  let result;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(file) === 'PROJECTS'
      && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      const record = node.initializer.elements.find((item) => ts.isObjectLiteralExpression(item)
        && property(item, 'id')?.getText(file) === String(AGNITRA_AI_PROJECT_ID));
      if (record) result = literal(record);
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  if (!result?.images?.length || !result.thumbnail) throw new Error('Curated Agnitra media is missing');
  const mediaPath = (value) => value.replace(/^\/?docs\//, '');
  return { ...result, images: result.images.map((image) => ({ ...image, url: mediaPath(image.url) })), thumbnail: mediaPath(result.thumbnail) };
};

export const addPortfolioCaseStudyEntries = (updates, checkedAt, agnitra) => {
  if (agnitra?.id !== AGNITRA_AI_PROJECT_ID) throw new Error('The curated Agnitra record is required');
  const review = createReview(checkedAt, PORTFOLIO_STATIC_REVIEW_GATES);
  const staticEntries = [
    {
      ...agnitra,
      slug: AGNITRA_AI_SLUG,
      latestDescription: agnitra.description,
    },
    {
      id: CLEARML_DERMASELF_PROJECT_ID,
      slug: CLEARML_DERMASELF_SLUG,
      title: CLEARML_DERMASELF_TITLE,
      latestDescription:
        'Added Dermaself MLOps case study: ClearML experiment tracking for skin-analysis model runs, dataset hygiene, metric review, and promotion gates.',
      description:
        'MLOps case study for setting up ClearML tracking around Dermaself skin-analysis experiments, run metrics, and promotion gates.',
      longDescription:
        'ClearML Experiment Tracking for Dermaself captures the MLOps layer behind the Dermaself skin-analysis work. The public entry focuses on ClearML-backed experiment tracking for model runs, dataset and parameter hygiene, metric review, artifact boundaries, and promotion decisions. Raw skin images, datasets, model weights, ClearML server URLs, and user-level records are outside the public feed.',
      projectKind: 'case-study',
      surfaceTags: ['computer-vision', 'mlops', 'experiment-tracking', 'clearml', 'health-ai'],
      mobileReady: false,
      keyFeatures: [
        'Sets up ClearML experiment tracking for Dermaself model runs without exposing workspaces',
        'Keeps datasets, parameters, metrics, artifacts, and promotion decisions reviewable across CV iterations',
        'Separates debug experiment notes from release-ready mobile and server claims',
        'Keeps sensitive image, dataset, model, and workspace details out of public portfolio files',
      ],
      techStack: ['ClearML', 'Python', 'PyTorch', 'ONNX', 'TFLite', 'Flutter', 'Computer Vision', 'MLOps'],
      image: {
        url: CLEARML_DERMASELF_IMAGE,
        alt: 'Public-safe MLOps card showing Dermaself ClearML experiment tracking, metrics, artifacts, and review gates',
      },
      benchmarks: [
        { label: 'Tracking stack', value: 'ClearML', context: 'Dermaself MLOps setup added to public portfolio scope, 2026-06-09' },
        { label: 'Tracked surfaces', value: '5', context: 'dataset, parameters, metrics, artifacts, and promotion decisions' },
        { label: 'Public posture', value: 'sanitized', context: 'public case study excludes sensitive images, datasets, model weights, workspace URLs, and records' },
        { label: 'Promotion boundary', value: 'review-gated', context: 'debug experiments stay separate from release-ready mobile/server claims' },
      ],
      createdAt: '2026-06-09',
    },
  ];

  for (const item of [...staticEntries].reverse()) {
    const caseStudyUrl = `https://zack-dev-cm.github.io/projects/${item.slug}.md`;
    const appUrl = `https://zack-dev-cm.github.io/projects/${item.slug}/`;
    const links = item.links || [
      { text: 'Open case study', url: appUrl },
      { text: 'Read Markdown case study', url: caseStudyUrl },
    ];
    const common = {
      source: 'portfolio-static',
      sourceId: item.slug,
      createdAt: item.createdAt,
      review,
    };

    updates.latestUpdates.unshift({
      title: item.title,
      description: item.latestDescription,
      links,
      projectId: item.id,
      ...common,
    });

    const { slug, latestDescription, image, canonicalWebsite, ...projectFields } = item;
    updates.projects.unshift({
      ...projectFields,
      links,
      images: item.images || [image],
      thumbnail: item.thumbnail || image.url,
      canonicalLinks: item.canonicalLinks || { website: canonicalWebsite || caseStudyUrl },
      ...common,
    });
  }
};

const getStaticExclusions = async (owner) => {
  const source = await fs.readFile('constants.ts', 'utf8');
  const repoKeys = new Set([`${owner}/zack-dev-cm.github.io`, `${owner}/${owner}`]);
  const clawHubStatsBySlug = new Map();

  const exclusionsMatch = source.match(/export const PORTFOLIO_UPDATE_REPO_EXCLUSIONS:[\s\S]*?=\s*\[([\s\S]*?)\];/);
  if (exclusionsMatch) {
    for (const match of exclusionsMatch[1].matchAll(/["']([^"']+\/[^"']+)["']/g)) {
      repoKeys.add(match[1]);
    }
  }

  for (const match of source.matchAll(/slug:\s*["']([^"']+)["'][\s\S]*?displayName:\s*["']([^"']+)["'][\s\S]*?downloads:\s*(\d+)[\s\S]*?versions:\s*(\d+)[\s\S]*?stars:\s*(\d+)[\s\S]*?url:\s*["']([^"']+)["'][\s\S]*?checkedAt:\s*["']([^"']+)["']/g)) {
    clawHubStatsBySlug.set(match[1], {
      slug: match[1],
      displayName: match[2],
      downloads: Number(match[3]),
      versions: Number(match[4]),
      stars: Number(match[5]),
      url: match[6],
      checkedAt: match[7],
    });
  }

  return { repoKeys, clawHubStatsBySlug, agnitra: readCuratedAgnitra(source) };
};

// The recent-activity window is for news, not a deletion policy for published
// project routes. Retained records keep their original activity/review dates.
export const preserveReviewedProjectArchive = (updates, previous, excludedRepos = []) => ({
  ...updates,
  projects: mergeProjects(updates.projects, selectReviewedFeedProjects(previous, excludedRepos)),
});

const buildEntries = async (repo, checkedAt, shouldPromote, clawHubStat) => {
  const nameOnlyEntries = buildNameOnlyEntries(repo, checkedAt, shouldPromote, clawHubStat);
  if (nameOnlyEntries) return nameOnlyEntries;

  const readme = await fetchReadmeText(repo.owner.login, repo.name);
  const title = buildTitle(repo.name);
  const cleanupNotes = [];
  const fallbackDescription = `Public GitHub repository for ${title} with reviewable source, README references, and repository metadata.`;
  const description = publicTextOrFallback(
    repo.description || extractReadmeSummary(readme) || fallbackDescription,
    fallbackDescription,
    `${repo.full_name} description`,
    cleanupNotes
  );
  const review = createReview(checkedAt);
  const common = {
    repoFullName: repo.full_name,
    repoId: repo.id,
    createdAt: getRepoActivityAt(repo),
    review,
  };
  const latestEntry = {
    title,
    description,
    links: buildLinks(repo, clawHubStat),
    ...common,
  };

  if (!shouldPromote) return { latestEntry, projectEntry: null, cleanupNotes };

  const projectEntry = {
    id: repo.id,
    title,
    description,
    longDescription: `${description} This synced portfolio card is limited to public GitHub metadata, public README text, repository topics, language, stars, forks, timestamps${clawHubStat ? ', and matched ClawHub public listing data' : ''} checked on ${checkedAt}.`,
    projectKind: 'open-source',
    surfaceTags: Array.from(new Set(['open-source', ...(repo.topics || []).map(normalizeTopicTag)])).slice(0, 8),
    mobileReady: /(mobile|android|ios|telegram|tma|pwa)/i.test(`${repo.name} ${(repo.topics || []).join(' ')}`),
    keyFeatures: buildFeatures(repo, checkedAt, readme, clawHubStat),
    techStack: buildTechStack(repo),
    links: buildLinks(repo, clawHubStat),
    images: [{ url: PLACEHOLDER_IMAGE, alt: `${title} preview` }],
    thumbnail: PLACEHOLDER_IMAGE,
    benchmarks: buildBenchmarks(repo, checkedAt, clawHubStat),
    canonicalLinks: { github: repo.html_url },
    ...common,
  };

  if (repo.homepage && isSafePublicUrl(repo.homepage) && repo.homepage !== repo.html_url) {
    projectEntry.canonicalLinks.website = repo.homepage;
  }

  if (clawHubStat?.url) {
    projectEntry.canonicalLinks.website = projectEntry.canonicalLinks.website || clawHubStat.url;
  }

  return { latestEntry: { ...latestEntry, projectId: repo.id }, projectEntry, cleanupNotes };
};

const assertSafePayload = (updates, expectedOwner) => {
  const errors = [];
  const serialized = JSON.stringify(updates);
  errors.push(...scanBlockedText('portfolio update payload', serialized));

  for (const group of ['latestUpdates', 'projects']) {
    for (const item of updates[group] || []) {
      const label = `${group} "${item.title || 'untitled'}"`;
      if (item.review?.status !== 'PASS') {
        errors.push(`${label} is missing PASS review status`);
      }
      const requiredGates = item.source === 'portfolio-static' ? PORTFOLIO_STATIC_REVIEW_GATES : REVIEW_GATES;
      for (const gate of requiredGates) {
        if (!item.review?.gates?.includes(gate)) {
          errors.push(`${label} is missing review gate ${gate}`);
        }
      }
      for (const link of item.links || []) {
        if (!isSafePublicUrl(link.url)) {
          errors.push(`${label} has unsafe public URL: ${link.url}`);
        }
      }
      if (item.repoFullName && !item.repoFullName.startsWith(`${expectedOwner}/`)) {
        errors.push(`${label} has unexpected repo owner: ${item.repoFullName}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`GitHub portfolio update review gate failed:\n- ${errors.join('\n- ')}`);
  }
};

const normalizeForComparison = (payload) => {
  const clone = JSON.parse(JSON.stringify(payload));
  delete clone.lastSyncedAt;
  if (clone.review) delete clone.review.syncedAt;
  return clone;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const checkedAt = new Date().toISOString().slice(0, 10);
  const now = Date.now();
  const lookbackMs = options.lookbackDays * 24 * 60 * 60 * 1000;
  const promotionMs = options.promoteDays * 24 * 60 * 60 * 1000;
  const { repoKeys, clawHubStatsBySlug, agnitra } = await getStaticExclusions(options.owner);
  const repos = await listRepos(options.owner);
  const eligibleRepos = repos
    .filter((repo) => !repo.archived && !repo.fork && !repo.private)
    .filter((repo) => now - Date.parse(getRepoActivityAt(repo)) <= lookbackMs)
    .filter((repo) => !repoKeys.has(repo.full_name))
    .sort((a, b) => Date.parse(getRepoActivityAt(b)) - Date.parse(getRepoActivityAt(a)))
    .slice(0, options.maxRepos);

  let updates = {
    version: 2,
    lastSyncedAt: new Date().toISOString(),
    review: {
      status: 'PASS',
      checkedAt,
      syncedAt: new Date().toISOString(),
      gateVersion: REVIEW_GATE_VERSION,
      gates: [...REVIEW_GATES, 'portfolio-static-source-backed'],
      toolchain: ['github-api', 'portfolio-static-overlay', 'portfolio-sync-review-gate', 'security-gate', 'codex-audit', 'clawpatch'],
    },
    latestUpdates: [],
    projects: [],
  };
  const cleanupNotes = [];

  for (const repo of eligibleRepos) {
    const shouldPromote = now - Date.parse(repo.created_at) >= promotionMs;
    const clawHubStat = clawHubStatsBySlug.get(slugify(repo.name));
    const { latestEntry, projectEntry, cleanupNotes: entryCleanupNotes } = await buildEntries(repo, checkedAt, shouldPromote, clawHubStat);
    cleanupNotes.push(...entryCleanupNotes);
    updates.latestUpdates.push(latestEntry);
    if (projectEntry) updates.projects.push(projectEntry);
  }
  addPortfolioCaseStudyEntries(updates, checkedAt, agnitra);
  updates.latestUpdates = updates.latestUpdates.filter((item) => now - Date.parse(item.createdAt) <= lookbackMs);

  let previous = null;
  try {
    previous = JSON.parse(await fs.readFile(PUBLIC_UPDATES_PATH, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  updates = preserveReviewedProjectArchive(updates, previous, [...repoKeys]);

  assertSafePayload(updates, options.owner);
  const serialized = `${JSON.stringify(updates, null, 2)}\n`;

  if (options.verify) {
    const currentPublic = JSON.parse(await fs.readFile(PUBLIC_UPDATES_PATH, 'utf8'));
    const currentDocs = JSON.parse(await fs.readFile(DOCS_UPDATES_PATH, 'utf8'));
    if (JSON.stringify(currentPublic) !== JSON.stringify(currentDocs)) {
      throw new Error(`${PUBLIC_UPDATES_PATH} and ${DOCS_UPDATES_PATH} are out of sync`);
    }
    if (JSON.stringify(normalizeForComparison(currentPublic)) !== JSON.stringify(normalizeForComparison(updates))) {
      throw new Error('portfolio-updates.json is stale relative to the current GitHub API snapshot; run npm run sync:github -- --write');
    }
  }

  if (options.write) {
    await fs.mkdir(path.dirname(PUBLIC_UPDATES_PATH), { recursive: true });
    await fs.mkdir(path.dirname(DOCS_UPDATES_PATH), { recursive: true });
    await fs.writeFile(PUBLIC_UPDATES_PATH, serialized, 'utf8');
    await fs.writeFile(DOCS_UPDATES_PATH, serialized, 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        write: options.write,
        verify: options.verify,
        owner: options.owner,
        checkedAt,
        lookbackDays: options.lookbackDays,
        maxRepos: options.maxRepos,
        reviewStatus: updates.review.status,
        cleanupNotes,
        latestUpdates: updates.latestUpdates.length,
        projects: updates.projects.length,
        repos: updates.latestUpdates.map((update) => update.repoFullName || update.sourceId || update.title),
      },
      null,
      2
    )
  );
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error?.message || error);
    process.exitCode = 1;
  });
}
