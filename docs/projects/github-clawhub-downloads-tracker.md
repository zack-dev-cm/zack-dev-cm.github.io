# GitHub + ClawHub Downloads Tracker

> CLI and report flow for tracking GitHub stars, dated ClawHub listing snapshots, publisher stats, and listing deltas.

## Summary
GitHub + ClawHub Downloads Tracker packages the `github-stars-optimizer` workflow into a public metrics surface. It pulls GitHub repository metadata, ClawHub leaderboards, explicit skill slugs, and Chrome Web Store detail-page stats, then renders a blunt listing report with downloads, star conversion gaps, snapshot deltas, 30-day scenarios, and consolidation bets. It keeps ClawHub snapshots visible in the portfolio instead of burying them inside separate package pages.

## Project Link
https://zack-dev-cm.github.io/projects/github-clawhub-downloads-tracker.md

## Key Features
- Fetches live ClawHub package stats and keeps exact download counts visible beside GitHub repo metadata
- Records Chrome Web Store detail-page stats only when public user counts, ratings, and versions are visible
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
- Tracked ClawHub downloads: 19,444 (public ClawHub owner profile, 2026-06-12 across 53 skills)
- Tracked public skills: 53 (53 rows from live ClawHub publisher profile and paginated published-skill query, 2026-06-12)
- CV Repro Lab downloads: 1,554 total (850 data-science-cv-repro-lab + 704 sota-agent, 2026-06-12)
- Strongest skill: 850 downloads (data-science-cv-repro-lab public listing, 2026-06-12)
- Report outputs: 3 (text, JSON, Markdown)
- Projection horizon: 30 days (pace and peer-conversion upside scenarios)

## Links
- [Open CV Repro Lab on ClawHub](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab)
- [Open SOTA Agent on ClawHub](https://clawhub.ai/zack-dev-cm/sota-agent)
