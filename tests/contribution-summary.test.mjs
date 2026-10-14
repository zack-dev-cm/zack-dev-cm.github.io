import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { contributionSummary } from '../utils/contribution-summary.mjs';

test('historical reverts stay visible without inflating accepted merge totals', () => {
  const catalogue = JSON.parse(fs.readFileSync(new URL('../data/open-source-contributions.json', import.meta.url)));
  const neuralink = catalogue.projects.find(project => project.name === 'Neuralink');
  assert.equal(neuralink.pullRequests.length, 7);
  assert.equal(neuralink.pullRequests.find(pull => pull.number === 58).status, 'merged');
  assert.equal(neuralink.pullRequests.find(pull => pull.number === 58).revertedBy,
    'https://github.com/neuralinkcorp/datarepo/pull/72');
  assert.equal(contributionSummary(neuralink.pullRequests), '6 merged PRs · 1 reverted PR');
});

test('mixed lifecycle states retain their separate counts', () => {
  const records = Object.freeze([
    Object.freeze({ status: 'merged' }),
    Object.freeze({ status: 'merged', revertedBy: 'https://github.com/example/library/pull/5' }),
    Object.freeze({ status: 'open' }), Object.freeze({ status: 'open' }), Object.freeze({ status: 'closed' }),
  ]);
  assert.equal(contributionSummary(records), '1 merged PR · 1 reverted PR · 2 open PRs · 1 closed PR');
});

test('invalid states and a revert attached to an unmerged proposal are rejected', () => {
  assert.throws(() => contributionSummary([{ status: 'unknown' }]), /Unknown contribution status/);
  assert.throws(() => contributionSummary([{ status: 'open', revertedBy: 'https://github.com/example/library/pull/5' }]),
    /requires a merged PR/);
});
