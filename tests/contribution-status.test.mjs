import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { catalogueRecords, checkContributions, fetchPullRequest, writePrivateReport } from '../scripts/check-contribution-status.mjs';

const mergedAt = '2026-10-13T18:33:27Z';
const catalogue = (statuses = ['open']) => ({ verifiedAt: '2026-10-14', projects: [{
  account: 'author', benefit: 'Reviewed editorial description.', scope: 'Historical revert remains noted.',
  pullRequests: statuses.map((status, index) => ({ url: `https://github.com/research/library/pull/${index + 1}`,
    number: index + 1, status, mergedAt: status === 'merged' ? mergedAt : null })),
}] });
const response = (record, status = 'open') => ({ number: record.number, html_url: record.url,
  user: { login: 'author' }, base: { repo: { private: false, full_name: 'research/library' } },
  state: status === 'merged' ? 'closed' : status, merged: status === 'merged', merged_at: status === 'merged' ? mergedAt : null });

test('a newly merged PR creates drift without changing reviewed copy or revert context', async () => {
  const data = catalogue(), before = JSON.stringify(data);
  const result = await checkContributions(data, { request: async record => response(record, 'merged') });
  assert.equal(result.status, 'DRIFT');
  assert.deepEqual(result.mismatches[0].expected, { status: 'open', mergedAt: null });
  assert.deepEqual(result.mismatches[0].observed, { status: 'merged', mergedAt });
  assert.equal(JSON.stringify(data), before);
});

test('closed without merge stays distinct from a historical merged PR', async () => {
  const data = catalogue(['merged', 'open']);
  const result = await checkContributions(data, { request: async record => response(record, record.number === 1 ? 'merged' : 'closed') });
  assert.equal(result.status, 'DRIFT');
  assert.equal(result.mismatches.length, 1);
  assert.deepEqual(result.mismatches[0].observed, { status: 'closed', mergedAt: null });
  assert.match(result.scope, /reverts.*separate review/);
});

test('all records must be observed before the catalogue is CURRENT', async () => {
  const result = await checkContributions(catalogue(['merged', 'open']), {
    request: async record => response(record, record.expected.status),
  });
  assert.equal(result.status, 'CURRENT');
  assert.equal(result.recordsObserved, 2);
  assert.equal(result.unavailable.length, 0);
});

test('an API gap retains a known mismatch without inventing a state for the missing record', async () => {
  const result = await checkContributions(catalogue(['open', 'open']), {
    request: async record => { if (record.number === 2) throw new Error('Fixture unavailable'); return response(record, 'merged'); },
  });
  assert.equal(result.status, 'UNAVAILABLE');
  assert.equal(result.mismatches.length, 1);
  assert.equal(result.unavailable.length, 1);
  assert.equal(result.recordsObserved, 1);
  assert.equal(result.unavailable[0].observed, undefined);
});

for (const corruption of ['private-repo', 'wrong-author', 'wrong-number', 'inconsistent-merge-date', 'error-object']) {
  test(`unverified ${corruption} responses cannot become catalogue drift or success`, async () => {
    const result = await checkContributions(catalogue(), { request: async record => {
      const value = response(record);
      if (corruption === 'private-repo') value.base.repo.private = true;
      if (corruption === 'wrong-author') value.user.login = 'someone-else';
      if (corruption === 'wrong-number') value.number = 100;
      if (corruption === 'inconsistent-merge-date') value.merged_at = mergedAt;
      return corruption === 'error-object' ? { message: 'Not found' } : value;
    } });
    assert.equal(result.status, 'UNAVAILABLE');
    assert.equal(result.mismatches.length, 0);
    assert.equal(result.observations.length, 0);
    assert.equal(result.unavailable[0].code, 'UNVERIFIED_RESPONSE');
  });
}

test('invalid destinations, duplicates and excessive catalogues fail before requests', () => {
  const bad = catalogue(); bad.projects[0].pullRequests[0].url = 'https://example.test/research/library/pull/1';
  assert.throws(() => catalogueRecords(bad), /URL\/number/);
  const duplicate = catalogue(); duplicate.projects[0].pullRequests.push(duplicate.projects[0].pullRequests[0]);
  assert.throws(() => catalogueRecords(duplicate), /duplicated/);
  assert.throws(() => catalogueRecords(catalogue(Array(101).fill('open'))), /limited/);
});

const serve = async (t, handler) => {
  let requests = 0;
  const server = http.createServer((req, res) => handler(req, res, ++requests));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const local = `http://127.0.0.1:${server.address().port}/fixture`;
  return { requests: () => requests, fetcher: (url, options) => {
    assert.match(url, /^https:\/\/api\.github\.com\/repos\/research\/library\/pulls\/\d+$/);
    assert.equal(options.redirect, 'error');
    return fetch(local, options);
  } };
};

test('transient HTTP failures retry within a fixed budget and then observe actual JSON', async t => {
  const record = catalogueRecords(catalogue())[0], waits = [];
  const fixture = await serve(t, (req, res, count) => {
    assert.equal(req.headers['x-github-api-version'], '2026-03-10');
    res.writeHead(count < 3 ? 503 : 200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(response(record)));
  });
  const value = await fetchPullRequest(record, { fetcher: fixture.fetcher, sleep: async ms => waits.push(ms) });
  assert.equal(value.number, 1);
  assert.equal(fixture.requests(), 3);
  assert.deepEqual(waits, [500, 1000]);
});

test('persistent HTTP failure and a missing PR remain unavailable with bounded request counts', async t => {
  const record = catalogueRecords(catalogue())[0];
  for (const status of [503, 404]) {
    const fixture = await serve(t, (req, res) => { res.writeHead(status); res.end('Unavailable'); });
    await assert.rejects(fetchPullRequest(record, { fetcher: fixture.fetcher, sleep: async () => {} }), /HTTP_UNAVAILABLE/);
    assert.equal(fixture.requests(), status === 503 ? 3 : 1);
  }
});

test('rate limits stop all remaining requests and never clear a stale catalogue', async t => {
  const fixture = await serve(t, (req, res) => {
    res.writeHead(429, { 'retry-after': '60' }); res.end('Rate limited');
  });
  const result = await checkContributions(catalogue(['open', 'open']), {
    request: (record, options) => fetchPullRequest(record, { ...options, fetcher: fixture.fetcher,
      sleep: async () => assert.fail('Do not retry ahead of the requested cooldown') }),
  });
  assert.equal(result.status, 'UNAVAILABLE');
  assert.equal(fixture.requests(), 1);
  assert.deepEqual(result.unavailable.map(row => row.code), ['RATE_LIMIT', 'REQUESTS_STOPPED']);
});

test('total timeout includes a stalled body and does not claim the unvisited record was checked', async t => {
  const fixture = await serve(t, (req, res) => { res.writeHead(200); res.flushHeaders(); });
  const result = await checkContributions(catalogue(['open', 'open']), {
    totalTimeoutMs: 50,
    request: (record, options) => fetchPullRequest(record, { ...options, fetcher: fixture.fetcher }),
  });
  assert.equal(result.status, 'UNAVAILABLE');
  assert.equal(result.recordsObserved, 0);
  assert.deepEqual(result.unavailable.map(row => row.code), ['TOTAL_TIMEOUT', 'TOTAL_TIMEOUT']);
});

test('a private report cannot enter the repository through a symlink or overwrite earlier evidence', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'contribution-report-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const repo = path.join(directory, 'repo'), external = path.join(directory, 'external');
  await fs.mkdir(repo); await fs.mkdir(external);
  const alias = path.join(external, 'alias'); await fs.symlink(repo, alias);
  await assert.rejects(writePrivateReport(path.join(repo, 'docs/report.json'), {}, repo), /outside/);
  await assert.rejects(writePrivateReport(path.join(alias, 'report.json'), {}, repo), /outside/);
  const filename = path.join(external, 'report.json');
  await writePrivateReport(filename, { status: 'UNAVAILABLE' }, repo);
  await assert.rejects(writePrivateReport(filename, { status: 'CURRENT' }, repo), { code: 'EEXIST' });
  assert.deepEqual(JSON.parse(await fs.readFile(filename, 'utf8')), { status: 'UNAVAILABLE' });
});
