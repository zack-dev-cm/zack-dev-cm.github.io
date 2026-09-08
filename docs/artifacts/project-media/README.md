# Portfolio media sources

These short explainers distinguish recorded output, authored test fixtures and
conceptual imagery. Animation duration does not represent computation time.

- **Agnitra:** tensor dimensions from the existing
  [recorded CPU report](../agnitra-cpu-profile/shape-report.json), package 0.2.4.
  Channel planes illustrate dimensions, not activation values or performance.
- **SectionCheck:** `manifest.json`, `annotations.json`, `source.png` and
  `target.png` are the authored Apache-2.0 fixture from
  [SectionCheck 0.2.1.dev0](https://github.com/zack-dev-cm/sectioncheck/releases/tag/v0.2.1.dev0).
  The preview redraws the exact source polygons and the proposed +40/+24 pixel
  translation. Intermediate positions illustrate mapping; no transform is fitted.
- **Datarepo:** the four synthetic rows and expected IDs come from
  [PR #57](https://github.com/neuralinkcorp/datarepo/pull/57). The before/after
  sequence explains published regression evidence, not upstream acceptance.
- **AAC:** the schematic reproduces the synthetic vocabulary-level mismatch
  documented in the [source diagnostic](https://github.com/zack-dev-cm/neuralink-contributions/tree/main/aac-audit).
  It is not an application screenshot.
- **Dermaself and video retrieval:** the two PNG subjects in this directory were
  generated with AI on 8 September 2026. They contain no real user image or
  project data.
  The face regions, search query and timestamp are illustrative, not predictions
  or recorded product results.

The source renderer is `scripts/media/render-project-previews.mjs` in the
portfolio repository. It uses the existing canvas dependency and FFmpeg to
produce 1280 × 720, 12-second MP4 previews, static PNG posters and 640 × 360 GIF
exports. The homepage uses MP4 with the portfolio's accessible pause, visibility,
reduced-motion and data-saving controls. GIFs are optional sharing assets.

Rebuild after installing the portfolio dependencies and FFmpeg:

```bash
node scripts/media/render-project-previews.mjs
```

Neuralink PR status was checked on 8 September 2026. Contributions and adjacent
independent prototypes do not imply employment or affiliation.
