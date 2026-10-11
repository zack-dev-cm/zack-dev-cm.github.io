# Tool-Calls Demo - Material Chat Playground

> Chat and voice tool-calling prototype with streaming arguments and a serverless session proxy.

## Summary
Material-themed playground for streaming function arguments, tool execution and voice output. Draft #43 fixes cancellation, reconnect and retry cleanup. Fourteen lifecycle tests and six Worker tests pass; browser source fixtures use simulated media and Realtime transport. The actual authenticated voice and tool flow, current Realtime contract and dependency remediation remain pending.

## Connection recovery in review
A cancelled connection cannot complete later, retries clean up the previous attempt, and late events cannot attach to a new session. The published draft contains the tests and observed failure cases. Passing lifecycle and Worker checks does not establish a working live Realtime session.

## Project Figures

![Tool calling playground](https://zack-dev-cm.github.io/docs/images/tool_calls.png)

## Project Link
https://zack-dev-cm.github.io/projects/tool-calls-demo-material-chat-playground.md

## Key Features
- Streaming tool-call prototype
- Voice output prototype
- Serverless session proxy

## Tech Stack
- OpenAI API
- Serverless
- JavaScript
- Text-to-Speech

## Links
- [Source on GitHub](https://github.com/zack-dev-cm/tool_calls)
- [Review connection draft #43](https://github.com/zack-dev-cm/tool_calls/pull/43)
