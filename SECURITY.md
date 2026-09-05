# Security Policy

## Supported Surface

This repository publishes a static portfolio and generated public project pages. The security-relevant surface includes:

- Static site source and build scripts
- Generated `docs/` output
- Resume files
- Crawlable AI context files
- Project Markdown pages
- GitHub Actions deployment workflow

## Reporting a Vulnerability

Report suspected vulnerabilities, exposed secrets, unsafe public links, or privacy leaks by emailing `kaisenaiko@gmail.com`.

Please include:

- The affected URL or file path
- A concise description of the risk
- Steps to reproduce, when applicable
- Whether any sensitive data appears publicly reachable

Do not open a public issue for a sensitive disclosure.

## Public-Surface Gate

Before release, run:

```bash
npm run security:gate
npm run audit:public
```

The first command is the repository leak gate. The second runs the source/artifact audit described in `codex-docs/evals.md`; browser behavior, link access and independent source/diff review are separate checks.

`npm run security:gate` uses `pdftotext` from Poppler when available so public resume PDFs are scanned through extracted text, not only through their HTML source. Set `REQUIRE_PDF_TEXT=true` to fail closed when the tool is missing.
The public audit runs repository-owned Node checks. The former external `codex_harness` dependency is retired; see `codex-docs/evals.md` for the migration and the separate source/browser review requirements.
