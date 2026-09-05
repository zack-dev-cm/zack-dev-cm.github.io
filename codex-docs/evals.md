# Evals

Use this file to define the checks that keep portfolio changes honest.

## Rules

- Every meaningful task should name one primary success check.
- Prefer deterministic local validation before screenshots or external link checks.
- Public repos need a leak gate for secrets, local paths, local URLs, and instruction bleed before merge.
- Generated artifacts must be refreshed when source data, resume links, project links, or crawlable content changes.
- Metrics must include source context and dates when they can change over time.
- GitHub-synced project updates must pass the portfolio update review metadata gate before they are written or deployed.

## Required checks

- Source validation: `npm run validate`
- Build and generation: `npm run build`
- Public-surface gate: `npm run security:gate`
- E2E smoke: `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e`
- Search relevance: `npm run test:search` against the actual reviewed catalogue. Check complete query meaning, visible case-study text, exact names, short acronyms and explicit sorting. A passing exact-name query does not establish general recruiter search quality.
- Link audit for link/resume/page changes: `npm run check:links`
- Public source/artifact audit: `npm run audit:public`
- GitHub feed freshness gate: `npm run sync:github:verify`
- ClawPatch AI review/debug pass for public-surface or sync changes: `npm run review:clawpatch -- ci --since HEAD --limit 20 --jobs 3 --reasoning-effort high`

## Public audit command migration — 5 September 2026

`audit:public` runs the repository-owned source, positioning, security, generated
metadata and catalogue/staging checks. It exits nonzero if any check fails. It
requires the existing Node dependencies and adds no Python package or service.
Browser behavior, external link access and an independent ClawPatch/source review
are separate evidence; passing these structural checks is not scientific validation.

The previous `audit:codex` wrapper required `codex_harness`, but its documented
AntiRot installation now supplies a Markdown citation/claim linter with a different
interface and purpose. That dead dependency and its narrow fallback were retired.
`audit:codex` remains only a compatibility alias which announces the new suite.
It does not report the former score, claim equivalence to the unavailable tool,
or treat a missing dependency as a passing check. Existing Pages CI checks remain.

## Experiment log

Recruiter discovery must also be reviewed through ordinary interests and role
phrasing: research, CAD, harness, machine learning, benchmarking, agents and
model serving. Inspect the first visible results, supported work omitted from
the set, and misleading capability matches. Keep an independently selected
query set alongside name regressions; result counts alone are not acceptance.
Reviewed `searchProfile` capabilities must have project-owned evidence. Its
evidence classification describes how much work a visitor can inspect, not
production maturity. Preserve limitations in public prose while excluding
negated claims, audience notes and reference-only terms from capability matches.
After query or Metrics changes, category totals must describe the results that
clicking each category displays. Recovering from a filter-caused empty result
must preserve the query and selected order.

For search changes, retain a small expected-results set covering `point cloud`,
`3D`, `IFC`, `document recognition`, `mobile inference`, `OpenCV`, `FastOCR`,
`Auto Toloka`, `app` and `R&D`. Relevant results must have supporting public
content. Verify that generic word fragments do not admit unrelated work, and
that A–Z and Recent change active search order. Recheck keyboard handoff,
clear/reset and responsive layout when the search flow changes.
Check complete project names combined with supported qualifiers (`FastOCR ONNX`,
`Auto Toloka Python`) and narrow spelling variants (`node js`, `3-D`). Submitting
the archive search must preserve the selected category, order and topic results;
the hero search starts a fresh global search.

| Date | Change | Metric | Result | Kept |
| --- | --- | --- | --- | --- |
| 2026-04-23 | AI Product Engineer repositioning plus ClawHub downloads tracker | Recruiter scan clarity and public traction visibility | Added hero, featured, resume, and downloads metrics surfaces | yes |
