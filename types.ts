
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
}

export interface Company {
  name: string;
  logoUrl: string;
}

export interface SocialLinks {
  linkedin: string;
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
}

export interface PortfolioUpdates {
  version?: number;
  lastSyncedAt?: string | null;
  latestUpdates: LatestUpdate[];
  projects: Project[];
}
