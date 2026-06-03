# CollectionsAI ChatGPT App

> ChatGPT app case study with MCP tools and widgets for conservation report Q&A, portfolio planning, materials estimates, staffing, and voice-note structuring.

## Summary
CollectionsAI ChatGPT App packages a senior-conservation workflow as an MCP server plus ChatGPT widget layer. It exposes tools for report dashboards, factual Q&A, safe artifact listing, urgency rollups, capacity planning, material estimates, staffing assignments, dictated voice-note structuring, condition-report drafting, and end-to-end conservation cycles. The public case study focuses on the app architecture, widget metadata, release gates, and production posture.

## Project Link
https://zack-dev-cm.github.io/projects/collectionsai-chatgpt-app.md

## Key Features
- Maps conservation report Q&A, dashboards, artifacts, planning, intake, and report drafting into explicit MCP tools
- Provides ChatGPT widget metadata for dashboard, QA, artifact, operations, and voice-review surfaces
- Includes production controls for auth, artifact protection, CORS allowlists, request limits, cache TTLs, timeouts, and security headers
- Ships release checks for Node syntax, preflight, publish posture, App Info audit, E2E, load, alpha scenarios, and demo runs

## Tech Stack
- Node.js
- MCP
- ChatGPT Apps
- Zod
- Python
- Widget Metadata
- Release Gates

## Benchmarks & Analytics
- MCP tools: 10 (documented app tool surface)
- Load harness: 10-user (explicit concurrency test described in release checks)
- Source review date: 2026-03-04 (project source review)
