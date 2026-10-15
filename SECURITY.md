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

The first command checks secrets, withdrawn content and publication boundaries. The second checks source, generated metadata and deployment regressions. Browser behavior, link access and source/diff review remain separate checks.

`npm run security:gate` uses `pdftotext` from Poppler when available so public resume PDFs are scanned through extracted text, not only through their HTML source. Set `REQUIRE_PDF_TEXT=true` to fail closed when the tool is missing.
Private review notes, incident records, raw generation prompts and token-usage records belong outside this public repository. Build and staging checks reject private review directories; the security gate also checks public JSON for private generation fields. A clean current publication does not remove older versions from Git history or external caches.
