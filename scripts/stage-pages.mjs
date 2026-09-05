import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_FILES = [
  'index.html', 'favicon.svg', 'geo.txt', 'llms.txt', 'llms-full.txt', 'metadata.json',
  'robots.txt', 'schema.jsonld', 'sitemap.xml', 'agent-context.md', 'agent-discovery.json',
  'google-site-verification.txt', 'google9a05bdeaa5b048bb.html',
];
const RESUME_NAME = 'zakhar-pashkin-senior-ml-engineer';

const readResume = async (directory) => {
  const pdf = await fs.readFile(path.join(directory, `${RESUME_NAME}.pdf`));
  const html = await fs.readFile(path.join(directory, `${RESUME_NAME}.html`));
  if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error(`Resume is not a PDF: ${directory}`);
  const text = html.toString('utf8');
  if (!/<html\b/i.test(text) || !/<title>[^<]*Zakhar Pashkin[^<]*<\/title>/i.test(text)
    || !/Senior ML Engineer/.test(text)) throw new Error(`Resume HTML is missing career content: ${directory}`);
  return { pdf, html };
};

export const verifyStagedPages = async (outputDir) => {
  const canonical = await readResume(path.join(outputDir, 'resume'));
  const alias = await readResume(path.join(outputDir, 'docs', 'resume'));
  if (!canonical.pdf.equals(alias.pdf) || !canonical.html.equals(alias.html)) {
    throw new Error('Canonical and /docs resume artifacts differ');
  }

  const discovery = JSON.parse(await fs.readFile(path.join(outputDir, 'docs', 'agent-discovery.json'), 'utf8'));
  if (!Array.isArray(discovery.allProjects) || !discovery.allProjects.length) throw new Error('Staged project catalogue is empty');
  for (const project of discovery.allProjects) {
    const url = new URL(project.url);
    if (url.origin !== 'https://zack-dev-cm.github.io' || !/^\/projects\/[a-z0-9-]+\/$/.test(url.pathname)) {
      throw new Error(`Invalid staged canonical project URL: ${project.url}`);
    }
    const html = await fs.readFile(path.join(outputDir, url.pathname, 'index.html'), 'utf8');
    const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
    if (!canonicalTag?.includes(`href="${project.url}"`)) throw new Error(`Missing canonical metadata: ${project.url}`);
    const markdownUrl = new URL(project.markdownUrl);
    if (markdownUrl.origin !== url.origin || markdownUrl.pathname !== `${url.pathname.slice(0, -1)}.md`) {
      throw new Error(`Invalid staged Markdown URL: ${project.markdownUrl}`);
    }
    await fs.access(path.join(outputDir, markdownUrl.pathname));
  }
  return { projectCount: discovery.allProjects.length, resumePdfBytes: canonical.pdf.length, resumeHtmlBytes: canonical.html.length };
};

export const stagePages = async ({ rootDir = ROOT_DIR, outputDir = path.join(rootDir, '.site') } = {}) => {
  rootDir = path.resolve(rootDir);
  outputDir = path.resolve(outputDir);
  const relativeOutput = path.relative(rootDir, outputDir);
  const protectedPaths = ['docs', 'public', 'projects', 'scripts', 'utils', '.git'];
  if (!relativeOutput || rootDir.startsWith(`${outputDir}${path.sep}`)
    || protectedPaths.some((name) => relativeOutput === name || relativeOutput.startsWith(`${name}${path.sep}`))) {
    throw new Error(`Refusing to replace a source directory: ${outputDir}`);
  }
  // Check the built inputs before clearing any previous artifact.
  await readResume(path.join(rootDir, 'docs', 'resume'));
  await Promise.all([...ROOT_FILES, 'docs/404.html', 'docs/paper-reviews.json', 'docs/papers', 'docs/agent-discovery.json', 'projects']
    .map((file) => fs.access(path.join(rootDir, file))));

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all(ROOT_FILES.map((file) => fs.copyFile(path.join(rootDir, file), path.join(outputDir, file))));
  await fs.copyFile(path.join(rootDir, 'docs', '404.html'), path.join(outputDir, '404.html'));
  await fs.copyFile(path.join(rootDir, 'docs', 'paper-reviews.json'), path.join(outputDir, 'paper-reviews.json'));
  await fs.cp(path.join(rootDir, 'docs', 'papers'), path.join(outputDir, 'papers'), { recursive: true });
  await fs.cp(path.join(rootDir, 'docs', 'resume'), path.join(outputDir, 'resume'), { recursive: true });
  await fs.cp(path.join(rootDir, 'docs'), path.join(outputDir, 'docs'), { recursive: true });
  await fs.cp(path.join(rootDir, 'projects'), path.join(outputDir, 'projects'), { recursive: true });
  await fs.writeFile(path.join(outputDir, '.nojekyll'), '');
  return verifyStagedPages(outputDir);
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--out')) {
    console.error('Usage: node scripts/stage-pages.mjs [--out <artifact-directory>]');
    process.exitCode = 1;
  } else {
    stagePages(args.length ? { outputDir: args[1] } : {}).then((result) => {
      console.log(`Pages artifact verified: ${result.projectCount} canonical projects; resume PDF ${result.resumePdfBytes} bytes and HTML ${result.resumeHtmlBytes} bytes at /resume and /docs/resume.`);
    }).catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
  }
}
