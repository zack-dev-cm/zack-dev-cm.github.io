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
  assert.equal(updateConstantsSource(updated, stats), updated);
  assert.throws(() => updateConstantsSource(source.replace('Tracked public skills', 'Removed metric'), stats), /Tracked public skills metric row/);
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
