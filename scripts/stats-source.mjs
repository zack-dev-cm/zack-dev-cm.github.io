import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Both trackers fetch first, then lock and transform the latest source.
// An abandoned lock fails visibly; it is never removed by another writer.
export const updateStatsSource = async (file, transform, { timeoutMs = 10000 } = {}) => {
  const lockFile = `${file}.refresh.lock`;
  const temporaryFile = `${file}.${randomUUID()}.tmp`;
  const deadline = Date.now() + timeoutMs;
  let lock;
  while (!lock) {
    try { lock = await fs.open(lockFile, 'wx'); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (Date.now() >= deadline) throw new Error(`Statistics source is locked: ${file}`);
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  try {
    const source = await fs.readFile(file, 'utf8');
    const next = await transform(source);
    if (next === source) return;
    await fs.writeFile(temporaryFile, next, { mode: (await fs.stat(file)).mode, flag: 'wx' });
    if (await fs.readFile(file, 'utf8') !== source) {
      throw new Error(`Statistics source changed during refresh: ${file}`);
    }
    await fs.rename(temporaryFile, file);
  } finally {
    await fs.rm(temporaryFile, { force: true });
    await lock.close();
    await fs.rm(lockFile, { force: true });
  }
};
