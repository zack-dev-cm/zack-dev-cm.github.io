import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const DEFAULT_OWNER = 'zack-dev-cm';
const CLAWHUB_SITE_URL = 'https://clawhub.ai';
const CLAWHUB_HTTP_API_URL =
  process.env.CLAWHUB_HTTP_API_URL ?? 'https://wry-manatee-359.convex.site/api/v1';
const CLAWHUB_CONVEX_URL =
  process.env.CLAWHUB_CONVEX_URL ?? 'https://wry-manatee-359.convex.cloud';
const MIN_EXPECTED_SKILLS = Number(process.env.CLAWHUB_MIN_EXPECTED_SKILLS ?? 30);
const MIN_EXPECTED_DOWNLOADS = Number(process.env.CLAWHUB_MIN_EXPECTED_DOWNLOADS ?? 6000);
const PUBLIC_DISPLAY_NAME_OVERRIDES = new Map([
  ['browser-proof', 'Browser QA Report Pack'],
  ['proof-card-forge', 'Signal Card Forge']
]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');

const formatInteger = (value) => Number(value || 0).toLocaleString('en-US');

const fetchWithRetry = async (url, options, attempts = 4) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
};

const parseArgs = (argv) => {
  const options = {
    owner: DEFAULT_OWNER,
    write: false,
    verifyConstants: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      options.write = true;
    } else if (arg === '--verify-constants') {
      options.verifyConstants = true;
    } else if (arg === '--owner') {
      options.owner = argv[index + 1] ?? DEFAULT_OWNER;
      index += 1;
    } else if (arg.startsWith('--owner=')) {
      options.owner = arg.slice('--owner='.length);
    } else if (arg === '--help') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: npm run stats:clawhub -- [--owner zack-dev-cm] [--write] [--verify-constants]

Fetches live ClawHub publisher stats from the public Convex API.

Options:
  --owner <handle>       Publisher handle to fetch. Defaults to ${DEFAULT_OWNER}.
  --write                Replace CLAWHUB_DOWNLOAD_STATS in constants.ts and refresh summary copy.
  --verify-constants     Fail if constants.ts does not match live ClawHub stats.
`);
};

const convexQuery = async (pathName, args) => {
  const response = await fetchWithRetry(`${CLAWHUB_CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'portfolio-clawhub-stats/2.0'
    },
    body: JSON.stringify({ path: pathName, args, format: 'json' })
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`ClawHub Convex query ${pathName} failed with HTTP ${response.status}: ${text}`);
  }

  const payload = JSON.parse(text);
  if (payload.status !== 'success') {
    throw new Error(`ClawHub Convex query ${pathName} failed: ${text}`);
  }

  return payload.value;
};

const parseSlugFromHref = (href, owner) => {
  const parts = String(href || '').split('/').filter(Boolean);
  if (parts.length < 2 || parts[0] !== owner) {
    throw new Error(`Unexpected ClawHub href for ${owner}: ${href}`);
  }
  return parts[1];
};

const getPublicDisplayName = ({ slug, displayName, fallbackDisplayName }) => {
  return PUBLIC_DISPLAY_NAME_OVERRIDES.get(slug) ?? displayName ?? fallbackDisplayName ?? slug;
};

const fetchSkillDetail = async ({ owner, slug, fallback }) => {
  const response = await fetchWithRetry(`${CLAWHUB_HTTP_API_URL}/skills/${encodeURIComponent(slug)}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'portfolio-clawhub-stats/2.0'
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Skill detail ${slug} failed with HTTP ${response.status}: ${text}`);
  }

  const detail = JSON.parse(text);
  if (detail.owner?.handle !== owner) {
    throw new Error(`Skill detail ${slug} belongs to ${detail.owner?.handle ?? 'unknown'}, expected ${owner}`);
  }

  const stats = detail.skill?.stats ?? {};
  return {
    slug,
    displayName: getPublicDisplayName({
      slug,
      displayName: detail.skill?.displayName,
      fallbackDisplayName: fallback.displayName
    }),
    downloads: Number(stats.downloads ?? fallback.downloads ?? 0),
    versions: Number(stats.versions ?? 0),
    stars: Number(stats.stars ?? fallback.stars ?? 0),
    url: `${CLAWHUB_SITE_URL}/${owner}/${slug}`,
    checkedAt: new Date().toISOString().slice(0, 10)
  };
};

const fetchPublishedSkillRows = async (owner) => {
  const profile = await convexQuery('publishers:getProfileByHandle', { handle: owner });
  if (!profile) {
    throw new Error(`ClawHub publisher not found: ${owner}`);
  }

  const rows = [];
  let cursor = null;
  for (let page = 0; page < 20; page += 1) {
    const result = await convexQuery('publishers:listPublishedPage', {
      handle: owner,
      kind: 'skill',
      sort: 'downloads',
      paginationOpts: { numItems: 50, cursor }
    });
    rows.push(...(result.page ?? []));
    if (result.isDone) break;
    cursor = result.continueCursor;
    if (!cursor) break;
  }

  return { profile, rows };
};

const validateLiveStats = ({ owner, profile, stats }) => {
  const errors = [];
  const slugs = new Set();
  const totalDownloads = stats.reduce((sum, stat) => sum + stat.downloads, 0);
  const profileDownloads = Number(profile.stats?.downloads);

  if (stats.length < MIN_EXPECTED_SKILLS) {
    errors.push(`expected at least ${MIN_EXPECTED_SKILLS} public skills, got ${stats.length}`);
  }
  if (totalDownloads < MIN_EXPECTED_DOWNLOADS) {
    errors.push(`expected at least ${formatInteger(MIN_EXPECTED_DOWNLOADS)} downloads, got ${formatInteger(totalDownloads)}`);
  }
  if (Number(profile.stats?.skills) !== stats.length) {
    errors.push(`publisher profile reports ${profile.stats?.skills} skills, fetched ${stats.length}`);
  }
  if (Number.isFinite(profileDownloads) && profileDownloads !== totalDownloads) {
    const downloadDelta = Math.abs(profileDownloads - totalDownloads);
    const maxDownloadSkew = Math.max(5, stats.length);
    if (downloadDelta <= maxDownloadSkew) {
      console.warn(
        `ClawHub profile/detail download totals differ by ${formatInteger(downloadDelta)} during live fetch; using per-skill detail total ${formatInteger(totalDownloads)}.`
      );
    } else {
      errors.push(
        `publisher profile reports ${formatInteger(profileDownloads)} downloads, fetched ${formatInteger(totalDownloads)}`
      );
    }
  }
  if (!Number.isFinite(profileDownloads)) {
    errors.push(
      `publisher profile reports non-numeric downloads: ${profile.stats?.downloads}`
    );
  }

  for (const [index, stat] of stats.entries()) {
    if (slugs.has(stat.slug)) {
      errors.push(`duplicate ClawHub slug: ${stat.slug}`);
    }
    slugs.add(stat.slug);
    if (stat.url !== `${CLAWHUB_SITE_URL}/${owner}/${stat.slug}`) {
      errors.push(`unexpected ClawHub URL for ${stat.slug}: ${stat.url}`);
    }
    if (index > 0 && stat.downloads > stats[index - 1].downloads) {
      errors.push(`${stat.slug} is not sorted by descending downloads`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`ClawHub stats validation failed:\n- ${errors.join('\n- ')}`);
  }
};

const fetchClawHubStats = async (owner) => {
  const { profile, rows } = await fetchPublishedSkillRows(owner);
  const stats = await Promise.all(
    rows.map((row) =>
      fetchSkillDetail({
        owner,
        slug: parseSlugFromHref(row.href, owner),
        fallback: row
      })
    )
  );

  stats.sort((a, b) => b.downloads - a.downloads || a.slug.localeCompare(b.slug));
  validateLiveStats({ owner, profile, stats });

  return { profile, stats };
};

const renderStatsArray = (stats) => {
  const rendered = stats
    .map(
      (stat) => `  {
    slug: ${JSON.stringify(stat.slug)},
    displayName: ${JSON.stringify(stat.displayName)},
    downloads: ${stat.downloads},
    versions: ${stat.versions},
    stars: ${stat.stars},
    url: ${JSON.stringify(stat.url)},
    checkedAt: ${JSON.stringify(stat.checkedAt)}
  }`
    )
    .join(',\n');

  return `[\n${rendered}\n]`;
};

const updateConstantsSource = (source, stats) => {
  const totalDownloads = stats.reduce((sum, stat) => sum + stat.downloads, 0);
  const checkedAt = stats[0]?.checkedAt ?? new Date().toISOString().slice(0, 10);
  const summary = `${formatInteger(totalDownloads)} tracked ClawHub downloads across ${stats.length} public skills as of ${checkedAt}`;
  const latestUpdateSummary = `Updated the public ClawHub tracker to ${formatInteger(
    totalDownloads
  )} downloads across ${stats.length} public skills on ${checkedAt}`;

  let nextSource = source.replace(
    /export const CLAWHUB_DOWNLOAD_STATS: ClawHubDownloadStat\[] = \[[\s\S]*?\n\];/,
    `export const CLAWHUB_DOWNLOAD_STATS: ClawHubDownloadStat[] = ${renderStatsArray(stats)};`
  );

  nextSource = nextSource.replace(
    /\d[\d,]* tracked ClawHub downloads across \d+ public (?:packages|skills) as of \d{4}-\d{2}-\d{2}/g,
    summary
  );
  nextSource = nextSource.replace(
    /Updated the public ClawHub tracker to \d[\d,]* downloads across \d+ (?:packages|public skills) on \d{4}-\d{2}-\d{2}/g,
    latestUpdateSummary
  );

  if (nextSource === source) {
    throw new Error('constants.ts was not updated; expected ClawHub stats block or summary copy was not found.');
  }

  return nextSource;
};

const getPropertyName = (nameNode) => {
  if (!nameNode) return '';
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode)) return nameNode.text;
  return nameNode.getText();
};

const getPropertyValue = (objectNode, key) => {
  const property = objectNode.properties.find((prop) => {
    return ts.isPropertyAssignment(prop) && getPropertyName(prop.name) === key;
  });
  if (!property || !ts.isPropertyAssignment(property)) return null;
  return property.initializer;
};

const parseLiteralString = (node) => {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return '';
};

const parseLiteralNumber = (node) => {
  if (!node || !ts.isNumericLiteral(node)) return 0;
  return Number(node.text);
};

const readConstantsStats = async () => {
  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  let statsNode = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'CLAWHUB_DOWNLOAD_STATS') {
      if (node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        statsNode = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!statsNode) {
    throw new Error('Could not find CLAWHUB_DOWNLOAD_STATS in constants.ts');
  }

  return statsNode.elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => ({
      slug: parseLiteralString(getPropertyValue(element, 'slug')),
      displayName: parseLiteralString(getPropertyValue(element, 'displayName')),
      downloads: parseLiteralNumber(getPropertyValue(element, 'downloads')),
      versions: parseLiteralNumber(getPropertyValue(element, 'versions')),
      stars: parseLiteralNumber(getPropertyValue(element, 'stars')),
      url: parseLiteralString(getPropertyValue(element, 'url')),
      checkedAt: parseLiteralString(getPropertyValue(element, 'checkedAt'))
    }));
};

const normalizeForCompare = (stats) =>
  stats.map(({ slug, displayName, downloads, versions, stars, url }) => ({
    slug,
    displayName,
    downloads,
    versions,
    stars,
    url
  }));

const verifyConstants = async (liveStats) => {
  const constantsStats = await readConstantsStats();
  const live = normalizeForCompare(liveStats);
  const local = normalizeForCompare(constantsStats);
  if (JSON.stringify(live) !== JSON.stringify(local)) {
    const liveTotal = liveStats.reduce((sum, stat) => sum + stat.downloads, 0);
    const localTotal = constantsStats.reduce((sum, stat) => sum + stat.downloads, 0);
    throw new Error(
      `constants.ts ClawHub stats are stale: local ${constantsStats.length} skills / ${formatInteger(
        localTotal
      )} downloads, live ${liveStats.length} skills / ${formatInteger(liveTotal)} downloads`
    );
  }
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const { stats } = await fetchClawHubStats(options.owner);

  if (options.write) {
    const source = await fs.readFile(CONSTANTS_PATH, 'utf8');
    await fs.writeFile(CONSTANTS_PATH, updateConstantsSource(source, stats));
  }

  if (options.verifyConstants) {
    await verifyConstants(stats);
  }

  console.log(JSON.stringify(stats, null, 2));
};

await main();
