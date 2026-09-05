import assert from 'node:assert/strict';
import test from 'node:test';
import { readProjectCatalogue } from '../scripts/generate-project-markdown.mjs';
import { searchProjects } from '../utils/project-search.mjs';

// Use the reviewed catalogue consumed by both the runtime and generated pages.
// Assertions describe evidence-backed results, not a second search algorithm.
const catalogue = await readProjectCatalogue();
const ids = (projects) => projects.map((project) => project.id);
const search = (query, options) => searchProjects(catalogue, query, options);
const assertIncludes = (projects, expected, query) => {
  for (const id of expected) assert.ok(ids(projects).includes(id), `${query}: missing project ${id}`);
};
const assertExcludes = (projects, excluded, query) => {
  for (const id of excluded) assert.ok(!ids(projects).includes(id), `${query}: unrelated project ${id}`);
};

test('specific names and aliases remain precise across case, spacing and punctuation', () => {
  for (const [query, id] of [
    ['  AGNITRA  ', 81], ['agnitra ai', 81], ['agnitra labs', 81],
    ['Agnitra - ML Profiling & Optimization', 81],
    ['calorio', 11], ['kalorio', 11], ['yourfit', 11],
    ['Fast OCR', 70], ['FastOCR', 70],
    ['AutoToloka', 12], ['Auto Toloka', 12],
  ]) {
    assert.deepEqual(ids(search(query)), [id], query);
  }
});

test('OpenCV finds declared CV work without admitting ordinary open-source words', () => {
  const results = search('OpenCV');
  assertIncludes(results, [76, 77, 71, 73, 74, 21], 'OpenCV');
  // These were admitted through "open", despite having no OpenCV evidence.
  assertExcludes(results, [49, 50, 51, 43, 102], 'OpenCV');
});

test('ONNX retains its supported projects and excludes unrelated services', () => {
  const results = search('ONNX');
  assertIncludes(results, [70, 63, 71, 80, 41], 'ONNX');
  assertExcludes(results, [11, 104, 49], 'ONNX');
});

test('CAD is discoverable through visible sections without losing its limitations', () => {
  const cad = catalogue.find((project) => project.id === 102);
  assert.ok(cad);
  assert.match(cad.caseStudySections.map((section) => section.body).join(' '), /IFC export is experimental/i);
  for (const query of ['3D', 'IFC']) {
    const found = search(query).find((project) => project.id === cad.id);
    assert.ok(found, `${query}: missing the engineering geometry case study`);
    assert.deepEqual(found.caseStudySections, cad.caseStudySections, `${query}: retain the evidence and stage context`);
  }
});

test('point-cloud compounds do not turn into generic cloud or talking-point searches', () => {
  for (const query of ['point cloud', 'point-cloud', 'pointcloud']) {
    const results = search(query);
    assert.equal(results[0]?.id, 102, query);
    assertExcludes(results, [40, 29, 63, 35, 44], query);
  }
});

test('visible R&D and app keywords do not produce false empty results', () => {
  for (const query of ['R&D', 'r and d']) {
    assertIncludes(search(query), [101, 103, 72], query);
  }
  assertIncludes(search('app'), [10, 63], 'app');
});

test('combined capability queries put supported major work ahead of generic tooling', () => {
  const mobile = search('mobile inference');
  assert.ok(ids(mobile.slice(0, 3)).includes(63), 'Mobile model inference should surface Dermaself');
  assertExcludes(mobile.slice(0, 3), [49, 50, 51], 'mobile inference');
  const documents = search('document recognition');
  assert.ok(documents.slice(0, 3).some((project) => [70, 101].includes(project.id)),
    'Document recognition should surface the OCR service or document-AI case study');
  assertExcludes(documents.slice(0, 3), [49, 50, 51], 'document recognition');
});

test('shared overview artwork cannot establish an unrelated video-search capability', () => {
  const results = search('video search', { catalogue });
  assert.equal(results[0]?.id, 72, 'Surface the actual multimodal video-search case study');
  assertExcludes(results, [70, 71, 76], 'video search');

  const ocr = catalogue.find((project) => project.id === 70);
  assert.ok(ocr);
  assert.deepEqual(searchProjects([ocr], 'video search', { catalogue }), [],
    'Filtering to one card must not make its shared overview illustration count as project evidence');
});

test('a marketplace tracker does not inherit computer-vision capability from referenced metrics', () => {
  const results = search('computer vision', { catalogue });
  assertIncludes(results, [63, 70, 71, 76, 102], 'computer vision');
  assertExcludes(results, [53], 'computer vision');
});

test('sorting an active query preserves its results and applies the chosen order', () => {
  const relevant = search('ONNX');
  assert.ok(relevant.length > 1, 'Use a real multi-result query');
  const alphabetical = search('ONNX', { sort: 'alpha' });
  const recent = search('ONNX', { sort: 'recent' });
  const expectedIds = [...ids(relevant)].sort((a, b) => a - b);
  for (const result of [alphabetical, recent]) {
    assert.deepEqual([...ids(result)].sort((a, b) => a - b), expectedIds);
  }
  const titles = alphabetical.map((project) => project.title);
  assert.deepEqual(titles, [...titles].sort((a, b) => a.localeCompare(b)));
  const dates = recent.map((project) => Date.parse(project.createdAt || ''));
  const knownDates = dates.filter(Number.isFinite);
  assert.ok(new Set(knownDates).size > 1, 'Recent-order regression needs distinct recorded dates');
  for (let index = 1; index < dates.length; index += 1) {
    const previous = Number.isFinite(dates[index - 1]) ? dates[index - 1] : -Infinity;
    const current = Number.isFinite(dates[index]) ? dates[index] : -Infinity;
    assert.ok(previous >= current, 'Recent puts declared dates first, newest to oldest');
  }
});

test('unknown queries stay empty and clearing recovers the complete reviewed catalogue', () => {
  assert.deepEqual(search('zzzzq qqqqx'), []);
  assert.deepEqual(new Set(ids(search('   '))), new Set(ids(catalogue)));
});
