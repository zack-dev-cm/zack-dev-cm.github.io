import type { Project } from '../types';

export function normalizeSearchValue(value: unknown): string;
export function extractSearchTerms(value: unknown): string[];
export function getProjectSearchText(project: Project): string;
export function searchProjects<T extends Project>(projects: readonly T[], query: string, options?: {
  boostedProjectIds?: readonly number[];
  sort?: 'impact' | 'recent' | 'alpha';
  getSignalScore?: (project: T) => number;
  catalogue?: readonly Project[];
}): T[];
