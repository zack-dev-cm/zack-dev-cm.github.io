# Vehicle Lab: A Reusable Engineering Notebook

> Legacy project URL kept for compatibility. Use the canonical project link below.

> Built and released an engineering notebook connecting CAD inspection, digital prototyping, revision decisions and recorded simulation, with a reusable Python CLI and interactive 3D viewer.

## Summary
Vehicle Lab turns an experimental vehicle study into a reusable engineering notebook. Open the 3D explorer in your browser: drag to orbit Ridge R3d, select individual parts, isolate and separate systems, and navigate the complete revision tree. A 37.5-second film opens on Ridge R3d, zooms through the complete 65-revision tree, inspects components and separates systems to an original electronic score. Explore native wheel obstacle courses and saved Chrono log, pit and steering/braking studies with camera controls, telemetry and recorded parameters. Create a separate project, import grouped OBJ geometry, inspect revision decisions and original evidence, and attach recorded body states through a documented JSON contract. A small linear-stage example retains a failed fit alongside its revised clearance check. The viewer preserves failed results and source hashes; the vehicle remains unqualified for fabrication or riding.

## Engineering across the workflow
I built and released the notebook software around a vehicle design study: a Python project CLI, a portable manifest schema, a Three.js inspection interface, revision records and recorded-motion adapters. The workflow connects design assumptions, geometry, numerical checks and the reasoning behind each revision. The same software supports independent desk-rover and linear-stage examples.

## From CAD to digital prototypes
The original notebook studies cover packaging, the RC25 digital prototype, mechanical inspection and a body study. The cinematic viewer adds close Ridge R3d component inspection, the complete recorded revision tree and a separate 73-part Baby AG23 study. The viewer preserves component identities and supports subsystem isolation, wireframe and exploded inspection. Grouped OBJ import lets another project map its own geometry to inspection subsystems. The exploded view explains component relationships; it does not establish a feasible physical assembly sequence.

## Keep the failed result with the revision
A project record links parent revisions, decisions, check results and original artifact downloads. In the linear-stage example, an initial clearance failure stays visible beside the revised geometry and its clearance check. Source and asset checksums make each recorded result traceable. The revision graph is an authored engineering record; no automatic evolutionary optimization run is claimed.

## Recorded simulation, with its scope intact
The motion viewer contains three complete 12-second Chrono log, pit and steering/braking records from a separate simplified model. The log and pit traversals failed, and those outcomes remain visible. Chase, side, wheel, driver and landscape cameras accompany contact forces, suspension traces and downloadable parameters. Native wheel support courses use prescribed geometry; the forest scenery supplies visual context. An engine-neutral JSON interface specifies body identities, metre units, quaternion ordering, poses and metrics for other recorded runs. Prescribed-motion examples are labelled separately. The browser replays saved states; it does not solve new dynamics.

## Released software and the next experiment
Version 0.1.1 includes source, runnable examples, documentation, the new scored hero, a separate 96-second walkthrough and reproducible capture tooling. It also corrects cached Back navigation, evidence-status labels and mobile geometry framing. Original release material is MIT-licensed. Physical printing, assembly, load testing and driving remain open: RC25 has not been printed or driven, mechanical fit findings are unresolved, and the vehicle studies are unqualified for fabrication or riding.

## Project Figures

![Ridge R3d in the opening frame of the Vehicle Lab film](https://zack-dev-cm.github.io/docs/images/vehicle-lab-hero-poster.jpg)

Actual project geometry in the first frame. Physical validation remains open.

![Ridge R3d systems separated for detailed inspection](https://zack-dev-cm.github.io/docs/images/vehicle-lab-hero-exploded.jpg)

Display separation explains component relationships; it is not a verified assembly path.

![The complete 65-revision engineering tree](https://zack-dev-cm.github.io/docs/images/vehicle-lab-hero-evolution.jpg)

Recorded revisions and 68 parent links; authored history, not an optimization run.

![Detailed tyre at recorded Chrono log contact](https://zack-dev-cm.github.io/docs/images/vehicle-lab-hero-chrono.jpg)

Saved solver response from the separate tyre study. The failed obstacle traversal remains visible.

## Project Link
https://zack-dev-cm.github.io/projects/vehicle-lab-a-reusable-engineering-notebook.md

## Key Features
- Reusable project CLI, manifest schema, and original desk-rover starter
- 3D orbit, subsystem isolation, wireframe, and exploded inspection
- Revision graph and scoped evidence with source and asset checksums
- Engine-neutral replay interface with an explicit recorded-pose contract
- Native obstacle inspection and saved Chrono handling, log and pit replays
- Eleven documentation pages, a scored hero and an engineering walkthrough

## Tech Stack
- Python
- Three.js
- FreeCAD exports
- Project Chrono data
- Playwright
- FFmpeg

## Benchmarks & Analytics
- Hero film: 37.5 seconds (1920 x 1080, 32 fps; original 128 BPM score)
- Revision tree: 65 records (68 preserved parent links; authored history)
- Physical validation: Open (Digital examples; no qualified hardware release)

## Links
- [Explore in 3D](https://zack-dev-cm.github.io/docs/vehicle-lab/film.html)
- [Watch the 37.5-second film](https://zack-dev-cm.github.io/docs/vehicle-lab/hero.html)
- [Explore motion and terrain](https://zack-dev-cm.github.io/docs/vehicle-lab/terrain.html)
- [Source on GitHub](https://github.com/zack-dev-cm/vehicle-lab)
- [Explore Vehicle Lab](https://zack-dev-cm.github.io/docs/vehicle-lab/)
- [Read the documentation](https://zack-dev-cm.github.io/docs/vehicle-lab/docs/)
- [Release v0.1.1](https://github.com/zack-dev-cm/vehicle-lab/releases/tag/v0.1.1)
- [Download source v0.1.1](https://zack-dev-cm.github.io/docs/vehicle-lab/downloads/vehicle-lab-0.1.1.tar.gz)
