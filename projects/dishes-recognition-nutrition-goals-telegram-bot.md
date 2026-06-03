# Dishes Recognition & Nutrition Goals Telegram Bot

> Calorio Telegram bot that recognizes dishes from photos/audio, tracks nutrition goals, and exposes admin usage/cost reports.

## Summary
Calorio is a multimodal Telegram bot that understands dish photos, voice notes, and text meal descriptions, logs calories/macros, and nudges users toward daily nutrition targets. It also ships a beta Telegram Mini App for profile and diary management plus a production admin-report flow for usage, retention, support, model-cost, health, and webhook telemetry. A sanitized 2026-05-21 production report is used here only for aggregate portfolio metrics, with server identifiers and user-level support content omitted.

## Project Link
https://zack-dev-cm.github.io/projects/dishes-recognition-nutrition-goals-telegram-bot.md

## Key Features
- Vision, voice, and text meal logging in Telegram
- Nutrition goal tracking with profile and diary surfaces
- Telegram Mini App for profile, diary, analytics, and support entry points
- Admin reports for usage, retention, model-cost, health, webhook, and support signals
- Public-safe portfolio metrics that keep production identifiers and user-level details out of crawlable pages

## Tech Stack
- Telegram Bot API
- FastAPI
- OpenAI APIs
- Vision LLMs
- Speech-to-Text
- SQLite
- Telegram Mini Apps
- Admin Analytics

## Benchmarks & Analytics
- Input modes: 3 (photo, voice, and text flows in public product case study)
- Nutrition surfaces: 2 (2 public product surfaces: Telegram bot plus beta Mini App diary/profile flow)
- Admin report snapshot: 2026-06-03 12:00 UTC (latest aggregate Calorio admin report used for public metrics; user-level identifiers omitted)
- Telegram audience: 1,713 users (Calorio admin report 2026-06-03T12:00:00Z; aggregate count only)
- Active audience: 28 daily / 109 weekly / 375 monthly active users (Calorio admin report 2026-06-03T12:00:00Z)
- Rolling 24h logs: 77 logs / 21 loggers (rolling 24h diary metrics from the 2026-06-03 admin report)
- New users 24h: 13 (+8 versus the prior 24h window in the 2026-06-03 admin report)
- Mini App 24h: 8 users / 67 events (28.6% of daily active users; http/auth/exception errors all 0 in the 2026-06-03 admin report)
- OpenAI 24h telemetry: 555,392 tokens / $1.14 (aggregate model-cost telemetry from the 2026-06-03 admin report)
- Feedback sample: 4.94 avg / 16 ratings (30d satisfaction sample from the 2026-06-03 admin report; user text omitted)
- Production health: 0 critical signals / 0 Mini App errors (critical-signal and mini-app error summary from the 2026-06-03 admin report)
- Public route: Telegram (bot link reviewed 2026-05-15)

## Links
- [Try on Telegram](https://t.me/calorio_yf_bot)
