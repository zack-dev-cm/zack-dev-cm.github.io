# GitHub + ClawHub Downloads Tracker

> CLI and report flow for tracking GitHub stars, live ClawHub downloads, publisher stats, and traction deltas.

## Summary
GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public evidence surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and copied publisher dashboard stats, then renders a blunt traction report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub downloads visible in the portfolio instead of burying them inside separate package pages.

## Project Link
https://zack-dev-cm.github.io/projects/github-clawhub-downloads-tracker.md

## Key Features
- Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo traction
- Parses copied publisher dashboard stats for downloads, stars, version counts, and explicit-only skills
- Stores snapshots so repeated runs can show deltas, fastest package download gains, and current pace
- Ranks consolidation and positioning bets when GitHub stars and ClawHub downloads are not converting

## Tech Stack
- Python
- CLI
- GitHub API
- ClawHub Convex
- JSON Snapshots
- Markdown Reports
- Open-source Analytics

## Benchmarks & Analytics
- Tracked ClawHub downloads: 1,349 (live public ClawHub listings, 2026-04-23 across 10 packages)
- Tracked packages: 10 (CV Repro Lab, SOTA Agent, launcher, browser-proof, publish-guard, YouTube publisher, redactor, deck, HH agent, CWS publisher)
- CV Repro Lab downloads: 457 total (226 data-science-cv-repro-lab + 231 sota-agent, 2026-04-23)
- Strongest package: 231 downloads (sota-agent live public listing, 2026-04-23)
- Report outputs: 3 (text, JSON, Markdown)
- Projection horizon: 30 days (pace and peer-conversion upside scenarios)

## Links
- [Open CV Repro Lab on ClawHub](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab)
- [Open SOTA Agent on ClawHub](https://clawhub.ai/zack-dev-cm/sota-agent)
