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

## When to use which agent

- `architect` for positioning, scope, acceptance criteria, and tradeoffs.
- `implementer` for focused source/script/test changes.
- `reviewer` for correctness, recruiter signal, public-surface risk, and missing checks.
- `evolver` for measured alternatives in copy, ranking, layout, or evidence presentation.
- `cleanup` for source/generated drift, stale docs, and follow-up hygiene.

## Parallel work

Only spawn subagents when the user explicitly asks for delegation or parallel agent work. Keep each delegated task concrete, disjoint, and tied to a checkable output.
