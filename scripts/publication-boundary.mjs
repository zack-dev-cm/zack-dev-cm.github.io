import fs from 'node:fs/promises';
import path from 'node:path';

const repositoryPaths = [
  'codex-docs', 'public/codex', 'docs/codex', 'public/oss-validation', 'docs/oss-validation',
];
const pagesPaths = ['codex', 'docs/codex', 'oss-validation', 'docs/oss-validation'];

export const assertPrivateReviewSurfacesAbsent = async (rootDir, { pages = false } = {}) => {
  const found = [];
  for (const relativePath of pages ? pagesPaths : repositoryPaths) {
    try {
      await fs.lstat(path.join(rootDir, relativePath));
      found.push(relativePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (found.length) throw new Error(`Private review material must stay outside publication: ${found.join(', ')}`);
};

const operationalKeys = new Set([
  'render_prompt', 'instruction_sha256', 'image_copy_receipts', 'image_tool_trace',
  'input_tokens', 'cached_input_tokens', 'cache_write_input_tokens', 'output_tokens', 'reasoning_output_tokens',
]);

export const privateOperationalFields = (value, location = '$') => {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const field = `${location}.${key}`;
    return operationalKeys.has(key) ? [field] : privateOperationalFields(child, field);
  });
};

export const linksToPrivateReviews = text => /https:\/\/zack-dev-cm\.github\.io\/(?:docs\/)?(?:oss-validation|codex)(?:[/?#]|$)|(?:href|src)\s*=\s*["']\/(?:docs\/)?(?:oss-validation|codex)(?:[\/"'?#])/i.test(text);
