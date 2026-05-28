# Zakhar Pashkin Portfolio

Static React portfolio for Zakhar Pashkin, focused on AI product engineering, computer vision, VLM/LLM workflows, automation, ClawHub listing evidence, and resume delivery.

Available at: https://zack-dev-cm.github.io/

## ClawHub Listing Snapshot

The portfolio embeds a dated ClawHub listing-download snapshot into the React app, generated project markdown, crawler-readable HTML shell, `llms.txt`, `geo.txt`, and agent-discovery files. Latest verified snapshot: **13,388 tracked downloads across 49 public skills** from public ClawHub listings, checked on **2026-05-28** with `npm run stats:clawhub -- --write`.

### Most Downloaded Skills

| Rank | Skill | Downloads | Versions | Stars |
| --- | --- | ---: | ---: | ---: |
| 1 | [Data Science CV Repro Reviewer](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab) | 703 | 12 | 1 |
| 2 | [OpenClaw CWS Publisher](https://clawhub.ai/zack-dev-cm/openclaw-cws-publisher) | 610 | 14 | 2 |
| 3 | [Agentic Codex Dev Reviewer](https://clawhub.ai/zack-dev-cm/agentic-codex-dev) | 594 | 13 | 1 |
| 4 | [SOTA Agent](https://clawhub.ai/zack-dev-cm/sota-agent) | 591 | 12 | 2 |
| 5 | [GitHub ClawHub Release Reviewer](https://clawhub.ai/zack-dev-cm/github-clawhub-launcher) | 574 | 9 | 1 |
| 6 | [OpenClaw YouTube Publisher](https://clawhub.ai/zack-dev-cm/youtube-creator-ops) | 473 | 13 | 1 |
| 7 | [Artifact Deck](https://clawhub.ai/zack-dev-cm/artifact-deck) | 433 | 7 | 1 |
| 8 | [OpenClaw Chinese Laoshi Ops](https://clawhub.ai/zack-dev-cm/openclaw-agent-chinese-laoshi) | 419 | 7 | 1 |
| 9 | [Browser Proof](https://clawhub.ai/zack-dev-cm/browser-proof) | 411 | 6 | 0 |
| 10 | [Publish Guard](https://clawhub.ai/zack-dev-cm/public-surface-review) | 408 | 6 | 1 |

### Codex And Agent-Skill Review

- **Codex-branded skills:** 765 downloads across 2 packages. `agentic-codex-dev` is #3 overall with 594 downloads; `codex-claude-clawhub-skill-bridge` adds 171 downloads.
- **Agent-skill workflow cluster:** 1,731 downloads across 9 packages when grouped by skill-routing, skill-packaging, install, portability, and Codex/agent workflow names.
- **Read:** the strongest pull is toward practical delivery gates: repo review, CWS publishing, release launchers, browser proof, publish guard, artifact cleanup, and reproducible CV work. Pure skill-infrastructure packages are newer and lower-volume, but the Codex/agent development surface already has one top-three skill.

## Quick Start

Prerequisites: Node.js 22. For full resume PDF leak scanning, install `pdftotext` from Poppler; on macOS with Homebrew, use `brew install poppler`.

```bash
npm ci
npm run validate
npm run build
PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e
```

## Useful Commands

```bash
npm run stats:clawhub
npm run security:gate
npm run check:links
npm run audit:codex
```

## Deployment

- GitHub Pages: `npm run build` with the default base path `/docs/`.
- Cloudflare Pages: see `cloudflare-deploy.md`.
- Generated site output lives in `docs/`.

## Public-Surface Review

Before publishing changes that affect copy, project pages, resume files, or links, run the local security gate and link checker:

```bash
npm run security:gate
npm run check:links
npm run audit:codex
```

Responsible disclosure and vulnerability reporting are documented in [SECURITY.md](SECURITY.md).
