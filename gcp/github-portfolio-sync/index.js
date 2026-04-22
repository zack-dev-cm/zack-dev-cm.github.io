const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_LOOKBACK_DAYS = Number(process.env.NEW_REPO_LOOKBACK_DAYS || 90);
const PROJECT_PROMOTION_DAYS = Number(process.env.PROJECT_PROMOTION_DAYS || 30);
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'zack-dev-cm';
const GITHUB_REPO = process.env.GITHUB_REPO || 'zack-dev-cm.github.io';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const UPDATES_PATH = process.env.PORTFOLIO_UPDATES_PATH || 'public/portfolio-updates.json';
const DOCS_UPDATES_PATH = process.env.PORTFOLIO_UPDATES_DOCS_PATH || 'docs/portfolio-updates.json';
const PROBES_BASE_URL = process.env.PROBES_BASE_URL || '';
const EXCLUDE_REPOS = process.env.EXCLUDE_REPOS || '';
const PUBLISH_REPOS = process.env.PUBLISH_REPOS || '';
const SYNC_SECRET = process.env.SYNC_SECRET || '';
const INCLUDE_PRIVATE_REPOS = process.env.INCLUDE_PRIVATE_REPOS === 'true';
const PLACEHOLDER_IMAGE = 'images/project-placeholder.svg';

const ensureTrailingSlashTrimmed = (value) => value.replace(/\/+$/, '');

const isPrivateHostname = (hostname) => {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return true;
  if (
    normalized === 'localhost' ||
    normalized === '0.0.0.0' ||
    normalized === '::1' ||
    normalized.endsWith('.local')
  ) {
    return true;
  }

  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(normalized)) {
    const octets = normalized.split('.').map((part) => Number(part));
    if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) return true;
    if (octets[0] === 10 || octets[0] === 127) return true;
    if (octets[0] === 169 && octets[1] === 254) return true;
    if (octets[0] === 192 && octets[1] === 168) return true;
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  }

  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    const ipv6 = normalized.slice(1, -1);
    if (
      ipv6 === '::1' ||
      ipv6.startsWith('fc') ||
      ipv6.startsWith('fd') ||
      ipv6.startsWith('fe80:')
    ) {
      return true;
    }
  }

  return false;
};

const isSafePublicUrl = (value) => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    return !isPrivateHostname(parsed.hostname);
  } catch {
    return false;
  }
};

const githubRequest = async (token, path, options = {}) => {
  const url = path.startsWith('http') ? path : `${GITHUB_API_BASE}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      accept: options.accept || 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'user-agent': 'portfolio-sync-bot',
      'x-github-api-version': '2022-11-28',
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  if (options.raw) {
    return response.text();
  }
  return response.json();
};

const listRepos = async (token, username) => {
  const repos = [];
  let page = 1;
  while (true) {
    const data = await githubRequest(token, `/users/${username}/repos?type=owner&per_page=100&sort=created&direction=desc&page=${page}`);
    if (!Array.isArray(data) || data.length === 0) break;
    repos.push(...data);
    if (data.length < 100) break;
    page += 1;
  }
  return repos;
};

const parseGithubRepo = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
};

const extractGithubRepoKeys = (text) => {
  const repos = new Set();
  if (!text) return repos;
  const matches = text.match(/https?:\/\/github\.com\/[^\s"')]+/gi) || [];
  for (const match of matches) {
    const repoKey = parseGithubRepo(match);
    if (repoKey) repos.add(repoKey);
  }
  return repos;
};

const parseRepoSet = (value, owner) => {
  const repos = new Set();
  value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      if (item.includes('/')) {
        repos.add(item);
      } else {
        repos.add(`${owner}/${item}`);
      }
    });
  return repos;
};

const buildSyntheticRepoId = (repoKey) => {
  let hash = 0;
  for (const char of repoKey) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return 900000000 + (hash % 90000000);
};

const getRawRepoFile = async (token, owner, repo, path) => {
  const encodedPath = path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
  return githubRequest(token, `/repos/${owner}/${repo}/contents/${encodedPath}`, {
    accept: 'application/vnd.github.raw',
    raw: true,
  });
};

const normalizeTelegramUrl = (value) => {
  let url = value.trim().replace(/[\s)\],.]+$/, '');
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  return url;
};

const extractTelegramLinks = (text) => {
  const matches = text.match(/(?:https?:\/\/)?t\.me\/[A-Za-z0-9_]+(?:\/app|\?startapp=[^\s)]+)?/gi) || [];
  let miniAppUrl = null;
  let botUrl = null;
  for (const match of matches) {
    const url = normalizeTelegramUrl(match);
    if (url.includes('/app') || url.includes('startapp=')) {
      if (!miniAppUrl) miniAppUrl = url;
      continue;
    }
    if (!botUrl) botUrl = url;
  }

  if (!botUrl && miniAppUrl) {
    const base = miniAppUrl.split('?')[0].replace(/\/app$/, '');
    botUrl = base;
  }

  return { miniAppUrl, botUrl };
};

const buildTitle = (name) => {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const fetchReadmeText = async (token, owner, repo) => {
  try {
    return await githubRequest(token, `/repos/${owner}/${repo}/readme`, {
      accept: 'application/vnd.github.raw',
      raw: true,
    });
  } catch {
    return '';
  }
};

const fetchProbesArticles = async () => {
  if (!PROBES_BASE_URL) return [];
  const base = ensureTrailingSlashTrimmed(PROBES_BASE_URL);
  try {
    const response = await fetch(`${base}/api/articles?limit=30`, { method: 'GET' });
    if (!response.ok) return [];
    const data = await response.json();
    if (!data || !Array.isArray(data.articles)) return [];
    return data.articles;
  } catch {
    return [];
  }
};

const findProbesArticleUrl = (articles, repoName) => {
  if (!articles.length) return null;
  const slug = repoName.toLowerCase().replace(/_/g, '-');
  const match = articles.find((article) => {
    if (!article.projectSlug) return false;
    return article.projectSlug.toLowerCase() === slug || article.projectSlug.toLowerCase() === repoName.toLowerCase();
  });
  if (!match || !match.slug) return null;
  return `${ensureTrailingSlashTrimmed(PROBES_BASE_URL)}/a/${encodeURIComponent(match.slug)}`;
};

const buildKeyFeatures = ({ isMiniApp, hasLiveDemo, hasProbesArticle, isPublic }) => {
  const features = [];
  if (isMiniApp) {
    features.push('Telegram mini app experience');
    features.push('Bot companion link');
    if (hasProbesArticle) features.push('Featured in Probes magazine');
  } else {
    if (hasLiveDemo) features.push('Live demo available');
    if (isPublic) features.push('Public repository');
  }
  if (features.length === 0) {
    features.push('Recently launched');
    features.push('Active development');
  }
  return features;
};

const buildTechStack = ({ language, topics }) => {
  const stack = [];
  if (language) stack.push(language);
  (topics || []).forEach((topic) => {
    const formatted = topic.replace(/-/g, ' ');
    if (!stack.some((item) => item.toLowerCase() === formatted.toLowerCase())) {
      stack.push(formatted);
    }
  });
  if (stack.length === 0) stack.push('Software');
  return stack.slice(0, 8);
};

const buildLinks = ({ miniAppUrl, botUrl, probesArticleUrl, liveDemoUrl, githubUrl }) => {
  const links = [];
  if (miniAppUrl) links.push({ text: 'Open Mini App', url: miniAppUrl });
  if (botUrl) links.push({ text: 'Open Bot', url: botUrl });
  if (probesArticleUrl) links.push({ text: 'Probes Article', url: probesArticleUrl });
  if (liveDemoUrl) links.push({ text: 'Live Demo', url: liveDemoUrl });
  if (githubUrl) links.push({ text: 'GitHub', url: githubUrl });
  return links;
};

const upsertByRepoKey = (items, repoKey, nextEntry) => {
  const index = items.findIndex(
    (item) =>
      item.repoFullName === repoKey ||
      (nextEntry.repoId && item.repoId === nextEntry.repoId) ||
      (!nextEntry.repoId && item.title === nextEntry.title)
  );
  if (index === -1) {
    items.unshift(nextEntry);
    return true;
  }
  items[index] = { ...items[index], ...nextEntry };
  return true;
};

const removeByRepoKey = (items, repoKey) => {
  return items.filter((item) => item.repoFullName !== repoKey);
};

const serializeUpdates = (data) => `${JSON.stringify(data, null, 2)}\n`;

const commitFiles = async (token, owner, repo, branch, message, files) => {
  const ref = await githubRequest(token, `/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await githubRequest(token, `/repos/${owner}/${repo}/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha;

  const tree = await githubRequest(token, `/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: files.map((file) => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        content: file.content,
      })),
    }),
  });

  const commit = await githubRequest(token, `/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [baseCommitSha],
    }),
  });

  await githubRequest(token, `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
};

exports.githubPortfolioSync = async (req, res) => {
  try {
    if (!SYNC_SECRET) {
      return res.status(503).json({ ok: false, error: 'Sync endpoint is not configured.' });
    }

    const provided = req.get('x-sync-secret');
    if (provided !== SYNC_SECRET) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    const token = process.env.DEV_CM_GITHUB_TOKEN;
    if (!token) {
      return res.status(500).json({ ok: false, error: 'Missing GitHub token' });
    }

    const dryRun = req.query.dryRun === 'true' || req.query.dryRun === '1' || (req.body && req.body.dryRun);

    const [constantsText, updatesRaw, docsUpdatesRaw] = await Promise.all([
      getRawRepoFile(token, GITHUB_OWNER, GITHUB_REPO, 'constants.ts'),
      getRawRepoFile(token, GITHUB_OWNER, GITHUB_REPO, UPDATES_PATH),
      getRawRepoFile(token, GITHUB_OWNER, GITHUB_REPO, DOCS_UPDATES_PATH),
    ]);

    const updatesData = JSON.parse(updatesRaw);
    const originalSnapshot = JSON.stringify(updatesData);
    updatesData.latestUpdates = Array.isArray(updatesData.latestUpdates) ? updatesData.latestUpdates : [];
    updatesData.projects = Array.isArray(updatesData.projects) ? updatesData.projects : [];
    updatesData.version = updatesData.version || 1;

    const portfolioRepoKey = `${GITHUB_OWNER}/${GITHUB_REPO}`;
    const publishRepoKeys = parseRepoSet(PUBLISH_REPOS, GITHUB_OWNER);
    const baseRepoKeys = new Set([
      ...extractGithubRepoKeys(constantsText),
      ...parseRepoSet(EXCLUDE_REPOS, GITHUB_OWNER),
      portfolioRepoKey,
    ]);
    const repos = await listRepos(token, GITHUB_OWNER);
    const now = Date.now();
    const lookbackMs = DEFAULT_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;

    const recentRepos = repos.filter((repo) => {
      if (repo.archived || repo.fork) return false;
      if (publishRepoKeys.size > 0 && !publishRepoKeys.has(repo.full_name)) return false;
      if (repo.private && (!INCLUDE_PRIVATE_REPOS || !publishRepoKeys.has(repo.full_name))) return false;
      const createdAt = Date.parse(repo.created_at);
      return now - createdAt <= lookbackMs;
    });

    const probesArticles = await fetchProbesArticles();

    let touched = false;
    for (const repo of recentRepos) {
      const repoKey = repo.full_name;
      if (baseRepoKeys.has(repoKey)) {
        updatesData.latestUpdates = removeByRepoKey(updatesData.latestUpdates, repoKey);
        updatesData.projects = removeByRepoKey(updatesData.projects, repoKey);
        continue;
      }

      const ageDays = Math.floor((now - Date.parse(repo.created_at)) / (24 * 60 * 60 * 1000));
      const shouldPromote = ageDays >= PROJECT_PROMOTION_DAYS;

      const textBlob = [repo.name, repo.description, repo.homepage, (repo.topics || []).join(' ')].filter(Boolean).join(' ');
      const metadataLinks = extractTelegramLinks(textBlob);
      let miniAppUrl = metadataLinks.miniAppUrl;
      let botUrl = metadataLinks.botUrl;
      if (!miniAppUrl || !botUrl) {
        const readmeText = await fetchReadmeText(token, repo.owner.login, repo.name);
        const readmeLinks = extractTelegramLinks(readmeText);
        miniAppUrl = miniAppUrl || readmeLinks.miniAppUrl;
        botUrl = botUrl || readmeLinks.botUrl;
      }
      const isMiniApp = Boolean(miniAppUrl || botUrl);

      const probesArticleUrl = isMiniApp ? findProbesArticleUrl(probesArticles, repo.name) : null;

      let liveDemoUrl = null;
      if (repo.homepage && !/t\.me/i.test(repo.homepage) && isSafePublicUrl(repo.homepage)) {
        liveDemoUrl = repo.homepage;
      }

      const links = buildLinks({
        miniAppUrl,
        botUrl,
        probesArticleUrl,
        liveDemoUrl,
        githubUrl: repo.private ? null : repo.html_url,
      });

      const title = buildTitle(repo.name);
      const description = repo.description || 'New project added from GitHub.';
      const repoPublicMetadata = repo.private
        ? {}
        : {
            repoFullName: repoKey,
            repoId: repo.id,
            createdAt: repo.created_at,
          };

      const latestEntry = {
        title,
        description,
        links,
        ...repoPublicMetadata,
      };

      touched = upsertByRepoKey(updatesData.latestUpdates, repoKey, latestEntry) || touched;

      if (shouldPromote) {
        const projectEntry = {
          id: repo.private ? buildSyntheticRepoId(repoKey) : repo.id,
          title,
          description,
          longDescription: description,
          keyFeatures: buildKeyFeatures({
            isMiniApp,
            hasLiveDemo: Boolean(liveDemoUrl),
            hasProbesArticle: Boolean(probesArticleUrl),
            isPublic: !repo.private,
          }),
          techStack: buildTechStack({ language: repo.language, topics: repo.topics }),
          links,
          images: [{ url: PLACEHOLDER_IMAGE, alt: `${title} preview` }],
          thumbnail: PLACEHOLDER_IMAGE,
          ...repoPublicMetadata,
        };

        touched = upsertByRepoKey(updatesData.projects, repoKey, projectEntry) || touched;
      }
    }

    if (JSON.stringify(updatesData) !== originalSnapshot) {
      updatesData.lastSyncedAt = new Date().toISOString();
      touched = true;
    }

    const serialized = serializeUpdates(updatesData);
    const needsWrite = touched || updatesRaw !== serialized || docsUpdatesRaw !== serialized;

    if (!needsWrite) {
      return res.json({ ok: true, message: 'No changes detected.' });
    }

    if (dryRun) {
      return res.json({
        ok: true,
        dryRun: true,
        message: 'Dry run complete; no changes pushed.',
        updates: {
          latestUpdates: updatesData.latestUpdates.length,
          projects: updatesData.projects.length,
        },
      });
    }

    const commitMessage = `chore: sync portfolio updates (${new Date().toISOString()})`;
    const commitSha = await commitFiles(token, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, commitMessage, [
      { path: UPDATES_PATH, content: serialized },
      { path: DOCS_UPDATES_PATH, content: serialized },
    ]);

    res.json({
      ok: true,
      commitSha,
      updates: {
        latestUpdates: updatesData.latestUpdates.length,
        projects: updatesData.projects.length,
      },
    });
  } catch (error) {
    console.error('[githubPortfolioSync] request failed', error);
    res.status(500).json({
      ok: false,
      error: 'Sync failed.',
    });
  }
};
