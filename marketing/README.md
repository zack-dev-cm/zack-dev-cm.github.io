# Scheduled Posts Template

This folder contains a small public example for scheduling portfolio or project posts.
It is intentionally generic and omits live channel targets, private audience settings,
provider credentials, and internal brand voice notes.

## Files
- `marketing/scheduled-posts.json`: Example source of truth for upcoming posts.
- `scripts/print-openclaw-cron.mjs`: Helper that prints OpenClaw cron commands for each scheduled post.

## Configuration

Use your own provider credentials, publishing destination, and delivery environment outside
the public repo. Keep channel IDs, tokens, and scheduling credentials in private configuration.

## How to schedule
1. Update dates, angles, and URLs in `marketing/scheduled-posts.json`.
2) Print cron commands:
   ```bash
   node scripts/print-openclaw-cron.mjs marketing/scheduled-posts.json
   ```
3. Review the generated commands and run them in your own delivery environment.

## Public-safe usage notes

- Treat the checked-in JSON as an example template, not a live schedule.
- Keep brand voice rules, target audiences, and channel-specific tactics in private ops docs.
- Prefer project pages as primary links and repo links as secondary links when publishing technical updates.
