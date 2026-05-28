# GitHub + ClawHub Downloads Tracker

> CLI and report flow for tracking GitHub stars, dated ClawHub snapshots, publisher stats, and traction deltas.

## Summary
GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public evidence surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and Chrome Web Store detail-page stats, then renders a blunt traction report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub snapshots visible in the portfolio instead of burying them inside separate package pages.

## Project Link
https://zack-dev-cm.github.io/projects/github-clawhub-downloads-tracker.md

## Key Features
- Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo traction
- Records Chrome Web Store detail-page stats for explicit user counts, ratings, versions, and not-reported rows
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
- Tracked ClawHub downloads: 13,388 (public ClawHub owner profile, 2026-05-28 across 49 skills)
- Tracked public skills: 49 (49 rows from live ClawHub publisher profile and paginated published-skill query, 2026-05-28)
- CV Repro Lab downloads: 1,294 total (703 data-science-cv-repro-lab + 591 sota-agent, 2026-05-28)
- Strongest skill: 703 downloads (data-science-cv-repro-lab public listing, 2026-05-28)
- Report outputs: 3 (text, JSON, Markdown)
- Projection horizon: 30 days (pace and peer-conversion upside scenarios)

## Links
- [Open CV Repro Lab on ClawHub](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab)
- [Open SOTA Agent on ClawHub](https://clawhub.ai/zack-dev-cm/sota-agent)
