import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_FEED_URL = 'https://zackpashkin.substack.com/feed';
const DEFAULT_PUBLICATION_URL = 'https://zackpashkin.substack.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.resolve(ROOT_DIR, 'constants.ts');

const parseArgs = (argv) => {
  const options = {
    feedUrl: process.env.SUBSTACK_FEED_URL ?? DEFAULT_FEED_URL,
    publicationUrl: process.env.SUBSTACK_PUBLICATION_URL ?? DEFAULT_PUBLICATION_URL,
    write: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') {
      options.write = true;
    } else if (arg === '--feed') {
      options.feedUrl = argv[index + 1] ?? options.feedUrl;
      index += 1;
    } else if (arg.startsWith('--feed=')) {
      options.feedUrl = arg.slice('--feed='.length);
    } else if (arg === '--publication-url') {
      options.publicationUrl = argv[index + 1] ?? options.publicationUrl;
      index += 1;
    } else if (arg.startsWith('--publication-url=')) {
      options.publicationUrl = arg.slice('--publication-url='.length);
    } else if (arg === '--help') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Usage: npm run substack:sync -- [--write] [--feed ${DEFAULT_FEED_URL}]

Fetches the latest Substack RSS item and updates NEWSLETTER_OFFER latest-post fields.

Options:
  --write                Update constants.ts. Without this, prints the detected latest post only.
  --feed <url>           RSS feed URL. Defaults to ${DEFAULT_FEED_URL}.
  --publication-url <url> Publication base URL. Defaults to ${DEFAULT_PUBLICATION_URL}.
`);
};

const decodeXml = (value) =>
  String(value || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

const extractTag = (xml, tagName) => {
  const match = xml.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
};

const fetchLatestPost = async (feedUrl) => {
  const response = await fetch(feedUrl, {
    headers: {
      accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8',
      'user-agent': 'portfolio-substack-sync/1.0'
    }
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Substack feed failed with HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const itemMatch = text.match(/<item\b[\s\S]*?<\/item>/i);
  if (!itemMatch) {
    throw new Error(`No RSS item found in ${feedUrl}`);
  }

  const item = itemMatch[0];
  const title = extractTag(item, 'title');
  const link = extractTag(item, 'link');
  const pubDate = extractTag(item, 'pubDate');
  const publishedAt = pubDate ? new Date(pubDate) : null;

  if (!title || !link || !publishedAt || Number.isNaN(publishedAt.getTime())) {
    throw new Error(`Latest RSS item is missing title, link, or pubDate.`);
  }

  return {
    title,
    url: link,
    publishedAt: publishedAt.toISOString().slice(0, 10)
  };
};

const renderUrlValue = (url, publicationUrl) => {
  if (url.startsWith(publicationUrl)) {
    return `\`\${SOCIAL_LINKS.substack}${url.slice(publicationUrl.length)}\``;
  }
  return JSON.stringify(url);
};

const replaceField = (source, fieldName, renderedValue) => {
  const pattern = new RegExp(`(${fieldName}:\\s*)(?:\`[^\`]*\`|"[^"]*"|'[^']*')(,)`);
  if (!pattern.test(source)) {
    throw new Error(`Could not find NEWSLETTER_OFFER.${fieldName} in constants.ts`);
  }
  return source.replace(pattern, `$1${renderedValue}$2`);
};

const updateConstants = (source, latestPost, publicationUrl) => {
  let nextSource = source;
  nextSource = replaceField(nextSource, 'latestPostTitle', JSON.stringify(latestPost.title));
  nextSource = replaceField(nextSource, 'latestPostUrl', renderUrlValue(latestPost.url, publicationUrl));
  nextSource = replaceField(nextSource, 'latestPostPublishedAt', JSON.stringify(latestPost.publishedAt));
  return nextSource;
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return 0;
  }

  const latestPost = await fetchLatestPost(options.feedUrl);
  console.log(JSON.stringify({ latestPost, feedUrl: options.feedUrl }, null, 2));

  if (!options.write) {
    console.log('Dry run only. Pass --write after the public Substack URL is the post you want on the portfolio.');
    return 0;
  }

  const source = await fs.readFile(CONSTANTS_PATH, 'utf8');
  const nextSource = updateConstants(source, latestPost, options.publicationUrl);
  if (nextSource === source) {
    console.log('constants.ts already matches the latest Substack RSS item.');
    return 0;
  }

  await fs.writeFile(CONSTANTS_PATH, nextSource);
  console.log(`Updated ${path.relative(ROOT_DIR, CONSTANTS_PATH)} with latest Substack post.`);
  return 0;
};

main().then(
  (code) => {
    process.exitCode = code;
  },
  (error) => {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
);
