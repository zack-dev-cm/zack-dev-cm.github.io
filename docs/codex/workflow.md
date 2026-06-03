# Workflow

This repo uses a small public-surface loop for portfolio work.

## Default loop

1. Clarify: restate the goal, assumptions, and verification.
2. Inspect: read the smallest source files and generated artifacts needed for the task.
3. Implement: update source data, UI, scripts, resume, or tests.
4. Generate: run the existing scripts through `npm run build` when generated files need refresh.
5. Review: check for unsupported claims, stale links, leak risk, and recruiter scan quality.
6. Verify: run the documented checks.
7. Report: summarize changed surfaces and residual risks.

## Publish and Live-Site Verification

GitHub Pages does not read local `docs/` edits. The site updates only after the
corrected source and generated files are committed on `main`, pushed to
`origin/main`, and the `Deploy Pages` workflow finishes successfully.

For share-card, SEO, AEO, resume, generated project, or public metadata fixes:

1. Update source files first. For durable agent docs, edit `codex-docs/`; the
   `docs/codex/` copy is rebuilt by `npm run build`.
2. Run `npm run build` so `index.html`, `schema.jsonld`, `llms.txt`,
   `agent-discovery.json`, project markdown, and `docs/` are refreshed together.
3. Run the default verification stack before publishing: `npm run validate`,
   `npm run build`, `npm run security:gate`,
   `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e`, `npm run check:links`, and
   `npm run audit:codex`. Add `npm run validate:seo-aeo` for metadata/AEO work.
4. Commit and push the source and generated `docs/` changes to `main`.
5. Watch the `Deploy Pages` workflow for the pushed commit until it completes.
6. Verify the live URL with cache-busting requests. For metadata fixes, fetch
   `https://zack-dev-cm.github.io/?v=<commit-or-timestamp>` and confirm the
   expected `<title>`, `og:title`, `og:description`, `og:image`,
   `twitter:image`, structured-data image, and dated stats. Also fetch any new
   image URL with `curl -I` and require HTTP 200.

If the local `docs/index.html` is correct but the live site is stale, do not
keep editing copy. Check whether the commit was pushed, whether the Pages
workflow ran on that commit, and whether the live asset URL exists.

## Chrome Web Store Snapshot Loop

Chrome Web Store publisher stats are a dated public snapshot, not a stable
source of truth. Before changing CWS claims, inspect the live publisher search
and current detail pages, then update `CHROME_EXTENSION_STATS` in
`constants.ts`. Run `npm run build` so `public/chrome-extension-stats.json`,
`docs/chrome-extension-stats.json`, project markdown, `llms.txt`,
`geo.txt`, `agent-discovery.json`, and `schema.jsonld` all move together.

Do not carry forward old rows that are no longer visible in the current
publisher search as current published-extension stats. Rows without a visible
user count stay `null`/`Not reported`; stale Chrome-Stats rank or risk values
must not be mixed into a current Chrome Web Store detail-page snapshot.

## GitHub Project Feed Loop

1. Refresh: run `npm run sync:github -- --write` to rebuild `public/portfolio-updates.json` and `docs/portfolio-updates.json` from public GitHub metadata.
2. Review gates: require PASS review metadata on every synced update and project; the sync gate blocks unsafe URLs, secret-shaped text, local paths, private URLs, and instruction-bleed phrases.
3. Verify freshness: run `npm run sync:github:verify` before publishing so the generated feed is not stale against the current GitHub API snapshot.
4. Review/debug: run `npm run review:clawpatch -- ci --since HEAD --limit 20 --jobs 3 --reasoning-effort high` for sync, generated-artifact, or public-surface changes that need AI review. Keep `.clawpatch/` state out of the public surface.
5. Publish only after the default validation, security, link, audit, and E2E checks pass.

## When to use which agent

- `architect` for positioning, scope, acceptance criteria, and tradeoffs.
- `implementer` for focused source/script/test changes.
- `reviewer` for correctness, recruiter signal, public-surface risk, and missing checks.
- `evolver` for measured alternatives in copy, ranking, layout, or evidence presentation.
- `cleanup` for source/generated drift, stale docs, and follow-up hygiene.

## Parallel work

Only spawn subagents when the user explicitly asks for delegation or parallel agent work. Keep each delegated task concrete, disjoint, and tied to a checkable output.
