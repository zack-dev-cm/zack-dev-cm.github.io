---
version: "alpha"
name: Zakhar Pashkin Portfolio Artifact Utility
description: Open Design-inspired public portfolio system for AI product engineering evidence, case studies, resume assets, and the hidden Skill Wind cover page.
colors:
  page: "#05070B"
  rail: "#090D12"
  surface: "#10161D"
  surface-strong: "#151D25"
  ink: "#F7FAFC"
  muted: "#94A3B8"
  primary: "#8BD6FF"
  review: "#40D399"
  evidence: "#F6B44B"
  alert: "#FF6B57"
typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: "clamp(3rem, 7vw, 6.2rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "0"
  body:
    fontFamily: "Space Grotesk"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "0px"
  label:
    fontFamily: "Space Grotesk"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  xl: "72px"
components:
  hero-shell:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "#04111E"
    rounded: "999px"
  secondary-button:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "999px"
  label-chip:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.evidence}"
    rounded: "{rounded.md}"
  command-bar:
    backgroundColor: "rgba(9,13,18,0.82)"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  evidence-board:
    backgroundColor: "linear-gradient(180deg, rgba(12,17,23,0.96), rgba(8,11,15,0.82))"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  compact-data-row:
    minHeight: "58px"
    rounded: "{rounded.md}"
    density: "dashboard"
---

## Overview

This file governs the public portfolio and the standalone `public/skill-wind/`
page. The portfolio is an artifact utility for hiring decisions: clients and
recruiters should see what Zakhar can ship, what proof exists, and where to
contact or hire him without digging through decorative marketing. The current
UI direction borrows from `nexu-io/open-design`: question before pixels,
artifact before decoration, deterministic navigation, and compact live preview
surfaces.

## Colors

The main portfolio uses a near-black neutral base, off-white text, cyan action
color, green review-gate accents, amber evidence accents, and sparse alert red
for risk states. Avoid purple-blue gradient dominance, beige/brown themes,
dark-blue wash, and decorative orb backgrounds. Skill
Wind can keep its deep ink, pale cyan, warm copper, and parchment ivory because
it is a separate hidden editorial cover.

## Typography

The main portfolio should feel dense and professional, not ceremonial. Use
large display type only for the first hero. Compact panels, project cards,
contact tiles, command bars, and dashboard-like surfaces need smaller headings
and stable font sizes across viewports. Letter spacing stays `0` except short
uppercase labels.

## Layout

The portfolio uses a left identity rail, a sticky command bar, and a main
evidence column. The first viewport should show identity, hiring routes, the
production-facing value proposition, and a hint of the next section. Project
cards are repeated items and may be framed; page sections should not feel like
nested cards inside cards.

First-viewport quality gate: the hero must not become a wall of headline text
or a metric dump. Keep one direct positioning sentence, two to three obvious
routes into the work, and one compact evidence board. On mobile, at least one
useful route should be visible within the first screen after the lead copy.
Product screenshots should remain inspectable and should not be cropped in ways
that hide the UI evidence.

Computer vision and AI system sections may use generated conceptual systems
maps when the project itself is non-public. Treat those images as orientation
art only: pair them with source-backed copy, keep repo/service links out of
non-public work, and never present generated media as a product screenshot or
benchmark artifact.

For Skill Wind, the animated cover stage remains the dominant surface and
should stay near a LinkedIn-friendly 1200:627 ratio on desktop. On mobile it can
be taller so the artwork does not collapse into a shallow strip.

## Motion

Motion is a narrative layer. The page needs three roles for movement:

- atmospheric wind currents on canvas
- drifting skill labels that cross the transformation field
- slow atmospheric pulsing around the stage
- a four-act loop: embodied value, rupture, threshold, re-formation

Respect `prefers-reduced-motion`. Reduced-motion mode should preserve the layout
and the artwork while removing continuous animation.

## Components

Portfolio project cards must be obviously clickable: stable media area, badges,
plain-language title, one proof line, stack chips, and a visible open affordance.
The profile navigation is grouped by Start, Proof, and Explore. The sticky
command bar should expose the highest-frequency jumps without duplicating the
entire rail. Email is the primary contact route; X is a secondary
profile/contact surface. External social links need accessible names and exact
hrefs, with no freelance marketplace profile links. Buttons should use icons
where familiar and avoid text clipping on mobile.

Proof surfaces such as ClawHub and Chrome Web Store stats should use compact
evidence boards, not long marketing cards. Put exact dated counters in a dense
metric strip, use tabular numbers for rows, collapse low-priority long tails
behind a native disclosure, and keep source links one click away. The board
must stay readable on mobile without horizontal scrolling and should not turn
listing downloads into adoption claims.

Skill Wind label chips should look like suspended fragments crossing the
threshold. Section cards may use glass-like panels there, but avoid stacking
multiple frosted layers on top of one another.

## Do's and Don'ts

- Do keep project proof conservative and dated when it is a snapshot.
- Do make email, X, GitHub, Telegram, LinkedIn, and resume links visible in the relevant contact surfaces.
- Do show X as a profile link without confusing it with the modal close icon.
- Do keep project cards clickable by mouse, Enter, and Space, with URL deep links.
- Do verify mobile, tablet, and desktop screenshots before publishing.
- Do make navigation feel like an operator tool: grouped, predictable, and close to the reader.
- Do not invent user counts, client names, or product screenshots.
- Do not bury public links only inside modals.
- Do not add decorative blobs, fake dashboards, nested cards, or stock-like AI art to the main portfolio.
- Do keep the central transformation readable from left to right.
- Do keep the social cover crop meaningful at 1200 x 627.
- Do make the page feel hidden and deliberate, not like a product launch page.
- Do use negative space so the headline can breathe.
- Do keep the copy grounded in craft, memory, grief, care, and duty.
- Do not use literal robot mascots, fake dashboards, or stock sci-fi chrome.
- Do not bury the main image inside a tiny frame.
- Do not let decorative motion create horizontal overflow.
