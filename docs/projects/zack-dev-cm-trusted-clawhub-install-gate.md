# Trusted ClawHub Install Gate

> Legacy project URL kept for compatibility. Use the canonical project link below.

> Skill-build case study for a local-first ClawHub/OpenClaw install wrapper that inspects skill artifacts before install and writes receipts.

## Summary
Trusted ClawHub Install Gate is a local-first skill-build project for reducing blind trust in ClawHub/OpenClaw skill installation. It inspects an unpacked local skill directory, classifies the artifact as PASS, REVIEW, or BLOCK, refuses install by default unless the artifact is clean or explicitly approved for review-level risk, writes a receipt for what was inspected and installed, and later verifies installed content against that receipt. The public case study keeps the scope narrow: local directories only, no claim of complete runtime security, and workspace paths supplied explicitly.

## Bounded analysis candidate
Draft #1 bounds compile-call analysis in each scanned file. It stops after 100 matching calls or before accumulated context exceeds 300,000 characters, and conservatively reports REVIEW when the budget is exhausted. All 53 candidate tests pass. The budget change is an open draft and has not been installed or published to a registry.

## Project Link
https://zack-dev-cm.github.io/projects/trusted-clawhub-install-gate.md

## Key Features
- Classifies local skill artifacts as PASS, REVIEW, or BLOCK before installation
- Denies REVIEW installs unless the operator explicitly allows review-level risk
- Writes install receipts under a local data directory and verifies installed content against those receipts
- Keeps v0.1 scope narrow: local unpacked skill directories only, no arbitrary remote slug resolution claim

## Tech Stack
- Python
- CLI
- OpenClaw
- ClawHub
- Security Review
- Receipt Verification

## Benchmarks & Analytics
- Verdict states: 3 (PASS, REVIEW, BLOCK in project contract)
- Default unsafe install policy: deny (REVIEW and BLOCK require explicit handling or are refused in the 2026-05-07 source review)
- Verification model: receipt-aware (installed hash and approved verdict must match receipt)

## Links
- [Source on GitHub](https://github.com/zack-dev-cm/trusted-clawhub-install-gate)
- [Review analysis draft #1](https://github.com/zack-dev-cm/trusted-clawhub-install-gate/pull/1)
