// Shared, side-effect-free search over the same public project records as the UI.
// URL paths and hidden artwork are not evidence of a project's capabilities.
const STOP_WORDS = new Set(['a', 'an', 'and', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'with',
  'looking', 'find', 'show', 'me', 'work', 'experience', 'experienced', 'engineer', 'engineers', 'senior', 'junior', 'projects']);

export const normalizeSearchValue = (value) => String(value ?? '')
  .normalize('NFKC').toLowerCase()
  .replace(/\br\s*(?:&|and)\s*d\b/g, 'research development')
  .replace(/\bresearch\s+(?:and|&)\s+development\b/g, 'research development')
  .replace(/\bnode(?:\.|\s+)js\b/g, 'nodejs')
  .replace(/\bml[\s-]+ops\b/g, 'mlops')
  .replace(/\b3[\s-]+d\b/g, '3d')
  .replace(/&/g, ' and ')
  .replace(/[^\p{L}\p{N}+#.]+/gu, ' ')
  .replace(/(^|\s)\.+|\.+(?=\s|$)/g, '$1')
  .replace(/\s+/g, ' ').trim();

// A small technical vocabulary, not unrestricted stemming: C/C++/C#, short
// acronyms and literal technology names must retain their meaning.
const WORD_FORMS = {
  benchmarking: 'benchmark', benchmarks: 'benchmark',
  evaluation: 'evaluate', evaluations: 'evaluate', evaluating: 'evaluate', eval: 'evaluate', evals: 'evaluate',
  testing: 'test', tests: 'test', tested: 'test',
  optimisation: 'optimization', optimisations: 'optimization', optimizations: 'optimization',
  optimize: 'optimization', optimizing: 'optimization', optimise: 'optimization', optimising: 'optimization',
  agentic: 'agent', agents: 'agent',
};
const singularTerm = (term) => {
  if (WORD_FORMS[term]) return WORD_FORMS[term];
  if (term.length > 5 && term.endsWith('ies')) return `${term.slice(0, -3)}y`;
  if (term.length > 4 && /(?:ches|shes|sses|xes)$/.test(term)) return term.slice(0, -2);
  if (term.length > 3 && term.endsWith('s') && !/(?:ss|is|us)$/.test(term)) return term.slice(0, -1);
  return term;
};

export const extractSearchTerms = (value) => normalizeSearchValue(value).split(' ')
  .filter((term) => term && !STOP_WORDS.has(term)).map(singularTerm);

// Narratives remain visible verbatim. Only affirmative clauses establish a
// search capability. This conservative guard complements reviewed capability
// metadata; it is not a general natural-language claim verifier.
const affirmativeText = (text) => String(text ?? '').split(/(?<=[.!?])\s+|;\s*|\n/)
  // A leading operating constraint can precede a separate positive predicate.
  .map((clause) => clause.replace(/^\s*without\b[^,]+,\s*/i, ''))
  // Do not retain the subject of a negated predicate as a positive claim.
  .filter((clause) => !/\b(?:is|are|was|were|do|does|did|will|would|has|have)\s+(?:not|never)\b|\b(?:cannot|can['’]t|isn['’]t|aren['’]t|doesn['’]t|don['’]t|won['’]t)\b/i.test(clause))
  .filter((clause) => !/\b(?:still needs?|remain(?:s)? (?:separate )?research goals?|not yet)\b/i.test(clause))
  .map((clause) => clause.split(/\b(?:no|not|without|rather than|instead of|avoid(?:s|ing)?|exclude(?:s|d)?|inspired by|informed by)\b|\b(?:for|so) (?:agents|recruiters)\b/i)[0])
  .filter((clause) => clause.trim()).join('. ');

const fieldsFor = (project, sharedImages = new Set()) => [
  { text: project.title, weight: 20 },
  ...(project.aliases ?? []).map((text) => ({ text, weight: 11 })),
  ...(project.searchProfile?.capabilities ?? []).map((text) => ({ text, weight: 14 })),
  { text: project.projectKind === 'research' ? 'research development' : '', weight: 16 },
  { text: project.description, weight: 18 },
  { text: project.longDescription, weight: 7 },
  ...(project.techStack ?? []).map((text) => ({ text, weight: 10 })),
  ...(project.keyFeatures ?? []).map((text) => ({ text, weight: 8 })),
  ...(project.surfaceTags ?? []).map((text) => ({ text, weight: 6 })),
  ...(project.caseStudySections ?? []).flatMap((section) => [
    { text: section.title, weight: 12, owned: !/limitations?|future work|next steps|research goals/i.test(section.title) },
    { text: section.body, weight: 11, owned: !/limitations?|future work|next steps|research goals/i.test(section.title) },
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
  ml: ['machine learning'],
  rag: ['retrieval augmented generation'],
  dl: ['deep learning'],
  evaluate: ['validation', 'benchmark', 'regression comparisons'],
  benchmark: ['benchmarking'],
  embedding: ['embeddings'],
  user: ['people'],
};
const PHRASE_EQUIVALENTS = {
  'large language model': ['llm', 'language model'],
  'retrieval augmented generation': ['rag'],
  'machine learning': ['ml'],
  'deep learning': ['dl'],
  'research development': ['research'],
  'language model': ['llm'],
  'document processing': ['document extraction', 'document intelligence', 'document ai'],
  'semantic search': ['semantic retrieval'],
  'model serving': ['inference server', 'inference serving'],
  'harness engineering': ['harness'],
  // Preserve the relationship in compound tasks. Separate image inputs and
  // report generation do not constitute image generation.
  'image generation': ['image synthesis', 'text to image', 'text2image'],
  'text to image': ['image generation', 'image synthesis', 'text2image'],
  'text generation': ['text synthesis', 'language generation'],
  'video generation': ['video synthesis', 'text to video'],
  'report generation': ['report writing', 'report drafting'],
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
const declaredNames = (project) => {
  // A category-prefixed title also declares its complete name after the colon,
  // e.g. "Python Library: AutoToloka". No individual title words become aliases.
  const categorySuffix = project.title.includes(':') ? project.title.slice(project.title.indexOf(':') + 1).trim() : '';
  return [project.title, ...(project.aliases ?? []), categorySuffix].map(compactName).filter(Boolean);
};
const compactNameMatch = (project, query) => declaredNames(project).includes(compactName(query));

const hasOwnedConcepts = (fields, concepts) => concepts.every((alternatives) =>
  fields.some((field) => field.owned !== false && alternatives.some((phrase) => containsPhrase(field.tokens, phrase))));

const qualifiedNameMatch = (project, query, fields) => {
  const tokens = normalizeSearchValue(query).split(' ').filter(Boolean);
  // Consume only a complete declared name at token boundaries. Spaced and
  // compact names can then compose with qualifiers without weakening coverage.
  for (const name of declaredNames(project)) {
    for (let start = 0; start < tokens.length; start += 1) {
      let span = '';
      for (let end = start; end < tokens.length; end += 1) {
        span += tokens[end];
        if (span.length > name.length) break;
        if (span !== name) continue;
        const remaining = [...tokens.slice(0, start), ...tokens.slice(end + 1)].join(' ');
        if (hasOwnedConcepts(fields, makeConcepts(remaining))) return true;
      }
    }
  }
  return false;
};

const isSupportingCollection = (project) => /\b(?:archive|collection|skills|skill pack|skill library)\b/i.test(project.title);
const evidenceScore = (project, query) => {
  const evidence = project.searchProfile?.evidence;
  if (evidence === 'name-only') return -250;
  if (evidence === 'workflow') return 30;
  if (evidence === 'summary') return 0;
  if (evidence === 'implementation') return 180;
  if (isSupportingCollection(project) && !/\b(?:archive|collection|skills?)\b/i.test(query)) return 0;
  if (project.caseStudySections?.length) return 120;
  if (project.projectKind === 'case-study' || project.projectKind === 'research') return 80;
  return (project.keyFeatures?.length ?? 0) >= 3 ? 40 : 0;
};

const rankEntry = (project, query, concepts, boostedProjectIds, getSignalScore, sharedImages) => {
  const fields = fieldsFor(project, sharedImages)
    .map((field) => ({ ...field, tokens: phraseTokens(affirmativeText(field.text)) }));
  const exactName = compactNameMatch(project, query);
  const qualifiedName = !exactName && qualifiedNameMatch(project, query, fields);
  const ownedFields = fields.filter((field) => field.owned !== false);
  const strengths = concepts.map((alternatives) => Math.max(0, ...ownedFields.map((field) => {
    const match = alternatives.findIndex((phrase) => containsPhrase(field.tokens, phrase));
    return match < 0 ? 0 : field.weight * (match === 0 ? 1 : 0.8);
  })));
  const topicIndex = boostedProjectIds.indexOf(project.id);
  const ownedMatch = exactName || qualifiedName || (concepts.length > 0 && hasOwnedConcepts(fields, concepts));
  const phrase = phraseTokens(query);
  const phraseScore = Math.max(0, ...ownedFields.map((field) => containsPhrase(field.tokens, phrase) ? field.weight * 3 : 0));
  return {
    project, exactName, matches: ownedMatch,
    // Bounded field strengths prevent a long archive from winning by repetition.
    score: (topicIndex < 0 ? 0 : 10000 - topicIndex * 100)
      + (exactName ? 5000 : qualifiedName ? 250 : 0) + evidenceScore(project, query)
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
  // Names improve ordering. A generic descriptive alias must never delete
  // another independently supported result from the discovery set.
  return ranked.filter((entry) => entry.matches)
    .sort((a, b) => {
      if (sort === 'alpha') return a.project.title.localeCompare(b.project.title) || a.project.id - b.project.id;
      if (sort === 'recent') return dateValue(b.project) - dateValue(a.project) || b.project.id - a.project.id;
      return b.score - a.score || dateValue(b.project) - dateValue(a.project) || b.project.id - a.project.id;
    }).map(({ project }) => project);
};
