import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'projects');
const LLMS_PATH = path.resolve(ROOT_DIR, 'llms.txt');
const GEO_PATH = path.resolve(ROOT_DIR, 'geo.txt');
const LLMS_FULL_PATH = path.resolve(ROOT_DIR, 'llms-full.txt');
const AGENT_CONTEXT_PATH = path.resolve(ROOT_DIR, 'agent-context.md');
const SCHEMA_JSONLD_PATH = path.resolve(ROOT_DIR, 'schema.jsonld');
const SITEMAP_PATH = path.resolve(ROOT_DIR, 'sitemap.xml');
const SITE_BASE = 'https://zack-dev-cm.github.io';
const CONTACT_EMAIL = 'kaisenaiko@gmail.com';
const AUTHOR_NAME = 'Zakhar Pashkin';
const AUTHOR_TITLE = 'AI Product Engineer';
const AUTHOR_DESCRIPTION =
  'AI product engineer building VLM/LLM and computer vision systems across web, mobile, and cloud.';
const AUTHOR_SAME_AS = [
  'https://www.linkedin.com/in/zakhar-pashkin-a524a6163/',
  'https://github.com/zack-dev-cm',
  'https://github.com/ZackPashkin',
  'https://t.me/rheuiii'
];

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

const slugify = (value) => {
  const ascii = toAscii(value).toLowerCase();
  const slug = ascii.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || 'project';
};

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

const extractProjects = (sourceFile) => {
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
      const description = parseString(getPropertyValue(element, 'description'));
      const longDescription = parseString(getPropertyValue(element, 'longDescription'));
      const keyFeatures = parseStringArray(getPropertyValue(element, 'keyFeatures'));
      const techStack = parseStringArray(getPropertyValue(element, 'techStack'));
      const links = parseLinks(getPropertyValue(element, 'links'));
      const topologySnapshot = parseString(getPropertyValue(element, 'topologySnapshot'));
      const mermaidDiagram = parseString(getPropertyValue(element, 'mermaidDiagram'));
      const benchmarks = parseBenchmarks(getPropertyValue(element, 'benchmarks'));

      return {
        id,
        title,
        description,
        longDescription,
        keyFeatures,
        techStack,
        links,
        topologySnapshot,
        mermaidDiagram,
        benchmarks
      };
    });
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

const formatLinkLine = (title, url, description) => {
  const safeTitle = toAscii(title);
  const safeDescription = toAscii(description);
  return `- [${safeTitle}](${url}): ${safeDescription}`;
};

const formatTopProjectLine = (project) => {
  const markdownUrl = project.markdownUrl;
  const baseDescription = project.description || project.longDescription || 'Project summary.';
  const asciiDescription = toAscii(baseDescription);
  const linkNotes = project.links
    .slice(0, 2)
    .map((link) => `${toAscii(link.text)}: ${link.url}`)
    .join(' | ');
  const suffix = linkNotes ? ` ${linkNotes}` : '';
  const trimmedDescription = asciiDescription.replace(/[.!?]+$/, '') || 'Project summary';
  return `- [${toAscii(project.title)}](${markdownUrl}): ${trimmedDescription}.${suffix}`;
};

const buildLlms = (projects, topProjects) => {
  const lines = [
    `# ${AUTHOR_NAME} - AI Product Engineer Portfolio`,
    '',
    '> Python-first AI product engineer specializing in PyTorch/OpenAI VLM/LLM systems, computer vision, FastAPI services, Open MCP tooling, and full-stack delivery across web, mobile, and cloud.',
    '',
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    '',
    'Focus areas include Python, PyTorch, OpenAI, VLM/LLM, computer vision, FastAPI, Open MCP (Model Context Protocol), and full-stack delivery with React, TypeScript, Node.js, Cloud Run, and MLOps.',
    '',
    '## AI Memory Files',
    formatLinkLine('llms-full.txt', `${SITE_BASE}/llms-full.txt`, 'Full portfolio memory file with all project details.'),
    formatLinkLine('agent-context.md', `${SITE_BASE}/agent-context.md`, 'Quick facts, contact info, and key project highlights.'),
    formatLinkLine('schema.jsonld', `${SITE_BASE}/schema.jsonld`, 'JSON-LD graph for author, site, and project list.'),
    formatLinkLine('geo.txt', `${SITE_BASE}/geo.txt`, 'GEO index of projects with short descriptions.'),
    '',
    '## Top 5 Projects',
    ...topProjects.map(formatTopProjectLine),
    '',
    '## Projects (Markdown)',
    ...projects.map((project) =>
      formatLinkLine(project.title, project.markdownUrl, project.description || project.longDescription || 'Project detail page.')
    ),
    '',
    '## Core Pages',
    formatLinkLine('Home', `${SITE_BASE}/`, 'Overview of the portfolio, highlights, and navigation.'),
    formatLinkLine('About', `${SITE_BASE}/#about`, 'Bio and positioning.'),
    formatLinkLine('Tech Stack', `${SITE_BASE}/#stack`, 'Tools and frameworks used across projects.'),
    formatLinkLine('Projects', `${SITE_BASE}/#projects`, 'Project cards with descriptions and tech stacks.'),
    '',
    '## Latest Updates',
    formatLinkLine('Latest', `${SITE_BASE}/#latest`, 'Recently shipped work and updates.'),
    '',
    '## Contact',
    formatLinkLine('Contact', `${SITE_BASE}/#contact`, 'Email and social links.'),
    '',
    '## Profiles',
    formatLinkLine('GitHub', 'https://github.com/zack-dev-cm', 'Primary repositories and open-source work.'),
    formatLinkLine('GitHub (Alt)', 'https://github.com/ZackPashkin', 'Secondary repositories.'),
    formatLinkLine('LinkedIn', 'https://www.linkedin.com/in/zakhar-pashkin-a524a6163/', 'Professional profile and experience.'),
    '',
    '## Optional',
    formatLinkLine('Telegram', 'https://t.me/rheuiii', 'Fast contact channel.'),
    ''
  ];

  return lines.join('\n');
};

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
    '# GEO - Project Index',
    '',
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    '',
    '## Projects',
    ...projects.map((project) =>
      formatLinkLine(
        project.title,
        project.markdownUrl,
        buildGeoDescription(project)
      )
    ),
    ''
  ];

  return lines.join('\n');
};

const buildLlmsFull = (projects, topProjects) => {
  const lines = [
    '# Zakhar Pashkin - Portfolio Memory File',
    '',
    `Summary: ${AUTHOR_DESCRIPTION}`,
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    '',
    '## Focus Areas',
    '- Python, PyTorch, OpenAI APIs, VLMs, LLMs',
    '- Computer vision, OCR, segmentation, multimodal systems',
    '- FastAPI services, Open MCP tooling, full-stack delivery',
    '- React, TypeScript, Cloud Run, MLOps',
    '',
    '## Top 5 Projects',
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
      block.push(`Project URL: ${project.markdownUrl}`);
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

const buildAgentContext = (topProjects) => {
  const lines = [
    '# Agent Context - Zakhar Pashkin Portfolio',
    '',
    `Summary: ${AUTHOR_DESCRIPTION}`,
    `Primary URL: ${SITE_BASE}/`,
    `Contact: mailto:${CONTACT_EMAIL}`,
    '',
    '## Identity',
    `Name: ${AUTHOR_NAME}`,
    `Role: ${AUTHOR_TITLE}`,
    '',
    '## Key Files',
    `- ${SITE_BASE}/llms.txt`,
    `- ${SITE_BASE}/llms-full.txt`,
    `- ${SITE_BASE}/geo.txt`,
    `- ${SITE_BASE}/schema.jsonld`,
    '',
    '## Top Projects',
    ...topProjects.map(formatTopProjectLine),
    ''
  ];

  return lines.join('\n');
};

const buildSchemaJsonld = (projects) => {
  const today = new Date().toISOString().split('T')[0];
  const graph = [
    {
      '@type': 'Person',
      '@id': `${SITE_BASE}/#zakhar-pashkin`,
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_TITLE,
      url: `${SITE_BASE}/`,
      email: `mailto:${CONTACT_EMAIL}`,
      description: AUTHOR_DESCRIPTION,
      sameAs: AUTHOR_SAME_AS
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_BASE}/#website`,
      name: `${AUTHOR_NAME} - AI Product Engineer Portfolio`,
      url: `${SITE_BASE}/`,
      description: AUTHOR_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_BASE}/#zakhar-pashkin` }
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_BASE}/#webpage`,
      url: `${SITE_BASE}/`,
      name: `${AUTHOR_NAME} - AI Product Engineer Portfolio`,
      description: AUTHOR_DESCRIPTION,
      inLanguage: 'en',
      dateModified: today,
      isPartOf: { '@id': `${SITE_BASE}/#website` },
      about: { '@id': `${SITE_BASE}/#zakhar-pashkin` }
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
          url: project.markdownUrl,
          author: { '@id': `${SITE_BASE}/#zakhar-pashkin` }
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
    { loc: `${SITE_BASE}/llms.txt`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_BASE}/llms-full.txt`, lastmod: today, changefreq: 'monthly', priority: '0.6' },
    { loc: `${SITE_BASE}/agent-context.md`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_BASE}/geo.txt`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    { loc: `${SITE_BASE}/schema.jsonld`, lastmod: today, changefreq: 'monthly', priority: '0.5' },
    ...projects.map((project) => ({
      loc: project.markdownUrl,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7'
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

const main = async () => {
  const sourceText = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(CONSTANTS_PATH, sourceText, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  const projects = extractProjects(sourceFile);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const slugCounts = new Map();
  const projectEntries = [];

  for (const project of projects) {
    const baseSlug = slugify(project.title || 'project');
    const count = (slugCounts.get(baseSlug) || 0) + 1;
    slugCounts.set(baseSlug, count);
    const slug = count > 1 && project.id ? `${baseSlug}-${project.id}` : baseSlug;
    const fileName = `${slug}.md`;
    const markdownUrl = `${SITE_BASE}/projects/${fileName}`;
    const outputPath = path.resolve(OUTPUT_DIR, fileName);
    const markdown = buildMarkdown(project, markdownUrl);
    await fs.writeFile(outputPath, markdown, 'utf8');
    projectEntries.push({
      ...project,
      slug,
      markdownUrl
    });
  }

  const topProjectTitles = [
    'Android Remote Control with VLM AI Agents',
    'Noel - Noetic Mirror',
    'MCP-Server - Base Multitool',
    'GeoFix - AI Visibility Memorizer Mini App',
    'seogeo - SEO/GEO Bridge for Telegram Mini Apps'
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
  const agentContextContent = buildAgentContext(topProjects);
  await fs.writeFile(AGENT_CONTEXT_PATH, agentContextContent, 'utf8');
  const schemaJsonldContent = buildSchemaJsonld(projectEntries);
  await fs.writeFile(SCHEMA_JSONLD_PATH, schemaJsonldContent, 'utf8');
  const sitemapContent = buildSitemap(projectEntries);
  await fs.writeFile(SITEMAP_PATH, sitemapContent, 'utf8');
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
