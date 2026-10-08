import fs from 'node:fs';

export const assertDecodedOutput = (result, output) => {
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `Frame decoding failed: ${result.signal || result.status}`);
  const stat = fs.statSync(output);
  if (!stat.isFile() || !stat.size) throw new Error(`Missing decoded frame content: ${output}`);
};
