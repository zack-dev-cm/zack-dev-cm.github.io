# AAC Search Visibility Diagnostic

> A source-based browser harness reproducing a mismatch between vocabulary items visible in an AAC grid and items returned by search.

## Summary
I built a small diagnostic around the actual released and development AsTeRICS AAC component methods. At vocabulary level 8, the grid shows the synthetic eight item while search also returns ten. The public harness pins upstream source hashes and records the mismatch in Chromium and Firefox with the local fixture online and offline. It was developed with AI assistance as independent adjacent work in the Neuralink contribution evidence repository; AsTeRICS is the upstream project, and no Neuralink integration is involved.

## Reproduce the inconsistency at its source
The harness imports the real upstream methods instead of copying the search implementation. It compares vocabulary visibility and search results, and probes unrestricted vocabulary, a local level toggle, manual hiding and unchanged source data.

## Bounded browser evidence
Released and development baselines reproduce the mismatch in Chromium and Firefox. Online and offline refer to the same loaded local fixture with network availability toggled. These are component-level checks, not full-app keyboard, speech or assistive-device tests.

## Diagnostic status
The published output is a diagnostic and reproduction, not an upstream patch or user trial. A human-led contribution route and consenting collaborator remain pending. There is no claim of adoption, demonstrated user benefit or affiliation with AsTeRICS or Neuralink.

## Project Figures

![Schematic of the synthetic level-8 diagnostic: the grid contains eight while search also returns ten](https://zack-dev-cm.github.io/docs/images/aac-visibility-poster.png)

Diagnostic schematic based on the published synthetic fixture; not an application screenshot.

## Project Link
https://zack-dev-cm.github.io/projects/aac-search-visibility-diagnostic.md

## Key Features
- Actual upstream component methods
- Pinned released and development baselines
- Chromium and Firefox reproduction
- Vocabulary-level and hidden-item probes

## Tech Stack
- JavaScript
- Playwright
- Chromium
- Firefox
- Jest

## Links
- [Diagnostic source and reproduction](https://github.com/zack-dev-cm/neuralink-contributions/tree/main/aac-audit)
- [Pinned browser evidence](https://github.com/zack-dev-cm/neuralink-contributions/tree/main/evidence/A-02)
