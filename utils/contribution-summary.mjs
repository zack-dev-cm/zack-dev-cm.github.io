/** Keep accepted merges, recorded reverts and open proposals distinct. */
export const contributionSummary = pullRequests => {
  const counts = { merged: 0, reverted: 0, open: 0, closed: 0 };
  for (const pull of pullRequests) {
    if (!['merged', 'open', 'closed'].includes(pull.status)) throw new Error('Unknown contribution status');
    if (pull.revertedBy && pull.status !== 'merged') throw new Error('A historical revert requires a merged PR');
    counts[pull.revertedBy ? 'reverted' : pull.status] += 1;
  }
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${status} ${count === 1 ? 'PR' : 'PRs'}`)
    .join(' · ');
};
