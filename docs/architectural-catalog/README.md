# From drawing to catalog

A procedural Three.js study of real Case Systems B3000 and B3100 families, grounded in the recovered project catalog. See sources.html and data/catalog-facts.json for page references, source hash and scope. Minimal original drawing/catalog crops from the published functional demo are reused with byte hashes; complete client sheets and manufacturer PDFs remain local.

Play/pause, restart, scrub and eight chapters drive the same deterministic scene as the 64-second film. Cabinet selection, nominal width, finish, opening, separation, wireframe and part selection pause the story and allow inspection. A static comparison and MP4 remain usable without WebGL.

Three.js r180, OrbitControls and GLTFExporter reuse the portfolio's vendored MIT distribution in ../engineering-studies/vendor. Captions, film/poster and GLB are generated with scripts/media/architectural-catalog/capture.mjs. Construction and finishes are authored visual details, not manufacturing specifications.

The portfolio introduction has a silent preview on desktop and a direct story
link on mobile. The selected-work card also links directly to the interactive
study. Preview playback respects visibility, user pause, reduced motion and
data saving. Small previews crop the model region from the full film so chapter
copy stays readable in surrounding HTML. The lab adds fullscreen inspection;
studio reflections, fine oak grain, contact shadows and camera moves are authored.
The 64-second film retains the guided visual sequence with text and captions.

Fullscreen denial falls back to an in-page expanded view with a focus boundary
and Escape/close controls. Portrait framing keeps both cabinets and their opened
components in view. The downloadable GLB is the captured 36-inch warm-oak pair.

Each phase has a distinct deterministic visual: source scan, extracted code record,
catalog-to-object connection, exploded inspection, known/pending facts, recorded
ImageGen reveal, room construction and placement, then a handoff in the final room.
The illustrative bay checks nominal cabinet width in millimetres; it does not
establish site dimensions or installation clearances. The recorded 36-inch oak
images remain independent of procedural width/finish changes. Workflow evidence
and all six images are checksum verified before playback.

The scene reserves separate HTML rows for narration and model labels. Physical
plates use depth-tested text in their own plane; dimension text has an opaque
backing. A short fade conceals unrelated chapter resets, while room placement
and the final handoff share stable framing. Paused chapter starts stay visible.
The preview fades through black at its loop seam and has an informative poster.

Run the local composition scan with
`node scripts/media/architectural-catalog/review.mjs --decoded` after starting
a preview of `public/` on port 4174. It checks 640 scene samples across five
widths, caption separation, clipping, depth tests and room framing, then decodes
40 real film frames. Capture runs its own composition preflight. An independent
visual reviewer separately inspects the exported film, preview, JPEGs and
chapter transitions; bounds checks alone do not establish visual quality.
See the dated visual/upload verification note in `codex-docs/` for scope.
