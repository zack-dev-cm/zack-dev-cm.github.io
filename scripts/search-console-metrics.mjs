import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');

export async function buildSearchConsoleReportFromCsvFile(inputPath, options = {}) {
  const resolvedPath = path.resolve(ROOT_DIR, inputPath);
  const text = await fs.readFile(resolvedPath, 'utf8');
  return buildSearchConsoleReportFromCsv(text, inputPath, options);
}

export function buildSearchConsoleReportFromCsv(text, inputPath = 'search-console-export.csv', options = {}) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('Search Console export is empty.');

  const headers = rows[0].map((header) => normalizeHeader(header));
  const pageIndex = columnIndex(headers, ['page', 'pages']);
  const queryIndex = columnIndex(headers, ['query', 'queries', 'searchquery', 'searchqueries']);
  const clicksIndex = columnIndex(headers, ['clicks']);
  const impressionsIndex = columnIndex(headers, ['impressions']);
  const positionIndex = columnIndex(headers, ['position', 'averageposition', 'avgposition']);
  const requiredColumns = [
    { name: 'page', index: pageIndex },
    { name: 'impressions', index: impressionsIndex },
    { name: 'position', index: positionIndex }
  ];
  if (options.requireQuery) requiredColumns.push({ name: 'query', index: queryIndex });
  if (options.requireClicks) requiredColumns.push({ name: 'clicks', index: clicksIndex });
  const missingColumns = requiredColumns.filter((column) => column.index === -1).map((column) => column.name);

  if (missingColumns.length) {
    const error = new Error(`Missing required columns: ${missingColumns.join(', ')}. Found: ${rows[0].join(', ')}`);
    error.code = 'invalid-export';
    throw error;
  }

  const pages = new Map();
  const queries = new Map();
  const validRows = [];
  const invalidRows = [];
  for (const [offset, row] of rows.slice(1).entries()) {
    const rowNumber = offset + 2;
    const page = clean(row[pageIndex]);
    const query = queryIndex >= 0 ? clean(row[queryIndex]) : '';
    const clicks = clicksIndex >= 0 ? parseRequiredNumber(row[clicksIndex]) : 0;
    const impressions = parseRequiredNumber(row[impressionsIndex]);
    const position = parseRequiredNumber(row[positionIndex]);
    const rowIssues = [];
    if (!page) rowIssues.push('missing-page');
    if (options.requireQuery && !query) rowIssues.push('missing-query');
    if (!Number.isFinite(clicks) || clicks < 0) rowIssues.push('invalid-clicks');
    if (!Number.isFinite(impressions) || impressions < 0) rowIssues.push('invalid-impressions');
    if (!Number.isFinite(position) || position < 0 || (impressions > 0 && position < 1)) {
      rowIssues.push('invalid-position');
    }
    if (rowIssues.length) {
      invalidRows.push({
        rowNumber,
        page,
        query,
        issues: rowIssues,
        raw: {
          clicks: clicksIndex >= 0 ? clean(row[clicksIndex]) : '',
          impressions: clean(row[impressionsIndex]),
          position: clean(row[positionIndex])
        }
      });
      continue;
    }
    if (!impressions) continue;
    const kind = classifyPage(page);
    const weightedPosition = position * impressions;
    validRows.push({ rowNumber, page, query, kind, clicks, impressions, position, weightedPosition });
    const current = pages.get(page) || {
      page,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      queries: new Map()
    };
    current.clicks += clicks;
    current.impressions += impressions;
    current.weightedPosition += weightedPosition;
    if (query) {
      const queryStats = current.queries.get(query) || { query, impressions: 0, clicks: 0, weightedPosition: 0 };
      queryStats.impressions += impressions;
      queryStats.clicks += clicks;
      queryStats.weightedPosition += weightedPosition;
      current.queries.set(query, queryStats);

      const queryKey = `${page}\n${query}`;
      const globalQueryStats = queries.get(queryKey) || {
        page,
        query,
        kind,
        impressions: 0,
        clicks: 0,
        weightedPosition: 0
      };
      globalQueryStats.impressions += impressions;
      globalQueryStats.clicks += clicks;
      globalQueryStats.weightedPosition += weightedPosition;
      queries.set(queryKey, globalQueryStats);
    }
    pages.set(page, current);
  }

  const pageReports = [...pages.values()]
    .map((page) => {
      const averagePosition = page.weightedPosition / page.impressions;
      const topQueries = [...page.queries.values()]
        .map((query) => ({
          query: query.query,
          impressions: query.impressions,
          clicks: query.clicks,
          averagePosition: round(query.weightedPosition / query.impressions)
        }))
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 5);
      return {
        page: page.page,
        kind: classifyPage(page.page),
        clicks: page.clicks,
        impressions: page.impressions,
        weightedPosition: page.weightedPosition,
        averagePosition: round(averagePosition),
        action: recommendedAction(page.page, averagePosition),
        topQueries
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const queryReports = [...queries.values()]
    .map((query) => ({
      page: query.page,
      query: query.query,
      kind: query.kind,
      clicks: query.clicks,
      impressions: query.impressions,
      weightedPosition: query.weightedPosition,
      averagePosition: round(query.weightedPosition / query.impressions)
    }))
    .sort((a, b) => b.impressions - a.impressions);

  return buildReportFromPages(pageReports, queryReports, validRows, invalidRows, inputPath);
}

export async function readSearchConsoleReportFile(inputPath) {
  const resolvedPath = path.resolve(ROOT_DIR, inputPath);
  return validateSearchConsoleReport(JSON.parse(await fs.readFile(resolvedPath, 'utf8')));
}

export function validateSearchConsoleReport(report) {
  const invalid = (detail) => { const error = new Error(`Invalid Search Console report: ${detail}`); error.code = 'invalid-export'; throw error; };
  if (!report || !Array.isArray(report.pages) || !Array.isArray(report.queries)) invalid('pages and queries must be arrays');
  for (const [collection, entries] of [['pages', report.pages], ['queries', report.queries]]) {
    const seen = new Set();
    for (const entry of entries) {
      if (!entry || typeof entry.page !== 'string' || !entry.page.trim() || entry.kind !== classifyPage(entry.page)) invalid(`${collection}: invalid page or resource kind`);
      if (collection === 'queries' && (typeof entry.query !== 'string' || !entry.query.trim())) invalid('missing query');
      const key = collection === 'queries' ? `${entry.page}\n${entry.query}` : entry.page;
      if (seen.has(key)) invalid(`duplicate ${collection} entry`);
      seen.add(key);
      for (const field of ['clicks', 'impressions', 'weightedPosition', 'averagePosition']) {
        if (typeof entry[field] !== 'number' || !Number.isFinite(entry[field]) || entry[field] < 0) invalid(`${collection}: missing or invalid ${field}`);
      }
      if (entry.impressions <= 0 || entry.averagePosition < 1 || entry.weightedPosition < entry.impressions) invalid(`${collection}: invalid positive-impression position`);
      if (Math.abs(entry.averagePosition - entry.weightedPosition / entry.impressions) > 0.011) invalid(`${collection}: inconsistent average and weighted position`);
    }
  }
  if (!report.rows || !Number.isSafeInteger(report.rows.valid) || report.rows.valid < 0 || !Number.isSafeInteger(report.rows.invalid) || report.rows.invalid < 0 || !Array.isArray(report.rows.invalidRows)) invalid('invalid row counts');
  const totals = report.totals;
  if (!totals || totals.pages !== report.pages.length) invalid('inconsistent page total');
  for (const field of ['clicks', 'impressions', 'weightedPosition']) {
    const expected = sum(report.pages, field);
    if (typeof totals[field] !== 'number' || !Number.isFinite(totals[field]) || !Number.isFinite(expected) || Math.abs(totals[field] - expected) > 0.011) invalid(`inconsistent ${field} total`);
  }
  const average = totals.weightedPosition / Math.max(1, totals.impressions);
  if (typeof totals.averagePosition !== 'number' || !Number.isFinite(totals.averagePosition) || Math.abs(totals.averagePosition - average) > 0.011) invalid('inconsistent average position total');
  for (const page of report.pages) {
    const entries = report.queries.filter(query => query.page === page.page);
    for (const field of ['clicks', 'impressions', 'weightedPosition']) if (sum(entries, field) > page[field] + 0.011) invalid(`query ${field} exceeds page total`);
  }
  if (report.queries.some(query => !report.pages.some(page => page.page === query.page))) invalid('query has no matching page');
  return report;
}

export async function writeJsonReport(relativePath, report) {
  const outputPath = path.resolve(ROOT_DIR, relativePath);
  await fs.writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return path.relative(ROOT_DIR, outputPath);
}

export function classifyPage(value) {
  const pathname = safePathname(value);
  if (/\.(?:png|jpe?g|gif|webp|svg|ico|css|js|woff2?)$/i.test(pathname)) return 'asset';
  if (/\.pdf$/i.test(pathname)) return 'pdf';
  if (/\.md$/i.test(pathname)) return 'markdown';
  if (/\.(?:json|jsonld|txt|xml)$/i.test(pathname)) return 'machine';
  if (pathname === '/' || pathname.endsWith('/')) return 'html';
  return 'other';
}

export function sum(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

export function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

export function parseCsv(value) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    const next = value[index + 1];
    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(cell);
      cell = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((item) => item.trim())) rows.push(row);
  return rows;
}

function buildReportFromPages(pageReports, queryReports, validRows, invalidRows, inputPath) {
  const totalImpressions = sum(pageReports, 'impressions');
  const weightedPosition = pageReports.reduce((total, page) => total + Number(page.weightedPosition || 0), 0);
  return {
    generatedAt: new Date().toISOString(),
    input: inputPath,
    totals: {
      pages: pageReports.length,
      clicks: sum(pageReports, 'clicks'),
      impressions: totalImpressions,
      weightedPosition: round(weightedPosition),
      averagePosition: round(weightedPosition / Math.max(1, totalImpressions))
    },
    rows: {
      valid: validRows.length,
      invalid: invalidRows.length,
      invalidRows: invalidRows.slice(0, 50)
    },
    resourceMix: Object.fromEntries(
      ['html', 'markdown', 'machine', 'pdf', 'asset', 'other'].map((kind) => [
        kind,
        pageReports.filter((page) => page.kind === kind).length
      ])
    ),
    worstHighImpressionPages: pageReports
      .filter((page) => page.impressions >= 10)
      .sort((a, b) => b.averagePosition - a.averagePosition)
      .slice(0, 20),
    rawResourcesToRemoveOrDeprioritize: pageReports
      .filter((page) => ['markdown', 'machine', 'asset'].includes(page.kind))
      .slice(0, 50),
    queries: queryReports,
    pages: pageReports
  };
}

function recommendedAction(page, averagePosition) {
  const kind = classifyPage(page);
  if (['markdown', 'machine', 'asset'].includes(kind)) {
    return 'Remove from sitemap/internal search links; keep Googlebot disallow or request removal if indexed.';
  }
  if (kind === 'html' && averagePosition > 20) {
    return 'Improve page-specific title/H1/intro and link from a relevant cluster section.';
  }
  if (kind === 'html' && averagePosition > 10) return 'Tighten query match and add supporting internal links.';
  return 'Monitor.';
}

function normalizeHeader(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function columnIndex(headers, aliases) {
  return headers.findIndex((header) => aliases.includes(header));
}

function clean(value) {
  return String(value || '').trim();
}

function parseRequiredNumber(value) {
  const normalized = clean(value).replace(/%$/, '').replace(/,/g, '');
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized)) return Number.NaN;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : Number.NaN;
}

function safePathname(value) {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
}
