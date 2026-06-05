import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = resolve(__filename, '..', '..');

const sourceFiles = [
  'App.tsx',
  'constants.ts',
  'components/Sidebar.tsx',
  'components/ProjectModal.tsx',
  'DESIGN.md',
  'scripts/generate-project-markdown.mjs',
  'codex-docs/overview.md',
  'codex-docs/architecture.md',
  'codex-docs/workflow.md',
  'codex-docs/evals.md',
  '.codex/agents/architect.toml',
  '.codex/agents/reviewer.toml',
  '.codex/agents/evolver.toml',
  'tests/e2e.spec.ts',
  'index.html',
  'agent-context.md',
  'llms.txt',
  'llms-full.txt',
  'geo.txt',
  'agent-discovery.json',
  'schema.jsonld',
  'public/portfolio-updates.json'
];

const docsFiles = [
  'docs/index.html',
  'docs/404.html',
  'docs/agent-context.md',
  'docs/llms.txt',
  'docs/llms-full.txt',
  'docs/geo.txt',
  'docs/agent-discovery.json',
  'docs/schema.jsonld',
  'docs/portfolio-updates.json'
];

const positioningRules = [
  {
    name: 'defensive public proof framing',
    pattern: /\bpublic proof(?: first)?\b/i
  },
  {
    name: 'defensive proof question',
    pattern: /\bWhich projects prove\b/i
  },
  {
    name: 'public proof answer target',
    pattern: /\bWhat public proof is available\?/i
  },
  {
    name: 'Evidence label in generated public copy',
    pattern: /\bEvidence:\b/
  },
  {
    name: 'public evidence framing',
    pattern: /\bpublic evidence\b/i
  },
  {
    name: 'release evidence framing',
    pattern: /\brelease evidence\b/i
  },
  {
    name: 'delivery evidence framing',
    pattern: /\bdelivery evidence\b/i
  },
  {
    name: 'launch evidence framing',
    pattern: /\blaunch evidence\b/i
  },
  {
    name: 'marketplace evidence framing',
    pattern: /\bmarketplace(?: listing)? evidence\b/i
  },
  {
    name: 'evidence policy framing',
    pattern: /\bevidence policy\b/i
  },
  {
    name: 'evidence-led framing',
    pattern: /\bevidence-led\b/i
  },
  {
    name: 'evidence-backed framing',
    pattern: /\bevidence-backed\b/i
  },
  {
    name: 'evidence artifact framing',
    pattern: /\bevidence (?:packs?|surfaces?|loops?|assets?|capture|anchors?|carry|receipts?|fields?|posture|links?|gates?)\b/i
  },
  {
    name: 'proof artifact framing',
    pattern: /\bproof (?:packs?|cards?)\b/i
  },
  {
    name: 'old proof-labeled product alias',
    pattern: /\b(?:Browser Proof|GitHub Proof Tracker|Proof Card Forge)\b/
  },
  {
    name: 'prove phrasing',
    pattern: /\bproves?\b/i
  },
  {
    name: 'proof surface framing',
    pattern: /\bproof (?:exists|line|surfaces?|tracker sections?)\b/i
  },
  {
    name: 'leaked proof/evidence implementation naming',
    pattern: /\b(?:proofScore|proofItems|heroEvidenceRows|proof-grid|proof-chip|evidence-board|artifact-plot--evidence)\b/
  }
];

const allowedPositioningMatches = [
  {
    filePattern: /^(?:docs\/)?agent-discovery\.json$|^constants\.ts$/,
    ruleName: 'evidence artifact framing',
    linePattern: /"?(?:name)"?\s*:\s*"Evidence Pack Capture"/
  }
];

const isAllowedPositioningMatch = ({ file, rule, text }) =>
  allowedPositioningMatches.some(
    (allow) => allow.filePattern.test(file) && allow.ruleName === rule.name && allow.linePattern.test(text)
  );

const maybeReadFile = async (relativePath) => {
  const absolutePath = resolve(rootDir, relativePath);
  try {
    return await readFile(absolutePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
};

const collectMarkdownFiles = async (relativeDirectory) => {
  const directory = resolve(rootDir, relativeDirectory);
  try {
    const info = await stat(directory);
    if (!info.isDirectory()) return [];
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const childPath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) return collectMarkdownFiles(childPath);
      if (entry.isFile() && /\.md$/i.test(entry.name)) return [childPath];
      return [];
    })
  );
  return nested.flat();
};

const lineNumberForIndex = (content, index) => {
  let line = 1;
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (content.charCodeAt(cursor) === 10) line += 1;
  }
  return line;
};

const run = async () => {
  const files = new Set(sourceFiles);
  if (process.env.POSITIONING_SCAN_DOCS === 'true') {
    docsFiles.forEach((file) => files.add(file));
    for (const file of await collectMarkdownFiles('docs/codex')) {
      files.add(file);
    }
  }

  const failures = [];
  for (const relativePath of files) {
    const content = await maybeReadFile(relativePath);
    if (content === null) continue;
    for (const rule of positioningRules) {
      const match = rule.pattern.exec(content);
      if (!match) continue;
      const line = lineNumberForIndex(content, match.index);
      const lineText = content.split(/\r?\n/)[line - 1]?.trim() || match[0];
      if (isAllowedPositioningMatch({ file: relative(rootDir, resolve(rootDir, relativePath)), rule, text: lineText })) {
        continue;
      }
      failures.push({
        file: relative(rootDir, resolve(rootDir, relativePath)),
        line,
        rule: rule.name,
        text: lineText
      });
    }
  }

  if (failures.length > 0) {
    console.error('Positioning copy validation failed. Replace defensive proof/evidence framing with references, validation, metrics, or public signals.');
    failures.forEach((failure) => {
      console.error(`- ${failure.file}:${failure.line} [${failure.rule}] ${failure.text}`);
    });
    process.exitCode = 1;
    return;
  }

  console.log('Positioning copy validation passed.');
};

run().catch((error) => {
  console.error(error?.message || error);
  process.exitCode = 1;
});
