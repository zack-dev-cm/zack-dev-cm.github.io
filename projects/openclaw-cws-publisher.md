# OpenClaw CWS Publisher

> Release kit for packaging Chrome extensions, scanning tracked files, and rendering GitHub or ClawHub publish metadata.

## Summary
`OpenClaw CWS Publisher` is now a narrow public release kit. It packages a target extension, scans tracked files for public-surface leaks, generates GitHub metadata, and renders publish commands with explicit GitHub topics and ClawHub tags.

## Project Link
https://zack-dev-cm.github.io/projects/openclaw-cws-publisher.md

## Key Features
- Chrome extension ZIP packaging for a target repo
- Tracked-file leak scanning with `git ls-files`
- Generated GitHub metadata and explicit repo topics
- Optional ClawHub publish commands with explicit tags

## Tech Stack
- Python
- GitHub CLI
- ClawHub CLI
- OpenClaw

## Benchmarks & Analytics
- Release line: v0.2.0
- Public skill scope: packaging, audit, and metadata only
- OpenClaw scan: Benign

## Links
- [View on GitHub](https://github.com/zack-dev-cm/openclaw-cws-publisher)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher)
