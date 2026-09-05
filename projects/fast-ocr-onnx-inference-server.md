# Fast OCR ONNX Inference Server

> Containerized OCR API that stages line segmentation, word segmentation, and CRNN text recognition behind a FastAPI endpoint.

## Summary
I built a containerized OCR inference service that turns line segmentation, word segmentation and CRNN recognition into a FastAPI image-upload workflow. It returns recognized text with line and word boxes as structured JSON. ONNX Runtime provides a portable CPU-serving path, with Docker packaging and explicit response contracts connecting the model pipeline to downstream applications.

## Project Link
https://zack-dev-cm.github.io/projects/fast-ocr-onnx-inference-server.md

## Key Features
- Line segmentation, word segmentation and CRNN text recognition
- Image-upload API returning recognized text and geometry
- Portable CPU inference with ONNX Runtime
- Docker packaging and explicit downstream response contracts

## Tech Stack
- Python
- FastAPI
- ONNX Runtime
- CRNN
- OCR
- Docker
- Cloud Run

## Architecture Diagram
```mermaid
flowchart LR
  Upload["Upload Image"] --> Line["Line Segmentation ONNX"]
  Line --> Word["Word Segmentation ONNX"]
  Word --> CRNN["CRNN Text Recognition"]
  CRNN --> Response["JSON Text + Boxes"]
  Response --> Review["Timing + Debug Metadata"]
```
