import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import { getProjectCanonicalSlug, getProjectRouteSlugs, selectReviewedFeedProjects, mergeProjects, assertUniqueProjectRoutes } from '../utils/project-catalog.mjs';
import { readProjectCatalogue } from '../scripts/generate-project-markdown.mjs';
import { addPortfolioCaseStudyEntries, readCuratedAgnitra, preserveReviewedProjectArchive } from '../scripts/sync-github-portfolio-updates.mjs';

const root = new URL('../', import.meta.url);
const feed = JSON.parse(await fs.readFile(new URL('public/portfolio-updates.json', root), 'utf8'));
// A fixed fixture keeps safety checks independent of the daily feed's time window.
const example = {
  id: 1238345725, title: 'Interactive Doc Mapper', repoFullName: 'zack-dev-cm/interactive-doc-mapper',
  description: 'Interactive project documentation.', keyFeatures: ['Workflow maps', 'Package references'],
  techStack: ['JavaScript', 'HTML'], links: [{ text: 'GitHub', url: 'https://github.com/zack-dev-cm/interactive-doc-mapper' }],
  images: [], thumbnail: '', review: { status: 'PASS', gates: [
    'public-github-api-only', 'private-repo-default-off', 'safe-public-links-only', 'readme-code-blocks-stripped',
    'leak-pattern-scan', 'instruction-bleed-scan', 'clawhub-stat-crosslink', 'clawpatch-review-ready',
  ] },
};
const makeFeed = (project) => ({ review: example.review, projects: [project] });

test('the page generator includes every reviewed runtime project and its shared canonical route', async () => {
  const catalogue = await readProjectCatalogue();
  const reviewed = selectReviewedFeedProjects(feed, ['zack-dev-cm/zack-dev-cm.github.io', 'zack-dev-cm/antirot']);
  assert.ok(reviewed.length > 0);
  for (const project of reviewed) {
    const routes = new Set(getProjectRouteSlugs(project));
    const match = catalogue.find((candidate) => candidate.id === project.id
      || getProjectRouteSlugs(candidate).some((slug) => routes.has(slug)));
    assert.ok(match, `No generated case study for runtime card: ${project.title}`);
  }
  assertUniqueProjectRoutes(catalogue);
  // These previously returned 404 even though their archive links opened modals.
  for (const slug of ['unitree-g1-colab-ik', 'interactive-doc-mapper', 'open-feed-recsys-lab']) {
    if (reviewed.some((project) => getProjectCanonicalSlug(project) === slug)) {
      assert.ok(catalogue.some((project) => getProjectCanonicalSlug(project) === slug), slug);
    }
  }
});

test('renamed curated work retains its copy and intentional omissions when matching a stale feed', () => {
  const curated = {
    id: 81, title: 'Agnitra - ML Profiling & Optimization', legacySlugs: ['agnitra-ai-inference-optimizer'],
    description: 'A released profiling SDK.', images: [], thumbnail: '', links: [], hideImages: true,
  };
  const stale = {
    id: 900, title: 'Agnitra AI Inference Optimizer', description: 'Retired description',
    longDescription: 'Retired claims', benchmarks: [{ label: 'Old claim', value: 'unverified' }],
    images: [{ url: 'images/retired.png', alt: 'Retired' }], thumbnail: 'images/retired.png',
    links: [{ url: 'https://github.com/zack-dev-cm/agnitra' }],
    repoFullName: 'zack-dev-cm/agnitra', createdAt: '2026-05-06',
  };
  const merged = mergeProjects([curated], [stale, { ...stale, id: 81 }]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].description, curated.description);
  assert.equal(merged[0].longDescription, undefined);
  assert.equal(merged[0].benchmarks, undefined);
  assert.deepEqual(merged[0].images, []);
  assert.equal(merged[0].thumbnail, '');
  assert.equal(merged[0].hideImages, true);
  assert.ok(getProjectRouteSlugs(merged[0]).includes('agnitra-ai-inference-optimizer'));
  assert.equal(getProjectCanonicalSlug(merged[0]), 'agnitra-ml-profiling-optimization');
  assert.equal(curated.repoFullName, undefined, 'Input records must remain unchanged');
});

test('feed review gates, exclusions and unsafe content cannot be bypassed by a PASS label', () => {
  assert.equal(selectReviewedFeedProjects(makeFeed(example)).length, 1);
  assert.equal(selectReviewedFeedProjects({ ...makeFeed(example), review: undefined }).length, 0);
  assert.equal(selectReviewedFeedProjects(makeFeed(example), [example.repoFullName.toUpperCase()]).length, 0);
  const variants = [
    { ...example, review: { ...example.review, status: 'REVIEW' } },
    { ...example, review: { ...example.review, gates: [] } },
    { ...example, repoFullName: 'unknown-owner/private-project' },
    { ...example, links: [{ text: 'Run', url: 'javascript:alert(1)' }] },
    { ...example, canonicalLinks: { website: 'https://127.0.0.1/private' } },
    { ...example, links: [{ text: 'Internal', url: 'https://example.internal/' }] },
    { ...example, thumbnail: 'images/../../private.png' },
    { ...example, images: [{ url: 'data:image/svg+xml,unsafe', alt: 'Unsafe' }] },
    { ...example, longDescription: '<script>alert(1)</script>' },
    { ...example, techStack: ['Python'] },
  ];
  for (const project of variants) assert.equal(selectReviewedFeedProjects(makeFeed(project)).length, 0);
});

test('shared slugs preserve public links and reject collisions before writing pages', () => {
  const project = { id: 102, title: 'Engineering Drawing & CAD Analysis', legacySlugs: ['old-cad-research'], links: [] };
  assert.equal(getProjectCanonicalSlug(project), 'engineering-drawing-cad-analysis');
  assert.deepEqual(getProjectRouteSlugs(project), ['engineering-drawing-cad-analysis', 'old-cad-research']);
  assert.throws(() => assertUniqueProjectRoutes([project, { ...project, id: 999 }]), /route collision/);
});

test('the next offline sync overlay retains the current curated Agnitra media, claims and source identity', async () => {
  const updates = { latestUpdates: [], projects: [] };
  const source = readCuratedAgnitra(await fs.readFile(new URL('constants.ts', root), 'utf8'));
  addPortfolioCaseStudyEntries(updates, '2026-09-05', source);
  const synced = updates.projects.find((project) => project.id === 81);
  const curated = (await readProjectCatalogue()).find((project) => project.id === 81);
  assert.deepEqual(synced.images, source.images);
  assert.equal(synced.thumbnail, source.thumbnail);
  assert.equal(curated.images[0].url, `https://zack-dev-cm.github.io/docs/${synced.images[0].url}`);
  assert.equal(synced.images[0].alt, curated.images[0].alt);
  assert.equal(synced.images[0].caption, curated.images[0].caption);
  assert.equal(synced.longDescription, curated.longDescription);
  assert.deepEqual(synced.keyFeatures, curated.keyFeatures);
  assert.deepEqual(synced.caseStudySections, curated.caseStudySections);
  assert.equal(synced.sourceId, 'agnitra-ai-inference-optimizer', 'Keep the established source identity');
  assert.equal(synced.benchmarks, undefined);
  await fs.access(new URL(`public/${synced.images[0].url}`, root));
  assert.throws(() => addPortfolioCaseStudyEntries({ projects: [], latestUpdates: [] }, '2026-09-05'), /curated Agnitra record is required/);
});

test('aging the news window preserves reviewed project routes and dates, excluding profiles and unreviewed records', () => {
  const old = { ...example, createdAt: '2026-03-01', review: { ...example.review, checkedAt: '2026-08-06' } };
  const profile = { ...old, id: 1357813692, title: 'Zack Dev Cm', repoFullName: 'zack-dev-cm/zack-dev-cm' };
  const unreviewed = { ...old, id: 999, title: 'Unreviewed project', repoFullName: 'zack-dev-cm/unreviewed', review: { ...old.review, status: 'REVIEW' } };
  const previous = { review: example.review, projects: [old, profile, unreviewed] };
  const latestUpdates = [{ title: 'Current update', createdAt: '2026-09-05' }];
  const refreshed = preserveReviewedProjectArchive({ projects: [], latestUpdates }, previous);
  assert.deepEqual(refreshed.projects, [old]);
  assert.equal(refreshed.projects[0].review.checkedAt, '2026-08-06');
  assert.equal(refreshed.projects[0].createdAt, '2026-03-01');
  assert.equal(getProjectCanonicalSlug(refreshed.projects[0]), 'interactive-doc-mapper');
  assert.deepEqual(refreshed.latestUpdates, latestUpdates, 'Archived records must not be reinserted as current news');
  assert.equal(selectReviewedFeedProjects(makeFeed(profile)).length, 0);
  const current = { ...old, description: 'Current public summary', createdAt: '2026-09-05' };
  const merged = preserveReviewedProjectArchive({ projects: [current], latestUpdates }, previous);
  assert.equal(merged.projects.length, 1);
  assert.equal(merged.projects[0].description, current.description);
  assert.equal(merged.projects[0].createdAt, current.createdAt);
});
