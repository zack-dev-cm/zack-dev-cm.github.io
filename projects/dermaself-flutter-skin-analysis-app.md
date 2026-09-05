# Dermaself Flutter Skin Analysis App

> Skin-analysis computer vision for Dermaself, connecting guided mobile capture with pore and wrinkle segmentation and usable results.

## Summary
I developed Dermaself's cosmetic skin-analysis computer vision, spanning guided capture, facial regions, pore and wrinkle segmentation, model evaluation and mobile/API integration. The work joined PyTorch and OpenMMLab model development with ONNX and Flutter delivery. I resolved model-asset and runtime differences across cloud and GPU deployments, restoring matching segmentation outputs in regression comparisons. Capture quality, runtime behavior and reproducible evaluation guided candidate release decisions.

## Project Figures

![Workflow diagram of guided capture, facial regions, selected model runtime and structured results, with separate model-release evaluation](https://zack-dev-cm.github.io/docs/images/dermaself-verified-workflow.png)

Workflow diagram. Image analysis and model-release evaluation are separate.

## Project Link
https://zack-dev-cm.github.io/projects/dermaself-flutter-skin-analysis-app.md

## Key Features
- Guided capture and facial-region processing for consistent model input
- Pore and wrinkle segmentation with reproducible model evaluation
- Mobile and API integration across Flutter, ONNX and cloud services
- Matching regression outputs across cloud and GPU runtimes

## Tech Stack
- Flutter
- Dart
- Firebase
- Riverpod
- GoRouter
- ONNX
- Mobile CV
- iOS
- Android

## Architecture Diagram
```mermaid
flowchart LR
  Capture["Guided capture + input checks"] --> ROI["Facial regions + preprocessing"]
  ROI --> Runtime["Selected mobile candidate or server runtime"]
  Runtime --> Results["Masks + region measurements"]
  Runtime -.-> Evaluation["Separate model and runtime evaluation"]
  Evaluation --> Release["Candidate release decision"]
```
