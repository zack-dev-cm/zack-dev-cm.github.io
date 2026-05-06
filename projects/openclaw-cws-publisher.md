# OpenClaw CWS Publisher

> Public release kit for Chrome extension packaging, CWS listing validation, leak scanning, design gates, and publish-command generation.

## Summary
OpenClaw CWS Publisher is a public release kit for Chrome extension projects. It packages the exact extension ZIP intended for upload, validates the manifest and CWS listing contract, scans tracked and untracked public-surface files for leak patterns, runs discovered local E2E/reviewer gates, enforces design score reports, checks Chrome Stable freshness, and renders reproducible GitHub and ClawHub publish commands. It is a release helper, not a bundled extension product.

## Project Link
https://zack-dev-cm.github.io/projects/openclaw-cws-publisher.md

## Key Features
- Builds and validates the exact Chrome Web Store ZIP against source manifest and listing JSON
- Scans tracked and untracked non-ignored files for local paths, localhost URLs, websockets, and token-shaped strings
- Runs local E2E, reviewer, design, Chrome Stable, and competitor checks when a target extension exposes them
- Renders reproducible GitHub release and ClawHub publish commands from a launch manifest

## Tech Stack
- ClawHub
- Python
- Chrome Web Store
- Playwright
- Release Engineering
- Security Review

## Benchmarks & Analytics
- ClawHub downloads: 314 (public ClawHub listing, 2026-05-06)
- Published versions: 12 (public ClawHub listing, 2026-05-06)
- Release checks: 7 (ZIP, listing, leaks, E2E, design, Chrome Stable, competitors)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/openclaw-cws-publisher)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher)
