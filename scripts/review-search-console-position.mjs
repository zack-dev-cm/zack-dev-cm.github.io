import {
  buildSearchConsoleReportFromCsvFile,
  readSearchConsoleReportFile,
  round,
  sum,
  writeJsonReport
} from './search-console-metrics.mjs';

const REVIEWER = {
  name: 'Mira Ortega',
  role: 'Search Console ranking reviewer subagent',
  stance:
    'Skeptical reviewer. Average position is still bad until exported Search Console evidence clears all resource, non-brand, and raw-indexing thresholds.'
};

const DEFAULT_BRAND_REGEX = 'zack|zakhar|pashkin|zack-dev-cm';
const args = process.argv.slice(2);
const options = parseOptions(args);
const inputPath = options.positionals[0];

if (options.help) {
  printUsage();
  process.exit(0);
}

if (!inputPath) {
  const review = buildInvalidInputReview('missing-input', 'Search Console reviewer cannot certify average-position improvement without a GSC export or report JSON.');
  const outputPath = await writeJsonReport('search-console-position-gate.json', review);
  printGateLine(review, outputPath);
  printUsage();
  process.exit(2);
}

const thresholds = {
  minTotalImpressions: readNumberOption(options, 'min-total-impressions', 100),
  minNonBrandHtmlImpressions: readNumberOption(options, 'min-nonbrand-html-impressions', 50),
  maxAllAveragePosition: readNumberOption(options, 'max-all-average-position', 25),
  maxNonBrandHtmlAveragePosition: readNumberOption(options, 'max-nonbrand-html-average-position', 20),
  minTop10ImpressionShare: readNumberOption(options, 'min-top10-share', 0.1),
  maxPositionGt20Share: readNumberOption(options, 'max-gt20-share', 0.5),
  weakPageMinImpressions: readNumberOption(options, 'weak-page-min-impressions', 10),
  weakPageMaxAveragePosition: readNumberOption(options, 'weak-page-max-average-position', 20),
  weakPageFailCount: readNumberOption(options, 'weak-page-fail-count', 3),
  criticalPageMinImpressions: readNumberOption(options, 'critical-page-min-impressions', 50),
  criticalPageMaxAveragePosition: readNumberOption(options, 'critical-page-max-average-position', 30),
  rawResourceMaxImpressions: readNumberOption(options, 'raw-resource-max-impressions', 9)
};
const invalidThresholds = Object.entries(thresholds)
  .filter(([, value]) => !Number.isFinite(value) || value < 0)
  .map(([name]) => name);
if (invalidThresholds.length) {
  const review = buildInvalidInputReview(
    'invalid-threshold',
    `Invalid numeric threshold(s): ${invalidThresholds.join(', ')}.`
  );
  const outputPath = await writeJsonReport('search-console-position-gate.json', review);
  printGateLine(review, outputPath);
  process.exit(2);
}
const brandRegexSource = options['brand-regex'] || DEFAULT_BRAND_REGEX;
const brandRegex = new RegExp(brandRegexSource, 'i');
const period = options.period || 'unspecified';

let report;
try {
  report = inputPath.endsWith('.json')
    ? await readSearchConsoleReportFile(inputPath)
    : await buildSearchConsoleReportFromCsvFile(inputPath, {
        requireQuery: true,
        requireClicks: true
      });
} catch (error) {
  const review = buildInvalidInputReview(error.code || 'invalid-export', error.message, {
    input: inputPath,
    period,
    brandRegex: brandRegexSource,
    thresholds
  });
  const outputPath = await writeJsonReport('search-console-position-gate.json', review);
  printGateLine(review, outputPath);
  process.exit(2);
}

const review = buildReview(report, thresholds, { brandRegex, brandRegexSource, period });
const outputPath = await writeJsonReport('search-console-position-gate.json', review);

printGateLine(review, outputPath);
if (!review.ok) process.exit(1);

function buildReview(report, limits, context) {
  const pages = Array.isArray(report.pages) ? report.pages : [];
  const queries = Array.isArray(report.queries) ? report.queries : [];
  const rawResourcePages = pages.filter((page) => ['markdown', 'machine', 'asset'].includes(page.kind));
  const rawResourceImpressions = sum(rawResourcePages, 'impressions');
  const rawResourceClicks = sum(rawResourcePages, 'clicks');
  const htmlPages = pages.filter((page) => page.kind === 'html');
  const nonBrandHtmlQueries = queries.filter(
    (query) => query.kind === 'html' && !context.brandRegex.test(query.query || '')
  );
  const allSegment = summarizeSegment(pages);
  const nonBrandHtmlSegment = summarizeSegment(nonBrandHtmlQueries);
  const buckets = buildPositionBuckets(queries.length ? queries : pages);
  const weakHtmlPages = htmlPages
    .filter(
      (page) =>
        page.impressions >= limits.weakPageMinImpressions &&
        page.averagePosition > limits.weakPageMaxAveragePosition
    )
    .sort((a, b) => b.impressions - a.impressions);
  const criticalHtmlPages = htmlPages
    .filter(
      (page) =>
        page.impressions >= limits.criticalPageMinImpressions &&
        page.averagePosition > limits.criticalPageMaxAveragePosition
    )
    .sort((a, b) => b.impressions - a.impressions);
  const worstQueries = nonBrandHtmlQueries
    .filter((query) => query.averagePosition > limits.maxNonBrandHtmlAveragePosition)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);
  const failures = [];
  addFailure(
    failures,
    report.rows?.invalid > 0,
    'invalid-position-data',
    'blocker',
    report.rows?.invalid || 0,
    '0 invalid rows',
    report.rows?.invalidRows || []
  );
  addFailure(
    failures,
    allSegment.impressions < limits.minTotalImpressions,
    'insufficient-evidence',
    'blocker',
    allSegment.impressions,
    `>= ${limits.minTotalImpressions} total impressions`,
    pages.slice(0, 5)
  );
  addFailure(
    failures,
    nonBrandHtmlSegment.impressions < limits.minNonBrandHtmlImpressions,
    'insufficient-nonbrand-html-evidence',
    'blocker',
    nonBrandHtmlSegment.impressions,
    `>= ${limits.minNonBrandHtmlImpressions} non-brand HTML impressions`,
    nonBrandHtmlQueries.slice(0, 10)
  );
  addFailure(
    failures,
    allSegment.averagePosition > limits.maxAllAveragePosition,
    'site-average-position-bad',
    'blocker',
    allSegment.averagePosition,
    `<= ${limits.maxAllAveragePosition}`,
    pages.slice(0, 10)
  );
  addFailure(
    failures,
    nonBrandHtmlSegment.averagePosition > limits.maxNonBrandHtmlAveragePosition,
    'nonbrand-html-position-bad',
    'blocker',
    nonBrandHtmlSegment.averagePosition,
    `<= ${limits.maxNonBrandHtmlAveragePosition}`,
    worstQueries
  );
  addFailure(
    failures,
    buckets.top10ImpressionShare < limits.minTop10ImpressionShare,
    'weak-page-one-share',
    'major',
    buckets.top10ImpressionShare,
    `>= ${limits.minTop10ImpressionShare}`,
    buckets.evidence.top10
  );
  addFailure(
    failures,
    buckets.positionGt20Share >= limits.maxPositionGt20Share,
    'mostly-page-three-plus',
    'blocker',
    buckets.positionGt20Share,
    `< ${limits.maxPositionGt20Share}`,
    buckets.evidence.gt20
  );
  addFailure(
    failures,
    weakHtmlPages.length >= limits.weakPageFailCount,
    'high-impression-pages-still-bad',
    'major',
    weakHtmlPages.length,
    `< ${limits.weakPageFailCount} HTML pages worse than position ${limits.weakPageMaxAveragePosition}`,
    weakHtmlPages.slice(0, 20)
  );
  addFailure(
    failures,
    criticalHtmlPages.length > 0,
    'critical-html-page-still-bad',
    'blocker',
    criticalHtmlPages.length,
    `0 HTML pages with >= ${limits.criticalPageMinImpressions} impressions worse than position ${limits.criticalPageMaxAveragePosition}`,
    criticalHtmlPages.slice(0, 20)
  );
  addFailure(
    failures,
    rawResourceImpressions > limits.rawResourceMaxImpressions || rawResourceClicks > 0,
    'raw-resource-indexing',
    'blocker',
    { impressions: rawResourceImpressions, clicks: rawResourceClicks },
    `<= ${limits.rawResourceMaxImpressions} impressions and 0 clicks`,
    rawResourcePages.slice(0, 20)
  );

  return {
    schemaVersion: 1,
    ok: failures.length === 0,
    verdict: failures.length === 0 ? 'pass' : 'fail',
    reviewer: REVIEWER,
    generatedAt: new Date().toISOString(),
    input: report.input,
    period: context.period,
    brandRegex: context.brandRegexSource,
    thresholds: limits,
    segments: {
      all: allSegment,
      nonBrandHtml: nonBrandHtmlSegment
    },
    positionBuckets: {
      top10ImpressionShare: buckets.top10ImpressionShare,
      position11To20Share: buckets.position11To20Share,
      positionGt20Share: buckets.positionGt20Share
    },
    failures,
    evidence: {
      worstHighImpressionPages: weakHtmlPages.slice(0, 20),
      worstQueries,
      rawResources: rawResourcePages.slice(0, 20),
      invalidRows: report.rows?.invalidRows || []
    },
    nextActions: failures.length
      ? [
          'Deploy the canonical project HTML sitemap and robots changes before expecting Search Console movement.',
          'Use Search Console URL inspection/removals for old Markdown and machine URLs with impressions.',
          'Rewrite titles/H1/intro and add internal links for non-brand high-impression HTML pages over threshold.',
          'Rerun this gate on fresh 7-day and 28-day exports after Google recrawls the sitemap.'
        ]
      : [
          'Keep monitoring the same thresholds on fresh 7-day and 28-day exports.',
          'Prioritize query-level content updates only for pages that regress above the threshold.'
        ]
  };
}

function buildInvalidInputReview(id, message, context = {}) {
  return {
    schemaVersion: 1,
    ok: false,
    verdict: 'fail',
    reviewer: REVIEWER,
    generatedAt: new Date().toISOString(),
    input: context.input || null,
    period: context.period || 'unspecified',
    brandRegex: context.brandRegex || DEFAULT_BRAND_REGEX,
    thresholds: context.thresholds || {},
    segments: {},
    positionBuckets: {},
    failures: [
      {
        id,
        severity: 'blocker',
        actual: message,
        expected: 'valid Search Console CSV or generated report JSON',
        evidenceRows: 0
      }
    ],
    evidence: {},
    nextActions: ['Export Search Console performance data with query, page, clicks, impressions, CTR, and position columns.']
  };
}

function summarizeSegment(items) {
  const impressions = sum(items, 'impressions');
  const clicks = sum(items, 'clicks');
  const weightedPosition = items.reduce((total, item) => total + Number(item.weightedPosition || 0), 0);
  return {
    impressions,
    clicks,
    averagePosition: round(weightedPosition / Math.max(1, impressions))
  };
}

function buildPositionBuckets(items) {
  const impressions = sum(items, 'impressions');
  const top10 = items.filter((item) => item.averagePosition <= 10);
  const mid = items.filter((item) => item.averagePosition > 10 && item.averagePosition <= 20);
  const gt20 = items.filter((item) => item.averagePosition > 20);
  return {
    top10ImpressionShare: roundShare(sum(top10, 'impressions'), impressions),
    position11To20Share: roundShare(sum(mid, 'impressions'), impressions),
    positionGt20Share: roundShare(sum(gt20, 'impressions'), impressions),
    evidence: {
      top10: top10.slice(0, 10),
      gt20: gt20.sort((a, b) => b.impressions - a.impressions).slice(0, 20)
    }
  };
}

function addFailure(failures, condition, id, severity, actual, expected, evidence = []) {
  if (!condition) return;
  failures.push({
    id,
    severity,
    actual,
    expected,
    evidenceRows: Array.isArray(evidence) ? evidence.length : 0,
    evidence
  });
}

function roundShare(part, total) {
  return round(part / Math.max(1, total));
}

function printGateLine(review, outputPath) {
  const failureIds = review.failures.map((failure) => failure.id).join(',') || 'none';
  console.log(
    `SEARCH_CONSOLE_POSITION_GATE=${review.verdict} avgPosition=${review.segments?.all?.averagePosition ?? 'n/a'} nonBrandHtmlAvg=${review.segments?.nonBrandHtml?.averagePosition ?? 'n/a'} impressions=${review.segments?.all?.impressions ?? 0} failures=${failureIds} report=${outputPath}`
  );
}

function parseOptions(values) {
  const parsed = { positionals: [] };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === '--help' || value === '-h') {
      parsed.help = true;
    } else if (value.startsWith('--')) {
      const [key, rawValue] = value.slice(2).split('=');
      if (rawValue !== undefined) {
        parsed[key] = rawValue;
      } else if (values[index + 1] && !values[index + 1].startsWith('--')) {
        parsed[key] = values[index + 1];
        index += 1;
      } else {
        parsed[key] = 'true';
      }
    } else {
      parsed.positionals.push(value);
    }
  }
  return parsed;
}

function readNumberOption(options, name, fallback) {
  const value = options[name] ?? fallback;
  return Number(value);
}

function printUsage() {
  console.error('Usage: npm run search-console:gate -- path/to/search-console-export.csv');
  console.error('   or: npm run search-console:gate -- search-console-position-report.json');
  console.error('Options:');
  console.error(`  --brand-regex="${DEFAULT_BRAND_REGEX}"`);
  console.error('  --period=2026-05-10..2026-06-06');
  console.error('  --min-total-impressions=100');
  console.error('  --min-nonbrand-html-impressions=50');
  console.error('  --max-all-average-position=25');
  console.error('  --max-nonbrand-html-average-position=20');
  console.error('  --min-top10-share=0.1');
  console.error('  --max-gt20-share=0.5');
}
