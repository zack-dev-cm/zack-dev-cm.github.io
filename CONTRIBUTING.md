# Contributing

This is a personal portfolio repo, so most changes are owner-maintained. Small fixes for broken links, typos, accessibility, validation, or public-surface safety are welcome.

## Quick Start

Prerequisites: Node.js 22 and `pdftotext` from Poppler. The security gate extracts public PDF text before publishing.

```bash
npm ci
npm run validate
npm run build
PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e
npm run audit:codex
```

## Change Rules

- Update source data before generated files.
- Run `npm run build` when project pages, crawlable files, resume files, sitemap data, or deployment output needs refresh.
- Keep metrics dated and sourced when they can change.
- Do not add secrets, local paths, private URLs, or private client notes.
- Keep resume, hero copy, featured projects, and generated project Markdown consistent.

## Pull Request Checks

Before opening a pull request, run:

```bash
npm run validate
npm run build
npm run security:gate
PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e
npm run audit:codex
```

Run `npm run check:links` when links or public pages change.
