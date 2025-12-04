import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const outDir = resolve(__dirname, '..', 'docs');

const source = resolve(outDir, 'index.html');
const destination = resolve(outDir, '404.html');
const manifestSource = resolve(outDir, '.vite', 'manifest.json');
const manifestDestination = resolve(outDir, 'manifest.json');

try {
  await copyFile(source, destination);
  console.log(`Copied ${source} to ${destination}`);

  await copyFile(manifestSource, manifestDestination);
  console.log(`Copied ${manifestSource} to ${manifestDestination}`);
} catch (error) {
  if (error && error.code === 'ENOENT') {
    console.warn('Build output not found; skipped creating 404.html or manifest.json');
  } else {
    throw error;
  }
}
