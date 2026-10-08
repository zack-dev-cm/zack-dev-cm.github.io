import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { fetchSkillDetail, updateConstantsSource } from '../scripts/fetch-clawhub-stats.mjs';

test('a duplicate slug is resolved by publisher before fetching its statistics', async (t) => {
  let request;
  t.mock.method(globalThis, 'fetch', async (url) => {
    request = new URL(url);
    // The public API returns 409 for a bare duplicate slug.
    if (!request.searchParams.has('ownerHandle')) return new Response('Ambiguous slug', { status: 409 });
    return Response.json({ owner: { handle: 'zack-dev-cm' }, skill: { displayName: 'Example', stats: { downloads: 12, versions: 2, stars: 1 } } });
  });
  const row = await fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'duplicate-example', fallback: {} });
  assert.equal(request.searchParams.get('ownerHandle'), 'zack-dev-cm');
  assert.equal(row.downloads, 12);
  assert.equal(row.url, 'https://clawhub.ai/zack-dev-cm/duplicate-example');
});

test('an API response from a different publisher cannot enter the public snapshot', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ owner: { handle: 'someone-else' }, skill: { stats: { downloads: 900 } } }));
  await assert.rejects(fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'example', fallback: {} }), /belongs to someone-else/);
});

test('an unresolved ambiguity fails instead of manufacturing refreshed statistics', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('AMBIGUOUS_SKILL_SLUG', { status: 409 }));
  await assert.rejects(fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'example', fallback: { downloads: 5 } }), /HTTP 409/);
});

test('malformed listing counters fail before a refreshed snapshot can be written', async (t) => {
  for (const field of ['downloads', 'versions', 'stars']) {
    for (const value of ['invalid', 'Infinity', -1, 1.5, undefined, null, false, '', '0']) {
      t.mock.method(globalThis, 'fetch', async () => Response.json({ owner: { handle: 'zack-dev-cm' }, skill: { stats: { downloads: 12, versions: 2, stars: 1, [field]: value } } }));
      await assert.rejects(fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'example', fallback: {} }), new RegExp(`invalid ${field}`));
      t.mock.restoreAll();
    }
  }
});

test('missing detail counters cannot be replaced by listing fallbacks or freshly dated zeros', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ owner: { handle: 'zack-dev-cm' }, skill: { stats: { downloads: 12 } } }));
  await assert.rejects(fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'example', fallback: { downloads: 12, stars: 0 } }), /invalid versions/);
});

test('explicit zero detail counters are valid measurements', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ owner: { handle: 'zack-dev-cm' }, skill: { stats: { downloads: 0, versions: 0, stars: 0 } } }));
  const row = await fetchSkillDetail({ owner: 'zack-dev-cm', slug: 'example', fallback: {} });
  for (const field of ['downloads', 'versions', 'stars']) assert.equal(row[field], 0);
});

test('current editorial copy can refresh without the retired download-summary sentence', async () => {
  const source = await readFile(new URL('../constants.ts', import.meta.url), 'utf8');
  const stats = [
    { slug: 'data-science-cv-repro-lab', displayName: 'CV Repro Lab', downloads: 12, versions: 2, stars: 1, url: 'https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab', checkedAt: '2026-10-07' },
    { slug: 'sota-agent', displayName: 'SOTA Agent', downloads: 8, versions: 1, stars: 0, url: 'https://clawhub.ai/zack-dev-cm/sota-agent', checkedAt: '2026-10-07' }
  ];
  const updated = updateConstantsSource(source, stats);
  assert.match(updated, /Updated the public ClawHub tracker to 20 downloads across 2 public skills on 2026-10-07/);
  assert.match(updated, /label: "Tracked ClawHub downloads", value: "20"/);
  assert.match(updated, /label: "CV Repro Lab downloads", value: "20 total"/);
  assert.match(updated, /label: "ClawHub downloads", value: "20 total", context: "public ClawHub listings, 2026-10-07 \(data-science-cv-repro-lab \+ sota-agent\)"/);
  assert.match(updated, /label: "Published versions", value: "3 total", context: "public ClawHub listings, 2026-10-07/);
  assert.equal(updateConstantsSource(updated, stats), updated);
  assert.throws(() => updateConstantsSource(source.replace('Tracked public skills', 'Removed metric'), stats), /Tracked public skills metric row/);
});

test('missing linked skills cannot redatestamp a partial project total', async () => {
  const source = await readFile(new URL('../constants.ts', import.meta.url), 'utf8');
  const stats = [{ slug: 'data-science-cv-repro-lab', displayName: 'CV Repro Lab', downloads: 12, versions: 2, stars: 1, url: 'https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab', checkedAt: '2030-01-01' }];
  const updated = updateConstantsSource(source, stats);
  const project = (text) => {
    const projectsStart = text.indexOf('export const PROJECTS');
    return text.slice(text.indexOf('title: "CV Repro Lab Skills"', projectsStart), text.indexOf('title: "OpenClaw Sales Manager Automation', projectsStart));
  };
  const metrics = (text) => project(text).match(/benchmarks: \[[\s\S]*?\n    \]/)?.[0];
  assert.ok(metrics(source));
  assert.equal(metrics(updated), metrics(source));
});

test('public display names containing replacement tokens remain literal valid TypeScript', async () => {
  const source = await readFile(new URL('../constants.ts', import.meta.url), 'utf8');
  const displayName = "Example $& $` $' $$";
  const stats = [{ slug: 'data-science-cv-repro-lab', displayName, downloads: 12, versions: 2, stars: 1, url: 'https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab', checkedAt: '2026-10-07' }];
  const updated = updateConstantsSource(source, stats);
  const parsed = ts.createSourceFile('constants.ts', updated, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  assert.equal(parsed.parseDiagnostics.length, 0);
  assert.ok(updated.includes(`displayName: ${JSON.stringify(displayName)}`));
  assert.equal(updateConstantsSource(updated, stats), updated);
});
