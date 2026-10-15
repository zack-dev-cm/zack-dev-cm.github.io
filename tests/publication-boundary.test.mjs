import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { assertPrivateReviewSurfacesAbsent, privateOperationalFields, linksToPrivateReviews } from '../scripts/publication-boundary.mjs';
import { stagePages, verifyStagedPages } from '../scripts/stage-pages.mjs';

const directory = async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'publication-boundary-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
};

test('repository publication rejects private sources and stale generated copies', async t => {
  for (const relative of ['codex-docs', 'public/oss-validation', 'docs/oss-validation', 'docs/codex']) {
    const root = await directory(t);
    await fs.mkdir(path.join(root, relative), { recursive: true });
    await fs.writeFile(path.join(root, relative, 'notes.json'), '{}');
    await assert.rejects(assertPrivateReviewSurfacesAbsent(root), /Private review material/);
    await assert.rejects(stagePages({ rootDir: root }), /Private review material/);
  }
});

test('staged artifact verification rejects private aliases before allowing publication', async t => {
  for (const relative of ['oss-validation', 'docs/oss-validation', 'codex', 'docs/codex']) {
    const root = await directory(t);
    await fs.mkdir(path.join(root, relative), { recursive: true });
    await assert.rejects(verifyStagedPages(root), /Private review material/);
  }
});

test('a symlink cannot restore a private publication route', async t => {
  const root = await directory(t);
  const target = await directory(t);
  await fs.mkdir(path.join(root, 'docs'));
  await fs.symlink(target, path.join(root, 'docs/codex'), 'dir');
  await assert.rejects(assertPrivateReviewSurfacesAbsent(root), /Private review material/);
});

test('raw generation records are detected inside nested arrays without exposing their contents', () => {
  const record = { examples: [{ review: { render_prompt: 'fictional private text' }, producer: { usage: { input_tokens: 1 } } }] };
  assert.deepEqual(privateOperationalFields(record), ['$.examples.0.review.render_prompt', '$.examples.0.producer.usage.input_tokens']);
});

test('public project facts, authorship and limitations remain publishable', async t => {
  const root = await directory(t);
  await fs.mkdir(path.join(root, 'public/science'), { recursive: true });
  await fs.writeFile(path.join(root, 'public/science/results.json'), '{}');
  await assertPrivateReviewSurfacesAbsent(root);
  assert.deepEqual(privateOperationalFields({ author: 'Example contributor', model: 'illustration', source: { sha256: 'example' }, unknowns: ['quantity'], seconds: 12 }), []);
});

test('private page links are rejected without blocking another project\u2019s public documentation', () => {
  assert.equal(linksToPrivateReviews('<a href="/docs/oss-validation/#status">Review</a>'), true);
  assert.equal(linksToPrivateReviews('<a href="/docs/codex/workflow.md">Notes</a>'), true);
  assert.equal(linksToPrivateReviews('https://zack-dev-cm.github.io/docs/oss-validation/status.json'), true);
  assert.equal(linksToPrivateReviews('https://github.com/example/tool/blob/main/docs/codex/architecture.md'), false);
  assert.equal(linksToPrivateReviews('<a href="/docs/contribution-lab/">Lesson</a>'), false);
});
