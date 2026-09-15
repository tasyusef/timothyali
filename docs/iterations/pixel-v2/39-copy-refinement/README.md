# PX-39 — Copy refinement and Toolbox 1.1.0

## Editorial changes

- All nine case studies: shorter headings, direct first-person descriptions, specific design decisions. Preserved the PARC rowboat joke and attributed testimonials.
- Removed commercial growth/retention claims where the available material did not establish the result or its relationship to the design. Removed a blanket claim about Framer’s HTML and an unsupported Lighthouse score. No replacement metrics were invented.
- Toolbox: practical input/output descriptions and pasteable CLI/MCP examples. Structured colors, variation settings, custom roles, previews, inspection, and saved-library actions are documented. The 47 option rows are generated from the app catalog.
- Contact/404: direct recovery instructions. Home: shorter introduction, with the existing 27.5px whole-cell type size below 420px to fix long-word overflow at 320px. Metadata and social images follow the updated prose.
- Windows downloads and setup removed at Timothy’s request. Current release targets macOS and Linux.

## Evidence

`before-source.tar.gz` preserves the starting source; `base-commit.txt` records its commit. `before-copy.md` and `after-copy.md` provide a prose comparison. Browser results and representative screenshots are stored beside this file.

## Verification

- Site Svelte check: zero errors and warnings. Production build passed.
- Browser: 57 route/viewport checks passed at 1440, 390 and 320px, with no page errors or overflowing prose. Contact validation was checked without sending a message.
- Toolbox demos: 48 tool/theme/width states, keyboard controls and no-JS links passed.
- Social verification: 18 pages and images, unique absolute metadata, JSON-LD, sitemap and favicon passed.
- App: 204 unit tests, both golden export fixtures, and 34 real CLI/MCP checks passed on macOS and Linux. The Linux run caught and fixed a missing SVG MIME type; its display wrapper’s combined output and leftover child process were also corrected in the test harness.
- macOS packages signed and notarized; Linux deb archives contain control and data payloads. Release asset checksums are verified against GitHub’s uploaded digests before publication.

Publication was explicitly requested by Timothy. The editorial choices remain the assistant’s implementation of that request.

## Publication

- Toolbox 1.1.0: https://github.com/tasyusef/toolbox/releases/tag/v1.1.0
- Final app CI: https://github.com/tasyusef/toolbox-app/actions/runs/35002034693 (test and parity successful).
- Eight macOS/Linux artifacts plus SHA256SUMS; all uploaded digests match the local files. No Windows artifact.
- Source includes the SVG decoding fix; public download repository contains no private application source.

- All nine public release URLs returned HTTP 200. A real export from the signed packaged macOS app produced six palette files with custom print colors.
- Site commits were pushed to `master`. At the publication check, Vercel had not created a new deployment and production still served `b272f40` / Toolbox 1.0.0. Direct deployment awaits Vercel sign-in; the CLI and in-app browser were signed out. Do not treat the Git push alone as production verification.

- Resolved: Vercel picked up the subsequent push without a sign-in. Production deployment `HdGaDSAne6g72MxXPC8xDH16X3Ax` succeeded for `9ab80ef`. Live browser verification showed Release 1.1.0 and macOS/Linux downloads only. The live CLI/MCP guide includes the new structured options and library actions; PARC and Sonde serve the revised study copy.
