# Artifact Deck

> Public OpenClaw skill for building reproducible PPTX decks from curated notes, status bullets, and screenshots.

## Summary
Artifact Deck is a small public OpenClaw skill and local-first Python toolkit for turning project artifacts into a decision-ready PPTX. It builds a clean deck from a JSON manifest, validates slide and image inputs before generation, writes the deck locally, and renders a share-safe markdown summary that preserves the slide list and a rebuild command template without exposing absolute local paths. The public contract is intentionally narrow in v1.0.3: curated notes and screenshots in, one default stakeholder layout out.

## Project Link
https://zack-dev-cm.github.io/projects/artifact-deck.md

## Key Features
- Builds one reproducible PPTX deck from markdown-backed sections, direct bullet slides, and optional screenshot appendix entries
- Validates missing content, empty slides, and broken image paths before deck generation starts
- Keeps the layout simple and deterministic for weekly updates, launch reviews, and client status decks
- Renders a share-safe markdown summary with slide titles, slide counts, and a rebuild command template
- Ships with GitHub Actions smoke coverage for the manifest, validation, build, and summary flow

## Tech Stack
- ClawHub
- Python
- python-pptx
- OpenClaw Skills
- PPTX
- Release Engineering

## Benchmarks & Analytics
- ClawHub downloads: 63 (live public ClawHub listing, 2026-04-24)
- Published versions: 4 (live public ClawHub listing, 2026-04-24)
- Public release: v1.0.3 (GitHub + ClawHub)
- Bundled scripts: 4 (init, check, build, render)
- Primary output: PPTX (deterministic local deck build)
- Summary mode: share-safe (no absolute local paths in the markdown output)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/artifact-deck)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/artifact-deck)
- [Release v1.0.3](https://github.com/zack-dev-cm/artifact-deck/releases/tag/v1.0.3)
