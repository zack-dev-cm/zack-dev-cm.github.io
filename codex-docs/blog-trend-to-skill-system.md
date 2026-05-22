# Trend-to-Skill Blog System

This repo now treats technical publishing as a monitored workflow, not a loose content calendar.

## Goal

Turn fast-moving signals from X, DeepSeek, OpenAI Codex use cases, CV/DL research, and skill repositories into public-safe articles that can end in a reusable skill, CLI, checklist, or reproducibility gate.

## Operating Loop

1. Capture signals from stable public sources where possible.
2. Use Computer Use only for logged-in X browsing or other UI-only discovery.
3. Score each signal with `npm run blog:score`.
4. Promote a signal only when it has a reader problem, public evidence, a skill/workflow angle, and a clear guardrail.
5. Publish the article as human-authored field-note copy, then create or update the skill only if the workflow repeats.

## Public-Surface Rules

- X is discovery, not proof. Verify post-derived claims against official docs, repositories, papers, or reproducible local checks before publishing.
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
