const DEFAULT_OWNER = 'zack-dev-cm';
const DEFAULT_SLUGS = [
  'data-science-cv-repro-lab',
  'sota-agent',
  'github-clawhub-launcher',
  'browser-proof',
  'public-surface-review',
  'youtube-creator-ops',
  'artifact-redactor',
  'artifact-deck',
  'hh-openclaw-agent',
  'openclaw-cws-publisher',
  'openclaw-agent-chinese-laoshi',
];

const STATS_PATTERN =
  /stats:\$R\[\d+\]=\{comments:(\d+),downloads:(\d+),installsAllTime:(\d+),installsCurrent:(\d+),stars:(\d+),versions:(\d+)\}/;
const TITLE_PATTERN = /<title>([^<]+)<\/title>/i;

const parseTarget = (target) => {
  if (!target?.trim()) return null;
  const trimmed = target.trim();
  if (!trimmed.includes('/')) {
    return { owner: DEFAULT_OWNER, slug: trimmed };
  }
  const [owner, slug] = trimmed.split('/').filter(Boolean);
  if (!owner || !slug) return null;
  return { owner, slug };
};

const fetchClawHubStats = async ({ owner, slug }) => {
  const url = `https://clawhub.ai/${owner}/${slug}`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; portfolio-stats-bot/1.0)',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const title = html.match(TITLE_PATTERN)?.[1] ?? `${owner}/${slug}`;
  const match = html.match(STATS_PATTERN);

  if (!match) {
    throw new Error('Could not find ClawHub stats payload');
  }

  const [comments, downloads, installsAllTime, installsCurrent, stars, versions] = match
    .slice(1)
    .map((value) => Number.parseInt(value, 10));

  return {
    owner,
    slug,
    title,
    url,
    downloads,
    versions,
    stars,
    installsCurrent,
    installsAllTime,
    comments,
    checkedAt: new Date().toISOString(),
  };
};

const main = async () => {
  const targets = (process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_SLUGS)
    .map(parseTarget)
    .filter(Boolean);

  const results = [];
  for (const target of targets) {
    try {
      results.push(await fetchClawHubStats(target));
    } catch (error) {
      results.push({
        ...target,
        url: `https://clawhub.ai/${target.owner}/${target.slug}`,
        error: error instanceof Error ? error.message : String(error),
        checkedAt: new Date().toISOString(),
      });
    }
  }

  console.log(JSON.stringify(results, null, 2));
};

await main();
