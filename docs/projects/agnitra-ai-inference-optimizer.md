# Agnitra - ML Profiling & Optimization

> Legacy project URL kept for compatibility. Use the canonical project link below.

> A published Python SDK and CLI for inspecting model runtime and applying inference optimizations within existing ML workflows.

## Summary
I develop Agnitra, a model profiling and inference-optimization SDK available on PyPI. It brings runtime telemetry, baseline comparisons and optimization passes into a Python and command-line workflow. The released decoder-LLM path supports hardware-aware quantization and integrations with Hugging Face, LangChain and LlamaIndex. Quality checks and fallback behavior help developers evaluate changes before adopting an optimized runtime. Performance depends on the model, hardware and workload; the package is a beta release.

## Project Link
https://zack-dev-cm.github.io/projects/agnitra-ml-profiling-optimization.md

## Key Features
- Inspect model runtime and compare baseline and optimized execution
- Apply hardware-aware quantization to supported decoder-only language models
- Integrate optimization into existing Python, Hugging Face and agent workflows
- Evaluate quality changes and retain fallback behavior for unsupported paths

## Tech Stack
- Python
- PyTorch
- Transformers
- torchao
- Hugging Face
- LangChain
- LlamaIndex
- MLOps

## Links
- [Install from PyPI](https://pypi.org/project/agnitra/)
