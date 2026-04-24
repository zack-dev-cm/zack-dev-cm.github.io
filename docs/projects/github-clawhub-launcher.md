# GitHub + ClawHub Launcher

> Public launcher skill that turns one local project folder into a repeatable GitHub repo plus ClawHub publish flow.

## Summary
GitHub + ClawHub Launcher is a small public OpenClaw skill for release preparation. It creates a machine-readable launch manifest, checks the public release surface, renders GitHub release notes, and prints the exact commands needed to publish a GitHub repo and a ClawHub package from one local project folder.

## Project Link
https://zack-dev-cm.github.io/projects/github-clawhub-launcher.md

## Key Features
- Creates one launch manifest for GitHub repo metadata, ClawHub package metadata, topics, tags, and changelog text
- Checks README, LICENSE, SKILL.md, agents metadata, semver, slug shape, and basic description quality before publishing
- Renders release notes and a publish command sheet instead of rewriting the same launch steps from memory
- Pairs cleanly with Publish Guard when you want an audit before the final push

## Tech Stack
- ClawHub
- GitHub CLI
- Python
- Release Engineering
- OpenClaw Skills

## Benchmarks & Analytics
- ClawHub downloads: 109 (live public ClawHub listing, 2026-04-24)
- Published versions: 3 (live public ClawHub listing, 2026-04-24)
- Public release: v1.0.2 (GitHub + ClawHub)
- Bundled scripts: 4 (manifest, check, notes, commands)
- Publish surfaces: 2 (GitHub repo + ClawHub package)
- Validation status: publish-ready (launcher check + publish-guard audit)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/github-clawhub-launcher)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/github-clawhub-launcher)
- [Release v1.0.2](https://github.com/zack-dev-cm/github-clawhub-launcher/releases/tag/v1.0.2)
