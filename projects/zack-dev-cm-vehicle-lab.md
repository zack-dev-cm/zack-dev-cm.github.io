# Vehicle Lab: A Reusable Engineering Notebook

> Legacy project URL kept for compatibility. Use the canonical project link below.

> Built and released an engineering notebook connecting CAD inspection, digital prototyping, revision decisions and recorded simulation, with a reusable Python CLI and interactive 3D viewer.

## Summary
Vehicle Lab turns an experimental vehicle study into a reusable engineering notebook. A 96-second film follows real CAD-derived geometry through ideation, digital prototyping, mechanical inspection, revision comparison, and an archived Project Chrono obstacle run. Create a separate project, import grouped OBJ geometry, inspect revision decisions and original evidence, and attach recorded body states through a documented JSON contract. A small linear-stage example retains a failed fit alongside its revised clearance check. The viewer preserves failed results and source hashes; the vehicle remains unqualified for fabrication or riding.

## Engineering across the workflow
I built and released the notebook software around a vehicle design study: a Python project CLI, a portable manifest schema, a Three.js inspection interface, revision records and recorded-motion adapters. The workflow connects design assumptions, geometry, numerical checks and the reasoning behind each revision. The same software supports independent desk-rover and linear-stage examples.

## From CAD to digital prototypes
Four CAD-derived studies cover packaging, the RC25 digital prototype, detailed mechanical inspection and a body/ergonomics study. The viewer preserves component identities and supports subsystem isolation, wireframe and exploded inspection. Grouped OBJ import lets another project map its own geometry to inspection subsystems. The exploded view explains component relationships; it does not establish a feasible physical assembly sequence.

## Keep the failed result with the revision
A project record links parent revisions, decisions, check results and original artifact downloads. In the linear-stage example, an initial clearance failure stays visible beside the revised geometry and its clearance check. Source and asset checksums make each recorded result traceable. The revision graph is an authored engineering record; no automatic evolutionary optimization run is claimed.

## Recorded simulation, with its scope intact
The film includes a 12-second historical Project Chrono run of a separate simplified vehicle model, replayed at its recorded speed. Its rear axle failed to clear the obstacle, and that result remains visible. An engine-neutral JSON interface specifies body identities, metre units, quaternion ordering, poses and metrics for other recorded runs. Prescribed-motion examples are labelled separately. The browser replays saved states; it does not solve new dynamics.

## Released software and the next experiment
Version 0.1.0 includes the source, runnable examples, documentation, a captioned 1080p film and reproducible capture tooling. Original release material is MIT-licensed. Physical printing, assembly, load testing and driving remain open: RC25 has not been printed or driven, mechanical fit findings are unresolved, and the vehicle studies are unqualified for fabrication or riding.

## Project Figures

![RC25 digital prototype with body panels separated above its chassis, wheels and suspension](https://zack-dev-cm.github.io/docs/images/vehicle-lab-assembly-hero.webp)

Frame at 01:22 from the released film, cropped to the CAD viewport. Exploded inspection of a digital prototype; physical assembly remains unverified.

![Mechanical inspection of the vehicle frame, suspension, wheels, and chain drive](https://zack-dev-cm.github.io/docs/images/vehicle-lab-inspection.jpg)

CAD-derived mechanical study. Component detail does not close the remaining fit findings.

![Packaging, digital prototype and body studies displayed together in the revision view](https://zack-dev-cm.github.io/docs/images/vehicle-lab-revisions.webp)

Frame at 00:54 from the film. Authored design revisions with separate scopes.

![Saved Project Chrono obstacle simulation shown in Vehicle Lab with its failed result and telemetry](https://zack-dev-cm.github.io/docs/images/vehicle-lab-physics.webp)

Frame at 01:08 from the film. A separate historical model; the rear axle did not clear the obstacle.

## Project Link
https://zack-dev-cm.github.io/projects/vehicle-lab-a-reusable-engineering-notebook.md

## Key Features
- Reusable project CLI, manifest schema, and original desk-rover starter
- 3D orbit, subsystem isolation, wireframe, and exploded inspection
- Revision graph and scoped evidence with source and asset checksums
- Engine-neutral replay interface with an explicit recorded-pose contract
- Eleven documentation pages and a captioned 1080p pipeline film

## Tech Stack
- Python
- Three.js
- FreeCAD exports
- Project Chrono data
- Playwright
- FFmpeg

## Benchmarks & Analytics
- Film: 96 seconds (1920 x 1080, 24 fps; actual browser capture)
- Vehicle studies: 4 (CAD-derived display snapshots with separate engineering scopes)
- Physical validation: Open (Digital examples; no qualified hardware release)

## Links
- [Watch the 96-second film](https://zack-dev-cm.github.io/docs/vehicle-lab/watch.html)
- [Source on GitHub](https://github.com/zack-dev-cm/vehicle-lab)
- [Explore Vehicle Lab](https://zack-dev-cm.github.io/docs/vehicle-lab/)
- [Read the documentation](https://zack-dev-cm.github.io/docs/vehicle-lab/docs/)
- [Release v0.1.0](https://github.com/zack-dev-cm/vehicle-lab/releases/tag/v0.1.0)
- [Download source v0.1.0](https://zack-dev-cm.github.io/docs/vehicle-lab/downloads/vehicle-lab-0.1.0.tar.gz)
