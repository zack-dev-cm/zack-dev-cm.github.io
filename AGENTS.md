# AGENTS.md

This repository publishes Zakhar Pashkin's portfolio, project case studies, crawlable AI context files, and resume assets. Use this file as the index, not the full manual.

## Operating rules

- Restate the user goal and name the verification step before editing files.
- Keep diffs surgical. Do not refactor adjacent modules unless the task needs it.
- Treat generated portfolio artifacts as public surface. New docs, project pages, resume text, and crawlable files must clear leak and bleed checks.
- Keep private review notes, incident details and session handoffs outside this public repository. Build output must contain only reviewed portfolio content.
- Use the custom agents in `.codex/agents/` when the user explicitly asks for delegation or parallel agent work.

## Repo map

- [Project overview and development](README.md)
- [Security and publication checks](SECURITY.md)

## Main code paths

- `App.tsx`: React portfolio shell, sections, project explorer, modal, and contact surfaces.
- `constants.ts`: Author profile, social links, ClawHub stats, latest updates, companies, and project data.
- `components/`: Shared icons, sidebar, and floating contact controls.
- `scripts/`: Project markdown generation, postbuild copy step, validation, link checks, security gate, and ClawHub stat fetcher.
- `public/`: Static images, company logos, resume source assets, and static routes copied by Vite.
- `projects/`: Generated public Markdown case studies.
- `docs/`: GitHub Pages output. Vite rebuilds this directory; do not hand-edit generated files without updating the source.
- `scripts/publication-boundary.mjs`: Prevents private review material and generation records from entering publication.

## Default verification

1. Run `npm run validate`.
2. Run `npm run build`.
3. Run `npm run security:gate`.
4. Run `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e` for UI or public-surface changes.
5. Run `npm run check:links` when links, resume, or generated public pages change.
6. Run `npm run audit:public` before publishing.

## Project-scoped custom agents

- `.codex/agents/architect.toml`
- `.codex/agents/implementer.toml`
- `.codex/agents/reviewer.toml`
- `.codex/agents/evolver.toml`
- `.codex/agents/cleanup.toml`
