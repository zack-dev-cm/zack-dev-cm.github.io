import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { canonicalJsonHash, compilePolicy, containsWithdrawnCopy, scanPublishedAssets, sha256, textFingerprints } from '../scripts/disclosure-policy.mjs';

// Fictional fixtures only. Retired material is represented by fingerprints in
// the production policy, so testing does not republish the material it blocks.
const paragraph = 'The imaginary purple observatory uses seven paper moons to calibrate its cardboard telescope.';
const data = { fixture: 'imaginary observatory', dimensions: { height: 7, width: 3 }, points: [[2, 4], [6, 8]] };
const binary = Buffer.from([0, 250, 11, 38, 197, 4, 88, 121]);
const policyData = {
  version: 1, wordCount: 8, textHashes: [...textFingerprints(paragraph)],
  jsonHashes: [canonicalJsonHash(data)], assets: [{ bytes: binary.length, sha256: sha256(binary) }],
};
const policy = compilePolicy(policyData);

test('withdrawn copy is caught in source, HTML, escaped JSON and wrapped PDF text', () => {
  for (const variant of [paragraph, JSON.stringify({ bullets: [paragraph] }),
    paragraph.toUpperCase().replaceAll(' ', '\n'),
    paragraph.replace('purple observatory', 'purple <em>observatory</em>'),
    paragraph.replaceAll(' ', '&#32;'), paragraph.replaceAll(' ', String.raw`\u0020`),
    paragraph.replace('observatory', 'obser-\nvatory'),
    paragraph.replaceAll(' ', String.raw`\n`)]) {
    assert.equal(containsWithdrawnCopy(variant, policy), true, variant);
  }
});

test('high-level CAD experience and unrelated projects are allowed', () => {
  assert.equal(containsWithdrawnCopy('Professional experience with computer vision, engineering drawings and 3D geometry. Private company R&D.', policy), false);
  assert.equal(containsWithdrawnCopy('A paper telescope on display at a public observatory.', policy), false);
});

test('renamed binaries and reformatted JSON are blocked regardless of extension', async (t) => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'disclosure-fixture-'));
  t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
  await fs.mkdir(path.join(rootDir, 'public', 'images'), { recursive: true });
  await fs.writeFile(path.join(rootDir, 'public/images/new-name.dat'), binary);
  await fs.writeFile(path.join(rootDir, 'public/changed-format.txt'), '\n'.repeat(5000) + JSON.stringify({ points: data.points, dimensions: { width: 3, height: 7 }, fixture: data.fixture }, null, 4));
  await fs.writeFile(path.join(rootDir, 'public/allowed.json'), JSON.stringify({ fixture: 'different data' }));
  await fs.writeFile(path.join(rootDir, 'public/images/renamed-copy.dat'), paragraph);
  const errors = await scanPublishedAssets({ rootDir, roots: ['public/'], policy });
  assert.equal(errors.length, 3);
  assert.ok(errors.some((error) => error.includes('new-name.dat') && error.includes('content identity')));
  assert.ok(errors.some((error) => error.includes('changed-format.txt') && error.includes('content identity')));
  assert.ok(errors.some((error) => error.includes('renamed-copy.dat') && error.includes('content fingerprint')));
});

test('published symlinks fail closed without reading their targets', async (t) => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'disclosure-symlink-'));
  t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
  await fs.mkdir(path.join(rootDir, 'public'));
  await fs.symlink(path.join(rootDir, 'missing-target'), path.join(rootDir, 'public/shortcut'));
  assert.match((await scanPublishedAssets({ rootDir, roots: ['public/'], policy }))[0], /symlink cannot be verified/);
});

test('invalid or empty fingerprint policies cannot silently disable the gate', () => {
  for (const value of [{}, { ...policyData, wordCount: 0 }, { ...policyData, textHashes: [] },
    { ...policyData, assets: [] }, { ...policyData, jsonHashes: ['invalid'] }]) {
    assert.throws(() => compilePolicy(value), /Invalid disclosure fingerprint policy/);
  }
});

test('the production policy loads and accepts the approved CV and catalogue', async () => {
  const root = new URL('../', import.meta.url);
  const production = compilePolicy(JSON.parse(await fs.readFile(new URL('scripts/disclosure-fingerprints.json', root), 'utf8')));
  for (const file of ['constants.ts', 'scripts/resume/resume-content.json']) {
    assert.equal(containsWithdrawnCopy(await fs.readFile(new URL(file, root), 'utf8'), production), false, file);
  }
  for (const summary of [
    'Professional experience with computer vision for engineering drawings and 3D geometry; private company R&D.',
    'Professional experience with computer vision, engineering drawings and 3D geometry. Private company R&D.',
  ]) assert.equal(containsWithdrawnCopy(summary, production), false, summary);
});
