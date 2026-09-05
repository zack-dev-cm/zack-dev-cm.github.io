# Multimodal Video Search Platform

> Video search case study combining keyframes, ASR/OCR, object and face signals, visual embeddings, transcript embeddings, and hybrid retrieval.

## Summary
I designed retrieval across video and rich media using complementary visual and language signals. The R&D pipeline normalizes uploads, extracts keyframes, transcribes speech, reads on-screen text and computes visual and text embeddings. Dense and sparse indexes feed hybrid ranking, while regression comparisons help evaluate signal coverage and failure recovery.

## Project Figures

![Workflow diagram of parallel video, speech and OCR signals feeding visual and text indexes, hybrid ranking and timestamped matches](https://zack-dev-cm.github.io/docs/images/video-search-verified-workflow.png)

Workflow diagram of parallel extraction, indexing and hybrid retrieval.

## Project Link
https://zack-dev-cm.github.io/projects/multimodal-video-search-platform.md

## Key Features
- Keyframes, speech transcripts, OCR and scene information
- Visual and text embeddings for complementary retrieval signals
- Dense and sparse search with hybrid ranking
- Regression comparisons for retrieval coverage and recovery

## Tech Stack
- Python
- FastAPI
- Qdrant
- Postgres
- Visual Embeddings
- OCR
- ASR
- Hybrid Search
- Celery

## Architecture Diagram
```mermaid
flowchart LR
  Video["Video"] --> Frames["Keyframes + visual embeddings"]
  Video --> ASR["Speech transcripts"]
  Frames --> OCR["On-screen text"]
  Frames --> VisualIndex["Visual index"]
  ASR --> TextIndex["Dense + sparse text index"]
  OCR --> TextIndex
  Query["Query"] --> Retrieve["Retrieve + fuse matches"]
  VisualIndex --> Retrieve
  TextIndex --> Retrieve
  Retrieve --> Results["Timestamped matches"]
```
