# GeoFix - AI Visibility Memorizer Mini App

> Telegram mini app that scans a website for AI visibility and generates llms.txt, llms-full.txt, and JSON-LD for bot delivery.

## Summary
GeoFix runs AI visibility scans, surfaces a scorecard with GEO diagnostics, and generates Server-Side Memorizer assets (llms.txt, llms-full.txt, schema.jsonld). The unified Cloud Run service ships a React web app, FastAPI API, and Celery worker with Redis-backed jobs, plus Telegram bot delivery and hosted previews.

## Project Link
https://zack-dev-cm.github.io/projects/geofix-ai-visibility-memorizer-mini-app.md

## Key Features
- AI visibility scorecard with GEO diagnostics
- Memorizer generation for llms.txt, llms-full.txt, and schema.jsonld
- Telegram bot delivery with hosted previews
- Unified Cloud Run deployment for web, API, and worker services

## Tech Stack
- React
- TypeScript
- Vite
- Python
- FastAPI
- Celery
- Redis
- OpenAI API
- Telegram Web Apps
- Cloud Run
- GCS

## Links
- [Open Telegram Mini App](https://t.me/geofix_app_bot/launch)
- [Live App](https://geofix-app-zlvmfsrm6a-ue.a.run.app/)

## Architecture Diagram
```mermaid
flowchart TB
  subgraph GCP
    FE[Cloud Run: web]
    API[Cloud Run: api]
    WORKER[Cloud Run: worker]
    REDIS[(Redis)]
    GCS[(GCS bucket)]
    LOGS[Cloud Logging]
  end
  FE --> API
  API --> REDIS
  REDIS --> WORKER
  WORKER --> GCS
  API --> GCS
  API --> LOGS
  WORKER --> LOGS
  API --> TGAPI[Telegram Bot API]
  WORKER --> OPENAI[OpenAI API]
  WORKER --> SITE[Target Website]
  API --> MEDA[ Medaudit GEO API ]
```
