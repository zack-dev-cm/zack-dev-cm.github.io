# Noel - Noetic Mirror

> Telegram mini app streaming a live researcher/subject AI loop with Stars sponsorships.

## Summary
Noetic Mirror is a Telegram mini app that streams a live research loop between an OpenAI researcher model and a Gemini subject model. Users watch public sessions, sponsor interventions with Telegram Stars, and switch EN/RU UI or light/dark themes while safety controls and budgets guard the session.

## Project Link
https://zack-dev-cm.github.io/projects/noel-noetic-mirror.md

## Key Features
- Live researcher/subject stream with turn pairing and diagnostics
- Telegram Stars sponsorships and paid interventions
- EN/RU localization with light/dark theme toggle
- Safety controls, consent gate, and session budgets
- Admin controls for model versions and stream settings

## Tech Stack
- React
- TypeScript
- Telegram Web Apps
- Vite
- Node.js
- Express
- WebSocket
- Postgres
- Redis
- Cloud Run
- OpenAI API
- Gemini API

## Links
- [Open Telegram Mini App](https://t.me/noetic_mirror_bot/app)
- [Live App](https://noetic-mirror-web-zlvmfsrm6a-ue.a.run.app/)

## Architecture Diagram
```mermaid
flowchart LR
  User[Telegram User] --> TMA[Noetic Mirror Mini App]
  TMA -->|initData| API[Web/API Service]
  TMA -->|live stream| WS[WebSocket Stream]
  API --> Store[(Postgres + Redis)]
  API --> Stars[Telegram Stars]
  WS --> Worker[Research Loop Worker]
  Worker --> OpenAI[Researcher Model (OpenAI)]
  Worker --> Gemini[Subject Model (Gemini)]
  Worker --> Store
  API --> Channel[@noel_mirror]
```
