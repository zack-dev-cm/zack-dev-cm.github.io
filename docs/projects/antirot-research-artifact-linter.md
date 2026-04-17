# AntiRot - Research Artifact Linter

> Open-source CLI that catches unsupported claims, broken citations, weak evidence anchors, and draft markers in AI-written research drafts.

## Summary
AntiRot is a local-first review harness for Markdown research artifacts. It turns the final draft into a gateable surface by flagging unsupported claims, missing evidence anchors, citation mismatches, comparative hype, absolute overclaim language, and leftover draft markers before a paper, proposal, or lab note ships. The current public release adds paragraph-aware parsing, in-document references support, safer citation verification, and GitHub Actions coverage for text, JSON, Markdown, and SARIF outputs.

## Project Link
https://zack-dev-cm.github.io/projects/antirot-research-artifact-linter.md

## Key Features
- Catches unsupported claims, citation drift, hype language, comparative overreach, absolute claims, and leftover draft markers in Markdown drafts
- Supports paragraph-aware evidence carry, footnotes, inline links, DOIs, arXiv ids, and in-document references sections
- Runs locally with no API key and no network dependency, so it fits agent loops, proposals, and paper pipelines
- Emits text, JSON, Markdown, and SARIF outputs for terminal use, CI gates, and GitHub-native review flows

## Tech Stack
- Python
- CLI
- Markdown
- SARIF
- GitHub Actions
- Research Agents

## Benchmarks & Analytics
- Public release: v0.2.0 (GitHub release)
- Output formats: 4 (text, json, markdown, sarif)
- Issue families: 8 (unsupported, numeric, citation-not-found, citation-unverified, hype, comparative, absolute, draft markers)
- Runtime deps: 0 (standard-library CLI)

## Links
- [View on GitHub](https://github.com/zack-dev-cm/antirot)
- [Release v0.2.0](https://github.com/zack-dev-cm/antirot/releases/tag/v0.2.0)
