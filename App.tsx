
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
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
  TECH_STACK,
  KEY_HIGHLIGHTS,
  AUTHOR_INFO,
  SOCIAL_LINKS,
  PORTFOLIO_UPDATE_REPO_EXCLUSIONS,
  LATEST_UPDATE_EXCLUDE_PATTERNS
} from './constants';
import { DEFAULT_PROJECT_IMAGE, resolveAssetUrl } from './utils/assets';
import type { Project, PortfolioUpdates, LatestUpdate } from './types';

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
  const thumbnail = resolveAssetUrl(project.thumbnail || DEFAULT_PROJECT_IMAGE);
  const rawImages = project.images ?? [];
  const images = rawImages
    .map((image) => ({ ...image, url: resolveAssetUrl(image.url) }))
    .filter((image) => Boolean(image.url));
  if (images.length === 0) {
    images.push({ url: thumbnail, alt: `${project.title} preview` });
  }
  const techStack = project.techStack?.length ? project.techStack : ['Product'];
  const keyFeatures = project.keyFeatures?.length ? project.keyFeatures : ['Recently launched', 'Active development'];
  return { ...project, thumbnail, images, techStack, keyFeatures };
};

const STATIC_PROJECTS = PROJECTS.map(normalizeProject);

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [portfolioUpdates, setPortfolioUpdates] = useState<PortfolioUpdates | null>(null);
  const [activeLatestSlug, setActiveLatestSlug] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
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

  const projectBySlug = useMemo(() => {
    return new Map(mergedProjects.map((project) => [getProjectSlug(project), project]));
  }, [mergedProjects]);

  const latestBySlug = useMemo(() => {
    return new Map(mergedLatestUpdates.map((update) => [getLatestSlug(update), update]));
  }, [mergedLatestUpdates]);

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
        // ignore failed fallback copy
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

  const selectedProjectSlug = selectedProject ? getProjectSlug(selectedProject) : null;
  const isProjectCopied = selectedProjectSlug ? copiedKey === `project:${selectedProjectSlug}` : false;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans leading-relaxed">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="lg:pl-80 xl:pl-96 w-full min-w-0">
          <div className="p-6 sm:p-10 md:p-12 lg:p-16">
            
            <Section id="about" title="About Me">
              <p className="mb-6 text-slate-400">
                {AUTHOR_INFO.bio}
              </p>
              <div className="space-y-4 text-slate-400">
                  {KEY_HIGHLIGHTS.map((highlight, index) => (
                      <p key={index} className="flex items-start">
                           <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          <span>{highlight}</span>
                      </p>
                  ))}
              </div>
            </Section>

            <Section id="experience" title="Collaborations">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center">
                {COMPANIES.map((company) => (
                  <div
                    key={company.name}
                    tabIndex={0}
                    title={company.name}
                    aria-label={company.name}
                    className="p-4 bg-white rounded-lg flex justify-center items-center h-24 border border-slate-200 shadow transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <img
                      src={company.logoUrl}
                      alt={`${company.name} Logo`}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section id="stack" title="Tech Stack">
                <div className="flex flex-wrap gap-3">
                    {TECH_STACK.map((tech, index) => (
                        <span key={index} className="bg-teal-400/10 text-teal-300 text-sm font-medium px-3 py-1.5 rounded-full">{tech}</span>
                    ))}
                </div>
            </Section>
            
            <Section id="latest" title="Latest Updates">
               <ul className="space-y-4 text-slate-400">
                {mergedLatestUpdates.map((update) => {
                  const updateSlug = getLatestSlug(update);
                  const isLatestCopied = copiedKey === `latest:${updateSlug}`;
                  const isLatestActive = activeLatestSlug === updateSlug;
                  return (
                    <li
                      key={updateSlug}
                      data-latest-slug={updateSlug}
                      className={`flex items-start rounded-lg p-3 scroll-mt-24 transition ${
                        isLatestActive ? 'bg-teal-400/10 ring-1 ring-teal-400/40' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-teal-400 mr-3 text-xl">&#8627;</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-semibold text-slate-200">{update.title}</h4>
                          <button
                            type="button"
                            onClick={() => {
                              void handleShareLatest(updateSlug);
                            }}
                            className="whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-400 transition hover:border-teal-400/70 hover:text-teal-200"
                            aria-label={`Copy link for ${update.title}`}
                          >
                            {isLatestCopied ? 'Copied' : 'Copy link'}
                          </button>
                        </div>
                        {update.description && <p className="text-sm">{update.description}</p>}
                        {update.links.length > 0 && (
                          <div className="mt-1">
                            {update.links.map((link) => (
                              <a
                                href={link.url}
                                key={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-400 hover:text-teal-300 text-sm mr-4 transition-colors duration-300"
                              >
                                {link.text} &rarr;
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
               </ul>
            </Section>

            <Section id="projects" title="Projects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mergedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    fallbackImageUrl={DEFAULT_PROJECT_IMAGE}
                    onSelectProject={() => handleSelectProject(project)}
                  />
                ))}
              </div>
            </Section>

            <Section id="contact" title="Let's Connect">
               <p className="mb-6 text-slate-400">
                I'm always excited to discuss new challenges and opportunities. Feel free to reach out.
              </p>
              <div className="flex items-center space-x-6">
                 <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <LinkedInIcon className="w-6 h-6" />
                    <span>LinkedIn</span>
                 </a>
                 <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <MailIcon className="w-6 h-6" />
                    <span>Email</span>
                 </a>
                 <a href={SOCIAL_LINKS.githubPrimary} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-400 transition-colors duration-300 flex items-center space-x-2">
                    <GitHubIcon className="w-6 h-6" />
                    <span>GitHub</span>
                 </a>
              </div>
            </Section>

             <footer className="text-center mt-16 text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Zakhar Pashkin. All rights reserved.</p>
            </footer>

          </div>
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
