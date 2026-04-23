# Zakhar Pashkin Portfolio

Static React portfolio for Zakhar Pashkin, focused on AI product engineering, computer vision, VLM/LLM workflows, automation, ClawHub traction evidence, and resume delivery.

Available at: https://zack-dev-cm.github.io/

## Quick Start

Prerequisites: Node.js 22. For full resume PDF leak scanning, install `pdftotext` from Poppler; on macOS with Homebrew, use `brew install poppler`.

```bash
npm ci
npm run validate
npm run build
PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e
```

## Useful Commands

```bash
npm run stats:clawhub
npm run security:gate
npm run check:links
npm run audit:codex
```

## Deployment

- GitHub Pages: `npm run build` with the default base path `/docs/`.
- Cloudflare Pages: see `cloudflare-deploy.md`.
- Generated site output lives in `docs/`.

## Public-Surface Review

Before publishing changes that affect copy, project pages, resume files, or links, run the local security gate and link checker:

```bash
npm run security:gate
npm run check:links
npm run audit:codex
```

Responsible disclosure and vulnerability reporting are documented in [SECURITY.md](SECURITY.md).
