// Shared, side-effect-free search over the same public project records as the UI.
// URL paths and hidden artwork are not evidence of a project's capabilities.
const STOP_WORDS = new Set(['a', 'an', 'and', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'with']);

export const normalizeSearchValue = (value) => String(value ?? '')
  .normalize('NFKC').toLowerCase()
  .replace(/\br\s*(?:&|and)\s*d\b/g, 'researchdevelopment')
  .replace(/\bresearch\s+(?:and|&)\s+development\b/g, 'researchdevelopment')
  .replace(/&/g, ' and ')
  .replace(/[^\p{L}\p{N}+#.]+/gu, ' ')
  .replace(/(^|\s)\.+|\.+(?=\s|$)/g, '$1')
  .replace(/\s+/g, ' ').trim();

const singularTerm = (term) => {
  if (term.length > 5 && term.endsWith('ies')) return `${term.slice(0, -3)}y`;
  if (term.length > 4 && /(?:ches|shes|sses|xes)$/.test(term)) return term.slice(0, -2);
  if (term.length > 3 && term.endsWith('s') && !/(?:ss|is|us)$/.test(term)) return term.slice(0, -1);
  return term;
};

export const extractSearchTerms = (value) => [...new Set(normalizeSearchValue(value).split(' ')
  .filter((term) => term && !STOP_WORDS.has(term)).map(singularTerm))];

const fieldsFor = (project, sharedImages = new Set()) => [
  { text: project.title, weight: 20 },
  ...(project.aliases ?? []).map((text) => ({ text, weight: 11 })),
  { text: project.description, weight: 12 },
  { text: project.longDescription, weight: 7 },
  ...(project.techStack ?? []).map((text) => ({ text, weight: 10 })),
  ...(project.keyFeatures ?? []).map((text) => ({ text, weight: 8 })),
  ...(project.surfaceTags ?? []).map((text) => ({ text, weight: 6 })),
  ...(project.caseStudySections ?? []).flatMap((section) => [
    { text: section.title, weight: 12 }, { text: section.body, weight: 11 },
  ]),
  ...(project.hideImages ? [] : project.images ?? []).flatMap((image) => [
    { text: image.caption, weight: 6, owned: !sharedImages.has(image.url) },
    { text: image.alt, weight: 4, owned: !sharedImages.has(image.url) },
  ]),
  ...(project.benchmarks ?? []).map((metric) => ({
    text: `${metric.label} ${metric.value} ${metric.context ?? ''}`, weight: 3, owned: false,
  })),
  { text: project.topologySnapshot, weight: 3 },
  // Index diagram labels without admitting Mermaid identifiers or syntax.
  { text: [...(project.mermaidDiagram ?? '').matchAll(/"([^"\n]+)"/g)].map((match) => match[1]).join(' '), weight: 3 },
  ...(project.links ?? []).map((link) => ({ text: link.text, weight: 1, owned: false })),
].filter(({ text }) => typeof text === 'string' && text.trim());

export const getProjectSearchText = (project) => fieldsFor(project).map(({ text }) => text).join(' ').toLowerCase();

const phraseTokens = (value) => normalizeSearchValue(value).split(' ').filter(Boolean).map(singularTerm);
const containsPhrase = (tokens, phrase) => {
  if (!phrase.length) return false;
  return tokens.some((_, index) => phrase.every((term, offset) => tokens[index + offset] === term));
};

// These are directional query equivalents, grounded in the catalogue's terms.
// A search for ONNX or OpenCV itself always requires that literal technology.
const TERM_EQUIVALENTS = {
  pointcloud: ['point cloud'],
  recognition: ['ocr', 'document extraction'],
  inference: ['model runtime', 'onnx', 'tflite', 'coreml', 'tensorrt', 'ml kit'],
  mobile: ['ios', 'android'],
  comfy: ['comfyui'],
  tg: ['telegram'],
  tma: ['telegram mini app'],
  vlm: ['vision language model'],
  llm: ['language model'],
  embedding: ['embeddings'],
  user: ['people'],
};
const PHRASE_EQUIVALENTS = {
  'point cloud': ['pointcloud'],
  'computer vision': ['cv', 'opencv'],
};

const makeConcepts = (query) => {
  let tokens = extractSearchTerms(query);
  const concepts = [];
  for (const [phrase, alternatives] of Object.entries(PHRASE_EQUIVALENTS)) {
    const parts = extractSearchTerms(phrase);
    if (!containsPhrase(tokens, parts)) continue;
    concepts.push([parts, ...alternatives.map(phraseTokens)]);
    const start = tokens.findIndex((_, index) => parts.every((term, offset) => tokens[index + offset] === term));
    tokens = [...tokens.slice(0, start), ...tokens.slice(start + parts.length)];
  }
  for (const term of tokens) {
    concepts.push([[term], ...(TERM_EQUIVALENTS[term] ?? []).map(phraseTokens)]);
  }
  return concepts;
};

const compactName = (value) => normalizeSearchValue(value).replace(/\s/g, '');
const compactNameMatch = (project, query) => {
  const compactQuery = compactName(query);
  if (!compactQuery) return false;
  // A category-prefixed title also declares its complete name after the colon,
  // e.g. "Python Library: AutoToloka". No individual title words become aliases.
  const categorySuffix = project.title.includes(':') ? project.title.slice(project.title.indexOf(':') + 1).trim() : '';
  return [project.title, ...(project.aliases ?? []), categorySuffix].some((name) => compactName(name) === compactQuery);
};

const isSupportingCollection = (project) => /\b(?:archive|collection|skills|skill pack|skill library)\b/i.test(project.title);
const studyTier = (project, query) => {
  if (isSupportingCollection(project) && !/\b(?:archive|collection|skills?)\b/i.test(query)) return 0;
  return project.projectKind === 'case-study' || project.caseStudySections?.length ? 2 : 1;
};

const rankEntry = (project, query, concepts, boostedProjectIds, getSignalScore, sharedImages) => {
  const fields = fieldsFor(project, sharedImages).map((field) => ({ ...field, tokens: phraseTokens(field.text) }));
  const exactName = compactNameMatch(project, query);
  const strengths = concepts.map((alternatives) => Math.max(0, ...fields.map((field) => {
    const match = alternatives.findIndex((phrase) => containsPhrase(field.tokens, phrase));
    return match < 0 ? 0 : field.weight * (match === 0 ? 1 : 0.8);
  })));
  const topicIndex = boostedProjectIds.indexOf(project.id);
  const ownedMatch = exactName || (concepts.length > 0 && concepts.every((alternatives) =>
    fields.some((field) => field.owned !== false && alternatives.some((phrase) => containsPhrase(field.tokens, phrase)))));
  const phrase = phraseTokens(query);
  const phraseScore = Math.max(0, ...fields.map((field) => containsPhrase(field.tokens, phrase) ? field.weight * 3 : 0));
  return {
    project, exactName, matches: ownedMatch || topicIndex >= 0,
    // Bounded field strengths prevent a long archive from winning by repetition.
    score: (topicIndex < 0 ? 0 : 10000 - topicIndex * 100)
      + (exactName ? 5000 : 0) + studyTier(project, query) * 25
      + strengths.reduce((sum, value) => sum + value, 0) * 4 + phraseScore
      + Math.min(100, Math.max(0, getSignalScore(project))) * 0.02,
  };
};

const dateValue = (project) => Date.parse(project.createdAt ?? '') || 0;
export const searchProjects = (projects, query, {
  boostedProjectIds = [], sort = 'impact', getSignalScore = () => 0, catalogue = projects,
} = {}) => {
  const normalized = normalizeSearchValue(query);
  const concepts = makeConcepts(query);
  const imageUse = new Map();
  for (const project of catalogue) {
    for (const url of new Set((project.images ?? []).map((image) => image.url).filter(Boolean))) {
      imageUse.set(url, (imageUse.get(url) ?? 0) + 1);
    }
  }
  const sharedImages = new Set([...imageUse].filter(([, uses]) => uses > 1).map(([url]) => url));
  const ranked = projects.map((project) => normalized
    ? rankEntry(project, query, concepts, boostedProjectIds, getSignalScore, sharedImages)
    : { project, matches: true, exactName: false, score: getSignalScore(project) });
  const hasExactName = normalized && ranked.some((entry) => entry.exactName);
  return ranked.filter((entry) => entry.matches
    && (!hasExactName || entry.exactName || boostedProjectIds.includes(entry.project.id)))
    .sort((a, b) => {
      if (sort === 'alpha') return a.project.title.localeCompare(b.project.title) || a.project.id - b.project.id;
      if (sort === 'recent') return dateValue(b.project) - dateValue(a.project) || b.project.id - a.project.id;
      return b.score - a.score || dateValue(b.project) - dateValue(a.project) || b.project.id - a.project.id;
    }).map(({ project }) => project);
};
