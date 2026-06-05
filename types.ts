
export interface ProjectLink {
  text: string;
  url: string;
}

export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProjectBenchmark {
  label: string;
  value: string;
  context?: string;
}

export interface ProjectCanonicalLinks {
  telegramBot?: string;
  telegramMiniApp?: string;
  telegramChannel?: string;
  chromeWebStore?: string;
  github?: string;
  website?: string;
}

export interface PortfolioUpdateReview {
  status: 'PASS' | 'REVIEW' | 'BLOCK';
  checkedAt: string;
  syncedAt?: string;
  gateVersion?: number;
  gates: string[];
  toolchain?: string[];
}

export interface Project {
  id: number;
  title: string;
  legacySlugs?: string[];
  aliases?: string[];
  description: string;
  longDescription?: string;
  hideImages?: boolean;
  projectKind?: 'user-product' | 'open-source' | 'case-study' | 'research';
  surfaceTags?: string[];
  mobileReady?: boolean;
  keyFeatures: string[];
  techStack: string[];
  links: ProjectLink[];
  images: ProjectImage[];
  thumbnail: string;
  topologySnapshot?: string;
  mermaidDiagram?: string;
  benchmarks?: ProjectBenchmark[];
  repoFullName?: string;
  repoId?: number;
  createdAt?: string;
  canonicalLinks?: ProjectCanonicalLinks;
  review?: PortfolioUpdateReview;
}

export interface Company {
  name: string;
  logoUrl: string;
}

export interface SocialLinks {
  linkedin: string;
  x: string;
  email: string;
  githubPrimary: string;
  githubSecondary: string;
  telegram: string;
  resume: string;
}

export interface AuthorInfo {
  name: string;
  title: string;
  bio: string;
}

export interface LatestUpdate {
  title: string;
  description?: string;
  links: ProjectLink[];
  projectId?: number;
  repoFullName?: string;
  repoId?: number;
  createdAt?: string;
  review?: PortfolioUpdateReview;
}

export interface ClawHubDownloadStat {
  slug: string;
  displayName: string;
  downloads: number;
  versions: number;
  stars: number;
  url: string;
  checkedAt: string;
}

export interface ChromeExtensionStat {
  id: string;
  name: string;
  description: string;
  users: number;
  usersSource: string;
  rating?: number;
  ratingCount?: number;
  version: string;
  lastUpdated: string;
  createdAt?: string;
  category: string;
  permissions?: string[];
  sizeKb?: number;
  chromeStatsUrl?: string;
  chromeWebStoreUrl: string;
  productUrl?: string;
  dataIngestedAt: string;
}

export interface ChromeExtensionStatsSnapshot {
  publisherName: string;
  publisherUrl: string;
  checkedAt: string;
  sourceName: string;
  sourceUrl: string;
  totalPublished: number;
  totalUsers: number;
  averageUsersPerExtension: number;
  averageRating: number;
  ratingCount: number;
  notes: string[];
  extensions: ChromeExtensionStat[];
}

export interface PortfolioUpdates {
  version?: number;
  lastSyncedAt?: string | null;
  review?: PortfolioUpdateReview;
  latestUpdates: LatestUpdate[];
  projects: Project[];
}
