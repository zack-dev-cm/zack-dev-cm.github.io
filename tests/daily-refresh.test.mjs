import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const workflow = await readFile(new URL('../.github/workflows/daily-portfolio-refresh.yml', import.meta.url), 'utf8');
const match = workflow.match(/- name: Commit refreshed public files\s+run: \|\n([\s\S]*?)(?=\n      - name:)/);
assert.ok(match, 'The actual workflow commit step must be present');
const script = match[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');

for (const newOutput of [false, true]) {
  test(`daily commit step ${newOutput ? 'records newly generated untracked public output' : 'skips an unchanged public tree'}`, async () => {
    const temp = await mkdtemp(path.join(os.tmpdir(), 'portfolio-daily-'));
    try {
      const repo = path.join(temp, 'repo'), remote = path.join(temp, 'remote.git');
      await mkdir(repo);
      const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
      git('init', '-q', '--initial-branch=main');
      git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.test');
      execFileSync('git', ['init', '-q', '--bare', remote]);
      for (const dir of ['public', 'docs', 'projects']) await mkdir(path.join(repo, dir));
      for (const file of ['constants.ts', 'public/portfolio-updates.json', 'public/paper-reviews.json', 'docs/index.html', 'projects/index.md']) await writeFile(path.join(repo, file), 'fixture\n');
      git('add', '.'); git('commit', '-qm', 'Initial'); git('remote', 'add', 'origin', remote); git('push', '-qu', 'origin', 'main');
      // Private notes must never make it into the public-path commit.
      await writeFile(path.join(repo, 'private-notes.txt'), 'local fixture\n');
      if (newOutput) await writeFile(path.join(repo, 'docs/new-page.html'), '<p>New public output</p>\n');
      execFileSync('/bin/sh', ['-c', script], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      assert.equal(Number(git('rev-list', '--count', 'HEAD')), newOutput ? 2 : 1);
      assert.equal(git('ls-files', 'docs/new-page.html'), newOutput ? 'docs/new-page.html' : '');
      assert.equal(git('ls-files', 'private-notes.txt'), '');
      assert.equal(git('rev-parse', 'HEAD'), git('rev-parse', 'origin/main'));
    } finally { await rm(temp, { recursive: true, force: true }); }
  });
}
