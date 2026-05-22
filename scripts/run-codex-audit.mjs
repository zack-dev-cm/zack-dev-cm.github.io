import { accessSync, copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIT_ARGS = ['-m', 'codex_harness', 'audit', '.', '--strict', '--min-score', '90'];
const INSTALL_HELP = 'python3 -m pip install "git+https://github.com/zack-dev-cm/antirot.git"';
const SNAPSHOT_SKIP_PREFIXES = [
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

for (const candidate of candidates) {
  if (!importWorks(candidate.python, candidate.env)) continue;
  const result = runAudit(candidate.python, candidate.env);
  process.exit(result.status ?? 1);
}

console.error('Could not import codex_harness for the strict audit.');
console.error(`Install it with: ${INSTALL_HELP}`);
process.exit(1);
