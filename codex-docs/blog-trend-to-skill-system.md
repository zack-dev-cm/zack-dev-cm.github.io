# Trend-to-Skill Blog System

This repo now treats technical publishing as a monitored workflow, not a loose content calendar.

## Goal

Turn fast-moving signals from X, DeepSeek, OpenAI Codex use cases, CV/DL research, paper-review channels, and skill repositories into public-safe `/docs/blog/` pages that can end in a reusable skill, CLI, checklist, or reproducibility gate.

## Operating Loop

1. Capture signals from stable public sources where possible.
2. Use Computer Use only for logged-in X browsing or other UI-only discovery.
3. Score each signal with `npm run blog:score`.
4. Promote a signal only when it has a reader problem, public evidence, a skill/workflow angle, and a clear guardrail.
5. Publish the article as human-authored field-note copy, then create or update the skill only if the workflow repeats.

## Paper Review Lane

Use public paper-review channels such as `@gonzo_ML` for discovery style, not as final proof. The useful pattern is concise: what the paper changed, why it matters, and what a practitioner can try. Verify the paper, code, benchmark, or official project page before publishing.

For day-to-day engineering, keep the paper workflow token-light:

1. Triage from title, abstract, figures, limitations, and repo README before sending anything to a model.
2. Ask for a small paper card only: claim, mechanism, evidence, failure mode, and likely codebase touchpoint.
3. Search the local codebase yourself with `rg`; pass only the relevant files or snippets into the model.
4. Convert the idea into one reversible experiment, one test/eval, and one stop rule.
5. Do not ingest full PDFs, long threads, or whole repositories unless the cheap pass proves the idea can change a real workflow.

Current seed: `microsoft/SkillOpt` should become a separate blog page first, then a skill-refinement checklist only if the idea repeats. Keep the queue balanced: no more than two AI-agent or LLM-infra papers should ship without one CV/DL paper review or reproducibility gate.

## Public-Surface Rules

- X is discovery, not proof. Verify post-derived claims against official docs, repositories, papers, or reproducible local checks before publishing.
- Paper-review channels are discovery and framing aids. Cite the original paper/code/review route, and label practical adaptations as engineering interpretation.
- Do not publish logged-in feed screenshots unless they are manually redacted and approved.
- Do not claim benchmarks, adoption, reach, or revenue without a dated public source.
- Medium-style articles should use first-hand builder context, a specific reader win, accurate title/subtitle/cover image framing, and useful source links.

## Files

- `constants.ts`: `BLOG_TREND_SYSTEM` defines the public homepage model.
- `scripts/score-trend-blog-signals.mjs`: deterministic scorer for captured trend signals.
- `marketing/trend-blog-signals.example.json`: safe example input format for the scorer.
- `field-notes/trend-to-skill-blog-system.md`: generated public Markdown system page.

## Verification

Run:

```bash
npm run blog:score
npm run validate
npm run build
npm run security:gate
```
