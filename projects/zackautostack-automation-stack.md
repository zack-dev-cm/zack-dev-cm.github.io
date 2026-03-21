# ZackAutoStack Automation Stack

> Ready-to-launch Telegram bot + Mini App + lead funnel powered by agentic workflows.

## Summary
ZackAutoStack bundles a Telegram bot, Mini App, and AI lead funnel in minutes. Unifies orchestration, reusable MCP tools, multi-tenant data, and telemetry guardrails.

## Project Link
https://zack-dev-cm.github.io/projects/zackautostack-automation-stack.md

## Key Features
- Instant Telegram bot & Mini App deployment
- Agentic workflows nurturing inbound leads
- Unified telemetry and safety guardrails
- Bundled delivery across clients, data, and operations

## Tech Stack
- GPT-5 orchestration
- MCP tools
- Multi-tenant data stores
- Telemetry guardrails

## Topology Snapshot
```
Clients Layer
  - Telegram Bot
  - Telegram Mini App
  - Landing + Console
        |
        v
Edge & Delivery Layer (CDN / Edge Functions)
        |
        v
Gateway & Policy Layer (API Gateway + Auth)
        |
        v
+-----------------------------------------+
|           Orchestration Layer           |
| Router -> Persona -> Workflow -> ToolBus|
|                   |                     |
|                   v                     |
|         MCP Tool Mesh Bridge            |
+-----------------------------------------+
        |
        v
Data & Knowledge Layer
  - Tenant DB / Secrets
  - Vector Store / Memories
  - Object & Telemetry Stores
        |
        v
Integration Layer (Connectors via MCP)
        |
        v
Operations Layer (Console, Alerts, Runbooks)
```
