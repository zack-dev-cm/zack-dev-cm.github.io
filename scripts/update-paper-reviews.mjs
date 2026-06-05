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
      'Reviews are original English editorial notes. Abstracts and third-party commentary are used for triage only and are not republished.',
  },
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

const makeDek = (paper, topic) => {
  if (topic.id === 'agent-systems') return 'A paper worth reading for the traces, not the demo: how agents communicate, monitor, or expose state when the run gets long.';
  if (topic.id === 'agent-safety') return 'A field-experiment paper to read as a release warning: if an agent can persuade, the product needs a trace, a boundary, and a stop rule.';
  if (topic.id === 'continual-rl') return 'A position paper to read as a deployment contract: when a policy is allowed to keep learning, who audits it, and what stops it.';
  if (topic.id === 'physical-world-models') return 'A physical-AI paper to read for object state, motion, contact, and whether the model learns a usable world contract instead of a pretty prediction.';
  if (topic.id === 'vision-language') return 'A multimodal paper to read through failure cases: what the model can verify, where it hallucinates, and what a user can inspect.';
  if (topic.id === 'retrieval') return 'A retrieval paper to read for the evidence boundary: what is kept, compressed, explained, and lost.';
  if (topic.id === 'reasoning') return 'A reasoning paper to read as a constraint design, not a benchmark headline.';
  if (topic.id === 'representation') return 'A model-design paper to read for the bottleneck it changes and the ablations it owes.';
  return 'A research note for builders who need a paper to become a decision, not a bookmark.';
};

const makeClaim = (paper, topic) => {
  const title = paper.title.replace(/\.$/, '');
  if (topic.id === 'agent-safety') return `${title} examines how LLM agents use persuasive tactics when operating in a field setting, which makes the paper more relevant to launch review than to leaderboard comparison.`;
  if (topic.id === 'continual-rl') return `${title} argues that deployed reinforcement learning should keep adapting after launch, but under explicit constraints rather than silent drift.`;
  if (topic.id === 'agent-systems') return `${title} argues that agent quality depends on the communication or monitoring substrate around the model, not only on the base model's raw ability.`;
  if (topic.id === 'physical-world-models') return `${title} tries to make video prediction care about physical state: objects, interactions, motion, and the causal events that are easy for patch-level objectives to miss.`;
  if (topic.id === 'vision-language') return `${title} pushes on visual understanding where the important output is not a fluent caption, but a model behavior that can be inspected against the underlying scene.`;
  if (topic.id === 'retrieval') return `${title} works on the retrieval layer: how evidence is represented, narrowed, and served back to a model or user.`;
  if (topic.id === 'reasoning') return `${title} treats reasoning as something that should be constrained inside the computation, not merely requested in the prompt.`;
  if (topic.id === 'representation') return `${title} asks whether a different representation or training target can make learning less wasteful or more robust.`;
  return `${title} is a primary research claim that needs to be translated into an implementation test before it becomes product guidance.`;
};

const makeTechnicalHinge = (paper, topic) => {
  if (topic.id === 'agent-safety') return 'The hinge is behavioral evidence. A persuasive-agent risk is not visible in aggregate task success; it appears in message sequence, escalation style, disclosure, and whether the system keeps pushing after a boundary appears.';
  if (topic.id === 'continual-rl') return 'The hinge is control after launch. Continual learning is only useful when the update path is observable, reversible, and tied to signals that are harder to game than reward alone.';
  if (topic.id === 'agent-systems') return 'The hinge is observability. If the proposed communication or monitoring state cannot be replayed, inspected, and scored, it will be hard to trust once agents run for minutes instead of turns.';
  if (topic.id === 'physical-world-models') return 'The hinge is whether the learned state changes at the moment the physical system changes: contact, occlusion, object identity, trajectory, and causal interaction.';
  if (topic.id === 'vision-language') return 'The hinge is whether the method aligns visual evidence with the answer path. A model that only produces a polished answer still needs a separate gate for groundedness.';
  if (topic.id === 'retrieval') return 'The hinge is compression without amnesia. Retrieval systems often look strong until near-duplicates, stale evidence, and missing citations expose what the index discarded.';
  if (topic.id === 'reasoning') return 'The hinge is the intermediate state. The more the paper makes that state explicit, the easier it becomes to test invalid paths instead of trusting a final answer.';
  if (topic.id === 'representation') return 'The hinge is the ablation. A representation paper earns attention when the changed bottleneck survives simple, uncomfortable comparisons.';
  return 'The hinge is reproducibility: whether the result gives enough detail to repeat the setup and enough negative cases to understand where it breaks.';
};

const makeSkepticism = (paper, topic) => {
  const source = (paper.categories || []).join(', ') || 'arXiv';
  return `This is a triage review from ${source}, not a reproduction. I would not use the result until code, data conditions, ablations, and failure examples are checked against a task I actually need.`;
};

const buildReviewEntry = (paper, score) => {
  const topic = inferTopic(paper);
  const id = `${slugify(paper.title)}-${paper.arxivId.replace('.', '-')}`;
  return {
    id,
    title: paper.title,
    dek: makeDek(paper, topic),
    language: 'en',
    selectedAt: new Date().toISOString(),
    paperUrl: paper.paperUrl,
    pdfUrl: paper.pdfUrl,
    arxivId: paper.arxivId,
    authors: paper.authors || [],
    publishedAt: paper.publishedAt || '',
    updatedAt: paper.updatedAt || '',
    categories: paper.categories || [],
    tags: unique([...topic.tags, ...(paper.categories || [])]).slice(0, 8),
    selectionScore: Math.round(score),
    selectionReason:
      'Selected from primary ML research feeds because it is recent, source-linked, and has a clear implementation question for agents, CV, retrieval, reasoning, or ML systems.',
    editorVerdict: topic.verdict,
    whatItClaims: makeClaim(paper, topic),
    technicalHinge: makeTechnicalHinge(paper, topic),
    productionAngle: topic.productionTest,
    skepticism: makeSkepticism(paper, topic),
    readingPath: [
      'Read the method before the benchmark table.',
      'Find the ablation that removes the claimed mechanism.',
      'Write one product failure case the paper should survive.',
    ],
    sourceLedger: [
      { label: 'Primary paper', url: paper.paperUrl },
      { label: 'PDF', url: paper.pdfUrl },
      { label: `${paper.categories[0] || 'arXiv'} research feed`, url: paper.feedUrl },
    ],
  };
};

const updateFeed = async () => {
  const feed = await loadExistingFeed();
  const todayKey = new Date().toISOString().slice(0, 10);
  const latestReviewKey = feed.reviews[0]?.selectedAt ? new Date(feed.reviews[0].selectedAt).toISOString().slice(0, 10) : '';
  if (latestReviewKey === todayKey) {
    const cleanFeed = {
      ...defaultFeed(),
      reviews: feed.reviews,
      updatedAt: feed.updatedAt || feed.reviews[0].selectedAt,
    };
    if (shouldWrite) await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(cleanFeed, null, 2)}\n`, 'utf8');
    return { feed: cleanFeed, selected: null, changed: false, candidates: 0 };
  }

  const reviewedIds = new Set(feed.reviews.map((review) => review.arxivId).filter(Boolean));
  const candidates = await fetchCandidates();
  const ranked = candidates
    .map((paper) => ({ paper, score: scoreCandidate(paper, reviewedIds) }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0];
  if (!selected) {
    if (!shouldAllowNoop) throw new Error('No new primary paper candidates found.');
    const cleanFeed = { ...defaultFeed(), reviews: feed.reviews, updatedAt: feed.updatedAt };
    if (shouldWrite) await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(cleanFeed, null, 2)}\n`, 'utf8');
    return { feed: cleanFeed, selected: null, changed: false, candidates: candidates.length };
  }

  const nextReview = buildReviewEntry(selected.paper, selected.score);
  const nextFeed = {
    ...defaultFeed(),
    updatedAt: nextReview.selectedAt,
    reviews: [nextReview, ...feed.reviews].slice(0, MAX_REVIEWS),
  };

  if (shouldWrite) {
    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(nextFeed, null, 2)}\n`, 'utf8');
  }

  return { feed: nextFeed, selected: nextReview, changed: true, candidates: candidates.length };
};

updateFeed()
  .then((result) => {
    console.log(
      JSON.stringify(
        {
          status: result.changed ? `selected ${result.selected.title}` : 'no new review selected',
          write: shouldWrite,
          candidates: result.candidates,
          reviewCount: result.feed.reviews.length,
          output: path.relative(ROOT_DIR, OUTPUT_PATH),
        },
        null,
        2
      )
    );
  })
  .catch((error) => {
    console.error(error?.message || error);
    process.exitCode = 1;
  });
