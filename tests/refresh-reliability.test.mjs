import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { fetchWithRetry, updateConstantsSource } from '../scripts/fetch-clawhub-stats.mjs';
import { fetchText, parseDetailPage, updateExtensionRows, writeChromeStats } from '../scripts/fetch-chrome-extension-stats.mjs';
import { updateStatsSource } from '../scripts/stats-source.mjs';
import { classifyLinkResults } from '../scripts/link-results.mjs';
import { isPublicOutput } from '../scripts/media/architectural-catalog/output-path.mjs';

test('stalled response bodies terminate and ClawHub retries are bounded for 200 and 503', { timeout: 10000 }, async (t) => {
  let requests = 0;
  const server = http.createServer((req, res) => {
    requests++;
    res.writeHead(req.url === '/retry' ? 503 : 200);
    res.flushHeaders();
    res.write('unfinished');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}`;
  for (const route of ['/ok', '/retry']) {
    const before = requests;
    await assert.rejects(fetchWithRetry(`${url}${route}`, {}, 2, 500), /timed out after 500ms/);
    assert.equal(requests - before, 2);
  }
  await assert.rejects(fetchText(`${url}/ok`, 500), { name: 'AbortError' });
});

test('missing store markup preserves cached metrics and reports a warning', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>New store layout</html>'));
  const extension = { name: 'Example', chromeWebStoreUrl: 'https://example.test/store', users: 23, rating: 4.5, ratingCount: 8, sizeKb: 12 };
  const { nextStats, warnings } = await updateExtensionRows({ extensions: [extension] });
  for (const field of ['users', 'rating', 'ratingCount', 'sizeKb']) assert.equal(nextStats.extensions[0][field], extension[field]);
  assert.match(warnings[0], /no visible user count/);
});

test('explicit zero metrics are measured values, and other absent fields remain null', () => {
  const parsed = parseDetailPage('<span>0 users</span><span>0 out of 5</span><span>0 ratings</span><div>Size</div><div>0 KiB</div>');
  for (const field of ['users', 'rating', 'ratingCount', 'sizeKb']) assert.equal(parsed[field], 0);
  const partial = parseDetailPage('<span>10 users</span>');
  assert.equal(partial.users, 10);
  for (const field of ['rating', 'ratingCount', 'sizeKb']) assert.equal(partial[field], null);
});

test('overlapping Chrome and ClawHub writers preserve both updated source blocks', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-stats-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'constants.ts');
  await fs.writeFile(file, await fs.readFile(new URL('../constants.ts', import.meta.url)));
  let enter, release;
  const entered = new Promise((resolve) => { enter = resolve; });
  const released = new Promise((resolve) => { release = resolve; });
  const first = updateStatsSource(file, async (source) => {
    enter();
    await released;
    return updateConstantsSource(source, [{ slug: 'data-science-cv-repro-lab', displayName: 'CV Lab', downloads: 12, versions: 2, stars: 1, url: 'https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab', checkedAt: '2026-10-07' }]);
  });
  await entered;
  const second = writeChromeStats({ totalUsers: 123, extensions: [] }, file);
  release();
  await Promise.all([first, second]);
  const result = await fs.readFile(file, 'utf8');
  assert.match(result, /"totalUsers": 123/);
  assert.match(result, /Updated the public ClawHub tracker to 12 downloads across 1 public skills/);
  assert.deepEqual(await fs.readdir(directory), ['constants.ts']);
});

test('an intervening external edit is retained and the refresh fails visibly', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-stats-conflict-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'constants.ts');
  await fs.writeFile(file, 'original');
  await assert.rejects(updateStatsSource(file, async () => {
    await fs.writeFile(file, 'external edit');
    return 'refresh';
  }), /changed during refresh/);
  assert.equal(await fs.readFile(file, 'utf8'), 'external edit');
  assert.deepEqual(await fs.readdir(directory), ['constants.ts']);
});

test('bot-gated network errors are separate from ordinary broken links', () => {
  const bot = { url: 'https://www.linkedin.com/in/example', status: 'error' };
  const ordinary = { url: 'https://example.test/', status: 'error' };
  const missing = { url: 'https://example.test/missing', status: 404 };
  const { warnings, failures } = classifyLinkResults([bot, ordinary, missing]);
  assert.deepEqual(warnings, [bot]);
  assert.deepEqual(failures, [ordinary, missing]);
});

test('capture output containment includes the public root and excludes sibling paths', () => {
  const root = path.resolve('public');
  for (const output of [root, `${root}${path.sep}`, path.join(root, 'nested')]) assert.equal(isPublicOutput(output, `${root}${path.sep}`), true);
  for (const output of [path.resolve('private'), `${root}-ru`, path.dirname(root)]) assert.equal(isPublicOutput(output, root), false);
});
