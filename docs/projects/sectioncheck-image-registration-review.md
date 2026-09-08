# SectionCheck - Image Registration Review

> A CPU prototype for inspecting a proposed affine image transform, reviewing polygon annotations and verifying decision-bound exports on synthetic data.

## Summary
I built a Python CLI that makes a proposed image transform inspectable: validate the coordinate contract, render source and target regions, record an explicit decision and verify the exported annotations against the bound inputs. Version 0.2.1.dev0 includes a self-contained HTML report and a reproducible synthetic workflow. This is independent research tooling developed alongside the Neuralink contribution work, with AI assistance. Only authored synthetic data is supported; researcher usefulness, VALIS integration and external-viewer interoperability remain unconfirmed.

## Inspect the original geometry in 3D
The interactive scene verifies and loads the released synthetic PNGs and original ROI coordinates, including the excluded hole and separate polygon regions. Orbit, layer separation and wireframe expose the geometry. Added depth explains the 2D inputs; it is not anatomy. The saved warning, missing calibration and decision_required state remain visible. A 30-second 1080p film, muted preview, GIF and downloadable GLB accompany the scene.

## From a transform to an inspectable report
The CLI checks manifest and image hashes, affine geometry, coordinate frames and declared policy bounds. The report shows source, target, resampling, overlay and ROI panels. The bundled fixture uses a known translation of 40 pixels right and 24 pixels down, with independently authored landmark and polygon expectations.

## Keep review and export connected
An explicit decision binds the report, image hashes, annotations, tool source and geometry-engine versions. Export revalidates those inputs and writes separate target coordinates. Re-import verification checks geometry and the receipt. Changed inputs require a new review and decision; rejection and stale decisions block export. Local decisions do not authenticate a reviewer.

## What the release demonstrates
The published 0.2.1.dev0 verification records 90 hosted tests and a fresh installed-wheel exercise. The protocol preserves polygon parts and holes, checks independently expected coordinates, and rejects changed outputs. The animated figure uses the actual authored fixture and exact translation, not a fitted registration or tissue image.

## Prototype boundary
This release accepts one authored synthetic image pair and a bounded pixel-ROI profile. It reviews a proposed transform; it does not optimize or fit one. There is no confirmed researcher acceptance, real-data validation, clinical capability or Neuralink affiliation. VALIS and external-viewer integration remain future work.

## Project Figures

![Inspect the original geometry in 3D - interactive model](https://zack-dev-cm.github.io/docs/neural-engineering/media/sectioncheck-poster.jpg)

The published synthetic image pair with added display depth and source-linked ROI geometry.

![SectionCheck authored source polygons and their proposed 40 by 24 pixel translation into target coordinates](https://zack-dev-cm.github.io/docs/images/sectioncheck-registration-poster.png)

Actual synthetic fixture, redrawn from the released coordinates. Proposed mapping; no researcher approval implied.

## Project Link
https://zack-dev-cm.github.io/projects/sectioncheck-image-registration-review.md

## Key Features
- Affine and coordinate-frame validation
- Source, target and ROI review report
- Explicit decisions bound to input and tool versions
- Annotation export and local verification
- Known synthetic geometry and reproducible installed-wheel exercise

## Tech Stack
- Python
- NumPy
- Pillow
- Shapely
- JSON Schema
- pytest

## Links
- [Explore in 3D](https://zack-dev-cm.github.io/docs/neural-engineering/studio.html?project=sectioncheck)
- [Watch the 30-second film](https://zack-dev-cm.github.io/docs/neural-engineering/media/sectioncheck-film.mp4)
- [Download 3D model](https://zack-dev-cm.github.io/docs/neural-engineering/models/sectioncheck.glb)
- [Open synthetic report](https://zack-dev-cm.github.io/sectioncheck/)
- [Source on GitHub](https://github.com/zack-dev-cm/sectioncheck)
- [Prerelease 0.2.1.dev0](https://github.com/zack-dev-cm/sectioncheck/releases/tag/v0.2.1.dev0)
- [Coordinate and ROI workflow](https://github.com/zack-dev-cm/sectioncheck/blob/main/WORKFLOW.md)
