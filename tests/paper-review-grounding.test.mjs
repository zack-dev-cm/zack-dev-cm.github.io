import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReviewEntry, fetchArxivMetadataByIds, fetchCandidates, inferTopic, paperFromReview, parseRssItems, sanitizeLegacyReview } from '../scripts/update-paper-reviews.mjs';

// Independently paraphrased from https://arxiv.org/abs/2610.08936.
const robustnessPaper = {
  title: 'VCR-Bench: A Modular Open-Source Benchmark for Video Classification Robustness',
  summary: 'Video classifier robustness is difficult to compare across different implementations. We introduce a modular benchmark for adversarial evaluation of video classifiers with standardized video loading, attack settings, perceptual metrics and reproducible configuration presets.',
  arxivId: '2610.08936', authors: ['Maksim Plinskiy'], categories: ['cs.CV'],
  paperUrl: 'https://arxiv.org/abs/2610.08936', pdfUrl: 'https://arxiv.org/pdf/2610.08936', feedUrl: 'https://rss.arxiv.org/rss/cs.CV',
};

test('a classifier robustness benchmark cannot acquire visual-answer grounding claims', () => {
  const review = buildReviewEntry(robustnessPaper, 216);
  assert.equal(review.topicId, 'vision-robustness');
  assert.match(review.whatItClaims, /introduce a modular benchmark/);
  assert.match(review.productionAngle, /classification metrics/);
  assert.doesNotMatch([review.dek, review.technicalHinge, review.productionAngle].join(' '), /answerable|fluent|evidence routing|exact region/);
  assert.equal(review.readingScope, 'abstract');
  assert.equal(review.fullTextReviewed, false);
  assert.equal(review.proposedTestsRun, false);
  assert.match(review.productionAngle, /^Suggested test \(unrun\):/);
});

test('ordinary vision and policy terms do not imply multimodal QA or reinforcement learning', () => {
  assert.equal(inferTopic({ title: 'Image classification', summary: 'We study image classification under occlusion.' }).id, 'computer-vision');
  assert.equal(inferTopic({ title: 'Agent policy review', summary: 'Agents follow a tool access policy.' }).id, 'agent-systems');
  assert.equal(inferTopic({ title: 'Continual representation learning', summary: 'Self-supervised representations adapt to new data.' }).id, 'representation');
  assert.equal(inferTopic({ title: 'Reinforcement learning', summary: 'We evaluate a policy gradient method.' }).id, 'continual-rl');
});

test('reloading a note preserves its source scope and never invents a missing method', () => {
  const review = buildReviewEntry(robustnessPaper, 216);
  const normalized = sanitizeLegacyReview(review);
  for (const field of ['readingScope', 'topicId', 'fullTextReviewed', 'proposedTestsRun']) assert.equal(normalized[field], review[field]);
  const incomplete = sanitizeLegacyReview({ id: 'incomplete', title: 'An unrelated paper', categories: [] });
  assert.doesNotMatch(incomplete.whatItClaims, /recurrent transformer|constraint layer/);
  assert.equal(incomplete.readingScope, 'unrecorded');
});

test('rewriting requires a primary abstract instead of recycling earlier editorial prose', () => {
  assert.throws(() => paperFromReview({ ...robustnessPaper, dek: 'Editorial commentary' }, new Map()), /Missing primary abstract/);
  assert.throws(() => buildReviewEntry({ ...robustnessPaper, summary: '' }, 216), /Missing primary abstract/);
});

test('source ledgers retain code, dataset and analysis references across normalization and rewriting', () => {
  const sourceLedger = [
    { label: 'Code', url: 'https://github.com/example/benchmark' },
    { label: 'Dataset', url: 'https://example.org/dataset' },
    { label: 'Analysis', url: 'https://example.org/analysis' },
  ];
  const review = buildReviewEntry(robustnessPaper, 216, { sourceLedger });
  const normalized = sanitizeLegacyReview(review);
  for (const link of sourceLedger) assert.deepEqual(normalized.sourceLedger.find(item => item.url === link.url), link);
  assert.equal(new Set(normalized.sourceLedger.map(link => link.url)).size, normalized.sourceLedger.length);
});

test('RSS abstracts preserve escaped inequalities while stripping actual markup', () => {
  for (const description of ['We require x &lt; y and z &gt; w.', '<![CDATA[<p>We require x &lt; y and z &gt; w.</p>]]>']) {
    const xml = `<rss><channel><item><title>Comparison</title><link>https://arxiv.org/abs/2610.08936</link><description>${description}</description></item></channel></rss>`;
    assert.equal(parseRssItems(xml, 'cs.CV')[0].summary, 'We require x < y and z > w.');
  }
});

test('a complete primary-feed outage is a refresh failure rather than a successful empty update', async (t) => {
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => { requests++; return new Response('Unavailable', { status: 503 }); });
  await assert.rejects(fetchCandidates(), /All primary paper feeds failed/);
  assert.equal(requests, 6);
});

test('maintenance HTML with HTTP 200 cannot masquerade as an empty healthy research feed', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>Maintenance</html>'));
  await assert.rejects(fetchCandidates(), /All primary paper feeds failed/);
});

test('a metadata batch larger than the API default retrieves every requested abstract', async (t) => {
  const ids = Array.from({ length: 13 }, (_, index) => `2610.${String(10001 + index)}`);
  t.mock.method(globalThis, 'fetch', async (url) => {
    const request = new URL(url);
    const limit = Number(request.searchParams.get('max_results') || 10);
    const returned = request.searchParams.get('id_list').split(',').slice(0, limit);
    return new Response(`<feed>${returned.map(id => `<entry><id>https://arxiv.org/abs/${id}</id><title>Paper ${id}</title><summary>A primary abstract.</summary></entry>`).join('')}</feed>`);
  });
  const metadata = await fetchArxivMetadataByIds(ids);
  assert.deepEqual([...metadata.keys()], ids);
});
