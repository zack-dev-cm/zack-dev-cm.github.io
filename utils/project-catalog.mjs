// Shared by the browser archive and static page generator. This module has no I/O.
export const slugify = (value) => String(value || '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';

const uniqueStrings = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.trim()).map((value) => value.trim()))];
const byCreatedAt = (projects) => [...projects].sort((a, b) =>
  (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0));

const repoFromLinks = (links = []) => {
  for (const { url } of links) {
    try {
      const parsed = new URL(url);
      const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
      if (parsed.hostname === 'github.com' && owner && repo) return `${owner}/${repo}`;
    } catch { /* A missing repository link does not change title-based routing. */ }
  }
  return '';
};

export const getProjectSlug = (project) => slugify(project.repoFullName || project.repoId || repoFromLinks(project.links) || project.title || project.id);
export const getProjectCanonicalSlug = (project) => slugify(project.title || project.id);
export const getProjectRouteSlugs = (project) => uniqueStrings([
  getProjectCanonicalSlug(project), getProjectSlug(project), ...(project.legacySlugs || []),
].map(slugify));

const REQUIRED_REVIEW_GATES = [
  'private-repo-default-off', 'safe-public-links-only', 'readme-code-blocks-stripped',
  'leak-pattern-scan', 'instruction-bleed-scan', 'clawhub-stat-crosslink', 'clawpatch-review-ready',
];
const hasReview = (review, sourceGate) => review?.status === 'PASS'
  && [...REQUIRED_REVIEW_GATES, sourceGate].every((gate) => review.gates?.includes(gate));

const isPublicHttpsUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    if (!host.includes('.') || /(?:^localhost$|\.(?:localhost|local|internal)$|[:\[\]])/.test(host)) return false;
    if (/^\d+(?:\.\d+){3}$/.test(host)) {
      const [a, b] = host.split('.').map(Number);
      if ([0, 10, 127].includes(a) || a >= 224 || (a === 169 && b === 254)
        || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31)) return false;
    }
    return true;
  } catch { return false; }
};

const isPublicMediaUrl = (value) => isPublicHttpsUrl(value)
  || (typeof value === 'string' && /^(?:\/docs\/|docs\/)?images\/[a-z0-9_./-]+$/i.test(value) && !value.includes('..'));

const isReviewedFeedProject = (project) => {
  if (!project || !Number.isSafeInteger(project.id) || typeof project.title !== 'string' || !project.title.trim()) return false;
  const isStatic = project.source === 'portfolio-static';
  if (!hasReview(project.review, isStatic ? 'portfolio-static-source-backed' : 'public-github-api-only')) return false;
  if (!isStatic && !/^zack-dev-cm\/[a-z0-9._-]+$/i.test(project.repoFullName || '')) return false;
  const summary = project.longDescription || project.description;
  if (typeof summary !== 'string' || !summary.trim() || /new project added from github/i.test(summary)) return false;
  if (![project.keyFeatures, project.techStack].every((values) => Array.isArray(values) && values.length >= 2
    && values.every((value) => typeof value === 'string' && value.trim()))) return false;
  if (!Array.isArray(project.links) || (!project.links.length && !project.benchmarks?.length)) return false;
  if (!project.links.every((link) => typeof link?.text === 'string' && isPublicHttpsUrl(link.url))) return false;
  if (project.canonicalLinks && !Object.values(project.canonicalLinks).every(isPublicHttpsUrl)) return false;
  if (project.thumbnail && !isPublicMediaUrl(project.thumbnail)) return false;
  if (project.images && (!Array.isArray(project.images) || !project.images.every((image) =>
    typeof image?.alt === 'string' && isPublicMediaUrl(image.url)))) return false;
  // Review labels are not executable trust: reject active HTML and URL schemes even
  // if a malformed feed claims PASS. The release gate also scans the full payload.
  if (/<\/?[a-z][^>]*>|\b(?:javascript|vbscript|data):/i.test(JSON.stringify(project))) return false;
  return true;
};

export const selectReviewedFeedProjects = (feed, excludedRepos = []) => {
  if (!feed || !hasReview(feed.review, 'public-github-api-only') || !Array.isArray(feed.projects)) return [];
  const excluded = new Set(['zack-dev-cm/zack-dev-cm', ...excludedRepos.map((repo) => repo.toLowerCase())]);
  return byCreatedAt(feed.projects.filter((project) => isReviewedFeedProject(project)
    && !excluded.has((project.repoFullName || '').toLowerCase())));
};

const identityKeys = (project) => [`id:${project.id}`, ...getProjectRouteSlugs(project).map((slug) => `slug:${slug}`)];

export const mergeProjects = (curatedProjects, syncedProjects) => {
  const usedSynced = new Set();
  const mergedCurated = curatedProjects.map((primary) => {
    const keys = new Set(identityKeys(primary));
    const matches = syncedProjects.filter((project) => identityKeys(project).some((key) => keys.has(key)));
    matches.forEach((project) => usedSynced.add(project));
    if (!matches.length) return primary;
    const fallback = matches[0];
    return {
      // Deliberately absent curated metrics, descriptions and media stay absent.
      ...primary,
      legacySlugs: uniqueStrings([
        ...(primary.legacySlugs || []), ...matches.flatMap(getProjectRouteSlugs),
      ]).filter((slug) => slug !== getProjectCanonicalSlug(primary)),
      aliases: uniqueStrings([...(primary.aliases || []), ...matches.flatMap((project) => project.aliases || [])]),
      repoFullName: primary.repoFullName || fallback.repoFullName,
      repoId: primary.repoId ?? fallback.repoId,
      createdAt: primary.createdAt || fallback.createdAt,
    };
  });
  const merged = [...mergedCurated];
  const usedKeys = new Set(merged.flatMap(identityKeys));
  for (const project of syncedProjects) {
    if (usedSynced.has(project) || identityKeys(project).some((key) => usedKeys.has(key))) continue;
    merged.push(project);
    identityKeys(project).forEach((key) => usedKeys.add(key));
  }
  return byCreatedAt(merged);
};

// Reject route collisions before generation can overwrite a different project.
export const assertUniqueProjectRoutes = (projects) => {
  const owners = new Map();
  for (const project of projects) {
    for (const slug of getProjectRouteSlugs(project)) {
      if (owners.has(slug) && owners.get(slug) !== project.id) {
        throw new Error(`Project route collision: ${slug} (${owners.get(slug)}, ${project.id})`);
      }
      owners.set(slug, project.id);
    }
  }
};
