# Dishes Recognition & Nutrition Goals Telegram Bot

> Calorio Telegram bot that recognizes dishes from photos/audio, tracks nutrition goals, and exposes admin usage/cost reports.

## Summary
Calorio is a multimodal Telegram bot that understands dish photos, voice notes, and text meal descriptions, logs calories/macros, and nudges users toward daily nutrition targets. It also ships a beta Telegram Mini App for profile and diary management plus a production admin-report flow for usage, retention, support, model-cost, health, and webhook telemetry. A sanitized 2026-05-21 production report is used here only for aggregate portfolio evidence, with server identifiers and user-level support content omitted.

## Project Link
https://zack-dev-cm.github.io/projects/dishes-recognition-nutrition-goals-telegram-bot.md

## Key Features
- Vision, voice, and text meal logging in Telegram
- Nutrition goal tracking with profile and diary surfaces
- Telegram Mini App for profile, diary, analytics, and support entry points
- Admin reports for usage, retention, model-cost, health, webhook, and support signals
- Public-safe portfolio evidence that keeps production identifiers and user-level details out of crawlable pages

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
- Production admin snapshot: 76,634 events (sanitized production admin-report artifact generated 2026-05-21; aggregate counts only)
- Production food-log records: 14,732 (sanitized production DB range in 2026-05-21 admin report)
- May MTD usage: 10,585 events / 1,837 meal logs (2026-05-01 00:00 UTC to 2026-05-21 07:34 UTC production admin report)
- May MTD active reach: 302 event-active / 117 logging users (aggregate counts from 2026-05-21 production admin report; row-level identifiers omitted)
- Closed April usage: 18,923 events / 3,419 meal logs (closed April 2026 production admin report)
- May MTD AI telemetry: 12.8M tokens / $25.75 (3,101 model-cost rows with purpose/model split in 2026-05-21 admin report)
- Closed April AI telemetry: 20.3M tokens / $42.12 (5,653 token rows in closed April 2026 production admin report)
- Production health: 200 OK / 0 pending updates (health and Telegram webhook checks in 2026-05-21 admin report; endpoint omitted from public copy)
- Public route: Telegram (bot link reviewed 2026-05-15)

## Links
- [Try on Telegram](https://t.me/calorio_yf_bot)
