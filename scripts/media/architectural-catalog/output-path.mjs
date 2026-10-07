import path from 'node:path';

export const isPublicOutput = (output, publicRoot) => {
  const relative = path.relative(path.resolve(publicRoot), path.resolve(output));
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
};
