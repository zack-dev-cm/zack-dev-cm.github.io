import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

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
  const clean = String(value || '').replace(/,/g, '').trim();
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

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
};

const parseDetailPage = (html) => {
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
    users: parseNumber(usersMatch?.[1]),
    rating: parseNumber(ratingMatch?.[1]),
    ratingCount: parseNumber(ratingCountMatch?.[1]),
    version: decodeHtml(versionMatch?.[1] || ''),
    lastUpdated: parseDate(decodeHtml(updatedMatch?.[1] || '')),
    sizeKb: parseNumber(sizeMatch?.[1]),
    category: decodeHtml(categoryMatch?.[1] || ''),
  };
};

const updateExtensionRows = async (stats) => {
  const today = new Date().toISOString().slice(0, 10);
  const warnings = [];
  const extensions = [];

  for (const extension of stats.extensions || []) {
    try {
      const html = await fetchText(extension.chromeWebStoreUrl);
      const parsed = parseDetailPage(html);
      if (parsed.users === null) {
        warnings.push(`${extension.name}: no visible user count parsed`);
        extensions.push({ ...extension, dataIngestedAt: today });
        continue;
      }
      extensions.push({
        ...extension,
        users: parsed.users,
        usersSource: 'Chrome Web Store detail page',
        ...(parsed.rating !== null ? { rating: parsed.rating } : {}),
        ...(parsed.ratingCount !== null ? { ratingCount: parsed.ratingCount } : {}),
        ...(parsed.version ? { version: parsed.version } : {}),
        ...(parsed.lastUpdated ? { lastUpdated: parsed.lastUpdated } : {}),
        ...(parsed.category ? { category: parsed.category } : {}),
        ...(parsed.sizeKb !== null ? { sizeKb: parsed.sizeKb } : {}),
        dataIngestedAt: today,
      });
    } catch (error) {
      warnings.push(`${extension.name}: ${error?.message || error}`);
      extensions.push({ ...extension, dataIngestedAt: today });
    }
  }

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
        `Chrome Web Store publisher tracker keeps ${stats.totalPublished} current public listings for ${stats.publisherName}; ${measuredRows.length} known detail pages exposed visible user counts on ${today}.`,
        `Chrome Web Store detail pages showed ${totalUsers.toLocaleString('en-US')} explicitly reported users across ${measuredRows.length} measured rows, ${(
          measuredRows.length ? totalUsers / measuredRows.length : 0
        ).toFixed(1)} reported users per measured row, and ${averageRating.toFixed(2)} average rating from ${ratingCount} reported ratings on ${today}.`,
        'Listings without a known or visible Chrome Web Store detail-page count are omitted from row-level published data; Chrome-Stats links remain secondary metadata and are not used for current counts.',
      ],
      extensions,
    },
    warnings,
  };
};

const writeChromeStats = async (sourceText, stats) => {
  const { declaration, initializer } = findChromeStatsNode(sourceText);
  const statement = declaration.parent?.parent;
  if (!statement || !ts.isVariableStatement(statement)) {
    throw new Error('Could not locate CHROME_EXTENSION_STATS variable statement');
  }
  const prefix = sourceText.slice(statement.pos, initializer.pos);
  const replacement = `${prefix}${JSON.stringify(stats, null, 2)};`;
  const updated = `${sourceText.slice(0, statement.pos)}${replacement}${sourceText.slice(statement.end)}`;
  await fs.writeFile(CONSTANTS_PATH, updated, 'utf8');
};

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
  const { sourceText, stats } = await readChromeStats();
  const { nextStats, warnings } = await updateExtensionRows(stats);

  if (shouldVerify && JSON.stringify(normalizeForCompare(stats)) !== JSON.stringify(normalizeForCompare(nextStats))) {
    throw new Error('constants.ts Chrome Web Store stats are stale; run npm run stats:chrome -- --write');
  }

  if (shouldWrite) {
    await writeChromeStats(sourceText, nextStats);
  }

  console.log(
    JSON.stringify(
      {
        write: shouldWrite,
        verify: shouldVerify,
        checkedAt: nextStats.checkedAt,
        totalPublished: nextStats.totalPublished,
        measuredRows: nextStats.extensions.length,
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

main().catch((error) => {
  console.error(error?.message || error);
  process.exitCode = 1;
});
