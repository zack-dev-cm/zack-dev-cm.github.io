# YouTube Creator Ops

> Public OpenClaw skill for planning, staging, publishing, and verifying a YouTube Shorts run through one reusable evidence bundle.

## Summary
YouTube Creator Ops is a small public OpenClaw skill for YouTube Studio publishing runs. It creates a machine-readable run manifest, records evidence-backed steps, validates the resulting bundle, and renders a markdown report for launch review, debugging, or operator handoff. The public workflow defaults to dry run and keeps login, CAPTCHA, passkey, and 2FA checkpoints operator-owned.

## Project Link
https://zack-dev-cm.github.io/projects/youtube-creator-ops.md

## Key Features
- Creates one machine-readable run manifest with channel, goal, stage, surfaces, visibility, and asset references
- Appends evidence-backed steps with expected result, actual result, status, issue keys, artifacts, and final published URL
- Checks the bundle for missing screenshots, incomplete failed steps, and unsafe absolute artifact paths before sharing
- Renders a shareable markdown report for launch review, debugging, and repeatable publishing handoffs

## Tech Stack
- ClawHub
- Python
- YouTube
- OpenClaw Skills
- Release Engineering

## Benchmarks & Analytics
- Public release: v1.0.0 (GitHub + ClawHub)
- Bundled scripts: 4 (init, append, check, render)
- Run stages: 2 (dry_run and live)
- Validation status: publish-ready (smoke test + publish-guard audit)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/youtube-creator-ops)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/youtube-creator-ops)
- [Release v1.0.1](https://github.com/zack-dev-cm/youtube-creator-ops/releases/tag/v1.0.1)
