import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_RECORDS = 100;
const PR_URL = /^https:\/\/github\.com\/([A-Za-z0-9][A-Za-z0-9_.-]*)\/([A-Za-z0-9][A-Za-z0-9_.-]*)\/pull\/([1-9]\d*)$/;
const STATES = new Set(['open', 'closed', 'merged']);

const validTimestamp = value => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);

export const catalogueRecords = catalogue => {
  if (!Array.isArray(catalogue?.projects) || !catalogue.projects.length) throw new Error('Contribution projects must be a nonempty array');
  const records = [], seen = new Set();
  for (const project of catalogue.projects) {
    if (typeof project.account !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(project.account)) throw new Error('Contribution account is invalid');
    if (!Array.isArray(project.pullRequests) || !project.pullRequests.length) throw new Error('Contribution pull requests must be a nonempty array');
    for (const listed of project.pullRequests) {
      const match = typeof listed.url === 'string' && listed.url.match(PR_URL);
      if (!match || !Number.isSafeInteger(listed.number) || Number(match[3]) !== listed.number) throw new Error('Contribution URL/number is invalid');
      if (!STATES.has(listed.status)) throw new Error('Contribution state is invalid');
      if (listed.status === 'merged' ? !validTimestamp(listed.mergedAt) : listed.mergedAt !== null) throw new Error('Contribution merge date is inconsistent');
      const identity = listed.url.toLowerCase();
      if (seen.has(identity)) throw new Error('Contribution URL is duplicated');
      seen.add(identity);
      records.push({ url: listed.url, owner: match[1], repo: match[2], number: listed.number,
        account: project.account, expected: { status: listed.status, mergedAt: listed.mergedAt } });
      if (records.length > MAX_RECORDS) throw new Error(`Contribution check is limited to ${MAX_RECORDS} records`);
    }
  }
  return records;
};

class AvailabilityError extends Error {
  constructor(code, httpStatus = null, stop = false) {
    super(code);
    this.code = code;
    this.httpStatus = httpStatus;
    this.stop = stop;
  }
}

export const fetchPullRequest = async (record, {
  fetcher = fetch, token = '', signal, requestTimeoutMs = 10_000, sleep = delay,
} = {}) => {
  const url = `https://api.github.com/repos/${record.owner}/${record.repo}/pulls/${record.number}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (signal?.aborted) throw new AvailabilityError('TOTAL_TIMEOUT', null, true);
    const timeout = AbortSignal.timeout(requestTimeoutMs);
    try {
      const response = await fetcher(url, {
        redirect: 'error',
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'portfolio-contribution-status',
          'x-github-api-version': '2026-03-10', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      });
      if (response.ok) {
        try { return await response.json(); }
        catch { throw new AvailabilityError(timeout.aborted ? 'REQUEST_TIMEOUT' : 'INVALID_RESPONSE'); }
      }
      await response.body?.cancel();
      if (response.status === 401) throw new AvailabilityError('AUTHENTICATION', 401, true);
      if ([403, 429].includes(response.status)) {
        const limited = response.status === 429 || response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after');
        throw new AvailabilityError(limited ? 'RATE_LIMIT' : 'FORBIDDEN', response.status, true);
      }
      const retryAfter = response.headers.get('retry-after');
      const transient = [408, 500, 502, 503, 504].includes(response.status);
      // A requested cooldown is left for a later run, rather than retried early.
      if (retryAfter) throw new AvailabilityError('SERVER_COOLDOWN', response.status, true);
      if (!transient || attempt === 2) throw new AvailabilityError('HTTP_UNAVAILABLE', response.status);
    } catch (error) {
      if (signal?.aborted) throw new AvailabilityError('TOTAL_TIMEOUT', null, true);
      if (error instanceof AvailabilityError) throw error;
      if (attempt === 2) throw new AvailabilityError(timeout.aborted ? 'REQUEST_TIMEOUT' : 'NETWORK_UNAVAILABLE');
    }
    try { await sleep(500 * (attempt + 1), undefined, { signal }); }
    catch { throw new AvailabilityError('TOTAL_TIMEOUT', null, true); }
  }
};

export const observedState = (record, pull) => {
  const validIdentity = pull?.number === record.number
    && typeof pull.html_url === 'string' && pull.html_url.toLowerCase() === record.url.toLowerCase()
    && pull.base?.repo?.private === false
    && pull.base.repo.full_name?.toLowerCase() === `${record.owner}/${record.repo}`.toLowerCase()
    && pull.user?.login?.toLowerCase() === record.account.toLowerCase();
  const validState = typeof pull?.merged === 'boolean' && ['open', 'closed'].includes(pull.state)
    && (pull.merged ? pull.state === 'closed' && validTimestamp(pull.merged_at) : pull.merged_at === null);
  if (!validIdentity || !validState) throw new AvailabilityError('UNVERIFIED_RESPONSE');
  return { status: pull.merged ? 'merged' : pull.state, mergedAt: pull.merged_at };
};

export const checkContributions = async (catalogue, {
  request = fetchPullRequest, token = '', totalTimeoutMs = 120_000,
} = {}) => {
  const startedAt = new Date().toISOString();
  const records = catalogueRecords(catalogue);
  const signal = AbortSignal.timeout(totalTimeoutMs);
  const observations = [], mismatches = [], unavailable = [];
  let stopped = false;
  for (const record of records) {
    if (stopped || signal.aborted) {
      unavailable.push({ url: record.url, code: signal.aborted ? 'TOTAL_TIMEOUT' : 'REQUESTS_STOPPED', httpStatus: null });
      continue;
    }
    try {
      const observed = observedState(record, await request(record, { token, signal }));
      const row = { url: record.url, expected: record.expected, observed };
      observations.push(row);
      if (record.expected.status !== observed.status || record.expected.mergedAt !== observed.mergedAt) mismatches.push(row);
    } catch (error) {
      unavailable.push({ url: record.url, code: error instanceof AvailabilityError ? error.code : 'REQUEST_UNAVAILABLE',
        httpStatus: error instanceof AvailabilityError ? error.httpStatus : null });
      stopped = error instanceof AvailabilityError && error.stop;
    }
  }
  return { version: 1, startedAt, finishedAt: new Date().toISOString(),
    status: unavailable.length ? 'UNAVAILABLE' : mismatches.length ? 'DRIFT' : 'CURRENT',
    scope: 'Catalogue PR states and merge dates only; editorial wording, reverts, released artifacts and downstream use are separate review',
    recordsExpected: records.length, recordsObserved: observations.length, observations, mismatches, unavailable };
};

export const writePrivateReport = async (filename, report, root = ROOT) => {
  const target = path.resolve(filename);
  let ancestor = path.dirname(target), suffix = [path.basename(target)];
  while (true) {
    try { ancestor = await fs.realpath(ancestor); break; }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      suffix.unshift(path.basename(ancestor));
      ancestor = path.dirname(ancestor);
    }
  }
  const physical = path.join(ancestor, ...suffix), repository = await fs.realpath(root);
  const relative = path.relative(repository, physical);
  if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) {
    throw new Error('Contribution reports must be stored outside the repository');
  }
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
};

const existingToken = () => {
  const configured = process.env.DEV_CM_GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (configured) return configured;
  try { return execFileSync('gh', ['auth', 'token', '--hostname', 'github.com'], {
    encoding: 'utf8', timeout: 5_000, stdio: ['ignore', 'pipe', 'ignore'],
  }).trim(); } catch { return ''; }
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--report')) throw new Error('Usage: check-contribution-status.mjs [--report <outside-repository-file>]');
  const catalogue = JSON.parse(await fs.readFile(path.join(ROOT, 'data/open-source-contributions.json'), 'utf8'));
  const report = await checkContributions(catalogue, { token: existingToken() });
  if (args.length) await writePrivateReport(args[1], report);
  console.log(`Contribution catalogue: ${report.status}; ${report.recordsObserved}/${report.recordsExpected} observed, ${report.mismatches.length} mismatches, ${report.unavailable.length} unavailable.`);
  for (const row of report.mismatches) console.log(`DRIFT ${row.url}: ${row.expected.status}/${row.expected.mergedAt ?? 'none'} -> ${row.observed.status}/${row.observed.mergedAt ?? 'none'}`);
  for (const row of report.unavailable) console.error(`UNAVAILABLE ${row.url}: ${row.code}${row.httpStatus ? ` (HTTP ${row.httpStatus})` : ''}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,
      `Contribution catalogue: **${report.status}**. ${report.recordsObserved}/${report.recordsExpected} records observed; ${report.mismatches.length} confirmed mismatches; ${report.unavailable.length} unavailable. This check does not change public copy.\n`);
  }
  process.exitCode = report.status === 'CURRENT' ? 0 : report.status === 'DRIFT' ? 2 : 1;
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(() => {
    console.error('Contribution check could not complete. Check the catalogue, command arguments and private report destination; no publication is qualified.');
    process.exitCode = 3;
  });
}
