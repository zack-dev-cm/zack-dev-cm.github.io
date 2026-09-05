import type { Project, PortfolioUpdates } from '../types';

export function slugify(value: string | number): string;
export function getProjectSlug(project: Project): string;
export function getProjectCanonicalSlug(project: Project): string;
export function getProjectRouteSlugs(project: Project): string[];
export function selectReviewedFeedProjects(feed: PortfolioUpdates | null | undefined, excludedRepos?: readonly string[]): Project[];
export function mergeProjects(curatedProjects: Project[], syncedProjects: Project[]): Project[];
export function assertUniqueProjectRoutes(projects: Project[]): void;
