# PX-52 — Studies in layout B (2026-09-28, 0136)

Timothy's pick from the PX-51 mocks: “b and plain”. All nine studies now run as points (a text block and the galleries after it), the text in the left third held in view beside its captioned screens on desktop, above them below 900px, and the reading text in a system sans at 20/32.

`before/` is PX-50 (committed `b4832e1`) on the local preview, `after/` this build; both from `node tools/review/px52.mjs <origin> <outdir>` at 1440×900 and 390×844, motion off, dark: the first screen (`*-fold.jpg`), the whole page scaled down (`*-page.jpg`, a quarter on desktop, half on a phone), and `lengths.json`.

## Page length, in screens

| Study | desktop before → after | phone before → after |
|---|---|---|
| Sonde | 6.7 → 7.1 | 7.3 → 7.7 |
| Pocketwatch | 6.6 → 5.6 | 9.8 → 9.3 |
| Toolbox | 4.4 → 3.7 | 5.9 → 5.3 |
| PARC | 17.2 → 11.8 | 22.8 → 20.2 |
| First Ledger | 7.2 → 5.6 | 7.6 → 6.7 |
| xrp.cafe | 6.4 → 4.6 | 9.0 → 8.3 |
| Jade Aesthetics | 5.9 → 4.7 | 8.0 → 7.0 |
| FirstStrike Research | 6.5 → 5.0 | 6.5 → 5.9 |
| Do Androids Dream? | 4.0 → 3.5 | 5.3 → 4.7 |

Sonde grows because its screens are now cropped to the app's content and shown larger; every other study is shorter because its screens sit beside their text.

## Checks

- `pnpm check` 0 errors, 0 warnings; `pnpm test` 24 passed; `pnpm build` (no mock route in the output); `pnpm social:verify` PASS, 18 pages; `tools/social/navigation.mjs` PASS.
- Grid audit (`tools/review/blocks.mjs` over Home, Work, Contact, 404 and all nine studies at 1440, 1100, 700 and 390): 0 block tops off the 8-grid on 52 of 52. The first run found each study's Live or Source arrow 4px off: `.read` joined the roles whose inline arrow sits on the line top, and the meta values moved from the mock's 16/24 to 20/32.
- Overflow sweep, 13 routes at 320, 390, 768, 1024 and 1440: none. The only console error is the analytics endpoint's 403 under `vite preview`.
- Held text: at 1440×900, 31 of 32 point texts with screens stay in view while their screens scroll (PARC's “The website”, 872px, is taller than the space under the chrome and scrolls with the page); at 1280×720, 27 of 32.
