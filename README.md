# Zakhar Pashkin — Applied Machine Learning

The source for my engineering portfolio: computer vision, document AI, agentic systems, maintained services, and released ML tools.

[Portfolio](https://zack-dev-cm.github.io/) · [Resume PDF](https://zack-dev-cm.github.io/resume/zakhar-pashkin-senior-ml-engineer.pdf) · [GitHub profile](https://github.com/zack-dev-cm)

## Selected work

- **Riverstart Document AI:** document assistants with structured answers, deterministic checks, and evidence for specialist review.
- **Dermaself:** guided capture, skin-analysis models, and mobile/API integration.
- **Agnitra:** a PyPI-published SDK and CLI for model profiling and inference optimization.
- **Calorio:** a maintained Telegram nutrition service for meal logging through photos, voice, and text.
- **Engineering analysis:** R&D for scanned drawings, CAD, and construction-document interpretation.

The site includes individual case studies, a searchable project archive, current experience, and an accessible resume. The interface is built with React, TypeScript, and Vite; static project pages and structured data keep the content readable without JavaScript.

## Development

Requires Node.js 22. Install Poppler for PDF text checks and the [Antirot audit harness](https://github.com/zack-dev-cm/antirot) for the strict release audit.

```bash
npm ci
npm run dev
```

Project content lives in `constants.ts`. Design rules live in `DESIGN.md`. The editable resume source and PDF generator are in [`scripts/resume/`](scripts/resume/README.md).

## Verification

```bash
npm run validate
npm run build
npm run validate:seo-aeo
PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e
npm run security:gate
npm run check:links
npm run audit:codex
```

## Publishing

GitHub Actions builds and verifies changes on `main`, then deploys to GitHub Pages. Generated output lives in `docs/`; update the source and rebuild rather than editing those files directly. Existing project and resume links retain their compatibility aliases.

See [AGENTS.md](AGENTS.md) for the repository map and [SECURITY.md](SECURITY.md) for vulnerability reporting.
