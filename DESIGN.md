---
version: "alpha"
name: The Wind Remembers Design System
description: Hidden editorial motion system for the easter-egg future page.
colors:
  primary: "#95E7FF"
  ink: "#07111a"
  surface: "#0b1622"
  surface-strong: "#101d2a"
  copper: "#f0a66f"
  ivory: "#f3ecde"
typography:
  display:
    fontFamily: "Iowan Old Style"
    fontSize: "5rem"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "0"
  body:
    fontFamily: "Avenir Next"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "0px"
  label:
    fontFamily: "Avenir Next"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
rounded:
  sm: "16px"
  md: "24px"
  lg: "36px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  xl: "72px"
components:
  hero-shell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.lg}"
  primary-button:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    rounded: "999px"
  secondary-button:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ivory}"
    rounded: "999px"
  label-chip:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.copper}"
    rounded: "999px"
---

## Overview

This file governs the standalone `public/skill-wind/` page. The page is an
easter egg inside the portfolio and also the portfolio's social cover surface,
so it should feel discovered rather than marketed. One generated artwork carries
the emotional weight; browser motion should turn it into a slow four-act cover
instead of competing with it.

## Colors

The palette is built around deep ink, pale cyan, warm copper, and parchment
ivory. Cyan signals machine cognition, copper signals embodied craft, and the
dark field keeps the motion readable. Do not let purple take over the page, and
avoid saturated neon rainbow accents.

## Typography

Headlines should feel cinematic and literary, so use a high-contrast serif for
display copy. Supporting copy and UI controls should use a clean sans. Keep
display copy dense and short; longer explanatory text belongs in the body face.

## Layout

The animated cover stage is the dominant surface and should stay near a
LinkedIn-friendly 1200:627 ratio on desktop. On mobile it can become taller so
the artwork does not collapse into a shallow strip. The written meditation
belongs below the cover stage, not beside it, so the artwork remains the first
viewport signal.

## Motion

Motion is a narrative layer. The page needs three roles for movement:

- atmospheric wind currents on canvas
- drifting skill labels that cross the transformation field
- slow atmospheric pulsing around the stage
- a four-act loop: embodied value, rupture, threshold, re-formation

Respect `prefers-reduced-motion`. Reduced-motion mode should preserve the layout
and the artwork while removing continuous animation.

## Components

Buttons should feel almost incidental and never dominate the frame. Label chips
should look like suspended fragments crossing the threshold. Section cards may
use glass-like panels, but avoid stacking multiple frosted layers on top of one
another.

## Do's and Don'ts

- Do keep the central transformation readable from left to right.
- Do keep the social cover crop meaningful at 1200 x 627.
- Do make the page feel hidden and deliberate, not like a product launch page.
- Do use negative space so the headline can breathe.
- Do keep the copy grounded in craft, memory, grief, care, and duty.
- Do not use literal robot mascots, fake dashboards, or stock sci-fi chrome.
- Do not bury the main image inside a tiny frame.
- Do not let decorative motion create horizontal overflow.
