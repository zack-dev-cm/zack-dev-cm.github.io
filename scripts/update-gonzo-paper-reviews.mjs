import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.resolve(ROOT_DIR, 'public', 'paper-reviews.json');
const SOURCE_URL = 'https://t.me/s/gonzo_ML';
const SOURCE_PUBLIC_URL = 'https://t.me/gonzo_ML';
const SITE_URL = 'https://zack-dev-cm.github.io/papers/';
const DATA_URL = 'https://zack-dev-cm.github.io/docs/paper-reviews.json';
const MAX_REVIEWS = 45;
const USER_AGENT = 'zack-dev-cm-paper-review-bot/1.0 (+https://zack-dev-cm.github.io/papers/)';

const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const shouldAllowNoop = args.has('--allow-noop');

const REVIEW_TOPIC_RULES = [
  {
    id: 'agent-runtime',
    match: /\b(agent|agents|memory|skill|skills|tool|tools|protocol|harness|externalization|workflow|planning)\b/i,
    tags: ['agents', 'runtime', 'systems'],
    reader: 'agent runtime and product engineering',
    builderAngle:
      'Map the paper to an explicit runtime contract: what stays in model weights, what moves into memory, tools, protocols, or review gates.',
  },
  {
    id: 'reasoning',
    match: /\b(reasoning|deduction|lattice|logic|solver|sudoku|proof|theorem|symbolic|neurosymbolic)\b/i,
    tags: ['reasoning', 'verification', 'small-models'],
    reader: 'reliable reasoning systems',
    builderAngle:
      'Treat the result as a design prompt for small, inspectable reasoning modules that can be tested before a larger model is trusted.',
  },
  {
    id: 'representation-learning',
    match: /\b(latent|latents|representation|representations|token|tokens|jepa|data2vec|sample complexity|self-supervised)\b/i,
    tags: ['representation-learning', 'sample-efficiency', 'self-supervision'],
    reader: 'sample-efficient representation learning',
    builderAngle:
      'Look for whether the training target reduces waste: a useful production lesson is often in what the model is asked to predict.',
  },
  {
    id: 'vision-language',
    match: /\b(vision|visual|image|video|multimodal|clip|vlm|segmentation|detection|diffusion|ocr)\b/i,
    tags: ['computer-vision', 'multimodal', 'model-evaluation'],
    reader: 'computer vision and multimodal systems',
    builderAngle:
      'Translate the claim into an evaluation surface: inputs, failure modes, user-visible output, and whether the model can be gated before launch.',
  },
  {
    id: 'retrieval-rag',
    match: /\b(retrieval|rag|embedding|embeddings|vector|search|index|rerank|reranker)\b/i,
    tags: ['retrieval', 'rag', 'search'],
    reader: 'retrieval and grounded QA systems',
    builderAngle:
      'Focus on the retrieval contract: what gets indexed, what evidence is shown, and how a reviewer can reject weak support.',
  },
  {
    id: 'ml-systems',
    match: /\b(training|inference|serving|benchmark|evaluation|dataset|datasets|scaling|optimization|optimizer)\b/i,
    tags: ['ml-systems', 'evaluation', 'deployment'],
    reader: 'ML systems and deployment gates',
    builderAngle:
      'Convert the paper into a gate: what metric would stop release, what artifact should be stored, and what has to be reproducible.',
  },
];

const decodeHtml = (value) =>
  String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));

const stripTags = (html) =>
  decodeHtml(
    String(html || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const decodeXml = (value) =>
  String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 90);

const unique = (items) => [...new Set(items.filter(Boolean))];

const loadExistingFeed = async () => {
  try {
    const parsed = JSON.parse(await fs.readFile(OUTPUT_PATH, 'utf8'));
    return {
      ...defaultFeed(),
      ...parsed,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch (error) {
    if (error.code === 'ENOENT') return defaultFeed();
    throw error;
  }
};

const defaultFeed = () => ({
  schemaVersion: '2026-06-05',
  language: 'en',
  title: 'Daily ML Paper Reviews',
  siteUrl: SITE_URL,
  dataUrl: DATA_URL,
  updatedAt: null,
  source: {
    name: 'Gonzo ML',
    channelUrl: SOURCE_PUBLIC_URL,
    publicMirrorUrl: SOURCE_URL,
    role: 'public paper-discovery signal',
  },
  policy: {
    selection:
      'One paper per refresh is selected from public Gonzo ML posts using recency, primary-paper availability, and fit with computer vision, agents, retrieval, reasoning, and ML systems.',
    writing:
      'Reviews are original English notes based on primary paper metadata and source links. Telegram review text is not republished or translated.',
    automation:
      'The daily GitHub Actions refresh updates this JSON feed and the static paper page without a paid backend.',
  },
  reviews: [],
});

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xml,application/json;q=0.9,*/*;q=0.8',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
};

const extractArxivId = (url) => {
  const match = String(url || '').match(/arxiv\.org\/(?:abs|pdf)\/([0-9]{4}\.[0-9]{4,5})(?:v\d+)?/i);
  return match?.[1] || '';
};

const parseTelegramPosts = (html) => {
  const chunks = String(html || '').split(/<div class="tgme_widget_message_wrap/i).slice(1);
  return chunks
    .map((chunk, index) => {
      const postMatch = chunk.match(/data-post="([^"]+)"/);
      const postPath = postMatch?.[1] || '';
      const postUrl = postPath ? `https://t.me/${postPath}` : SOURCE_PUBLIC_URL;
      const datetime = chunk.match(/datetime="([^"]+)"/)?.[1] || '';
      const bodyMatch = chunk.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div class="tgme_widget_message_footer|<div class="tgme_widget_message_info)/i);
      const bodyHtml = bodyMatch?.[1] || chunk;
      const bodyText = stripTags(bodyHtml);
      const links = unique([...bodyHtml.matchAll(/href="([^"]+)"/g)].map((match) => decodeHtml(match[1])));
      const arxivUrls = unique(links.filter((link) => /arxiv\.org\/(?:abs|pdf)\//i.test(link)));
      const sourceReviewUrl = links.find((link) => /arxiviq\.substack\.com/i.test(link)) || '';
      const arxivId = extractArxivId(arxivUrls[0]);
      if (!arxivId) return null;
      return {
        postUrl,
        postedAt: datetime,
        bodyText,
        arxivId,
        paperUrl: `https://arxiv.org/abs/${arxivId}`,
        sourceReviewUrl,
        recencyIndex: index,
      };
    })
    .filter(Boolean);
};

const parseArxivEntries = (xml) => {
  const entries = new Map();
  for (const entryMatch of String(xml || '').matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = entryMatch[1];
    const idUrl = decodeXml(entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] || '');
    const arxivId = extractArxivId(idUrl);
    if (!arxivId) continue;
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
    const summary = decodeXml(entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] || '');
    const published = decodeXml(entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] || '');
    const updated = decodeXml(entry.match(/<updated>([\s\S]*?)<\/updated>/)?.[1] || '');
    const authors = [...entry.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)].map((match) =>
      decodeXml(match[1])
    );
    const categories = [...entry.matchAll(/<category term="([^"]+)"/g)].map((match) => match[1]);
    entries.set(arxivId, {
      arxivId,
      title,
      summary,
      authors,
      categories,
      publishedAt: published,
      updatedAt: updated,
      paperUrl: `https://arxiv.org/abs/${arxivId}`,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
    });
  }
  return entries;
};

const fetchArxivMetadata = async (arxivIds) => {
  if (arxivIds.length === 0) return new Map();
  const query = new URL('https://export.arxiv.org/api/query');
  query.searchParams.set('id_list', arxivIds.join(','));
  query.searchParams.set('max_results', String(arxivIds.length));
  return parseArxivEntries(await fetchText(query.toString()));
};

const inferTopic = (paper) => {
  const haystack = `${paper.title} ${paper.summary} ${(paper.categories || []).join(' ')}`;
  const matched = REVIEW_TOPIC_RULES.find((rule) => rule.match.test(haystack)) || {
    id: 'frontier-ml',
    tags: ['machine-learning', 'paper-review'],
    reader: 'frontier ML research',
    builderAngle:
      'Read it as an implementation brief: identify the claim, required evidence, and the smallest reproducible test before using it in a product.',
  };
  return matched;
};

const scoreCandidate = (candidate, paper, reviewedIds) => {
  if (!paper || reviewedIds.has(candidate.arxivId)) return Number.NEGATIVE_INFINITY;
  const topic = inferTopic(paper);
  let score = 120 - candidate.recencyIndex * 7;
  score += topic.id === 'vision-language' ? 35 : 0;
  score += topic.id === 'agent-runtime' ? 32 : 0;
  score += topic.id === 'representation-learning' ? 28 : 0;
  score += topic.id === 'reasoning' ? 26 : 0;
  score += topic.id === 'retrieval-rag' ? 24 : 0;
  score += /review|survey/i.test(paper.title) ? 10 : 0;
  score += candidate.sourceReviewUrl ? 6 : 0;
  score += (paper.authors || []).length > 0 ? 3 : 0;
  return score;
};

const firstMeaningfulSentence = (text) => {
  const sentences = String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40);
  return sentences[0] || '';
};

const makeOneLine = (paper, topic) => {
  const title = paper.title.replace(/\.$/, '');
  return `${title} is worth tracking for ${topic.reader}; I would read it for the implementation constraints, not only the headline result.`;
};

const inferContribution = (paper, topic) => {
  const text = `${paper.title} ${paper.summary}`;
  if (/\blattice|deduction|logic|sudoku|solver\b/i.test(text)) {
    return 'The authors explore a recurrent transformer design that passes latent state through lattice-style constraints, aiming to make neural reasoning behave more like auditable deduction.';
  }
  if (/\blatents?|tokens?|sample complexity|jepa|data2vec\b/i.test(text)) {
    return 'The authors analyze representation-learning targets and argue that predicting internal abstractions can be more data-efficient than predicting raw tokens.';
  }
  if (/\bagents?|memory|skills?|protocol|harness|externalization\b/i.test(text)) {
    return 'The authors frame agent progress around the surrounding runtime: memory, skills, protocols, and harness design rather than model weights alone.';
  }
  if (/\bvision|image|video|multimodal|segmentation|diffusion|ocr\b/i.test(text)) {
    return 'The authors propose or evaluate a multimodal method whose value depends on how well visual outputs can be measured, inspected, and constrained.';
  }
  if (/\bretrieval|rag|embedding|index|rerank\b/i.test(text)) {
    return 'The authors work on the retrieval layer, where the important question is whether evidence selection improves grounding instead of only improving benchmark scores.';
  }
  return `The authors publish a ${topic.reader} paper that should be read through its method, evaluation setup, and reproducibility hooks.`;
};

const makeReview = (paper, topic) => {
  const categoryText = (paper.categories || []).slice(0, 3).join(', ') || 'machine learning';
  const authorLead = (paper.authors || []).slice(0, 3).join(', ');
  const remainingAuthorCount = Math.max(0, (paper.authors || []).length - 3);
  const authorsText = authorLead
    ? `${authorLead}${remainingAuthorCount > 0 ? ` and ${remainingAuthorCount} coauthor${remainingAuthorCount === 1 ? '' : 's'}` : ''}`
    : 'the authors';

  return {
    problem: `The paper sits in ${topic.reader}. The practical question is whether the idea changes what a builder should measure, store, or gate before a model reaches users.`,
    contribution: `${authorsText} publish in ${categoryText}. ${inferContribution(paper, topic)}`,
    whyItMatters:
      'For product work, the useful part is the pressure it puts on evaluation: a paper is only operationally valuable when its claim can become a test, artifact, or review step.',
    builderAngle: topic.builderAngle,
    limits:
      'This daily note is a triage review, not a reproduction. Treat the paper as a candidate for deeper reading until code, datasets, or independent replications are checked.',
    readingPlan: [
      'Read the abstract and figures first; write down the claimed improvement before looking at examples.',
      'Find the evaluation setup and decide whether it matches a real product failure mode.',
      'Look for code, data, ablations, and negative cases before trusting the result.',
    ],
  };
};

const buildReviewEntry = ({ candidate, paper, score }) => {
  const topic = inferTopic(paper);
  const id = `${slugify(paper.title)}-${candidate.arxivId.replace('.', '-')}`;
  const sourceLedger = [
    { label: 'Gonzo ML channel post', url: candidate.postUrl },
    { label: 'Primary paper', url: paper.paperUrl },
    { label: 'arXiv PDF', url: paper.pdfUrl },
  ];
  if (candidate.sourceReviewUrl) {
    sourceLedger.push({ label: 'Source review link from channel', url: candidate.sourceReviewUrl });
  }

  return {
    id,
    title: paper.title,
    language: 'en',
    selectedAt: new Date().toISOString(),
    sourceChannel: 'Gonzo ML',
    sourceChannelUrl: SOURCE_PUBLIC_URL,
    telegramPostUrl: candidate.postUrl,
    paperUrl: paper.paperUrl,
    pdfUrl: paper.pdfUrl,
    arxivId: candidate.arxivId,
    authors: paper.authors || [],
    publishedAt: paper.publishedAt || '',
    updatedAt: paper.updatedAt || '',
    categories: paper.categories || [],
    tags: unique([...topic.tags, ...(paper.categories || []).slice(0, 2)]).slice(0, 8),
    selectionScore: Math.round(score),
    selectionReason:
      'Selected from the latest public Gonzo ML posts because it has a primary paper link and strong fit with applied CV, agents, retrieval, reasoning, or ML systems.',
    oneLine: makeOneLine(paper, topic),
    review: makeReview(paper, topic),
    sourceLedger,
  };
};

const updateFeed = async () => {
  const feed = await loadExistingFeed();
  const reviewedIds = new Set(feed.reviews.map((review) => review.arxivId).filter(Boolean));
  const telegramHtml = await fetchText(SOURCE_URL);
  const candidates = parseTelegramPosts(telegramHtml).slice(0, 20);
  const metadata = await fetchArxivMetadata(unique(candidates.map((candidate) => candidate.arxivId)).slice(0, 12));

  const ranked = candidates
    .map((candidate) => {
      const paper = metadata.get(candidate.arxivId);
      return { candidate, paper, score: scoreCandidate(candidate, paper, reviewedIds) };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0];
  if (!selected) {
    if (!shouldAllowNoop) {
      throw new Error('No new Gonzo ML paper candidates found.');
    }
    return { feed, selected: null, changed: false, candidates: candidates.length };
  }

  const nextReview = buildReviewEntry(selected);
  const nextFeed = {
    ...feed,
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
    const status = result.changed ? `selected ${result.selected.title}` : 'no new review selected';
    console.log(
      JSON.stringify(
        {
          status,
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
