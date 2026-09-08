# Neuralink datarepo Contributions

> Legacy project URL kept for compatibility. Use the canonical project link below.

> Three independent PRs to Neuralink's public datarepo library: query correctness, a runnable quick start and installed-wheel compatibility.

## Summary
I traced a dropped ClickHouse null predicate from the public query builder to incorrect backend results, then submitted a focused fix with real-backend regression tests. Two separate PRs repair the local quick start and propose a tested Python support minimum. The patches, baseline failures, contributor CI and reproduction commands are public. All three PRs remain open as checked on 8 September 2026. This is independent open-source work, developed with AI assistance; it does not imply employment, affiliation or adoption by Neuralink.

## Follow the records in 3D
The interactive Three.js explanation follows the executable quick start: Bolt, Nut and Washer join by supplier_id to Supplier B, A and B. A separate chapter shows the four-row null fixture. Original part models use arbitrary dimensions; their motion illustrates relationships rather than database timing. A 30-second 1080p film, muted preview, GIF and downloadable GLB accompany the scene.

## A query that silently changes meaning
On the published four-row synthetic fixture, IS NULL returned all four rows instead of IDs 1 and 3. The change emits unary null predicates directly and rejects unsupported operators before creating a backend client. It preserves the existing comparison and grouping behavior. The baseline recorded 20 expected failures; the patched contributor run recorded 135 passing tests with a real disposable ClickHouse and zero skips.

## A quick start people can run
The documentation PR replaces a cloud-dependent example with local synthetic Parquet data and a supplier join. Two tests check the documented source, schema and displayed results. The example runs without real credentials or a cloud service.

## Test the installed package
The packaging PR proposes Python 3.10 as the minimum after measured Python 3.8 dependency-resolution and Python 3.9 import failures. Clean installed-wheel reads passed on Python 3.10 and 3.12 on Linux. The support-policy change remains a maintainer proposal; these runs cover a bounded installation and local read path.

## Contribution status
PRs 57, 58 and 59 are separate open submissions. The linked contributor CI passed for the submitted commits. Those results do not establish upstream approval or a merge. Status checked on 8 September 2026.

## Project Figures

![Follow the records in 3D - interactive model](https://zack-dev-cm.github.io/docs/neural-engineering/media/datarepo-poster.jpg)

Original illustrative parts represent the quick-start records; dimensions are arbitrary.

![Published synthetic null-filter example showing four source rows and the two expected matching IDs](https://zack-dev-cm.github.io/docs/images/datarepo-query-poster.png)

Reconstructed from the published regression fixture. Open PR; contributor verification.

## Project Link
https://zack-dev-cm.github.io/projects/neuralink-datarepo-contributions.md

## Key Features
- ClickHouse IS NULL / IS NOT NULL regression fix
- Synthetic local Parquet and supplier-join example
- Clean wheel installation and read checks
- Separate patches, baseline failures and contributor CI

## Tech Stack
- Python
- ClickHouse
- Polars
- Parquet
- pytest
- GitHub Actions

## Links
- [Explore in 3D](https://zack-dev-cm.github.io/docs/neural-engineering/studio.html?project=datarepo)
- [Watch the 30-second film](https://zack-dev-cm.github.io/docs/neural-engineering/media/datarepo-film.mp4)
- [Download 3D model](https://zack-dev-cm.github.io/docs/neural-engineering/models/datarepo.glb)
- [Query-correctness PR #57](https://github.com/neuralinkcorp/datarepo/pull/57)
- [Quick-start PR #58](https://github.com/neuralinkcorp/datarepo/pull/58)
- [Packaging PR #59](https://github.com/neuralinkcorp/datarepo/pull/59)
- [Source and reproduction evidence](https://github.com/zack-dev-cm/neuralink-contributions)
- [Contributor CI](https://github.com/zack-dev-cm/neuralink-contributions/actions/runs/34191476771)
