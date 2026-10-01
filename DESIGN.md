---
version: "2026-09"
name: Zakhar Pashkin — Technical Portfolio
summary: An editorial portfolio organized around maintained systems and inspectable work.
colors:
  page: "#090C10"
  surface: "#11161C"
  surfaceRaised: "#171E26"
  ink: "#F0F3F5"
  muted: "#A3AEB8"
  subtle: "#7E8C98"
  accent: "#97D8EA"
  line: "#29333D"
typography:
  family: "Space Grotesk, Segoe UI, system-ui, sans-serif"
  displayDesktop: "64px / 1.06 / 600"
  displayCompactDesktop: "56px / 1.06 / 600"
  displayTablet: "44px / 1.06 / 600"
  displayMobile: "40px / 1.08 / 600"
  displaySmallMobile: "36px / 1.08 / 600"
  section: "32px / 1.2 / 600"
  sectionMobile: "28px / 1.2 / 600"
  card: "23px / 1.25 / 600"
  body: "16px / 1.65 / 400"
  small: "14px / 1.5 / 400"
  letterSpacing: "0"
spacing:
  unit: "8px"
  sectionInsetDesktop: "56px"
  sectionAfterDesktop: "76px"
  sectionInsetMobile: "40px"
  sectionAfterMobile: "52px"
  gutterDesktop: "48px"
  gutterTablet: "36px"
  gutterMobile: "24px"
layout:
  maxWidth: "1200px"
  headerHeight: "88px"
  headerHeightMobile: "72px"
rounded:
  control: "6px"
  media: "8px"
components:
  button:
    minHeight: "46px"
    backgroundColor: "{colors.accent}"
    textColor: "#10222A"
  project:
    border: "1px solid {colors.line}"
    mediaAspectRatio: "16 / 9"
    caption: "11px / 1.5"
  section:
    borderTop: "1px solid {colors.line}"
---

## Direction

The main reader is an engineering leader or recruiter arriving from a resume,
GitHub profile, referral, or search. They need to understand the role, inspect
relevant systems, and reach the resume or contact links in one visit.

Three directions were considered: a restrained dark editorial portfolio, a
light paper CV, and a product studio with large visual cards. The editorial
direction preserves Zakhar's established black/cyan identity while making the
career story and selected engineering work easy to scan. The paper direction
is reserved for the downloadable resume. The product studio direction gave
too much prominence to the number of projects.

The prior desktop and mobile captures showed an oversized sentence headline,
duplicated navigation, a metrics dashboard, and action links below the first
mobile viewport. The new composition has one horizontal header, name and role,
one positioning sentence, visible resume and work actions, and selected work.

## Hierarchy and layout

1. Name, senior ML role, proposition, resume and selected work links.
   A quiet search field below the hero links accepts project names, problems,
   and technologies. Submission opens the existing archive and moves keyboard
   focus to its result count. Keep this secondary action to one compact row
   with 44px touch targets, capped at 440px; retain the navigation and primary
   action hierarchy. Exact names and aliases take precedence in results;
   related vocabulary ranks projects supported by the original query terms.
   Search covers affirmative case-study text, project-owned captions and
   source-reviewed capabilities; disclaimers stay visible without advertising
   excluded capabilities. Ordinary role and task vocabulary should find the
   same supported work as common acronyms. Prefer concrete,
   relevant engineering cases over general archives at the same match quality;
   generic word fragments must not count as technical matches. Preserve literal
   acronyms and honor the selected result order while a query is active.
   Rank inspectable implementations ahead of name-only listings for broad
   interests. Exact names improve rank without hiding other relevant work.
   Category totals describe current query matches, and filter recovery retains
   the visitor's query and order.
2. A small curated selection of maintained products, ML infrastructure, and
   document/CV systems. Public links sit beside each story.
3. Current and previous engineering experience, then approach and expertise.
4. A clearly labeled, initially collapsed project archive for deeper exploration.
   Search actions and direct archive anchors open it; every existing route remains usable.
5. Specific contribution records with visible PR status, updates, optional release
   counters, and direct contact. Issue participation is a separate disclosure.

Sections use whitespace and horizontal rules. Cards are for repeated projects
and the project modal. Avoid nested dashboards, decorative grids, glows, generic
AI art, skill meters, manufactured traction, and numeric portfolio totals in
the hero. Keep existing project routes and keyboard interactions functional.

## Typography and color

Use a stable type scale with explicit mobile breakpoints. The name is the only
large display heading. Body copy is short, concrete, and set with a readable
line length. Muted cyan identifies links and the role; off-white carries the
primary content. No gradients or ambient decoration. Uppercase labels may use
0.1em tracking for a clear editorial section marker; body text uses zero.

## Project presentation

Selected stories explain what the system does and Zakhar's engineering work.
Prefer maintained service, package release, model deployment, and evaluation
evidence over small audience counts or implementation item counts. Show no
unverified performance claim. No internal review or sanitization language in
the hiring narrative. Do not invent reviews or imply employer endorsement.

Preserve real screenshots at an inspectable size. Label generated conceptual
diagrams as illustrations when displayed; do not turn them into product proof.
For projects with no suitable screenshot, use a bespoke conceptual illustration
that explains the subject. Label it visibly and keep it distinct from evidence.
Use the existing multimodal-search, OCR and face-analysis system figures as
composition references: concrete input, explicit processing stages and a
recognizable output. Reject atmospheric still lifes, floating-paper metaphors
and abstract model blocks. Keep labels short, purposeful and source-verified.
Do not fabricate product dashboards, CLI commands or benchmark plots. Real research figures
retain their axes, full captions, and evaluation limitations. Case studies show
all selected figures in a responsive, inspectable gallery rather than reusing
a title card as the only visual.

Selected cards lead with a readable HTML title and context label. A consistent
framed figure follows as supporting material, with its source type in a readable
caption below the image rather than a tiny overlay. Keep the selected stories;
avoid making dense illustration text carry the card's meaning. Main case-study
links navigate to a full reading page; archive cards retain the quick-view modal.
Direct reading pages share the home page's typeface, identity and navigation.

Vehicle Lab follows the document and catalog stories as a released engineering
notebook. Use the 01:22 exploded-inspection frame from its actual film, cropped
to the CAD viewport, with a visible source caption. Keep its full film in the
case-study links and archive viewer. The selected cards retain the ML career
focus. Private company R&D uses brief experience summaries without project assets
or implementation details.
Vehicle Lab copy distinguishes released software and digital prototypes from
physical assembly or driving, which remain unverified.

Open-source evidence groups contributions by project, ranked by practical impact
and upstream acceptance. Each row pairs the project's GitHub logo with one short
benefit, accurate merged/open counts and direct PR links. Neuralink leads with
five merged changes; substantial pending fixes follow before smaller documentation
changes. Mark contributor-branch work explicitly. Keep bug reports in a disclosure.
The hero includes an Open-source contributions button linking to this section.

## Project motion — September 2026

The Vehicle Lab preview works because the subject remains large while its state
changes. The older white workflow sheets and profiling table lose their detail
at card size. Keep the page hierarchy and a small selection of projects; improve the
figures rather than expanding the homepage into a gallery.

Three media directions were assessed: decorative studio art, full workflow
diagrams, and short process sequences. Use process sequences for cards. Retain
full diagrams and recorded reports in case studies. Generated art supplies a
subject only; labels, geometry, numbers, and transitions come from the project.

- Dermaself: a synthetic face, guided capture, facial regions, and structured
  results. Label the sequence as an illustrated workflow, never a model result.
- Agnitra: animate the actual recorded tensor shapes layer by layer. Keep the
  package version visible and make no optimization or accuracy claim.
- Video retrieval: reveal the visual, speech, and OCR lanes, then timestamped
  retrieval. Use an authored illustrative scene and label it as a schematic.
- SectionCheck: use the released synthetic shapes and exact translation/ROI
  coordinates. Explain proposed mapping and review without implying approval.

Reserve new 3D models, films and GIFs for substantial main projects with a clear
engineering story. Datarepo consists of small upstream contributions: retain its
PR links in the contributions list and exclude it from the main catalogue and
3D galleries. Agnitra and Multimodal Video Search are the next selected batch;
small patches and diagnostic notes do not receive standalone showcases.

Use 1280 × 720 sequences, an immediately informative poster, a restrained dark
background, large subject and short labels. Prefer MP4 for on-page motion; GIF
exports are optional sharing assets. Reuse the existing pause control,
visibility suspension, reduced-motion and data-saving behavior. Captions must
distinguish recorded output, synthetic fixtures, and conceptual illustrations.

Neuralink appears in contribution and independent-project contexts. Do not add
it to employment history, employer logos, or imply affiliation. The five
datarepo PRs #57, #58, #59, #67 and #68 are merged as checked on 17 September 2026. SectionCheck and AAC remain
independent adjacent work with their own upstream and scope boundaries.

## Responsive and accessibility

### Playable contribution lessons

For substantial contributions with an inspectable example, link a focused lesson
from its contribution row without promoting every patch into selected work.
The September 2026 batch covers netCDF4 empty selections and pydicom LUT indexing.
Each opens paused with a useful model, an explicit Play/Pause action, restart,
scrubbing and chapter navigation. Input, camera and selection interactions pause
the example. Reduced motion and a hidden tab stop playback. Keep arithmetic and
shape explanations usable if WebGL cannot load.

Every scene answers a specific question through a real change in state. netCDF4
uses the PR's synthetic 3 × 5 × 7 shape; no cubes survive an empty selection.
pydicom uses synthetic values and a four-entry LUT; height represents value,
never anatomy. Keep dated PR status in the contribution listings and link source/tests from the lesson.
Labs focus on the example and controls; omit contributor, acceptance and benchmark
disclaimer blocks. Use short legends only where they help interpret the model.
Use semantic colors, readable DOM explanations, keyboard equivalents for picking,
and explicit source versus illustration boundaries. Separate text from the model
viewport so smaller screens can scroll instead of hiding controls or shrinking type.

Considered directions: a film-only preview, an orbit-only scene, and a guided
example with editable inputs. Use the third: the visitor should be able to pause
at the failure, change the input, and understand the corrected result.

At 390px and 360px, name, role, positioning sentence, and both main actions must
fit in the first viewport. At 768px, work cards form two columns where their
copy remains readable. At desktop, the layout uses generous side margins and
an intentional maximum width. No horizontal body scrolling or cropped text.

Use semantic headings, visible keyboard focus, 44px or larger main controls,
understandable links, keyboard-operable project cards, and the existing modal
focus trap. Respect reduced motion. Resume, GitHub, email, Telegram, LinkedIn,
and X remain discoverable without a floating control obscuring the content.

## Verification

Inspect before/after screenshots at 360, 390, 768, and 1440px. Run typecheck,
build, repository validation/security checks, and relevant UI E2E tests.
Release requires at least 8/10 in clarity, visual trust, evidence integrity,
responsive polish, accessibility, claim alignment, action clarity, and
uniqueness. Record the observed scores in the delivery report after screenshots.

## Separate hidden artwork

The standalone Skill Wind page keeps its existing deep ink, copper, parchment,
animated wind currents, and transformation artwork. It is a separate visual
piece and does not dictate the portfolio layout. Preserve its reduced-motion
behavior and the existing discreet header navigation gesture.

## Catalog matching lesson — October 2026

Add Architectural Drawing and Interior Catalog Matching to the first selected-work row, following Document AI. It is an existing substantial project with recovered original catalog/elevation inputs. Retain the hero and all seven earlier selected stories. Use a compact silent preview in the repeated project layout; put the full interactive lab behind an explicit link.

Considered directions: (1) a photoreal room flythrough, (2) an abstract document/AI node graph, (3) a cabinet comparison driven by the original catalog. Select the third because the one-drawer/two-drawer difference explains exact matching with real evidence. A room flythrough would require unverified room geometry; the graph would obscure the item being matched.

The lab uses charcoal editorial framing, warm oak, porcelain carcasses and brushed dark hardware, with cyan dimension/evidence marks. Material finishes and construction details are authored. Product family, door/drawer counts, allowed nominal dimensions and catalog pages are source-grounded. Keep text outside the model on small screens. Use at least 44px controls, a readable no-WebGL fallback, paused entry, keyboard selection, chapter navigation and deterministic camera states.

First traffic: portfolio selected work and the architectural project case study. Reader: an engineering lead or design technologist examining source-grounded document AI. Share moment: opening two cabinets reveals why similar-looking codes cannot be treated as interchangeable. Action: explore the catalog comparison; download the film or model.

Seven media candidates were evaluated, each with an explicit privacy boundary (original client sheets remain local):

| Hook | Audience / proof | Incentive / CTA / share trigger | Decision |
| --- | --- | --- | --- |
| One code, one catalog family | Engineering lead; original B3000 callout and page 27 | Follow the match; open 3D; source-to-object reveal | Use as opening |
| One drawer or two? | Design technologist; catalog diagrams 27/28 | Compare B3000/B3100; open drawers; send the difference | Main film |
| Open the cabinet | Product designer; grounded shelf/door counts | Inspect internals; separate parts; save the exploded view | Use chapter |
| A code is not a dimension | Architect; allowed catalog options | Change width; inspect nominal configuration; share unit clarity | Use chapter |
| Catch an incorrect mapping | Document-AI engineer; W0100/R1000 source pages | Read corrected facts; source notes; share failure lesson | Use text evidence |
| From callouts to a draft BOM | Estimator; source/occurrence contract | Review unresolved quantities; case study; send review pattern | Use final chapter, no invented prices |
| Cinematic room flythrough | General visitor; no recovered verified room geometry | Walk a room; share finish concept | Defer; would invent room facts |

The 30-second film uses six 5-second chapters at 24 fps, 1920×1080; the on-page loop is 1280×720. Render a readable first frame/poster and VTT captions. The same procedural scene drives the playable lab and deterministic film. Verify source hashes, media metadata, responsive screenshots, fallback, controls and public leak gates; record critic scores after inspection.

The catalog card now leads to the working full workflow. Keep its playable 3D preview in selected work and the full film in the case-study hero; the final generated cabinet images belong in the inspectable case gallery. Label real agent output, source-grounded procedural geometry and proposed model evaluation distinctly. The full workflow uses original document crops and reviewed unknowns, rather than a fabricated dashboard.

### Catalog story discovery and cinematic finish

Reuse the September 25 session's guided-example workflow: play/pause, restart,
scrubbing, chapters and manual inspection. Considered placements: a blocking
intro film, a standalone link, and an integrated preview. Use the integrated
preview in the desktop current-work column, with a direct 3D Story link among
the mobile hero links and another beside the catalog card. Retain the identity,
resume and selected-work actions. Motion starts silently when visible, respects
reduced motion and data saving, and stops when offscreen or user-paused.

The small preview shows the cabinets at useful scale; chapter text belongs in
HTML and in the full film, rather than being shrunk into a card. Refine warm oak
grain, metal reflections, contact shadows and smooth camera moves using the
same deterministic procedural scene. Keep the geometry and selected nominal
dimensions grounded in the original catalog. Studio lighting and materials are
illustrative. Provide fullscreen for detailed inspection. Re-render the film,
posters, preview and GLB together, preserving source and frame receipts.
