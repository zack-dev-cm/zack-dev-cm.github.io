import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_INPUT = path.resolve(ROOT_DIR, 'marketing', 'trend-blog-signals.example.json');
const DEFAULT_OUTPUT_DIR = path.resolve(ROOT_DIR, 'marketing', 'generated');

const SOURCE_WEIGHTS = new Map([
  ['official-changelog', 22],
  ['repo-release', 18],
  ['research-feed', 17],
  ['use-case-library', 16],
  ['computer-use-capture', 10],
  ['x-public-signal', 10],
]);

const KEYWORD_WEIGHTS = new Map([
  ['deepseek', 10],
  ['codex', 9],
  ['skill', 9],
  ['computer use', 8],
  ['agent', 8],
  ['agentic', 8],
  ['llm', 7],
  ['computer vision', 7],
  ['ocr', 7],
  ['segmentation', 6],
  ['benchmark', 6],
  ['eval', 6],
  ['migration', 5],
  ['x algorithm', 5],
]);

const STATUS_FOR_SCORE = (score) => {
  if (score >= 85) return 'ready-to-write';
  if (score >= 75) return 'draft-next';
  if (score >= 65) return 'skill-candidate';
  return 'watch';
};

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));

const normalizeText = (value) => String(value || '').toLowerCase();

const scoreSignal = (signal) => {
  const sourceType = signal.sourceType || signal.monitorMode || signal.sourceId || '';
  const sourceScore = SOURCE_WEIGHTS.get(sourceType) ?? 8;
  const haystack = normalizeText([
    signal.title,
    signal.summary,
    signal.candidateSkill,
    ...(signal.topics || []),
    ...(signal.evidence || []),
  ].join(' '));

  let keywordScore = 0;
  const matchedKeywords = [];
  for (const [keyword, weight] of KEYWORD_WEIGHTS.entries()) {
    if (haystack.includes(keyword)) {
      keywordScore += weight;
      matchedKeywords.push(keyword);
    }
  }

  const evidenceCount = Array.isArray(signal.evidence) ? signal.evidence.filter(Boolean).length : 0;
  const evidenceScore = Math.min(18, evidenceCount * 6);
  const skillScore = (signal.candidateSkill ? 12 : 0) + Math.min(12, (signal.existingSkillLinks || []).length * 6);
  const articleScore = signal.summary && signal.summary.split(/\s+/).length >= 16 ? 10 : 4;
  const safetyScore = signal.publicSafe === false ? -30 : 10;

  const rawScore = sourceScore + Math.min(24, keywordScore) + evidenceScore + skillScore + articleScore + safetyScore;
  const score = Math.max(0, Math.min(100, rawScore));
  return {
    ...signal,
    score,
    status: STATUS_FOR_SCORE(score),
    matchedKeywords,
    missingForPublish: [
      signal.publicSafe === false ? 'Needs redaction or non-public data removal.' : '',
      evidenceCount < 2 ? 'Add at least two public evidence points.' : '',
      !signal.candidateSkill ? 'Name the skill, CLI, checklist, or workflow artifact.' : '',
      !(signal.existingSkillLinks || []).length ? 'Link an existing public skill/project or mark this as a net-new skill.' : '',
    ].filter(Boolean),
  };
};

const buildMarkdown = (briefs, inputPath) => {
  const lines = [
    '# Trend-to-Skill Blog Briefs',
    '',
    `Input: ${path.relative(ROOT_DIR, inputPath)}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Ranked Briefs',
    ...briefs.flatMap((brief, index) => [
      `### ${index + 1}. ${brief.title}`,
      `- Score: ${brief.score}/100`,
      `- Status: ${brief.status}`,
      `- Source: ${brief.sourceId || brief.sourceType || 'unknown'}`,
      `- URL: ${brief.url || 'not provided'}`,
      `- Topics: ${(brief.topics || []).join(', ') || 'not tagged'}`,
      `- Skill candidate: ${brief.candidateSkill || 'not named'}`,
      `- Summary: ${brief.summary || 'No summary.'}`,
      `- Matched keywords: ${brief.matchedKeywords.join(', ') || 'none'}`,
      ...(brief.existingSkillLinks || []).map((link) => `- Public skill/project: [${link.text}](${link.url})`),
      ...(brief.missingForPublish.length ? ['- Missing before article:', ...brief.missingForPublish.map((item) => `  - ${item}`)] : ['- Missing before article: none']),
      '',
    ]),
    '## Editorial Gate',
    '- Use X only for discovery unless the claim has a second public source.',
    '- Convert a trend into a reader win: test plan, checklist, skill, CLI, or reproducible lab gate.',
    '- Keep final copy human-authored and factual; do not publish hype claims without public proof.',
    '',
  ];
  return lines.join('\n');
};

const main = async () => {
  const inputPath = path.resolve(process.argv[2] || DEFAULT_INPUT);
  const outputDir = path.resolve(process.argv[3] || DEFAULT_OUTPUT_DIR);
  const signals = await readJson(inputPath);
  if (!Array.isArray(signals)) {
    throw new Error(`Expected ${path.relative(ROOT_DIR, inputPath)} to contain a JSON array.`);
  }

  const briefs = signals
    .map(scoreSignal)
    .sort((a, b) => b.score - a.score || String(a.title).localeCompare(String(b.title)));

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.resolve(outputDir, 'trend-blog-briefs.json'), `${JSON.stringify(briefs, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.resolve(outputDir, 'trend-blog-briefs.md'), buildMarkdown(briefs, inputPath), 'utf8');
  console.log(`Wrote ${briefs.length} trend blog briefs to ${path.relative(ROOT_DIR, outputDir)}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
