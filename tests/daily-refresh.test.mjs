import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const workflow = await readFile(new URL('../.github/workflows/daily-portfolio-refresh.yml', import.meta.url), 'utf8');
const match = workflow.match(/- name: Commit refreshed public files\s+run: \|\n([\s\S]*?)(?=\n      - name:)/);
assert.ok(match, 'The actual workflow commit step must be present');
const script = match[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');

for (const change of ['unchanged', 'new-page', 'discovery']) {
  test(`daily commit step handles ${change} without staging private notes`, async () => {
    const temp = await mkdtemp(path.join(os.tmpdir(), 'portfolio-daily-'));
    try {
      const repo = path.join(temp, 'repo'), remote = path.join(temp, 'remote.git');
      await mkdir(repo);
      const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
      git('init', '-q', '--initial-branch=main');
      git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.test');
      execFileSync('git', ['init', '-q', '--bare', remote]);
      for (const dir of ['public/images/project-social', 'docs', 'projects']) await mkdir(path.join(repo, dir), { recursive: true });
      const rootArtifacts = ['index.html', 'llms.txt', 'llms-full.txt', 'agent-context.md', 'agent-discovery.json', 'geo.txt', 'schema.jsonld', 'sitemap.xml', 'metadata.json'];
      for (const file of [...rootArtifacts, 'constants.ts', 'public/portfolio-updates.json', 'public/paper-reviews.json', 'public/chrome-extension-stats.json', 'public/images/portfolio-social-card-ml-ai-products.png', 'public/images/project-social/existing.png', 'docs/index.html', 'projects/index.md']) await writeFile(path.join(repo, file), 'fixture\n');
      git('add', '.'); git('commit', '-qm', 'Initial'); git('remote', 'add', 'origin', remote); git('push', '-qu', 'origin', 'main');
      // Private notes must never make it into the public-path commit.
      await writeFile(path.join(repo, 'private-notes.txt'), 'local fixture\n');
      if (change === 'new-page') await writeFile(path.join(repo, 'docs/new-page.html'), '<p>New public output</p>\n');
      if (change === 'discovery') {
        for (const file of rootArtifacts) await writeFile(path.join(repo, file), 'current public snapshot\n');
        await writeFile(path.join(repo, 'public/images/project-social/new-project.png'), 'new public card\n');
      }
      execFileSync('/bin/sh', ['-c', script], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      assert.equal(Number(git('rev-list', '--count', 'HEAD')), change === 'unchanged' ? 1 : 2);
      assert.equal(git('ls-files', 'docs/new-page.html'), change === 'new-page' ? 'docs/new-page.html' : '');
      if (change === 'discovery') {
        for (const file of rootArtifacts) assert.equal(git('show', `HEAD:${file}`), 'current public snapshot');
        assert.equal(git('show', 'HEAD:public/images/project-social/new-project.png'), 'new public card');
      }
      assert.equal(git('ls-files', 'private-notes.txt'), '');
      assert.equal(git('rev-parse', 'HEAD'), git('rev-parse', 'origin/main'));
    } finally { await rm(temp, { recursive: true, force: true }); }
  });
}

for (const filename of ['daily-portfolio-refresh.yml', 'deploy-pages.yml']) {
  test(`${filename} rejects a built artifact after main advances`, async () => {
    const source = await readFile(new URL(`../.github/workflows/${filename}`, import.meta.url), 'utf8');
    const guard = source.match(/- name: Verify publication is still current[\s\S]*?run: \|\n([\s\S]*?)(?=\n      - name:)/);
    assert.ok(guard);
    const script = guard[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');
    const temp = await mkdtemp(path.join(os.tmpdir(), 'portfolio-publication-'));
    try {
      const repo = path.join(temp, 'repo'), bin = path.join(temp, 'bin');
      await mkdir(repo); await mkdir(bin);
      const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
      git('init', '-q', '--initial-branch=main');
      git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.test');
      await writeFile(path.join(repo, 'index.html'), 'old public snapshot');
      git('add', '.'); git('commit', '-qm', 'Old publication');
      const built = git('rev-parse', 'HEAD');
      await writeFile(path.join(bin, 'gh'), '#!/bin/sh\nprintf "%s\\n" "$PUBLICATION_REMOTE_SHA"\n', { mode: 0o755 });
      const run = (current) => spawnSync('/bin/sh', ['-c', script], {
        cwd: repo, encoding: 'utf8', env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, GITHUB_REPOSITORY: 'fixture/public-site', GITHUB_SHA: built, PUBLICATION_REMOTE_SHA: current },
      });
      assert.equal(run(built).status, 0);
      await writeFile(path.join(repo, 'index.html'), 'new public snapshot');
      git('add', '.'); git('commit', '-qm', 'New publication');
      const current = git('rev-parse', 'HEAD');
      git('checkout', '-q', built);
      const obsolete = run(current);
      assert.equal(obsolete.status, 1);
      assert.match(obsolete.stdout, /superseded this artifact/);
    } finally { await rm(temp, { recursive: true, force: true }); }
  });
}
