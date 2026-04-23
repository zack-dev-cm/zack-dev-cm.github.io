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
npm run audit:codex
```

The first command is the repo-local leak gate. The second command is the stricter open-source surface audit used during Codex review.

`npm run security:gate` uses `pdftotext` from Poppler when available so public resume PDFs are scanned through extracted text, not only through their HTML source. Set `REQUIRE_PDF_TEXT=true` to fail closed when the tool is missing.
If `npm run audit:codex` cannot find `codex_harness`, install it with `python3 -m pip install "git+https://github.com/zack-dev-cm/antirot.git"`.
