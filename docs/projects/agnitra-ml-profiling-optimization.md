# Agnitra - ML Profiling & Optimization

> A published Python SDK and CLI for inspecting model runtime and applying inference optimizations within existing ML workflows.

## Summary
I develop Agnitra, a Python SDK and CLI available on PyPI. Its profiling path records model-layer shapes and runtime operator events. A separate decoder-LLM optimization path selects hardware-aware quantization strategies and provides integration helpers for Hugging Face, LangChain and LlamaIndex. The beta release gives developers tools to investigate inference behavior; optimization results require workload-specific performance and output-quality evaluation.

## Follow the model in 3D
The interactive model and 30-second film follow the recorded CPU fixture through convolution, ReLU, pooling, flattening and linear projection. Orbit the geometry, separate channel planes or inspect the wireframe, then download the self-contained GLB model. Channel counts and tensor dimensions come from the saved report; depth, color and animation timing explain the structure without representing activation values or a measured speedup.

## Why this tool
Understanding a model's execution is a useful starting point for optimization. Agnitra exposes profiling through Python and the CLI, alongside a separate optimization API for supported decoder language models. The published example makes the profiling output directly inspectable.

## Inspect a real profiling run
The example below runs the released 0.2.4 profiling code on a small, randomly initialized PyTorch network. Agnitra records each layer's type, input and output shapes, dtype and operator events. The downloadable script recreates the fixture and writes the report. The recorded example uses CPU, Python 3.10.2 and PyTorch 2.9.1; it demonstrates the profiling path independently of the decoder-LLM optimization path.

## Released scope
The beta package is available on PyPI. Profiling and decoder-LLM optimization are separate execution paths. Automatic quality checks do not cover every optimization path, so developers need to measure output quality and runtime on their own workloads. The example here demonstrates profiling only.

## Project Figures

![Actual layer types and input/output tensor shapes recorded by Agnitra 0.2.4 for a small CPU profiling fixture](https://zack-dev-cm.github.io/docs/images/agnitra-recorded-shapes.png)

Recorded output from Agnitra 0.2.4 on a randomly initialized CPU fixture. This demonstrates profiling; no optimization or accuracy comparison is shown.

![Agnitra recorded input and output tensor shapes shown as channel planes](https://zack-dev-cm.github.io/docs/engineering-studies/media/agnitra-poster.jpg)

Redrawn from the recorded Agnitra 0.2.4 CPU fixture. Plane grids illustrate dimensions; they are not activation values.

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
- [Explore in 3D](https://zack-dev-cm.github.io/docs/engineering-studies/studio.html?project=agnitra)
- [Watch the 30-second film](https://zack-dev-cm.github.io/docs/engineering-studies/media/agnitra-film.mp4)
- [Download 3D model](https://zack-dev-cm.github.io/docs/engineering-studies/models/agnitra.glb)
- [3D source and GIF on GitHub](https://github.com/zack-dev-cm/zack-dev-cm.github.io/tree/main/public/engineering-studies#agnitra)
- [Install from PyPI](https://pypi.org/project/agnitra/)
- [Reproduce the CPU profiling example](https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/reproduce.py)
- [Inspect the recorded model shapes (JSON)](https://zack-dev-cm.github.io/docs/artifacts/agnitra-cpu-profile/shape-report.json)
