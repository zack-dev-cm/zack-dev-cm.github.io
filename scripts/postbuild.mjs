import { copyFile, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const rootDir = resolve(__dirname, '..');
const outDir = resolve(__dirname, '..', 'docs');

const source = resolve(outDir, 'index.html');
const destination = resolve(outDir, '404.html');
const manifestSource = resolve(outDir, '.vite', 'manifest.json');
const manifestDestination = resolve(outDir, 'manifest.json');
const extraFiles = [
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  'agent-context.md',
  'agent-discovery.json',
  'geo.txt',
  'schema.jsonld',
  'metadata.json',
  'favicon.svg'
];
const extraDirectories = [
  { source: 'projects', destination: 'projects' },
  { source: 'codex-docs', destination: 'codex' }
];
const hiddenPublishedSurfaces = [
  'newsletter.md',
  'field-notes',
  'blog'
];

const copyRequiredFile = async (src, dest) => {
  try {
    await copyFile(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`Required postbuild file is missing: ${src}`);
    }
    throw error;
  }
};

try {
  await copyRequiredFile(source, destination);

  await copyRequiredFile(manifestSource, manifestDestination);

  await Promise.all(
    hiddenPublishedSurfaces.map(async (fileOrDirectory) => {
      const target = resolve(outDir, fileOrDirectory);
      await rm(target, { recursive: true, force: true });
      console.log(`Removed hidden published surface ${target}`);
    })
  );

  const extraCopies = extraFiles.map(async (file) => {
    const src = resolve(rootDir, file);
    const dest = resolve(outDir, file);
    await copyRequiredFile(src, dest);
  });
  await Promise.all(extraCopies);

  const extraDirectoryCopies = extraDirectories.map(async ({ source: directory, destination }) => {
    const src = resolve(rootDir, directory);
    const dest = resolve(outDir, destination);
    try {
      await rm(dest, { recursive: true, force: true });
      await cp(src, dest, { recursive: true });
      console.log(`Copied ${src} to ${dest}`);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        throw new Error(`Required postbuild directory is missing: ${src}`);
      } else {
        throw error;
      }
    }
  });
  await Promise.all(extraDirectoryCopies);
} catch (error) {
  console.error(error?.message || error);
  process.exitCode = 1;
}
