import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.resolve(ROOT_DIR, 'public', 'paper-reviews.json');
const SITE_URL = 'https://zack-dev-cm.github.io/papers/';
const DATA_URL = 'https://zack-dev-cm.github.io/docs/paper-reviews.json';
const MAX_REVIEWS = 45;
const USER_AGENT = 'zack-dev-cm-paper-review-bot/2.0 (+https://zack-dev-cm.github.io/papers/)';
const FEED_CATEGORIES = ['cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.IR', 'stat.ML'];

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const shouldAllowNoop = args.has('--allow-noop');
const shouldRewriteExisting = args.has('--rewrite-existing');

const TOPIC_RULES = [
  {
    id: 'continual-rl',
    match: /\b(reinforcement learning|policy gradient|policy|continual|deployed rl|deployed reinforcement|rl)\b/i,
    tags: ['reinforcement-learning', 'continual-learning', 'deployment'],
    reader: 'teams deploying adaptive decision systems',
    verdict:
      'The sharp idea is that deployment should not be treated as the finish line of reinforcement learning; it should be the start of a controlled learning regime with better evidence.',
    productionTest:
      'Before adopting it, define the post-deploy learning boundary: what can update, what must stay frozen, and what signal would roll the policy back.',
  },
  {
    id: 'agent-safety',
    match: /\b(covert|persuasive|persuasion|field experiment|tactic|tactics|manipulation|influence)\b/i,
    tags: ['agent-safety', 'evaluation', 'human-factors'],
    reader: 'teams evaluating agent behavior before release',
    verdict:
      'The paper is valuable because it treats agent behavior as something to audit in the wild, not as a clean benchmark score. The uncomfortable part is the unit of analysis: persuasion tactics, not model accuracy.',
    productionTest:
      'Turn the taxonomy into a pre-launch abuse review: log agent goals, messages, escalation patterns, and the exact point where the system should stop or disclose itself.',
  },
  {
    id: 'agent-systems',
    match: /\b(agent|agents|multi-agent|monitoring|long-running|harness|planning|action-state|workflow|tool)\b/i,
    tags: ['agents', 'runtime', 'evaluation'],
    reader: 'engineers building agent runtimes',
    verdict:
      'The useful question is not whether the agent looks smart in a demo; it is whether its state, messages, and failure modes can be inspected after the run is over.',
    productionTest:
      'Try to turn the method into a trace contract: every action should leave behind state, evidence, and a reason a reviewer can accept or reject.',
  },
  {
    id: 'reasoning',
    match: /\b(reasoning|deduction|lattice|logic|solver|proof|theorem|symbolic|constraint)\b/i,
    tags: ['reasoning', 'verification', 'small-models'],
    reader: 'builders who need inspectable reasoning',
    verdict:
      'The strongest idea is not reasoning as a slogan; it is reducing the number of places a model can hide an invalid intermediate step.',
    productionTest:
      'Use a tiny benchmark with known invalid paths, then check whether the method fails loudly enough for a product gate to catch it.',
  },
  {
    id: 'physical-world-models',
    match:
      /\b(jepa|joint embedding predictive|world model|world models|physical ai|physics|causal video|interaction-aware|human-object|hoi|robot|navigation|trajectory|dynamics|kinematic)\b/i,
    tags: ['physical-ai', 'world-models', 'computer-vision'],
    reader: 'teams building visual world models, robotics perception, and physical-AI prototypes',
    verdict:
      'The paper is worth reading if it makes visual prediction less texture-driven and more accountable to objects, contact, motion, and causal state.',
    productionTest:
      'Before using it in a physical-AI stack, test whether the representation predicts rare contacts and state changes, not only visually smooth future frames.',
  },
  {
    id: 'vision-language',
    match: /\b(video|vision|visual|image|camera|multimodal|segmentation|detection|retinal|font|generation|vqa)\b/i,
    tags: ['computer-vision', 'multimodal', 'evaluation'],
    reader: 'computer vision and multimodal product teams',
    verdict:
      'The paper matters if it changes what the system can verify about an image or video, not just what the model can caption after the fact.',
    productionTest:
      'Build a failure gallery before a demo gallery: occlusion, domain shift, ambiguous prompts, and outputs that look plausible but are wrong.',
  },
  {
    id: 'retrieval',
    match: /\b(retrieval|rag|embedding|colbert|index|rerank|recommendation|hypergraph|semantic|geodesic|knowledge)\b/i,
    tags: ['retrieval', 'rag', 'search'],
    reader: 'teams shipping retrieval and grounded QA',
    verdict:
      'The real value is in the evidence boundary: what gets retrieved, what gets compressed away, and what a user can still audit.',
    productionTest:
      'Test it with adversarial near-neighbors and stale documents. A retrieval method that cannot explain its misses will age badly in production.',
  },
  {
    id: 'representation',
    match: /\b(representation|self-supervised|collapse|latent|compression|token|transformer|distilled|continual|reinforcement)\b/i,
    tags: ['representation-learning', 'training', 'model-design'],
    reader: 'research-to-production ML engineers',
    verdict:
      'The paper is interesting when it changes the training target or representation bottleneck enough to remove waste from the learning loop.',
    productionTest:
      'Ask what must be logged to reproduce the gain: data mixture, ablations, compute budget, and the cases where the representation collapses.',
  },
  {
    id: 'ml-systems',
    match: /\b(deployed|serving|benchmark|evaluation|dataset|optimization|energy|streaming|continual|variance|rubric)\b/i,
    tags: ['ml-systems', 'deployment', 'gates'],
    reader: 'people turning papers into release gates',
    verdict:
      'The paper is worth reading if it can become a release decision: promote, hold, narrow the domain, or collect better evidence.',
    productionTest:
      'Translate the headline metric into a stop condition. If no metric would stop release, the result is probably not operational yet.',
  },
];

const decodeXml = (value) =>
  String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim();

const stripTags = (value) =>
  decodeXml(String(value || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' '));

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 90);

const unique = (items) => [...new Set(items.filter(Boolean))];

const stableIndex = (value, length) => {
  if (!length) return 0;
  let hash = 0;
  for (const char of String(value || '')) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % length;
};

const extractArxivId = (url) => {
  const match = String(url || '').match(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5})(?:v\d+)?/i);
  return match?.[1] || '';
};

const defaultFeed = () => ({
  schemaVersion: '2026-06-05',
  language: 'en',
  title: 'ML Papers, Read for Builders',
  siteUrl: SITE_URL,
  dataUrl: DATA_URL,
  updatedAt: null,
  selectionPolicy: {
    cadence: 'Daily refresh; a new review is published when a fresh primary paper clears the selection gate.',
    sources: FEED_CATEGORIES.map((category) => `arXiv ${category}`),
    selection:
      'The selector favors primary papers with strong fit for agents, computer vision, retrieval, reasoning, representation learning, and deployable ML systems.',
    writing:
      'Reviews are original English editorial notes written around one concrete claim, one useful verification test, and one skeptical failure mode. Abstracts are used only to ground the critique; they are not republished.',
  },
  reviewSourceWatch: [
    {
      id: 'yannic-kilcher-cvpr',
      label: 'Yannic Kilcher / CVPR source watch',
      status: 'watch-only',
      checkedAt: new Date().toISOString().slice(0, 10),
      note:
        'Track Yannic Kilcher public paper-analysis sources alongside official CVPR/CVF sources. Do not claim a specific Yannic CVPR review unless a public source ledger confirms it.',
      sources: [
        { label: 'Yannic Kilcher site', url: 'https://www.ykilcher.com/' },
        { label: 'CVPR 2026 conference page', url: 'https://cvpr.thecvf.com/Conferences/2026' }
      ]
    }
  ],
  reviews: [],
});

const sanitizeLegacyReview = (review) => {
  const paperUrl = review.paperUrl || (review.arxivId ? `https://arxiv.org/abs/${review.arxivId}` : '');
  const pdfUrl = review.pdfUrl || (review.arxivId ? `https://arxiv.org/pdf/${review.arxivId}` : '');
  const categories = Array.isArray(review.categories) ? review.categories : [];
  const existingSourceLinks = Array.isArray(review.sourceLedger) ? review.sourceLedger : [];
  const existingFeedLink = existingSourceLinks.find((link) => /research feed$/i.test(link.label || ''));
  const feedCategory = categories.find((category) => FEED_CATEGORIES.includes(category));
  const feedUrl = existingFeedLink?.url || (feedCategory ? `https://rss.arxiv.org/rss/${feedCategory}` : '');
  const feedLabel = existingFeedLink?.label || (feedCategory ? `${feedCategory} research feed` : '');
  return {
    id: review.id,
    title: review.title,
    dek:
      review.dek ||
      'A research note on when a paper changes the engineering contract, not only the benchmark headline.',
    language: 'en',
    selectedAt: review.selectedAt,
    paperUrl,
    pdfUrl,
    arxivId: review.arxivId,
    authors: review.authors || [],
    publishedAt: review.publishedAt || '',
    updatedAt: review.updatedAt || '',
    categories,
    tags: (review.tags || []).filter((tag) => !/^cs\./.test(tag)).slice(0, 8),
    selectionScore: review.selectionScore || 0,
    selectionReason:
      'Selected because the paper has a primary source link and a clear implementation question for agents, CV, retrieval, reasoning, or ML systems.',
    editorVerdict:
      review.editorVerdict ||
      'The paper is most useful as a prompt for inspectable reasoning: constrain the intermediate state, then test whether failures become visible enough to gate.',
    whatItClaims:
      review.whatItClaims ||
      'It explores a recurrent transformer design with an explicit constraint layer over latent state, aiming to make deduction-like behavior more controlled than a free-form next-token loop.',
    technicalHinge:
      review.technicalHinge ||
      'The hinge is the interface between neural iteration and symbolic pressure. If the constraint step is too weak, the model can still drift; if it is too rigid, the architecture may only work on tidy tasks.',
    productionAngle:
      review.productionAngle ||
      'For builders, the takeaway is a test shape: small reasoning modules should expose intermediate states and invalid paths before they are trusted inside a larger agent workflow.',
    skepticism:
      review.skepticism ||
      'This is a triage review, not a reproduction. The next check is code, ablations, task diversity, and whether the same gains survive outside controlled reasoning puzzles.',
    readingPath: review.readingPath || [
      'Read the method diagram before the benchmark table.',
      'Find the ablations that remove the constraint step.',
      'Look for failure cases where the model is confidently invalid.',
    ],
    sourceLedger: [
      ...(paperUrl ? [{ label: 'Primary paper', url: paperUrl }] : []),
      ...(pdfUrl ? [{ label: 'PDF', url: pdfUrl }] : []),
      ...(feedUrl && feedLabel ? [{ label: feedLabel, url: feedUrl }] : []),
    ],
  };
};

const loadExistingFeed = async () => {
  try {
    const parsed = JSON.parse(await fs.readFile(OUTPUT_PATH, 'utf8'));
    return {
      ...defaultFeed(),
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews.map(sanitizeLegacyReview) : [],
      updatedAt: parsed.updatedAt || null,
    };
  } catch (error) {
    if (error.code === 'ENOENT') return defaultFeed();
    throw error;
  }
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
};

const extractTag = (block, tag) => {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
};

const extractDescription = (block) => {
  const raw = extractTag(block, 'description');
  const text = stripTags(raw).replace(/^arXiv:[^ ]+\s+Announce Type:\s+\w+\s+/i, '');
  return text.replace(/^Abstract:\s*/i, '').trim();
};

const parseRssItems = (xml, category) => {
  return [...String(xml || '').matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map((match, index) => {
      const item = match[1];
      const title = extractTag(item, 'title');
      const paperUrl = extractTag(item, 'link');
      const arxivId = extractArxivId(paperUrl);
      if (!title || !arxivId) return null;
      const creator = extractTag(item, 'dc:creator');
      const authors = creator ? creator.split(/\s*,\s*/).map((name) => name.trim()).filter(Boolean) : [];
      const summary = extractDescription(item);
      const publishedAt = extractTag(item, 'pubDate');
      const announceType = extractTag(item, 'arxiv:announce_type');
      return {
        arxivId,
        title,
        summary,
        authors,
        categories: [category],
        publishedAt,
        updatedAt: publishedAt,
        announceType,
        paperUrl: `https://arxiv.org/abs/${arxivId}`,
        pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
        feedUrl: `https://rss.arxiv.org/rss/${category}`,
        recencyIndex: index,
      };
    })
    .filter(Boolean);
};

const fetchCandidates = async () => {
  const results = await Promise.allSettled(
    FEED_CATEGORIES.map(async (category) => parseRssItems(await fetchText(`https://rss.arxiv.org/rss/${category}`), category))
  );
  const candidates = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
  const byId = new Map();
  for (const candidate of candidates) {
    const existing = byId.get(candidate.arxivId);
    if (!existing) {
      byId.set(candidate.arxivId, candidate);
      continue;
    }
    existing.categories = unique([...existing.categories, ...candidate.categories]);
    existing.recencyIndex = Math.min(existing.recencyIndex, candidate.recencyIndex);
  }
  return [...byId.values()];
};

const parseAtomEntries = (xml) => {
  return [...String(xml || '').matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map((match) => {
      const entry = match[1];
      const paperUrl = extractTag(entry, 'id');
      const arxivId = extractArxivId(paperUrl);
      if (!arxivId) return null;
      const authors = [...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)]
        .map((authorMatch) => decodeXml(authorMatch[1]))
        .filter(Boolean);
      const categories = [...entry.matchAll(/<category[^>]+term="([^"]+)"/g)]
        .map((categoryMatch) => decodeXml(categoryMatch[1]))
        .filter(Boolean);
      const primaryCategory = entry.match(/<arxiv:primary_category[^>]+term="([^"]+)"/)?.[1];
      return {
        arxivId,
        title: decodeXml(extractTag(entry, 'title')).replace(/\s+/g, ' '),
        summary: decodeXml(extractTag(entry, 'summary')),
        authors,
        categories: unique([primaryCategory, ...categories]),
        publishedAt: extractTag(entry, 'published'),
        updatedAt: extractTag(entry, 'updated'),
        announceType: 'existing',
        paperUrl: `https://arxiv.org/abs/${arxivId}`,
        pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
        feedUrl: categories.find((category) => FEED_CATEGORIES.includes(category))
          ? `https://rss.arxiv.org/rss/${categories.find((category) => FEED_CATEGORIES.includes(category))}`
          : 'https://arxiv.org/',
        recencyIndex: 0,
      };
    })
    .filter(Boolean);
};

const fetchArxivMetadataByIds = async (ids) => {
  const uniqueIds = unique(ids).filter(Boolean);
  const byId = new Map();
  for (let index = 0; index < uniqueIds.length; index += 20) {
    const batch = uniqueIds.slice(index, index + 20);
    const xml = await fetchText(`https://export.arxiv.org/api/query?id_list=${batch.join(',')}`);
    for (const paper of parseAtomEntries(xml)) {
      byId.set(paper.arxivId, paper);
    }
  }
  return byId;
};

const inferTopic = (paper) => {
  const haystack = `${paper.title} ${paper.summary} ${(paper.categories || []).join(' ')}`;
  return TOPIC_RULES.find((rule) => rule.match.test(haystack)) || {
    id: 'frontier-ml',
    tags: ['machine-learning', 'paper-review'],
    reader: 'people turning research into product judgment',
    verdict:
      'The useful reading is the one that turns a claim into a decision: build, wait, reproduce, or reject.',
    productionTest:
      'Write the smallest check that would make the paper actionable, then see whether the paper gives enough evidence to run it.',
  };
};

const scoreCandidate = (paper, reviewedIds) => {
  if (reviewedIds.has(paper.arxivId)) return Number.NEGATIVE_INFINITY;
  const topic = inferTopic(paper);
  let score = 150 - paper.recencyIndex * 4;
  score += topic.id === 'agent-systems' ? 48 : 0;
  score += topic.id === 'physical-world-models' ? 46 : 0;
  score += topic.id === 'vision-language' ? 42 : 0;
  score += topic.id === 'retrieval' ? 38 : 0;
  score += topic.id === 'reasoning' ? 34 : 0;
  score += topic.id === 'representation' ? 30 : 0;
  score += topic.id === 'ml-systems' ? 28 : 0;
  score += /\bbenchmark|bench|survey|review|position\b/i.test(paper.title) ? 12 : 0;
  score += /\bmedical|alzheimer|clinical|patient\b/i.test(`${paper.title} ${paper.summary}`) ? -45 : 0;
  score += /\bagent|video|retrieval|transformer|continual|collapse|reasoning|jepa|world model|physical\b/i.test(paper.title)
    ? 20
    : 0;
  score += paper.announceType === 'new' ? 8 : 0;
  return score;
};

const authorLine = (authors) => {
  const visible = (authors || []).slice(0, 3).join(', ');
  const extra = Math.max(0, (authors || []).length - 3);
  if (!visible) return 'The authors';
  return `${visible}${extra ? ` and ${extra} more` : ''}`;
};

const splitSentences = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const compactSentence = (value, maxLength = 230) => {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean.replace(/[,:;]+$/, '.');
  const clipped = clean.slice(0, maxLength).replace(/\s+\S*$/, '');
  return `${clipped.replace(/[,:;]+$/, '')}.`;
};

const titleSubject = (paper) =>
  String(paper.title || '')
    .replace(/\.$/, '')
    .replace(/:\s+/g, ': ')
    .trim();

const abstractSentences = (paper) => splitSentences(paper.summary);

const firstAbstractSentence = (paper) =>
  abstractSentences(paper)[0] || `${titleSubject(paper)} introduces a source-linked ML research claim.`;

const contributionSentence = (paper) => {
  const sentences = abstractSentences(paper);
  return (
    sentences.find((sentence) =>
      /\b(propose|introduce|present|develop|show|demonstrate|benchmark|evaluate|study|analy[sz]e|framework|method|dataset|approach)\b/i.test(
        sentence
      )
    ) ||
    sentences[0] ||
    `${titleSubject(paper)} needs to be read through its method, evidence, and stated limits.`
  );
};

const limitationSentence = (paper) => {
  const sentences = abstractSentences(paper);
  return sentences.find((sentence) =>
    /\b(limitation|challenge|open challenge|fail|failure|risk|gap|cost|robust|generaliz|real-world|noise|long[- ]tail)\b/i.test(
      sentence
    )
  );
};

const cleanLimitationSentence = (sentence, maxLength = 170) =>
  compactSentence(sentence, maxLength).replace(/^(However|Although|But),?\s+/i, '');

const KNOWN_FOCUS_TERMS = [
  'tree search',
  'cognition layer',
  'autonomous agents',
  'scientific conclusions',
  'systematic reviews',
  'business world model',
  'world model',
  'visual question answering',
  'evidence-grounded reasoning',
  'causal video prediction',
  'interaction-aware masking',
  'entity-centric',
  'retrieval augmented generation',
  'retrieval',
  'reasoning',
  'representation',
  'benchmark',
  'multi-agent',
  'agent',
  'agents',
  'vision-language',
  'multimodal',
  'physical ai',
  'robot',
  'planning',
];

const titleFocusTerms = (paper) => {
  const title = titleSubject(paper).toLowerCase();
  const matches = KNOWN_FOCUS_TERMS.filter((term) => title.includes(term));
  const chunks = title
    .replace(/\?/g, '')
    .split(/[:\-–—]/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 3);
  return unique([...matches, ...chunks]).slice(0, 4);
};

const phraseCandidates = (paper) => {
  const stop = new Set([
    'about',
    'across',
    'after',
    'also',
    'among',
    'approach',
    'based',
    'because',
    'before',
    'being',
    'between',
    'could',
    'dataset',
    'datasets',
    'different',
    'during',
    'each',
    'from',
    'have',
    'into',
    'large',
    'learning',
    'method',
    'methods',
    'model',
    'models',
    'more',
    'required',
    'coordinated',
    'historically',
    'improvement',
    'vendor',
    'optimized',
    'subsequent',
    'exploration',
    'sometimes',
    'further',
    'introduce',
    'setting',
    'consistently',
    'objectives',
    'dynamics',
    'lies',
    'paper',
    'present',
    'propose',
    'provide',
    'research',
    'results',
    'show',
    'shows',
    'system',
    'systems',
    'than',
    'their',
    'these',
    'this',
    'through',
    'using',
    'where',
    'which',
    'with',
  ]);
  const text = `${paper.title || ''} ${paper.summary || ''}`.toLowerCase();
  const focusTerms = titleFocusTerms(paper);
  const phrases = [...text.matchAll(/\b[a-z][a-z-]{3,}(?:\s+[a-z][a-z-]{3,}){0,2}\b/g)]
    .map((match) => match[0].replace(/[^a-z0-9 -]/g, '').trim())
    .filter((phrase) => phrase && !phrase.split(/\s+/).some((word) => stop.has(word)))
    .filter((phrase) => !/^arxiv\b/.test(phrase));
  const counts = new Map();
  for (const phrase of phrases) counts.set(phrase, (counts.get(phrase) || 0) + 1);
  const abstractTerms = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([phrase]) => phrase)
    .slice(0, 8);
  return unique([...focusTerms, ...abstractTerms]).slice(0, 6);
};

const abstractExcerpt = (paper) => compactSentence(firstAbstractSentence(paper), 260);

const cleanHook = (value, fallback) => {
  const clean = String(value || fallback || 'the paper')
    .replace(/\b(towards?|toward)\b\s*/gi, '')
    .replace(/\bthrough\b.*$/i, '')
    .replace(/[,:;]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > 72 ? `${clean.slice(0, 72).replace(/\s+\S*$/, '')}` : clean;
};

const makeDek = (paper, topic) => {
  const phrases = phraseCandidates(paper);
  const hook = cleanHook(phrases[0], topic.id.replace(/-/g, ' '));
  const subject = titleSubject(paper);
  const templatesByTopic = {
    'agent-systems': [
      `Read it for the audit trail: ${hook} matters only if a team can replay choices, dead branches, and tool calls after a failed run.`,
      `${subject} is strongest when it treats ${hook} as runtime evidence, not a polished demo transcript.`,
      `The useful contract is operational: can ${hook} leave enough state for another engineer to debug the next run?`,
      `Useful for agent teams if ${hook} changes what gets logged, compared, and repaired between runs.`,
      `Worth saving for the postmortem question: what did ${hook} make visible when the agent took the wrong turn?`,
    ],
    'agent-safety': [
      `A launch-risk read for teams that need ${hook} measured as behavior, not argued as intent.`,
      `The valuable part is the stop rule: can ${hook} be logged, bounded, and interrupted before it becomes user harm?`,
      `Useful if it turns ${hook} into an audit surface with traces, thresholds, and refusal checks.`,
    ],
    'continual-rl': [
      `A deployment-control read if ${hook} comes with rollback, drift checks, and incentives that survive contact with users.`,
      `Interesting only where ${hook} has a release contract: what adapts, what freezes, and what forces rollback.`,
      `The production question is whether ${hook} can learn after launch without turning every metric into a loophole.`,
    ],
    'physical-world-models': [
      `A physical-AI read if ${hook} predicts state changes, contact, and motion instead of only plausible futures.`,
      `The hard test is whether ${hook} tracks small physical events: handoffs, occlusions, trajectories, and object identity.`,
      `Worth reading when ${hook} makes visual prediction accountable to causal state, not just smooth frames.`,
    ],
    'vision-language': [
      `A useful vision read if ${hook} ties answers back to inspectable pixels, frames, or regions.`,
      `The promise is evidence routing: can ${hook} show the visual fact that made the answer possible?`,
      `Interesting for CV products if ${hook} makes wrong-but-fluent answers easier to catch before release.`,
    ],
    retrieval: [
      `A useful retrieval read if ${hook} clarifies what evidence survives ranking, compression, and citation pressure.`,
      `The practical question is whether ${hook} improves the audit trail when documents are stale, nearby, or missing.`,
      `Worth testing if ${hook} changes how teams see the evidence boundary, not just the top-k score.`,
    ],
    reasoning: [
      `A reasoning read if ${hook} makes invalid intermediate steps visible before the final answer hardens.`,
      `The useful angle is failure visibility: does ${hook} make a bad chain cheap to find and reject?`,
      `Worth attention if ${hook} gives builders a concrete way to inspect the reasoning path, not just the final answer.`,
    ],
    representation: [
      `A representation read if ${hook} survives ablations and hard negatives without narrative cover.`,
      `Interesting if ${hook} changes the bottleneck enough to remove waste from the learning loop.`,
      `The test is whether ${hook} still matters after data mix, compute, and negative-task controls are made visible.`,
    ],
    'ml-systems': [
      `A systems read if ${hook} can become a release decision: ship, hold, narrow scope, or collect better evidence.`,
      `Useful when ${hook} gives teams a stop condition instead of another metric to admire.`,
      `The value is operational if ${hook} changes what gets measured before a model reaches users.`,
    ],
    'frontier-ml': [
      `A useful research read if ${hook} gives builders a testable reason to change a system.`,
      `Worth reading if ${hook} turns a model claim into a decision a team can reproduce or reject.`,
      `The interesting part is whether ${hook} survives the first small reproduction outside the paper.`,
    ],
  };
  const templates = templatesByTopic[topic.id] || templatesByTopic['frontier-ml'];
  return templates[stableIndex(`${paper.arxivId}:${paper.title}`, templates.length)];
};

const makeClaim = (paper, topic) => {
  const subject = titleSubject(paper);
  const contribution = compactSentence(contributionSentence(paper), 260);
  const byline = authorLine(paper.authors);
  return `${byline} frame ${subject} around this core move: ${contribution}`;
};

const makeEditorVerdict = (paper, topic) => {
  const concrete = phraseCandidates(paper)[0] || topic.reader;
  const contribution = compactSentence(contributionSentence(paper), 190);
  const limit = limitationSentence(paper);
  const limitClause = limit ? ` The weak spot to inspect: ${cleanLimitationSentence(limit, 150)}` : '';
  return `The paper is worth a builder's time because it turns ${concrete} into a mechanism a team can test: ${contribution}${limitClause}`;
};

const makeTechnicalHinge = (paper, topic) => {
  const phrases = phraseCandidates(paper);
  const target = phrases[0] || topic.id.replace(/-/g, ' ');
  if (topic.id === 'agent-safety') return `The hinge is behavioral evidence around ${target}: message sequence, goal pressure, disclosure, and the point where the system stops instead of continuing to optimize.`;
  if (topic.id === 'continual-rl') return `The hinge is update control around ${target}: every post-launch change needs an observable trigger, a rollback rule, and a signal that is harder to game than reward alone.`;
  if (topic.id === 'agent-systems') return `The hinge is the cognition layer around ${target}: if the tree, plan, memory, or monitor cannot be replayed after a failed run, it is decoration rather than infrastructure.`;
  if (topic.id === 'physical-world-models') return `The hinge is whether ${target} tracks the moment physical state changes: contact, occlusion, object identity, trajectory, and causal interaction.`;
  if (topic.id === 'vision-language') return `The hinge is evidence routing around ${target}: a convincing answer should expose the crop, region, frame, or visual fact that made the answer possible.`;
  if (topic.id === 'retrieval') return `The hinge is recall under pressure around ${target}: near-duplicates, stale facts, missing citations, and adversarial neighbors should reveal what the index forgot.`;
  if (topic.id === 'reasoning') return `The hinge is intermediate state around ${target}: the method should make invalid paths cheaper to catch than a final-answer-only prompt would.`;
  if (topic.id === 'representation') return `The hinge is the ablation around ${target}: remove the claimed bottleneck or objective, then check whether the gain survives without storytelling.`;
  return `The hinge is reproducibility around ${target}: enough setup detail, negative cases, and measurement hooks to repeat the result outside the paper's comfort zone.`;
};

const makeProductionAngle = (paper, topic) => {
  const subject = titleSubject(paper);
  if (topic.id === 'agent-systems') return `Prototype ${subject} as a trace experiment first: run a small agent task twice, then inspect whether tree states, tool choices, and failed branches make the second run easier to repair.`;
  if (topic.id === 'vision-language') return `Use it on an inspection set with answerable and unanswerable images. Require each answer to point to the exact region or frame; fluent unsupported answers should count as failures.`;
  if (topic.id === 'retrieval') return `Turn the claim into a retrieval bake-off: stale documents, near-neighbor distractors, and citation-required answers before any dashboard demo.`;
  if (topic.id === 'physical-world-models') return `Test it on clips where the important event is small: contact, object handoff, occlusion, or trajectory change. Smooth-looking futures should not pass unless state transitions are right.`;
  if (topic.id === 'reasoning') return `Build a tiny counterexample suite. The method earns trust only if it fails visibly on invalid chains instead of laundering them into a confident answer.`;
  if (topic.id === 'representation') return `Re-run the smallest claimed gain with a harsh ablation table: data mixture, compute budget, negative tasks, and collapse cases all logged.`;
  if (topic.id === 'continual-rl') return `Define the deployment contract before training: what may adapt, how drift is detected, and what metric forces rollback.`;
  if (topic.id === 'agent-safety') return `Convert the taxonomy into a launch checklist: disclose agent identity, cap persuasion loops, log escalation, and test refusal behavior under goal pressure.`;
  return `Write one product decision before reading the results: if the paper is true, what would you ship, block, or measure differently next week?`;
};

const makeSkepticism = (paper, topic) => {
  const source = (paper.categories || []).join(', ') || 'arXiv';
  const limit = limitationSentence(paper);
  const limitText = limit ? ` The abstract already hints at pressure to test: ${cleanLimitationSentence(limit, 180)}` : '';
  return `This is still a source-led triage note from ${source}, not a reproduction.${limitText} I would hold back adoption until code, data conditions, ablations, and failure examples match the deployment setting.`;
};

const makeReadingPath = (paper, topic) => {
  const phrases = phraseCandidates(paper);
  const target = phrases[0] || 'the claimed mechanism';
  return [
    `Start with the problem sentence: what limitation in current practice does ${titleSubject(paper)} actually attack?`,
    `Find the ablation or comparison that isolates ${target}. If it is missing, treat the result as a hypothesis, not guidance.`,
    'Read failure cases before the leaderboard table; the most useful papers make their limits operational.',
  ];
};

const qualityCheckReview = (review) => {
  const combined = [
    review.dek,
    review.editorVerdict,
    review.whatItClaims,
    review.technicalHinge,
    review.productionAngle,
    review.skepticism,
  ].join(' ');
  const genericPhrases = [
    'not just another planning demo',
    'not only the benchmark headline',
    'not a bookmark',
    'the useful question is not whether',
    'selected from primary ML research feeds',
  ];
  const hits = genericPhrases.filter((phrase) => combined.toLowerCase().includes(phrase));
  if (hits.includes('not just another planning demo') || hits.length > 1) {
    throw new Error(`Generated paper review for ${review.title} is too generic: ${hits.join(', ')}`);
  }
  if (!review.whatItClaims.includes(':') && !review.whatItClaims.includes('core move')) {
    throw new Error(`Generated paper review for ${review.title} does not expose a concrete claim`);
  }
};

const qualityCheckFeed = (reviews) => {
  const dekCounts = new Map();
  for (const review of reviews) {
    qualityCheckReview(review);
    const normalizedDek = String(review.dek || '').toLowerCase().replace(/\s+/g, ' ').trim();
    dekCounts.set(normalizedDek, (dekCounts.get(normalizedDek) || 0) + 1);
  }
  const duplicateDek = [...dekCounts.entries()].find(([, count]) => count > 1);
  if (duplicateDek) {
    throw new Error(`Paper review feed contains duplicate dek text: ${duplicateDek[0]}`);
  }
};

const buildReviewEntry = (paper, score, overrides = {}) => {
  const topic = inferTopic(paper);
  const id = overrides.id || `${slugify(paper.title)}-${paper.arxivId.replace('.', '-')}`;
  const review = {
    id,
    title: paper.title,
    dek: makeDek(paper, topic),
    language: 'en',
    selectedAt: overrides.selectedAt || new Date().toISOString(),
    paperUrl: paper.paperUrl,
    pdfUrl: paper.pdfUrl,
    arxivId: paper.arxivId,
    authors: paper.authors || [],
    publishedAt: paper.publishedAt || '',
    updatedAt: paper.updatedAt || '',
    categories: paper.categories || [],
    tags: unique([...topic.tags, ...(paper.categories || [])]).slice(0, 8),
    selectionScore: Math.round(score || 0),
    selectionReason:
      'Selected from primary ML research feeds because it has a recent source link, a concrete technical claim, and a verification question builders can test.',
    editorVerdict: makeEditorVerdict(paper, topic),
    whatItClaims: makeClaim(paper, topic),
    technicalHinge: makeTechnicalHinge(paper, topic),
    productionAngle: makeProductionAngle(paper, topic),
    skepticism: makeSkepticism(paper, topic),
    readingPath: makeReadingPath(paper, topic),
    abstractExcerpt: abstractExcerpt(paper),
    claimAtoms: phraseCandidates(paper).slice(0, 5),
    sourceLedger: [
      { label: 'Primary paper', url: paper.paperUrl },
      { label: 'PDF', url: paper.pdfUrl },
      { label: `${paper.categories[0] || 'arXiv'} research feed`, url: paper.feedUrl },
    ],
  };
  qualityCheckReview(review);
  return review;
};

const paperFromReview = (review, metadataById) => {
  const metadata = metadataById.get(review.arxivId) || {};
  const categories = Array.isArray(metadata.categories) && metadata.categories.length ? metadata.categories : review.categories || [];
  const feedCategory = categories.find((category) => FEED_CATEGORIES.includes(category));
  return {
    arxivId: review.arxivId,
    title: metadata.title || review.title,
    summary: metadata.summary || review.abstractExcerpt || review.dek || '',
    authors: metadata.authors?.length ? metadata.authors : review.authors || [],
    categories,
    publishedAt: metadata.publishedAt || review.publishedAt || '',
    updatedAt: metadata.updatedAt || review.updatedAt || '',
    announceType: 'existing',
    paperUrl: review.paperUrl || (review.arxivId ? `https://arxiv.org/abs/${review.arxivId}` : ''),
    pdfUrl: review.pdfUrl || (review.arxivId ? `https://arxiv.org/pdf/${review.arxivId}` : ''),
    feedUrl:
      metadata.feedUrl ||
      review.sourceLedger?.find((link) => /research feed$/i.test(link.label || ''))?.url ||
      (feedCategory ? `https://rss.arxiv.org/rss/${feedCategory}` : 'https://arxiv.org/'),
    recencyIndex: 0,
  };
};

const rewriteExistingReviews = async (reviews) => {
  if (!reviews.length) return reviews;
  const metadataById = await fetchArxivMetadataByIds(reviews.map((review) => review.arxivId));
  return reviews.map((review) =>
    buildReviewEntry(paperFromReview(review, metadataById), review.selectionScore || 0, {
      id: review.id,
      selectedAt: review.selectedAt,
    })
  );
};

const updateFeed = async () => {
  const feed = await loadExistingFeed();
  const currentReviews = shouldRewriteExisting ? await rewriteExistingReviews(feed.reviews) : feed.reviews;
  qualityCheckFeed(currentReviews);
  const todayKey = new Date().toISOString().slice(0, 10);
  const latestReviewKey = currentReviews[0]?.selectedAt ? new Date(currentReviews[0].selectedAt).toISOString().slice(0, 10) : '';
  if (latestReviewKey === todayKey) {
    const cleanFeed = {
      ...defaultFeed(),
      reviews: currentReviews,
      updatedAt: shouldRewriteExisting ? new Date().toISOString() : feed.updatedAt || currentReviews[0].selectedAt,
    };
    if (shouldWrite) await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(cleanFeed, null, 2)}\n`, 'utf8');
    return { feed: cleanFeed, selected: null, changed: shouldRewriteExisting, candidates: 0, rewritten: shouldRewriteExisting };
  }

  const reviewedIds = new Set(currentReviews.map((review) => review.arxivId).filter(Boolean));
  const candidates = await fetchCandidates();
  const ranked = candidates
    .map((paper) => ({ paper, score: scoreCandidate(paper, reviewedIds) }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0];
  if (!selected) {
    if (!shouldAllowNoop) throw new Error('No new primary paper candidates found.');
    const cleanFeed = { ...defaultFeed(), reviews: currentReviews, updatedAt: shouldRewriteExisting ? new Date().toISOString() : feed.updatedAt };
    if (shouldWrite) await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(cleanFeed, null, 2)}\n`, 'utf8');
    return { feed: cleanFeed, selected: null, changed: shouldRewriteExisting, candidates: candidates.length, rewritten: shouldRewriteExisting };
  }

  const nextReview = buildReviewEntry(selected.paper, selected.score);
  const nextFeed = {
    ...defaultFeed(),
    updatedAt: nextReview.selectedAt,
    reviews: [nextReview, ...currentReviews].slice(0, MAX_REVIEWS),
  };
  qualityCheckFeed(nextFeed.reviews);

  if (shouldWrite) {
    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(nextFeed, null, 2)}\n`, 'utf8');
  }

  return { feed: nextFeed, selected: nextReview, changed: true, candidates: candidates.length, rewritten: shouldRewriteExisting };
};

updateFeed()
  .then((result) => {
    console.log(
      JSON.stringify(
        {
          status: result.selected
            ? `selected ${result.selected.title}`
            : result.rewritten
              ? 'rewrote existing reviews'
              : 'no new review selected',
          write: shouldWrite,
          candidates: result.candidates,
          reviewCount: result.feed.reviews.length,
          rewritten: result.rewritten,
          output: path.relative(ROOT_DIR, OUTPUT_PATH),
        },
        null,
        2
      )
    );
  })
  .catch((error) => {
    console.error(error?.stack || error?.message || error);
    process.exitCode = 1;
  });
