# OpenClaw YouTube Publisher

> Legacy project URL kept for compatibility. Use the canonical project link below.

> Open-source OpenClaw workflow for publishing a YouTube Short with reusable reporting and structured Midjourney/Suno provenance.

## Summary
This project packages a reusable OpenClaw workflow for YouTube Studio. It initializes a run file, records upload, check, and publish steps, keeps structured provenance for Midjourney, Suno, and local edit stages, validates the bundle, and renders a public-safe report with sensitive paths and unpublished URLs removed. The workflow is designed for repeatable publishing and debugging through a logged-in browser profile, not for hidden background posting.

## Project Link
https://zack-dev-cm.github.io/projects/openclaw-youtube-publisher.md

## Key Features
- Initializes one run manifest with channel, goal, stage, visibility, and file references
- Carries structured provenance for Midjourney visuals, Suno audio, local edit stages, and required public credits
- Logs upload, metadata, checks, and publish steps with status, notes, screenshots, and final public URL
- Validates the bundle before sharing so missing screenshots and unsafe artifact paths are caught early
- Renders a reusable markdown report for review, debugging, and future repeat runs

## Tech Stack
- ClawHub
- Python
- YouTube Studio
- OpenClaw
- Midjourney
- Suno
- GitHub Actions

## Benchmarks & Analytics
- ClawHub downloads: 530 (public ClawHub listing, 2026-06-04)
- Published versions: 13 (public ClawHub listing, 2026-06-04)
- Public release: v1.1.3 (GitHub + ClawHub)
- Platform: YouTube Studio (browser-based publish flow)
- Modes: dry_run + live (same manifest, different publish intent)
- Outputs: JSON + Markdown (run manifest, provenance block, and shareable report)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/youtube-creator-ops)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/youtube-creator-ops)
- [Release v1.1.3](https://github.com/zack-dev-cm/youtube-creator-ops/releases/tag/v1.1.3)
