import fs from 'node:fs';
import path from 'node:path';

export function publishFiles(staging, destination, names, rename = fs.renameSync) {
  return publishFileGroups([{ staging, destination, names }], rename);
}

// Lock and prepare the complete generation before changing any destination.
// A failed rename restores media, models and receipts together. Recovery files
// survive a failed rollback; only locks acquired by this call are released.
export function publishFileGroups(groups, rename = fs.renameSync) {
  const destinations = groups.map((group) => path.resolve(group.destination));
  if (new Set(destinations).size !== destinations.length) throw new Error('Duplicate publication destination');
  const locks = [], transactions = [], replaced = [];
  try {
    for (const destination of [...destinations].sort()) {
      const lock = path.join(destination, '.publish.lock');
      fs.mkdirSync(lock); locks.push(lock);
    }
    for (const { staging, destination, names } of groups) {
      const transaction = fs.mkdtempSync(path.join(destination, '.publish-'));
      const fresh = path.join(transaction, 'new'), backup = path.join(transaction, 'previous');
      fs.mkdirSync(fresh); fs.mkdirSync(backup);
      const entry = { transaction, fresh, backup, destination, names, present: new Set() };
      transactions.push(entry);
      for (const name of names) {
        if (path.basename(name) !== name || name === '.' || name === '..') throw new Error('Publication requires flat filenames');
        const source = path.join(staging, name), stat = fs.statSync(source);
        if (!stat.isFile() || !stat.size) throw new Error('Empty publication file: ' + name);
        fs.copyFileSync(source, path.join(fresh, name));
        if (fs.existsSync(path.join(destination, name))) {
          fs.copyFileSync(path.join(destination, name), path.join(backup, name)); entry.present.add(name);
        }
      }
      fs.writeFileSync(path.join(transaction, 'journal.json'), JSON.stringify({ names, previous: [...entry.present] }));
    }
    for (const entry of transactions) for (const name of entry.names) {
      rename(path.join(entry.fresh, name), path.join(entry.destination, name));
      replaced.push({ entry, name });
    }
  } catch (error) {
    const failures = [];
    for (const { entry, name } of replaced.reverse()) {
      try {
        if (entry.present.has(name)) fs.renameSync(path.join(entry.backup, name), path.join(entry.destination, name));
        else fs.unlinkSync(path.join(entry.destination, name));
      } catch (failure) { failures.push(String(failure)); }
    }
    if (failures.length) throw new Error('Publication and rollback failed; recovery retained at ' + transactions.map((entry) => entry.transaction).join(', ') + ': ' + failures.join('; '), { cause: error });
    for (const entry of transactions) fs.rmSync(entry.transaction, { recursive: true, force: true });
    throw error;
  } finally {
    for (const lock of locks.reverse()) fs.rmSync(lock, { recursive: true, force: true });
  }
  for (const entry of transactions) fs.rmSync(entry.transaction, { recursive: true, force: true });
}
