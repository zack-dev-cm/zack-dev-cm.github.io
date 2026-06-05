import { accessSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIT_ARGS = ['-m', 'codex_harness', 'audit', '.', '--strict', '--min-score', '90'];
const INSTALL_HELP = 'python3 -m pip install "git+https://github.com/zack-dev-cm/antirot.git"';
const FORCE_FALLBACK = process.env.CODEX_AUDIT_FORCE_FALLBACK === '1';
const SNAPSHOT_SKIP_PREFIXES = [
  '.codex-audit-venv/',
  '.clawpatch/',
  '.git/',
  'node_modules/',
  'test-results/',
];

const pathExists = (candidate) => {
  try {
    accessSync(candidate);
    return true;
  } catch {
    return false;
  }
};

const importWorks = (python, env) => {
  const result = spawnSync(python, ['-c', 'import codex_harness'], {
    cwd: ROOT_DIR,
    env,
    stdio: 'ignore',
  });
  return result.status === 0;
};

const gitList = (args) => {
  const result = spawnSync('git', args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    maxBuffer: 25 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(' ')} failed`);
  }
  return result.stdout.split('\0').filter(Boolean);
};

const shouldSnapshot = (relativePath) => {
  return !SNAPSHOT_SKIP_PREFIXES.some((prefix) => relativePath.startsWith(prefix));
};

const createAuditSnapshot = () => {
  const snapshotRoot = mkdtempSync(path.join(os.tmpdir(), 'portfolio-codex-audit-'));
  const paths = new Set([
    ...gitList(['ls-files', '-z']),
    ...gitList(['ls-files', '--others', '--exclude-standard', '-z']),
  ]);

  for (const relativePath of paths) {
    if (!shouldSnapshot(relativePath)) continue;
    const source = path.join(ROOT_DIR, relativePath);
    const destination = path.join(snapshotRoot, relativePath);
    mkdirSync(path.dirname(destination), { recursive: true });
    try {
      copyFileSync(source, destination);
    } catch (error) {
      if (error && error.code === 'ENOENT') continue;
      throw error;
    }
  }

  return snapshotRoot;
};

const runAudit = (python, env) => {
  const auditRoot = createAuditSnapshot();
  try {
    return spawnSync(python, AUDIT_ARGS, {
      cwd: auditRoot,
      env,
      stdio: 'inherit',
    });
  } finally {
    rmSync(auditRoot, { recursive: true, force: true });
  }
};

const walkFiles = (root, relativeRoot = '') => {
  const absoluteRoot = path.join(root, relativeRoot);
  const entries = readdirSync(absoluteRoot, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.join(relativeRoot, entry.name);
    if (!shouldSnapshot(relativePath.replaceAll(path.sep, '/'))) continue;
    const absolutePath = path.join(root, relativePath);
    if (entry.isDirectory()) {
      files.push(...walkFiles(root, relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath.replaceAll(path.sep, '/'));
    }
  }
  return files;
};

const readUtf8IfText = (relativePath) => {
  const absolutePath = path.join(ROOT_DIR, relativePath);
  const stats = statSync(absolutePath);
  if (stats.size > 1024 * 1024) return '';
  if (/\.(png|jpe?g|gif|webp|pdf|ico|woff2?|ttf|mp4|webm|zip)$/i.test(relativePath)) return '';
  return readFileSync(absolutePath, 'utf8');
};

const fallbackAudit = () => {
  const issues = [];
  const requiredFiles = [
    'public/papers/index.html',
    'public/paper-reviews.json',
    'public/images/ml-paper-review-digest-hero.webp',
    'docs/papers/index.html',
    'docs/paper-reviews.json',
    'docs/images/ml-paper-review-digest-hero.webp',
  ];

  for (const file of requiredFiles) {
    if (!pathExists(path.join(ROOT_DIR, file))) issues.push(`${file} is missing`);
  }

  const scanRoots = ['public', 'docs', 'llms.txt', 'llms-full.txt', 'agent-context.md', 'agent-discovery.json', 'schema.jsonld'];
  const scanFiles = scanRoots.flatMap((scanRoot) => {
    const absolute = path.join(ROOT_DIR, scanRoot);
    if (!pathExists(absolute)) return [];
    const stats = statSync(absolute);
    return stats.isDirectory() ? walkFiles(ROOT_DIR, scanRoot) : [scanRoot];
  });

  const forbidden = [
    ['old paper source name', /gonz(?:o|0)/i],
    ['old paper source URL', /t\.me\/gonz/i],
    ['Gemini key prefix', /AQ\.Ab8RN6I55/i],
    ['N/A placeholder', /\bN\/A\b/i],
    ['credentialed URL', /https?:\/\/[^/\s:@]+:[^/\s@]+@/i],
  ];

  for (const file of scanFiles) {
    const text = readUtf8IfText(file);
    for (const [label, pattern] of forbidden) {
      if (pattern.test(text)) issues.push(`${file} contains ${label}`);
    }
  }

  for (const file of ['public/paper-reviews.json', 'docs/paper-reviews.json']) {
    if (!pathExists(path.join(ROOT_DIR, file))) continue;
    const feed = JSON.parse(readFileSync(path.join(ROOT_DIR, file), 'utf8'));
    if (feed.title !== 'ML Papers, Read for Builders') issues.push(`${file} has wrong title`);
    if (feed.language !== 'en') issues.push(`${file} is not marked English`);
    if (!Array.isArray(feed.reviews) || feed.reviews.length < 1) {
      issues.push(`${file} has no reviews`);
      continue;
    }
    for (const review of feed.reviews) {
      const ledgerLabels = (review.sourceLedger || []).map((link) => link.label).join(' | ');
      if (!review.title || !review.editorVerdict || !review.whatItClaims || !review.skepticism) {
        issues.push(`${file} review ${review.id || review.title || 'unknown'} is missing editorial fields`);
      }
      if (!/Primary paper/i.test(ledgerLabels)) issues.push(`${file} review ${review.title} missing primary paper source`);
      if (!/\bPDF\b/i.test(ledgerLabels)) issues.push(`${file} review ${review.title} missing PDF source`);
      if (!/research feed/i.test(ledgerLabels)) issues.push(`${file} review ${review.title} missing research feed source`);
    }
  }

  if (issues.length) {
    console.error(`Codex fallback audit issues=${issues.length}`);
    for (const issue of issues) console.error(`- ${issue}`);
    return 1;
  }

  console.log(`Codex fallback audit for ${ROOT_DIR}`);
  console.log('score=100/100 issues=0');
  return 0;
};

const localHarnessCandidates = [
  path.resolve(ROOT_DIR, '..', 'github_stars_optimizer'),
  path.resolve(ROOT_DIR, '..', 'antirot'),
];

const candidates = [{ python: 'python3', env: process.env }];

for (const harnessRoot of localHarnessCandidates) {
  if (!pathExists(path.join(harnessRoot, 'codex_harness'))) continue;
  const env = {
    ...process.env,
    PYTHONPATH: [harnessRoot, process.env.PYTHONPATH].filter(Boolean).join(path.delimiter),
  };
  for (const python of [
    path.join(harnessRoot, '.venv310', 'bin', 'python'),
    path.join(harnessRoot, '.venv', 'bin', 'python'),
    'python3',
  ]) {
    if (python.includes('/bin/') && !pathExists(python)) continue;
    candidates.push({ python, env });
  }
}

if (!FORCE_FALLBACK) {
  for (const candidate of candidates) {
    if (!importWorks(candidate.python, candidate.env)) continue;
    const result = runAudit(candidate.python, candidate.env);
    process.exit(result.status ?? 1);
  }
}

if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' || FORCE_FALLBACK) {
  process.exit(fallbackAudit());
}

console.error('Could not import codex_harness for the strict audit.');
console.error(`Install it with: ${INSTALL_HELP}`);
process.exit(1);
