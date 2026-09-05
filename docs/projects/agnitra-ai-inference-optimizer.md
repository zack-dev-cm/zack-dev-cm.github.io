# Agnitra - ML Profiling & Optimization

> Legacy project URL kept for compatibility. Use the canonical project link below.

> A published Python SDK and CLI for inspecting model runtime and applying inference optimizations within existing ML workflows.

## Summary
I develop Agnitra, a Python SDK and CLI available on PyPI. Its profiling path records model-layer shapes and runtime operator events. A separate decoder-LLM optimization path selects hardware-aware quantization strategies and provides integration helpers for Hugging Face, LangChain and LlamaIndex. The beta release gives developers tools to investigate inference behavior; optimization results require workload-specific performance and output-quality evaluation.

## Why this tool
Understanding a model's execution is a useful starting point for optimization. Agnitra exposes profiling through Python and the CLI, alongside a separate optimization API for supported decoder language models. The published example makes the profiling output directly inspectable.

## Inspect a real profiling run
The example below runs the released 0.2.4 profiling code on a small, randomly initialized PyTorch network. Agnitra records each layer's type, input and output shapes, dtype and operator events. The downloadable script recreates the fixture and writes the report. The recorded example uses CPU, Python 3.10.2 and PyTorch 2.9.1; it demonstrates the profiling path independently of the decoder-LLM optimization path.

## Released scope
The beta package is available on PyPI. Profiling and decoder-LLM optimization are separate execution paths. Automatic quality checks do not cover every optimization path, so developers need to measure output quality and runtime on their own workloads. The example here demonstrates profiling only.

## Project Figures

![Actual layer types and input/output tensor shapes recorded by Agnitra 0.2.4 for a small CPU profiling fixture](https://zack-dev-cm.github.io/docs/images/agnitra-recorded-shapes.png)

Recorded output from Agnitra 0.2.4 on a randomly initialized CPU fixture. This demonstrates profiling; no optimization or accuracy comparison is shown.

## Project Link
https://zack-dev-cm.github.io/projects/agnitra-ml-profiling-optimization.md

## Key Features
- Inspect model layers, tensor shapes and runtime operator events
- Apply hardware-aware quantization to supported decoder-only language models
- Integrate optimization into existing Python, Hugging Face and agent workflows
- Use a separate decoder-LLM optimization path with workload-specific validation

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
- [Reproduce the CPU profiling example](https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/reproduce.py)
- [Inspect the recorded model shapes (JSON)](https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/shape-report.json)
