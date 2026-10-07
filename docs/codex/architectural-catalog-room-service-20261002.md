# Architectural catalog: furnished fit and general-document service

Availability update, 7 October: live generation is paused. The portfolio now
links to the [static 3D guide](https://zack-dev-cm.github.io/docs/architectural-catalog/)
and film. The service description below records the implemented October 2 flow.

The general document workspace implemented drawing and catalog intake as bounded PDF/PNG/JPEG documents. Viewing an example or validating uploads starts no provider task; Run project admits an owner-scoped Codex Mode 1 CLI task using gpt-6.1-sol with max reasoning and built-in ImageGen. Live generation is currently paused; the public project links to the working 3D guide and recorded film.

## Real source examples

The Case Systems set uses actual annotated elevation pixels and the recovered 306-page catalog. It retains the W0100/W2052 revision conflict and other observed groups. The IKEA set uses the official ENHET buying guide and A208 / 094.442.67 dimensioned combination. Herman Miller OE1 uses its official product sheet and technical drawings. The latter two drawing inputs derive from their catalog documents; they are not independent measured room plans. Available-room constraints and surrounding furnishings are authored concepts.

Three genuinely completed runs were promoted with unchanged source and producer receipts: Casework 1452.74 s, ENHET 988.15 s, OE1 1398.70 s. These are individual runs, not performance averages. The ENHET run was admitted from real new PDF uploads through the public UI. All new results include source extraction, all catalog candidates, independent three-axis nominal fit, review, an actual new furnished-room image and a validated ZIP/CSV/JSON handoff. Quantities, prices and installed dimensions remain unresolved without evidence.

The Mac agent owns page selection, matching strategy, review and rendering. Its trusted tools validate original hashes, quotations, units, coordinates and phase receipts. Post-exit validation repeats those checks. The Hypnos API independently validates source identities, result/request equivalence, fit arithmetic, configured agent model and complete artifact hashes before publishing. It loads no GPU model and uses its own reverse SSH and Cloudflare route. New projects have a bounded 30-minute CLI deadline; legacy B3000/B3100 jobs retain their earlier deadline.

## Furnished 3D fit

The default 36-inch B3000 is aligned with a 914.4 mm nominal bay between neighboring 24-inch cabinets under a continuous counter. The cabinet bottom meets the floor and its 863.6 mm top meets the counter underside. Wider openings gain explicit infill; an oversized selection stops in front of the opening and displays the actual width shortfall. Match bay to cabinet demonstrates exact nominal placement for each reviewed width and family.

`room-context.js` adds neighboring base storage, upper cabinets, worktable/chairs and a courtyard through the window. Room furnishing is illustrative. Staged revelation, camera framing, insertion alignment and blocked drawer behavior explain the process without physical intersections. The same procedural scene drives the 64-second 1,536-frame film, preview, stills and exported model.

The frozen source set includes room-context.js and remains hash-pinned to the regenerated capture. Full film SHA-256: f4608474fd119e35c996eb94fbec39cf24eb954afd1e7149491faa2c08341dc5. Preview SHA-256: daff2f20000d2305b257a42f47bd6d607e809dc885fbf23b715eb119a2a013eb. Re-encode after changing any captured scene input.

## Verification and release lessons

The portfolio passed 54 Node preflight checks and 95 browser tests, including exact bay alignment for both families and five widths, real floor/counter contact, infill continuity and blocked insertion. The encoded composition review checked 640 samples and responsive/decoded frames. Independent visual review inspected the actual film, loop, JPEGs and mobile scenes; all 13 reviewed media outputs cleared its editorial gate. These visual scores do not certify installed geometry.

The service passed 29 regression tests, 60 public phase views for the three new examples, 40 legacy phase views and actual uploaded-result/source/reload/ownership checks. An independent critic found and prompted fixes for stale example identity, completion marks, completed-example reload, mobile room opening, tiny SVG labels, fit uncertainty by the room image, staged filenames, phase rail visibility and keyboard focus.

A real public Download click exposed ZIP files retaining the producer's private 0600 mode after showcase promotion. Promotion now sets public files to 0644 and directories to 0755. Deployment normalizes allowlisted release permissions and tests readability as the actual isolated service user before activation. Ordinary public ZIP clicks now download all three source-free, hash-verified archives.

The four protected CAD configurations and service PIDs, three CAD tunnel PIDs and GPU process count were unchanged across this release. Private traces, browser credentials, original documents and review screenshots stay outside the public portfolio and Git history. The Russian project explanation was delivered separately as a native Google Doc; its private URL is not part of this public page.
