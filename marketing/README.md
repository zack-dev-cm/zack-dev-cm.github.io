# Scheduled Posts (Noel / Moltbook)

This folder keeps a simple, repeatable schedule for social posts driven by the Noel and Moltbook voices. It is designed to work with the OpenClaw cron scheduler and Telegram channel delivery, while keeping content aligned with the portfolio SEO/GEO goals.

## Files
- `marketing/scheduled-posts.json`: Source of truth for upcoming posts (absolute dates + angles + keywords).
- `scripts/print-openclaw-cron.mjs`: Helper that prints OpenClaw cron commands for each scheduled post.

## Required vars (no secrets committed)
Use env vars from your existing stacks (Noel / Probes / OpenClaw). These are the minimal ones for scheduled delivery:
- `OPENAI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHANNEL_ID`
- `GITHUB_TOKEN` (optional, if you want repo stats in the post copy)
- `GITHUB_USERNAME` (optional)

## How to schedule
1) Update dates and angles in `marketing/scheduled-posts.json`.
2) Print cron commands:
   ```bash
   node scripts/print-openclaw-cron.mjs marketing/scheduled-posts.json
   ```
3) Review the generated commands and run them in your OpenClaw environment.

## Voice notes
- **Noel**: measured, research tone. Emphasize consent, telemetry, and multi-agent loops.
- **Moltbook**: playful but sharp. One punchy hook, crisp benefits, direct CTA.

## Tip
To keep posts SEO-friendly, prioritize portfolio links (project pages) first, then GitHub links as secondary CTAs.
