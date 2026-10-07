# Architectural catalog scene

Current scope and availability are recorded in the
[7 October portfolio refresh](portfolio-refresh-20261007.md). The generalized
intake has three recorded source sets and an eight-stage tour. Live generation
is currently paused; the static guide and film remain available. The two-family
functional service described below records the initial implementation.

Source: recovered Case Systems catalog, pages 27/28, and original elevation callouts. Public media contains a procedural cabinet explanation and minimal catalog facts, not raw client sheets or full manufacturer catalogs. Cabinet dimensions are selected catalog variants; construction/finish details are illustrative.

The prior 25 September portfolio animation workflow used DESIGN.md, Three.js r180, deterministic browser capture, media receipts and playable controls. This addition reuses that workflow in `public/architectural-catalog/` and `scripts/media/architectural-catalog/`.

Placement: new selected-work card after Document AI, primary 3D link from case study, and a film/poster fallback. The homepage reuses PreviewVideo visibility/reduced-motion/data behavior. The lab starts paused.

The October 2 visual refinement adds the cabinet preview to the desktop introduction and a direct story link to the mobile hero and selected-work card. Play/pause controls sit below the introduction preview. The small preview crops the model region; the full film retains chapter text and captions. Authored studio reflections, oak grain, contact shadows and camera movement improve inspection without changing catalog facts. Fullscreen is available when supported. Preview exports use square pixels (`setsar=1`) so browser dimensions remain 1280×720. The initial 720-frame receipt recorded source, tool and output hashes; the UI suite includes homepage discovery, explicit preview playback, mobile entry and fullscreen.

The follow-up review reproduced a rejected fullscreen request in the user's Chrome session. A handled rejection now opens an in-page expanded view with background focus isolation and Escape/close controls. Narrow portrait framing compensates for aspect ratio; projected mesh bounds are available in the existing diagnostic API for regression checks. The model download is explicitly the default 36-inch pair. Film receipts must be regenerated whenever the frozen studio source changes.

Build and public gates follow AGENTS.md. The primary case-study and selected-work links now open a separately deployed functional document-to-interior demo. Its original B3000/B3100 examples contain actual native extraction, catalog match, GPT-6.1 sol Codex review, built-in ImageGen output, visual review and downloads. Measured individual runs are reported without an accuracy claim. Nominal variants, source hashes and retained unknowns remain explicit. The static portfolio contains the 3D explanation and optimized copies of those recorded final images; it stores no provider credentials or private raw PDFs. The separate runtime uses a Mac-owned agent connection and an isolated API, with no CAD service changes.

## Complete eight-stage film

The follow-up expands the film to 64 seconds, eight eight-second chapters and
1,536 frames at 24 fps. The stage actions are original drawing scan, native-text
extraction record, catalog-to-family reveal, exploded inspection, known/pending
facts, recorded ImageGen reveal, room construction/placement and evidence handoff
in the final room. `workflow-scene.js` owns those stage geometries; `timeline.js`
owns duration, chapter starts and deterministic progress. Source crops and both
recorded 36-inch oak images are frozen capture inputs and checksum verified in
the browser using `data/workflow-evidence.json`. Full original PDFs remain local.

The room is authored. Its bay slider checks selected nominal width × 25.4 mm
against available bay width and reports equal side clearance or a shortfall.
It does not infer site dimensions, door-swing clearances, installed finish,
quantity or price. The recorded images remain 36-inch oak examples regardless
of procedural width/finish changes. The GLB stays the default cabinet pair.

Each phase has accessible HTML action/detail captions; the main-page preview
contains all phases with the final room poster. Its square-pixel 1280×720 export
preserves the whole model region without cropping document evidence. Orbiting
a source board pauses playback without replacing it with the cabinet pair.
The UI tests cover actual distinct canvas renders, phase geometry movement,
repeatable seeking, evidence corruption, both families, positive/negative fit,
all responsive widths and both native/fallback fullscreen routes.
