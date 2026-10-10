import { readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyLinkResults } from './link-results.mjs';
import { fetchLinkWithRetry } from './link-fetch.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const constantsPath = path.join(repoRoot, 'constants.ts');
const PUBLIC_URL_SOURCE_FILES = [
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  '.github/pull_request_template.md',
  'constants.ts',
  'index.html',
  'agent-context.md',
  'agent-discovery.json',
  'geo.txt',
  'llms.txt',
  'llms-full.txt',
  'metadata.json',
  'schema.jsonld',
  'sitemap.xml',
  'docs/index.html',
  'docs/404.html',
  'docs/agent-context.md',
  'docs/agent-discovery.json',
  'docs/geo.txt',
  'docs/llms.txt',
  'docs/llms-full.txt',
  'docs/metadata.json',
  'docs/schema.jsonld',
  'docs/sitemap.xml',
];
const PUBLIC_URL_SOURCE_DIRECTORIES = [
  'projects',
  'codex-docs',
  'public',
  'docs',
];

const src = await readFile(constantsPath, 'utf8');

const collectMatches = (regex) => [...src.matchAll(regex)].map((match) => match[1]).filter(Boolean);

const imageFiles = new Set(collectMatches(/\$\{LOCAL_IMG_BASE\}\/([^'\"`\n\r]+)/g));
const logoFiles = new Set(collectMatches(/\$\{LOCAL_COMPANY_LOGO_BASE\}\/([^'\"`\n\r]+)/g));

const missingAssets = [];

for (const file of imageFiles) {
  const assetPath = path.join(repoRoot, 'public', 'images', file);
  if (!fs.existsSync(assetPath)) {
    missingAssets.push(assetPath);
  }
}

for (const file of logoFiles) {
  const assetPath = path.join(repoRoot, 'public', 'company-logos', file);
  if (!fs.existsSync(assetPath)) {
    missingAssets.push(assetPath);
  }
}

if (missingAssets.length > 0) {
  console.error('Missing local assets:');
  console.error(missingAssets.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Local assets OK (${imageFiles.size + logoFiles.size} checked).`);
}

const collectTextFiles = (directory) => {
  const absoluteDirectory = path.join(repoRoot, directory);
  if (!fs.existsSync(absoluteDirectory)) return [];
  return fs
    .readdirSync(absoluteDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(directory, entry.name).split(path.sep).join('/');
      const absolutePath = path.join(repoRoot, relativePath);
      if (entry.isDirectory()) return collectTextFiles(relativePath);
      if (!entry.isFile()) return [];
      if (!/\.(?:html|json|jsonld|md|txt|xml)$/i.test(entry.name)) return [];
      return [absolutePath];
    });
};

const urlSourceFiles = [
  ...PUBLIC_URL_SOURCE_FILES.map((file) => path.join(repoRoot, file)),
  ...PUBLIC_URL_SOURCE_DIRECTORIES.flatMap((directory) => collectTextFiles(directory)),
].filter((file, index, files) => fs.existsSync(file) && files.indexOf(file) === index);

const normalizeUrl = (url) => url.replace(/[.,;:!?]+$/g, '');
const urlMatches = [];
for (const file of urlSourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  urlMatches.push(...(text.match(/https?:\/\/[^'\"`\s)<>\]]+/g) ?? []).map(normalizeUrl));
}
const urls = [...new Set(urlMatches)].sort();

const siteHost = 'zack-dev-cm.github.io';
const ignoredUrls = new Set([
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
]);
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const resolveExistingPageFile = (candidate) => {
  if (!fs.existsSync(candidate)) return null;
  const stat = fs.statSync(candidate);
  if (stat.isFile()) return candidate;
  if (!stat.isDirectory()) return null;

  const indexPath = path.join(candidate, 'index.html');
  if (!fs.existsSync(indexPath)) return null;
  return fs.statSync(indexPath).isFile() ? indexPath : null;
};

const resolveOwnSiteUrl = (url) => {
  const parsed = new URL(url);
  if (parsed.hostname !== siteHost) return null;

  const pathname = decodeURIComponent(parsed.pathname);
  const normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const relativePath = normalizedPath.replace(/^\/+/, '');
  if (relativePath.includes('..')) return null;

  const candidates = [
    path.join(repoRoot, relativePath),
    path.join(repoRoot, 'docs', relativePath),
    path.join(repoRoot, 'docs', relativePath.replace(/^docs\//, '')),
  ];

  for (const candidate of candidates) {
    const pageFile = resolveExistingPageFile(candidate);
    if (pageFile) return pageFile;
  }
  return null;
};

const fetchWithTimeout = async (url, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
};

const checkUrl = async (url) => {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (error) {
    return { url, status: 'invalid', error: error?.message || 'Invalid URL' };
  }

  const localSitePath = parsed ? resolveOwnSiteUrl(url) : null;
  if (localSitePath) {
    return { url, status: 200, localPath: localSitePath };
  }

  if (ignoredUrls.has(parsed.origin) && parsed.pathname === '/') {
    return { url, status: 200, ignored: true };
  }

  try {
    const response = await fetchLinkWithRetry(url, fetchWithTimeout);
    const { status } = response;
    if (response.body?.cancel) {
      await response.body.cancel();
    }
    return { url, status };
  } catch (error) {
    return { url, status: 'error', error: error?.message || 'Request failed' };
  }
};

if (urls.length === 0) {
  console.log('No external links found to check.');
  process.exitCode = process.exitCode || 0;
} else {
  console.log(`Checking ${urls.length} external links...`);

  const concurrency = 5;
  const queue = [...urls];
  const results = [];

  const worker = async () => {
    while (queue.length > 0) {
      const nextUrl = queue.shift();
      if (!nextUrl) return;
      results.push(await checkUrl(nextUrl));
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, () => worker()));

  const { warnings, failures } = classifyLinkResults(results);

  if (warnings.length > 0) {
    console.warn('Links requiring manual review:');
    warnings.forEach((result) => {
      console.warn(`${result.status} ${result.url}`);
    });
  }

  if (failures.length > 0) {
    console.error('Broken links detected:');
    failures.forEach((result) => {
      const detail = result.error ? ` (${result.error})` : '';
      console.error(`${result.status} ${result.url}${detail}`);
    });
    process.exitCode = 1;
  } else {
    console.log('External links OK.');
  }
}
