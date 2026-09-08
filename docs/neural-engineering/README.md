# SectionCheck geometry explorer

Inspect the original synthetic image pair, proposed affine transform and polygon
regions behind SectionCheck. The viewer supports orbit, separated layers,
wireframe and a chapter tour. Input geometry is 2D; depth is added for explanation.

[Open the explorer](https://zack-dev-cm.github.io/docs/neural-engineering/studio.html?project=sectioncheck)
· [Watch the 30-second film](media/sectioncheck-film.mp4)
· [Download the static GLB model](models/sectioncheck.glb)
· [Open the synthetic report](https://zack-dev-cm.github.io/sectioncheck/)

[![SectionCheck synthetic geometry in motion](media/sectioncheck-preview.gif)](https://zack-dev-cm.github.io/docs/neural-engineering/studio.html?project=sectioncheck)

## Explore

Drag to orbit and scroll or pinch to zoom. Separate the layers or switch on
wireframe. Chapter buttons jump to the corresponding explanation. **Play tour**
restores the film camera; **Reset view** restores the current chapter's framing.
Motion pauses when the tab is hidden. Reduced-motion preferences start the scene
paused. Sound is opt-in.

The 30-second film is 1080p at 32 fps. The muted preview is 720p, and the GIF plays
the full sequence at twice speed in 15 seconds. [WebVTT captions](media/sectioncheck.vtt)
accompany the film. The GLB is a static, separated inspection scene with named
objects and source facts; explanatory animation remains in the browser viewer.

## Source and scope

The scene uses the published original synthetic PNGs, exact affine matrix and ROI
coordinates, including the polygon's excluded hole and two separated regions.
The saved source-footprint warning, missing calibration and `decision_required`
state remain visible. These are authored synthetic inputs. Researcher usefulness,
clinical accuracy and external-viewer import remain unconfirmed.

- [SectionCheck source snapshot](https://github.com/zack-dev-cm/sectioncheck/tree/c11ee36b86b62f5d73ace0d5029900db1c24cb08): images, manifest, annotations and saved review.
- [Fixture provenance](data/provenance.json): the viewer verifies copied fixture hashes before rendering.
- [Film capture receipt](media/sectioncheck-capture.json): original input/output hashes, frame timestamps and renderer checks.
- [Capture source snapshot](https://github.com/zack-dev-cm/neuralink-contributions/tree/7fd77f0bddaae8794dbaa9ee64a2662495771d66/showcase): reproduction tools, source code and input hashes used for the film and static model.

The hosted gallery now presents SectionCheck alone. Capture-source hashes refer
to the linked original snapshot. Serve this directory over HTTP to run the viewer;
it uses same-origin local assets and does not upload data. Reproduction commands
and dependencies are documented in the capture source snapshot. GPU rasterization
can differ between hosts; byte-identical media reproduction is not promised.

## Licenses

Original scene code, synthetic shapes and rendered visuals: Apache-2.0 under the
[license](LICENSE). Three.js r180 and its controls/exporter: MIT with the
[upstream notice](vendor/THREE-LICENSE.txt).

The score generator and readback comparison adapt MIT-licensed Vehicle Lab work,
copyright 2026 Vehicle Lab contributors; its [license](vendor/VEHICLE-LAB-LICENSE.txt)
is retained. **Pixel Paths** is an original synthesized arrangement without
imported recordings or samples. [Score checks](media/score.json) record loudness
and sample checks; they do not establish human listening review.

Developed with AI assistance. No Neuralink affiliation or endorsement.
