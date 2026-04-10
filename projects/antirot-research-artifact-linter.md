# AntiRot - Research Artifact Linter

> Open-source CLI that catches unsupported claims, citation drift, hype language, and draft markers in AI-written research drafts.

## Summary
AntiRot is a local-first review harness for Markdown research artifacts. It turns the final draft into a gateable surface by flagging unsupported claims, missing evidence anchors, citation mismatches, comparative hype, and leftover draft markers before a paper, proposal, or lab note ships. The first public release focuses on low-friction adoption: no API key, no network dependency, text/JSON/Markdown/SARIF outputs, and a GitHub-friendly path into CI and code scanning.

## Project Link
https://zack-dev-cm.github.io/projects/antirot-research-artifact-linter.md

## Key Features
- Catches unsupported claims, citation drift, hype language, comparative overreach, and leftover draft markers in Markdown drafts
- Runs locally with no API key and no network dependency, so it fits agent loops, proposals, and paper pipelines
- Emits text, JSON, Markdown, and SARIF outputs for terminal use, CI gates, and GitHub-native review flows
- Ships with starter config, examples, tests, and release assets for fast adoption

## Tech Stack
- Python
- CLI
- Markdown
- SARIF
- GitHub Actions
- Research Agents

## Benchmarks & Analytics
- Public release: v0.1.1 (GitHub release)
- Output formats: 4 (text, json, markdown, sarif)
- Issue families: 6 (unsupported, numeric, citation, hype, comparative, draft markers)
- Runtime deps: 0 (standard-library CLI)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/antirot)
- [Release v0.1.1](https://github.com/zack-dev-cm/antirot/releases/tag/v0.1.1)
