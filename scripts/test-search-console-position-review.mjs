import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cases = [
  {
    name: 'bad export proves average position is still bad',
    args: ['scripts/review-search-console-position.mjs', 'tests/fixtures/search-console-average-position-bad.csv'],
    expectStatus: 1,
    expectOutput: [
      'SEARCH_CONSOLE_POSITION_GATE=fail',
      'site-average-position-bad',
      'nonbrand-html-position-bad',
      'raw-resource-indexing'
    ]
  },
  {
    name: 'missing export refuses to certify improvement',
    args: ['scripts/review-search-console-position.mjs'],
    expectStatus: 2,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=fail', 'missing-input']
  },
  {
    name: 'invalid positions are blockers, not rounded down',
    args: ['scripts/review-search-console-position.mjs', 'tests/fixtures/search-console-invalid-position.csv'],
    expectStatus: 1,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=fail', 'invalid-position-data']
  },
  {
    name: 'search console average-position header alias is accepted',
    args: ['scripts/review-search-console-position.mjs', 'tests/fixtures/search-console-average-position-header.csv'],
    expectStatus: 0,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=pass', 'failures=none']
  },
  {
    name: 'space separated period option is accepted',
    args: [
      'scripts/review-search-console-position.mjs',
      'tests/fixtures/search-console-average-position-good.csv',
      '--period',
      '2026-05-10..2026-06-06'
    ],
    expectStatus: 0,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=pass', 'failures=none']
  },
  {
    name: 'invalid threshold refuses to certify improvement',
    args: [
      'scripts/review-search-console-position.mjs',
      'tests/fixtures/search-console-average-position-good.csv',
      '--max-all-average-position=not-a-number'
    ],
    expectStatus: 2,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=fail', 'invalid-threshold']
  },
  {
    name: 'good export clears the reviewer gate',
    args: ['scripts/review-search-console-position.mjs', 'tests/fixtures/search-console-average-position-good.csv'],
    expectStatus: 0,
    expectOutput: ['SEARCH_CONSOLE_POSITION_GATE=pass', 'failures=none']
  }
];

for (const testCase of cases) {
  const result = spawnSync(process.execPath, testCase.args, {
    cwd: rootDir,
    encoding: 'utf8'
  });
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.status !== testCase.expectStatus) {
    throw new Error(
      `${testCase.name}: expected exit ${testCase.expectStatus}, got ${result.status}\n${output}`
    );
  }
  for (const expected of testCase.expectOutput) {
    if (!output.includes(expected)) {
      throw new Error(`${testCase.name}: missing "${expected}"\n${output}`);
    }
  }
}

const reviewPath = path.resolve(rootDir, 'search-console-position-gate.json');
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
if (review.verdict !== 'pass' || review.segments.all.averagePosition > review.thresholds.maxAllAveragePosition) {
  throw new Error(`Expected final good fixture review to be GREEN, got ${JSON.stringify(review, null, 2)}`);
}

console.log(`Search Console position reviewer tests passed (${cases.length} cases).`);
