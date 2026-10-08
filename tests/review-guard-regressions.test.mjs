import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { collectFiles, getSecretViolations, readFileForLeakScan, validateCsp } from '../scripts/security-gate.mjs';
import { buildSearchConsoleReportFromCsv, validateSearchConsoleReport } from '../scripts/search-console-metrics.mjs';
import { isSafePublicUrl } from '../scripts/sync-github-portfolio-updates.mjs';
import { parseLinks } from '../scripts/validate-portfolio.mjs';

test('CSP validation rejects permissive first directives and duplicate restrictive copies', () => {
  const required = "default-src 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests";
  assert.deepEqual(validateCsp(required), []);
  for (const policy of [
    `object-src *; ${required}`,
    `frame-ancestors *; ${required}`,
    required.replace("object-src 'none'", "object-src https: 'none'"),
    required.replace('upgrade-insecure-requests', 'upgrade-insecure-requests.example'),
  ]) assert.ok(validateCsp(policy).length, policy);
});

test('textual assets in image and logo directories are scanned for secrets', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'public-asset-scan-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const fakeToken = 'ghp_' + 'A'.repeat(36);
  await fs.mkdir(path.join(root, 'public/images'), { recursive: true });
  await fs.mkdir(path.join(root, 'public/company-logos'), { recursive: true });
  await fs.writeFile(path.join(root, 'public/images/example.svg'), `<svg><text>${fakeToken}</text></svg>`);
  await fs.writeFile(path.join(root, 'public/company-logos/example.json'), JSON.stringify({ fixture: fakeToken }));
  await fs.writeFile(path.join(root, 'public/images/pixel.png'), Buffer.from([137, 80, 78, 71]));
  const files = await collectFiles(root, root);
  assert.deepEqual(files.map(file => file.relativePath).sort(), ['public/company-logos/example.json', 'public/images/example.svg']);
  for (const file of files) assert.match(getSecretViolations(file.relativePath, await readFileForLeakScan(file))[0], /GitHub token/);
});

test('unreadable ignored credential files block the leak scan', async (t) => {
  t.mock.method(fs, 'readFile', async () => { const error = new Error('permission denied'); error.code = 'EACCES'; throw error; });
  for (const relativePath of ['.env', '.env.production', 'keys/service.pem', 'keys/service.key']) {
    await assert.rejects(readFileForLeakScan({ relativePath, absolutePath: '/fixture' }), /could not read.*secret-bearing file/);
  }
});

test('public URL checks reject loopback, private and mapped IPv6 literals', () => {
  for (const url of ['https://[::1]/', 'https://[fc00::1]/', 'https://[fe80::1]/', 'https://[::ffff:127.0.0.1]/', 'https://localhost/', 'https://10.1.2.3/']) assert.equal(isSafePublicUrl(url), false, url);
  assert.equal(isSafePublicUrl('https://github.com/example/project'), true);
});

test('link parsing keeps incomplete entries visible to portfolio validation', () => {
  const source = ts.createSourceFile('fixture.ts', 'const links = [{ text: "Repository", url: "https://example.org/" }, { text: "Missing URL" }, { url: "https://example.org/unnamed" }, "invalid"];', ts.ScriptTarget.Latest, true);
  const links = parseLinks(source.statements[0].declarationList.declarations[0].initializer);
  assert.equal(links.length, 4);
  assert.ok(!links[1].url && !links[2].text && !links[3].text && !links[3].url);
});

test('missing or malformed CSV measurements are invalid rows rather than zero values', () => {
  const options = { requireClicks: true, requireQuery: true };
  for (const row of [
    'example,https://example.org/,bad,50,5',
    'example,https://example.org/,,50,5',
    'example,https://example.org/,3,,5',
    'example,https://example.org/,3,50,',
    'example,,3,50,5',
  ]) {
    const report = buildSearchConsoleReportFromCsv(`Query,Page,Clicks,Impressions,Position\n${row}`, 'fixture.csv', options);
    assert.equal(report.rows.invalid, 1, row);
    assert.equal(report.rows.valid, 0, row);
  }
});

test('JSON reports cannot certify search performance with absent or inconsistent weights', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'search-report-review-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const csv = await fs.readFile(new URL('./fixtures/search-console-average-position-good.csv', import.meta.url), 'utf8');
  const good = buildSearchConsoleReportFromCsv(csv, 'fixture.csv', { requireClicks: true, requireQuery: true });
  assert.equal(validateSearchConsoleReport(good), good);
  const fixture = path.join(root, 'report.json');
  const mutations = [
    report => { delete report.pages[0].weightedPosition; },
    report => { delete report.queries[0].weightedPosition; },
    report => { report.pages[0].clicks = '8'; },
    report => { report.totals.impressions = 9999; },
    report => { report.pages[0].weightedPosition = 0; },
    report => { report.queries[0].averagePosition = 1; },
  ];
  for (const mutate of mutations) {
    const report = structuredClone(good);
    mutate(report);
    assert.throws(() => validateSearchConsoleReport(report), /Invalid Search Console report/);
    await fs.writeFile(fixture, JSON.stringify(report));
    const result = spawnSync(process.execPath, ['scripts/review-search-console-position.mjs', fixture], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stdout, /SEARCH_CONSOLE_POSITION_GATE=fail.*invalid-export/s);
  }
  await fs.writeFile(fixture, JSON.stringify(good));
  const result = spawnSync(process.execPath, ['scripts/review-search-console-position.mjs', fixture], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /SEARCH_CONSOLE_POSITION_GATE=pass/);
});
