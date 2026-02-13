# Pores & Wrinkles Detection Service

> Face texture analysis service that detects pores and wrinkles and returns labeled overlays and metrics.

## Summary
High-resolution facial analysis pipeline: MediaPipe landmarks to ROI crops/masks, classic pore and wrinkle detectors with an optional YOLO segmentation gate, and an async job API (progress + results). Ships as a FastAPI Cloud Run service with an MLflow console plus a Flutter demo client and Telegram Mini App UI.

## Project Link
https://zack-dev-cm.github.io/projects/pores-wrinkles-detection-service.md

## Key Features
- MediaPipe landmark-based ROI extraction
- Classic pore + wrinkle detectors with optional segmentation gate
- Async job API with progress + results endpoints
- Flutter demo client and Telegram Mini App UI

## Tech Stack
- Python
- FastAPI
- MediaPipe
- YOLO
- ONNX
- Cloud Run
- Flutter
- MLflow
