# Agentic CV Repro Lab Skill

> Public ClawHub skill that packages my internal CV/MLOps operating model for reproducible training, browser validation, and release gating.

## Summary
I turned an internal DS/CV train-management workflow into a public, installable ClawHub skill for teams running browser-heavy and GPU-heavy vision work. The release packages reproducible experiment records, browser notebook evidence, heartbeat-aware VM execution, and promotion bundles that separate semantic, runtime, and product-surface checks. I also hardened the public bundle for sharing: sharable manifests redact sensitive paths and env values by default, and the published skill ships under MIT-0 with clean OpenClaw and VirusTotal scans.

## Project Link
https://zack-dev-cm.github.io/projects/agentic-cv-repro-lab-skill.md

## Key Features
- Packages an internal CV/MLOps operating model into a public ClawHub artifact teams can install and reuse
- Captures reproducible experiment state with run cards, dataset manifests, and public-safe context snapshots
- Validates Colab, Kaggle, and browser-driven CV workflows with browser run cards and per-image validation scorecards
- Gates releases with promotion bundles across semantic quality, runtime health, and product-surface checks

## Tech Stack
- ClawHub
- OpenClaw Skills
- Python
- PyTorch
- Computer Vision
- Google Colab
- Kaggle
- MLOps
- Release Engineering

## Benchmarks & Analytics
- Public release: v1.6.1 (Live on ClawHub)
- Security review: 2 clean scans (OpenClaw + VirusTotal benign)
- Execution surfaces: 3 (semantic, runtime, and product-surface promotion gates)
- Workflow helpers: 10 scripts (scorecards, manifests, summaries, and promotion bundles)

## Links
- [Open on ClawHub](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab)
