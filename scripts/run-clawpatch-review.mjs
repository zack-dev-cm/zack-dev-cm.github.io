import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOCAL_CLAWPATCH = path.resolve(ROOT_DIR, '..', 'clawpatch', 'dist', 'cli.js');
const DEFAULT_ARGS = [
  'ci',
  '--since',
  'HEAD',
  '--limit',
  '20',
  '--jobs',
  '3',
  '--reasoning-effort',
  'high',
  '--output',
  '.clawpatch/reports/latest-portfolio-review.md',
];

const passthroughArgs = process.argv.slice(2);
const reviewArgs = passthroughArgs.length > 0 ? passthroughArgs : DEFAULT_ARGS;

const candidates = [];
if (process.env.CLAWPATCH_BIN) {
  candidates.push({ command: process.env.CLAWPATCH_BIN, args: [] });
}
candidates.push({ command: 'clawpatch', args: [] });
if (fs.existsSync(LOCAL_CLAWPATCH)) {
  candidates.push({ command: process.execPath, args: [LOCAL_CLAWPATCH] });
}

const canRun = ({ command, args }) => {
  const result = spawnSync(command, [...args, '--version'], {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: 'ignore',
  });
  return result.status === 0;
};

fs.mkdirSync(path.resolve(ROOT_DIR, '.clawpatch', 'reports'), { recursive: true });

const candidate = candidates.find(canRun);
if (!candidate) {
  console.error('Could not find clawpatch on PATH or at ../clawpatch/dist/cli.js.');
  console.error('Install with `pnpm add -g clawpatch` or keep the local ../clawpatch checkout built.');
  process.exit(1);
}

const result = spawnSync(candidate.command, [...candidate.args, ...reviewArgs], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
