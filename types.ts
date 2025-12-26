
export interface ProjectLink {
  text: string;
  url: string;
}

export interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  hideImages?: boolean;
  keyFeatures: string[];
  techStack: string[];
  links: ProjectLink[];
  images: ProjectImage[];
  thumbnail: string;
  topologySnapshot?: string;
  repoFullName?: string;
  repoId?: number;
  createdAt?: string;
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
