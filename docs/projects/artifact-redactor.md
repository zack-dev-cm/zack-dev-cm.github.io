# Artifact Redactor

> Public skill for redacting sensitive paths, secret-like strings, restricted URLs, and common PII from text artifacts before sharing them.

## Summary
Artifact Redactor is a small public OpenClaw skill and local-first Python toolkit for making shareable artifact bundles safer. It scans supported text files for obvious leak patterns, writes a redacted copy into a clean output directory, re-checks the processed text output, and renders a markdown report that explains what was found, what was rewritten, and which files still need manual review. The public contract is intentionally narrow in v1.0.5: text artifacts are handled automatically, while skipped binary files stay manual-review-required instead of being silently treated as cleared. The command-line entrypoints now fail fast on missing inputs instead of returning a false-clear result from an empty or mistyped path.

## Project Link
https://zack-dev-cm.github.io/projects/artifact-redactor.md

## Key Features
- Scans Markdown, JSON, logs, YAML, CSV, and similar text artifacts for sensitive paths, restricted URLs, secret-like strings, email addresses, and phone numbers
- Writes a redacted copy into a separate output directory so the raw bundle stays untouched
- Strips query strings from public URLs while redacting localhost, private hosts, and credentialed URLs
- Flags binary or unsupported files for manual review instead of pretending they were auto-sanitized
- Renders a concise markdown report for bug reports, vendor handoffs, release reviews, and public issues

## Tech Stack
- ClawHub
- Python
- Privacy
- Redaction
- OpenClaw Skills
- Release Engineering

## Benchmarks & Analytics
- ClawHub downloads: 340 (public ClawHub listing, 2026-05-22)
- Published versions: 8 (public ClawHub listing, 2026-05-22)
- Public release: v1.0.5 (GitHub + ClawHub)
- Bundled scripts: 4 (scan, redact, check, report)
- Pattern families: 6 (restricted URL, path, secret, email, phone, public-url query cleanup)
- Binary policy: manual review (unsupported files are flagged, not silently copied)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/artifact-redactor)
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/artifact-redactor)
- [Release v1.0.5](https://github.com/zack-dev-cm/artifact-redactor/releases/tag/v1.0.5)
