import React, { useMemo, useState, useEffect, useRef, useCallback, useDeferredValue } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Sidebar } from './components/Sidebar';
import { ArchiveProjectCard as ProjectCard } from './components/ArchiveProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { Section } from './components/Section';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, TelegramIcon, XSocialIcon } from './components/Icons';
import {
  PROJECTS,
  OPEN_SOURCE_CONTRIBUTIONS,
  LATEST_UPDATES,
  SOCIAL_LINKS,
  PORTFOLIO_UPDATE_REPO_EXCLUSIONS,
  LATEST_UPDATE_EXCLUDE_PATTERNS,
  CLAWHUB_DOWNLOAD_STATS,
  CHROME_EXTENSION_STATS
} from './constants';
import { DEFAULT_PROJECT_IMAGE, resolveAssetUrl } from './utils/assets';
import { slugify, getProjectCanonicalSlug, getProjectRouteSlugs, selectReviewedFeedProjects, mergeProjects } from './utils/project-catalog.mjs';
import type { ChromeExtensionStat, Project, PortfolioUpdates, LatestUpdate } from './types';

const FEATURED_PROJECT_IDS = [101, 63, 81, 11, 102, 72] as const;
const FEATURED_PROJECT_INDEX: Map<number, number> = new Map(FEATURED_PROJECT_IDS.map((id, index) => [id, index]));
const ENABLE_VERCEL_ANALYTICS = import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === 'true';

const FEATURED_PROJECT_CONTEXT: Record<number, {
  label: string; title: string; summary: string; artifact?: { heading: string; lines: string[]; footer: string };
}> = {
  101: {
    label: 'Current R&D · Riverstart',
    title: 'Document AI for expert workflows',
    summary: 'R&D for source-linked specialist review: document extraction, deterministic checks and retrieval experiments.',
  },
  63: {
    label: 'Mobile computer vision',
    title: 'Dermaself · Skin analysis',
    summary: 'A guided capture-to-analysis mobile workflow, connecting vision models, API integration, and model evaluation.',
  },
  81: {
    label: 'Python package · PyPI',
    title: 'Agnitra · Model profiling & optimization',
    summary: 'A Python SDK and CLI for model profiling, with a separate decoder-LLM optimization path. Inspect a recorded run from the PyPI release.',
  },
  11: {
    label: 'Maintained AI service',
    title: 'Calorio · AI nutrition assistant',
    summary: 'An actively maintained Telegram service that helps people record meals and work toward nutrition goals using photos, voice, and text.',
  },
  102: {
    label: 'Engineering R&D',
    title: 'Point clouds, CAD & 2D drawings',
    summary: 'Point-cloud room reconstruction and floor-plan export, plus separate research in mechanical scan alignment and CAD projection. Inspect the geometry and outputs.',
  },
  72: {
    label: 'Retrieval R&D',
    title: 'Multimodal video search',
    summary: 'Video retrieval combining speech, on-screen text, and visual embeddings to find relevant clips across complementary signals.',
    artifact: { heading: 'Search beyond a transcript', lines: ['Video and keyframes', 'Speech, text, and visual embeddings', 'Ranked clips'], footer: 'ASR / OCR / Embeddings / Hybrid search' }
  },
};

const CAREER = [
  { company: 'Riverstart', role: 'Senior ML Engineer · R&D ML', period: 'Jul 2026 — Present', description: 'Document AI with source-linked specialist review, plus evaluation workflows for CAD and construction-document analysis.', current: true },
  { company: 'Dermaself · Agnitra · Video Search', role: 'ML / Computer Vision Engineer', period: 'Jun 2024 — Jun 2026', description: 'Developed skin segmentation and mobile/API integration, built a published model-profiling SDK, and delivered multimodal video retrieval with Qdrant.' },
  { company: 'Wombat Apps / Carb Manager', role: 'Senior Computer Vision Engineer', period: 'Jun 2022 — Jun 2024', description: 'Shipped food recognition and nutrition-label workflows across cloud, iOS and Android, combining detection, OCR and table parsing into structured nutrition data.' },
  { company: 'Center of Financial Technologies', role: 'Computer Vision Engineer', period: 'Jun 2019 — Jun 2022', description: 'Built financial-document recognition models and assisted-annotation workflows, optimized mobile meter recognition, and mentored engineers on data quality and evaluation.' },
];

const COMPUTER_VISION_PRIORITY_IDS = [70, 72, 71, 76, 77, 73, 74, 63, 80, 41, 10, 11, 1, 5, 6, 8, 9, 12, 13, 14, 25, 67, 43, 35] as const;
const AI_SYSTEM_PRIORITY_IDS = [66, 44, 78, 79, 81, 72, 70, 77, 76, 71, 74, 80, 40, 65, 67, 28, 26, 1, 2, 5, 35, 56, 53, 45, 75, 69, 68, 64, 62, 60, 61, 57, 58, 46, 47, 48, 49, 51, 52, 31, 30, 39, 38, 36, 29, 23, 24, 27, 3, 11, 43] as const;
const PROJECT_ARCHIVE_INITIAL_LIMIT = 9;
const CODE_CONTRIBUTIONS = OPEN_SOURCE_CONTRIBUTIONS
  .filter((item) => item.evidenceLabel === 'Merged PR' || item.evidenceLabel === 'Open PR')
  .sort((a, b) => Number(b.evidenceLabel === 'Merged PR') - Number(a.evidenceLabel === 'Merged PR'));
const ISSUE_PARTICIPATION = OPEN_SOURCE_CONTRIBUTIONS
  .filter((item) => item.evidenceLabel !== 'Merged PR' && item.evidenceLabel !== 'Open PR');

const renderContribution = (item: (typeof OPEN_SOURCE_CONTRIBUTIONS)[number]) => (
  <li key={item.sourceUrl}>
    <a className="contribution-card" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
      <div className="contribution-card__heading">
        <span className="contribution-card__repo">{item.repo}</span>
        <span className={`contribution-card__status${item.evidenceLabel === 'Merged PR' ? ' is-merged' : ''}`}>{item.evidenceLabel}</span>
      </div>
      <p className="contribution-card__description">{item.contribution}</p>
      <span className="contribution-card__action">View {item.evidenceLabel.toLowerCase().replace(/\bpr\b/g, 'PR')} <span aria-hidden="true">↗</span></span>
    </a>
  </li>
);

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

const formatCompactNumber = (value: number) => {
  return value.toLocaleString();
};

const renderChromeExtensionStatCard = (extension: ChromeExtensionStat) => {
  const hasRating =
    typeof extension.rating === 'number' && typeof extension.ratingCount === 'number' && extension.ratingCount > 0;
  const hasPermissions = Array.isArray(extension.permissions) && extension.permissions.length > 0;

  return (
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
        {hasRating && (
          <span>
            <strong>Rating</strong>
            {extension.rating!.toFixed(2)} ({extension.ratingCount})
          </span>
        )}
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
        {hasPermissions && (
          <span>
            <strong>Permissions</strong>
            {extension.permissions!.join(', ')}
          </span>
        )}
      </div>
      <div className="latest-card__links extension-stat-card__links">
        <a href={extension.chromeWebStoreUrl} target="_blank" rel="noopener noreferrer" className="text-link">
          Chrome Web Store
        </a>
        {extension.chromeStatsUrl && (
          <a href={extension.chromeStatsUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Chrome-Stats detail
          </a>
        )}
        {extension.productUrl && (
          <a href={extension.productUrl} target="_blank" rel="noopener noreferrer" className="text-link">
            Product page
          </a>
        )}
      </div>
    </article>
  );
};

const getLatestKey = (update: LatestUpdate) => {
  return update.repoFullName || (update.repoId ? `${update.repoId}` : '') || getRepoKeyFromLinks(update.links) || update.title;
};

const getLatestSlug = (update: LatestUpdate) => {
  return slugify(getLatestKey(update) || update.title || 'latest');
};

const buildProjectPublicUrl = (slug: string) => {
  return new URL(`/projects/${slug}/`, window.location.origin).toString();
};

const getProjectSlugFromPath = (pathname: string) => {
  const match = pathname.match(/^\/(?:docs\/)?projects\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]).toLowerCase() : null;
};

const isProjectPath = (pathname: string) => Boolean(getProjectSlugFromPath(pathname));

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

const SEARCH_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'app',
  'apps',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with',
]);

const SMART_SEARCH_SYNONYM_GROUPS = [
  ['architecture', 'architectural', 'blueprint', 'floorplan', 'floorplans', 'floor', 'plan', 'plans', 'room', 'rooms', 'interior', 'catalog', 'furniture', 'building', 'casework', 'reception', 'elevation'],
  ['segment', 'segmentation', 'segmented', 'mask', 'masks', 'sam', 'segment anything', 'yolo', 'wrinkle', 'texture', 'skin', 'roi', 'pore', 'pores'],
  ['ocr', 'text', 'recognition', 'line', 'word', 'crnn', 'onnx', 'document', 'meter', 'digits', 'handwriting', 'api', 'serving'],
  ['jaw', 'jawline', 'face', 'facial', 'face-type', 'morphology', 'beauty', 'aesthetic', 'plastic', 'surgery', 'classifier', 'classification', 'landmarks'],
  ['multimodal', 'multi-modal', 'retrieval', 'search', 'video', 'embedding', 'embeddings', 'clip', 'keyframe', 'transcript', 'asr', 'hybrid'],
  ['inquest', 'inqi', 'binder', 'rag', 'vector', 'storage', 'project', 'reference', 'site', 'plan', 'elevation', 'qa'],
  ['comfy', 'comfyui', 'colab', 'notebook', 'notebooks', 'prototype', 'custom', 'model', 'models', 'workflow', 'workflows', 'liveportrait', 'moviepy', 'ffmpeg'],
  ['mcp', 'chatgpt', 'tool', 'tools', 'widget', 'widgets', 'app', 'apps', 'agent', 'agents', 'tool-calling', 'conservation'],
  ['clearml', 'clear ml', 'mlops', 'experiment', 'experiments', 'tracking', 'metrics', 'promotion', 'dermaself'],
  ['agnitra', 'inference', 'optimizer', 'decoder', 'decoder-only', 'llm', 'quantization', 'huggingface', 'torchao', 'manifest'],
  ['vlm', 'vlms', 'llm', 'llms', 'agent', 'agents', 'automation', 'review', 'gate', 'gates', 'human', 'workflow', 'workflows'],
  ['chrome', 'extension', 'extensions', 'browser', 'built-in', 'built in', 'summaries', 'summarizer', 'local', 'sourcepack', 'cws'],
  ['telegram', 'tg', 'tma', 'miniapp', 'mini-app', 'bot', 'bots', 'webapp', 'web-app'],
  ['calorio', 'kalorio', 'nutrition', 'calorie', 'calories', 'meal', 'food', 'diet', 'macro', 'macros'],
  ['seo', 'search engine optimization', 'geo', 'generative engine optimization', 'aeo', 'answer engine optimization', 'ai visibility', 'llms.txt', 'schema jsonld', 'json-ld', 'structured data', 'crawlable', 'agent discovery'],
  ['cv', 'computer vision', 'vision', 'opencv', 'pytorch', 'deep learning', 'model', 'models', 'inference'],
  ['moltbook', 'content', 'factory', 'generative', 'suno', 'midjourney', 'video', 'shorts', 'liveportrait'],
] as const;

const SEARCH_INTENT_BOOSTS: Array<{ projectIds: readonly number[]; phrases: readonly string[]; weight?: number }> = [
  {
    projectIds: [77, 74, 73],
    phrases: ['architecture', 'architectural', 'floor plan', 'floorplan', 'blueprint', 'room plan', 'catalog matching', 'casework', 'reception', 'whole building', 'elevation'],
  },
  {
    projectIds: [71, 41, 63],
    phrases: ['segment anything', 'segmentation', 'skin texture', 'wrinkle', 'wrinkles', 'pores', 'face texture', 'cosmetic analysis'],
  },
  {
    projectIds: [70, 73, 74],
    phrases: ['agentic ocr', 'ocr api', 'onnx ocr', 'fast ocr', 'line segmentation', 'word recognition', 'document recognition'],
  },
  {
    projectIds: [76, 71, 63],
    phrases: ['jaw', 'jawline', 'face type', 'face-type', 'plastic surgery', 'beauty examination', 'aesthetic review', 'facial landmarks'],
  },
  {
    projectIds: [72, 74, 73],
    phrases: ['multimodal retrieval', 'video search', 'video transcript', 'transcript embeddings', 'keyframe', 'asr', 'hybrid search'],
  },
  {
    projectIds: [78, 66, 40],
    phrases: ['inquest', 'inqi', 'binder', 'project binder', 'rag qa', 'vector storage', 'site plan', 'reference binder'],
  },
  {
    projectIds: [79, 74],
    phrases: ['comfyui', 'comfy', 'colab', 'custom model', 'custom models', 'notebook prototype', 'liveportrait', 'moviepy'],
  },
  {
    projectIds: [66, 67, 78],
    phrases: ['mcp', 'chatgpt app', 'tool calling', 'senior conservator', 'conservation agent', 'widget'],
  },
  {
    projectIds: [80, 63],
    phrases: ['clearml', 'clear ml', 'mlops', 'experiment tracking', 'model metrics', 'promotion gate', 'dermaself tracking'],
  },
  {
    projectIds: [81],
    phrases: ['agnitra', 'agnitra ai', 'llm inference optimizer', 'decoder only llm', 'decoder-only llm', 'huggingface optimizer', 'quantization sdk', 'signed inference manifest'],
  },
  {
    projectIds: [56, 68, 15, 16, 59, 55],
    phrases: ['chrome ai', 'built in ai', 'built-in ai', 'chrome extension', 'browser extension', 'sourcepack', 'local summaries'],
  },
  {
    projectIds: [40, 31],
    phrases: ['ai visibility', 'geo', 'seo geo', 'seo/geo', 'aeo', 'answer engine', 'llms.txt', 'schema jsonld', 'memorizer', 'crawlable'],
    weight: 260,
  },
  {
    projectIds: [11],
    phrases: ['calorio', 'kalorio', 'nutrition bot', 'telegram calorie tracker', 'calorie tracker', 'meal logging', 'food diary', 'nutrition goals'],
    weight: 420,
  },
  {
    projectIds: [40, 39, 38, 32, 31, 36, 35, 34, 33],
    phrases: ['telegram', 'tg', 'tma', 'mini app', 'miniapp', 'bot', 'telegram app'],
  },
];

const normalizeSearchValue = (value: string) => {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[/_]+/g, ' ')
    .replace(/[^a-z0-9+#.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeSearchTerm = (value: string) => {
  let term = normalizeSearchValue(value).replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  if (term.length > 5 && term.endsWith('ies')) term = `${term.slice(0, -3)}y`;
  else if (term.length > 5 && term.endsWith('ing')) term = term.slice(0, -3);
  else if (term.length > 4 && term.endsWith('es')) term = term.slice(0, -2);
  else if (term.length > 3 && term.endsWith('s')) term = term.slice(0, -1);
  return term;
};

const extractSearchTerms = (value: string) => {
  const normalized = normalizeSearchValue(value);
  const rawTerms = normalized.match(/[a-z0-9+#.-]+/g) ?? [];
  return dedupeStrings(
    rawTerms
      .map(normalizeSearchTerm)
      .filter((term) => term.length > 1 && !SEARCH_STOP_WORDS.has(term))
  );
};

const buildSemanticQueryTerms = (query: string) => {
  const normalized = normalizeSearchValue(query);
  const baseTerms = new Set(extractSearchTerms(query));
  const terms = new Set(baseTerms);

  for (const group of SMART_SEARCH_SYNONYM_GROUPS) {
    const isGroupMatch = group.some((entry) => {
      const normalizedEntry = normalizeSearchValue(entry);
      const entryTerms = extractSearchTerms(entry);
      if (!normalizedEntry || entryTerms.length === 0) return false;
      const termMatch =
        entryTerms.length === 1
          ? baseTerms.has(entryTerms[0])
          : entryTerms.every((term) => baseTerms.has(term));
      return normalized.includes(normalizedEntry) || termMatch;
    });
    if (!isGroupMatch) continue;
    group.forEach((entry) => {
      extractSearchTerms(entry).forEach((term) => terms.add(term));
    });
  }

  return {
    normalized,
    terms: [...terms],
  };
};

const getSearchIntentBoost = (project: Project, normalizedQuery: string, queryTerms: readonly string[]) => {
  if (!normalizedQuery) return 0;
  const queryTermSet = new Set(queryTerms);
  let boost = 0;

  SEARCH_INTENT_BOOSTS.forEach((intent) => {
    const projectIndex = intent.projectIds.indexOf(project.id);
    if (projectIndex === -1) return;

    const phraseMatch = intent.phrases.some((phrase) => {
      const normalizedPhrase = normalizeSearchValue(phrase);
      if (!normalizedPhrase) return false;
      if (normalizedQuery.includes(normalizedPhrase)) return true;
      const phraseTerms = extractSearchTerms(phrase);
      return phraseTerms.length > 0 && phraseTerms.every((term) => queryTermSet.has(term));
    });

    if (!phraseMatch) return;
    boost = Math.max(boost, (intent.weight ?? 130) - projectIndex * 18);
  });

  return boost;
};

const getWeightedProjectSearchFields = (project: Project) => [
  { text: project.title, weight: 12 },
  { text: (project.aliases ?? []).join(' '), weight: 10 },
  { text: (project.surfaceTags ?? []).join(' '), weight: 8 },
  { text: project.techStack.join(' '), weight: 7 },
  { text: project.description, weight: 6 },
  { text: project.keyFeatures.join(' '), weight: 5 },
  { text: project.longDescription || '', weight: 4 },
  {
    text: (project.benchmarks ?? [])
      .map((benchmark) => `${benchmark.label} ${benchmark.value} ${benchmark.context ?? ''}`)
      .join(' '),
    weight: 3,
  },
  { text: project.links.map((link) => `${link.text} ${link.url}`).join(' '), weight: 2 },
  { text: project.projectKind || '', weight: 2 },
];

const scoreTokenAgainstField = (term: string, fieldTerms: Set<string>) => {
  if (fieldTerms.has(term)) return 1;
  if (term.length < 4) return 0;
  for (const fieldTerm of fieldTerms) {
    if (fieldTerm.length < 4) continue;
    if (fieldTerm.startsWith(term) || term.startsWith(fieldTerm)) return 0.42;
  }
  return 0;
};

const scoreProjectSearch = (project: Project, query: string, boostedProjectIds: readonly number[] = []) => {
  const { normalized, terms } = buildSemanticQueryTerms(query);
  const topicBoostIndex = boostedProjectIds.indexOf(project.id);
  const topicBoost = topicBoostIndex === -1 ? 0 : 2400 - topicBoostIndex * 120;
  const intentBoost = getSearchIntentBoost(project, normalized, extractSearchTerms(query));
  if (!normalized && topicBoost === 0 && intentBoost === 0) return 0;

  const matchedTerms = new Set<string>();
  let score = topicBoost + intentBoost;
  const projectSearchText = normalizeSearchValue(getProjectSearchText(project));

  if (normalized && projectSearchText.includes(normalized)) {
    score += 80;
  }

  getWeightedProjectSearchFields(project).forEach((field) => {
    const fieldText = normalizeSearchValue(field.text);
    const fieldTerms = new Set(extractSearchTerms(fieldText));
    if (normalized && fieldText.includes(normalized)) {
      score += field.weight * 6;
    }

    terms.forEach((term) => {
      const matchStrength = scoreTokenAgainstField(term, fieldTerms);
      if (matchStrength <= 0) return;
      matchedTerms.add(term);
      score += field.weight * 2.8 * matchStrength;
    });
  });

  if (matchedTerms.size === 0 && topicBoost === 0 && intentBoost === 0) return 0;
  if (terms.length > 0) {
    score += (matchedTerms.size / terms.length) * 70;
  }
  score += getProjectSignals(project).signalScore * 0.18;
  return score;
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
  const signalScore =
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
    signalScore,
  };
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

const isHighSignalLatestUpdate = (update: LatestUpdate) => {
  const description = update.description?.trim() || '';
  if (!update.links.length) return false;
  if (/new project added from github/i.test(description)) return false;
  return true;
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

const QUICK_TOPIC_LIMIT = 8;

const QUICK_TOPIC_SEARCHES: Array<{
  label: string;
  query: string;
  keywords: string;
  filter?: ProjectFilter;
  projectIds: readonly number[];
  defaultVisible?: boolean;
}> = [
  { label: 'OCR serving', query: 'ocr onnx inference api', keywords: 'line segmentation word recognition FastAPI CRNN document API production ML', filter: 'computer-vision', projectIds: [70, 73, 72], defaultVisible: true },
  { label: 'Mobile vision', query: 'food recognition mobile vision', keywords: 'CoreML iOS Android Flutter ONNX mobile computer vision', filter: 'computer-vision', projectIds: [10, 63], defaultVisible: true },
  { label: 'Segmentation systems', query: 'skin texture segmentation computer vision', keywords: 'Segment Anything YOLO masks wrinkles pores ROI production CV', filter: 'computer-vision', projectIds: [71, 67, 77, 74], defaultVisible: true },
  { label: 'Video retrieval', query: 'multimodal video search', keywords: 'retrieval embeddings OCR transcript keyframes ASR hybrid search CLIP', filter: 'computer-vision', projectIds: [72, 77, 40], defaultVisible: true },
  { label: 'ML/MLOps delivery', query: 'clearml dermaself mlops', keywords: 'experiment tracking metrics promotion gates model versioning monitoring', filter: 'computer-vision', projectIds: [80, 63], defaultVisible: true },
  { label: 'LLM inference', query: 'agnitra llm inference optimizer', keywords: 'model profiling runtime telemetry baseline quantization serving optimization', filter: 'ai-systems', projectIds: [81], defaultVisible: true },
  { label: 'VLM/LLM workflows', query: 'llm vlm agents human review', keywords: 'multimodal automation workflows gates tool calling review loops', filter: 'ai-systems', projectIds: [66, 78, 79, 67, 40], defaultVisible: true },
  { label: 'Architecture CV', query: 'architectural drawing catalog matching', keywords: 'elevation casework reception plan interior room matching computer vision', filter: 'computer-vision', projectIds: [77, 74, 73], defaultVisible: true },
  { label: 'Jaw classifier', query: 'jaw face type classifier', keywords: 'aesthetic review landmarks plastic surgery face morphology', filter: 'computer-vision', projectIds: [76, 71, 63, 67] },
  { label: 'InQuest RAG', query: 'inquest rag project binder', keywords: 'binder QA vector storage project reference retrieval', filter: 'ai-systems', projectIds: [78, 66, 40] },
  { label: 'ComfyUI lab', query: 'comfyui colab custom model', keywords: 'generative prototype custom models workflows notebooks', filter: 'ai-systems', projectIds: [79, 74] },
  { label: 'MCP apps', query: 'mcp chatgpt conservation app', keywords: 'tool calling senior conservator widgets agents', filter: 'ai-systems', projectIds: [66, 78, 40] },
  { label: 'Calorio', query: 'calorio nutrition telegram bot', keywords: 'food calorie tracker meal diary voice photos mini app', filter: 'telegram', projectIds: [11] }
];

const getQuickTopicSearchText = (topic: (typeof QUICK_TOPIC_SEARCHES)[number]) =>
  normalizeSearchValue(`${topic.label} ${topic.query} ${topic.keywords}`);

const getVisibleQuickTopics = (query: string) => {
  const normalized = normalizeSearchValue(query);
  const terms = extractSearchTerms(query);
  if (!normalized || terms.length === 0) {
    return QUICK_TOPIC_SEARCHES.filter((topic) => topic.defaultVisible).slice(0, QUICK_TOPIC_LIMIT);
  }

  return QUICK_TOPIC_SEARCHES.map((topic, index) => {
    const topicText = getQuickTopicSearchText(topic);
    const topicTerms = new Set(extractSearchTerms(topicText));
    let score = topicText.includes(normalized) ? 80 : 0;
    terms.forEach((term) => {
      if (topicTerms.has(term)) {
        score += 14;
        return;
      }
      for (const topicTerm of topicTerms) {
        if (topicTerm.length >= 4 && (topicTerm.startsWith(term) || term.startsWith(topicTerm))) {
          score += 6;
          return;
        }
      }
    });
    if (score > 0 && topic.defaultVisible) score += 1;
    return { topic, index, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, QUICK_TOPIC_LIMIT)
    .map((item) => item.topic);
};

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [portfolioUpdates, setPortfolioUpdates] = useState<PortfolioUpdates | null>(null);
  const [activeLatestSlug, setActiveLatestSlug] = useState<string | null>(null);
  const [expandedLatestSlugs, setExpandedLatestSlugs] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [projectQuery, setProjectQuery] = useState('');
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [isSmartSearchFocused, setIsSmartSearchFocused] = useState(false);
  const [smartSearchBoostIds, setSmartSearchBoostIds] = useState<readonly number[]>([]);
  const [projectSort, setProjectSort] = useState<ProjectSortMode>('impact');
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all');
  const [benchmarkedOnly, setBenchmarkedOnly] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const deferredProjectQuery = useDeferredValue(projectQuery);
  const copyTimeoutRef = useRef<number | null>(null);
  const projectArchiveRef = useRef<HTMLDetailsElement | null>(null);
  const projectResultsRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const revealTarget = (id: string) => {
      const target = document.getElementById(id);
      const disclosure = target?.closest('details');
      if (disclosure) disclosure.open = true;
      return target;
    };
    const revealAnchor = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = revealTarget(id);
      window.requestAnimationFrame(() => target?.scrollIntoView({ block: 'start' }));
    };
    const revealLocalLink = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
      const hash = anchor?.getAttribute('href');
      if (hash && hash.length > 1) revealTarget(hash.slice(1));
    };
    revealAnchor();
    window.addEventListener('hashchange', revealAnchor);
    document.addEventListener('click', revealLocalLink);
    return () => {
      window.removeEventListener('hashchange', revealAnchor);
      document.removeEventListener('click', revealLocalLink);
    };
  }, []);


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
    () => selectReviewedFeedProjects(portfolioUpdates, PORTFOLIO_UPDATE_REPO_EXCLUSIONS).map(normalizeProject),
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

  const featuredProjects = useMemo(() => {
    return FEATURED_PROJECT_IDS.map((id) => projectById.get(id)).filter((project): project is Project => Boolean(project));
  }, [projectById]);

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
    const reportedRows = CHROME_EXTENSION_STATS.extensions.length;
    const rowsAddedIn2026 = CHROME_EXTENSION_STATS.extensions.filter((extension) =>
      (extension.createdAt ?? extension.lastUpdated).startsWith('2026-')
    ).length;
    const averageRating = CHROME_EXTENSION_STATS.ratingCount > 0 ? CHROME_EXTENSION_STATS.averageRating.toFixed(2) : null;
    return { reportedRows, rowsAddedIn2026, averageRating };
  }, []);

  const chromeExtensionRows = useMemo(() => CHROME_EXTENSION_STATS.extensions, []);
  const featuredChromeExtensionRows = useMemo(() => chromeExtensionRows.slice(0, 3), [chromeExtensionRows]);
  const remainingChromeExtensionRows = useMemo(() => {
    const visibleIds = new Set(featuredChromeExtensionRows.map((extension) => extension.id));
    return chromeExtensionRows.filter((extension) => !visibleIds.has(extension.id));
  }, [chromeExtensionRows, featuredChromeExtensionRows]);

  const syncFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const pathProjectSlug = getProjectSlugFromPath(window.location.pathname);
    const projectSlug = pathProjectSlug || params.get('project');
    const latestSlug = params.get('latest');

    if (projectSlug) {
      const project = projectBySlug.get(projectSlug);
      setSelectedProject(project ?? null);
      if (project && projectArchiveRef.current) projectArchiveRef.current.open = true;
      if (project && !pathProjectSlug) {
        window.history.replaceState(null, '', buildProjectPublicUrl(getProjectCanonicalSlug(project)));
      }
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
    if (isProjectPath(url.pathname)) {
      url.pathname = '/';
    }
    applyShareParams(url, params);
    return url.toString();
  }, []);

  const updateUrlParams = useCallback(
    (params: { project?: string | null; latest?: string | null }, options: { replace?: boolean } = {}) => {
      const url = new URL(window.location.href);
      if (isProjectPath(url.pathname)) {
        url.pathname = '/';
      }
      applyShareParams(url, params);
      if (options.replace) {
        window.history.replaceState(null, '', url.toString());
      } else {
        window.history.pushState(null, '', url.toString());
      }
    },
    []
  );

  const updateProjectPath = useCallback((slug: string, options: { replace?: boolean } = {}) => {
    const url = new URL(buildProjectPublicUrl(slug));
    if (options.replace) {
      window.history.replaceState(null, '', url.toString());
    } else {
      window.history.pushState(null, '', url.toString());
    }
  }, []);

  const handleSelectProject = useCallback(
    (project: Project) => {
      const slug = getProjectCanonicalSlug(project);
      setSelectedProject(project);
      setActiveLatestSlug(null);
      updateProjectPath(slug);
    },
    [updateProjectPath]
  );

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
    updateUrlParams({ project: null }, { replace: true });
  }, [updateUrlParams]);

  const handleShareProject = useCallback(
    async (project: Project) => {
      const slug = getProjectCanonicalSlug(project);
      const shareUrl = buildProjectPublicUrl(slug);
      updateProjectPath(slug, { replace: true });
      await copyToClipboard(shareUrl, `project:${slug}`);
    },
    [copyToClipboard, updateProjectPath]
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
    const queryTerms = extractSearchTerms(normalizedProjectQuery);
    const normalizedQuery = normalizeSearchValue(normalizedProjectQuery);
    const searchEntries = mergedProjects.map((project) => {
      const projectTerms = new Set(extractSearchTerms(getProjectSearchText(project)));
      return {
        project,
        exactNameMatch: [project.title, ...(project.aliases ?? [])]
          .some((name) => normalizeSearchValue(name) === normalizedQuery),
        directMatch: queryTerms.some((term) => scoreTokenAgainstField(term, projectTerms) > 0),
        searchScore: normalizedProjectQuery
          ? scoreProjectSearch(project, normalizedProjectQuery, smartSearchBoostIds)
          : 0,
      };
    });
    const hasExactNameMatch = searchEntries.some(({ exactNameMatch }) => exactNameMatch);
    const hasDirectMatch = searchEntries.some(({ directMatch }) => directMatch);
    const withFilters = searchEntries
      .filter(({ project, searchScore, exactNameMatch, directMatch }) => {
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
        // Related vocabulary can improve ranking, but cannot admit unrelated work.
        // Explicit topic selections retain their curated set; otherwise exact names
        // take precedence, then original terms, then a recognized problem intent.
        if (smartSearchBoostIds.includes(project.id)) return true;
        if (hasExactNameMatch) return exactNameMatch;
        if (hasDirectMatch) return directMatch;
        return searchScore > 0 && getSearchIntentBoost(project, normalizedQuery, queryTerms) > 0;
      });

    if (normalizedProjectQuery) {
      return [...withFilters]
        .sort((a, b) => {
          const scoreDelta = b.searchScore - a.searchScore;
          if (scoreDelta !== 0) return scoreDelta;
          const signalDelta = getProjectSignals(b.project).signalScore - getProjectSignals(a.project).signalScore;
          if (signalDelta !== 0) return signalDelta;
          return b.project.id - a.project.id;
        })
        .map(({ project }) => project);
    }

    if (projectSort === 'alpha') {
      return [...withFilters]
        .sort((a, b) => a.project.title.localeCompare(b.project.title))
        .map(({ project }) => project);
    }

    if (projectSort === 'recent') {
      return [...withFilters].sort((a, b) => b.project.id - a.project.id).map(({ project }) => project);
    }

    return [...withFilters]
      .sort((a, b) => {
        const scoreDelta = getProjectSignals(b.project).signalScore - getProjectSignals(a.project).signalScore;
        if (scoreDelta !== 0) return scoreDelta;
        return b.project.id - a.project.id;
      })
      .map(({ project }) => project);
  }, [benchmarkedOnly, mergedProjects, normalizedProjectQuery, projectFilter, projectSort, smartSearchBoostIds]);

  const selectedProjectBadges = useMemo(
    () => (selectedProject ? getProjectSignals(selectedProject).badges : []),
    [selectedProject]
  );

  const activeProjectFilterLabel = useMemo(() => {
    return projectFilterOptions.find((filter) => filter.value === projectFilter)?.label || 'All projects';
  }, [projectFilter, projectFilterOptions]);
  const visibleQuickTopics = useMemo(() => getVisibleQuickTopics(projectQuery), [projectQuery]);
  const showQuickTopics = visibleQuickTopics.length > 0 && (!projectQuery.trim() || isSmartSearchFocused);

  const scrollToProjectExplorer = useCallback(() => {
    if (projectArchiveRef.current) projectArchiveRef.current.open = true;
    window.requestAnimationFrame(() => {
      projectResultsRef.current?.focus({ preventScroll: true });
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleProjectQueryChange = useCallback((query: string) => {
    setProjectQuery(query);
    setHeroSearchQuery(query);
    setSmartSearchBoostIds([]);
    setIsSmartSearchFocused(true);
  }, []);

  const runSmartSearch = useCallback(
    (query: string, filter: ProjectFilter = 'all', projectIds: readonly number[] = []) => {
      const cleanedQuery = query.trim();
      setProjectQuery(cleanedQuery);
      setHeroSearchQuery(cleanedQuery);
      setSmartSearchBoostIds(projectIds);
      setProjectFilter(filter);
      setBenchmarkedOnly(false);
      setProjectSort('impact');
      setShowAllProjects(true);
      setIsSmartSearchFocused(false);
      scrollToProjectExplorer();
    },
    [scrollToProjectExplorer]
  );

  const handleSmartSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      runSmartSearch(projectQuery);
    },
    [projectQuery, runSmartSearch]
  );

  const handleHeroSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      runSmartSearch(heroSearchQuery);
    },
    [heroSearchQuery, runSmartSearch]
  );

  const clearProjectQuery = useCallback(() => {
    setProjectQuery('');
    setHeroSearchQuery('');
    setSmartSearchBoostIds([]);
    document.getElementById('portfolio-smart-search')?.focus();
  }, []);

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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-layout">
        <Sidebar />
        <main id="main-content" className="content-column">
          <section id="intro" className="hero">
            <div className="hero__copy">
              <p className="hero__eyebrow">Computer vision · Document AI · Agentic systems</p>
              <h1 className="hero__title">Zakhar Pashkin<span aria-hidden="true">.</span></h1>
              <p className="hero__role">Senior ML Engineer</p>
              <p className="hero__lead">From R&D to maintained products.<br />Previously shipped computer vision at Carb Manager and built document recognition at CFT.</p>
              <div className="hero__actions">
                <a href="#featured" className="button button--primary">Selected work <span aria-hidden="true">↓</span></a>
                <a href={SOCIAL_LINKS.resume} download="zakhar-pashkin-senior-ml-engineer.pdf" className="button button--ghost">
                  <DownloadIcon className="h-4 w-4" /> Download resume
                </a>
              </div>
              <div className="hero__links">
                <a href={SOCIAL_LINKS.githubPrimary} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
                <a href={`mailto:${SOCIAL_LINKS.email}`}>Email <span aria-hidden="true">↗</span></a>
              </div>
              <form className="hero-search" role="search" aria-label="Find portfolio work" onSubmit={handleHeroSearchSubmit}>
                <label className="sr-only" htmlFor="hero-project-search">Search portfolio work</label>
                <input
                  id="hero-project-search"
                  type="search"
                  value={heroSearchQuery}
                  onChange={(event) => setHeroSearchQuery(event.target.value)}
                  placeholder="Search work · OCR, inference…"
                  aria-controls="projects"
                  enterKeyHint="search"
                />
                <button type="submit" aria-label="Search work" title="Search work">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 4.5 4.5" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </div>
            <aside className="hero__current" aria-label="Current work">
              <p className="current-label"><span aria-hidden="true" /> Currently</p>
              <h2>R&D ML at{' '}<br />Riverstart</h2>
              <p>Document intelligence and source-linked workflows for expert teams.</p>
              <a href="#experience" className="text-link">View experience <span aria-hidden="true">↗</span></a>
              <div className="hero__practice"><span>Also building</span><p>Mobile vision. Inference tools.<br />A maintained AI nutrition service.</p></div>
            </aside>
          </section>

          <Section id="featured" eyebrow="01 / Selected work" title="Systems, tools, and products" description="Selected systems and the engineering work behind them.">
            <div className="featured-grid">
              {featuredProjects.map((project, index) => {
                const context = FEATURED_PROJECT_CONTEXT[project.id];
                const asset = project.images[0];
                const isIllustration = Boolean(asset && /generated|conceptual|illustration|public-safe.*card/i.test(asset.alt));
                const figureLabel = project.id === 102 ? 'Point cloud → model → plan' : project.id === 81 ? 'Recorded profiling output' : context.artifact ? 'System outline' : /workflow diagram/i.test(asset?.caption || '') ? 'Workflow diagram' : isIllustration ? 'Workflow illustration' : 'Project figure';
                return (
                  <article key={project.id} className="featured-card">
                    <header className="featured-card__header">
                      <p className="featured-card__label">{context.label}</p>
                      <h3><a href={buildProjectPublicUrl(getProjectCanonicalSlug(project))}>{context.title}</a></h3>
                    </header>
                    <a className="featured-card__visual" href={buildProjectPublicUrl(getProjectCanonicalSlug(project))} aria-label={`Explore ${context.title}`}>
                      <div className="featured-card__media">
                      {context.artifact ? (
                        <div className={`work-artifact work-artifact--${project.id}`}>
                          <strong className={project.id === 81 ? 'work-artifact__command' : ''}>{context.artifact.heading}</strong>
                          <ol>{context.artifact.lines.map((line) => <li key={line}><span aria-hidden="true" />{line}</li>)}</ol>
                          <span className="work-artifact__footer">{context.artifact.footer}</span>
                        </div>
                      ) : asset && !project.hideImages ? (
                        <>
                          {isVideoUrl(asset.url) ? (
                            <video src={asset.url} className="featured-card__asset" controls playsInline preload="metadata" />
                          ) : (
                            <img src={asset.url} alt={asset.alt} className="featured-card__asset" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
                          )}
                        </>
                      ) : null}
                      </div>
                      <span className="featured-card__caption">{figureLabel}</span>
                    </a>
                    <div className="featured-card__content">
                      <p className="featured-card__summary">{context.summary}</p>
                      <div className="featured-card__links">
                        <a className="text-link" href={buildProjectPublicUrl(getProjectCanonicalSlug(project))}>Case study <span aria-hidden="true">↗</span></a>
                        {project.links.slice(0, 1).map((link) => <a className="text-link" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.text} <span aria-hidden="true">↗</span></a>)}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Section>

          <Section id="experience" eyebrow="02 / Experience" title="A career in applied ML" description="Document recognition, mobile vision, model tooling and retrieval systems, followed by current document AI research.">
            <div className="career-list">
              {CAREER.map((item) => (
                <article key={item.company} className="career-row">
                  <p className="career-row__period">{item.period}</p>
                  <div><h3>{item.company}</h3><p className="career-row__role">{item.role}</p><p className="career-row__description">{item.description}</p></div>
                  {item.current && <span className="career-row__current">Current</span>}
                </article>
              ))}
            </div>
            <a href={SOCIAL_LINKS.resume} className="text-link career-resume" download="zakhar-pashkin-senior-ml-engineer.pdf">Full experience in the resume <span aria-hidden="true">↗</span></a>
          </Section>

          <Section id="about" eyebrow="03 / Approach" title="Research depth. Engineering follow-through." description="I work across the model and the surrounding software, with an emphasis on systems a team can evaluate and maintain.">
            <div className="expertise-grid">
              <article id="computer-vision" className="expertise-block">
                <span className="expertise-number">01</span><h3>Computer vision</h3>
                <p>OCR, detection, segmentation, and multimodal retrieval. From dataset and model experiments to server and on-device inference.</p>
                <p className="expertise-stack">PyTorch · ONNX · OpenCV · TFLite</p>
                <button type="button" className="text-link" onClick={() => runSmartSearch('', 'computer-vision')}>Explore CV work <span aria-hidden="true">↗</span></button>
              </article>
              <article id="ai-systems" className="expertise-block">
                <span className="expertise-number">02</span><h3>Document & agentic AI</h3>
                <p>Hybrid retrieval, source-linked answers, and human review. Models connected to the documents, tools, and workflows people use.</p>
                <p className="expertise-stack">Python · FastAPI · Retrieval · LLM/VLM</p>
                <button type="button" className="text-link" onClick={() => runSmartSearch('', 'ai-systems')}>Explore AI systems <span aria-hidden="true">↗</span></button>
              </article>
              <article className="expertise-block">
                <span className="expertise-number">03</span><h3>Inference & delivery</h3>
                <p>Profiling, model packaging, evaluation, and deployment. Clear runtime tradeoffs and repeatable releases across cloud and mobile.</p>
                <p className="expertise-stack">Docker · ClearML · CI/CD · Model serving</p>
                <button type="button" className="text-link" onClick={() => runSmartSearch('inference optimization')}>Explore inference work <span aria-hidden="true">↗</span></button>
              </article>
            </div>
          </Section>

          <details id="project-archive" className="project-archive" ref={projectArchiveRef}>
            <summary className="project-archive__summary">
              <span><strong>Browse the project archive</strong><span>Search earlier projects, experiments, and released tools.</span></span>
              <span className="project-archive__toggle" aria-hidden="true">+</span>
            </summary>
          <Section
            id="smart-search"
            eyebrow="Explore the archive"
            title="Find the relevant work"
            description="Search projects by problem, model, or technology."
          >
            <form className="smart-search-panel" role="search" aria-label="Search project archive" onSubmit={handleSmartSearchSubmit}>
              <label className="sr-only" htmlFor="portfolio-smart-search">
                Search projects
              </label>
              <div className="smart-search-field">
                <input
                  id="portfolio-smart-search"
                  type="search"
                  value={projectQuery}
                  onChange={(event) => handleProjectQueryChange(event.target.value)}
                  onFocus={() => setIsSmartSearchFocused(true)}
                  placeholder="Try OCR, inference optimization, or document AI…"
                  className="smart-search-field__input"
                  aria-controls="projects"
                />
                <button type="submit" className="button button--primary">
                  Search
                </button>
              </div>
              <div
                className={`quick-topic-panel${showQuickTopics ? ' is-visible' : ''}`}
                aria-hidden={!showQuickTopics}
              >
                <div className="quick-topic-row" aria-label="Quick topic searches">
                  {visibleQuickTopics.map((topic) => {
                    const isActiveTopic = normalizeSearchValue(projectQuery) === normalizeSearchValue(topic.query);
                    return (
                      <button
                        key={topic.label}
                        type="button"
                        className={`quick-topic${isActiveTopic ? ' is-active' : ''}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => runSmartSearch(topic.query, topic.filter, topic.projectIds)}
                      >
                        {topic.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          </Section>

          <Section
            id="projects"
            eyebrow="Project archive"
            title="Projects"
            description="Selected entries first. Use search and filters to explore the full body of work."
          >
            <div className="explorer-panel">
              <div className="explorer-panel__controls">
                <div className="chip-row explorer-panel__sorts" role="group" aria-label="Project sorting">
                  <button
                    type="button"
                    onClick={() => setProjectSort('impact')}
                    className={`pill-button${projectSort === 'impact' ? ' is-active' : ''}`}
                    aria-pressed={projectSort === 'impact'}
                  >
                    Relevant
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

              {normalizedProjectQuery && (
                <div className="explorer-panel__active-query" aria-live="polite">
                  <span>Query</span>
                  <strong>{projectQuery}</strong>
                  <button
                    type="button"
                    className="text-link"
                    onClick={clearProjectQuery}
                  >
                    Clear
                  </button>
                </div>
              )}

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

              <p className="explorer-panel__summary" ref={projectResultsRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true">
                Showing <strong>{visibleProjects.length}</strong> of <strong>{filteredProjects.length}</strong>{' '}
                projects · <strong>{activeProjectFilterLabel}</strong>
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
                    href={buildProjectPublicUrl(getProjectCanonicalSlug(project))}
                    badges={signals.badges.filter((badge) => !/metrics|benchmark/i.test(badge)).slice(0, 2)}
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
              <div className="empty-state">
                <p>{normalizedProjectQuery ? `No projects found for “${projectQuery}”.` : 'No projects match the current filters.'} Try a project name, problem, or technology.</p>
                <button type="button" className="text-link" onClick={() => {
                  setProjectFilter('all');
                  setBenchmarkedOnly(false);
                  clearProjectQuery();
                }}>Clear search and filters</button>
              </div>
            )}
          </Section>
          </details>

          <Section
            id="contributed-to"
            eyebrow="Open Source"
            title="Open-source contributions"
            description="Code changes, documentation, and issue reports with direct evidence."
          >
            <ul className="contribution-list">{CODE_CONTRIBUTIONS.map(renderContribution)}</ul>
            <details className="contribution-participation">
              <summary>Bug reports &amp; issue discussions <span aria-hidden="true">+</span></summary>
              <ul className="contribution-list">{ISSUE_PARTICIPATION.map(renderContribution)}</ul>
            </details>
          </Section>

          <Section
            id="latest"
            eyebrow="Recent"
            title="Recent work & releases"
            description="Engineering notes, project additions, and releases."
          >
            <ul className="latest-list">
              {mergedLatestUpdates.filter((update, index) => showAllUpdates || index < 3 || getLatestSlug(update) === activeLatestSlug).map((update) => {
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
            {mergedLatestUpdates.length > 3 && (
              <button className="text-link archive-toggle" type="button" onClick={() => setShowAllUpdates((value) => !value)}>
                {showAllUpdates ? 'Show fewer updates' : 'Browse all updates'} <span aria-hidden="true">↓</span>
              </button>
            )}
          </Section>

          <details className="supporting-details" id="release-data">
            <summary><span>Release data & marketplace snapshots</span><span className="supporting-details__hint">Optional detail <span aria-hidden="true">+</span></span></summary>
            <div className="supporting-details__body">
          <Section
            id="clawhub"
            eyebrow="ClawHub"
            title="Downloads Tracker"
            description="Dated public ClawHub skill listing counters shown as marketplace metrics, not user-count claims."
          >
            <div className="metric-board metric-board--clawhub" data-testid="clawhub-board">
              <div className="metric-board__header">
                <div>
                  <p className="panel__eyebrow">Public listing snapshot</p>
                  <h3>Top skill listings by downloads</h3>
                  <p>
                    Package counters checked {clawHubSummary.checkedAt}.
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

              <div className="metric-grid metric-grid--compact" aria-label="ClawHub summary counters">
                <div className="metric-chip metric-chip--compact">
                  <strong>{clawHubSummary.totalDownloads.toLocaleString()}</strong>
                  <em>downloads across {CLAWHUB_DOWNLOAD_STATS.length} public skills</em>
                </div>
                <div className="metric-chip metric-chip--compact">
                  <strong>{clawHubSummary.totalVersions}</strong>
                  <em>published versions in tracked listings</em>
                </div>
                <div className="metric-chip metric-chip--compact">
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
            description="Dated Chrome Web Store detail-page snapshot for the kaisenaiko publisher surface. Row-level data is published only when the public count is visible."
          >
            <div className="metric-board metric-board--cws" data-testid="cws-board">
              <div className="metric-board__header">
                <div>
                  <p className="panel__eyebrow">Dated public snapshot</p>
                  <h3>Chrome Web Store publisher detail</h3>
                  <p>
                    Source: {CHROME_EXTENSION_STATS.sourceName}, checked {CHROME_EXTENSION_STATS.checkedAt}.
                    Extensions without a visible Chrome Web Store user count are omitted from the row-level dataset.
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

              <div className="metric-grid metric-grid--compact chrome-stats__summary" aria-label="Chrome extension publisher summary">
                <div className="metric-chip metric-chip--compact">
                  <strong>{CHROME_EXTENSION_STATS.totalPublished}</strong>
                  <em>published extensions</em>
                </div>
                <div className="metric-chip metric-chip--compact">
                  <strong>{CHROME_EXTENSION_STATS.totalUsers.toLocaleString()}</strong>
                  <em>reported users as of {CHROME_EXTENSION_STATS.checkedAt}</em>
                </div>
                {chromeStatsSummary.averageRating && (
                  <div className="metric-chip metric-chip--compact">
                    <strong>{chromeStatsSummary.averageRating}</strong>
                    <em>average rating / {CHROME_EXTENSION_STATS.ratingCount} ratings</em>
                  </div>
                )}
                <div className="metric-chip metric-chip--compact">
                  <strong>{chromeStatsSummary.rowsAddedIn2026}</strong>
                  <em>2026 listing rows</em>
                </div>
                <div className="metric-chip metric-chip--compact">
                  <strong>{chromeStatsSummary.reportedRows}</strong>
                  <em>measured public rows</em>
                </div>
                <div className="metric-chip metric-chip--compact">
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
            </div>
          </details>

          <Section
            id="contact"
            eyebrow="Get in touch"
            title="Let’s build something useful."
            description="For senior ML roles and focused collaborations in computer vision, document AI, and inference systems."
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
                  <span>Direct message</span>
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
                aria-label="X"
                className="contact-card"
              >
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <XSocialIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>X</strong>
                  <span>Notes and updates</span>
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
              <a href={SOCIAL_LINKS.resume} download="zakhar-pashkin-senior-ml-engineer.pdf" className="contact-card">
                <span className="contact-card__icon-wrap" aria-hidden="true">
                  <DownloadIcon className="contact-card__icon" />
                </span>
                <div className="contact-card__body">
                  <strong>Resume</strong>
                  <span>Senior ML Engineer · PDF</span>
                </div>
              </a>
            </div>
          </Section>
          <footer className="site-footer">
            <p>© {new Date().getFullYear()} Zakhar Pashkin</p>
            <a href="/papers/">Research notes <span aria-hidden="true">↗</span></a>
            <a href="#intro">Back to top ↑</a>
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

      {ENABLE_VERCEL_ANALYTICS && <Analytics />}
    </div>
  );
};

export default App;
