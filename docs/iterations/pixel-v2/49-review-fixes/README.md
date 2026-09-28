# PX-49 — Review fixes (2026-09-23, 0129–0131)

Timothy asked for a pass over the whole site, every case study, the résumés and the cover letters. Three read-only Opus reviewers (content, layout, résumé and letters) and the session assistant reviewed; every claim was checked before it was acted on. The full review is private, beside the résumé source (0115). This folder records the site side.

## Before and after

| | before | after |
|---|---|---|
| PARC, desktop 1440×900 | 22.6 screens, 39 images | 17.2 screens, 33 images |
| PARC, phone 390×844 | 31.7 screens | 22.8 screens |
| Jade, desktop | 11.0 screens, a 3,552px run of screenshots | 5.9 screens, longest image run 1,216px |
| Jade, phone | 14.9 screens, a 4,648px run | 8.0 screens, longest run 1,264px |
| xrp.cafe, phone | 11.1 screens | 9.0 screens |
| Do Androids Dream?, desktop | 4.8 screens | 4.0 screens |
| Sonde, desktop | 7.5 screens | 6.6 screens |
| Pocketwatch, desktop | 7.1 screens | 6.5 screens |
| Nav at 720 / 768 / 776 | 57 / 9 / 1px sideways scroll | none |
| Videos with motion off | blank first frames; the xrp.cafe file (8.7 MB) and the After Darc loop fetched on load | a chosen poster frame; nothing fetched until a clip plays |

Pairs in `before/` and `after/`: the PARC earlier direction (now in the paragraph column), the PARC typeface gallery (two rows), Do Androids Dream? and xrp.cafe with motion off (posters), Jade's phone captures at 390 (two to a line instead of one per screen), and the header at 768. `after/1440-parc-reaction.png` shows the two quotes beside the logo reveal instead of at the end. The before captures are the layout reviewer's, from the pre-change preview.

## Checks

- `pnpm check` 0 errors, 0 warnings; `pnpm test` 24 passed; `pnpm build`; `pnpm social:verify` PASS (17 pages; six share images regenerated with `OG_PORT=4180`).
- `tools/review/blocks.mjs`: 0 block tops off the 8-grid at 1440, 1100, 700 and 390 on its seven routes; the same audit on Jade, Do Androids Dream?, First Ledger, FirstStrike, Pocketwatch and PARC: 0.
- Phone rows at 390: every figure in a line the same height (Jade 170×368, PARC phones 170×360, PARC squares 170×168, xrp.cafe booth 170×224).
- Two-line small titles at 390 (JADE / AESTHETICS, FIRSTSTRIKE / RESEARCH): 64px, two 32px lines.
- Do Androids Dream? with motion on plays the new silent file, 41.25 s, from the poster.
- The only console errors on the preview are the analytics endpoint answering 403 locally.
