import fs from 'node:fs/promises';
import path from 'node:path';

const schedulePath = process.argv[2] ?? path.resolve('marketing', 'scheduled-posts.json');

const buildPreview = (post, voiceStyle, channel) => {
  const lines = [
    `Schedule item: ${post.id}`,
    `Publish at: ${post.publishAt}`,
    `Channel: ${channel}`,
    `Topic: ${post.projectTitle}`,
    `Angle: ${post.angle}`,
  ];
  if (voiceStyle) lines.push(`Style: ${voiceStyle}`);
  if (Array.isArray(post.keywords) && post.keywords.length) lines.push(`Keywords: ${post.keywords.join(', ')}`);
  if (post.primaryUrl) lines.push(`Primary URL: ${post.primaryUrl}`);
  if (post.secondaryUrl) lines.push(`Secondary URL: ${post.secondaryUrl}`);
  lines.push('Next step: map this item into your own scheduler or delivery system.');
  return lines.join('\n');
};

const main = async () => {
  const schedule = JSON.parse(await fs.readFile(schedulePath, 'utf8'));
  const defaultChannel = schedule.defaultChannel || 'example';
  const defaultTarget = schedule.defaultTarget || 'replace-with-your-target';
  const voices = schedule.voices || {};
  const posts = schedule.posts || [];

  if (!posts.length) {
    console.log('No posts found in schedule.');
    return;
  }

  for (const post of posts) {
    const channel = post.channel || defaultChannel;
    const voiceStyle = voices[post.voice]?.style || '';
    const target = post.target || defaultTarget;
    console.log(buildPreview(post, voiceStyle, channel));
    console.log(`Configured target placeholder: ${target}`);
    console.log('');
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
