# PX-105: the overnight review's fixes (0207)

The review is in `docs/reviews/2026-10-14-overnight-review.md`, with the four full reports in `2026-10-14-reports.md`. Every item was done except 23 (subsetting Jacquard). For 30, Timothy picked option 2.

## Measured against the live site (PX-104), production build, Chrome

**Idle main thread** (motion on, 8 s, 4× CPU):

| Page | Before | After |
|---|---|---|
| Home 1440 | 37.2% | 25.0% |
| Home 1440, mid-page | 34.4% | 23.1% |
| Home 390 | 12.6% | 7.7% |
| Contact 1440 | 14.7% | 8.7% |
| PARC 1440 | 35.6% | 16.7% |

- Home's phone canvas went from 5.2 to 1.3 Mpx.
- Off screen, a study page's loop makes 0 frame calls in 2 s (before: 60 a second).

**Brotli size by page** (JS / CSS):

| Page | JS | CSS |
|---|---|---|
| Home | 77.8 → 76.6 KB | 18.4 → 8.8 KB |
| Contact | 76.1 → 58.1 KB | 18.3 → 8.7 KB |
| Toolbox | 86.0 → 71.7 KB | 21.1 → 11.5 KB |
| Work | 75.9 → 74.7 KB | 17.7 → 8.1 KB |
| Sonde | 79.8 → 78.4 KB | 18.6 → 9.0 KB |

**Images and video:**
- Work page images on a 2× desktop: 847 → 355 KB (cards now take the 1280 rung).
- WebP derivatives total: 27.5 → 24.5 MB (screens at q80; `webp-q90-over-q80.png` is a 2× crop of one).
- The desktop xrp.cafe video: 8.7 → 0.79 MB.

## Checks

**Pixel identity:**
- `tools/review/parity.mjs`: 37 captures before and after the cleanup, 0 pixels differ. The run now covers the Toolbox, tool, CLI & MCP and 404 pages too.
- Home and Contact at 2× and 3× are pixel-identical to live with the 1× canvas.
- PARC and FirstStrike differ only inside photographs (the new encode and rung).

**Policy, metadata and audits:**
- CSP: 0 violations on 20 pages at 1440 and 390.
- Client navigation updates the title, description, canonical and JSON-LD, and the beacons go to `/api/analytics` with no redirect.
- `pnpm check`, `pnpm test` (24), `pnpm seo:check` (with a new duplicate-title check), `pnpm social:verify` and `tools/review/px61.mjs` all pass.

**Share images:**
- Regenerated. Pocketwatch's title had gone too big, an 0206 regression: with PARC Pixel inlined, the probe measured before the face was laid out. It is fixed.
- The two study images also pick up scene changes made since PX-88 (`share-images-before-after.png`).
