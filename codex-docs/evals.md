# Evals

Use this file to define the checks that keep portfolio changes honest.

## Rules

- Every meaningful task should name one primary success check.
- Prefer deterministic local validation before screenshots or external link checks.
- Public repos need a leak gate for secrets, local paths, local URLs, and instruction bleed before merge.
- Generated artifacts must be refreshed when source data, resume links, project links, or crawlable content changes.
- Metrics must include source context and dates when they can change over time.

## Required checks

- Source validation: `npm run validate`
- Build and generation: `npm run build`
- Public-surface gate: `npm run security:gate`
- E2E smoke: `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e`
- Link audit for link/resume/page changes: `npm run check:links`
- Open-source gate: `npm run audit:codex`

## Experiment log

| Date | Change | Metric | Result | Kept |
| --- | --- | --- | --- | --- |
| 2026-04-23 | AI Product Engineer repositioning plus ClawHub downloads tracker | Recruiter scan clarity and public traction visibility | Added hero, featured, resume, and downloads evidence surfaces | yes |
