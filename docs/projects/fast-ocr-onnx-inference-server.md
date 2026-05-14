# Fast OCR ONNX Inference Server

> Containerized OCR API that stages line segmentation, word segmentation, and CRNN text recognition behind a FastAPI endpoint.

## Summary
Fast OCR ONNX Inference Server is a public-safe computer vision case study for turning OCR models into a deployable inference service. The pipeline accepts an uploaded image, runs line segmentation, word segmentation, and CRNN recognition, then returns recognized text with line and word boxes as JSON. The public entry focuses on architecture, serving contracts, CPU ONNX runtime, Docker packaging, and response shape.

## Project Link
https://zack-dev-cm.github.io/projects/fast-ocr-onnx-inference-server.md

## Key Features
- Stages OCR as line segmentation, word segmentation, and CRNN text recognition
- Serves inference through a FastAPI upload endpoint with JSON boxes and recognized text
- Packages the model stack for Docker-based CPU deployment
- Documents deployment shape and response contracts with sanitized architecture evidence

## Tech Stack
- Python
- FastAPI
- ONNX Runtime
- CRNN
- OCR
- Docker
- Cloud Run

## Benchmarks & Analytics
- OCR stages: 3 (line segmentation, word segmentation, CRNN recognition)
- Model artifacts: 3 (line, word, and text-recognition ONNX models)
- API endpoints: 2 (health check and image inference contract)
- Serving target: CPU ONNX (containerized FastAPI inference path)

## Architecture Diagram
```mermaid
flowchart LR
  Upload["Upload Image"] --> Line["Line Segmentation ONNX"]
  Line --> Word["Word Segmentation ONNX"]
  Word --> CRNN["CRNN Text Recognition"]
  CRNN --> Response["JSON Text + Boxes"]
  Response --> Review["Timing + Debug Metadata"]
```
