import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { fetchWithRetry, updateConstantsSource } from '../scripts/fetch-clawhub-stats.mjs';
import { fetchText, parseDetailPage, parsePublisherListings, updateExtensionRows, writeChromeStats } from '../scripts/fetch-chrome-extension-stats.mjs';
import { updateStatsSource } from '../scripts/stats-source.mjs';
import { classifyLinkResults } from '../scripts/link-results.mjs';
import { assertPreviewDestination, assertPrivateLanguageOutput, isPublicOutput } from '../scripts/media/architectural-catalog/output-path.mjs';
import { assertDecodedOutput, decodeFreshOutput } from '../scripts/media/architectural-catalog/decoded-output.mjs';
import { buildMarkdown } from '../scripts/generate-project-markdown.mjs';
import { fetchText as fetchPaperText } from '../scripts/update-paper-reviews.mjs';

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
  await assert.rejects(fetchPaperText(`${url}/ok`, 500), { name: 'AbortError' });
});

test('missing store markup preserves cached metrics and reports a warning', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>New store layout</html>'));
  const extension = { name: 'Example', chromeWebStoreUrl: 'https://example.test/store', users: 23, rating: 4.5, ratingCount: 8, sizeKb: 12 };
  const stats = { checkedAt: '2026-06-15', totalUsers: 23, extensions: [extension] };
  const { nextStats, warnings, measuredRows } = await updateExtensionRows(stats);
  for (const field of ['users', 'rating', 'ratingCount', 'sizeKb']) assert.equal(nextStats.extensions[0][field], extension[field]);
  assert.match(warnings[0], /no visible user count/);
  assert.equal(nextStats.checkedAt, '2026-06-15');
  assert.equal(measuredRows, 0);
  assert.deepEqual(nextStats, stats);
});

test('a partial store refresh excludes stale counts and missing ratings from current totals', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => new Response(url.endsWith('/measured') ? '<h1>Measured</h1><span>10 users</span>' : '<h1>No public count</h1>'));
  const { nextStats, warnings, measuredRows } = await updateExtensionRows({ totalPublished: 2, checkedAt: '2026-06-15', extensions: [
    { id: 'measured', name: 'Measured', chromeWebStoreUrl: 'https://example.test/measured', users: 1, rating: 5, ratingCount: 8, version: 'OLD', lastUpdated: '2026-06-15', category: 'OLD' },
    { id: 'missing', name: 'Missing', chromeWebStoreUrl: 'https://example.test/missing', users: 999, rating: 5, ratingCount: 20 },
  ] });
  assert.equal(measuredRows, 1);
  assert.equal(nextStats.totalUsers, 10);
  assert.equal(nextStats.extensions.length, 1);
  assert.equal(nextStats.extensions[0].id, 'measured');
  assert.equal(nextStats.extensions[0].rating, undefined);
  for (const field of ['version', 'lastUpdated', 'category']) assert.equal(nextStats.extensions[0][field], '');
  assert.equal(nextStats.ratingCount, 0);
  assert.equal(warnings.length, 1);
});

test('publisher discovery uses rendered result identities and titles, with duplicate results collapsed', () => {
  const id = 'abcdefghijklmnopabcdefghijklmnop';
  const card = `<div data-item-id="${id}"><a href="./detail/research-radar/${id}"></a><h2>Research &amp; notes</h2></div>`;
  assert.deepEqual(parsePublisherListings(card + card), [{ id, name: 'Research & notes', chromeWebStoreUrl: `https://chromewebstore.google.com/detail/research-radar/${id}?hl=en` }]);
});

test('an unrecognized publisher page fails discovery before any dated snapshot can be written', () => {
  assert.throws(() => parsePublisherListings('<html>Publisher temporarily unavailable</html>'), /No visible publisher listings/);
});

test('project Markdown preserves paragraphs and indented code blocks', () => {
  for (const body of ["First paragraph.\n\nSecond paragraph.\n\n```python\n    print('ok')\n```", "    print('first')\n    print('next')"]) {
    const markdown = buildMarkdown({ title: 'Example', description: 'Example description', longDescription: body, keyFeatures: [], techStack: [], links: [], caseStudySections: [{ title: 'Details', body }] }, 'https://example.test/project.md');
    assert.ok(markdown.includes(`## Summary\n${body}`));
    assert.ok(markdown.includes(`## Details\n${body}`));
  }
});

test('decoded frame acceptance requires a successful process and actual nonempty output', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'decoded-frame-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const output = path.join(directory, 'frame.png');
  assert.throws(() => assertDecodedOutput({ status: null, error: new Error('ENOENT') }, output), /ENOENT/);
  assert.throws(() => assertDecodedOutput({ status: null, signal: 'SIGTERM' }, output), /SIGTERM/);
  assert.throws(() => assertDecodedOutput({ status: 0 }, output), /ENOENT/);
  await fs.writeFile(output, '');
  assert.throws(() => assertDecodedOutput({ status: 0 }, output), /Missing decoded frame content/);
  await fs.writeFile(output, 'decoded bytes');
  assert.doesNotThrow(() => assertDecodedOutput({ status: 0 }, output));
});

test('private-language output cannot enter docs or a symlink to deployed assets', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'output-containment-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const publicRoot = path.join(directory, 'public'), docsRoot = path.join(directory, 'docs');
  await fs.mkdir(publicRoot); await fs.mkdir(docsRoot);
  const alias = path.join(directory, 'private-looking-alias');
  await fs.symlink(docsRoot, alias);
  for (const output of [docsRoot, path.join(docsRoot, 'new/nested'), alias, path.join(alias, 'new/nested')]) assert.equal(isPublicOutput(output, publicRoot), true);
  assert.equal(isPublicOutput(path.join(directory, 'private'), publicRoot), false);
});

test('child media and model symlinks cannot redirect private-language output into public assets', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'output-child-containment-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const publicRoot = path.join(directory, 'public'), docsRoot = path.join(directory, 'docs');
  await fs.mkdir(publicRoot); await fs.mkdir(docsRoot);
  for (const child of ['media', 'models']) {
    const output = path.join(directory, `private-${child}`);
    await fs.mkdir(output);
    await fs.symlink(child === 'media' ? publicRoot : docsRoot, path.join(output, child));
    assert.throws(() => assertPrivateLanguageOutput(output, publicRoot), /outside the public portfolio/);
  }
});

test('preview generation cannot overwrite a complete capture and leave its receipt stale', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'preview-generation-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.mkdir(path.join(directory, 'media'));
  const receipt = path.join(directory, 'media/catalog-capture.json');
  await fs.writeFile(receipt, 'complete capture receipt');
  assert.throws(() => assertPreviewDestination(directory), /separate destination/);
  assert.equal(await fs.readFile(receipt, 'utf8'), 'complete capture receipt');
  assert.doesNotThrow(() => assertPreviewDestination(path.join(directory, 'fresh-preview')));
});

test('a successful decoder that writes no new frame cannot reuse an older PNG', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'decoded-stale-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const output = path.join(directory, 'frame.png');
  await fs.writeFile(output, 'old frame');
  assert.throws(() => decodeFreshOutput(output, () => ({ status: 0 })), /ENOENT/);
  await assert.rejects(fs.access(output), { code: 'ENOENT' });
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
  const second = writeChromeStats({ totalUsers: 123, totalPublished: 1, checkedAt: '2026-10-08', averageRating: 4.5, ratingCount: 2, extensions: [] }, file);
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
