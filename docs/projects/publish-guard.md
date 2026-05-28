# Publish Guard

> Public release-audit skill that reviews a repo, README, SKILL.md, and launch copy before GitHub or ClawHub publish.

## Summary
Publish Guard is a small public OpenClaw skill for pre-release audits. It scans a repo for obvious leak patterns, checks whether README and SKILL copy are actually public-facing, scores launch copy near the top of the repo, and renders one concise audit that answers publish now or fix first.

## Project Link
https://zack-dev-cm.github.io/projects/publish-guard.md

## Key Features
- Scans for obvious leak patterns such as token-shaped strings, localhost URLs, websocket endpoints, and absolute paths
- Checks README, SKILL.md, and public metadata for audience mismatch, buried quick starts, and operator-heavy wording
- Scores the landing-page copy so the repo intro can be reviewed like a product surface instead of a private note
- Renders one markdown audit that is easy to use before GitHub release or ClawHub publish

## Tech Stack
- ClawHub
- Python
- Release Engineering
- OpenClaw Skills
- GitHub

## Benchmarks & Analytics
- ClawHub downloads: 408 (public ClawHub listing, 2026-05-28)
- Published versions: 6 (public ClawHub listing, 2026-05-28)
- Public release: v1.0.2 (GitHub + ClawHub)
- Bundled scripts: 4 (leaks, surface, copy score, report)
- Audit outputs: 4 (2 scans, 1 score, 1 markdown audit)
- Decision surface: publish or fix (single release-ready recommendation)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/publish-guard)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/public-surface-review)
- [Release v1.0.2](https://github.com/zack-dev-cm/publish-guard/releases/tag/v1.0.2)
