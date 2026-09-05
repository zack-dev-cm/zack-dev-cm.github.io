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
caption below the image rather than a tiny overlay. Keep the six selected stories;
avoid making dense illustration text carry the card's meaning. Main case-study
links navigate to a full reading page; archive cards retain the quick-view modal.
Direct reading pages share the home page's typeface, identity and navigation.

Open-source evidence is a short list of repository, contribution, status and link.
Merged PRs appear first, followed by open PRs. Bug reports and issue discussions
remain available in an explicitly labeled disclosure. Do not use organization logos
as a substitute for describing the contribution.

## Responsive and accessibility

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
