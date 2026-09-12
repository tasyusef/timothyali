# Review scripts

Node scripts used to check the site during iterations. All expect a static server on
port 4173 serving `build/` (`python3 -m http.server 4173 --directory build &`) unless
they start one themselves (seam, diag, interact, perf, cool spawn their own on 4173/4199).
Route lists were extended in PX-18 (decision 0077) from four case studies to eight — `gridcheck.mjs`, `titles.mjs`, `work.mjs`, `overflow3.mjs` and `parity.mjs`’s `ROUTES` all now cover `parc xrpcafe firstledger do-androids-dream firststrike sonde parc-site jade-aesthetics`. A parity baseline captured before that change has no `before` image for the four new routes, and `diffAll` iterates the `before` directory, so they are simply absent from the table.
They use the Playwright headless shell at
`~/Library/Caches/ms-playwright/chromium_headless_shell-1234/.../chrome-headless-shell`.
Run from the project root; output goes to `tools/review/out/` (git-ignored).

- `audit.mjs` — full-page captures of Home/Work/Contact at 1440 and 390, reduced-motion and no-JS renders, grid-overlay shot, overflow/error checks, crispness of solid type.
- `gridcheck.mjs` — the pixel-grid audit at 1440/1100/700/390 over the twelve routes and `/not-found.html`: every font size on the cell table (and every family in it), every text box on integer pixels, every canvas on a multiple of its cell relative to the page, and every padding/margin/gap a multiple of 8 (the `sr-only` −1 margins, the status strip's and the invitation CTA's `auto` margins and the `em` cursor at 258/129 are the expected leftovers). Home crispness as intermediate-pixel %.
- `blocks.mjs` — the layout-rhythm audit (0089): every block/flex/grid element inside `main` whose top edge is not a multiple of 8, per route and width. Expect `0` on every line.
- `interact.mjs` — pointer hover / click / cooldown check on the hero texture in both motion modes.
- `perf.mjs` — frame-loop rate and longest frame gap while hovering with all bands live.
- `seam.mjs`, `diag.mjs` — crops of the invested/looks seam and of the diagram/copy block (historical: both went in PX-07).
- `light.mjs`, `theme.mjs`, `toggle.mjs`, `cool.mjs` — light-theme captures, toggle persistence, live toggle check, cooldown check.
- `work.mjs` — captures of the Work index and the eight case studies at 1440 and 390 (900 for one), with overflow/error checks, title box, video element and canvas state, image readiness and broken-image list.
- `titles.mjs` — case-study title width against the available width at 1440/1100/900/390/375/320, plus the largest height spread inside any multi-image gallery row.
- `px18.mjs` — PX-18 captures: the Work page and the four new studies at 1440 and 390, full page, with page height, error count and broken-image list.
- `video.mjs` — does the Clip video advance while visible with motion on, and hold with motion off?
- `overflow3.mjs`, `dad.mjs` — header overflow at 900–1100 on the long-slug study; region crops of Home, Work and the studies after 0055.
- `overflow.mjs`, `overflow2.mjs` — which elements widen the page at intermediate widths.
- `crops.mjs`, `study-extra.mjs` — region crops, light-theme and no-JavaScript captures of the case studies.
- `parity.mjs` — the PX-14 pixel-parity harness. `node tools/review/parity.mjs before` captures all seven routes at 1440 and 390 in dark, plus Home and Work in light and Home with JavaScript disabled, into `out/parity-before/`; `… after` does the same into `out/parity-after/`; `… diff` (or no argument) compares them and writes a red-on-grey diff image per differing capture into `out/parity-diff/`. Motion is forced off (`localStorage['tim-motion']='off'` via `addInitScript`, plus `reducedMotion:'reduce'`) so the seeded ASCII/Decode textures draw one static frame and the run is deterministic — verify that by capturing twice and diffing before trusting a baseline. Two regions are masked as inherently non-deterministic: the clock in the status strip, and every `<video>` (`figure.clip`), whose page-space boxes are recorded in a `.json` sidecar beside each PNG during capture. The compare is plain per-pixel RGBA equality on the union of the two canvases (pixelmatch is not a dependency; pngjs is), so a page that got taller reports the added rows plus whatever moved, and the table prints the topmost differing row.
- `fields.mjs` — band crops for the field treatment (0091): the hero, the Home rain, Contact and the 404 at 1440 in both themes and at 390, motion off, into `out/fields-<before|after>/`.
- `tactility.mjs` — the tactility pass (0099–0107): the theme and route wipes and an image's arrival with their animations paused and seeked to fixed times (frames in `out/tactility/`), the press state under a held mouse button on seventeen controls, the focus ring's colour on both grounds in both themes, the readout's path decoding after a navigation and its scroll offset, the field cursor, the strip's height with a Decode in it, and the motion-off paths, which must be instant. Exits 1 on any failure.
- `caret.mjs`, `validate.mjs` — the Contact form’s block caret (position, size, blink per theme and motion mode) and its validation notes (empty submit, bad address: notes, focus, aria wiring, no POST), captures into `out/caret/` (0092).
- `px13.mjs` — PX-13 review fixes: `.who` discipline plates at 1440 in both themes with measured WCAG contrast (text vs plate, plate vs panel), the Work header at 390 and 360 with its box geometry and line counts, and the tall Work rows at 1440 with the body-to-CTA gap.

Fonts: `tools/fonts/extend-parc-pixel.py` builds `static/fonts/` from the old site's PARC Pixel cuts (decision 0078). Needs a venv with `fonttools` and `brotli`. `gridcheck.mjs` knows the two PARC Pixel faces (6.25 and 13.75 cells/em).
