# Design system — as built (PX-14, accepted PX-17, 2026-09-09)

Extracted from the running code in PX-14 on Timothy’s “then do the design system stuff”
(open question Q34). **Accepted by Timothy in decision 0075** (“everything sounds good to me”), including the
three token calls recorded there; the section at the end lists what was proposed and is now the record.
The read-only survey that preceded this is `docs/design-system-inventory.md` — it records
what the code looked like before, including the duplication this pass removed.

The extraction was done under a hard constraint: the site had to render pixel-identically
before and after, except for four deliberate changes. See **Parity** at the end.

## Layers

```
  src/app.css                     the cell table + the import list, nothing else
   ├─ lib/styles/primitives.css   raw values: colour, spacing, cells, faces, motion
   ├─ lib/styles/tokens.css       what a primitive means: paper/fg/accent, surfaces, z, gutter
   ├─ lib/styles/base.css         element defaults, .sr-only, @keyframes blink
   ├─ lib/styles/type.css         the named type roles and their ladders
   ├─ lib/styles/chrome.css       sticky header, status strip, global footer
   ├─ lib/styles/layout.css       .site, section, .band, the Grid overlay, .inner-page
   └─ lib/styles/blocks.css       cursor, ctas, quiet link, index row, page foot,
                                  cards, work rows — the CSS half of the components

  src/lib/tokens.ts               the same primitives for JavaScript
  src/lib/components/*.svelte     markup that chooses class names from blocks.css
  src/routes/*                    structure, and only genuinely one-off sizes
```

Import order is the cascade. A component never carries a scoped `<style>` for a shared
block: the CSS lives in `blocks.css` and the component only decides which classes to emit.
That keeps specificity flat, lets a route position a block it owns, and is why the
refactor could be verified pixel-for-pixel. Routes that need to position an element a
component renders reach it with `:global()` anchored on their own `<main>`.

## Layering (z-index)

```
  --z-skip     99   .skip-link
  --z-grid     98   .site.show-grid::after      ← above the nav, on purpose
  --z-nav      50   .nav-chrome (sticky wrapper)
  --z-chrome    2   .site-header, .readout      inside the wrapper
  --z-band      1   a band's content
  --z-band-bg   0   a band's programmatic texture
```

## Tokens

### Layer 1 — primitives (`src/lib/styles/primitives.css`)

| Token | Value | Meaning |
|---|---|---|
| `--yellow` | `#f2d600` | brand primitive |
| `--ink` | `#11110e` | near-black primitive |
| `--white` | `#f4f4f0` | off-white primitive |
| `--yellow-deep` | `#6f6200` | the accent as text on the light ground (5.6:1 on `--white`; 0075) |
| `--u` | `8px` | the spacing unit |
| `--s1 … --s16` | `8 16 24 32 48 64 96 128px` | the spacing scale; the name is the number of units (`--s4` = 4 × 8) |
| `--cell-text` | `var(--u)` | layout and type snap unit |
| `--cell-image` | `2px` | gallery column snap unit (0054); figure heights snap to `--u` since 0089 |
| `--cell-texture` | `16px` | one ASCII cell |
| `--face-blackletter` | `'Jacquard 24',serif` | emphasis words, wordmark |
| `--face-display` | `'PARC Pixel Bold Web',sans-serif` | uppercase display (caps-only face; 13.75 cells/em; 0078) |
| `--face-text` | `'Jersey 15',sans-serif` | body and lead |
| `--face-label` | `'PARC Pixel Web',monospace` | labels, nav, buttons (caps-only; 6.25 cells/em; 0078) |
| `--face-mono` | `'Press Start 2P',monospace` | status strip, arrows |
| `--face-root` | `'Jersey 15',ui-monospace,monospace` | the document fallback stack |
| `--tick-cursor` | `1s` | one blink period |
| `--nudge` | `8px` | hover displacement — exactly one cell |

`--s12` (96) and `--s16` (128) are declared for scale completeness but have no reference:
96 appears only inside `round(down,calc(100vh - 96px),8px)` and 128 only as a line-height,
and both classes of value are deliberately left literal (see **What stayed literal**).
`--cell-image` likewise has no CSS consumer — `rowColumns()` is JavaScript and writes the
`2px` into its `round()` formula. `Picture` and `Clip` floor their heights to `U` (8) through
`src/lib/figure.ts` (0089), so what follows a figure is on the layout grid.

Breakpoints are a comment block, not tokens — CSS media queries cannot read custom
properties. The four in use are `420 700 900 1100` (0075 folded 1300 into 1100 and moved the phone floor from 380 to 420, shared with the status strip).

### Layer 2 — semantic (`src/lib/styles/tokens.css`)

| Token | Dark (default) | Light | Meaning |
|---|---|---|---|
| `--paper` | `var(--ink)` | `var(--white)` | page ground |
| `--fg` | `var(--white)` | `var(--ink)` | type / foreground |
| `--accent` | `var(--yellow)` | `var(--yellow)` | fills: cursors, active nav, action blocks |
| `--accent-text` | `var(--yellow)` | `var(--yellow-deep)` | the accent as type: index range, quiet arrows, quiet-link hover, footer toggle state (0075) |
| `--on-accent` | `var(--ink)` | `var(--ink)` | type on accent |
| `--dim` | `.55` | `.55` | secondary-text opacity (a number, not a colour) |
| `--gutter` | `32px` → `16px` ≤700 | same | page side margin |
| `--header-height` | `64px` | same | default; the layout overrides it inline with the measured height |
| `--surface-card` | `repeating-conic-gradient(color-mix(in srgb,var(--fg) 14%,transparent) 0 25%,transparent 0 50%) 0 0/4px 4px` | | the card dither at rest |
| `--surface-card-hover` | same shape at `26%` and `8px 8px` | | the card dither on hover |
| `--texture-fallback-opacity` | `.35` | | the CSS checker before a canvas has drawn |
| `--field-ink` | `color-mix(in srgb, var(--fg) 40%, var(--paper))` | | the ASCII field’s colour: recessed, well behind the type (0091) |
| `--grid-fine` | `color-mix(in srgb,var(--fg) 12%,transparent)` | | Grid overlay, 8px lines |
| `--grid-major` | `color-mix(in srgb,var(--fg) 22%,transparent)` | | Grid overlay, 64px lines |
| `--z-band-bg … --z-skip` | `0 1 2 50 98 99` | | see the layering diagram above |

Theme is applied by `data-theme` on `<html>`, pre-painted by the inline script in
`src/app.html`, mirrored in JS in `+layout.svelte`. `--accent` and `--dim` do not change
with the theme; `--accent-text` does (0075).

### JavaScript (`src/lib/tokens.ts`)

`INK WHITE YELLOW` · `U CELL_TEXT CELL_IMAGE CELL_TEXTURE` · `TICK_SLOW=160 TICK_FAST=90`
(Ascii ambient cadence) · `STEP_SLOW=110 STEP=70 STEP_FAST=55` (Decode cadence).

Consumed by `Ascii.svelte` (`cell`, `tick` defaults), `Decode.svelte` (`step` default),
`figure.ts` (the 8px height floor for `Picture` / `Clip`), `+layout.svelte` (the `theme-color`
meta tag) and every Decode/Band call site, so no colour or cadence literal is left in a
route. `src/app.html` keeps its own `#11110e` because that script runs before any
stylesheet or module loads; all three places carry a comment naming the other two.

## The typeface build (`tools/fonts/extend-parc-pixel.py`, decision 0078)

PARC Pixel is Timothy's own family from the PARC brand. The site ships its own build in
`static/fonts/` (`parc-pixel.woff2`, `parc-pixel-bold.woff2`; the Light and Mono cuts are
built too but unused), generated from the untouched originals in `../timothyali/static/parc/`:
seven added glyphs (`[ ] · – — ’ ×`) drawn on each weight's grid, the ampersand redrawn in
every cut (the cut's own 3 mirrored, stubs out the top and bottom), and the Bold rescaled to an
1100-unit em so its cell is exactly 80 units and every advance lands on whole pixels at 41.25,
55, 82.5 and 110. One family name per weight (`PARC Pixel Web`, `PARC Pixel Bold Web`) because
each weight has its own cells-per-em. Rebuild with a venv that has `fonttools` and `brotli`.
Fractional font sizes (12.5, 41.25, 27.5) are on the table: the cell is what has to be whole.

## The cell table

Every face is a bitmap design; its em is a known number of cells, so
`font-size = cells per em × cell size` and glyph pixels land on device pixels. The table
lives at the top of `src/app.css` and is the reason font sizes are **not** tokens: a token
would hide the arithmetic.

| face | cells/em | 1 | 2 | 3 | 4 | 6 | 8 |
|---|---|---|---|---|---|---|---|
| Jacquard 24 | 43 | 43 | 86 | 129 | 172 | 258 | 344 |
| PARC Pixel Bold | 13.75 | — | 27.5 | 41.25 | 55 | 82.5 | 110 |
| Jersey 15 | 27 | 27 | 54 | | | | |
| PARC Pixel | 6.25 | — | 12.5 | 18.75 | 25 | 37.5 | 50 |
| Press Start 2P | 8 | 8 | 16 | 24 | 32 | | |

## Type roles (`src/lib/styles/type.css`)

| Role | Face | Ladder |
|---|---|---|
| `.blackletter` | Jacquard 24 | family only, `line-height:1` |
| `.display-xl` | — (always worn with `.blackletter`) | **258/264 → 172/176 (≤1100) → 129/136 (≤700) → 86/88 (≤420)**, `display:block` |
| `.display` | PARC Pixel Bold | 55/56 → 41.25/48 (≤700), uppercase (cell 4 → 3) |
| `.display-s` | PARC Pixel Bold | 41.25/48 → 27.5/32 (≤700), uppercase (cell 3 → 2) |
| `.lead` | Jersey 15 | 54/64 → 27/32 (≤700) |
| `.body` | Jersey 15 | 27/32 |
| `.lbl` | PARC Pixel | 12.5/16, uppercase (cell 2) |
| `.mono` | Press Start 2P | 16/16, uppercase, nowrap |
| `.dim` | — | `opacity:var(--dim)` |

`.display-xl` replaces the three route-local `.xl` copies (Home, Work, Contact).
`.display-l` (123px, never used in any route) is retired.

Route-local sizes that stayed route-local because they are genuinely one-off: `.hero-name`
(344 / 258 ≤1100 / 129 ≤700), the study `.title` (PARC Pixel Bold 110 / 82.5 ≤1100 / 55 ≤900 / 41.25 ≤700 plus the
JS-measured `.small` step-down), Home’s `.para` / `.words` / `.w` and
`.work-statement .blackletter`, and the Work row `h2` step to 41 below 1100.

## Components (`src/lib/components/`)

| Component | Props | Renders | Used by |
|---|---|---|---|
| `Arrow` | `dir='right'\|'left'` | `<span class="mono" aria-hidden>` with `->` / `<-` | Home ×3, Work ×1, study ×2, Contact ×1, and inside `QuietLink` / `PageFoot` |
| `Cursor` | `size='cell'\|'em'`, `color='accent'\|'currentColor'` | `<span class="cursor …">` | `+layout.svelte` status strip (`cell`), `Decode` (`em`, currentColor) |
| `Cta` | `variant='block'\|'row'\|'hint'\|'quiet'`, `href`, `class` | `<a>` when `href`, else `<span>`, class `cta` / `cta-row` / `cta-hint` / `cta-quiet` | Contact (`block`), Home invitation + study next (`row`), Home hero hint (`hint`), Work “View case study”, on both the rows and the index entries (`quiet`) |
| `IndexRow` | `label`, `value`, `accent=false`, `layout='row'\|'column'`, `class` | `<div class="index-row index-row-… lbl">` with two spans | Home `Selected work / 01–04` (`row`), Work `Project index / 01–08` (`column accent`) and `Index 05–08` (`row`) |
| `MetaLine` | `project`, `short=false`, `class` | `<span class="lbl …">` — `[01] / 2024 / Brand`, or `01 / Brand` when `short` | Work row, study head, Home card (`short`). Takes a `Project`; the Work index tier prints the same fields itself, split across the entry’s four columns |
| `PageFoot` | `note`, `href`, `label`, `class` | `<footer class="page-foot lbl dim">` — note left, link + `Arrow` right | Work (`End of index / 008`), the eight studies (`[n] / 008`), Contact |
| `QuietLink` | `href`, `label`, `dir`, `pad=false`, `class` | `<a class="quiet-link …">` with an `Arrow` | study back link (`dir="left" pad`), study “Live” link |
| `Band` | `as='section'`, `class`, `mode seed tick density avoid pad feather flip shade`, children | `<svelte:element class="band …">` + `.band-bg` + `Ascii` | Home hero (`sky`, `shade`, density 1.3), Home work/invitation rain (`as="div"`, `fall`, `shade`), Contact (`fall`, `shade`), the 404 (`sparse`), the share-image route |
| `Ascii` | `mode cell px seed tick density avoid pad feather interactive reach flip shade` | the texture canvas; one accent per mode, `shade` colours by ramp step (0091) | via `Band` only. The same file as GRIDFORM Studio’s `ui/Ascii.svelte`; keep them in step |
| `Decode` | `text mode step delay cursor` | kinetic type + `sr-only` real text | 6 call sites |
| `Picture` | `src x2 alt width height eager sizes row` | a photograph at its own resolution | Home cards, Work rows, study galleries |
| `Clip` | `src label width height row` | a muted looping video | study galleries |

Deleted: `Dither.svelte` and `Ticker.svelte` (unused since PX-04/PX-07; confirmed by grep
that nothing imports them, and both survive in the earlier `source.zip` archives).
Removed props: `Ascii` `fadeIn`/`fadeOut` (with the `edge()` helper — with both at 0 it
returned 1, so removal is exactly equivalent) and `Decode` `pool` / `once` (`pool` became
a module constant, `once` was always true).

Not made into components, because each is used once: the hero name, the study title probe,
Home’s `.work-foot` link, the statement panel, the study intro/gallery/list layouts.

## Chrome (`src/lib/styles/chrome.css`)

The sticky wrapper holds the header and the status strip; heights are literal because they are geometry, not spacing. All are 8px multiples.

| Width | Header | Strip | Strip contents (decision 0072) |
|---|---|---|---|
| > 1100 | 64 | 32 | path · Denver, CO · coordinates · clock · SYS.OK |
| ≤ 1100 | 64 | 32 | coordinates dropped |
| ≤ 900 | 64 | 32 | Denver and SYS.OK dropped; path shows `~/…/<last segment>` |
| ≤ 700 | 104 (48 wordmark row + 8 + 32 nav row, 8 padding each side; decision 0070) | 32 | as ≤ 900 |
| ≤ 420 | 104 | 32 | clock dropped; path alone |

The strip is always 16px Press Start; it never shrinks. Priority classes: `.st-coords`, `.st-city`, `.st-sys`, `.st-clock`; the path carries `.path-full` and `.path-short`. Press Start advances one em per character, so an item's width is 16px × its characters; the steps are what fits with the gutters.

The global footer is one row on desktop (copyright left, the three toggles right). At or below 700px it is a settings list (decision 0073): the toggles first, each a full-width 32px row with the label left and its state right, then the copyright line; 184px in all.

## Block classes (`src/lib/styles/blocks.css`)

`.cursor` (+ `.em`, `.on-fg`) · `.cta` `.cta-row` `.cta-hint` `.cta-quiet` · `.quiet-link`
(+ `.pad`) · `.index-row` (+ `-row` / `-column`,
`.index-value.accent`) · `.page-foot` · `.cards` `.card` `.card-body` · `.rows` `.row`
`.row-body`.

Two hover directions are kept **on purpose** and are now two named roles rather than an
accident: `.cta` / `.cta-row` are primary and light *down* to the foreground colour;
`.cta-quiet` is a label with reserved padding that lights *up* to the accent when its row
is hovered or focused (decision 0065). Only `.cta` also displaces by `--nudge`.

`.rows` / `.row` / `.row-body` are the **selected** tier of the Work page (0074): cover
left, type on the page ground right, 64px between rows, the dither only as a 16px hover
mat around the cover. The **index** tier below it (0077) is route-local CSS in
`src/routes/work/+page.svelte` — `.index`, `.entries`, `.entry`, `.entry-main` — because
only Work has it: a four-column grid (48px number / title + one-line body / year / scope)
that stacks under 900px, with no cover and no hover image. It reuses two shared blocks,
`.index-row` for its `Index 05–08` counter and `.cta-quiet` for “View case study”, and
reaches the latter with `:global()` anchored on `.entry` to repeat the row’s reserved
padding, −16px pull and yellow hover fill.

## The work data (`src/lib/work.ts`)

One `source` array holds every project in display order — the four selected, the four
index entries, then the two hidden ones (0077). `Entry` is what the Work list needs
(`n slug title year scope description tier hidden?`); `Project extends Entry` and adds
`word role timeline? tools live? cover lead hero blocks`. Numbers are never hand-written:
`all` walks the array and gives each visible entry the next `01…08`, hidden ones `--`.

| Export | Is | Used by |
|---|---|---|
| `all` | every item, hidden included | nothing yet; the record |
| `studies` | the eight visible `Project`s, in order | `[slug]/+page.ts` entries and the Next chain 01 → 08 → 01 |
| `projects` | `tier === 'selected'` | Home cards, Work rows |
| `index` | `tier === 'index'` | the Work index list |
| `count` | `004` | Home |
| `total` | `008` | the Work footer and every study footer |
| `last` | `08` | the `01–08` ranges |

`rowColumns(row)` turns a gallery row into aspect-proportional columns snapped to the 2px
image cell. Keep a row to three images or fewer when the images are tall: at an aspect
below about 0.5 the 2px snap plus the `1fr` remainder can push the row’s height spread
past 4px (measured in PX-18).

## What stayed literal, and why

- **Font sizes and line-heights.** They are the cell table; naming them would hide the
  arithmetic that keeps glyph pixels on device pixels.
- **`round(down, …, 8px)` column formulas** and `calc(100vh - 96px)` — grid maths, not
  spacing.
- **Chrome geometry** (`height:64px`, `32px`, `104px`, `grid-template-rows:48px 32px`) and
  grid tracks (`48px 1fr` for the study list numbers) — sizes, not padding/margin/gap.
- **`.para .note`** uses `var(--ink)` / `var(--yellow)` directly, the one deliberate use of
  primitives outside `tokens.css`: the plate must *not* invert with the theme, or yellow
  lands on the white panel again (decision 0067).
- **`src/app.html`’s `#11110e`** — runs before CSS and modules exist.

Everything that is a padding, margin or gap now uses `--s*`; every `z-index` uses `--z-*`;
the cursor blink is `var(--tick-cursor) steps(2,jump-none)` with a single `@keyframes
blink` in `base.css`.

## Parity

`node tools/review/parity.mjs before|after|diff` captures all seven routes at 1440 and 390
in dark, plus Home and Work in light and Home with JavaScript disabled, with motion forced
off, and compares them per pixel. The baseline was captured twice and diffed against
itself: **0 differing pixels on all 17 captures**, so the seeded textures are static and
the comparison is trustworthy. The clock and every `<video>` are masked (see the script
header for why).

Result after the refactor:

| capture | differing | cause |
|---|---|---|
| `home-1440-dark` | **0** | — |
| `home-1440-light` | **0** | — |
| `home-1440-dark-nojs` | **0** | — |
| `home-390-dark` | 64,045 (4.16%) | allowed change 1 + the rain field re-seeding |
| `contact-1440-dark` | 6,584 (0.45%) | allowed change 2 |
| `contact-390-dark` | 57,707 (14.96%) | allowed changes 1 + 3 + the field re-seeding |
| `work-1440-dark` / `-light` | 7,328 / 7,280 | allowed change 2 |
| `work-390-dark` | 3,844 | allowed change 2 |
| the four studies, 1440 / 390 | 7,328 / 3,844 each | allowed change 2 |

The four allowed changes:

1. **`.display-xl` ladder unified on Work’s** (129 at ≤700, 86 at ≤380). Home and Contact
   previously dropped straight to 86 at ≤700, so “building.” is larger between 381 and
   700px on both. Above 700 and at or below 380 nothing changes.
2. **`.page-foot` arrows render in Press Start**, like the seven arrows everywhere else,
   instead of Silkscreen. Measured: the footer line box goes 16px → 18px and the link
   334px wide instead of 322px, so the whole link shifts left and the page grows 2px. This
   is the only change on Work, the studies and Contact at 1440.
3. **Contact’s section padding drops to 48 at ≤700** like every other route (it was the
   one route that kept 64).
4. **Decode’s cursor is now `Cursor.svelte`.** Cost **0 pixels**: the component keeps the
   em-sized geometry (`.14em × .4em`, `margin-left:.05em`, currentColor) that the 344px
   hero name needs. An 8×16 block at that size would have been a 48px-wide caret; the
   two sizes are one component with a `size` prop rather than two implementations, and
   there is now one `@keyframes blink` instead of two.

Changes 1 and 3 alter a band’s height, and `Ascii`’s `fall` field is a function of the
canvas row count, so the texture re-seeds through the whole band. That is the bulk of the
two 390px diffs; it is a consequence of the size change, not a separate one.

## Decisions taken as proposals (accepted in 0075)

Proposed in PX-14 as the assistant’s reading of “tokens for color type etc. components we
can reuse etc.”; Timothy accepted the set on 2026-09-09.

1. **The five-file style split and its order** (primitives → tokens → base → type → chrome
   → layout → blocks), with `src/app.css` reduced to the cell table and an import list.
2. **The token names**: `--s1 … --s16` for spacing (name = number of units), `--cell-*`,
   `--face-*`, `--surface-card*`, `--grid-fine` / `--grid-major`, `--z-*`, `--tick-cursor`,
   `--nudge`, `--texture-fallback-opacity`.
3. **`--header-height` gets a declared default of 64px**; the layout still overrides it
   inline with the measured height.
4. **`.display-xl` unified on Work’s ladder** (allowed change 1) — Home and Contact get
   larger type between 381 and 700px than they had.
5. **`.page-foot` arrows move to Press Start** (allowed change 2) — costs 2px of page
   height on five pages.
6. **Contact’s ≤700 section padding drops 64 → 48** (allowed change 3).
7. **Two CTA hover directions are kept as two roles**, not unified: primary blocks light
   down, the quiet label lights up (0065).
8. **One `Cursor` component with two sizes**, rather than one size everywhere.
9. *(Superseded by 0074: `Plate` is gone; Work rows have no surface or plates. The dither survives only as a hover mat around the cover, drawn by `.row .frame`.)*
10. **`.display-l` retired**, `Dither.svelte` and `Ticker.svelte` deleted, `Ascii`
    `fadeIn`/`fadeOut` and `Decode` `pool`/`once` removed.
11. **Font sizes stay literal** rather than becoming tokens.
12. *(Settled by 0075: the counter is read on both pages; `valueHidden` is gone.)*
13. **Routes reach component-rendered elements with `:global()`** anchored on their own
    `<main>` rather than moving page composition into the shared layer.

Settled in 0075: `--accent-text` carries the per-theme value for type; the breakpoints are
420 / 700 / 900 / 1100. Still open: a `/system` specimen page, accepted in principle and
deferred (Q37).

## PX-22 Home refinement (proposal, 2026-09-10)

The accepted primitives, semantic tokens, shared type roles and components remain intact.
Home cards now use 32px column / 48px row gaps, grid-snapped columns, a dither image mat
and solid captions, with matching hover/focus feedback. Their title steps to 27.5/32
through 900px. Home’s local work introduction uses 27.5/40 on phones. The quiet All work
and yellow Contact action align to the right column, becoming full width below 700px.
A `.home-footer` variant aligns the utilities to the gallery grid, stacks below 1100px,
and retains the mobile settings list with 48px rows. State labels use `--accent-text`;
hover/focus invert both label and state together. Other routes’ footer geometry is unchanged.
See decision 0081 and PX-22 for the proposal status and verification evidence.

## Staying on the unit (0089)

The audit that followed the launch (`tools/review/gridcheck.mjs`, `blocks.mjs`) found the
type crisp everywhere but the *layout* drifting off the 8px unit after certain blocks. The
rules that came out of it, all now in the CSS with a `(0089)` comment at the spot:

- **Jacquard line boxes round up to the unit.** Its sizes are 43 × cells (86, 129, 172, 258)
  and never a multiple of 8, so a block-level blackletter carries a line-height of the next
  unit (264, 176, 136, 88); 344 is 8 × 43 and needs nothing. The glyph lands 2–4px below the
  box top, on whole pixels. The inline uses keep `line-height:1`.
- **Mixed faces on one line: only one box sets the line.** Two faces baseline-aligned in the
  same line put their boxes at different offsets, and the line grows to their union (88 became
  97, 64 became 65, 16 became 20). The fix is per case: an inline Jacquard word in a caps
  line gets `line-height:0`; an inline sentence in a block that mixes roles sits on the line
  top (`vertical-align:top`); a `.mono` arrow or value in a `.lbl`/`.body`/`.display`/`.lead`
  line sits on the line top, where a flex `Cta` would put it anyway.
- **Figures floor to the unit.** `Picture` and `Clip` set their height to `floor(w × aspect / 8) × 8`
  (`figure.ts`), and a multi-image gallery row passes `row={{total, n}}` so every figure takes
  the same row height and neighbours cannot step. `object-fit: cover` hides the ≤7px crop.
- **No `space-between` over bitmap text.** Leftover width split n ways lands items on
  fractions of a pixel; the status strip has one `margin-left:auto` gap instead, and the
  stacked nav sizes its first two thirds with `round(down, …, 2px)` and lets the last one
  centre inside an even grid track.
- **Cursor `em` is measured in cells** (`calc(6em / 43)` wide, `17em / 43` tall, `2em / 43`
  in) so it is whole pixels at every step of the name's ladder.
- **Nothing hangs from an off-unit edge.** The 534px share frame is chrome geometry; its
  content is placed from the top, and the study row's centring is rounded to the unit in JS.
- **Right-aligned blocks** (`margin-left:auto`) are on whole pixels but not on the unit when
  the content width is not — at 1100 or 390 nothing right-aligned can be. Accepted.
- **The wordmark stays 43/43** inside the fixed 64px header; nothing flows after it.

## The field (0091, proposal)

The ASCII field draws in its host’s colour, and `.band-bg` sets that to `--field-ink`
(40% of `--fg` over `--paper`), so every field sits behind the type in both themes.
Each mode has one thing that draws in `--accent-text`: the rain’s `0` droplet head, the
scan line, a band’s crest, the noise’s and the sky’s densest cells; pointer heat above
0.5 and the click ring light the same way. With `shade`, each ramp step has its own
colour — the top step the accent, the rest mixing the field colour toward `--paper`
from 8% (heaviest) to 100% (lightest) in oklab, resolved through a probe element
because a canvas fill needs a resolved colour. `shade` is on for the hero sky (density
raised to 1.3 to reach its top steps), the Home and Contact rain and the share-image
bands; scan stays flat (its accent is the line) and so does the 404’s `sparse`.
`src/lib/components/Ascii.svelte` and GRIDFORM Studio’s `src/renderer/src/ui/Ascii.svelte`
are the same component; a change to one goes to the other.

Form fields (Contact) hide the native caret and show the `.cursor` block at the
insertion point through the `blockCaret` action in `src/lib/caret.ts`; validation is the
form’s own, as `.lbl` note chips in the accent under the field (0092).

