# Session Rescue

> Local-first Chrome extension for saving browser session snapshots, restoring tabs, and exporting/importing portable backups.

## Summary
Session Rescue is a published Chrome Web Store extension for people who want a simple local backup of browser sessions. It captures normal windows and restorable tabs, supports manual and user-enabled automatic snapshots, restores sessions into a new window or the current context, and exports/imports JSON backups without a backend, account, analytics, ads, or remote code.

## Project Link
https://zack-dev-cm.github.io/projects/session-rescue.md

## Key Features
- Captures local session snapshots with tabs, window grouping, titles, URLs, pinned state, and timestamps
- Restores saved sessions into a focused new window or the current browser context
- Exports and imports portable JSON backups so the archive is not trapped in the extension
- Ships with CWS readiness checks, real-browser E2E coverage, and sanitized store screenshots

## Tech Stack
- Chrome Extension
- JavaScript
- IndexedDB
- Playwright
- Chrome Web Store
- Local-first UX

## Benchmarks & Analytics
- Chrome Web Store version: 0.1.4 (public listing updated 2026-04-29)
- Storage model: local-only (no backend, account, analytics, ads, or remote code)
- Verification stack: unit + manifest + CWS + E2E (repo-local verification command)

## Links
- [View on Chrome Web Store](https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf)
- [View on GitHub](https://github.com/zack-dev-cm/session-rescue)
- [Product site](https://session-rescue.pages.dev/)
