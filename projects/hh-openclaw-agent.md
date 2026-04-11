# HH OpenClaw Agent

> Public OpenClaw skill for reviewed hh.ru application packets, live browser execution, approval gates, and auditable submission bundles.

## Summary
HH OpenClaw Agent is a small public OpenClaw skill for hh.ru application work through OpenClaw. It creates a machine-readable packet for one vacancy response flow, logs the live browser steps with evidence, validates the resulting bundle, and renders a markdown report for review, debugging, or funnel tracking. The public workflow requires an approved review state before submit and treats login, CAPTCHA, passkey, and 2FA as operator-owned interruptions.

## Project Link
https://zack-dev-cm.github.io/projects/hh-openclaw-agent.md

## Key Features
- Creates one machine-readable application packet with vacancy details, cover letter content, review state, and blocked actions
- Appends evidence-backed browser steps with status, effect, artifacts, issue keys, and optional outcome URL
- Checks approval state, failed-step detail, screenshot coverage, and unsafe absolute artifact paths before the bundle is shared
- Renders a concise markdown report for job-funnel review, debugging, and operator handoff

## Tech Stack
- ClawHub
- Python
- hh.ru
- OpenClaw Skills
- Career Automation

## Benchmarks & Analytics
- Public release: v1.0.0 (GitHub + ClawHub)
- Bundled scripts: 4 (init, append, check, render)
- Approval gate: required (review must be approved before submit)
- Validation status: publish-ready (smoke test + publish-guard audit)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/hh-openclaw-agent)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/hh-openclaw-agent)
- [Release v1.0.0](https://github.com/zack-dev-cm/hh-openclaw-agent/releases/tag/v1.0.0)
