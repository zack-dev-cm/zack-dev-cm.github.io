import { copyFile } from 'node:fs/promises';
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
  'geo.txt',
  'schema.jsonld',
  'metadata.json',
  'favicon.svg'
];

try {
  await copyFile(source, destination);
  console.log(`Copied ${source} to ${destination}`);

  await copyFile(manifestSource, manifestDestination);
  console.log(`Copied ${manifestSource} to ${manifestDestination}`);

  const extraCopies = extraFiles.map(async (file) => {
    const src = resolve(rootDir, file);
    const dest = resolve(outDir, file);
    try {
      await copyFile(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        console.warn(`Missing ${src}; skipped`);
      } else {
        throw error;
      }
    }
  });
  await Promise.all(extraCopies);
} catch (error) {
  if (error && error.code === 'ENOENT') {
    console.warn('Build output not found; skipped creating 404.html or manifest.json');
  } else {
    throw error;
  }
}
