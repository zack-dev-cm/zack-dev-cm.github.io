import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { contributionSummary, isMaintainerMerged } from '../utils/contribution-summary.mjs';

test('the published catalogue omits withdrawn work and separates independent merges', () => {
  const catalogue = JSON.parse(fs.readFileSync(new URL('../data/open-source-contributions.json', import.meta.url)));
  const neuralink = catalogue.projects.find(project => project.name === 'Neuralink');
  assert.equal(neuralink.pullRequests.length, 6);
  assert.equal(neuralink.pullRequests.find(pull => pull.number === 58), undefined);
  assert.equal(contributionSummary(neuralink.pullRequests), '6 merged PRs');
  assert.ok(catalogue.projects.every(project => project.pullRequests.every(pull => !pull.revertedBy)));
  assert.ok(isMaintainerMerged(catalogue.projects.find(project => project.name === 'GPlates')));
  assert.ok(!isMaintainerMerged(catalogue.projects.find(project => project.name === 'CompTech')));
  assert.ok(!isMaintainerMerged(catalogue.projects.find(project => project.name === 'YParser')));
  assert.ok(!isMaintainerMerged(catalogue.projects.find(project => project.name === 'GuidedSAM-Plume')));
});

test('other lifecycle states and withdrawn work add no public status labels or merge counts', () => {
  const records = Object.freeze([
    Object.freeze({ status: 'merged' }),
    Object.freeze({ status: 'merged', revertedBy: 'https://github.com/example/library/pull/5' }),
    Object.freeze({ status: 'open' }), Object.freeze({ status: 'open' }), Object.freeze({ status: 'closed' }),
  ]);
  assert.equal(contributionSummary(records), '1 merged PR');
  assert.equal(contributionSummary([{ status: 'open' }, { status: 'closed' }]), '');
});

test('self merges, missing merge actors and mixed proposals cannot enter the merged group', () => {
  const project = pullRequests => ({ account: 'author', pullRequests });
  assert.ok(isMaintainerMerged(project([{ status: 'merged', mergedBy: 'maintainer' }])));
  for (const pulls of [[], [{ status: 'merged' }], [{ status: 'merged', mergedBy: 'AUTHOR' }],
    [{ status: 'merged', mergedBy: 'maintainer', revertedBy: 'https://github.com/example/library/pull/5' }],
    [{ status: 'merged', mergedBy: 'maintainer' }, { status: 'open' }]]) {
    assert.ok(!isMaintainerMerged(project(pulls)));
  }
});

test('invalid states and a revert attached to an unmerged proposal are rejected', () => {
  assert.throws(() => contributionSummary([{ status: 'unknown' }]), /Unknown contribution status/);
  assert.throws(() => contributionSummary([{ status: 'open', revertedBy: 'https://github.com/example/library/pull/5' }]),
    /requires a merged PR/);
});
