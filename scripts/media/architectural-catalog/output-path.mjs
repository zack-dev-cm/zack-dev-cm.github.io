import path from 'node:path';
import fs from 'node:fs';

const canonicalPath = (value) => {
  let current = path.resolve(value);
  const suffix = [];
  for (;;) {
    try { return path.join(fs.realpathSync(current), ...suffix); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(current);
      if (parent === current) throw error;
      suffix.unshift(path.basename(current));
      current = parent;
    }
  }
};

export const isPublicOutput = (output, publicRoot) => {
  const resolvedOutput = canonicalPath(output);
  return [publicRoot, path.resolve(publicRoot, '..', 'docs')].some((root) => {
    const relative = path.relative(canonicalPath(root), resolvedOutput);
    return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
  });
};
