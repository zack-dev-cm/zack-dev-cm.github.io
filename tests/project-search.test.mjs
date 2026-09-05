import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
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

test('project-name spacing works with supported qualifiers without bypassing other query terms', () => {
  for (const [query, id] of [
    ['FastOCR ONNX', 70], ['Fast OCR ONNX', 70],
    ['Auto Toloka Python', 12], ['AutoToloka Python', 12],
  ]) {
    assert.deepEqual(ids(search(query)), [id], query);
  }
  for (const query of ['FastOCR Calorio', 'Auto Toloka Qdrant']) {
    assert.deepEqual(search(query), [], `${query}: a recognized name must not ignore an unsupported qualifier`);
  }
});

test('Node.js spelling variants find the same declared technology projects', () => {
  const expected = new Set(ids(search('Node.js')));
  assert.ok(expected.size > 0, 'Use a technology represented in the actual catalogue');
  for (const query of ['node js', 'nodejs']) {
    assert.deepEqual(new Set(ids(search(query))), expected, query);
  }
});

test('MLOps spacing does not require a recruiter to know a preferred spelling', () => {
  const expected = new Set(ids(search('MLOps')));
  assert.ok(expected.size > 0);
  for (const query of ['ML Ops', 'ML-Ops']) {
    assert.deepEqual(new Set(ids(search(query))), expected, query);
  }
});

test('hyphenating 3D retains the same engineering and geometry results', () => {
  const expected = new Set(ids(search('3D')));
  assert.ok(expected.has(102), 'The geometry case study must remain discoverable');
  assert.deepEqual(new Set(ids(search('3-D'))), expected);
});

test('technical punctuation keeps C, C++ and C# as distinct languages', () => {
  // The actual catalogue has no verified C++/C# entries. These controlled
  // records guard matching behavior without inventing public project claims.
  const languages = ['C', 'C++', 'C#'];
  const fixtures = languages.map((language, index) => ({
    id: -(index + 1),
    title: `Language tooling ${index + 1}`,
    techStack: [language],
  }));
  for (const [index, language] of languages.entries()) {
    assert.deepEqual(ids(searchProjects(fixtures, language)), [fixtures[index].id], language);
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

test('structured research status remains discoverable through ordinary hiring vocabulary', () => {
  const researchers = catalogue.filter((project) => project.projectKind === 'research');
  assert.ok(researchers.length > 0);
  assertIncludes(search('research'), ids(researchers), 'research');
  assert.deepEqual(new Set(ids(search('R&D'))), new Set(ids(search('research'))));
});

test('ML acronyms and recruiter role phrasing preserve supported task matches', () => {
  const longForm = search('machine learning');
  assert.ok(longForm.length > 0, 'The actual catalogue contains ML work');
  assert.deepEqual(new Set(ids(search('ML'))), new Set(ids(longForm)));
  assert.deepEqual(new Set(ids(search('senior machine learning engineer'))), new Set(ids(longForm)));
  assert.deepEqual(new Set(ids(search('looking for experience with Python machine learning'))),
    new Set(ids(search('Python ML'))));
});

test('reviewed capability phrases survive spelling and morphology variants', () => {
  for (const [left, right] of [['benchmarking', 'benchmark'], ['evaluation', 'evals'],
    ['testing', 'test'], ['optimization', 'optimisation'], ['agent', 'agentic']]) {
    assert.deepEqual(new Set(ids(search(left))), new Set(ids(search(right))), `${left} / ${right}`);
  }
});

test('limitations, audience notes and references do not establish capabilities', () => {
  const fixtures = [
    { id: -1, title: 'Archive', description: 'Prototype inference without claiming production deployment.' },
    { id: -2, title: 'Install helper', description: 'Requires a directory; no silent workspace inference.' },
    { id: -3, title: 'Presentation builder', description: 'Writes decks for agents and recruiters.' },
    { id: -4, title: 'Creator studio', description: 'Builds a mini app inspired by a research paper.' },
    { id: -5, title: 'Claim checker', description: 'A source receipt rather than a medical review tool.' },
    { id: -6, title: 'Geometry prototype', description: 'Manufacturing-ready drawings remain separate research goals.' },
  ];
  for (const [index, query] of ['production deployment', 'inference', 'agents', 'research', 'medical', 'manufacturing ready'].entries()) {
    assert.deepEqual(searchProjects([fixtures[index]], query), [], query);
  }
  const ocr = { id: -7, title: 'Text service', description: 'Runs OCR inference without network access.' };
  assert.deepEqual(ids(searchProjects([ocr], 'OCR inference')), [ocr.id], 'Retain affirmative capability before the limitation');
  const offlineOcr = { ...ocr, description: 'Without API keys, it runs OCR inference locally.' };
  assert.deepEqual(ids(searchProjects([offlineOcr], 'OCR inference')), [ocr.id], 'Retain the predicate after an operating constraint');
  const unsupported = { id: -8, title: 'Cosmetic tool', description: 'Medical diagnosis is not supported.' };
  assert.deepEqual(searchProjects([unsupported], 'medical diagnosis'), [], 'Do not turn a negated subject into a capability');
  const unchanged = JSON.stringify(fixtures);
  searchProjects(fixtures, 'inference');
  assert.equal(JSON.stringify(fixtures), unchanged, 'Never remove the visible scope limitations');
});

test('compound tasks require the relationship, while independent technologies compose', () => {
  const fixtures = [
    { id: -1, title: 'Review tool', description: 'Image segmentation and report generation.', techStack: ['Python', 'ONNX'] },
    { id: -2, title: 'Creative tool', description: 'Image generation for article covers.', techStack: ['Python'] },
  ];
  assert.deepEqual(ids(searchProjects(fixtures, 'image generation')), [-2]);
  assert.deepEqual(ids(searchProjects(fixtures, 'Python ONNX')), [-1]);
  const imageOnly = { id: -3, title: 'Cover designer', description: 'Image generation from text prompts.' };
  for (const query of ['image generation and text generation', 'text generation and image generation']) {
    assert.deepEqual(searchProjects([imageOnly], query), [], 'Keep both compound tasks and repeated query words');
  }
  const oceanMapping = { id: -4, title: 'Ocean mapping', description: 'Machine learning for deep ocean mapping.' };
  for (const query of ['machine learning deep learning', 'deep learning machine learning']) {
    assert.deepEqual(searchProjects([oceanMapping], query), [], 'Do not consume a word shared by two separate requested capabilities');
  }
});

test('generic exact aliases prioritize but do not hide other independently matching work', () => {
  const fixtures = [
    { id: -1, title: 'Notebook collection', aliases: ['colab prototype archive'] },
    { id: -2, title: 'Colab CV/DL Prototype Archive', description: 'Colab computer-vision prototypes.' },
  ];
  const expected = new Set(ids(fixtures));
  for (const query of ['colab prototype archive', 'prototype archive colab']) {
    assert.deepEqual(new Set(ids(searchProjects(fixtures, query))), expected, query);
  }
});

test('a curated topic can reorder supported work but cannot manufacture a capability match', () => {
  const fixtures = [
    { id: -1, title: 'Multimodal video search', description: 'Search keyframes and speech transcripts.' },
    { id: -2, title: 'Drawing catalogue', description: 'Match room materials to a product catalogue.' },
  ];
  const ordinary = searchProjects(fixtures, 'video search');
  const suggested = searchProjects(fixtures, 'video search', { boostedProjectIds: [-2, -1] });
  assert.deepEqual(new Set(ids(suggested)), new Set(ids(ordinary)));
  assert.deepEqual(ids(suggested), [-1]);
});

test('substantive implementation evidence outranks a sparse generic title', () => {
  const fixtures = [
    { id: -1, title: 'Agent listing', description: 'Name retained only.', searchProfile: { evidence: 'name-only' } },
    { id: -2, title: 'Document system', description: 'Agents retrieve source passages and save review artifacts.', searchProfile: { evidence: 'implementation' } },
    { id: -3, title: 'Agent instruction pack', searchProfile: { evidence: 'workflow' } },
  ];
  assert.deepEqual(ids(searchProjects(fixtures, 'agents')), [-2, -3, -1]);
  assert.equal(searchProjects(fixtures, 'Agent listing')[0]?.id, -1, 'Keep direct name discovery');
});

test('catalogue extraction preserves optional reviewed search profiles', async () => {
  const reviewedProfile = {
    capabilities: ['research', 'evaluation harness'],
    evidence: 'implementation',
  };
  const records = [
    { id: 700001, title: 'Reviewed profile fixture', searchProfile: reviewedProfile },
    { id: 700002, title: 'Unclassified profile fixture' },
  ].map((record) => ({
    ...record, description: 'Parser fixture', keyFeatures: [], techStack: [],
    links: [], images: [], thumbnail: '',
  }));
  const source = ts.createSourceFile(
    'profile-fixture.ts', `export const PROJECTS = ${JSON.stringify(records)};`,
    ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS,
  );
  const catalogue = await readProjectCatalogue(source);
  assert.deepEqual(catalogue.find((project) => project.id === records[0].id)?.searchProfile, reviewedProfile);
  assert.equal(catalogue.find((project) => project.id === records[1].id)?.searchProfile, undefined,
    'Existing records and reviewed feed projects need no inferred capability metadata');
});
