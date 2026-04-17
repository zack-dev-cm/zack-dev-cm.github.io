# Browser Proof

> Public browser QA skill that turns a live browser session into a reusable evidence pack with steps, artifacts, checks, and a report.

## Summary
Browser Proof is a small public OpenClaw skill for browser QA and debugging. It creates a machine-readable session manifest, records expected-versus-actual browser steps, ties screenshots and logs to each step, validates the resulting bundle, and renders a markdown report that is easier to hand off than screenshots in chat.

## Project Link
https://zack-dev-cm.github.io/projects/browser-proof.md

## Key Features
- Creates one machine-readable browser session manifest with app, goal, surfaces, and run context
- Appends evidence-backed steps with expected result, actual result, status, and artifact references
- Checks the bundle for missing screenshots, incomplete failed steps, and absolute artifact paths before sharing
- Renders a shareable markdown report for GitHub issues, release checks, and engineering handoffs

## Tech Stack
- ClawHub
- Python
- Browser QA
- OpenClaw Skills
- Release Engineering

## Benchmarks & Analytics
- ClawHub downloads: 79 (public ClawHub listing, 2026-04-17)
- Published versions: 3 (public ClawHub listing, 2026-04-17)
- Public release: v1.0.2 (GitHub + ClawHub)
- Bundled scripts: 4 (init, append, check, render)
- Evidence fields: 5 (screenshot, dom, console, network, video)
- Validation status: publish-ready (smoke test + publish-guard audit)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/browser-proof)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/browser-proof)
- [Release v1.0.2](https://github.com/zack-dev-cm/browser-proof/releases/tag/v1.0.2)
