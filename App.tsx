import React, { useMemo, useState, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Sidebar } from './components/Sidebar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { FloatingButtons } from './components/FloatingButtons';
import { Section } from './components/Section';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, TelegramIcon, XSocialIcon } from './components/Icons';
import {
  PROJECTS,
  COMPANIES,
  LATEST_UPDATES,
  KEY_HIGHLIGHTS,
  SOCIAL_LINKS,
  PORTFOLIO_UPDATE_REPO_EXCLUSIONS,
  LATEST_UPDATE_EXCLUDE_PATTERNS,
  CLAWHUB_DOWNLOAD_STATS,
  CHROME_EXTENSION_STATS
} from './constants';
import { DEFAULT_PROJECT_IMAGE, resolveAssetUrl } from './utils/assets';
import type { ChromeExtensionStat, Project, PortfolioUpdates, LatestUpdate } from './types';

const FEATURED_PROJECT_IDS = [70, 53, 43, 44] as const;
const FEATURED_PROJECT_INDEX: Map<number, number> = new Map(FEATURED_PROJECT_IDS.map((id, index) => [id, index]));
const ENABLE_VERCEL_ANALYTICS = import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === 'true';
const CLAWHUB_TOTAL_DOWNLOADS = CLAWHUB_DOWNLOAD_STATS.reduce((sum, stat) => sum + stat.downloads, 0);
const CV_REPRO_DOWNLOADS = CLAWHUB_DOWNLOAD_STATS
  .filter((stat) => stat.slug === 'data-science-cv-repro-lab' || stat.slug === 'sota-agent')
  .reduce((sum, stat) => sum + stat.downloads, 0);

const FEATURED_PROJECT_CONTEXT: Record<number, { label: string; summary: string; proof: string[] }> = {
  70: {
    label: 'Production OCR serving',
    summary:
      'A containerized OCR serving pattern that turns line segmentation, word segmentation, and CRNN recognition into a reviewable FastAPI contract.',
    proof: ['3-stage OCR pipeline', 'FastAPI + ONNX Runtime', 'JSON text + box outputs']
  },
  53: {
    label: 'Evidence tracking system',
    summary:
      'A public CLI/reporting flow that keeps GitHub metadata, dated ClawHub listing snapshots, dashboard stats, and conversion gaps visible instead of scattered across package pages.',
    proof: [`${CLAWHUB_TOTAL_DOWNLOADS.toLocaleString('en-US')} tracked ClawHub downloads`, `${CLAWHUB_DOWNLOAD_STATS.length} public skills`, 'Live owner-profile verification']
  },
  45: {
    label: 'Open-source review harness',
    summary:
      'A public CLI that treats AI-written research as an artifact to lint, gate, and push through CI before it reaches a paper, proposal, or lab note.',
    proof: ['4 output formats', '6 issue families', 'No network dependency']
  },
  44: {
    label: 'Legacy-safe revenue automation',
    summary:
      'An anonymized clinic-network deployment: AI qualification and follow-up automation layered onto a legacy stack without forcing a rewrite.',
    proof: ['Legacy DB preserved', 'Human approvals built in', 'Lead routing stayed human-safe']
  },
  40: {
    label: 'AI visibility product',
    summary:
      'An end-to-end product for AI discoverability: scan a site, score it, generate memorizer assets, and deliver them through web and Telegram surfaces.',
    proof: ['Asset generation engine', 'Three-service Cloud Run topology', 'Web plus Telegram delivery']
  },
  43: {
    label: 'CV / MLOps productization',
    summary:
      'Two public ClawHub releases for benchmark-gated CV experimentation, review dashboards, and promotion-ready evidence.',
    proof: [`${CV_REPRO_DOWNLOADS.toLocaleString('en-US')} ClawHub downloads`, 'Review dashboards + promotion gates', '29 structured helpers']
  },
};

const COMPUTER_VISION_PRIORITY_IDS = [70, 72, 71, 73, 74, 63, 41, 10, 11, 1, 5, 6, 8, 9, 12, 13, 14, 25, 67, 43, 35] as const;
const AI_SYSTEM_PRIORITY_IDS = [68, 53, 43, 66, 44, 69, 61, 64, 62, 60, 40, 39, 38, 36, 35, 31, 29, 56, 75, 45, 46, 47, 48, 49, 50, 51, 52, 57, 58, 65, 72, 30, 26, 23, 24, 27, 28, 3, 2, 1, 5, 11] as const;
const PROJECT_ARCHIVE_INITIAL_LIMIT = 24;

const COMPUTER_VISION_LANES = [
  {
    label: 'OCR serving',
    value: '3-stage ONNX',
    detail: 'line segmentation, word detection, CRNN recognition, FastAPI response contracts'
  },
  {
    label: 'Face texture',
    value: 'ROI + masks',
    detail: 'landmarks, cosmetic regions, wrinkle/fine-line traces, quality gates'
  },
  {
    label: 'Video search',
    value: 'Hybrid retrieval',
    detail: 'keyframes, ASR/OCR, visual embeddings, transcript embeddings, ranked results'
  },
  {
    label: 'Public archive',
    value: '2 GitHub accounts',
    detail: 'authored OCR, detection, mobile inference, and notebook repos separated from forks'
  }
];

const DELIVERY_PILLARS = [
  {
    title: 'Automation with human review',
    description:
      'I design automations that fit real operating constraints: approvals, fallbacks, legacy systems, and clear next steps for people.'
  },
  {
    title: 'Computer vision that ships as a product',
    description:
      'From OCR and segmentation to multimodal CV services, I focus on getting models into APIs, apps, and measurable user flows.'
  },
  {
    title: 'Launch-ready interfaces, not lab demos',
    description:
      'Telegram mini apps, React fronts, mobile clients, Cloud Run services, and QA loops built to survive releases and real usage.'
  }
];

const HERO_WORK_ROUTES = [
  {
    label: 'Computer vision',
    value: 'OCR, detection, segmentation',
    detail: 'Models shipped as APIs, apps, retrieval systems, and reviewable outputs.',
    href: '#computer-vision'
  },
  {
    label: 'AI products',
    value: 'VLM/LLM workflows, agents',
    detail: 'Custom systems that connect models to backend delivery and product surfaces.',
    href: '#ai-systems'
  },
  {
    label: 'Public proof',
    value: 'Case studies, users, release gates',
    detail: 'Dated evidence across GitHub, ClawHub, Chrome Web Store, and Telegram.',
    href: '#featured'
  }
];

const parseGithubRepo = (url?: string) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return `${owner}/${repo}`;
  } catch {
    return null;
  }
};

const getRepoKeyFromLinks = (links: { url: string }[]) => {
  for (const link of links) {
    const key = parseGithubRepo(link.url);
    if (key) return key;
  }
  return null;
};

const dedupeByKey = <T,>(items: T[], getKey: (item: T) => string) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortByCreatedAtDesc = <T extends { createdAt?: string }>(items: T[]) => {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });
};

const isVideoUrl = (url: string) => {
  const normalized = url.split('?')[0].split('#')[0].toLowerCase();
  return normalized.endsWith('.mp4') || normalized.endsWith('.webm') || normalized.endsWith('.ogg');
};

const formatCompactNumber = (value: number | null | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Not reported';
  return value.toLocaleString();
};

const formatRank = (value: number | null | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'n/a';
  return `#${value.toLocaleString()}`;
};

const renderChromeExtensionStatCard = (extension: ChromeExtensionStat) => (
  <article key={extension.id} className="extension-stat-card">
    <div className="extension-stat-card__main">
      <div>
        <h3>{extension.name}</h3>
        <p>{extension.description}</p>
      </div>
      <div className="extension-stat-card__metric">
        <strong>{formatCompactNumber(extension.users)}</strong>
        <span>{extension.usersSource}</span>
      </div>
    </div>
    <div className="extension-stat-card__grid">
      <span>
        <strong>Rating</strong>
        {extension.rating !== null ? `${extension.rating.toFixed(2)} (${extension.ratingCount})` : 'n/a'}
      </span>
      <span>
        <strong>Version</strong>
        {extension.version}
      </span>
      <span>
        <strong>Updated</strong>
        {extension.lastUpdated}
      </span>
      <span>
        <strong>Category</strong>
        {extension.category}
      </span>
      <span>
        <strong>Ranks</strong>
        {formatRank(extension.overallRank)} / {formatRank(extension.categoryRank)}
      </span>
      <span>
        <strong>Risk</strong>
        {extension.riskImpact} / {extension.riskLikelihood}
      </span>
      <span>
        <strong>Permissions</strong>
        {extension.permissions.join(', ')}
      </span>
    </div>
    <div className="latest-card__links extension-stat-card__links">
      <a href={extension.chromeWebStoreUrl} target="_blank" rel="noopener noreferrer" className="text-link">
        Chrome Web Store
      </a>
      <a href={extension.chromeStatsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
        Chrome-Stats detail
      </a>
      {extension.productUrl && (
        <a href={extension.productUrl} target="_blank" rel="noopener noreferrer" className="text-link">
          Product page
        </a>
      )}
    </div>
  </article>
);

const slugify = (value: string) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'item';
};

const getLatestKey = (update: LatestUpdate) => {
  return update.repoFullName || (update.repoId ? `${update.repoId}` : '') || getRepoKeyFromLinks(update.links) || update.title;
};

const getProjectKey = (project: Project) => {
  return project.repoFullName || (project.repoId ? `${project.repoId}` : '') || getRepoKeyFromLinks(project.links) || project.title;
};

const getLatestSlug = (update: LatestUpdate) => {
  return slugify(getLatestKey(update) || update.title || 'latest');
};

const getProjectSlug = (project: Project) => {
  return slugify(getProjectKey(project) || `${project.id}`);
};

const getProjectCanonicalSlug = (project: Project) => {
  return slugify(project.title || `${project.id}`);
};

const getProjectRouteSlugs = (project: Project) => {
  return dedupeStrings([
    getProjectCanonicalSlug(project),
    getProjectSlug(project),
    ...(project.legacySlugs ?? []),
  ]).map((slug) => slug.toLowerCase());
};

const applyShareParams = (
  url: URL,
  params: {
    project?: string | null;
    latest?: string | null;
  }
) => {
  if (params.project !== undefined) {
    if (params.project) {
      url.searchParams.set('project', params.project);
    } else {
      url.searchParams.delete('project');
    }
  }
  if (params.latest !== undefined) {
    if (params.latest) {
      url.searchParams.set('latest', params.latest);
    } else {
      url.searchParams.delete('latest');
    }
  }
};

const isExcludedRepo = (repoFullName?: string) => {
  if (!repoFullName) return false;
  return PORTFOLIO_UPDATE_REPO_EXCLUSIONS.some(
    (excluded) => excluded.toLowerCase() === repoFullName.toLowerCase()
  );
};

const isExcludedLatestUpdate = (update: LatestUpdate) => {
  if (isExcludedRepo(update.repoFullName)) return true;
  const title = update.title?.trim() || '';
  return LATEST_UPDATE_EXCLUDE_PATTERNS.some((pattern) => pattern.test(title));
};

const normalizeProject = (project: Project): Project => {
  const rawThumbnail = project.thumbnail || '';
  const thumbnail = project.hideImages ? '' : resolveAssetUrl(rawThumbnail || DEFAULT_PROJECT_IMAGE);
  const rawImages = project.images ?? [];
  const images = rawImages
    .map((image) => ({ ...image, url: resolveAssetUrl(image.url) }))
    .filter((image) => Boolean(image.url));
  if (images.length === 0 && !project.hideImages && thumbnail) {
    images.push({ url: thumbnail, alt: `${project.title} preview` });
  }
  const techStack = (project.techStack ?? []).filter(Boolean);
  const keyFeatures = (project.keyFeatures ?? []).filter(Boolean);
  return { ...project, thumbnail, images, techStack, keyFeatures };
};

const dedupeStrings = (items: Array<string | undefined>) => {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const item of items) {
    const trimmed = item?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(trimmed);
  }
  return output;
};

const hasRealUserMetrics = (project: Project) => {
  return (project.benchmarks ?? []).some((benchmark) =>
    /\b(users?|profiles?|installs?|dau|wau|mau|retention|adoption)\b/i.test(
      `${benchmark.label} ${benchmark.context ?? ''}`
    )
  );
};

const hasCanonicalPublicSurface = (project: Project) => {
  return Object.values(project.canonicalLinks ?? {}).some((url) => Boolean(url?.trim()));
};

const getProjectSearchText = (project: Project) => {
  return [
    project.title,
    project.description,
    project.longDescription || '',
    project.techStack.join(' '),
    project.keyFeatures.join(' '),
    (project.aliases ?? []).join(' '),
    (project.surfaceTags ?? []).join(' '),
    project.projectKind || '',
    ...(project.benchmarks ?? []).map((benchmark) =>
      `${benchmark.label} ${benchmark.value} ${benchmark.context ?? ''}`
    ),
    ...project.links.map((link) => `${link.text} ${link.url}`),
  ]
    .join(' ')
    .toLowerCase();
};

const getProjectSignals = (project: Project) => {
  const searchText = getProjectSearchText(project);
  const urls = project.links.map((link) => link.url.toLowerCase());
  const surfaceTags = new Set((project.surfaceTags ?? []).map((tag) => tag.toLowerCase()));
  const hasTelegram = surfaceTags.has('telegram') || urls.some((url) => url.includes('t.me/'));
  const hasChromeWebStore = urls.some((url) => url.includes('chromewebstore.google.com'));
  const hasGitHub = Boolean(project.repoFullName) || urls.some((url) => url.includes('github.com/'));
  const hasClawHub = urls.some((url) => url.includes('clawhub.ai/'));
  const isOpenSource = project.projectKind === 'open-source' || hasGitHub || hasClawHub;
  const isRealUsers =
    (project.projectKind === 'user-product' && hasCanonicalPublicSurface(project)) || hasRealUserMetrics(project);
  const isMobile =
    project.mobileReady === true ||
    surfaceTags.has('mobile') ||
    hasTelegram ||
    /\b(mobile|ios|android|telegram mini app|telegram web app|pwa|flutter)\b/i.test(searchText);
  const isWeb =
    surfaceTags.has('web') ||
    hasChromeWebStore ||
    /\b(web|react|vite|ssr|cloudflare|browser extension|extension)\b/i.test(searchText);
  const isAutomation =
    surfaceTags.has('automation') ||
    /\b(automation|workflow|orchestration|openclaw|launch validation|browser qa|mcp)\b/i.test(searchText);
  const isComputerVision =
    surfaceTags.has('computer-vision') ||
    /\b(vision|ocr|segmentation|anti-?spoof|wrinkle|pore|image|opencv|clip|coreml|tflite)\b/i.test(searchText);
  const isAiSystem =
    surfaceTags.has('ai') ||
    surfaceTags.has('automation') ||
    surfaceTags.has('mcp') ||
    surfaceTags.has('codex') ||
    surfaceTags.has('chatgpt-app') ||
    surfaceTags.has('release-engineering') ||
    /\b(ai|llms?|vlms?|openai|gpt|agentic|agents?|mcp|codex|openclaw|clawhub|generative|text-to-video|tool-calling|built-in ai|workflow orchestration|human review|skills?|chatgpt|answer engine|seo\/geo|llms\.txt|json-ld)\b/i.test(searchText);
  const badges = dedupeStrings([
    isRealUsers ? 'User-facing' : project.projectKind === 'case-study' ? 'Case study' : undefined,
    hasTelegram ? 'Telegram' : undefined,
    hasChromeWebStore ? 'Browser extension' : undefined,
    isOpenSource ? 'Open source' : undefined,
    isMobile ? 'Mobile ready' : undefined,
    isAutomation ? 'Automation' : undefined,
    isComputerVision ? 'Computer vision' : undefined,
    isAiSystem ? 'AI system' : undefined,
    project.benchmarks?.length ? 'Metrics included' : undefined,
  ]);
  const proofScore =
    (FEATURED_PROJECT_INDEX.has(project.id) ? 100 : 0) +
    (isRealUsers ? 24 : 0) +
    ((project.benchmarks?.length ?? 0) > 0 ? 12 : 0) +
    (isOpenSource ? 6 : 0) +
    (project.links.length > 0 ? 4 : 0);

  return {
    searchText,
    hasTelegram,
    hasChromeWebStore,
    isOpenSource,
    isRealUsers,
    isMobile,
    isWeb,
    isAutomation,
    isComputerVision,
    isAiSystem,
    badges,
    proofScore,
  };
};

const getPriorityIndex = (priorityIds: readonly number[], id: number) => {
  const index = priorityIds.indexOf(id);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const isPrioritizedProject = (priorityIds: readonly number[], project: Project) => {
  return priorityIds.includes(project.id);
};

const isComputerVisionDomainProject = (project: Project) => {
  return getProjectSignals(project).isComputerVision || isPrioritizedProject(COMPUTER_VISION_PRIORITY_IDS, project);
};

const isAiSystemDomainProject = (project: Project) => {
  return getProjectSignals(project).isAiSystem || isPrioritizedProject(AI_SYSTEM_PRIORITY_IDS, project);
};

const sortProjectsByDomainPriority = (projects: Project[], priorityIds: readonly number[]) => {
  return [...projects].sort((a, b) => {
    const priorityDelta = getPriorityIndex(priorityIds, a.id) - getPriorityIndex(priorityIds, b.id);
    if (priorityDelta !== 0) return priorityDelta;
    const proofDelta = getProjectSignals(b).proofScore - getProjectSignals(a).proofScore;
    if (proofDelta !== 0) return proofDelta;
    return b.id - a.id;
  });
};

const isHighSignalSyncedProject = (project: Project) => {
  const summary = (project.longDescription || project.description || '').trim();
  const links = project.links ?? [];
  if (!summary || /new project added from github/i.test(summary)) return false;
  if ((project.keyFeatures?.length ?? 0) < 2) return false;
  if ((project.techStack?.length ?? 0) < 2) return false;
  if (!links.length && !(project.benchmarks && project.benchmarks.length > 0)) return false;
  return true;
};

const isHighSignalLatestUpdate = (update: LatestUpdate) => {
  const description = update.description?.trim() || '';
  if (!update.links.length) return false;
  if (/new project added from github/i.test(description)) return false;
  return true;
};

const mergeProjectEntries = (primary: Project, fallback: Project): Project => {
  return normalizeProject({
    ...fallback,
    ...primary,
    legacySlugs: dedupeStrings([...(fallback.legacySlugs ?? []), ...(primary.legacySlugs ?? [])]),
    aliases: dedupeStrings([...(fallback.aliases ?? []), ...(primary.aliases ?? [])]),
    surfaceTags: dedupeStrings([...(fallback.surfaceTags ?? []), ...(primary.surfaceTags ?? [])]),
    description: primary.description || fallback.description,
    longDescription: primary.longDescription || fallback.longDescription,
    projectKind: primary.projectKind || fallback.projectKind,
    mobileReady: primary.mobileReady ?? fallback.mobileReady,
    keyFeatures: primary.keyFeatures.length ? primary.keyFeatures : fallback.keyFeatures,
    techStack: primary.techStack.length ? primary.techStack : fallback.techStack,
    links: primary.links.length ? primary.links : fallback.links,
    images: primary.images.length ? primary.images : fallback.images,
    thumbnail: primary.thumbnail || fallback.thumbnail,
    hideImages: primary.hideImages ?? fallback.hideImages,
    benchmarks: primary.benchmarks?.length ? primary.benchmarks : fallback.benchmarks,
    repoFullName: primary.repoFullName || fallback.repoFullName,
    repoId: primary.repoId ?? fallback.repoId,
    createdAt: primary.createdAt || fallback.createdAt,
    canonicalLinks: { ...(fallback.canonicalLinks ?? {}), ...(primary.canonicalLinks ?? {}) },
  });
};

const mergeLatestEntries = (primary: LatestUpdate, fallback: LatestUpdate): LatestUpdate => {
  return {
    ...fallback,
    ...primary,
    description: primary.description || fallback.description,
    links: primary.links.length ? primary.links : fallback.links,
    projectId: primary.projectId ?? fallback.projectId,
    repoFullName: primary.repoFullName || fallback.repoFullName,
    repoId: primary.repoId ?? fallback.repoId,
    createdAt: primary.createdAt || fallback.createdAt,
  };
};

const mergeProjects = (curatedProjects: Project[], syncedProjects: Project[]) => {
  const syncedBySlug = new Map<string, Project>();
  syncedProjects.forEach((project) => {
    [getProjectSlug(project), getProjectCanonicalSlug(project)].forEach((key) => {
      if (!syncedBySlug.has(key)) syncedBySlug.set(key, project);
    });
  });
  const usedSynced = new Set<Project>();
  const mergedCurated = curatedProjects.map((project) => {
    const synced = [getProjectSlug(project), getProjectCanonicalSlug(project)]
      .map((key) => syncedBySlug.get(key))
      .find(Boolean);
    if (!synced) return project;
    usedSynced.add(synced);
    return mergeProjectEntries(project, synced);
  });

  return sortByCreatedAtDesc([...mergedCurated, ...syncedProjects.filter((project) => !usedSynced.has(project))]);
};

const mergeLatestUpdates = (curatedUpdates: LatestUpdate[], syncedUpdates: LatestUpdate[]) => {
  const syncedBySlug = new Map<string, LatestUpdate>();
  syncedUpdates.forEach((update) => {
    [getLatestSlug(update), slugify(update.title)].forEach((key) => {
      if (!syncedBySlug.has(key)) syncedBySlug.set(key, update);
    });
  });
  const usedSynced = new Set<LatestUpdate>();
  const mergedCurated = curatedUpdates.map((update) => {
    const synced = [getLatestSlug(update), slugify(update.title)]
      .map((key) => syncedBySlug.get(key))
      .find(Boolean);
    if (!synced) return update;
    usedSynced.add(synced);
    return mergeLatestEntries(update, synced);
  });

  return sortByCreatedAtDesc([...mergedCurated, ...syncedUpdates.filter((update) => !usedSynced.has(update))]);
};

const STATIC_PROJECTS = PROJECTS.map(normalizeProject);
type ProjectSortMode = 'impact' | 'recent' | 'alpha';
type ProjectFilter =
  | 'all'
  | 'real-users'
  | 'telegram'
  | 'mobile'
  | 'automation'
  | 'computer-vision'
  | 'ai-systems'
  | 'open-source';

const PROJECT_FILTERS: Array<{ value: ProjectFilter; label: string }> = [
  { value: 'all', label: 'All projects' },
  { value: 'real-users', label: 'User-facing' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'mobile', label: 'Mobile ready' },
  { value: 'automation', label: 'Automation' },
  { value: 'computer-vision', label: 'Computer vision' },
  { value: 'ai-systems', label: 'AI systems' },
  { value: 'open-source', label: 'Open source' },
];

const COMMAND_NAV_ITEMS = [
  { label: 'Overview', href: '#intro' },
  { label: 'Proof', href: '#featured' },
  { label: 'CV', href: '#computer-vision' },
  { label: 'AI', href: '#ai-systems' },
  { label: 'Explore', href: '#projects' }
];

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [portfolioUpdates, setPortfolioUpdates] = useState<PortfolioUpdates | null>(null);
  const [activeLatestSlug, setActiveLatestSlug] = useState<string | null>(null);
  const [expandedLatestSlugs, setExpandedLatestSlugs] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [projectQuery, setProjectQuery] = useState('');
  const [projectSort, setProjectSort] = useState<ProjectSortMode>('impact');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [benchmarkedOnly, setBenchmarkedOnly] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const deferredProjectQuery = useDeferredValue(projectQuery);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'auto';
  }, [selectedProject]);

  useEffect(() => {
    let active = true;
    const loadUpdates = async () => {
      try {
        const response = await fetch(resolveAssetUrl('portfolio-updates.json'), { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as PortfolioUpdates;
        if (active) {
          setPortfolioUpdates(data);
        }
      } catch {
        // Silent fallback to bundled data if updates are unavailable.
      }
    };
    loadUpdates();
    return () => {
      active = false;
    };
  }, []);

  const updateLatest = useMemo(() => {
    const latestUpdates = portfolioUpdates?.latestUpdates ?? [];
    return sortByCreatedAtDesc(
      latestUpdates
        .filter((update) => !isExcludedLatestUpdate(update))
        .filter(isHighSignalLatestUpdate)
    );
  }, [portfolioUpdates]);

  const updateProjects = useMemo(
    () =>
      sortByCreatedAtDesc(
        (portfolioUpdates?.projects ?? [])
          .filter((project) => !isExcludedRepo(project.repoFullName))
          .filter(isHighSignalSyncedProject)
          .map(normalizeProject)
      ),
    [portfolioUpdates]
  );

  const mergedLatestUpdates = useMemo(() => {
    return mergeLatestUpdates(LATEST_UPDATES, updateLatest);
  }, [updateLatest]);

  const mergedProjects = useMemo(() => {
    return mergeProjects(STATIC_PROJECTS, updateProjects);
  }, [updateProjects]);

  const projectById = useMemo(() => {
    return new Map(mergedProjects.map((project) => [project.id, project]));
  }, [mergedProjects]);

  const projectByRepoFullName = useMemo(() => {
    return new Map(
      mergedProjects
        .filter((project) => project.repoFullName)
        .map((project) => [project.repoFullName!.toLowerCase(), project])
    );
  }, [mergedProjects]);

  const projectBySlug = useMemo(() => {
    return new Map(
      mergedProjects.flatMap((project) =>
        getProjectRouteSlugs(project).map((slug) => [slug, project] as const)
      )
    );
  }, [mergedProjects]);

  const latestBySlug = useMemo(() => {
    return new Map(mergedLatestUpdates.map((update) => [getLatestSlug(update), update]));
  }, [mergedLatestUpdates]);

  const benchmarkedProjectCount = useMemo(() => {
    return mergedProjects.filter((project) => project.benchmarks && project.benchmarks.length > 0).length;
  }, [mergedProjects]);

  const realUserProjectCount = useMemo(() => {
    return mergedProjects.filter((project) => getProjectSignals(project).isRealUsers).length;
  }, [mergedProjects]);

  const telegramProjectCount = useMemo(() => {
    return mergedProjects.filter((project) => getProjectSignals(project).hasTelegram).length;
  }, [mergedProjects]);

  const featuredProjects = useMemo(() => {
    return FEATURED_PROJECT_IDS.map((id) => projectById.get(id)).filter((project): project is Project => Boolean(project));
  }, [projectById]);

  const computerVisionProjects = useMemo(
    () =>
      sortProjectsByDomainPriority(
        mergedProjects.filter(isComputerVisionDomainProject),
        COMPUTER_VISION_PRIORITY_IDS
      ),
    [mergedProjects]
  );

  const aiSystemProjects = useMemo(
    () =>
      sortProjectsByDomainPriority(
        mergedProjects.filter(isAiSystemDomainProject),
        AI_SYSTEM_PRIORITY_IDS
      ),
    [mergedProjects]
  );

  const projectFilterOptions = useMemo(
    () =>
      PROJECT_FILTERS.map((filter) => ({
        ...filter,
        count:
          filter.value === 'all'
            ? mergedProjects.length
            : mergedProjects.filter((project) => {
                const signals = getProjectSignals(project);
                switch (filter.value) {
                  case 'real-users':
                    return signals.isRealUsers;
                  case 'telegram':
                    return signals.hasTelegram;
                  case 'mobile':
                    return signals.isMobile;
                  case 'automation':
                    return signals.isAutomation;
                  case 'computer-vision':
                    return isComputerVisionDomainProject(project);
                  case 'ai-systems':
                    return isAiSystemDomainProject(project);
                  case 'open-source':
                    return signals.isOpenSource;
                  default:
                    return true;
                }
              }).length
      })),
    [mergedProjects]
  );

  const clawHubSummary = useMemo(() => {
    const totalDownloads = CLAWHUB_DOWNLOAD_STATS.reduce((sum, stat) => sum + stat.downloads, 0);
    const totalVersions = CLAWHUB_DOWNLOAD_STATS.reduce((sum, stat) => sum + stat.versions, 0);
    const totalStars = CLAWHUB_DOWNLOAD_STATS.reduce((sum, stat) => sum + stat.stars, 0);
    const checkedAt = CLAWHUB_DOWNLOAD_STATS[0]?.checkedAt ?? '';
    return { totalDownloads, totalVersions, totalStars, checkedAt };
  }, []);

  const featuredClawHubStats = useMemo(() => CLAWHUB_DOWNLOAD_STATS.slice(0, 12), []);
  const remainingClawHubStats = useMemo(() => CLAWHUB_DOWNLOAD_STATS.slice(12), []);

  const chromeStatsSummary = useMemo(() => {
    const reportedRows = CHROME_EXTENSION_STATS.extensions.filter((extension) => extension.users !== null).length;
    const rowsAddedIn2026 = CHROME_EXTENSION_STATS.extensions.filter((extension) => extension.createdAt.startsWith('2026-')).length;
    const unreportedRows = CHROME_EXTENSION_STATS.extensions.length - reportedRows;
    const averageRating = CHROME_EXTENSION_STATS.averageRating.toFixed(2);
    return { reportedRows, rowsAddedIn2026, unreportedRows, averageRating };
  }, []);

  const chromeExtensionRows = useMemo(() => CHROME_EXTENSION_STATS.extensions, []);
  const featuredChromeExtensionRows = useMemo(() => {
    const mustKeepVisible = new Set(
      chromeExtensionRows
        .filter((extension) => extension.name === 'SourcePack Hub - Local AI Research Library')
        .map((extension) => extension.id)
    );
    return chromeExtensionRows.filter((extension, index) => index < 3 || mustKeepVisible.has(extension.id));
  }, [chromeExtensionRows]);
  const remainingChromeExtensionRows = useMemo(() => {
    const visibleIds = new Set(featuredChromeExtensionRows.map((extension) => extension.id));
    return chromeExtensionRows.filter((extension) => !visibleIds.has(extension.id));
  }, [chromeExtensionRows, featuredChromeExtensionRows]);

  const telegramReachSnapshot = useMemo(() => {
    const activeReach = projectById
      .get(11)
      ?.benchmarks?.find((benchmark) => benchmark.label === 'May MTD active reach');
    const value = activeReach?.value || '302 event-active / 117 logging users';
    const eventActive = value.match(/(\d[\d,]*)\s+event-active/)?.[1] || '302';
    const loggingUsers = value.match(/(\d[\d,]*)\s+logging users/)?.[1] || '117';
    return {
      eventActive,
      loggingUsers,
      context: activeReach?.context || 'aggregate counts from the 2026-05-21 Calorio production admin report'
    };
  }, [projectById]);

  const heroEvidenceRows = useMemo(
    () => [
      {
        label: 'Case-study map',
        value: `${mergedProjects.length}`,
        detail: 'CV systems, AI products, extensions, Telegram products, and launch gates'
      },
      {
        label: 'ClawHub downloads',
        value: clawHubSummary.totalDownloads.toLocaleString(),
        detail: `${CLAWHUB_DOWNLOAD_STATS.length} public skills checked ${clawHubSummary.checkedAt}`
      },
      {
        label: 'Product users',
        value: `${CHROME_EXTENSION_STATS.totalUsers.toLocaleString()} CWS / ${telegramReachSnapshot.loggingUsers} TG`,
        detail: `${chromeStatsSummary.reportedRows} visible CWS rows; ${telegramReachSnapshot.eventActive} event-active in Calorio`
      },
      {
        label: 'Measured releases',
        value: `${benchmarkedProjectCount} measured`,
        detail: 'projects with benchmarks, review notes, or dated metrics'
      }
    ],
    [benchmarkedProjectCount, chromeStatsSummary.reportedRows, clawHubSummary, mergedProjects.length, telegramReachSnapshot]
  );

  const artifactPlotRows = useMemo(() => {
    const denominator = Math.max(mergedProjects.length, 1);
    return [
      {
        label: 'AI systems',
        value: aiSystemProjects.length.toLocaleString(),
        detail: 'agentic, automation, release, and AI product cases',
        percent: Math.round((aiSystemProjects.length / denominator) * 100),
        tone: 'review'
      },
      {
        label: 'CV systems',
        value: computerVisionProjects.length.toLocaleString(),
        detail: 'OCR, detection, segmentation, retrieval, and model-serving cases',
        percent: Math.round((computerVisionProjects.length / denominator) * 100),
        tone: 'accent'
      },
      {
        label: 'Telegram',
        value: telegramProjectCount.toLocaleString(),
        detail: `${telegramReachSnapshot.loggingUsers} logging users / ${telegramReachSnapshot.eventActive} event-active in Calorio`,
        percent: Math.round((telegramProjectCount / denominator) * 100),
        tone: 'evidence'
      },
      {
        label: 'Measured',
        value: benchmarkedProjectCount.toLocaleString(),
        detail: 'projects with explicit benchmarks, analytics, or dated metrics',
        percent: Math.round((benchmarkedProjectCount / denominator) * 100),
        tone: 'muted'
      }
    ];
  }, [
    aiSystemProjects.length,
    benchmarkedProjectCount,
    computerVisionProjects.length,
    mergedProjects.length,
    telegramProjectCount,
    telegramReachSnapshot
  ]);

  const artifactSignalRows = useMemo(
    () => [
      {
        label: 'ClawHub downloads',
        value: clawHubSummary.totalDownloads.toLocaleString(),
        detail: `${CLAWHUB_DOWNLOAD_STATS.length} public skills`
      },
      {
        label: 'CWS reported users',
        value: CHROME_EXTENSION_STATS.totalUsers.toLocaleString(),
        detail: `${chromeStatsSummary.reportedRows} visible rows; not-reported rows excluded`
      },
      {
        label: 'Telegram users',
        value: telegramReachSnapshot.loggingUsers,
        detail: `${telegramReachSnapshot.eventActive} event-active, ${telegramProjectCount} Telegram projects`
      }
    ],
    [chromeStatsSummary.reportedRows, clawHubSummary.totalDownloads, telegramProjectCount, telegramReachSnapshot]
  );

  const aiSystemLanes = useMemo(
    () => [
      {
        label: 'Mapped AI cases',
        value: aiSystemProjects.length.toLocaleString(),
        detail: 'agentic workflows, MCP apps, launch tooling, visibility systems, and human-reviewed automations'
      },
      {
        label: 'Listing downloads',
        value: clawHubSummary.totalDownloads.toLocaleString(),
        detail: `ClawHub downloads across ${CLAWHUB_DOWNLOAD_STATS.length} tracked public skills as of ${clawHubSummary.checkedAt}`
      },
      {
        label: 'Reported CWS users',
        value: CHROME_EXTENSION_STATS.totalUsers.toLocaleString(),
        detail: `Chrome Web Store reported users across ${CHROME_EXTENSION_STATS.totalPublished} published extensions as of ${CHROME_EXTENSION_STATS.checkedAt}`
      },
      {
        label: 'Release posture',
        value: 'Gate-first',
        detail: 'benchmarks, public-surface review, browser evidence, rollback criteria'
      }
    ],
    [aiSystemProjects.length, clawHubSummary]
  );

  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const projectSlug = params.get('project');
    const latestSlug = params.get('latest');

    if (projectSlug) {
      const project = projectBySlug.get(projectSlug);
      setSelectedProject(project ?? null);
    } else {
      setSelectedProject(null);
    }

    if (latestSlug && latestBySlug.has(latestSlug)) {
      setActiveLatestSlug(latestSlug);
    } else {
      setActiveLatestSlug(null);
    }
  }, [projectBySlug, latestBySlug]);

  useEffect(() => {
    syncFromUrl();
  }, [syncFromUrl]);

  useEffect(() => {
    const handlePopState = () => {
      syncFromUrl();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncFromUrl]);

  useEffect(() => {
    if (!activeLatestSlug) return;
    const element = document.querySelector(`[data-latest-slug="${activeLatestSlug}"]`);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLatestSlug, mergedLatestUpdates]);

  useEffect(() => {
    if (!activeLatestSlug) return;
    setExpandedLatestSlugs((current) => {
      if (current.includes(activeLatestSlug)) return current;
      return [...current, activeLatestSlug];
    });
  }, [activeLatestSlug]);

  const markCopied = useCallback((key: string) => {
    setCopiedKey(key);
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 2000);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, key: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          markCopied(key);
          return;
        }
      } catch {
        // Fall through to the DOM fallback.
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (document.execCommand('copy')) {
          markCopied(key);
        }
      } catch {
        // Ignore failed fallback copy.
      }
      document.body.removeChild(textarea);
    },
    [markCopied]
  );

  const buildShareUrl = useCallback((params: { project?: string | null; latest?: string | null }) => {
    const url = new URL(window.location.href);
    applyShareParams(url, params);
    return url.toString();
  }, []);

  const updateUrlParams = useCallback(
    (params: { project?: string | null; latest?: string | null }, options: { replace?: boolean } = {}) => {
      const url = new URL(window.location.href);
      applyShareParams(url, params);
      if (options.replace) {
        window.history.replaceState(null, '', url.toString());
      } else {
        window.history.pushState(null, '', url.toString());
      }
    },
    []
  );

  const handleSelectProject = useCallback(
    (project: Project) => {
      const slug = getProjectCanonicalSlug(project);
      setSelectedProject(project);
      setActiveLatestSlug(null);
      updateUrlParams({ project: slug, latest: null });
    },
    [updateUrlParams]
  );

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
    updateUrlParams({ project: null }, { replace: true });
  }, [updateUrlParams]);

  const handleShareProject = useCallback(
    async (project: Project) => {
      const slug = getProjectCanonicalSlug(project);
      const shareUrl = buildShareUrl({ project: slug, latest: null });
      updateUrlParams({ project: slug, latest: null }, { replace: true });
      await copyToClipboard(shareUrl, `project:${slug}`);
    },
    [buildShareUrl, copyToClipboard, updateUrlParams]
  );

  const handleShareLatest = useCallback(
    async (slug: string) => {
      const shareUrl = buildShareUrl({ latest: slug, project: null });
      setActiveLatestSlug(slug);
      updateUrlParams({ latest: slug, project: null });
      await copyToClipboard(shareUrl, `latest:${slug}`);
    },
    [buildShareUrl, copyToClipboard, updateUrlParams]
  );

  const toggleLatestExpanded = useCallback((slug: string) => {
    setExpandedLatestSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
  }, []);

  const selectedProjectSlug = selectedProject ? getProjectCanonicalSlug(selectedProject) : null;
  const isProjectCopied = selectedProjectSlug ? copiedKey === `project:${selectedProjectSlug}` : false;
  const normalizedProjectQuery = deferredProjectQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const withFilters = mergedProjects.filter((project) => {
      const signals = getProjectSignals(project);
      if (benchmarkedOnly && !(project.benchmarks && project.benchmarks.length > 0)) return false;
      if (projectFilter === 'real-users' && !signals.isRealUsers) return false;
      if (projectFilter === 'telegram' && !signals.hasTelegram) return false;
      if (projectFilter === 'mobile' && !signals.isMobile) return false;
      if (projectFilter === 'automation' && !signals.isAutomation) return false;
      if (projectFilter === 'computer-vision' && !isComputerVisionDomainProject(project)) return false;
      if (projectFilter === 'ai-systems' && !isAiSystemDomainProject(project)) return false;
      if (projectFilter === 'open-source' && !signals.isOpenSource) return false;
      if (!normalizedProjectQuery) return true;
      return signals.searchText.includes(normalizedProjectQuery);
    });

    if (projectSort === 'alpha') {
      return [...withFilters].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (projectSort === 'recent') {
      return [...withFilters].sort((a, b) => b.id - a.id);
    }

    return [...withFilters].sort((a, b) => {
      const scoreDelta = getProjectSignals(b).proofScore - getProjectSignals(a).proofScore;
      if (scoreDelta !== 0) return scoreDelta;
      return b.id - a.id;
    });
  }, [benchmarkedOnly, mergedProjects, normalizedProjectQuery, projectFilter, projectSort]);

  const selectedProjectBadges = useMemo(
    () => (selectedProject ? getProjectSignals(selectedProject).badges : []),
    [selectedProject]
  );

  const activeProjectFilterLabel = useMemo(() => {
    return projectFilterOptions.find((filter) => filter.value === projectFilter)?.label || 'All projects';
  }, [projectFilter, projectFilterOptions]);
  const canToggleProjectArchive =
    !normalizedProjectQuery &&
    projectFilter === 'all' &&
    !benchmarkedOnly &&
    filteredProjects.length > PROJECT_ARCHIVE_INITIAL_LIMIT;
  const visibleProjects =
    canToggleProjectArchive && !showAllProjects
      ? filteredProjects.slice(0, PROJECT_ARCHIVE_INITIAL_LIMIT)
      : filteredProjects;

  return (
    <div className="site-shell">
      <div className="site-layout">
        <Sidebar
          projectCount={mergedProjects.length}
          userFacingCount={realUserProjectCount}
          benchmarkedCount={benchmarkedProjectCount}
        />

        <main className="content-column">
          <nav className="portfolio-command" aria-label="Primary portfolio navigation">
            <a href="#intro" className="portfolio-command__brand">
              ZP
            </a>
            <div className="portfolio-command__links">
              {COMMAND_NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
            <a href={`mailto:${SOCIAL_LINKS.email}`} className="portfolio-command__cta">
              Contact
            </a>
          </nav>

          <section id="intro" className="hero">
            <div className="hero__layout">
              <div className="hero__copy">
                <p className="hero__eyebrow">ML Engineer · Computer Vision · AI Products</p>
                <h1 className="hero__title">Zakhar Pashkin builds computer vision and AI products.</h1>
                <p className="hero__lead">
                  I turn OCR, segmentation, detection, multimodal retrieval, custom models, VLM/LLM workflows,
                  and agentic automation into tested APIs, apps, backend workflows, and launch gates.
                </p>
                <div className="hero-route-grid" aria-label="Portfolio exploration routes">
                  {HERO_WORK_ROUTES.map((route) => (
                    <a key={route.href} href={route.href} className="hero-route-card">
                      <strong>{route.label}</strong>
                      <span>{route.value}</span>
                      <em>{route.detail}</em>
                    </a>
                  ))}
                </div>
                <div className="hero__actions">
                  <a href="#featured" className="button button--primary">
                    Explore work
                  </a>
                  <a href={`mailto:${SOCIAL_LINKS.email}`} className="button button--ghost">
                    Start a project
                  </a>
                  <a href={SOCIAL_LINKS.resume} download="zakhar-pashkin-ai-product-engineer-resume.pdf" className="button button--ghost">
                    <DownloadIcon className="h-4 w-4" />
                    Download resume
                  </a>
                  <a
                    href={SOCIAL_LINKS.githubPrimary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--ghost"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              <aside className="artifact-console" aria-label="Portfolio evidence routing summary">
                <div className="artifact-console__header">
                  <span>Artifact map</span>
                  <strong>Dated public signals</strong>
                </div>
                <div className="artifact-console__rows">
                  {heroEvidenceRows.map((row) => (
                    <div key={row.label} className="artifact-console__row">
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                      <em>{row.detail}</em>
                    </div>
                  ))}
                </div>
                <div className="artifact-console__plots" aria-label="Artifact map evidence plots">
                  {artifactPlotRows.map((row) => (
                    <div
                      key={row.label}
                      className={`artifact-plot artifact-plot--${row.tone}`}
                      style={{ '--plot-value': `${row.percent}%` } as React.CSSProperties}
                    >
                      <div className="artifact-plot__label">
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                      </div>
                      <div className="artifact-plot__track" aria-hidden="true">
                        <span />
                      </div>
                      <em>{row.detail}</em>
                    </div>
                  ))}
                </div>
                <div className="artifact-console__signals" aria-label="Marketplace and Telegram signal summary">
                  {artifactSignalRows.map((row) => (
                    <div key={row.label} className="artifact-signal">
                      <strong>{row.value}</strong>
                      <span>{row.label}</span>
                      <em>{row.detail}</em>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </section>

          <Section
            id="about"
            eyebrow="Positioning"
            title="About Me"
            description="What clients get when they hire me and how I frame the work."
          >
            <div className="about-grid">
              <article className="panel">
                <p className="panel__eyebrow">Built for delivery</p>
                <h3>Built for delivery, not demos</h3>
                <p>
                  I work across AI automation, applied computer vision, mini apps, and full-stack AI
                  delivery. The common thread is not a single framework. It is getting from prototype to
                  production without hiding the hard parts.
                </p>
                <p>
                  That means human review points where they matter, measurable outputs, and systems that can
                  live beside legacy software instead of demanding a complete rewrite.
                </p>
              </article>

              <article className="panel panel--accent">
                <p className="panel__eyebrow">Signal over noise</p>
                <h3>What you can evaluate quickly</h3>
                <ul className="bullet-list">
                  {KEY_HIGHLIGHTS.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="pillar-grid">
              {DELIVERY_PILLARS.map((pillar) => (
                <article key={pillar.title} className="pillar-card">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section
            id="experience"
            eyebrow="Selected Teams"
            title="Collaborations"
            description="Some of the teams and brands I have built with."
          >
            <div className="logo-grid">
              {COMPANIES.map((company, index) => (
                <div
                  key={company.name}
                  tabIndex={0}
                  title={company.name}
                  aria-label={company.name}
                  className="logo-card"
                >
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="logo-card__image"
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="featured"
            eyebrow="Best Work"
            title="Featured Solutions"
            description="The strongest four case studies to start with if you want range, results, and product sense."
          >
            <div className="featured-grid">
              {featuredProjects.map((project, index) => {
                const context = FEATURED_PROJECT_CONTEXT[project.id];
                const metrics = project.benchmarks?.slice(0, 3) ?? [];
                const leadAsset = project.images[0];
                const proofItems =
                  metrics.length > 0
                    ? metrics.map((metric) =>
                        metric.context ? `${metric.label}: ${metric.value} (${metric.context})` : `${metric.label}: ${metric.value}`
                      )
                    : context?.proof ?? [];

                return (
                  <article
                    key={project.id}
                    className={`featured-card${index === 0 ? ' featured-card--spotlight' : ''}`}
                  >
                    <div className="featured-card__content">
                      <div className="featured-card__meta">
                        <span className="pill pill--accent">{context?.label || 'Featured project'}</span>
                        <span className="featured-card__id">Case study #{project.id}</span>
                      </div>
                      <h3>{project.title}</h3>
                      <p className="featured-card__summary">{context?.summary || project.longDescription || project.description}</p>
                      <ul className="bullet-list bullet-list--compact">
                        {project.keyFeatures.slice(0, 3).map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                      <div className="proof-grid">
                        {proofItems.slice(0, 3).map((item) => (
                          <div key={item} className="proof-chip">
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="button-row">
                        <button type="button" className="button button--primary" onClick={() => handleSelectProject(project)}>
                          Open case study
                        </button>
                        {project.links.slice(0, 2).map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button--ghost"
                          >
                            {link.text}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="featured-card__visual">
                      {leadAsset && !project.hideImages ? (
                        isVideoUrl(leadAsset.url) ? (
                          <video
                            src={leadAsset.url}
                            className="featured-card__asset"
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload={index === 0 ? 'auto' : 'metadata'}
                            poster={DEFAULT_PROJECT_IMAGE}
                          />
                        ) : (
                          <img
                            src={leadAsset.url}
                            alt={leadAsset.alt}
                            className="featured-card__asset"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            onError={(event) => {
                              if (event.currentTarget.src !== DEFAULT_PROJECT_IMAGE) {
                                event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                              }
                            }}
                          />
                        )
                      ) : (
                        <div className="featured-card__fallback">
                          <span>{context?.label || 'Featured'}</span>
                          <strong>{project.techStack.slice(0, 3).join(' · ')}</strong>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Section>

          <Section
            id="computer-vision"
            eyebrow="Computer Vision"
            title="Computer Vision Systems"
            description={`${computerVisionProjects.length} public-safe CV and deep learning case studies from OCR, cosmetic face analysis, nutrition OCR, segmentation, multimodal video search, and GitHub-backed research archives, with architecture-first evidence, sanitized metrics, and reviewable Mermaid diagrams.`}
          >
            <div className="domain-spotlight">
              <div className="domain-spotlight__media">
                <img
                  src={resolveAssetUrl('images/cv-ai-systems-map.png')}
                  alt="Conceptual computer vision systems map for OCR, face analysis, and video neural search"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="domain-lanes" aria-label="Computer vision evidence lanes">
                {COMPUTER_VISION_LANES.map((lane) => (
                  <article key={lane.label} className="domain-lane">
                    <span>{lane.label}</span>
                    <strong>{lane.value}</strong>
                    <p>{lane.detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="domain-project-panel" aria-label="Computer vision case study catalog" tabIndex={0}>
              <div className="domain-project-grid domain-project-grid--compact">
              {computerVisionProjects.map((project) => {
                const firstBenchmark = project.benchmarks?.[0];
                return (
                  <button
                    key={project.id}
                    type="button"
                    className="domain-project-card"
                    onClick={() => handleSelectProject(project)}
                    aria-label={`Open computer vision case study: ${project.title}`}
                  >
                    <span className="domain-project-card__meta">Case study #{project.id}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {firstBenchmark && (
                      <span className="domain-project-card__metric">
                        <strong>{firstBenchmark.label}</strong>
                        <em>{firstBenchmark.value}</em>
                      </span>
                    )}
                    <span className="project-card__open" aria-hidden="true">
                      Open case study
                      <span>-&gt;</span>
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={() => {
                  setProjectFilter('computer-vision');
                  setBenchmarkedOnly(false);
                  setProjectQuery('');
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Open CV archive filter
              </button>
            </div>
          </Section>

          <Section
            id="ai-systems"
            eyebrow="AI Systems"
            title="AI Product and Release Systems"
            description={`${aiSystemProjects.length} product-facing AI systems around extension launches, public listing trackers, reproducible experimentation, ChatGPT/MCP apps, automation, and install safety.`}
          >
            <div className="domain-lanes domain-lanes--summary" aria-label="AI systems summary">
              {aiSystemLanes.map((lane) => (
                <article key={lane.label} className="domain-lane">
                  <span>{lane.label}</span>
                  <strong>{lane.value}</strong>
                  <p>{lane.detail}</p>
                </article>
              ))}
            </div>

            <div className="domain-project-panel" aria-label="AI product and release system catalog" tabIndex={0}>
              <div className="domain-project-grid domain-project-grid--compact">
              {aiSystemProjects.map((project) => {
                const firstBenchmark = project.benchmarks?.[0];
                return (
                  <button
                    key={project.id}
                    type="button"
                    className="domain-project-card"
                    onClick={() => handleSelectProject(project)}
                    aria-label={`Open AI system case study: ${project.title}`}
                  >
                    <span className="domain-project-card__meta">Case study #{project.id}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {firstBenchmark && (
                      <span className="domain-project-card__metric">
                        <strong>{firstBenchmark.label}</strong>
                        <em>{firstBenchmark.value}</em>
                      </span>
                    )}
                    <span className="project-card__open" aria-hidden="true">
                      Open case study
                      <span>-&gt;</span>
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="button button--ghost button--small"
                onClick={() => {
                  setProjectFilter('ai-systems');
                  setBenchmarkedOnly(false);
                  setProjectQuery('');
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Open AI archive filter
              </button>
            </div>
          </Section>

          <Section
            id="clawhub"
            eyebrow="ClawHub"
            title="Downloads Tracker"
            description="Dated public ClawHub skill listing counters used as marketplace evidence, not user-count claims."
          >
            <div className="evidence-board evidence-board--clawhub" data-testid="clawhub-board">
              <div className="evidence-board__header">
                <div>
                  <p className="panel__eyebrow">Public listing snapshot</p>
                  <h3>Top skill listings by downloads</h3>
                  <p>
                    Exact package counters checked {clawHubSummary.checkedAt}. The long tail stays available without
                    forcing every reader through 49 full cards.
                  </p>
                </div>
                <a
                  href="https://clawhub.ai/zack-dev-cm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button--ghost button--small"
                >
                  Open ClawHub profile
                </a>
              </div>

              <div className="proof-grid proof-grid--compact" aria-label="ClawHub summary counters">
                <div className="proof-chip proof-chip--compact">
                  <strong>{clawHubSummary.totalDownloads.toLocaleString()}</strong>
                  <em>downloads across {CLAWHUB_DOWNLOAD_STATS.length} public skills</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{clawHubSummary.totalVersions}</strong>
                  <em>published versions in tracked listings</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{clawHubSummary.totalStars}</strong>
                  <em>stars shown separately from downloads</em>
                </div>
              </div>

              <ol className="compact-rank-list" aria-label="Top ClawHub skill downloads">
                {featuredClawHubStats.map((stat, index) => (
                  <li key={stat.slug} className="compact-rank-row">
                    <span className="compact-rank-row__rank">{String(index + 1).padStart(2, '0')}</span>
                    <span className="compact-rank-row__main">
                      <strong>{stat.displayName}</strong>
                      <em>
                        {stat.versions} versions / {stat.stars} stars / checked {stat.checkedAt}
                      </em>
                    </span>
                    <span className="compact-rank-row__metric">{stat.downloads.toLocaleString()}</span>
                    <a href={stat.url} target="_blank" rel="noopener noreferrer" className="compact-rank-row__link">
                      Open
                    </a>
                  </li>
                ))}
              </ol>

              {remainingClawHubStats.length > 0 && (
                <details className="compact-disclosure">
                  <summary>
                    <span>Remaining tracked skills</span>
                    <em>{remainingClawHubStats.length} more public listings</em>
                  </summary>
                  <ol className="compact-rank-list compact-rank-list--secondary" aria-label="Remaining ClawHub skill downloads">
                    {remainingClawHubStats.map((stat, index) => (
                      <li key={stat.slug} className="compact-rank-row">
                        <span className="compact-rank-row__rank">
                          {String(featuredClawHubStats.length + index + 1).padStart(2, '0')}
                        </span>
                        <span className="compact-rank-row__main">
                          <strong>{stat.displayName}</strong>
                          <em>
                            {stat.versions} versions / {stat.stars} stars / checked {stat.checkedAt}
                          </em>
                        </span>
                        <span className="compact-rank-row__metric">{stat.downloads.toLocaleString()}</span>
                        <a href={stat.url} target="_blank" rel="noopener noreferrer" className="compact-rank-row__link">
                          Open
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          </Section>

          <Section
            id="chrome-stats"
            eyebrow="Chrome Web Store"
            title="Extension Stats Tracker"
            description="Dated Chrome Web Store detail-page snapshot for the kaisenaiko publisher surface. Missing row values stay marked as not reported."
          >
            <div className="evidence-board evidence-board--cws" data-testid="cws-board">
              <div className="evidence-board__header">
                <div>
                  <p className="panel__eyebrow">Dated public snapshot</p>
                  <h3>Chrome Web Store publisher detail</h3>
                  <p>
                    Source: {CHROME_EXTENSION_STATS.sourceName}, checked {CHROME_EXTENSION_STATS.checkedAt}.
                    Rows without a visible Chrome Web Store user count stay marked as not reported, so each row shows the source of its user count.
                  </p>
                </div>
                <div className="button-row">
                  <a
                    href={CHROME_EXTENSION_STATS.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--ghost button--small"
                  >
                    Open CWS publisher
                  </a>
                  <a
                    href={resolveAssetUrl('chrome-extension-stats.json')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button--ghost button--small"
                  >
                    JSON snapshot
                  </a>
                </div>
              </div>

              <div className="proof-grid proof-grid--compact chrome-stats__summary" aria-label="Chrome extension publisher summary">
                <div className="proof-chip proof-chip--compact">
                  <strong>{CHROME_EXTENSION_STATS.totalPublished}</strong>
                  <em>published extensions</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{CHROME_EXTENSION_STATS.totalUsers.toLocaleString()}</strong>
                  <em>reported users as of {CHROME_EXTENSION_STATS.checkedAt}</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{chromeStatsSummary.averageRating}</strong>
                  <em>average rating / {CHROME_EXTENSION_STATS.ratingCount} ratings</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{chromeStatsSummary.rowsAddedIn2026}</strong>
                  <em>2026 listing rows</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{chromeStatsSummary.reportedRows}</strong>
                  <em>rows with explicit user counts</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{chromeStatsSummary.unreportedRows}</strong>
                  <em>rows without visible user count</em>
                </div>
                <div className="proof-chip proof-chip--compact">
                  <strong>{CHROME_EXTENSION_STATS.averageUsersPerExtension}</strong>
                  <em>average reported users per extension</em>
                </div>
              </div>

              <div className="extension-stat-list" aria-label="Chrome extension stats rows">
                {featuredChromeExtensionRows.map(renderChromeExtensionStatCard)}
              </div>

              {remainingChromeExtensionRows.length > 0 && (
                <details className="compact-disclosure compact-disclosure--extensions">
                  <summary>
                    <span>Remaining extension rows</span>
                    <em>{remainingChromeExtensionRows.length} more CWS detail rows</em>
                  </summary>
                  <div className="extension-stat-list extension-stat-list--secondary" aria-label="Remaining Chrome extension stats rows">
                    {remainingChromeExtensionRows.map(renderChromeExtensionStatCard)}
                  </div>
                </details>
              )}

              <ul className="tracker-notes">
                {CHROME_EXTENSION_STATS.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </Section>

          <Section
            id="latest"
            eyebrow="Recent"
            title="Latest Updates"
            description="Recent launches and additions, with deep links you can share."
          >
            <ul className="latest-list">
              {mergedLatestUpdates.map((update) => {
                const updateSlug = getLatestSlug(update);
                const isLatestCopied = copiedKey === `latest:${updateSlug}`;
                const isLatestActive = activeLatestSlug === updateSlug;
                const isExpanded = expandedLatestSlugs.includes(updateSlug);
                const detailProject =
                  (update.projectId ? projectById.get(update.projectId) : null) ||
                  (update.repoId ? projectById.get(update.repoId) : null) ||
                  (update.repoFullName ? projectByRepoFullName.get(update.repoFullName.toLowerCase()) : null) ||
                  null;
                const summary = update.description || detailProject?.description;

                return (
                  <li
                    key={updateSlug}
                    data-latest-slug={updateSlug}
                    className={`latest-card${isLatestActive ? ' is-active' : ''}`}
                  >
                    <div className="latest-card__header">
                      <div>
                        <p className="latest-card__title">{update.title}</p>
                        {summary && <p className="latest-card__summary">{summary}</p>}
                      </div>
                      <div className="latest-card__actions">
                        <button
                          type="button"
                          className="button button--ghost button--small"
                          onClick={() => void handleShareLatest(updateSlug)}
                          aria-label={`Copy link for ${update.title}`}
                        >
                          {isLatestCopied ? 'Copied' : 'Copy link'}
                        </button>
                        <button
                          type="button"
                          className="button button--ghost button--small"
                          onClick={() => toggleLatestExpanded(updateSlug)}
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                    </div>

                    {update.links.length > 0 && (
                      <div className="latest-card__links">
                        {update.links.map((link) => (
                          <a
                            href={link.url}
                            key={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            {link.text}
                          </a>
                        ))}
                      </div>
                    )}

                    {isExpanded && (
                      <div className="latest-card__detail">
                        {detailProject ? (
                          <>
                            <p>{detailProject.longDescription || detailProject.description}</p>
                            {detailProject.keyFeatures.length > 0 && (
                              <ul className="bullet-list bullet-list--compact">
                                {detailProject.keyFeatures.slice(0, 4).map((feature) => (
                                  <li key={feature}>{feature}</li>
                                ))}
                              </ul>
                            )}

                            {detailProject.techStack.length > 0 && (
                              <div className="chip-row">
                                {detailProject.techStack.slice(0, 8).map((tech) => (
                                  <span key={tech} className="pill">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {detailProject.images.length > 0 && !detailProject.hideImages && (
                              <div className="latest-card__media-grid">
                                {detailProject.images.slice(0, 2).map((image) => (
                                  <div key={image.url} className="media-tile">
                                    {isVideoUrl(image.url) ? (
                                      <video
                                        src={image.url}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="media-tile__asset"
                                      />
                                    ) : (
                                      <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="media-tile__asset"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(event) => {
                                          if (event.currentTarget.src !== DEFAULT_PROJECT_IMAGE) {
                                            event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                                          }
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="button-row">
                              {detailProject.links.map((link) => (
                                <a
                                  key={link.url}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="button button--ghost button--small"
                                >
                                  {link.text}
                                </a>
                              ))}
                              <button
                                type="button"
                                onClick={() => handleSelectProject(detailProject)}
                                className="button button--primary button--small"
                              >
                                View project
                              </button>
                            </div>
                          </>
                        ) : (
                          <p>
                            This update already has public links above; the curated case-study entry is not
                            merged into the archive yet.
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>

          <Section
            id="projects"
            eyebrow="Explorer"
            title="Projects"
            description="Search by project name, bot handle, alias, stack, or delivery surface. The User-facing filter is limited to curated user products and metric-backed launches, not every Telegram case study."
          >
            <div className="explorer-panel">
              <div className="explorer-panel__controls">
                <div className="explorer-panel__search">
                  <label htmlFor="project-search" className="sr-only">
                    Search projects
                  </label>
                  <input
                    id="project-search"
                    type="search"
                    value={projectQuery}
                    onChange={(event) => setProjectQuery(event.target.value)}
                    placeholder="Search by project, bot handle, alias, stack, workflow, or domain..."
                    className="search-input"
                  />
                </div>

                <div className="chip-row explorer-panel__sorts" role="group" aria-label="Project sorting">
                  <button
                    type="button"
                    onClick={() => setProjectSort('impact')}
                    className={`pill-button${projectSort === 'impact' ? ' is-active' : ''}`}
                    aria-pressed={projectSort === 'impact'}
                  >
                    Impact
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSort('recent')}
                    className={`pill-button${projectSort === 'recent' ? ' is-active' : ''}`}
                    aria-pressed={projectSort === 'recent'}
                  >
                    Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSort('alpha')}
                    className={`pill-button${projectSort === 'alpha' ? ' is-active' : ''}`}
                    aria-pressed={projectSort === 'alpha'}
                  >
                    A-Z
                  </button>
                </div>
              </div>

              <div className="explorer-panel__filters" role="toolbar" aria-label="Project filters">
                {projectFilterOptions.map((filter) => (
                  <button
                    type="button"
                    key={filter.value}
                    onClick={() => setProjectFilter(filter.value)}
                    className={`pill-button${projectFilter === filter.value ? ' is-active' : ''}`}
                    aria-pressed={projectFilter === filter.value}
                  >
                    <span>{filter.label}</span>
                    <span className="pill-button__count">{filter.count}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setBenchmarkedOnly((value) => !value)}
                  className={`pill-button${benchmarkedOnly ? ' is-active' : ''}`}
                  aria-pressed={benchmarkedOnly}
                >
                  <span>Metrics only</span>
                </button>
              </div>

              <p className="explorer-panel__summary">
                Showing <strong>{visibleProjects.length}</strong> of <strong>{filteredProjects.length}</strong>{' '}
                matching projects. Archive total: <strong>{mergedProjects.length}</strong>. Filter:{' '}
                <strong>{activeProjectFilterLabel}</strong>
                {benchmarkedOnly ? ' + Metrics only' : ''}.
              </p>
            </div>

            <div className="project-grid">
              {visibleProjects.map((project) => {
                const signals = getProjectSignals(project);
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    badges={signals.badges}
                    fallbackImageUrl={DEFAULT_PROJECT_IMAGE}
                    onSelectProject={() => handleSelectProject(project)}
                  />
                );
              })}
            </div>

            {canToggleProjectArchive && (
              <div className="project-archive-actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => setShowAllProjects((value) => !value)}
                >
                  {showAllProjects ? 'Show priority archive' : `Show all ${filteredProjects.length} projects`}
                </button>
              </div>
            )}

            {filteredProjects.length === 0 && (
              <p className="empty-state">No projects match the current filters.</p>
            )}
          </Section>

          <Section
            id="contact"
            eyebrow="Next step"
            title="Contact"
            description="Best fit: AI product engineering, production CV/VLM systems, and launch automation with review gates."
          >
            <div className="contact-grid">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="contact-card">
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <MailIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>Email</strong>
                  <span>{SOCIAL_LINKS.email}</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <TelegramIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>Telegram</strong>
                  <span>Fast contact channel</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <LinkedInIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>LinkedIn</strong>
                  <span>Professional profile</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <XSocialIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>X</strong>
                  <span>Public updates and short notes</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.githubPrimary}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <GitHubIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>GitHub</strong>
                  <span>Public repos and case studies</span>
                </div>
              </a>
              <a href={SOCIAL_LINKS.resume} download="zakhar-pashkin-ai-product-engineer-resume.pdf" className="contact-card">
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <DownloadIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>Resume</strong>
                  <span>ML / CV / AI Products PDF</span>
                </div>
              </a>
            </div>
          </Section>

          <footer className="site-footer">
            <p>&copy; {new Date().getFullYear()} Zakhar Pashkin. Built to be scanned fast and explored deeper.</p>
          </footer>
        </main>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          badges={selectedProjectBadges}
          fallbackImageUrl={DEFAULT_PROJECT_IMAGE}
          onClose={handleCloseProject}
          onCopyShare={() => handleShareProject(selectedProject)}
          isShareCopied={isProjectCopied}
        />
      )}

      <FloatingButtons telegramUrl={SOCIAL_LINKS.telegram} resumeUrl={SOCIAL_LINKS.resume} />
      {ENABLE_VERCEL_ANALYTICS && <Analytics />}
    </div>
  );
};

export default App;
