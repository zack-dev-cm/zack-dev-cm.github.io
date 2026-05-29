# Daily Field Notes Publishing System

This is the public-safe operating plan for the 14-day AI Agent Field Notes experiment.
It keeps the traffic loop concrete without storing credentials, subscriber data, channel
IDs, private analytics, or unpublished audience research in the repo.

## Goal

Reach a validated path toward 100 visits/day by publishing proof-backed daily notes,
measuring referral quality, and moving interested readers into a weekly proof-pack
newsletter.

## Daily Workflow

1. Pick the next note from `FIELD_NOTES_PLAN` in `constants.ts`.
2. Write the post from the `writerBrief`.
3. Use the `thumbnailDirection` to create a screenshot-first thumbnail.
4. For paper-review ideas, publish a separate page under `blog/` first, then link it from the portfolio Blog section.
5. Publish the post or markdown note.
6. Share one primary post and one secondary short post.
7. Record visits, subscribers, external referrals, saves, and replies outside the repo.

## Paper Review Gate

Use the concise paper-card style from public ML review channels such as Gonzo ML: what changed, why it matters, and what a practitioner can do next. Verify against the original paper, code, repo, or official project page before publishing.

Minimum-token adaptation for engineers:

- Start from title, abstract, figures, limitations, and repo README; do not paste full PDFs by default.
- Ask for one small claim card, then search the local codebase with `rg`.
- Pass only relevant files or snippets into the model.
- Convert the paper into one reversible workflow change, one validation case, and one stop rule.
- Keep AI-agent and CV/DL papers balanced; after one or two LLM-agent posts, queue a CV/DL paper with a reproducibility gate.

## Writer Gate

Each post must pass these checks before publishing:

- The first paragraph names the concrete public problem.
- The post includes one useful artifact: checklist, table, command, screenshot, prompt, or dashboard.
- The evidence comes from public pages, generated portfolio files, or dated marketplace snapshots.
- The CTA is specific and does not promise traffic, revenue, ranking, or private access.
- The post does not include private paths, account identifiers, credentials, client details, hidden analytics, or raw subscriber data.

## Thumbnail Gate

Use generated imagery only as support. The trusted order is:

1. Real UI, stats, terminal, PDF, or generated-file screenshot.
2. Annotated screenshot with short callouts.
3. Clean branded card using the real artifact as the central visual.
4. GPT Image background or texture only if it clarifies the topic.

Recommended prompt structure:

```text
Create a clean technical editorial thumbnail for [POST TITLE].
Use a real artifact screenshot as the primary visual and keep labels readable.
Style: dark dashboard, restrained accent color, no fake charts, no secrets, no private paths.
Composition: left proof artifact, right concise title band, small date/check badge.
Output: 1200x630 for Open Graph and 1080x1080 crop-safe social square.
```

Model note: use the latest GPT Image model available in the account. If a `gpt-image-2`
model is exposed, use it; otherwise use the current documented GPT Image model.

## Newsletter Gate

The public CTA is `AI Agent Field Notes`: one weekly proof pack every Sunday during the
experiment. Subscriber capture stays manual through email until a provider is connected.
Do not commit provider credentials, subscriber exports, automation tokens, or list IDs.

Provider options:

- Buttondown for a simple embedded form.
- Resend Audiences/Broadcasts for developer-owned mail delivery.
- beehiiv if newsletter growth tools become more important than engineering control.

## Vercel Gate

`vercel.json` expects:

- build command: `npm run build`
- output directory: `docs`
- Web Analytics enabled through `@vercel/analytics/react`
- canonical host decision before indexing both GitHub Pages and Vercel
- redirects or canonical tags updated if Vercel becomes primary
- analytics reviewed without committing private dashboard exports

## Measurement Gates

- Day 14: 25 visits/day or rework the topic/channel fit.
- Day 30: 30 visits/day 7-day average or stop daily posting.
- Day 45: 75 visits/day 7-day average or change the offer.
- Day 60: 100 visits/day 7-day average before calling the loop validated.

Shutdown rule: if no post earns external referrals or subscribers by day 14, stop adding
site features and rework topics, channels, and share triggers first.
