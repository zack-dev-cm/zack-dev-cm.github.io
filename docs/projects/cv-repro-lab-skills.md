# CV Repro Lab Skills

> Research and evaluation harness for reproducible CV experiments, benchmark campaigns, and reviewable promotion decisions.

## Summary
I turned a reproducible CV experimentation workflow into two public, installable ClawHub skills for teams running browser-heavy and GPU-heavy vision work. The releases package experiment records, browser notebook run records, heartbeat-aware VM execution, review dashboards, and promotion bundles that separate semantic, runtime, and product-surface checks. The improvement-harness initializer writes a JSON contract for benchmark data and metrics, resource budgets, rerun policy, agent roles, and required evidence. It prepares the experiment record; execution and result review use separate workflows.

## Project Figures

![CV Repro Lab ClawHub release preview](https://zack-dev-cm.github.io/docs/images/agentic-cv-repro-lab-skill.png)

## Project Link
https://zack-dev-cm.github.io/projects/cv-repro-lab-skills.md

## Key Features
- Packages benchmark-gated CV experimentation into two public ClawHub skills teams can install and reuse
- Captures reproducible experiment state with run cards, dataset manifests, review dashboards, and redacted public context snapshots
- Validates Colab, Kaggle, and browser-driven CV workflows with browser run cards and per-image validation scorecards
- Adds campaign planning and claim review with contamination checks, rerun policy, and benchmark metrics

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
- ClawHub downloads: 1,439 total (public ClawHub listings, 2026-06-04 (783 data-science-cv-repro-lab + 656 sota-agent))
- Published versions: 24 total (public ClawHub listings, 2026-06-04 (12 + 12 packages))
- Live packages: 2 (data-science-cv-repro-lab + sota-agent)
- Execution surfaces: 3 (semantic, runtime, and product-surface promotion gates)
- Structured helpers: 29 scripts (manifests, scorecards, summaries, and claim-review tools)

## Links
- [Inspect the improvement-harness initializer](https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill/blob/d9345fa95479e90d39f6fa1d2ea0a47bf40d0d66/skill/data-science-cv-repro-lab/scripts/init_cv_improvement_harness.py)
- [Read the harness architecture](https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill/blob/d9345fa95479e90d39f6fa1d2ea0a47bf40d0d66/docs/codex/architecture.md)
- [View on GitHub](https://github.com/zack-dev-cm/agentic-cv-repro-lab-skill)
- [Open CV Repro Lab on ClawHub](https://clawhub.ai/zack-dev-cm/data-science-cv-repro-lab)
- [Open SOTA Agent on ClawHub](https://clawhub.ai/zack-dev-cm/sota-agent)
