import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { updateStatsSource } from './stats-source.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36';

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const shouldVerify = args.has('--verify-constants');

const decodeHtml = (value) =>
  String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim();

const stripTags = (value) => decodeHtml(String(value || '').replace(/<[^>]+>/g, ' '));

const parseNumber = (value) => {
  const clean = String(value ?? '').replace(/,/g, '').trim();
  if (!clean) return null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

const getPropertyName = (nameNode) => {
  if (!nameNode) return '';
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) return nameNode.text;
  return nameNode.getText();
};

const parseLiteral = (node) => {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(parseLiteral);
  if (ts.isObjectLiteralExpression(node)) {
    const output = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      output[getPropertyName(property.name)] = parseLiteral(property.initializer);
    }
    return output;
  }
  return null;
};

const findChromeStatsNode = (sourceText) => {
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  let declaration = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'CHROME_EXTENSION_STATS') {
      declaration = node;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!declaration || !declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
    throw new Error('Could not find CHROME_EXTENSION_STATS object in constants.ts');
  }
  return { sourceFile, declaration, initializer: declaration.initializer };
};

const readChromeStats = async () => {
  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const { initializer } = findChromeStatsNode(sourceText);
  return { sourceText, stats: parseLiteral(initializer) };
};

export const fetchText = async (url, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
  } finally {
    clearTimeout(timeout);
  }
};

export const parseDetailPage = (html) => {
  const text = stripTags(html);
  const usersMatch = html.match(/>\s*([\d,]+)\s+users?\s*</i) || text.match(/\b([\d,]+)\s+users?\b/i);
  const ratingCountMatch = html.match(/>\s*([\d,]+)\s+ratings?\s*</i) || text.match(/\b([\d,]+)\s+ratings?\b/i);
  const ratingMatch =
    html.match(/>\s*([0-5](?:\.\d+)?)\s+out of 5\s*</i) ||
    html.match(/Average rating\s+([0-5](?:\.\d+)?)\s+out of 5 stars/i);
  const versionMatch = html.match(/>\s*Version\s*<\/div>\s*<div[^>]*>\s*([^<]+)\s*<\/div>/i);
  const updatedMatch = html.match(/>\s*Updated\s*<\/div>\s*<div[^>]*>\s*([^<]+)\s*<\/div>/i);
  const sizeMatch = html.match(/>\s*Size\s*<\/div>\s*<div[^>]*>\s*([\d.]+)\s*KiB\s*<\/div>/i);
  const categoryMatch = html.match(/category\/extensions\/[^"]+[^>]*>\s*([^<]+)\s*<\/a>/i);

  return {
    name: stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || ''),
    users: parseNumber(usersMatch?.[1]),
    rating: parseNumber(ratingMatch?.[1]),
    ratingCount: parseNumber(ratingCountMatch?.[1]),
    version: decodeHtml(versionMatch?.[1] || ''),
    lastUpdated: parseDate(decodeHtml(updatedMatch?.[1] || '')),
    sizeKb: parseNumber(sizeMatch?.[1]),
    category: decodeHtml(categoryMatch?.[1] || ''),
  };
};

export const parsePublisherListings = (html) => {
  const listings = new Map();
  for (const match of html.matchAll(/data-item-id="([a-p]{32})"/g)) {
    const id = match[1];
    const end = html.indexOf('data-item-id=', match.index + match[0].length);
    const card = html.slice(match.index, end < 0 ? undefined : end);
    const route = card.match(new RegExp(`(?:\\./|/)detail/[^"\\s<>]+/${id}`))?.[0];
    const name = stripTags(card.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || '');
    if (route && name) listings.set(id, { id, name, chromeWebStoreUrl: `https://chromewebstore.google.com/${route.replace(/^\.?\//, '')}?hl=en` });
  }
  if (!listings.size) throw new Error('No visible publisher listings found; keeping the previous dated snapshot');
  return [...listings.values()];
};

export const updateExtensionRows = async (stats) => {
  const today = new Date().toISOString().slice(0, 10);
  const warnings = [];
  const extensions = [];

  for (const extension of stats.extensions || []) {
    try {
      const html = await fetchText(extension.chromeWebStoreUrl);
      const parsed = parseDetailPage(html);
      if (parsed.users === null) {
        warnings.push(`${extension.name}: no visible user count parsed`);
        continue;
      }
      const { rating, ratingCount, sizeKb, version, lastUpdated, category, ...cached } = extension;
      extensions.push({
        ...cached,
        name: parsed.name || extension.name,
        users: parsed.users,
        usersSource: 'Chrome Web Store detail page',
        ...(parsed.rating !== null ? { rating: parsed.rating } : {}),
        ...(parsed.ratingCount !== null ? { ratingCount: parsed.ratingCount } : {}),
        version: parsed.version,
        lastUpdated: parsed.lastUpdated,
        category: parsed.category,
        ...(parsed.sizeKb !== null ? { sizeKb: parsed.sizeKb } : {}),
        dataIngestedAt: today,
      });
    } catch (error) {
      warnings.push(`${extension.name}: ${error?.message || error}`);
    }
  }

  // A failed fetch cannot turn cached figures into a freshly checked snapshot.
  if (!extensions.length) return { nextStats: stats, warnings, measuredRows: 0 };

  const measuredRows = extensions.filter((extension) => Number.isFinite(extension.users));
  const totalUsers = measuredRows.reduce((sum, extension) => sum + extension.users, 0);
  const ratedRows = extensions.filter(
    (extension) => Number.isFinite(extension.rating) && Number.isFinite(extension.ratingCount) && extension.ratingCount > 0
  );
  const ratingCount = ratedRows.reduce((sum, extension) => sum + extension.ratingCount, 0);
  const averageRating =
    ratingCount > 0
      ? Number(
          (
            ratedRows.reduce((sum, extension) => sum + extension.rating * extension.ratingCount, 0) / ratingCount
          ).toFixed(2)
        )
      : 0;

  return {
    nextStats: {
      ...stats,
      checkedAt: today,
      totalUsers,
      averageUsersPerExtension: measuredRows.length ? Number((totalUsers / measuredRows.length).toFixed(1)) : 0,
      averageRating,
      ratingCount,
      notes: [
        `The public publisher search showed ${stats.totalPublished} listings on ${today}; this is the observed search page, not a complete developer-dashboard total. ${measuredRows.length} detail pages exposed visible user counts.`,
        `Chrome Web Store detail pages showed ${totalUsers.toLocaleString('en-US')} explicitly reported users across ${measuredRows.length} measured rows, ${(
          measuredRows.length ? totalUsers / measuredRows.length : 0
        ).toFixed(1)} reported users per measured row, and ${averageRating.toFixed(2)} average rating from ${ratingCount} reported ratings on ${today}.`,
        'Only listings observed in the current publisher search with a visible detail-page count appear in this snapshot. Missing counts and unavailable pages are omitted; cached numbers are not added to current totals. Chrome-Stats links are secondary references.',
      ],
      extensions,
    },
    warnings,
    measuredRows: measuredRows.length,
  };
};

export const writeChromeStats = async (stats, file = CONSTANTS_PATH) => updateStatsSource(file, (sourceText) => {
  const { declaration, initializer } = findChromeStatsNode(sourceText);
  const statement = declaration.parent?.parent;
  if (!statement || !ts.isVariableStatement(statement)) {
    throw new Error('Could not locate CHROME_EXTENSION_STATS variable statement');
  }
  const prefix = sourceText.slice(statement.pos, initializer.pos);
  const replacement = `${prefix}${JSON.stringify(stats, null, 2)};`;
  let updated = `${sourceText.slice(0, statement.pos)}${replacement}${sourceText.slice(statement.end)}`;
  updated = updated.replace(
    /and refreshed the Chrome Web Store snapshot to \d[\d,]* visible reported users across \d+ (?:current listings|observed public listings) \/ \d+ displayed rows from \d{4}-\d{2}-\d{2}/g,
    () => `and refreshed the Chrome Web Store snapshot to ${stats.totalUsers.toLocaleString('en-US')} visible reported users across ${stats.totalPublished} observed public listings / ${stats.extensions.length} displayed rows from ${stats.checkedAt}`
  );
  const metric = (labels, label, value, context) => {
    const pattern = new RegExp(`\\{ label: "(?:${labels.join('|')})", value: "[^"]*", context: "[^"]*" \\},`, 'g');
    updated = updated.replace(pattern, () => `{ label: ${JSON.stringify(label)}, value: ${JSON.stringify(String(value))}, context: ${JSON.stringify(context)} },`);
  };
  metric(['Current public publisher listings', 'Observed publisher listings'], 'Observed publisher listings', stats.totalPublished, `public publisher search page, ${stats.checkedAt}`);
  metric(['Current publisher users', 'Reported snapshot users'], 'Reported snapshot users', stats.totalUsers, `${stats.extensions.length} detail pages with visible counts from the observed publisher search, ${stats.checkedAt}`);
  // Only the Chrome Web Store rating row has this source context.
  updated = updated.replace(/\{ label: "Average rating", value: "[^"]*", context: "\d+ reported Chrome Web Store ratings, \d{4}-\d{2}-\d{2}" \},/g,
    () => `{ label: "Average rating", value: "${stats.averageRating.toFixed(2)}", context: "${stats.ratingCount} reported Chrome Web Store ratings, ${stats.checkedAt}" },`);
  const sourcePackIds = new Set(['egjcdmlfdnkpgkmffkhfdooacmglnjbc', 'hjfdpklldhofiehpcfcfdonjppdkmgoh', 'hlbflaklicefinhckdkbamhhkfklmgao', 'pmofpiclpglbdnjgkgijlolefiojjomn']);
  const sourcePackRows = stats.extensions.filter(row => sourcePackIds.has(row.id));
  metric(['Visible SourcePack products', 'Observed SourcePack rows'], 'Observed SourcePack rows', sourcePackRows.length, `${sourcePackRows.map(row => row.name).join(', ')} in the measured public snapshot, ${stats.checkedAt}`);
  return updated;
});

const normalizeForCompare = (stats) => ({
  checkedAt: stats.checkedAt,
  totalPublished: stats.totalPublished,
  totalUsers: stats.totalUsers,
  averageUsersPerExtension: stats.averageUsersPerExtension,
  averageRating: stats.averageRating,
  ratingCount: stats.ratingCount,
  extensions: (stats.extensions || []).map((extension) => ({
    id: extension.id,
    users: extension.users,
    rating: extension.rating,
    ratingCount: extension.ratingCount,
    version: extension.version,
    lastUpdated: extension.lastUpdated,
    sizeKb: extension.sizeKb,
  })),
});

const main = async () => {
  const { stats } = await readChromeStats();
  const listings = parsePublisherListings(await fetchText(stats.sourceUrl));
  const known = new Map(stats.extensions.map(extension => [extension.id, extension]));
  const candidates = listings.map(listing => ({
    description: 'Public Chrome Web Store listing.', version: '', lastUpdated: '', category: '',
    ...known.get(listing.id), ...listing,
  }));
  const { nextStats, warnings, measuredRows } = await updateExtensionRows({
    ...stats, totalPublished: listings.length,
    sourceName: 'Chrome Web Store public publisher search and detail pages', extensions: candidates,
  });
  if (!measuredRows) throw new Error('No current public user counts could be verified; keeping the previous dated snapshot');

  if (shouldVerify && JSON.stringify(normalizeForCompare(stats)) !== JSON.stringify(normalizeForCompare(nextStats))) {
    throw new Error('constants.ts Chrome Web Store stats are stale; run npm run stats:chrome -- --write');
  }

  if (shouldWrite) {
    await writeChromeStats(nextStats);
  }

  console.log(
    JSON.stringify(
      {
        write: shouldWrite,
        verify: shouldVerify,
        checkedAt: nextStats.checkedAt,
        totalPublished: nextStats.totalPublished,
        measuredRows,
        totalUsers: nextStats.totalUsers,
        averageRating: nextStats.averageRating,
        ratingCount: nextStats.ratingCount,
        warnings,
      },
      null,
      2
    )
  );
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch((error) => {
  console.error(error?.message || error);
  process.exitCode = 1;
});
