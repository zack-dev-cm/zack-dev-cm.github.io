import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { stagePages, verifyStagedPages } from '../scripts/stage-pages.mjs';

const repo = new URL('../', import.meta.url);
const resumeName = 'zakhar-pashkin-senior-ml-engineer';
const requiredSuites = [
  'tests/project-catalog.test.mjs', 'tests/project-search.test.mjs', 'tests/stage-pages.test.mjs',
];

const fixture = async (t) => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-pages-stage-'));
  t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
  const write = async (file, data) => {
    await fs.mkdir(path.dirname(path.join(rootDir, file)), { recursive: true });
    await fs.writeFile(path.join(rootDir, file), data);
  };
  for (const file of ['index.html', 'favicon.svg', 'geo.txt', 'llms.txt', 'llms-full.txt', 'metadata.json', 'robots.txt',
    'schema.jsonld', 'sitemap.xml', 'agent-context.md', 'google-site-verification.txt', 'google9a05bdeaa5b048bb.html',
    'docs/404.html', 'docs/paper-reviews.json', 'docs/papers/index.html']) await write(file, 'fixture');
  for (const extension of ['pdf', 'html']) {
    // Stage the real resume bytes, so a placeholder or a 404 document cannot pass.
    await write(`docs/resume/${resumeName}.${extension}`, await fs.readFile(new URL(`public/resume/${resumeName}.${extension}`, repo)));
  }
  const projects = ['interactive-doc-mapper', 'unitree-g1-colab-ik'].map((slug) => ({
    url: `https://zack-dev-cm.github.io/projects/${slug}/`, markdownUrl: `https://zack-dev-cm.github.io/projects/${slug}.md`,
  }));
  await write('agent-discovery.json', JSON.stringify({ allProjects: projects }));
  await write('docs/agent-discovery.json', JSON.stringify({ allProjects: projects }));
  for (const project of projects) {
    const pathname = new URL(project.url).pathname.slice(1);
    await write(`${pathname}index.html`, `<html><head><link rel="canonical" href="${project.url}"></head><body>Case study</body></html>`);
    await write(new URL(project.markdownUrl).pathname.slice(1), '# Case study\n');
  }
  return { rootDir, outputDir: path.join(rootDir, '.site') };
};

test('both workflows stage and verify the artifact with the same shared command', async () => {
  for (const file of ['deploy-pages.yml', 'daily-portfolio-refresh.yml']) {
    const source = await fs.readFile(new URL(`.github/workflows/${file}`, repo), 'utf8');
    const command = source.match(/- name: Stage Pages artifact\s+run:([^\n]+)/)?.[1].trim();
    assert.equal(command, 'node scripts/stage-pages.mjs', file);
    const regressionCommand = source.match(/run:\s*(node\s+--test[^\n]+)/)?.[1];
    assert.ok(regressionCommand, `${file}: missing the Node regression gate`);
    const argumentsSet = new Set(regressionCommand.split(/\s+/));
    for (const suite of requiredSuites) assert.ok(argumentsSet.has(suite), `${file}: missing ${suite}`);
  }
});

test('a failing Node preflight prevents the npm E2E command from starting', async (t) => {
  const packageJson = JSON.parse(await fs.readFile(new URL('package.json', repo), 'utf8'));
  const preflight = packageJson.scripts['pretest:e2e'];
  assert.equal(typeof preflight, 'string', 'E2E must run the Node gate before Playwright');
  const argumentsSet = new Set(preflight.split(/\s+/));
  for (const suite of requiredSuites) assert.ok(argumentsSet.has(suite), `E2E preflight: missing ${suite}`);

  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-e2e-gate-'));
  t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
  await fs.mkdir(path.join(rootDir, 'tests'));
  for (const suite of requiredSuites) {
    await fs.writeFile(path.join(rootDir, suite), suite.includes('project-search')
      ? "throw new Error('Controlled regression failure');\n" : '// Passing fixture.\n');
  }
  await fs.writeFile(path.join(rootDir, 'browser-sentinel.mjs'),
    "import fs from 'node:fs'; fs.writeFileSync('browser-started', 'unexpected');\n");
  await fs.writeFile(path.join(rootDir, 'package.json'), JSON.stringify({
    private: true,
    scripts: { 'pretest:e2e': preflight, 'test:e2e': 'node browser-sentinel.mjs' },
  }));
  const environment = { ...process.env, npm_config_ignore_scripts: 'false' };
  // This fixture is a fresh npm invocation, not a recursive node:test worker.
  // Inheriting this internal marker makes Node skip its nested test files.
  delete environment.NODE_TEST_CONTEXT;
  const result = spawnSync('npm', ['run', 'test:e2e', '--silent'], {
    cwd: rootDir, encoding: 'utf8', timeout: 15_000,
    env: environment,
  });
  assert.ifError(result.error);
  assert.notEqual(result.status, 0, 'The controlled Node failure must fail the npm command');
  assert.match(result.stdout + result.stderr, /Controlled regression failure/);
  await assert.rejects(fs.access(path.join(rootDir, 'browser-started')), { code: 'ENOENT' });
});

test('staging contains actual canonical PDF/HTML, matching aliases and canonical project pages', async (t) => {
  const options = await fixture(t);
  const result = await stagePages(options);
  assert.equal(result.projectCount, 2);
  assert.ok(result.resumePdfBytes > 1000);
  assert.ok(result.resumeHtmlBytes > 1000);
  for (const extension of ['pdf', 'html']) {
    const actual = await fs.readFile(path.join(options.outputDir, 'resume', `${resumeName}.${extension}`));
    assert.deepEqual(actual, await fs.readFile(new URL(`public/resume/${resumeName}.${extension}`, repo)));
  }
  await fs.access(path.join(options.outputDir, '.nojekyll'));
});

test('a missing or substituted canonical resume fails staged verification', async (t) => {
  const options = await fixture(t);
  await stagePages(options);
  const pdf = path.join(options.outputDir, 'resume', `${resumeName}.pdf`);
  await fs.writeFile(pdf, '<html><title>404</title></html>');
  await assert.rejects(verifyStagedPages(options.outputDir), /not a PDF/);
  await fs.rm(pdf);
  await assert.rejects(verifyStagedPages(options.outputDir), /ENOENT/);
});

test('advertised project pages must exist in the staged artifact with canonical metadata', async (t) => {
  const options = await fixture(t);
  await stagePages(options);
  const projectPage = path.join(options.outputDir, 'projects', 'interactive-doc-mapper', 'index.html');
  await fs.writeFile(projectPage, '<html><title>404</title></html>');
  await assert.rejects(verifyStagedPages(options.outputDir), /Missing canonical metadata/);
  await fs.rm(projectPage);
  await assert.rejects(verifyStagedPages(options.outputDir), /ENOENT/);
});

test('missing built resume inputs cannot silently produce an incomplete release', async (t) => {
  const options = await fixture(t);
  await fs.rm(path.join(options.rootDir, 'docs', 'resume', `${resumeName}.html`));
  await assert.rejects(stagePages(options), /ENOENT/);
  await assert.rejects(fs.access(options.outputDir), /ENOENT/);
});
