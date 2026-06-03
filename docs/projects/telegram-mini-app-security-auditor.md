# Telegram Mini App Security Auditor

> Static launch gate for Telegram Mini Apps that flags initData, token, admin, CORS, PII, and Bot API dry-run risks before release.

## Summary
Telegram Mini App Security Auditor packages a deterministic static audit for TMA projects before bot tokens, BotFather settings, or public channels are connected. It scans the project root for server-side initData validation signals, token-shaped literals, admin routes without obvious guards, wildcard CORS, unsafe HTML usage, frame-header risks, contact/PII/token request-form leaks, and live Bot API actions without dry-run or review gates. The public contract is intentionally conservative: it returns PASS, REVIEW, or BLOCK, and it does not claim complete runtime security.

## Project Link
https://zack-dev-cm.github.io/projects/telegram-mini-app-security-auditor.md

## Key Features
- Audits Telegram initData validation, committed token patterns, admin route guards, CORS, frame headers, and unsafe HTML signals
- Flags PII/token collection risks in request forms before a public Telegram Mini App launch
- Returns PASS, REVIEW, or BLOCK with JSON and Markdown reports for release review
- Keeps the guarantee narrow: a static heuristic launch gate, not a complete runtime-security guarantee

## Tech Stack
- Python
- Static Analysis
- Telegram Mini Apps
- Security Review
- Markdown Reports
- Codex Skills

## Benchmarks & Analytics
- Decision states: 3 (PASS, REVIEW, BLOCK)
- Report formats: 2 (JSON + Markdown)
- Audit families: 9 (initData, tokens, admin, CORS, HTML, frames, PII, health, Bot API dry-run)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/telegram-miniapp-security-auditor)
