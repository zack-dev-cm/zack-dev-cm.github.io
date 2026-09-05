import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checks = [
  ['Portfolio source and project contracts', ['scripts/validate-portfolio.mjs']],
  ['Source positioning and unsupported-copy patterns', ['scripts/validate-positioning-copy.mjs']],
  ['Public-surface security and instruction-bleed scan', ['scripts/security-gate.mjs']],
  ['Generated metadata and canonical-page consistency', ['scripts/validate-seo-aeo.mjs']],
  ['Catalogue and deployment failure regressions', ['--test', 'tests/project-catalog.test.mjs', 'tests/project-search.test.mjs', 'tests/stage-pages.test.mjs']],
];

console.log('Public source/artifact audit: repository-owned checks; no external audit package or numeric score.');
for (const [label, args] of checks) {
  console.log(`Checking: ${label}`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    console.error(`Public audit failed: ${label}${result.error ? ` (${result.error.message})` : ''}`);
    process.exit(result.status && result.status > 0 ? result.status : 1);
  }
}
console.log(`Public source/artifact audit passed (${checks.length} checks). Browser behavior, external links and independent source/diff review remain separate required evidence.`);
