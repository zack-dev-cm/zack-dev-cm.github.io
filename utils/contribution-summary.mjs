/** Only independently merged work belongs in the merged contribution group. */
export const isMaintainerMerged = project => project.pullRequests.length > 0
  && project.pullRequests.every(pull => pull.status === 'merged' && !pull.revertedBy
    && pull.mergedBy && pull.mergedBy.toLowerCase() !== project.account.toLowerCase());

/** Other lifecycle states carry no public status label. */
export const contributionSummary = pullRequests => {
  let merged = 0;
  for (const pull of pullRequests) {
    if (!['merged', 'open', 'closed'].includes(pull.status)) throw new Error('Unknown contribution status');
    if (pull.revertedBy && pull.status !== 'merged') throw new Error('A historical revert requires a merged PR');
    if (pull.status === 'merged' && !pull.revertedBy) merged += 1;
  }
  return merged ? `${merged} merged ${merged === 1 ? 'PR' : 'PRs'}` : '';
};
