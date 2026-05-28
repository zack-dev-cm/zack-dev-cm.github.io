# Workflow

This repo uses a small public-surface loop for portfolio work.

## Default loop

1. Clarify: restate the goal, assumptions, and verification.
2. Inspect: read the smallest source files and generated artifacts needed for the task.
3. Implement: update source data, UI, scripts, resume, or tests.
4. Generate: run the existing scripts through `npm run build` when generated files need refresh.
5. Review: check for unsupported claims, stale links, leak risk, and recruiter scan quality.
6. Verify: run the documented checks.
7. Report: summarize changed surfaces and residual risks.

## GitHub Project Feed Loop

1. Refresh: run `npm run sync:github -- --write` to rebuild `public/portfolio-updates.json` and `docs/portfolio-updates.json` from public GitHub metadata.
2. Review gates: require PASS review metadata on every synced update and project; the sync gate blocks unsafe URLs, secret-shaped text, local paths, private URLs, and instruction-bleed phrases.
3. Verify freshness: run `npm run sync:github:verify` before publishing so the generated feed is not stale against the current GitHub API snapshot.
4. Review/debug: run `npm run review:clawpatch -- ci --since HEAD --limit 20 --jobs 3 --reasoning-effort high` for sync, generated-artifact, or public-surface changes that need AI review. Keep `.clawpatch/` state out of the public surface.
5. Publish only after the default validation, security, link, audit, and E2E checks pass.

## When to use which agent

- `architect` for positioning, scope, acceptance criteria, and tradeoffs.
- `implementer` for focused source/script/test changes.
- `reviewer` for correctness, recruiter signal, public-surface risk, and missing checks.
- `evolver` for measured alternatives in copy, ranking, layout, or evidence presentation.
- `cleanup` for source/generated drift, stale docs, and follow-up hygiene.

## Parallel work

Only spawn subagents when the user explicitly asks for delegation or parallel agent work. Keep each delegated task concrete, disjoint, and tied to a checkable output.
