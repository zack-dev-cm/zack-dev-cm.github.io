import React, { useMemo, useState, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { FloatingButtons } from './components/FloatingButtons';
import { Section } from './components/Section';
import { GitHubIcon, LinkedInIcon, MailIcon } from './components/Icons';
import {
  PROJECTS,
  COMPANIES,
  LATEST_UPDATES,
  KEY_HIGHLIGHTS,
  AUTHOR_INFO,
  SOCIAL_LINKS,
  PORTFOLIO_UPDATE_REPO_EXCLUSIONS,
  LATEST_UPDATE_EXCLUDE_PATTERNS
} from './constants';
import { DEFAULT_PROJECT_IMAGE, resolveAssetUrl } from './utils/assets';
import type { Project, PortfolioUpdates, LatestUpdate } from './types';

const FEATURED_PROJECT_IDS = [45, 44, 43, 40] as const;
const FEATURED_PROJECT_INDEX = new Map(FEATURED_PROJECT_IDS.map((id, index) => [id, index]));

const FEATURED_PROJECT_CONTEXT: Record<number, { label: string; summary: string; proof: string[] }> = {
  45: {
    label: 'Open-source review harness',
    summary:
      'A public CLI that treats AI-written research as an artifact to lint, gate, and push through CI before it reaches a paper, proposal, or lab note.',
    proof: ['4 output formats', '6 issue families', 'No network dependency']
  },
  44: {
    label: 'Agentic operations',
    summary:
      'A strong business-side case study: AI qualification and follow-up automation layered onto a legacy clinic workflow without forcing a rewrite.',
    proof: ['Legacy DB preserved', 'Operator approvals built in', 'Lead routing stayed human-safe']
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
      'A public release that packages internal computer-vision experimentation discipline into an installable, reusable operational skill.',
    proof: ['Public ClawHub release', 'Promotion gates across three surfaces', 'Security review artifacts included']
  },
};

const DELIVERY_PILLARS = [
  {
    title: 'Agentic systems with operators in the loop',
    description:
      'I design automations that fit the real workflow: approvals, fallbacks, legacy constraints, and clear next actions for humans.'
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
  const techStack = project.techStack?.length ? project.techStack : ['Product'];
  const keyFeatures = project.keyFeatures?.length ? project.keyFeatures : ['Recently launched', 'Active development'];
  return { ...project, thumbnail, images, techStack, keyFeatures };
};

const STATIC_PROJECTS = PROJECTS.map(normalizeProject);
type ProjectSortMode = 'impact' | 'recent' | 'alpha';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [portfolioUpdates, setPortfolioUpdates] = useState<PortfolioUpdates | null>(null);
  const [activeLatestSlug, setActiveLatestSlug] = useState<string | null>(null);
  const [expandedLatestSlugs, setExpandedLatestSlugs] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [projectQuery, setProjectQuery] = useState('');
  const [projectSort, setProjectSort] = useState<ProjectSortMode>('impact');
  const [benchmarkedOnly, setBenchmarkedOnly] = useState(false);
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
    return sortByCreatedAtDesc(latestUpdates.filter((update) => !isExcludedLatestUpdate(update)));
  }, [portfolioUpdates]);

  const updateProjects = useMemo(
    () =>
      sortByCreatedAtDesc(
        (portfolioUpdates?.projects ?? [])
          .filter((project) => !isExcludedRepo(project.repoFullName))
          .map(normalizeProject)
      ),
    [portfolioUpdates]
  );

  const mergedLatestUpdates = useMemo(() => {
    return dedupeByKey([...updateLatest, ...LATEST_UPDATES], (update) => {
      return update.repoFullName || (update.repoId ? `${update.repoId}` : '') || getRepoKeyFromLinks(update.links) || update.title;
    });
  }, [updateLatest]);

  const mergedProjects = useMemo(() => {
    return dedupeByKey([...updateProjects, ...STATIC_PROJECTS], (project) => {
      return project.repoFullName || (project.repoId ? `${project.repoId}` : '') || getRepoKeyFromLinks(project.links) || project.title;
    });
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
    return new Map(mergedProjects.map((project) => [getProjectSlug(project), project]));
  }, [mergedProjects]);

  const latestBySlug = useMemo(() => {
    return new Map(mergedLatestUpdates.map((update) => [getLatestSlug(update), update]));
  }, [mergedLatestUpdates]);

  const benchmarkedProjectCount = useMemo(() => {
    return mergedProjects.filter((project) => project.benchmarks && project.benchmarks.length > 0).length;
  }, [mergedProjects]);

  const featuredProjects = useMemo(() => {
    return FEATURED_PROJECT_IDS.map((id) => projectById.get(id)).filter((project): project is Project => Boolean(project));
  }, [projectById]);

  const heroStats = useMemo(
    () => [
      { value: `${mergedProjects.length}`, label: 'public case studies' },
      { value: '7+', label: 'years shipping CV / ML systems' },
      { value: `${COMPANIES.length}`, label: 'recognized collaborators' },
      { value: `${benchmarkedProjectCount}`, label: 'projects with explicit proof points' }
    ],
    [benchmarkedProjectCount, mergedProjects.length]
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
      const slug = getProjectSlug(project);
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
      const slug = getProjectSlug(project);
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

  const selectedProjectSlug = selectedProject ? getProjectSlug(selectedProject) : null;
  const isProjectCopied = selectedProjectSlug ? copiedKey === `project:${selectedProjectSlug}` : false;
  const normalizedProjectQuery = deferredProjectQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const withFilters = mergedProjects.filter((project) => {
      if (benchmarkedOnly && !(project.benchmarks && project.benchmarks.length > 0)) return false;
      if (!normalizedProjectQuery) return true;
      const haystack = [
        project.title,
        project.description,
        project.longDescription || '',
        project.techStack.join(' '),
        project.keyFeatures.join(' ')
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedProjectQuery);
    });

    if (projectSort === 'alpha') {
      return [...withFilters].sort((a, b) => a.title.localeCompare(b.title));
    }

    if (projectSort === 'recent') {
      return [...withFilters].sort((a, b) => b.id - a.id);
    }

    return [...withFilters].sort((a, b) => {
      const aFeatured = FEATURED_PROJECT_INDEX.get(a.id);
      const bFeatured = FEATURED_PROJECT_INDEX.get(b.id);
      if (aFeatured !== undefined || bFeatured !== undefined) {
        if (aFeatured === undefined) return 1;
        if (bFeatured === undefined) return -1;
        return aFeatured - bFeatured;
      }

      const aBenchmarks = a.benchmarks?.length ?? 0;
      const bBenchmarks = b.benchmarks?.length ?? 0;
      if (bBenchmarks !== aBenchmarks) return bBenchmarks - aBenchmarks;

      const aLinks = a.links.length;
      const bLinks = b.links.length;
      if (bLinks !== aLinks) return bLinks - aLinks;

      return b.id - a.id;
    });
  }, [benchmarkedOnly, mergedProjects, normalizedProjectQuery, projectSort]);

  return (
    <div className="site-shell">
      <div className="site-layout">
        <Sidebar
          projectCount={mergedProjects.length}
          benchmarkedCount={benchmarkedProjectCount}
          latestCount={mergedLatestUpdates.length}
        />

        <main className="content-column">
          <section id="intro" className="hero">
            <p className="hero__eyebrow">AI product engineer</p>
            <h1 className="hero__title">AI products that survive production constraints.</h1>
            <p className="hero__lead">
              {AUTHOR_INFO.bio} I turn messy problem statements into operator-safe automations, computer
              vision services, and product surfaces that are actually ready to launch.
            </p>
            <div className="hero__actions">
              <a href="#featured" className="button button--primary">
                View featured solutions
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="button button--ghost">
                Start a project
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
            <div className="hero__stats" aria-label="Portfolio summary statistics">
              {heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
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
                <h3>More operating model than portfolio theater</h3>
                <p>
                  I work across agentic automation, applied computer vision, mini apps, and full-stack AI
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
                <h3>Why this portfolio is now curated around proof</h3>
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
            eyebrow="Proof"
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
            description="The strongest four case studies to start with if you want range, proof, and product sense."
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
                          <p>More details coming soon.</p>
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
            eyebrow="Archive"
            title="Projects"
            description="Search the full archive. In Impact mode, featured work is pinned to the top."
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
                    placeholder="Search by project, tech stack, workflow, or domain..."
                    className="search-input"
                  />
                </div>

                <div className="chip-row">
                  <button
                    type="button"
                    onClick={() => setProjectSort('impact')}
                    className={`pill-button${projectSort === 'impact' ? ' is-active' : ''}`}
                  >
                    Impact
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSort('recent')}
                    className={`pill-button${projectSort === 'recent' ? ' is-active' : ''}`}
                  >
                    Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectSort('alpha')}
                    className={`pill-button${projectSort === 'alpha' ? ' is-active' : ''}`}
                  >
                    A-Z
                  </button>
                  <button
                    type="button"
                    onClick={() => setBenchmarkedOnly((value) => !value)}
                    className={`pill-button${benchmarkedOnly ? ' is-active' : ''}`}
                  >
                    Metrics only
                  </button>
                </div>
              </div>

              <p className="explorer-panel__summary">
                Showing {filteredProjects.length} of {mergedProjects.length} projects
              </p>
            </div>

            <div className="project-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  fallbackImageUrl={DEFAULT_PROJECT_IMAGE}
                  onSelectProject={() => handleSelectProject(project)}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <p className="empty-state">No projects match the current filters.</p>
            )}
          </Section>

          <Section
            id="contact"
            eyebrow="Contact"
            title="Let's Connect"
            description="If you need an AI product engineer who can translate ambition into shipped systems, reach out."
          >
            <div className="contact-grid">
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="contact-card">
                <MailIcon className="contact-card__icon" />
                <div>
                  <strong>Email</strong>
                  <span>{SOCIAL_LINKS.email}</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <LinkedInIcon className="contact-card__icon" />
                <div>
                  <strong>LinkedIn</strong>
                  <span>Professional profile</span>
                </div>
              </a>
              <a
                href={SOCIAL_LINKS.githubPrimary}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <GitHubIcon className="contact-card__icon" />
                <div>
                  <strong>GitHub</strong>
                  <span>Public repos and case studies</span>
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
          fallbackImageUrl={DEFAULT_PROJECT_IMAGE}
          onClose={handleCloseProject}
          onCopyShare={() => handleShareProject(selectedProject)}
          isShareCopied={isProjectCopied}
        />
      )}

      <FloatingButtons telegramUrl={SOCIAL_LINKS.telegram} />
    </div>
  );
};

export default App;
