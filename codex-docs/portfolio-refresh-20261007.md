# Portfolio and profile refresh — 7 October 2026

The September contribution layout and October catalog film remain the baseline.
This refresh updates contribution evidence, repairs the daily source refresh and
completes the previously requested reproject lesson.

## Current contributions

The public GitHub API was checked for all listed PRs and five additions. Neuralink
datarepo now has six merged PRs, including #74, and #73 remains open. Astropy
reproject #630, pydicom #2379/#2380 and LSST DESC CCL #1310 are open. The closed,
unmerged pydicom contributor-fork PR was replaced by upstream #2380. The portfolio
and profile README use the same reviewed snapshot and short benefit descriptions.
Fork-maintenance PRs are excluded from upstream contribution counts.

## Refresh repair

ClawHub details are resolved with the public API's `ownerHandle` parameter and
the response owner is still verified. Bare duplicate slugs previously returned
409. The retired editorial download-summary sentence is optional; required
statistics and metric rows still fail closed if their source structure changes.
The live snapshot contains 53 skills and 46,300 downloads, checked 7 October.
The GitHub project feed was also refreshed and its API freshness check passed.

The existing daily workflow runs ClawHub, GitHub and paper updates independently.
It reports each actual outcome, retains the last dated snapshot for a failed
source and runs all publication checks on successful updates. If all sources
fail, the workflow stops. A failure is never described as refreshed data.

## Reproject lesson

The lesson follows the actual output-grid → source-grid → inverse-output-grid
path. Its linear WCS values are coordinate-test values, rather than sky degrees.
The recorded baseline result is `[1, 2]` with footprint `[1, 1]`; the proposed
result is `[1, NaN]` with footprint `[1, 0]`. The valid neighbor is unchanged.

`scripts/fixtures/export-reproject.py` executes installed original and proposed
packages, records their versions and verifies transformation-module hashes
against upstream base `a8a2eb45` and submitted head `2ecb4b18`. This verifies the
two-pixel regression. The PR remains open and its outstanding solar-reference
comparison is preserved in the linked source context.

The 36-second guided example supports play/pause, restart, seeking, six chapters,
pixel selection, baseline/proposed comparison, orbit and reset. Manual changes
pause playback. Coordinate steps and result grids remain usable without WebGL.
Playback starts still and respects reduced motion. Fixture-loading failures show
a recovery message rather than presenting the initial placeholders as results.

## Catalog availability

The hosted catalog origin is paused. The public entry now leads to the working
eight-stage 3D guide and downloadable film; live generation is visibly labeled
paused. The implemented intake supports new drawings/catalogs and three recorded
source sets: Case Systems, IKEA ENHET and Herman Miller OE1. The earlier two-family
casework notes are historical. No runtime or hosting restart is part of this
portfolio release.

## Follow-up ideas

Camera Kit #812 is the next candidate: actual barcode coordinates linked to the
rotated/cropped preview and scan frame. Vehicle part isolation and Retrieval
query-path emphasis remain useful refinements. These are optional future work,
not changes included in this release.
