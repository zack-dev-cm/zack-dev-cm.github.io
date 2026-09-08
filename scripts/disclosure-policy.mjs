import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const canonicalValue = (value) => {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]));
  }
  return value;
};

export const canonicalJsonHash = (value) => sha256(JSON.stringify(canonicalValue(value)));

export const normalizedWords = (text) => String(text)
  .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  .replace(/\\[nrt]/g, ' ')
  .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => {
    const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
    return value <= 0x10ffff ? String.fromCodePoint(value) : ' ';
  })
  .replace(/&(?:amp|nbsp|quot|apos|lt|gt);/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\u00ad/g, '')
  .replace(/(\p{L})-\r?\n\s*(?=\p{L})/gu, '$1')
  .normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];

export const textFingerprints = (text, wordCount = 8) => {
  const words = normalizedWords(text);
  const hashes = new Set();
  for (let index = 0; index <= words.length - wordCount; index++) {
    hashes.add(sha256(words.slice(index, index + wordCount).join(' ')));
  }
  return hashes;
};

export const compilePolicy = (data) => {
  const hash = /^[a-f0-9]{64}$/;
  if (data.version !== 1 || !Number.isInteger(data.wordCount) || data.wordCount < 8
    || !Array.isArray(data.textHashes) || !data.textHashes.length || !data.textHashes.every((item) => hash.test(item))
    || !Array.isArray(data.jsonHashes) || !data.jsonHashes.every((item) => hash.test(item))
    || !Array.isArray(data.assets) || !data.assets.length
    || !data.assets.every((item) => Number.isSafeInteger(item.bytes) && item.bytes > 0 && hash.test(item.sha256))) {
    throw new Error('Invalid disclosure fingerprint policy');
  }
  return {
    wordCount: data.wordCount,
    textHashes: new Set(data.textHashes),
    jsonHashes: new Set(data.jsonHashes),
    assetHashes: new Set(data.assets.map((item) => item.sha256)),
    assetSizes: new Set(data.assets.map((item) => item.bytes)),
  };
};

export const containsWithdrawnCopy = (text, policy) => {
  const words = normalizedWords(text);
  for (let index = 0; index <= words.length - policy.wordCount; index++) {
    if (policy.textHashes.has(sha256(words.slice(index, index + policy.wordCount).join(' ')))) return true;
  }
  return false;
};

// Inspect published assets independently of names and extensions. Exact byte
// identities also cover images and PDFs; canonical JSON ignores key ordering
// and formatting. These checks recognize known withdrawn content, not every
// possible confidential file or paraphrase.
export const scanPublishedAssets = async ({ rootDir, roots, files = [], policy }) => {
  const errors = [];
  const seen = new Set();
  const inspect = async (relativePath) => {
    if (seen.has(relativePath)) return;
    seen.add(relativePath);
    const absolutePath = path.join(rootDir, relativePath);
    let stat;
    try {
      stat = await fs.lstat(absolutePath);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    if (stat.isSymbolicLink()) {
      errors.push(`${relativePath}: published symlink cannot be verified by the disclosure gate`);
      return;
    }
    if (stat.isDirectory()) {
      for (const name of await fs.readdir(absolutePath)) await inspect(path.join(relativePath, name));
      return;
    }
    if (!stat.isFile()) return;
    const checkBytes = policy.assetSizes.has(stat.size);
    const checkJson = stat.size <= 2 * 1024 * 1024;
    if (!checkBytes && !checkJson) return;
    const data = await fs.readFile(absolutePath);
    if (checkBytes && policy.assetHashes.has(sha256(data))) {
      errors.push(`${relativePath}: contains a withdrawn asset (content identity)`);
      return;
    }
    if (!checkJson) return;
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(data); } catch { return; }
    if (containsWithdrawnCopy(text, policy)) {
      errors.push(`${relativePath}: contains withdrawn project copy (content fingerprint)`);
    }
    if (/^\s*[\[{]/.test(text)) {
      let value;
      try { value = JSON.parse(text); } catch { return; }
      if (policy.jsonHashes.has(canonicalJsonHash(value))) {
        errors.push(`${relativePath}: contains withdrawn JSON data (content identity)`);
      }
    }
  };
  for (const entry of [...roots, ...files]) await inspect(entry);
  return errors;
};
