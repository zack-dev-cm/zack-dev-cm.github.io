import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import ts from 'typescript';
import { assertUniqueProjectRoutes, getProjectCanonicalSlug, getProjectRouteSlugs, mergeProjects, selectReviewedFeedProjects } from '../utils/project-catalog.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');
const PORTFOLIO_UPDATES_PATH = path.resolve(ROOT_DIR, 'public', 'portfolio-updates.json');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'projects');
const PROJECT_SOCIAL_IMAGE_DIR = path.resolve(ROOT_DIR, 'public', 'images', 'project-social');
const LLMS_PATH = path.resolve(ROOT_DIR, 'llms.txt');
const GEO_PATH = path.resolve(ROOT_DIR, 'geo.txt');
const LLMS_FULL_PATH = path.resolve(ROOT_DIR, 'llms-full.txt');
const AGENT_CONTEXT_PATH = path.resolve(ROOT_DIR, 'agent-context.md');
const AGENT_DISCOVERY_PATH = path.resolve(ROOT_DIR, 'agent-discovery.json');
const SCHEMA_JSONLD_PATH = path.resolve(ROOT_DIR, 'schema.jsonld');
const SITEMAP_PATH = path.resolve(ROOT_DIR, 'sitemap.xml');
const INDEX_HTML_PATH = path.resolve(ROOT_DIR, 'index.html');
const METADATA_PATH = path.resolve(ROOT_DIR, 'metadata.json');
const CHROME_EXTENSION_STATS_PATH = path.resolve(ROOT_DIR, 'public', 'chrome-extension-stats.json');
const PAPER_REVIEWS_JSON_PATH = path.resolve(ROOT_DIR, 'public', 'paper-reviews.json');
const SITE_BASE = 'https://zack-dev-cm.github.io';
const CONTACT_EMAIL = 'kaisenaiko@gmail.com';
const AUTHOR_NAME = 'Zakhar Pashkin';
const AUTHOR_TITLE = 'Senior ML Engineer';
const SITE_TITLE = `${AUTHOR_NAME} | Senior ML Engineer - Computer Vision & Agentic AI`;
const SITE_NAME = `${AUTHOR_NAME} - Applied Machine Learning Portfolio`;
const SOCIAL_DESCRIPTION =
  'Senior ML Engineer in Riverstart R&D. Computer vision, document AI, agentic systems, maintained nutrition software and published ML optimization tools.';
const SOCIAL_IMAGE_URL = `${SITE_BASE}/docs/images/portfolio-social-card-ml-ai-products.png`;
const SOCIAL_IMAGE_ALT =
  'Zakhar Pashkin - Senior ML Engineer. Computer vision, document AI and agentic systems.';
const PROJECT_SOCIAL_IMAGE_URL_BASE = `${SITE_BASE}/docs/images/project-social`;
const PROJECT_SOCIAL_IMAGE_WIDTH = 1200;
const PROJECT_SOCIAL_IMAGE_HEIGHT = 630;
const AUTHOR_DESCRIPTION =
  'Senior ML Engineer in Riverstart’s R&D ML team, working on document intelligence and engineering analysis. Previously shipped mobile and cloud computer vision at Carb Manager and developed financial-document recognition at CFT.';
const PORTFOLIO_TAGLINE =
  'Computer vision, document AI and agentic systems, from R&D to maintained products.';
const PRIMARY_STACK_LINE =
  'Python, PyTorch, OpenMMLab, OpenCV, ONNX Runtime, FastAPI, OCR, retrieval, LLM/VLM systems, Docker, ClearML, Cloud Run';
const RESUME_URL = `${SITE_BASE}/resume/zakhar-pashkin-senior-ml-engineer.pdf`;
const RESUME_HTML_URL = `${SITE_BASE}/resume/zakhar-pashkin-senior-ml-engineer.html`;
const PAPER_REVIEWS_URL = `${SITE_BASE}/papers/`;
const PAPER_REVIEWS_DATA_URL = `${SITE_BASE}/docs/paper-reviews.json`;
const LINKEDIN_URL = 'https://de.linkedin.com/in/zakhar-pashkin-a524a6163';
const X_URL = 'https://x.com/Zackdevcv';
const DISCOVERY_FILE_URL = `${SITE_BASE}/docs/agent-discovery.json`;
const INDEX_SNAPSHOT_START = '<!-- STATIC_PORTFOLIO_SNAPSHOT_START -->';
const INDEX_SNAPSHOT_END = '<!-- STATIC_PORTFOLIO_SNAPSHOT_END -->';
const AUTHOR_SAME_AS = [
  LINKEDIN_URL,
  X_URL,
  'https://github.com/zack-dev-cm',
  'https://github.com/ZackPashkin',
  'https://t.me/rheuiii'
];
const DEFAULT_TRACTION_SNAPSHOT = {
  totalDownloads: 10852,
  packageCount: 44,
  checkedAt: '2026-05-22'
};
let tractionSnapshot = DEFAULT_TRACTION_SNAPSHOT;
const DEFAULT_PAPER_REVIEW_SNAPSHOT = {
  title: 'ML Papers, Read for Builders',
  reviewCount: 0,
  updatedAt: '',
  latest: []
};
let paperReviewSnapshot = DEFAULT_PAPER_REVIEW_SNAPSHOT;

const formatInteger = (value) => Number(value || 0).toLocaleString('en-US');

const readPaperReviewSnapshot = async () => {
  try {
    const feed = JSON.parse(await fs.readFile(PAPER_REVIEWS_JSON_PATH, 'utf8'));
    const reviews = Array.isArray(feed.reviews) ? feed.reviews : [];
    return {
      title: feed.title || DEFAULT_PAPER_REVIEW_SNAPSHOT.title,
      reviewCount: reviews.length,
      updatedAt: feed.updatedAt || '',
      latest: reviews.slice(0, 4).map((review) => ({
        title: toAscii(review.title),
        arxivId: toAscii(review.arxivId),
        tags: Array.isArray(review.tags) ? review.tags.map(toAscii).filter(Boolean).slice(0, 6) : [],
        paperUrl: review.paperUrl || '',
      })),
    };
  } catch {
    return DEFAULT_PAPER_REVIEW_SNAPSHOT;
  }
};

const formatPaperReviewSummary = () => {
  if (!paperReviewSnapshot.reviewCount) {
    return 'The ML Papers, Read for Builders feed publishes source-neutral English ML paper reviews with production tests and source ledgers.';
  }
  const latestTitles = paperReviewSnapshot.latest
    .slice(0, 2)
    .map((review) => review.title)
    .filter(Boolean)
    .join('; ');
  const latestClause = latestTitles ? ` Latest reviews include ${latestTitles}.` : '';
  return `The ML Papers, Read for Builders feed has ${paperReviewSnapshot.reviewCount} source-neutral English ML paper reviews with production tests and primary source ledgers.${latestClause}`;
};

const KNOWS_ABOUT = [
  'Machine Learning',
  'Computer Vision',
  'Document AI',
  'OCR',
  'Segmentation',
  'Object Detection',
  'Multimodal Retrieval',
  'Agentic Systems',
  'Model Evaluation',
  'Inference Optimization',
  'Mobile Inference',
  'MLOps'
];

const FOCUS_AREAS = [
  {
    id: 'computer-vision',
    name: 'Computer vision',
    description: 'OCR, detection, segmentation and multimodal retrieval, from model experiments to server and on-device inference.',
    tags: ['computer-vision', 'ocr', 'segmentation', 'deep-learning'],
    references: ['Dermaself Flutter Skin Analysis App', 'Multimodal Video Search Platform', 'Fast OCR ONNX Inference Server'],
    canonicalUrls: [
      projectHtmlUrlFromSlug('dermaself-flutter-skin-analysis-app'),
      projectHtmlUrlFromSlug('multimodal-video-search-platform'),
      projectHtmlUrlFromSlug('fast-ocr-onnx-inference-server')
    ]
  },
  {
    id: 'ai-systems',
    name: 'Document and agentic AI',
    description: 'Hybrid retrieval, source-linked answers and human review for document and tool-based workflows.',
    tags: ['document-ai', 'rag', 'llm', 'ai-systems'],
    references: ['Riverstart Document AI', 'Construction Document Intelligence', 'InQuest'],
    canonicalUrls: [
      projectHtmlUrlFromSlug('riverstart-document-ai'),
      projectHtmlUrlFromSlug('construction-document-intelligence'),
      projectHtmlUrlFromSlug('inquest-project-binder-rag-qa')
    ]
  },
  {
    id: 'inference-delivery',
    name: 'Inference and delivery',
    description: 'Profiling, model packaging, evaluation and deployment across cloud and mobile.',
    tags: ['inference', 'optimization', 'mlops', 'model-serving'],
    references: ['Agnitra - ML Profiling & Optimization', 'CV Repro Lab Skills'],
    canonicalUrls: [
      projectHtmlUrlFromSlug('agnitra-ml-profiling-optimization'),
      projectHtmlUrlFromSlug('cv-repro-lab-skills')
    ]
  }
];

const TOPICAL_CLUSTERS = FOCUS_AREAS.map((area) => ({
  name: area.id,
  label: area.name,
  tags: area.tags
}));

const ASCII_REPLACEMENTS = new Map([
  ['–', ' - '],
  ['—', ' - '],
  ['‑', ' - '],
  ['−', ' - '],
  ['“', '"'],
  ['”', '"'],
  ['‘', '\''],
  ['’', '\''],
  ['…', '...'],
  ['→', '->'],
  ['←', '<-'],
  ['±', '+/-'],
  ['×', 'x'],
  ['°', ' deg'],
  ['•', '-']
]);

const toAscii = (value) => {
  if (!value) return '';
  let output = value;
  for (const [from, to] of ASCII_REPLACEMENTS.entries()) {
    output = output.split(from).join(to);
  }
  return output.replace(/[^\x00-\x7F]/g, '').replace(/\s{2,}/g, ' ').trim();
};

const toAsciiBlock = (value) => {
  if (!value) return '';
  let output = value;
  for (const [from, to] of ASCII_REPLACEMENTS.entries()) {
    output = output.split(from).join(to);
  }
  return output.replace(/[^\x00-\x7F]/g, '');
};

const toPublicAssetUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^(?:[a-z]+:)?\/\//i.test(raw)) return raw;
  if (raw.startsWith('LOCAL_IMG_BASE/')) {
    return `${SITE_BASE}/docs/images/${raw.replace(/^LOCAL_IMG_BASE\//, '')}`;
  }
  if (raw.startsWith('/docs/')) return `${SITE_BASE}${raw}`;
  if (raw.startsWith('docs/')) return `${SITE_BASE}/${raw}`;
  if (raw.startsWith('images/')) return `${SITE_BASE}/docs/${raw}`;
  return raw;
};

const escapeHtml = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function projectHtmlUrlFromSlug(slug) { return `${SITE_BASE}/projects/${slug}/`; }
const projectMarkdownUrlFromSlug = (slug) => `${SITE_BASE}/projects/${slug}.md`;
const projectSearchUrl = (project) => project.htmlUrl || project.markdownUrl;
const projectReferenceUrl = (project) => project.markdownUrl || project.htmlUrl;

const parseString = (node) => {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isTemplateExpression(node)) {
    let text = node.head.text;
    for (const span of node.templateSpans) {
      if (ts.isStringLiteral(span.expression) || ts.isNoSubstitutionTemplateLiteral(span.expression)) {
        text += span.expression.text;
      } else if (ts.isIdentifier(span.expression)) {
        text += span.expression.text;
      } else {
        text += span.expression.getText();
      }
      text += span.literal.text;
    }
    return text;
  }
  return '';
};

const parseStringArray = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => parseString(element))
    .filter(Boolean);
};

const parseJsonLiteral = (node) => {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node)) {
    return parseString(node);
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => parseJsonLiteral(element));
  }
  if (ts.isObjectLiteralExpression(node)) {
    const output = {};
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      output[getPropertyName(prop.name)] = parseJsonLiteral(prop.initializer);
    }
    return output;
  }
  return parseString(node) || null;
};

const getPropertyName = (nameNode) => {
  if (!nameNode) return '';
  if (ts.isIdentifier(nameNode)) return nameNode.text;
  if (ts.isStringLiteral(nameNode)) return nameNode.text;
  return nameNode.getText();
};

const getPropertyValue = (objectNode, key) => {
  const property = objectNode.properties.find((prop) => {
    if (!ts.isPropertyAssignment(prop)) return false;
    return getPropertyName(prop.name) === key;
  });
  if (!property || !ts.isPropertyAssignment(property)) return null;
  return property.initializer;
};

const parseLinks = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => {
      if (!ts.isObjectLiteralExpression(element)) return null;
      const text = parseString(getPropertyValue(element, 'text'));
      const url = parseString(getPropertyValue(element, 'url'));
      if (!text || !url) return null;
      return { text, url };
    })
    .filter(Boolean);
};

const parseProjectImage = (node, imageConstants) => {
  if (!node) return null;
  if (ts.isIdentifier(node)) {
    return imageConstants.get(node.text) || null;
  }
  if (!ts.isObjectLiteralExpression(node)) return null;
  const url = parseString(getPropertyValue(node, 'url'));
  const alt = parseString(getPropertyValue(node, 'alt'));
  const caption = parseString(getPropertyValue(node, 'caption'));
  if (!url || !alt) return null;
  return { url, alt, ...(caption ? { caption } : {}) };
};

const parseImages = (node, imageConstants) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => parseProjectImage(element, imageConstants))
    .filter(Boolean);
};

const parseThumbnail = (node, imageConstants) => {
  if (!node) return '';
  if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) && node.name.text === 'url') {
    return imageConstants.get(node.expression.text)?.url || '';
  }
  if (ts.isIdentifier(node)) {
    return imageConstants.get(node.text)?.url || '';
  }
  return parseString(node);
};

const parseOptionalIdentifierString = (node) => {
  if (!node) return '';
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) return node.text;
  return parseString(node);
};

const parseBenchmarks = (node) => {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .map((element) => {
      if (!ts.isObjectLiteralExpression(element)) return null;
      const label = parseString(getPropertyValue(element, 'label'));
      const value = parseString(getPropertyValue(element, 'value'));
      const context = parseString(getPropertyValue(element, 'context'));
      if (!label || !value) return null;
      return { label, value, context };
    })
    .filter(Boolean);
};

const extractImageConstants = (sourceFile) => {
  const imageConstants = new Map();
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const image = parseProjectImage(node.initializer, imageConstants);
      if (image) {
        imageConstants.set(node.name.text, image);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return imageConstants;
};

const extractProjects = (sourceFile, imageConstants) => {
  let projectsNode = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'PROJECTS') {
      if (node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        projectsNode = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (!projectsNode) {
    throw new Error('Could not find PROJECTS array in constants.ts');
  }

  return projectsNode.elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => {
      const idNode = getPropertyValue(element, 'id');
      const id = idNode && ts.isNumericLiteral(idNode) ? Number(idNode.text) : null;
      const title = parseString(getPropertyValue(element, 'title'));
      const legacySlugs = parseStringArray(getPropertyValue(element, 'legacySlugs'));
      const description = parseString(getPropertyValue(element, 'description'));
      const longDescription = parseString(getPropertyValue(element, 'longDescription'));
      const caseStudySections = parseJsonLiteral(getPropertyValue(element, 'caseStudySections')) || [];
      const reproducibleWorkflow = parseJsonLiteral(getPropertyValue(element, 'reproducibleWorkflow')) || undefined;
      const keyFeatures = parseStringArray(getPropertyValue(element, 'keyFeatures'));
      const techStack = parseStringArray(getPropertyValue(element, 'techStack'));
      const links = parseLinks(getPropertyValue(element, 'links'));
      const aliases = parseStringArray(getPropertyValue(element, 'aliases'));
      const searchProfile = parseJsonLiteral(getPropertyValue(element, 'searchProfile')) || undefined;
      const projectKind = parseOptionalIdentifierString(getPropertyValue(element, 'projectKind'));
      const surfaceTags = parseStringArray(getPropertyValue(element, 'surfaceTags'));
      const createdAt = parseString(getPropertyValue(element, 'createdAt'));
      const topologySnapshot = parseString(getPropertyValue(element, 'topologySnapshot'));
      const mermaidDiagram = parseString(getPropertyValue(element, 'mermaidDiagram'));
      const benchmarks = parseBenchmarks(getPropertyValue(element, 'benchmarks'));
      const images = parseImages(getPropertyValue(element, 'images'), imageConstants);
      const thumbnail = parseThumbnail(getPropertyValue(element, 'thumbnail'), imageConstants);

      return {
        id,
        title,
        legacySlugs,
        aliases,
        searchProfile,
        description,
        longDescription,
        caseStudySections,
        reproducibleWorkflow,
        projectKind,
        surfaceTags,
        createdAt,
        repoFullName: parseString(getPropertyValue(element, 'repoFullName')) || undefined,
        repoId: parseJsonLiteral(getPropertyValue(element, 'repoId')) ?? undefined,
        hideImages: parseJsonLiteral(getPropertyValue(element, 'hideImages')) === true,
        keyFeatures,
        techStack,
        links,
        topologySnapshot,
        mermaidDiagram,
        benchmarks,
        images,
        thumbnail
      };
    });
};

const extractClawHubSnapshot = (sourceFile) => {
  let statsNode = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'CLAWHUB_DOWNLOAD_STATS') {
      if (node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
        statsNode = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (!statsNode) return DEFAULT_TRACTION_SNAPSHOT;

  const stats = statsNode.elements
    .filter((element) => ts.isObjectLiteralExpression(element))
    .map((element) => {
      const downloadsNode = getPropertyValue(element, 'downloads');
      const downloads = downloadsNode && ts.isNumericLiteral(downloadsNode) ? Number(downloadsNode.text) : 0;
      const checkedAt = parseString(getPropertyValue(element, 'checkedAt'));
      return { downloads, checkedAt };
    });

  if (stats.length === 0) return DEFAULT_TRACTION_SNAPSHOT;

  const checkedAtValues = stats
    .map((stat) => stat.checkedAt)
    .filter(Boolean)
    .sort();

  return {
    totalDownloads: stats.reduce((sum, stat) => sum + stat.downloads, 0),
    packageCount: stats.length,
    checkedAt: checkedAtValues[checkedAtValues.length - 1] || DEFAULT_TRACTION_SNAPSHOT.checkedAt
  };
};

const extractChromeExtensionStatsSnapshot = (sourceFile) => {
  let statsNode = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'CHROME_EXTENSION_STATS') {
      if (node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
        statsNode = node.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (!statsNode) {
    throw new Error('Could not find CHROME_EXTENSION_STATS object in constants.ts');
  }

  return parseJsonLiteral(statsNode);
};

const extractJsonVariable = (sourceFile, variableName, fallback) => {
  let match = null;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === variableName) {
      match = node.initializer || null;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  if (!match) return fallback;
  return parseJsonLiteral(match) ?? fallback;
};

const buildAliasMarkdown = (project, canonicalUrl) => {
  const markdown = buildMarkdown(project, canonicalUrl);
  const lines = markdown.split('\n');
  lines.splice(1, 0, '', '> Legacy project URL kept for compatibility. Use the canonical project link below.');
  return lines.join('\n');
};

const buildMarkdown = (project, markdownUrl) => {
  const title = toAscii(project.title);
  const description = toAscii(project.description);
  const longDescription = toAscii(project.longDescription);
  const keyFeatures = project.keyFeatures.map((item) => toAscii(item));
  const techStack = project.techStack.map((item) => toAscii(item));
  const links = project.links.map((link) => ({
    text: toAscii(link.text),
    url: link.url
  }));
  const benchmarks = (project.benchmarks || []).map((item) => ({
    label: toAscii(item.label),
    value: toAscii(item.value),
    context: toAscii(item.context)
  }));
  const topologySnapshot = toAsciiBlock(project.topologySnapshot);
  const mermaidDiagram = toAsciiBlock(project.mermaidDiagram);

  const lines = [`# ${title}`];
  if (description) {
    lines.push('', `> ${description}`);
  }
  const summary = longDescription && longDescription !== description ? longDescription : '';
  if (summary) {
    lines.push('', '## Summary', summary);
  }
  if (project.reproducibleWorkflow) {
    const workflow = project.reproducibleWorkflow;
    lines.push('', '## Run the included cases', toAscii(workflow.requirements));
    links.slice(0, 4).forEach((link) => lines.push(`- [${link.text}](${link.url})`));
    lines.push('');
    workflow.steps.forEach((step, index) => lines.push(`${index + 1}. ${toAscii(step)}`));
    if (workflow.command) lines.push('', '```sh', workflow.command, '```');
    if (workflow.expectedOutput) lines.push('', toAscii(workflow.expectedOutput));
  }
  for (const section of project.caseStudySections || []) {
    lines.push('', `## ${toAscii(section.title)}`, toAscii(section.body));
  }
  if (project.images?.length) {
    lines.push('', '## Project Figures');
    for (const asset of project.images) {
      if (!isDisplayImage(asset.url)) continue;
      lines.push('', `![${toAscii(asset.alt)}](${toPublicAssetUrl(asset.url)})`);
      if (asset.caption) lines.push('', toAscii(asset.caption));
    }
  }
  lines.push('', '## Project Link', markdownUrl);
  if (keyFeatures.length) {
    lines.push('', '## Key Features');
    keyFeatures.forEach((feature) => {
      lines.push(`- ${feature}`);
    });
  }
  if (techStack.length) {
    lines.push('', '## Tech Stack');
    techStack.forEach((item) => {
      lines.push(`- ${item}`);
    });
  }
  if (benchmarks.length) {
    lines.push('', '## Benchmarks & Analytics');
    benchmarks.forEach((item) => {
      const suffix = item.context ? ` (${item.context})` : '';
      lines.push(`- ${item.label}: ${item.value}${suffix}`);
    });
  }
  if (links.length) {
    lines.push('', '## Links');
    links.forEach((link) => {
      lines.push(`- [${link.text}](${link.url})`);
    });
  }
  if (mermaidDiagram) {
    lines.push('', '## Architecture Diagram', '```mermaid', mermaidDiagram, '```');
  }
  if (topologySnapshot) {
    lines.push('', '## Topology Snapshot', '```', topologySnapshot, '```');
  }
  lines.push('');
  return lines.join('\n');
};

const isCrawlerSafeSocialImage = (url) => /\.(?:avif|jpe?g|png|webp)(?:[?#].*)?$/i.test(url);
const isDisplayImage = (url) => /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(url);

const getProjectImageCandidates = (project) => [
  project.thumbnail,
  ...(project.images || []).map((image) => image.url)
];

const getExplicitProjectSocialImage = (project) => {
  return getProjectImageCandidates(project).map(toPublicAssetUrl).find(isCrawlerSafeSocialImage) || '';
};

const getProjectSocialImage = (project) => getExplicitProjectSocialImage(project) || project.generatedSocialImage || '';

const getProjectVisualImage = (project) => {
  return getProjectImageCandidates(project).map(toPublicAssetUrl).find(isDisplayImage) || project.generatedSocialImage || '';
};

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const projectSocialImageUrlFromSlug = (slug) => `${PROJECT_SOCIAL_IMAGE_URL_BASE}/${slug}.png`;

const pathExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const getSocialImageType = (url) => {
  const extension = String(url || '').match(/\.([a-z0-9]+)(?:[?#].*)?$/i)?.[1]?.toLowerCase();
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'avif') return 'image/avif';
  return '';
};

const wrapCanvasLines = (ctx, text, maxWidth, maxLines) => {
  const words = toAscii(text).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (current && lines.length < maxLines) lines.push(current);

  if (words.length && lines.length === maxLines) {
    const consumed = lines.join(' ').split(/\s+/).length;
    if (consumed < words.length) {
      let lastLine = lines[maxLines - 1];
      while (lastLine.length > 0 && ctx.measureText(`${lastLine}...`).width > maxWidth) {
        lastLine = lastLine.replace(/\s+\S*$/, '').trim() || lastLine.slice(0, -1).trim();
      }
      lines[maxLines - 1] = `${lastLine || words[consumed - 1].slice(0, 12)}...`;
    }
  }

  return lines;
};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight, maxLines) => {
  const lines = wrapCanvasLines(ctx, text, maxWidth, maxLines);
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const createProjectSocialCard = async (project, outputPath) => {
  const hash = hashString(project.slug || project.title || 'project');
  const palettes = [
    { bg: '#071019', panel: '#0f2330', accent: '#39d0b5', accent2: '#f4b44d' },
    { bg: '#10131b', panel: '#202938', accent: '#71c7ec', accent2: '#f47174' },
    { bg: '#0b1614', panel: '#17302a', accent: '#7ddc91', accent2: '#e6c15a' },
    { bg: '#17120f', panel: '#2b211b', accent: '#67d4f0', accent2: '#f08f62' },
    { bg: '#0d1321', panel: '#1e2c45', accent: '#8bd17c', accent2: '#efbf5a' }
  ];
  const palette = palettes[hash % palettes.length];
  const canvas = createCanvas(PROJECT_SOCIAL_IMAGE_WIDTH, PROJECT_SOCIAL_IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');
  const width = PROJECT_SOCIAL_IMAGE_WIDTH;
  const height = PROJECT_SOCIAL_IMAGE_HEIGHT;
  ctx.textBaseline = 'top';

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.bg);
  gradient.addColorStop(1, '#06080c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  for (let x = 72; x < width; x += 96) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 180, height);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  drawRoundedRect(ctx, 72, 72, 1056, 486, 34);
  ctx.fillStyle = palette.panel;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = palette.accent;
  drawRoundedRect(ctx, 106, 108, 148, 8, 4);
  ctx.fill();

  const tags = [...(project.surfaceTags || []), ...(project.techStack || [])]
    .map(toAscii)
    .filter(Boolean)
    .slice(0, 4);
  ctx.font = '700 30px Inter, Arial, sans-serif';
  ctx.fillStyle = palette.accent;
  ctx.fillText('Zakhar Pashkin Portfolio', 106, 142);

  ctx.font = '800 66px Inter, Arial, sans-serif';
  ctx.fillStyle = '#f8fafc';
  const titleBottom = drawWrappedText(ctx, project.title, 106, 198, 760, 74, 3);

  ctx.font = '400 31px Inter, Arial, sans-serif';
  ctx.fillStyle = '#cbd5df';
  const descriptionLineLimit = titleBottom > 390 ? 1 : titleBottom > 340 ? 2 : 3;
  const descriptionBottom = drawWrappedText(
    ctx,
    project.description || project.longDescription || 'Public portfolio case study',
    106,
    titleBottom + 28,
    750,
    42,
    descriptionLineLimit
  );

  const rightX = 896;
  const rightY = 148;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 4; row += 1) {
    drawRoundedRect(ctx, rightX, rightY + row * 76, 178, 48, 14);
    ctx.stroke();
    ctx.fillStyle = row % 2 === 0 ? palette.accent : palette.accent2;
    ctx.beginPath();
    ctx.arc(rightX + 28, rightY + row * 76 + 24, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    drawRoundedRect(ctx, rightX + 48, rightY + row * 76 + 17, 84 + ((hash >> row) % 32), 8, 4);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  drawRoundedRect(ctx, rightX - 28, 438, 232, 74, 20);
  ctx.fill();
  ctx.strokeStyle = palette.accent2;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(rightX + 88, 475, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(rightX + 88, 475, 8, 0, Math.PI * 2);
  ctx.fill();

  let tagX = 106;
  const tagY = Math.min(Math.max(496, descriptionBottom + 18), 518);
  ctx.font = '700 22px Inter, Arial, sans-serif';
  for (const tag of tags) {
    const label = tag.length > 28 ? `${tag.slice(0, 25)}...` : tag;
    const tagWidth = Math.min(ctx.measureText(label).width + 34, 260);
    drawRoundedRect(ctx, tagX, tagY, tagWidth, 40, 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.fill();
    ctx.fillStyle = '#e8edf3';
    ctx.fillText(label, tagX + 17, tagY + 10);
    tagX += tagWidth + 12;
    if (tagX > 760) break;
  }

  ctx.font = '600 22px Inter, Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
  ctx.fillText(`zack-dev-cm.github.io/projects/${project.slug}/`, 106, 574);

  await fs.writeFile(outputPath, canvas.toBuffer('image/png'));
};

const buildProjectHtml = (project) => {
  const title = toAscii(project.title);
  const description = toAscii(project.description || project.longDescription || `${title} case study by ${AUTHOR_NAME}.`);
  const longDescription = toAscii(project.longDescription);
  const canonicalUrl = project.htmlUrl;
  const markdownUrl = project.markdownUrl;
  const metaSuffix = `${AUTHOR_NAME} case study.`;
  const metaDescription =
    description.length + metaSuffix.length + 1 <= 160
      ? `${description} ${metaSuffix}`
      : `${description.slice(0, 157).replace(/\s+\S*$/, '').replace(/[,:;.-]+$/, '')}.`;
  const keyFeatures = (project.keyFeatures || []).map(toAscii).filter(Boolean);
  const techStack = (project.techStack || []).map(toAscii).filter(Boolean);
  const benchmarks = (project.benchmarks || []).map((item) => ({
    label: toAscii(item.label),
    value: toAscii(item.value),
    context: toAscii(item.context)
  }));
  const links = (project.links || []).map((link) => ({
    text: toAscii(link.text),
    url: link.url
  }));
  const socialImage = getProjectSocialImage(project);
  const visualImage = getProjectVisualImage(project);
  const socialImageType = getSocialImageType(socialImage);
  const isGeneratedSocialImage = Boolean(project.generatedSocialImage && socialImage === project.generatedSocialImage);
  const visualAsset = (project.images || []).find((image) => toPublicAssetUrl(image.url) === visualImage);
  const imageAlt = toAscii(visualAsset?.alt || `${title} project visual`);
  const isIllustration = visualImage === project.generatedSocialImage || /generated|conceptual|illustration|public-safe.*card/i.test(imageAlt);
  const visualCaption = toAscii(visualAsset?.caption || (isIllustration ? 'System illustration' : ''));
  const galleryAssets = (project.images || []).filter((asset) =>
    isDisplayImage(asset.url) && toPublicAssetUrl(asset.url) !== visualImage
  );
  const renderFigure = (asset, index) => {
    const publicUrl = toPublicAssetUrl(asset.url);
    const url = publicUrl.startsWith(`${SITE_BASE}/`) ? new URL(publicUrl).pathname : publicUrl;
    const caption = toAscii(asset.caption || (/generated|conceptual|illustration/i.test(asset.alt) ? 'Conceptual illustration.' : ''));
    return `<figure><a class="figure-link" href="${escapeHtml(url)}" aria-label="Open full-size figure ${index + 1}: ${escapeHtml(toAscii(asset.alt))}"><img class="visual" src="${escapeHtml(url)}" alt="${escapeHtml(toAscii(asset.alt))}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" /><span class="image-action" aria-hidden="true">Open full size ↗</span></a>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}</figure>`;
  };
  const narrativeSections = (project.caseStudySections || []).map((section) =>
    `<section><h2>${escapeHtml(toAscii(section.title))}</h2><p>${escapeHtml(toAscii(section.body))}</p></section>`
  ).join('\n');
  const workflow = project.reproducibleWorkflow;
  const workflowActions = workflow
    ? `<nav class="research-actions" aria-label="Research workflow actions">${links.slice(0, 4).map((link, index) => `<a class="research-action${index === 0 ? ' research-action--primary' : ''}" href="${escapeHtml(link.url)}">${escapeHtml(link.text)}</a>`).join('')}<a class="research-action" href="#run-cases">Run the cases</a></nav>`
    : '';
  const workflowSection = workflow
    ? `<section id="run-cases" class="research-quickstart" aria-labelledby="run-cases-title"><h2 id="run-cases-title">Run the included cases</h2><p>${escapeHtml(toAscii(workflow.requirements))}</p><ol>${workflow.steps.map((step) => `<li>${escapeHtml(toAscii(step))}</li>`).join('')}</ol>${workflow.command ? `<pre tabindex="0" aria-label="Reproduction command"><code>${escapeHtml(workflow.command)}</code></pre>` : ''}${workflow.expectedOutput ? `<p>${escapeHtml(toAscii(workflow.expectedOutput))}</p>` : ''}</section>`
    : '';
  const workflowResults = workflow && benchmarks.length
    ? `<section aria-labelledby="case-results-title"><h2 id="case-results-title">Recomputed case results</h2><table class="research-results"><caption>Selected results from the included article cases; see the report for methods and source locations.</caption><thead><tr><th scope="col">Question</th><th scope="col">Result and scope</th></tr></thead><tbody>${benchmarks.map((item) => `<tr><th scope="row">${escapeHtml(item.label)}</th><td><strong>${escapeHtml(item.value)}</strong>${item.context ? `<p>${escapeHtml(item.context)}</p>` : ''}</td></tr>`).join('')}</tbody></table></section>`
    : '';
  const socialImageMeta = socialImage
    ? [
        `    <meta property="og:image" content="${socialImage}" />`,
        ...(isGeneratedSocialImage
          ? [
              `    <meta property="og:image:width" content="${PROJECT_SOCIAL_IMAGE_WIDTH}" />`,
              `    <meta property="og:image:height" content="${PROJECT_SOCIAL_IMAGE_HEIGHT}" />`
            ]
          : []),
        ...(socialImageType ? [`    <meta property="og:image:type" content="${socialImageType}" />`] : []),
        `    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
        `    <meta name="twitter:image" content="${socialImage}" />`,
        `    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`
      ].join('\n')
    : '';
  const keywords = [...(project.surfaceTags || []), ...techStack].map(toAscii).filter(Boolean).slice(0, 16);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${canonicalUrl}#case-study`,
    headline: title,
    name: title,
    description,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_BASE
    },
    creator: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_BASE
    },
    genre: project.projectKind || 'case-study',
    keywords: keywords.join(', '),
    image: socialImage || undefined,
    isAccessibleForFree: true,
    about: keywords.map((keyword) => ({ '@type': 'Thing', name: keyword })),
    workExample: links.slice(0, 3).map((link) => ({
      '@type': 'CreativeWork',
      name: link.text,
      url: link.url
    }))
  };
  const featureList = keyFeatures.length
    ? keyFeatures.map((feature) => `        <li>${escapeHtml(feature)}</li>`).join('\n')
    : '        <li>Public case-study summary, implementation notes, and release context.</li>';
  const techList = techStack.length
    ? techStack.map((item) => `        <li>${escapeHtml(item)}</li>`).join('\n')
    : '        <li>Project-specific stack listed in the full portfolio.</li>';
  const benchmarkList = benchmarks.length
    ? benchmarks
        .map((item) => {
          const context = item.context ? ` <span>${escapeHtml(item.context)}</span>` : '';
          return `        <li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}${context}</li>`;
        })
        .join('\n')
    : '';
  const linkList = links.length
    ? links
        .map((link) => `        <li><a href="${escapeHtml(link.url)}">${escapeHtml(link.text)}</a></li>`)
        .join('\n')
    : '        <li><a href="https://zack-dev-cm.github.io/">Return to the portfolio overview</a></li>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | ${escapeHtml(AUTHOR_NAME)} Case Study</title>
    <meta name="description" content="${escapeHtml(metaDescription)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" type="text/markdown" href="${markdownUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
${socialImageMeta}
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 6)}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/docs/case-studies.css" />
  </head>
  <body>
    <a class="skip-link" href="#case-content">Skip to case study</a>
    <div class="case-header-wrap">
      <header class="case-header">
        <a class="case-brand" href="${SITE_BASE}/" aria-label="Zakhar Pashkin portfolio"><strong>zp<span>.</span></strong><span>Zakhar Pashkin</span></a>
        <nav aria-label="Portfolio navigation"><a href="${SITE_BASE}/#featured">Work</a><a href="${RESUME_URL}">Resume</a><a href="mailto:${CONTACT_EMAIL}">Contact ↗</a></nav>
      </header>
    </div>
    <main id="case-content">
      <a class="back" href="${SITE_BASE}/#featured">← Selected work</a>
      <article>
        <header class="hero">
          <p class="eyebrow">${escapeHtml(({ research: 'Research & development', 'user-product': project.id === 11 ? 'Maintained service' : 'Product', 'open-source': 'Open source', 'case-study': 'Case study' })[project.projectKind] || 'Portfolio project')}</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="lede">${escapeHtml(description)}</p>${workflowActions ? `\n          ${workflowActions}` : ''}
          ${visualImage ? renderFigure({ url: visualImage, alt: imageAlt, caption: visualCaption }, 0) : ''}
        </header>
        <section>
          <h2>Overview</h2>
          <p>${escapeHtml(longDescription || description)}</p>
        </section>${workflowResults ? `\n        ${workflowResults}` : ''}${workflowSection ? `\n        ${workflowSection}` : ''}
        ${narrativeSections}
        ${galleryAssets.length ? `<section aria-label="Additional project figures"><h2>Project figures</h2><div class="figure-gallery">${galleryAssets.map((asset, index) => renderFigure(asset, index + 1)).join('')}</div></section>` : ''}
        <section>
          <h2>What It Covers</h2>
          <ul>
${featureList}
          </ul>
        </section>
        <section>
          <h2>Stack And Topics</h2>
          <ul class="stack">
${techList}
          </ul>
        </section>
        ${benchmarks.length && !workflow ? `<section>
          <h2>Public Signals</h2>
          <ul>
${benchmarkList}
          </ul>
        </section>` : ''}
        <section>
          <h2>References</h2>
          <ul>
${linkList}
            <li><a href="${markdownUrl}">Plain-text case study</a></li>
          </ul>
        </section>
        <p class="footer"><a href="${SITE_BASE}/#featured">More selected work</a><a href="${RESUME_URL}">Download resume</a><a href="mailto:${CONTACT_EMAIL}">Contact Zakhar ↗</a></p>
      </article>
    </main>
  </body>
</html>
`;
};

const formatFocusAreaLine = (area) => {
  const examples = area.canonicalUrls.map((url, index) => `[${area.references[index]}](${url})`).join(', ');
  return `- **${area.name}:** ${area.description} Examples: ${examples}.`;
};

const formatBenchmarkLine = (benchmark) => {
  const label = toAscii(benchmark?.label);
  const value = toAscii(benchmark?.value);
  if (!label || !value) return '';
  const context = toAscii(benchmark?.context);
  return context ? `${label}: ${value} (${context})` : `${label}: ${value}`;
};

const buildProjectReferenceLine = (project) => {
  const features = (project.keyFeatures || []).map(toAscii).filter(Boolean).slice(0, 2);
  const firstBenchmark = project.benchmarks?.map(formatBenchmarkLine).find(Boolean);
  const parts = [...features];
  if (firstBenchmark) {
    parts.push(firstBenchmark);
  }
  return parts.join(' | ');
};

const formatLinkLine = (title, url, description) => {
  return `- [${toAscii(title)}](${url}): ${toAscii(description)}`;
};

const formatTopProjectLine = (project) => {
  return formatLinkLine(
    project.title,
    projectSearchUrl(project),
    project.description || project.longDescription || 'Project detail page.'
  );
};

const pickClusterProjects = (projects, cluster, limit = 6) => {
  const tagSet = new Set(cluster.tags);
  return projects
    .filter((project) => (project.surfaceTags || []).some((tag) => tagSet.has(tag)))
    .slice(0, limit);
};

const buildStaticHomeSnapshot = (projects, topProjects) => {
  const featuredMarkup = topProjects.map((project) => {
    const title = escapeHtml(toAscii(project.title));
    const description = escapeHtml(toAscii(project.description || project.longDescription || 'Project summary.'));
    const links = (project.links || []).slice(0, 2)
      .map((link) => `<a href="${link.url}">${escapeHtml(toAscii(link.text))}</a>`).join(' · ');
    return [
      '      <article class="crawlable-shell__card">',
      `        <h3><a href="${projectSearchUrl(project)}">${title}</a></h3>`,
      `        <p>${description}</p>`,
      links ? `        <p>${links}</p>` : '',
      '      </article>'
    ].filter(Boolean).join('\n');
  });
  const focusMarkup = FOCUS_AREAS.map((area) => [
    `      <article id="${area.id}" class="crawlable-shell__card">`,
    `        <h3>${escapeHtml(area.name)}</h3>`,
    `        <p>${escapeHtml(area.description)}</p>`,
    '      </article>'
  ].join('\n'));
  const archiveMarkup = projects.map((project) =>
    `      <li><a href="${projectSearchUrl(project)}">${escapeHtml(toAscii(project.title))}</a>: ${escapeHtml(toAscii(project.description || 'Project summary.'))}</li>`
  );
  return [
    '<main class="crawlable-shell" aria-label="Portfolio">',
    `  <p class="crawlable-shell__eyebrow">${escapeHtml(AUTHOR_TITLE)}</p>`,
    '  <h1>Zakhar Pashkin</h1>',
    `  <p class="crawlable-shell__lede">${escapeHtml(PORTFOLIO_TAGLINE)}</p>`,
    `  <p>${escapeHtml(AUTHOR_DESCRIPTION)}</p>`,
    '  <div class="crawlable-shell__actions">',
    `    <a href="${RESUME_URL}">Download resume PDF</a>`,
    `    <a href="${RESUME_HTML_URL}">Read resume</a>`,
    `    <a href="mailto:${CONTACT_EMAIL}">Email Zakhar</a>`,
    '    <a href="https://github.com/zack-dev-cm">GitHub</a>',
    `    <a href="${LINKEDIN_URL}">LinkedIn</a>`,
    '  </div>',
    '  <section id="featured" class="crawlable-shell__section">',
    '    <h2>Selected work</h2>',
    '    <div class="crawlable-shell__cards">',
    ...featuredMarkup,
    '    </div>',
    '  </section>',
    '  <section id="about" class="crawlable-shell__section">',
    '    <h2>Research depth. Engineering follow-through.</h2>',
    '    <div class="crawlable-shell__cards">',
    ...focusMarkup,
    '    </div>',
    `    <p>${escapeHtml(PRIMARY_STACK_LINE)}</p>`,
    '  </section>',
    '  <section id="projects" class="crawlable-shell__section">',
    '    <h2>Project archive</h2>',
    '    <ul class="crawlable-shell__link-list">',
    ...archiveMarkup,
    '    </ul>',
    '  </section>',
    '  <section id="contact" class="crawlable-shell__section">',
    '    <h2>Contact and further reading</h2>',
    '    <ul class="crawlable-shell__contact">',
    `      <li><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></li>`,
    `      <li><a href="${RESUME_URL}">Resume PDF</a></li>`,
    `      <li><a href="${LINKEDIN_URL}">LinkedIn</a></li>`,
    `      <li><a href="${PAPER_REVIEWS_URL}">Research notes</a></li>`,
    `      <li><a href="${SITE_BASE}/llms.txt">Text portfolio summary</a></li>`,
    '    </ul>',
    '  </section>',
    '</main>'
  ].join('\n');
};

const updateIndexHtml = async (staticSnapshot, today, schemaJsonldContent, projectCount) => {
  const template = await fs.readFile(INDEX_HTML_PATH, 'utf8');
  const snapshotPattern = new RegExp(
    `${escapeRegExp(INDEX_SNAPSHOT_START)}[\\s\\S]*?${escapeRegExp(INDEX_SNAPSHOT_END)}`,
    'm'
  );
  const schemaPattern = /    <script type="application\/ld\+json">\n[\s\S]*?\n    <\/script>/m;

  if (!snapshotPattern.test(template)) {
    throw new Error('index.html is missing static snapshot markers.');
  }
  if (!schemaPattern.test(template)) {
    throw new Error('index.html is missing the inline JSON-LD script.');
  }

  const snapshotBlock = `${INDEX_SNAPSHOT_START}\n${staticSnapshot}\n      ${INDEX_SNAPSHOT_END}`;
  const inlineSchema = schemaJsonldContent
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n');
  const schemaBlock = `    <script type="application/ld+json">\n${inlineSchema}\n    </script>`;
  const tractionLabel = `${formatInteger(tractionSnapshot.totalDownloads)} tracked ClawHub downloads`;
  const metaDescription = SOCIAL_DESCRIPTION;
  const aiSummary = AUTHOR_DESCRIPTION;
  const updated = template
    .replace(snapshotPattern, snapshotBlock)
    .replace(schemaPattern, schemaBlock)
    .replace(/<title>[^<]*<\/title>/, `<title>${SITE_TITLE}</title>`)
    .replace(/<meta name="theme-color" content="[^"]*" \/>/, '<meta name="theme-color" content="#090c10" />')
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${metaDescription}" />`)
    .replace(/\n\s*<meta name="keywords" content="[^"]*" \/>/, '')
    .replace(/<meta name="ai-summary" content="[^"]*" \/>/, `<meta name="ai-summary" content="${aiSummary}" />`)
    .replace(/<meta name="citation_title" content="[^"]*" \/>/, `<meta name="citation_title" content="${SITE_TITLE}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${SITE_TITLE}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${SOCIAL_DESCRIPTION}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${SOCIAL_IMAGE_URL}" />`)
    .replace(/<meta property="og:image:height" content="[^"]*" \/>/, '<meta property="og:image:height" content="630" />')
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${SOCIAL_IMAGE_ALT}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${SITE_TITLE}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${SOCIAL_DESCRIPTION}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${SOCIAL_IMAGE_URL}" />`)
    .replace(/<meta name="twitter:image:alt" content="[^"]*" \/>/, `<meta name="twitter:image:alt" content="${SOCIAL_IMAGE_ALT}" />`)
    .replace(/"dateModified":\s*"[^"]+"/, `"dateModified": "${today}"`);

  await fs.writeFile(INDEX_HTML_PATH, updated, 'utf8');
};

const updateMetadataJson = async (projectCount) => {
  const existing = JSON.parse(await fs.readFile(METADATA_PATH, 'utf8'));
  const description =
    SOCIAL_DESCRIPTION;
  const updated = {
    ...existing,
    name: SITE_TITLE,
    description
  };
  await fs.writeFile(METADATA_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
};

const buildLlms = (projects, topProjects) => [
  `# ${SITE_NAME}`,
  '',
  `> ${AUTHOR_DESCRIPTION}`,
  '',
  `Role: ${AUTHOR_TITLE}`,
  `Portfolio: ${SITE_BASE}/`,
  `Updated: ${new Date().toISOString().split('T')[0]}`,
  '',
  '## Selected projects',
  ...topProjects.map(formatTopProjectLine),
  '',
  '## Focus',
  ...FOCUS_AREAS.map(formatFocusAreaLine),
  '',
  '## Resume and contact',
  formatLinkLine('Resume PDF', RESUME_URL, 'Current Senior ML Engineer resume.'),
  formatLinkLine('Resume HTML', RESUME_HTML_URL, 'Readable experience and project summary.'),
  formatLinkLine('Email', `mailto:${CONTACT_EMAIL}`, 'Professional inquiries.'),
  formatLinkLine('GitHub', 'https://github.com/zack-dev-cm', 'Public repositories and released tools.'),
  formatLinkLine('LinkedIn', LINKEDIN_URL, 'Professional profile.'),
  '',
  '## More project context',
  formatLinkLine('Project archive', `${SITE_BASE}/#projects`, 'Browse the broader body of work.'),
  formatLinkLine('Full project text', `${SITE_BASE}/llms-full.txt`, 'Descriptions, implementation context and proof links for the project archive.'),
  formatLinkLine('Project index', `${SITE_BASE}/geo.txt`, 'A text index of canonical case-study pages.'),
  formatLinkLine('Research notes', PAPER_REVIEWS_URL, 'Applied ML paper reviews with source links.'),
  formatLinkLine('Project data', DISCOVERY_FILE_URL, 'Structured project descriptions and public links.'),
  '',
  'Use the linked case studies for project scope and status. Product and package links show released work; prototype and R&D work should retain those descriptions.',
  ''
].join('\n');

const buildGeo = (projects) => {
  const formatBenchmarksInline = (benchmarks) => {
    return (benchmarks || [])
      .map((item) => {
        if (!item?.label || !item?.value) return '';
        const context = item.context ? ` (${item.context})` : '';
        return `${item.label}: ${item.value}${context}`;
      })
      .filter(Boolean)
      .join('; ');
  };
  const buildGeoDescription = (project) => {
    const base = (project.description || project.longDescription || 'Project detail page.').trim();
    const benchmarkLine = formatBenchmarksInline(project.benchmarks);
    if (!benchmarkLine) return base;
    const normalizedBase = base.replace(/[.!?]+$/, '');
    return `${normalizedBase}. Benchmarks: ${benchmarkLine}.`;
  };
  const lines = [
    '# Zakhar Pashkin - Project Index',
    '',
    `Entity: ${AUTHOR_NAME}`,
    `Role: ${AUTHOR_TITLE}`,
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Topics: ${KNOWS_ABOUT.join(', ')}`,
    '',
    `Summary: ${AUTHOR_DESCRIPTION}`,
    '',
    '## Projects',
    ...projects.map((project) =>
      formatLinkLine(
        project.title,
        projectSearchUrl(project),
        buildGeoDescription(project)
      )
    ),
    ''
  ];

  return lines.join('\n');
};

const buildLlmsFull = (projects, topProjects) => {
  const lines = [
    '# Zakhar Pashkin - Applied Machine Learning Project Details',
    '',
    `Summary: ${AUTHOR_DESCRIPTION}`,
    `Role: ${AUTHOR_TITLE}`,
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Agent discovery manifest: ${DISCOVERY_FILE_URL}`,
    `Topics: ${KNOWS_ABOUT.join(', ')}`,
    '',
    '## Focus',
    ...FOCUS_AREAS.map(formatFocusAreaLine),
    '',
    '## Research Review Feed',
    `${formatPaperReviewSummary()} Human page: ${PAPER_REVIEWS_URL}. Machine feed: ${PAPER_REVIEWS_DATA_URL}.`,
    ...paperReviewSnapshot.latest.map((review) => {
      const tags = review.tags.length ? ` Tags: ${review.tags.join(', ')}.` : '';
      const arxiv = review.arxivId ? ` arXiv: ${review.arxivId}.` : '';
      const url = review.paperUrl || PAPER_REVIEWS_URL;
      return `- ${review.title}.${arxiv}${tags} Source: ${url}`;
    }),
    '',
    '## Selected projects',
    ...topProjects.map(formatTopProjectLine),
    '',
    '## Projects (Full Details)',
    ...projects.flatMap((project) => {
      const title = toAscii(project.title);
      const description = toAscii(project.description);
      const longDescription = toAscii(project.longDescription);
      const keyFeatures = project.keyFeatures.map((item) => toAscii(item)).filter(Boolean);
      const techStack = project.techStack.map((item) => toAscii(item)).filter(Boolean);
      const benchmarks = (project.benchmarks || []).map((item) => ({
        label: toAscii(item.label),
        value: toAscii(item.value),
        context: toAscii(item.context)
      }));
      const links = project.links.map((link) => ({
        text: toAscii(link.text),
        url: link.url
      }));

      const block = [`### ${title}`];
      if (description) block.push(`Summary: ${description}`);
      if (longDescription && longDescription !== description) block.push(`Details: ${longDescription}`);
      block.push(`Project URL: ${projectSearchUrl(project)}`);
      if (project.markdownUrl) block.push(`Markdown URL: ${project.markdownUrl}`);
      if (keyFeatures.length) {
        block.push('Key Features:');
        keyFeatures.forEach((feature) => block.push(`- ${feature}`));
      }
      if (techStack.length) {
        block.push('Tech Stack:');
        techStack.forEach((item) => block.push(`- ${item}`));
      }
      if (benchmarks.length) {
        block.push('Benchmarks & Analytics:');
        benchmarks.forEach((item) => {
          const suffix = item.context ? ` (${item.context})` : '';
          block.push(`- ${item.label}: ${item.value}${suffix}`);
        });
      }
      if (links.length) {
        block.push('Links:');
        links.forEach((link) => block.push(`- ${link.text}: ${link.url}`));
      }
      block.push('');
      return block;
    })
  ];

  return lines.join('\n');
};

const buildAgentContext = (projects, topProjects) => [
  '# Zakhar Pashkin - Portfolio Context',
  '',
  AUTHOR_DESCRIPTION,
  '',
  `Role: ${AUTHOR_TITLE}`,
  `Portfolio: ${SITE_BASE}/`,
  `Contact: mailto:${CONTACT_EMAIL}`,
  '',
  '## Focus',
  ...FOCUS_AREAS.map(formatFocusAreaLine),
  '',
  '## Selected projects',
  ...topProjects.map(formatTopProjectLine),
  '',
  '## Further reading',
  formatLinkLine('Resume PDF', RESUME_URL, 'Current resume.'),
  formatLinkLine('Resume HTML', RESUME_HTML_URL, 'Experience and project summary.'),
  formatLinkLine('Project data', DISCOVERY_FILE_URL, 'Structured public project information.'),
  formatLinkLine('Full project text', `${SITE_BASE}/llms-full.txt`, 'Project scope, implementation context and proof links.'),
  formatLinkLine('Research notes', PAPER_REVIEWS_URL, 'Applied ML paper reviews.'),
  '',
  'For each project, use its canonical HTML page for the case study and its public links for product, package or repository evidence. Preserve the stated scope of R&D and prototype work.',
  ''
].join('\n');

const buildAgentDiscovery = (projects, topProjects) => {
  const today = new Date().toISOString().split('T')[0];
  const projectSummary = (project) => ({
    id: project.id,
    title: toAscii(project.title),
    url: projectSearchUrl(project),
    markdownUrl: projectReferenceUrl(project),
    summary: toAscii(project.description || project.longDescription || 'Project detail page.'),
    kind: project.projectKind || 'case-study',
    tags: project.surfaceTags || [],
    aliases: project.aliases || [],
    techStack: (project.techStack || []).map(toAscii).filter(Boolean),
    benchmarks: (project.benchmarks || []).map((benchmark) => ({
      label: toAscii(benchmark.label),
      value: toAscii(benchmark.value),
      context: toAscii(benchmark.context)
    })),
    links: (project.links || []).map((link) => ({
      label: toAscii(link.text),
      url: link.url
    }))
  });

  return JSON.stringify(
    {
      schemaVersion: '2026-09-05',
      generatedAt: today,
      entity: {
        name: AUTHOR_NAME,
        role: AUTHOR_TITLE,
        description: AUTHOR_DESCRIPTION,
        primaryUrl: `${SITE_BASE}/`,
        contact: `mailto:${CONTACT_EMAIL}`,
        sameAs: AUTHOR_SAME_AS,
        knowsAbout: KNOWS_ABOUT
      },
      discoveryPolicy: {
        preferredCitationOrder: [`${SITE_BASE}/`, ...topProjects.map(projectSearchUrl), RESUME_HTML_URL, PAPER_REVIEWS_URL],
        projectCitationRule: 'Use the concrete project HTML URLs listed in allProjects and canonicalProjects. Use markdownUrl only when an agent needs a compact Markdown version.',
        publicReferencesOnly: true,
        note:
          'Use only listed public URLs, generated project HTML pages, generated Markdown alternates, schema.jsonld, and agent-discovery.json as citations. Service endpoints and source artifacts outside this portfolio are not part of the public reference set.'
      },
      entrypoints: [
        { label: 'Agent discovery manifest', url: DISCOVERY_FILE_URL, mediaType: 'application/json' },
        { label: 'Portfolio home', url: `${SITE_BASE}/`, mediaType: 'text/html' },
        { label: 'LLM compact index', url: `${SITE_BASE}/llms.txt`, mediaType: 'text/plain' },
        { label: 'Full project text', url: `${SITE_BASE}/llms-full.txt`, mediaType: 'text/plain' },
        { label: 'Project index', url: `${SITE_BASE}/geo.txt`, mediaType: 'text/plain' },
        { label: 'Agent context', url: `${SITE_BASE}/agent-context.md`, mediaType: 'text/markdown' },
        { label: 'Structured data graph', url: `${SITE_BASE}/schema.jsonld`, mediaType: 'application/ld+json' },
        { label: 'Sitemap', url: `${SITE_BASE}/sitemap.xml`, mediaType: 'application/xml' },
        { label: 'ML paper reviews', url: PAPER_REVIEWS_URL, mediaType: 'text/html' },
        { label: 'Paper review data feed', url: PAPER_REVIEWS_DATA_URL, mediaType: 'application/json' },
        { label: 'Resume PDF', url: RESUME_URL, mediaType: 'application/pdf' },
        { label: 'Resume HTML', url: RESUME_HTML_URL, mediaType: 'text/html' }
      ],
      focusAreas: FOCUS_AREAS,
      paperReviews: {
        title: paperReviewSnapshot.title,
        url: PAPER_REVIEWS_URL,
        dataUrl: PAPER_REVIEWS_DATA_URL,
        reviewCount: paperReviewSnapshot.reviewCount,
        updatedAt: paperReviewSnapshot.updatedAt,
        summary: formatPaperReviewSummary(),
        latest: paperReviewSnapshot.latest
      },
      topicalClusters: TOPICAL_CLUSTERS.map((cluster) => ({
        ...cluster,
        canonicalProjects: pickClusterProjects(projects, cluster, 8).map(projectSummary)
      })),
      featuredProjects: topProjects.map(projectSummary),
      allProjects: projects.map(projectSummary)
    },
    null,
    2
  );
};

const buildSchemaJsonld = (projects, topProjects) => {
  const today = new Date().toISOString().split('T')[0];
  const graph = [
    {
      '@type': 'Person',
      '@id': `${SITE_BASE}/#zakhar-pashkin`,
      name: AUTHOR_NAME,
      alternateName: ['Zack Pashkin', 'zack-dev-cm', 'Zackdevcv'],
      jobTitle: AUTHOR_TITLE,
      worksFor: { '@type': 'Organization', name: 'Riverstart' },
      url: `${SITE_BASE}/`,
      email: `mailto:${CONTACT_EMAIL}`,
      description: AUTHOR_DESCRIPTION,
      image: SOCIAL_IMAGE_URL,
      sameAs: AUTHOR_SAME_AS,
      knowsAbout: KNOWS_ABOUT,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: CONTACT_EMAIL,
          contactType: 'professional inquiries',
          availableLanguage: ['en', 'ru']
        }
      ],
      mainEntityOfPage: { '@id': `${SITE_BASE}/#webpage` },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Senior Machine Learning Engineer',
        skills: KNOWS_ABOUT.join(', ')
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_BASE}/#website`,
      name: SITE_NAME,
      alternateName: `${AUTHOR_NAME} AI and Computer Vision Portfolio`,
      url: `${SITE_BASE}/`,
      description: SOCIAL_DESCRIPTION,
      inLanguage: 'en',
      keywords: KNOWS_ABOUT.join(', '),
      publisher: { '@id': `${SITE_BASE}/#zakhar-pashkin` }
    },
    {
      '@type': ['WebPage', 'ProfilePage'],
      '@id': `${SITE_BASE}/#webpage`,
      url: `${SITE_BASE}/`,
      name: SITE_TITLE,
      description: SOCIAL_DESCRIPTION,
      inLanguage: 'en',
      dateModified: today,
      isPartOf: { '@id': `${SITE_BASE}/#website` },
      about: { '@id': `${SITE_BASE}/#zakhar-pashkin` },
      mainEntity: { '@id': `${SITE_BASE}/#zakhar-pashkin` },
      keywords: KNOWS_ABOUT.join(', '),
      significantLink: [RESUME_URL, RESUME_HTML_URL, ...topProjects.map(projectSearchUrl), PAPER_REVIEWS_URL],
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: SOCIAL_IMAGE_URL,
        caption: SOCIAL_IMAGE_ALT
      },
      breadcrumb: { '@id': `${SITE_BASE}/#breadcrumb` }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_BASE}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Portfolio',
          item: `${SITE_BASE}/`
        }
      ]
    },
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_BASE}/papers/#webpage`,
      url: PAPER_REVIEWS_URL,
      name: 'ML Papers, Read for Builders',
      description: formatPaperReviewSummary(),
      inLanguage: 'en',
      dateModified: paperReviewSnapshot.updatedAt || today,
      isPartOf: { '@id': `${SITE_BASE}/#website` },
      about: paperReviewSnapshot.latest
        .map((review) => ({
          '@type': 'ScholarlyArticle',
          name: review.title,
          url: review.paperUrl || PAPER_REVIEWS_URL,
          identifier: review.arxivId || undefined,
          keywords: review.tags.join(', ')
        }))
        .filter((review) => review.name),
      isAccessibleForFree: true
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_BASE}/#project-list`,
      name: 'Projects',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: toAscii(project.title),
          description: toAscii(project.description || project.longDescription || 'Project summary.'),
          url: projectSearchUrl(project),
          encoding: [
            {
              '@type': 'MediaObject',
              contentUrl: projectReferenceUrl(project),
              encodingFormat: 'text/markdown'
            }
          ],
          author: { '@id': `${SITE_BASE}/#zakhar-pashkin` },
          creator: { '@id': `${SITE_BASE}/#zakhar-pashkin` },
          genre: project.projectKind || 'case-study',
          keywords: [...(project.surfaceTags || []), ...(project.techStack || [])].map(toAscii).filter(Boolean).join(', '),
          dateCreated: project.createdAt || undefined,
          isAccessibleForFree: true
        }
      }))
    }
  ];

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
};

const buildSitemap = (projects) => {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: `${SITE_BASE}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: PAPER_REVIEWS_URL, lastmod: today, changefreq: 'daily', priority: '0.6' },
    { loc: RESUME_URL, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: RESUME_HTML_URL, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    ...projects.map((project) => ({
      loc: projectSearchUrl(project),
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.4'
    }))
  ];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      ({ loc, lastmod, changefreq, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ),
    '</urlset>',
    ''
  ];

  return lines.join('\n');
};

// Also used by focused, read-only catalogue checks; importing this file never builds.
export const readProjectCatalogue = async (sourceFile) => {
  if (!sourceFile) {
    const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
    sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  }
  const imageConstants = extractImageConstants(sourceFile);
  const curatedProjects = extractProjects(sourceFile, imageConstants);
  const feed = JSON.parse(await fs.readFile(PORTFOLIO_UPDATES_PATH, 'utf8'));
  const excludedRepos = extractJsonVariable(sourceFile, 'PORTFOLIO_UPDATE_REPO_EXCLUSIONS', []);
  const projects = mergeProjects(curatedProjects, selectReviewedFeedProjects(feed, excludedRepos)).map((project) => ({
    ...project,
    images: (project.images || []).map((image) => ({ ...image, url: toPublicAssetUrl(image.url) })),
    thumbnail: toPublicAssetUrl(project.thumbnail),
  }));
  assertUniqueProjectRoutes(projects);
  return projects;
};

const main = async () => {
  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const projects = await readProjectCatalogue(sourceFile);
  tractionSnapshot = extractClawHubSnapshot(sourceFile);
  paperReviewSnapshot = await readPaperReviewSnapshot();
  const chromeExtensionStats = extractChromeExtensionStatsSnapshot(sourceFile);

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PROJECT_SOCIAL_IMAGE_DIR, { recursive: true });
  await fs.writeFile(CHROME_EXTENSION_STATS_PATH, `${JSON.stringify(chromeExtensionStats, null, 2)}\n`, 'utf8');

  const projectEntries = [];
  const expectedProjectSocialImageFiles = new Set();

  for (const project of projects) {
    const slug = getProjectCanonicalSlug(project);
    const fileName = `${slug}.md`;
    const markdownUrl = projectMarkdownUrlFromSlug(slug);
    const htmlUrl = projectHtmlUrlFromSlug(slug);
    const outputPath = path.resolve(OUTPUT_DIR, fileName);
    const projectEntry = {
      ...project,
      slug,
      markdownUrl,
      htmlUrl
    };
    if (!getExplicitProjectSocialImage(projectEntry)) {
      const socialImageFileName = `${slug}.png`;
      const socialImagePath = path.resolve(PROJECT_SOCIAL_IMAGE_DIR, socialImageFileName);
      expectedProjectSocialImageFiles.add(socialImageFileName);
      if (!(await pathExists(socialImagePath))) {
        await createProjectSocialCard(projectEntry, socialImagePath);
      }
      projectEntry.generatedSocialImage = projectSocialImageUrlFromSlug(slug);
    }
    const markdown = buildMarkdown(projectEntry, markdownUrl);
    await fs.writeFile(outputPath, markdown, 'utf8');
    const htmlOutputDir = path.resolve(OUTPUT_DIR, slug);
    await fs.mkdir(htmlOutputDir, { recursive: true });
    await fs.writeFile(path.resolve(htmlOutputDir, 'index.html'), buildProjectHtml(projectEntry).replace(/[ \t]+$/gm, ''), 'utf8');
    for (const legacySlug of getProjectRouteSlugs(project).filter((route) => route !== slug)) {
      const aliasOutputPath = path.resolve(OUTPUT_DIR, `${legacySlug}.md`);
      const aliasMarkdown = buildAliasMarkdown(projectEntry, markdownUrl);
      await fs.writeFile(aliasOutputPath, aliasMarkdown, 'utf8');
      const aliasHtmlDir = path.resolve(OUTPUT_DIR, legacySlug);
      await fs.mkdir(aliasHtmlDir, { recursive: true });
      const canonicalUrl = projectSearchUrl(projectEntry);
      const aliasHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(projectEntry.title)}</title><link rel="canonical" href="${canonicalUrl}"><meta http-equiv="refresh" content="0;url=${canonicalUrl}"></head><body><p><a href="${canonicalUrl}">Continue to ${escapeHtml(projectEntry.title)}</a></p></body></html>`;
      await fs.writeFile(path.resolve(aliasHtmlDir, 'index.html'), aliasHtml, 'utf8');
    }
    projectEntries.push(projectEntry);
  }

  for (const entry of await fs.readdir(PROJECT_SOCIAL_IMAGE_DIR, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.png') && !expectedProjectSocialImageFiles.has(entry.name)) {
      await fs.rm(path.resolve(PROJECT_SOCIAL_IMAGE_DIR, entry.name));
    }
  }

  const topProjectTitles = [
    'Riverstart Document AI',
    'Dermaself Flutter Skin Analysis App',
    'Agnitra - ML Profiling & Optimization',
    'Calorio - AI Nutrition Service',
    'Engineering Drawing & CAD Analysis',
    'Multimodal Video Search Platform'
  ].map(toAscii);

  const topProjects = topProjectTitles.map((title) =>
    projectEntries.find((project) => toAscii(project.title) === title)
  );
  const missing = topProjects
    .map((project, index) => (project ? null : topProjectTitles[index]))
    .filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing top project entries: ${missing.join(', ')}`);
  }

  const llmsContent = buildLlms(projectEntries, topProjects);
  await fs.writeFile(LLMS_PATH, llmsContent, 'utf8');
  const geoContent = buildGeo(projectEntries);
  await fs.writeFile(GEO_PATH, geoContent, 'utf8');
  const llmsFullContent = buildLlmsFull(projectEntries, topProjects);
  await fs.writeFile(LLMS_FULL_PATH, llmsFullContent, 'utf8');
  const agentContextContent = buildAgentContext(projectEntries, topProjects);
  await fs.writeFile(AGENT_CONTEXT_PATH, agentContextContent, 'utf8');
  const agentDiscoveryContent = buildAgentDiscovery(projectEntries, topProjects);
  await fs.writeFile(AGENT_DISCOVERY_PATH, agentDiscoveryContent, 'utf8');
  const schemaJsonldContent = buildSchemaJsonld(projectEntries, topProjects);
  await fs.writeFile(SCHEMA_JSONLD_PATH, schemaJsonldContent, 'utf8');
  const sitemapContent = buildSitemap(projectEntries);
  await fs.writeFile(SITEMAP_PATH, sitemapContent, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  const staticHomeSnapshot = buildStaticHomeSnapshot(projectEntries, topProjects);
  await updateIndexHtml(staticHomeSnapshot, today, schemaJsonldContent, projectEntries.length);
  await updateMetadataJson(projectEntries.length);
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
