import { readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const constantsPath = path.join(repoRoot, 'constants.ts');

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

const urlMatches = src.match(/https?:\/\/[^'\"`\s)]+/g) ?? [];
const urls = [...new Set(urlMatches)].sort();

const warningStatuses = new Set([401, 403, 429, 999]);
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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
  try {
    new URL(url);
  } catch (error) {
    return { url, status: 'invalid', error: error?.message || 'Invalid URL' };
  }

  try {
    const response = await fetchWithTimeout(url);
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

  const warnings = results.filter(
    (result) => typeof result.status === 'number' && warningStatuses.has(result.status)
  );
  const failures = results.filter((result) => {
    if (result.status === 'error' || result.status === 'invalid') return true;
    if (typeof result.status === 'number') {
      if (warningStatuses.has(result.status)) return false;
      return result.status >= 400;
    }
    return false;
  });

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
