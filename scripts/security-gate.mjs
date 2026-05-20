import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const execFileAsync = promisify(execFile);

const SKIP_DIRECTORIES = new Set([
  '.git',
  '.npm-cache',
  '.wrangler',
  'node_modules',
  'test-results',
]);

const SKIP_UNTRACKED_DIRECTORIES = new Set([
  '.site',
]);

const SKIP_PREFIXES = [
  'public/images/',
  'public/company-logos/',
];

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsonld',
  '.md',
  '.mjs',
  '.svg',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yml',
  '.yaml',
]);
const PDF_EXTENSIONS = new Set(['.pdf']);

const PUBLIC_ROOT_FILES = new Set([
  'agent-context.md',
  'agent-discovery.json',
  'geo.txt',
  'index.html',
  'llms-full.txt',
  'llms.txt',
  'metadata.json',
  'newsletter.md',
  'robots.txt',
  'schema.jsonld',
  'sitemap.xml',
]);

const PUBLIC_SOURCE_FILES = new Set([
  'App.tsx',
  'components/Sidebar.tsx',
  'components/ProjectCard.tsx',
  'components/ProjectModal.tsx',
  'constants.ts',
  'types.ts',
]);

const PUBLIC_PREFIXES = [
  'docs/',
  'field-notes/',
  'projects/',
  'public/',
];

const SECRET_PATTERNS = [
  ['private key block', /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/i],
  ['OpenAI API key', /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{30,}\b/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['Slack token', /\bxox[baprs]-[0-9A-Za-z-]{20,}\b/],
  ['credentialed URL', /https?:\/\/[^/\s:@]+:[^/\s@]+@/i],
  ['literal bearer token', /\bBearer\s+[A-Za-z0-9._-]{24,}\b/i],
  ['assigned secret literal', /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*['"][^'"]{16,}['"]/i],
];

const PUBLIC_LEAK_PATTERNS = [
  ['internal analytics wording', /\b(?:internal snapshot|prod pulse|DB slice|Profiles in DB|Sessions in DB|DAU\s*\/\s*WAU\s*\/\s*MAU)\b/i],
  ['client-facing process wording', /\b(?:internal process|client-facing proof|should not appear|do not leak|local Mac (?:project )?scan|local Mac repo history reviewed before portfolio add)\b/i],
  ['local source review wording', /\b(?:local source (?:README|review)|documented in local source)\b/i],
  ['private repo/path disclaimer wording', /\b(?:private[-\s]workflow case study|private (?:repo|repository) (?:link|url)s?|private repo link is intentionally omitted|does not publish the private repo URL|omitting private repository links|local source paths?|local artifact paths?)\b/i],
  ['client-data redaction wording', /\b(?:redacts? the client name|client identity.*removed|schema details|endpoint specifics|patient-identifying data)\b/i],
  ['unaudited metric proof wording', /\b(?:>\s*90%\s+accuracy|operator-reported public total|rounded public product snapshot|rounded public launch comparison|publish-ready)\b/i],
  ['Google Drive proof link', /https:\/\/drive\.google\.com\/file\/d\//i],
  ['non-public Google Drive or Colab URL', /https?:\/\/(?:drive\.google\.com\/|docs\.google\.com\/|colab\.research\.google\.com\/drive\/)/i],
  ['local absolute path', /(?:^|[^A-Za-z0-9_])(?:\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+)/],
  ['private URL', /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|[^/\s]+\.(?:local|internal))(?:[/:?#][^\s"'<>)]*)?/i],
  ['environment file reference', /(?:^|[\\/])\.env(?:$|[._-])/i],
];

const PUBLIC_INSTRUCTION_BLEED_PATTERNS = [
  ['system prompt wording', /\b(?:system prompt|developer message|hidden instruction|private instruction|tool instruction|model instruction)\b/i],
  ['prompt injection wording', /\b(?:ignore previous instructions|ignore all previous|forget previous instructions|reveal your prompt)\b/i],
  ['private reasoning wording', /\b(?:chain[- ]of[- ]thought|hidden reasoning|scratchpad)\b/i],
  ['Codex runtime wording', /\b(?:CODEX_HOME|request_user_input|sandbox_permissions|You are Codex)\b/i],
  ['deployment secret env name', /\b(?:DEV_CM_GITHUB_TOKEN|SYNC_SECRET|CLOUDFLARE_API_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY)\b/],
];

const errors = [];
const CODEX_DOCS_SOURCE = 'codex-docs';
const CODEX_DOCS_OUTPUT = 'docs/codex';
const REQUIRE_PDF_TEXT = process.env.REQUIRE_PDF_TEXT === 'true';
let trackedFilePaths = new Set();

const toRelative = (filePath) => path.relative(ROOT_DIR, filePath).split(path.sep).join('/');

const isTextFile = (relativePath) => TEXT_EXTENSIONS.has(path.extname(relativePath));

const isSkipped = (relativePath) => SKIP_PREFIXES.some((prefix) => relativePath.startsWith(prefix));

const isPublicSurface = (relativePath) => {
  return PUBLIC_ROOT_FILES.has(relativePath) || PUBLIC_SOURCE_FILES.has(relativePath) || PUBLIC_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
};

const loadTrackedFilePaths = async () => {
  const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
    cwd: ROOT_DIR,
    maxBuffer: 10 * 1024 * 1024,
  });
  trackedFilePaths = new Set(stdout.split('\0').filter(Boolean));
};

const isTrackedFile = (relativePath) => trackedFilePaths.has(relativePath);

const isTrackedDirectory = (relativePath) => {
  const prefix = `${relativePath.replace(/\/$/, '')}/`;
  for (const trackedPath of trackedFilePaths) {
    if (trackedPath.startsWith(prefix)) return true;
  }
  return false;
};

const collectFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = toRelative(absolutePath);
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name) || isSkipped(`${relativePath}/`)) continue;
      if (SKIP_UNTRACKED_DIRECTORIES.has(entry.name) && !isTrackedDirectory(relativePath)) continue;
      files.push(...await collectFiles(absolutePath));
      continue;
    }
    if (!entry.isFile()) continue;
    if (isSkipped(relativePath) || !isTextFile(relativePath)) continue;
    files.push({ absolutePath, relativePath });
  }
  return files;
};

const collectPublicPdfs = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = toRelative(absolutePath);
    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name) || isSkipped(`${relativePath}/`)) continue;
      if (SKIP_UNTRACKED_DIRECTORIES.has(entry.name) && !isTrackedDirectory(relativePath)) continue;
      files.push(...await collectPublicPdfs(absolutePath));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!isPublicSurface(relativePath) || isSkipped(relativePath)) continue;
    if (!PDF_EXTENSIONS.has(path.extname(relativePath))) continue;
    files.push({ absolutePath, relativePath });
  }
  return files;
};

const lineNumberForIndex = (text, index) => text.slice(0, index).split('\n').length;

const scanPatterns = (relativePath, text, patterns) => {
  for (const [label, pattern] of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      errors.push(`${relativePath}:${lineNumberForIndex(text, match.index)} contains ${label}`);
    }
  }
};

const assertPrivateRepoSyncFailsClosed = async () => {
  const relativePath = 'gcp/github-portfolio-sync/index.js';
  const source = await fs.readFile(path.join(ROOT_DIR, relativePath), 'utf8');
  if (!/INCLUDE_PRIVATE_REPOS\s*=\s*process\.env\.INCLUDE_PRIVATE_REPOS\s*===\s*['"]true['"]/.test(source)) {
    errors.push(`${relativePath}: private repo sync must default to disabled and require INCLUDE_PRIVATE_REPOS=true`);
  }
  if (!/PUBLISH_REPOS/.test(source)) {
    errors.push(`${relativePath}: private repo sync must require an explicit PUBLISH_REPOS allowlist`);
  }
};

const assertPublicUpdatesDoNotExposePrivateMetadata = async () => {
  for (const relativePath of ['public/portfolio-updates.json', 'docs/portfolio-updates.json']) {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    let parsed;
    try {
      parsed = JSON.parse(await fs.readFile(absolutePath, 'utf8'));
    } catch {
      continue;
    }
    for (const group of ['projects', 'latestUpdates']) {
      for (const item of parsed[group] || []) {
        if (item.private === true || item.visibility === 'private') {
          errors.push(`${relativePath}: ${group} contains private repo visibility metadata for "${item.title || 'untitled'}"`);
        }
        if (typeof item.repoFullName === 'string' && /(?:private|internal|secret|client)/i.test(item.repoFullName)) {
          errors.push(`${relativePath}: ${group} contains suspicious repoFullName "${item.repoFullName}"`);
        }
      }
    }
  }
};

const readDirectoryFileMap = async (relativeDirectory) => {
  const absoluteDirectory = path.join(ROOT_DIR, relativeDirectory);
  let entries;
  try {
    entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      errors.push(`${relativeDirectory}: required directory is missing`);
      return null;
    }
    throw error;
  }

  const fileMap = new Map();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const relativePath = `${relativeDirectory}/${entry.name}`;
    fileMap.set(entry.name, await fs.readFile(path.join(ROOT_DIR, relativePath), 'utf8'));
  }
  return fileMap;
};

const assertCodexDocsAreInSync = async () => {
  const sourceFiles = await readDirectoryFileMap(CODEX_DOCS_SOURCE);
  const outputFiles = await readDirectoryFileMap(CODEX_DOCS_OUTPUT);
  if (!sourceFiles || !outputFiles) return;

  const sourceNames = new Set(sourceFiles.keys());
  const outputNames = new Set(outputFiles.keys());

  for (const name of sourceNames) {
    if (!outputNames.has(name)) {
      errors.push(`${CODEX_DOCS_OUTPUT}/${name}: generated Codex doc is missing`);
      continue;
    }
    if (sourceFiles.get(name) !== outputFiles.get(name)) {
      errors.push(`${CODEX_DOCS_OUTPUT}/${name}: generated Codex doc is out of sync with ${CODEX_DOCS_SOURCE}/${name}`);
    }
  }

  for (const name of outputNames) {
    if (!sourceNames.has(name)) {
      errors.push(`${CODEX_DOCS_OUTPUT}/${name}: generated Codex doc has no source file`);
    }
  }
};

const scanPublicPdfText = async () => {
  try {
    await execFileAsync('pdftotext', ['-v']);
  } catch (error) {
    const detail = error && error.code === 'ENOENT' ? 'pdftotext is not installed' : error.message;
    if (REQUIRE_PDF_TEXT) {
      errors.push(`PDF text scan is required but unavailable (${detail})`);
    } else {
      console.warn(`PDF text scan skipped: ${detail}`);
    }
    return;
  }

  const pdfFiles = await collectPublicPdfs(ROOT_DIR);
  for (const file of pdfFiles) {
    let stdout;
    try {
      ({ stdout } = await execFileAsync('pdftotext', ['-layout', file.absolutePath, '-'], {
        maxBuffer: 10 * 1024 * 1024,
      }));
    } catch (error) {
      const detail = error && error.code === 'ENOENT' ? 'pdftotext is not installed' : error.message;
      errors.push(`${file.relativePath}: could not extract PDF text for leak scan (${detail})`);
      continue;
    }
    scanPatterns(`${file.relativePath} extracted text`, stdout, SECRET_PATTERNS);
    scanPatterns(`${file.relativePath} extracted text`, stdout, PUBLIC_LEAK_PATTERNS);
    scanPatterns(`${file.relativePath} extracted text`, stdout, PUBLIC_INSTRUCTION_BLEED_PATTERNS);
  }
};

const main = async () => {
  await loadTrackedFilePaths();
  const files = await collectFiles(ROOT_DIR);
  for (const file of files) {
    let text;
    try {
      text = await fs.readFile(file.absolutePath, 'utf8');
    } catch (error) {
      const detail = error?.message || 'read failed';
      if (isPublicSurface(file.relativePath) || await isTrackedFile(file.relativePath)) {
        errors.push(`${file.relativePath}: could not read tracked or public surface file for leak scan (${detail})`);
      } else {
        console.warn(`${file.relativePath}: skipped unreadable non-public file (${detail})`);
      }
      continue;
    }
    scanPatterns(file.relativePath, text, SECRET_PATTERNS);
    if (isPublicSurface(file.relativePath)) {
      scanPatterns(file.relativePath, text, PUBLIC_LEAK_PATTERNS);
      scanPatterns(file.relativePath, text, PUBLIC_INSTRUCTION_BLEED_PATTERNS);
    }
  }

  await assertPrivateRepoSyncFailsClosed();
  await assertPublicUpdatesDoNotExposePrivateMetadata();
  await assertCodexDocsAreInSync();
  await scanPublicPdfText();

  if (errors.length > 0) {
    console.error('Security gate failed:\n');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Security gate passed.');
};

await main();
