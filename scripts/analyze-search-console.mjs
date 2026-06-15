import { buildSearchConsoleReportFromCsvFile, writeJsonReport } from './search-console-metrics.mjs';

const inputPath = process.argv[2];
if (!inputPath || process.argv.includes('--help')) {
  console.log('Usage: npm run search-console:analyze -- path/to/search-console-export.csv');
  console.log('Expected columns: query, page, clicks, impressions, ctr, position. Case-insensitive; extra columns are ignored.');
  process.exit(inputPath ? 0 : 1);
}

const report = await buildSearchConsoleReportFromCsvFile(inputPath);
const outputPath = await writeJsonReport('search-console-position-report.json', report);
console.log(`Wrote ${outputPath}`);
console.log(`Pages: ${report.totals.pages}; impressions: ${report.totals.impressions}; average position: ${report.totals.averagePosition}`);
console.log(`Raw resources flagged: ${report.rawResourcesToRemoveOrDeprioritize.length}`);
