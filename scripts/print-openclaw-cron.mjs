import fs from 'node:fs/promises';
import path from 'node:path';

const schedulePath = process.argv[2] ?? path.resolve('marketing', 'scheduled-posts.json');

const escapeShell = (value) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

const buildPrompt = (post, voiceStyle, channel) => {
  const keywords = Array.isArray(post.keywords) ? post.keywords.join(', ') : '';
  const urls = post.secondaryUrl ? `${post.primaryUrl} (secondary: ${post.secondaryUrl})` : post.primaryUrl;
  return [
    `Write a short ${channel} post in the "${post.voice}" voice.`,
    voiceStyle ? `Style: ${voiceStyle}` : '',
    `Topic: ${post.projectTitle}`,
    `Angle: ${post.angle}`,
    keywords ? `Keywords: ${keywords}` : '',
    `CTA: ${urls}`,
    'Length: 500-900 chars. Use short paragraphs. No hashtags unless they are critical.'
  ]
    .filter(Boolean)
    .join('\n');
};

const main = async () => {
  const schedule = JSON.parse(await fs.readFile(schedulePath, 'utf8'));
  const defaultChannel = schedule.defaultChannel || 'telegram';
  const defaultTarget = schedule.defaultTarget || 'channel:${TELEGRAM_CHANNEL_ID}';
  const voices = schedule.voices || {};
  const posts = schedule.posts || [];

  if (!posts.length) {
    console.log('No posts found in schedule.');
    return;
  }

  for (const post of posts) {
    const channel = post.channel || defaultChannel;
    const target = post.target || defaultTarget;
    const voiceStyle = voices[post.voice]?.style || '';
    const prompt = buildPrompt(post, voiceStyle, channel);
    const safePrompt = escapeShell(prompt);

    const name = `Social: ${post.id}`;
    const at = post.publishAt;

    console.log(
      [
        'openclaw cron add \\',
        `  --name "${name}" \\`,
        `  --at "${at}" \\`,
        '  --session isolated \\',
        `  --message "${safePrompt}" \\`,
        '  --deliver \\',
        `  --channel ${channel} \\`,
        `  --to "${target}"`,
        ''
      ].join('\n')
    );
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
