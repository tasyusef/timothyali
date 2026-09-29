# PX-53 — Sonde from its originals (2026-09-28, 0138)

Timothy's “Yeah do it” to three changes shown on one sheet (`before-after-retina-and-phone.jpg`):

1. **Sharper.** The site's Sonde screens were 1600px copies of 2560×1440 captures he kept on his Desktop (`~/Desktop/sonde-screenshots`, 9 July 2026, taken while the app was live; the copies differ from the originals by under one grey level on average). Every crop is now cut from the originals, 1.6 times the resolution, so the 904px screen column is sharp on a 2× display (`1440-2x-*.jpg`).
2. **Phone crops.** Eleven screens carry a tighter crop of the same screen, served at ≤700px through a `<picture>` source (`Picture`'s new `phone`), so a phone shows the score panel, the balance or the order book at a readable size (`390-2x-*.jpg`). Measured: desktop downloads the 12 wide cuts and no phone crop; a phone downloads 11 phone crops and the pricing page, and no wide cut. Every figure height is a multiple of 8.
3. **Three more screens**, each beside the paragraph that describes it: a token page (Sologenic), the ledger view with its colored transaction tags, and the pricing page in July 2026 under the Outcome, captioned with its date because it describes a free explorer where the Outcome says paid tools (Q43).

Checks: `pnpm check` 0/0, `pnpm test` 24, build, `social:verify` 18 pages, `navigation.mjs` PASS, grid audit 52/52 (Home, Work, Contact, 404 and all nine studies at four widths), no overflow on 13 routes at five widths, Work row titles fit at 16 widths.
