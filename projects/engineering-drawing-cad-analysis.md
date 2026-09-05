# Engineering Drawing & CAD Analysis

> Research workflows for CAD projection, drawing comparison and scan-to-reference evaluation, with inspectable engineering artifacts.

## Summary
I develop engineering-analysis research at Riverstart, connecting scans, CAD geometry and engineering drawings through reproducible evaluation. My work covers reference registration, CAD-to-2D projection, geometry checks and review artifacts. Each stage has its own acceptance criteria so engineers can inspect the geometry and decide what is ready for further development.

## Engineering decisions
I separate scan registration, CAD projection and drawing comparison into measurable stages. The projection research compares direct Open Cascade routes with CadQuery and build123d, checks visible and hidden geometry separately, and preserves intermediate artifacts for review. Analytic fixtures provide expected geometry that is defined independently of the candidate projection backend.

## Evaluation and current stage
The demonstrated milestone is a research baseline for registration and projection evaluation. Checks cover coordinate consistency, surface alignment, projected geometry and selected drawing views. Scan-to-parametric reconstruction requires separate evidence and acceptance; the supplied reference CAD in a registration test is not a reconstructed output.

## What the images show
The first image renders an existing analytic STEP fixture built for the evaluation workflow. The second shows the actual generated XY and XZ projections of that same solid, including hidden edges. These are reproducible test artifacts using synthetic geometry; they do not contain a customer part, a generated product interface or a claim of manufacturing accuracy.

## Project Figures

![Actual STEP rendering of a synthetic through-bore block, shown in an orthographic 3D view with millimeter axes](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-source.webp)

Analytic CAD test fixture: a through-bore block used to evaluate projection and hidden-line handling. Rendered from the source STEP.

![XY and XZ projections of the same synthetic block, with solid visible edges and dashed hidden bore edges](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-projections.webp)

Generated XY and XZ projections of the same test fixture, separating visible and hidden edges. Actual HLR output.

## Project Link
https://zack-dev-cm.github.io/projects/engineering-drawing-cad-analysis.md

## Key Features
- Evaluate scan registration against supplied CAD references
- Compare CAD-to-2D projection and hidden-line handling across geometry backends
- Check outputs against independently defined analytic fixtures
- Preserve geometry, evaluation results and review artifacts for repeatable inspection

## Tech Stack
- Python
- Open Cascade
- CadQuery
- build123d
- NumPy
- SciPy
- Geometry Processing

## Links
- [Inspect projection SVG](https://zack-dev-cm.github.io/docs/images/cad-analytic-fixture-hlr-source.svg)
