# Overview

This repository publishes a portfolio for Zakhar Pashkin as an ML and computer vision engineer who builds AI products with VLM/LLM, automation, custom-model, and launch-delivery evidence.

## Product

- Primary users: recruiters, hiring managers, clients, collaborators, search crawlers, and AI retrieval systems.
- Core job: make shipped AI product work scannable, evidence-backed, linkable, and safe to publish.
- Non-goals: private client operations, raw internal notes, secret-bearing deployment details, or unverified traction claims.

## Repo landmarks

- App shell: `App.tsx`
- Portfolio data: `constants.ts`
- Shared UI: `components/`
- Project and crawlable artifact generation: `scripts/generate-project-markdown.mjs`
- Public-surface validation: `scripts/security-gate.mjs`, `scripts/validate-portfolio.mjs`, `scripts/check-links.mjs`
- E2E tests: `tests/e2e.spec.ts`
- Deploy output: `docs/`
- Source for Codex docs: `codex-docs/`, copied to `docs/codex/` after build

## Standard checks

- Source validation: `npm run validate`
- Build: `npm run build`
- Public-surface gate: `npm run security:gate`
- UI smoke: `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e`
- Link audit: `npm run check:links`
