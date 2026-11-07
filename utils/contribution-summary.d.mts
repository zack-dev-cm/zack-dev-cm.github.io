export function contributionSummary(pullRequests: ReadonlyArray<{
  status: string;
  revertedBy?: string;
}>): string;
export function isMaintainerMerged(project: {
  account: string;
  pullRequests: ReadonlyArray<{ status: string; mergedBy?: string; revertedBy?: string }>;
}): boolean;
