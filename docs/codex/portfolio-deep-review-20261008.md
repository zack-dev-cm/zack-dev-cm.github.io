# Portfolio and GitHub profile deep review — 8 October 2026

The public portfolio, GitHub profile README and downloadable resume must tell the same story. Review source claims and failure paths in addition to layout and release checks.

## Corrections from this review

- The resume still described three Neuralink PRs as open and LigninQC as in progress. Its source and all PDF/HTML download aliases now describe seven merged Neuralink PRs, the merged netCDF4 correction and the released LigninQC 1.0.0 offline package. Inspect both rendered PDF pages after rebuilding.
- The CoCa documentation correction targets `lucidrains/open_clip`, a fork of `mlfoundations/open_clip`. Both contribution headings identify the fork.
- The automated VCR-Bench note incorrectly described visual answer grounding. Its primary abstract concerns video-classifier robustness. Topic routing now separates classifier robustness, other computer vision and multimodal QA; ordinary policy or continual-learning terms do not establish reinforcement learning.
- Paper notes identify their abstract scope and proposed, unrun checks. Rewrites require the primary abstract for every retained paper. The arXiv metadata query explicitly requests the full batch; its default returned only ten of thirteen requested entries. Complete feed outages and maintenance HTML fail visibly, and response-body reads have a timeout. Reference watches receive no manufactured verification date.
- Missing ClawHub counters fail the refresh instead of becoming dated zeros. Explicit numeric zeros remain valid.
- Missing Chrome Store version, update date and category remain unknown under a fresh user-count snapshot. The UI displays “Not reported”; previous metadata does not become newly verified.
- Daily commits include generated root discovery files and public social cards as well as built output. A real temporary Git repository exercises new files, changed discovery output and exclusion of private notes.
- Both publication workflows share the production concurrency group. Before deploying, each checks that its artifact corresponds to the current main commit. Regression fixtures exercise an artifact superseded by a newer commit. This does not establish FIFO ordering of GitHub Actions jobs.
- GitHub profile pins include SectionCheck and Vehicle Lab alongside CV Repro Lab, Artifact Redactor, LocalLens and the portfolio. Vehicle Lab remains supporting work.
- Disclosure inspection retains readable text around malformed UTF-8 instead of treating a decoding error as an exemption. Oversized text and unknown artifacts fail closed. Six unchanged, previously published large binary releases are allowed only by their complete SHA-256 identities; changing their bytes requires another review. Public SVG and JSON assets inside image and logo directories are scanned, and inaccessible credential material blocks the gate.
- Content Security Policy validation parses directives and rejects duplicates or ineffective restrictions. Public repository homepage links reject IPv6 literals, including loopback and mapped private addresses. Incomplete source links remain visible to the validator.
- Media review removes an older decoded frame before invoking the decoder. A preview requires a separate destination from a complete capture, preserving the existing receipt. The language boundary checks the actual media and model destinations, including child symlinks.
- RSS abstract parsing preserves escaped scientific inequalities. Existing code, dataset and analysis links survive source-ledger normalization and rewrites.
- The Search Console gate rejects blank or malformed CSV measurements and validates JSON weights, averages, resource types and aggregate consistency. Its advertised npm commands are registered. Fixture success establishes the gate's behavior; it does not establish improved search rankings.

## Review evidence and boundaries

All 31 selected public PRs were checked against primary GitHub author, status, repository and changed-file metadata. Seventeen are merged and fourteen are open across seventeen displayed groups. GitHub's public repository inventory was also reviewed for coverage. Own-fork maintenance and private work are not external contribution counts.

The LigninQC release archive verified its supplied file and source checks and reproduced both cases offline. This establishes package reproducibility within its stated scope, rather than independent experimental or scientific validation. SectionCheck remains synthetic research tooling. Vehicle Lab remains digital engineering work with open physical-validation questions. The drawing/catalog guide remains a recorded workflow with live generation paused.

PR statuses and the GitHub README are reviewed snapshots; the daily statistics refresh does not automatically rewrite their editorial content. Preserve the visible verification date and recheck selected PRs when updating them. Employment descriptions retain the user's existing career record.

## Required verification

Run source validation, build, security and public audit, the full Node/browser suites, the link audit, GitHub feed verification and ClawPatch review before publishing. Keep source rewrites and builds sequential with browser tests. Verify the actual workflow run and resulting public artifacts; a local pass alone does not establish publication success.

The extended regressions cover missing counters, absent store metadata, research-note scope and routing, full metadata batches, primary-feed outages, generated Git commits, superseded publication heads, malformed text, textual image assets, ineffective policies, stale decoded frames, publication boundaries and invalid search evidence. Transactional media/model rollback is also exercised on the actual host. Do not treat these checks as complete external service acceptance or as full-text research review.

An independent finding suggested replacing the root homepage with the built HTML. The root homepage intentionally loads the compiled application through the generated manifest. The completed staged artifact loaded the compiled application and its search controls in Chrome. Verify this contract with the emitted bundle paths and the complete staged artifact; source-file selection alone does not establish a broken homepage.
