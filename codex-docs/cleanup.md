# Cleanup

Codex can create drift in a generated portfolio if cleanup is not explicit. This file defines the cadence.

## Weekly sweep

- Rebuild generated files and inspect source/generated drift.
- Re-run link checks for public project, resume, GitHub, LinkedIn, and ClawHub links.
- Refresh time-sensitive ClawHub download counts only when verified from public listings.
- Remove stale generated assets after Vite hash changes.
- Re-scan public files for secrets, local paths, local URLs, copied dashboards, and unsupported claims.
- Keep README, security policy, contribution notes, and PR template aligned with the current verification loop.

## Promote a rule when

- The same review issue appears in two or more portfolio updates.
- A stale metric or broken link survives a build.
- Source and generated artifacts drift in a way tests did not catch.
- A manual recruiter-signal review finds repeated overclaiming or unclear positioning.

## Do not do

- Large opportunistic rewrites under the label of cleanup.
- Formatting-only churn across unrelated files.
- Manual edits to generated public pages without changing the source or generation script.
