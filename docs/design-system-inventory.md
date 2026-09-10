# Design-system inventory — 2026-09-09

Read-only pass over `src/`, `docs/decision-log.md`, `docs/alternate-v2.md`, `AGENTS.md`, `README.md`, commissioned when Timothy said he wants to “start building out the design system. tokens for color type etc. components we can reuse etc.” (open question Q34). Line references are as of the PX-12 state; three spots (`.para .note`, `.work-header`, `.row-body`) were being edited in PX-13 at the same time and may have moved. Section 8 is a proposal, not a decision.


Paths below are relative to `/Users/twocakes/Desktop/PROJECTS/timothyali2/`.

## 1. Tokens already defined

All live in one declaration, `src/app.css:15`.

| Token | Value | Meaning |
|---|---|---|
| `--yellow` | `#f2d600` | brand primitive |
| `--ink` | `#11110e` | near-black primitive |
| `--white` | `#f4f4f0` | off-white primitive |
| `--u` | `8px` | spacing unit — **declared and never referenced anywhere** |
| `--gutter` | `32px` | page side margin; → `16px` under 700 (`app.css:109`) |
| `--paper` | `var(--ink)` | semantic ground |
| `--fg` | `var(--white)` | semantic type/foreground |
| `--accent` | `var(--yellow)` | cursors, active nav, action blocks |
| `--on-accent` | `var(--ink)` | type on accent |
| `--dim` | `.55` | secondary-text opacity (a number, not a colour) |
| `--header-height` | — | **never declared in CSS**; injected inline at `+layout.svelte:60`, consumed at `app.css:42` with no fallback |
| `--cols` | — | per-row gallery template, set inline at `[slug]/+page.svelte:26` from `rowColumns()` |

Light theme (`app.css:17`) swaps only two: `--paper:var(--white); --fg:var(--ink)`. `--accent`/`--on-accent` are identical in both themes, so accent contrast flips from 4.5:1-ish on dark to yellow-on-ink on light without adjustment. `--dim` also does not change. Theme is applied by `data-theme` on `<html>`, pre-painted by the inline script at `app.html:8`, mirrored in JS at `+layout.svelte:26-27`.

## 2. Hard-coded values that should be tokens

### Colours
| Value | Count | Sites |
|---|---|---|
| `#11110e` | 4 | `app.css:15`, `app.html:7` (`theme-color`), `+layout.svelte:26`, `Dither.svelte:20` (JS default) |
| `#f4f4f0` | 2 | `app.css:15`, `+layout.svelte:26` |
| `#f2d600` | 1 | `app.css:15` |
| `color-mix(in srgb,var(--fg) 14%…)` | 1 | `app.css:89` card surface |
| `…26%…` | 1 | `app.css:90` card hover |
| `…12%…` | 2 | `app.css:101` grid overlay 8px lines |
| `…22%…` | 2 | `app.css:101` grid overlay 64px lines |

Four distinct texture opacities (14/26/12/22 %) with no name. `opacity:.35` twice (`Ascii.svelte:113`, `Dither.svelte:81` — the pre-draw checker) is a fifth.

### Font families — 5 stacks, 9 declarations, all in `app.css:16,26,27,28,29,30,31,32,33`
`'Jersey 15','Silkscreen',ui-monospace,monospace` (root) · `'Jacquard 24',serif` · `'Jersey 25','Jersey 15',sans-serif` (×3) · `'Jersey 15',sans-serif` (×2) · `'Silkscreen',monospace` · `'Press Start 2P',monospace`. Imported at `+layout.svelte:2-6`.

### Font-size / line-height pairs actually used
| size/lh | face · cells | Count | Sites |
|---|---|---|---|
| 344/344 | Jacquard ×8 | 1 | `+page.svelte:48` `.hero-name` |
| 258/258 | Jacquard ×6 | 4 | `+page.svelte:64` `.xl`, `+page.svelte:71` `.hero-name` @1100, `work/+page.svelte:34` `.xl`, `contact:20` `.xl` |
| 172/172 | Jacquard ×4 | 4 | `[slug]:71` `.title`; `.xl` @1100 in `+page:71`, `work:47`, `contact:25` |
| 129/128 | Jacquard ×3 / lh off-table | 3 | `+page.svelte:57` `.words`, `:58` `.para .w`, `:74` `.hero-name` @700 (129/129), `[slug]:89` `.title` @1100 (129/129), `work:49` `.xl` @700 |
| 123/123 | Jersey 25 ×3 | 1 | `app.css:28` `.display-l` |
| 86/86 | Jacquard ×2 | 8 | `+page:61,71,77,78,80`, `work:50`, `[slug]:73,90`, `contact:26` |
| 82/82 | Jersey 25 ×2 | 4 | `app.css:27` `.display`, `app.css:110` `.display-l`@700 |
| 82/128 | Jersey ×2, lh off-em | 2 | `+page.svelte:55,56` `.para`, `.para .display` |
| 54/64 | Jersey 15 ×2 | 1 | `app.css:31` `.lead` |
| 43/43 | Jacquard ×1 | 4 | `app.css:48,112` `.wordmark`; `+page:80`; `[slug]:90` |
| 41/41 | Jersey 25 ×1 | 5 | `app.css:29` `.display-s`, `app.css:110` `.display`@700, `work:46` `.row-body h2`@1300 |
| 41/64 | Jersey ×1, lh off-em | 1 | `+page.svelte:77` `.para`@700 |
| 32/32 | Silkscreen ×4 | 1 | `work/+page.svelte:33` `.header-index .range` |
| 27/32 | Jersey 15 ×1 | 3 | `app.css:16` root, `app.css:30` `.body`, `app.css:110` `.lead`@700 |
| 16/16 | Silkscreen/PressStart ×2 | 3 | `app.css:32` `.lbl`, `:33` `.mono`, `work:49` `.range`@700 |
| 8/16 | Press Start ×1 | 1 | `app.css:116` `.readout`@700 |
| 86/96 | off-em | 1 | `+page.svelte:77` `.words,.para .w`@700 |
| 86/inherit | — | 1 | `+page.svelte:61` `.work-statement .blackletter` |

Every **size** is on the cell table. Three **line-heights** are not em-multiples of their face: `128` with 129 and with 82, and `96` with 86 (all in `+page.svelte:55-58,77`). They are 8px multiples, so they hold the spacing grid but break the "cells per em" rule.

### Spacing literals (occurrences, whole `src/`)
| Value | Count | Distribution |
|---|---|---|
| `gap:16px` | 26 | app.css 8, work/+page 8, [slug] 6, +page 3, contact 1 |
| `gap:32px` | 6 | app.css 1, work 2, [slug] 2, contact 1 |
| `gap:8px` | 6 | app.css 4, [slug] 2, +page 1 (plus `gap:8px 16px` ×1, `app.css:92`) |
| `gap:24px` | 4 | [slug] 3, contact 1 |
| `padding-top:64px` | 8 | +page 3, [slug] 3 (one covering 3 selectors), contact 2 |
| `padding-bottom:64px` | 6 | +page 5, contact 1 |
| `padding-bottom:48px` | 6 | +page 5, contact 1 |
| `padding-top:48px` | 4 | +page 3, [slug] 1 |
| `padding-bottom:32px` | 4 | +page:60,68,82; work:32 |
| `padding:8px 16px` | 5 | `app.css:45,54,66`; `+page:49` |
| `padding:16px` | 3 | `work:38,42` (plate + more) ; `app.css:89` card |
| `padding:8px 0` | 3 | `app.css:115`, `+page:63`, `[slug]:69` |
| `padding-top:32px` | 2 | `[slug]:68`, `app.css:105` (`32px 0 0`) |
| `padding:24px` | 1 | `app.css:82` `.cta-row` |
| `padding:16px 24px` | 1 | `app.css:78` `.cta` |
| `padding-top:24px`, `padding-top:8px` | 1 each | `[slug]:92`, `[slug]:76` |
| `margin-top:16px` | 4 | `app.css:49`, `app.css:—`, `+page:75`, `[slug]:71` |
| `margin:64px 0 0` / `48px 0 0` | 1 / 1 | `app.css:106`, `app.css:120` `.page-foot` |
| `margin-right: 32/24/16/8px` | 1 each | `+page:58,59,77` word/label kerning |
| `48px` grid column | 1 | `[slug]:87` list number column |
| `96px` | 1 | `+page:47` `calc(100vh - 96px)` (header 64 + readout 32) |

The real scale is **8 / 16 / 24 / 32 / 48 / 64**, plus `96` derived and `128` as a line-height.

### z-index — 7 values, no scale (`app.css:41,45,47,58,73,75,100`)
`0` band-bg, `1` band content, `2` header + readout, `50` nav-chrome, `98` grid overlay, `99` skip link, `50 < 98` means the grid overlay paints over the sticky header.

### Motion
| Value | Sites |
|---|---|
| `1s steps(2,jump-none) infinite` | `app.css:52` (path cursor), `Decode.svelte:47` (decode cursor), `+page.svelte:51` (`nudge` arrow) — three copies of the same timing |
| `@keyframes blink{1→0}` | duplicated: `app.css:85` and `Decode.svelte:48` |
| `@keyframes nudge` `translateY(0→2px)` | `+page.svelte:52` |
| hover displacement `8px` | `app.css:81` `.cta`, `app.css:94` `.card .mono` |
| `FRAME = 33` ms | `Ascii.svelte:15`; `Dither.svelte` equivalent |
| `DECAY = 0.94` | `Ascii.svelte:16` |
| Ascii `tick` | `160` (`+page:11`), `90` (`+page:25`, `contact:8`); prop default `110` (`Ascii.svelte:14`) — unused |
| Ascii `density` | `0.9`, `0.7`, `0.55` |
| Ascii `seed` | `3`, `5`, `3` |
| Decode `step` | `110` (`+page:12`), `70` (`+page:19`, `work:10`, `[slug]:38`), `55` (`+page:41`, `contact:9`); default `45` unused |
| Decode `delay` | `500` (`+page:12`), `i*150` (`+page:19`) |
| clock interval | `1000` (`+layout.svelte:53`) |
| `rootMargin:'64px'` | `Ascii:99`, `Clip:17`, `Picture` n/a; `threshold:0.25` `Decode:34` |

**No `transition` property exists anywhere** — every hover state is instant. That is consistent with the discrete-motion rule but is currently implicit, not a token.

### Breakpoints — 5 values, 13 blocks
`700` ×5 (`app.css:108`, `+page:72`, `work:49`, `[slug]:91`, `contact:26`) · `1100` ×4 (`+page:71`, `work:47`, `[slug]:89`, `contact:25`) · `900` ×2 (`work:48`, `[slug]:90`) · `1300` ×1 (`work:46`) · `380` ×1 (`work:50`).

## 3. Type roles and route-local overrides

Roles in `app.css:26-34`: `.blackletter` (family only, lh 1), `.display` 82, `.display-l` 123, `.display-s` 41, `.body` 27/32, `.lead` 54/64, `.lbl` 16 Silkscreen, `.mono` 16 Press Start, `.dim`. `.display-l` (123px) is **defined but never used in any route**.

Local overrides:

| Class | Sizes | Sites |
|---|---|---|
| `.xl` | 258 → 172 @1100 → 86/129 @700 | **repeated verbatim in three files**: `+page.svelte:64,71,78`; `work/+page.svelte:34,47,49,50`; `contact:20,25,26`. `+page` and `contact` are identical except `+page` drops to 86 @700 and `work` drops to 129 @700 then 86 @380 |
| `.hero-name` | 344 / 258 @1100 / 129 @700 | `+page.svelte:48,71,74` |
| `.title` | 172 / 129 @1100 / 86 @900; `.small` variant 86 → 43 | `[slug]:71,73,89,90` — JS-measured step-down at `[slug]:13-20` |
| `.para`, `.para .display` | 82/128 → 41/64 @700 | `+page.svelte:55,56,77` — overrides `.display` in place |
| `.words`, `.para .w` | 129/128 → 86 @1100 → 86/96 @700 | `+page.svelte:57,58,71,77` |
| `.work-statement .blackletter` | 86 / 43 @700 | `+page.svelte:61,80` |
| `.header-index .range` | 32 → 16 @700 | `work/+page.svelte:33,49` |
| `.row-body h2` | 41 @1300 (overrides `.display` 82) | `work/+page.svelte:46` |
| `.wordmark` | 43 | `app.css:48,112` |

**Same value repeated across routes:** `258/258` and its `172` @1100 step (`.xl`, 3 files) and `86/86` at the 700 floor (3 files) are the clearest candidates for a named role — e.g. `.display-xl` with built-in steps.

## 4. Repeated visual patterns → candidate components

**Plate** (`background:var(--paper)` + 16px padding, no border):
- `work/+page.svelte:38` `.row-body .metadata, .row-body .body` — padding 16 *(in flux)*
- `work/+page.svelte:41` `.row-body h2` — `padding:0 16px` only (half a plate)
- `work/+page.svelte:42` `.more` — padding 16, no background until hover
- `app.css:91` `.card .pic`, `Picture.svelte:19` / `Clip.svelte:27` `.pic` — paper ground, no padding
- `+page.svelte:66` `.work-rain .card{background-color:var(--paper)}` — a card opting out of transparency
Differences: whether the paper ground is present at rest, and whether padding is 16 all round or 0 16.

**Dither/card surface** (`repeating-conic-gradient`): `app.css:89` card 4px/14%; `app.css:90` hover 8px/26%; `Ascii.svelte:113` and `Dither.svelte:81` pre-draw fallback 16px/currentColor/.35. Four gradients, three cell sizes, one shape.

**CTA family** — six near-identical action blocks:
| Site | Padding | Ground | Gap | Hover |
|---|---|---|---|---|
| `app.css:78` `.cta` | 16 24 | accent | 16 | fg fill + `translate(8px,0)` |
| `app.css:82` `.cta-row` | 24 | accent | 16 | fg fill, no translate |
| `+page.svelte:49` `.hero-hint` | 8 16 | accent | 8 | none |
| `app.css:56` nav `[aria-current]` | 8 16 | accent | — | fg fill |
| `work/+page.svelte:42-45` `.more` | 16 | none → accent | 16 | accent fill (inverse direction) |
| `+page.svelte:63` `.work-foot a` | 8 0 | none | 16 | none |
Call sites: `.cta` → `contact:13`; `.cta-row` → `+page:42`, `[slug]:63`; `.hero-hint` → `+page:13`.

**Index / label rows** — five formats for the same idea:
- `+page.svelte:68` `.index-head`: row, space-between, gap 16, pb 32 → `Selected work` / `01–04`
- `work/+page.svelte:32` `.header-index`: column, align-end, gap 16, pb 32 → `Project index` / accent range
- `app.css:106` `.page-foot` ×3 call sites: `work:26` `End of index / 004`, `[slug]:64` `[01] / 004`, `contact:14` `Brand / product / motion / front end` — all with a trailing `->` link
- metadata line: `[n] / year / scope` at `work:18` (on a plate) and `[slug]:37` (bare)
- card label: `n / scope` at `+page:33` — same data, no brackets, no year
- `readout` strip `+layout.svelte:70` — the same `/`-delimited pattern in Press Start

**Back / quiet link**: `[slug]:69` `.back` (gap 8, padding 8 0, hover accent) and `[slug]:78` `.link` (gap 8, hover accent, no padding). Nearly the same rule twice, 9 lines apart.

**Section spacing**: `padding-top:64px` at `+page:53,67,69`, `[slug]:79,80,88`, `contact:21`; drops to 48 at `+page:76,81,83`, `[slug]:95`, `contact:26`. `contact:26` keeps `padding-top:64px` at 700 while every other route drops to 48.

**Arrows**: `->` inside `<span class="mono">` at `+page:33,37,42`, `work:21`, `[slug]:45,63`, `contact:13`. Bare `->` text (rendered in Silkscreen, not Press Start) at `work:26`, `[slug]:64`, `contact:14`. Back arrow `<-` at `[slug]:36`. SVG pixel arrow only at `+page:13`.

**Blinking cursor**: two implementations — `app.css:51-52` (8×16px block, `var(--accent)`, `margin-left:8px`) and `Decode.svelte:46-47` (`.14em × .4em`, `currentColor`, `margin-left:.05em`). Different colour, different sizing system, duplicated keyframes.

**Decode call sites** (all six): `+page:12` `text="i’m tim." mode=type step=110 delay=500 cursor` · `+page:19` `text={word} step=70 delay={i*150}` · `+page:41` `text="building." step=55` · `work:10` `text="work." step=70` · `[slug]:38` `text={p.word} step=70` · `contact:9` `text="building." step=55`. `+page:41` and `contact:9` are the identical heading, duplicated markup and CSS.

## 5. Existing components

| File | Props | Consumers |
|---|---|---|
| `Ascii.svelte` | `mode cell=16 px=2 seed=7 tick=110 density=1 avoid pad=1 feather=3 fadeIn=0 fadeOut=0 interactive=true reach=7` (`:14`) | `+page:11,25`, `contact:8` |
| `Decode.svelte` | `text mode='scramble' step=45 delay=0 pool cursor=false once=true` (`:9`) | 6 sites above |
| `Picture.svelte` | `src x2 alt width=1600 height=900 eager=false sizes` (`:7`) | `+page:32`, `work:16`, `[slug]:28` |
| `Clip.svelte` | `src label width=16 height=9` (`:7`) | `[slug]:28` |
| `Dither.svelte` | `mode='gradient' cell=8 seed tick=120 density label avoid pad=2 feather=6 fadeIn fadeOut` (`:13`) | **none** |
| `Ticker.svelte` | `items cell=8 tick=70` (`:5`) | **none** |

Shared state / data: `motion.svelte.ts:4-6` — `motion{on,ready}`, `grid{on}`, `theme{light}` (read by `Ascii`, `Decode`, `Clip`, `+layout`). `work.ts:40` `projects`, `:262` `rowColumns(row, gap=16)`, `:271` `count`. `prng.ts` (noise/Bayer), `glyphs.ts` (5×7 bitmaps + `RAMP`), `knockout.ts` (`knockout`, `measureBoxes`).

## 6. Layout primitives

- `section{position:relative;padding:0 var(--gutter)}` — `app.css:70`, the only gutter carrier.
- Column formulas, all `round(down, …, 8px) 1fr` with `gap:32px`: 3/5 at `work/+page.svelte:36` (`.row`), 2/3 at `[slug]:74` (`.intro`), 1/2 at `[slug]:81` (`.text,.list`). All collapse to `100%` at 900 (`work:48`, `[slug]:90`).
- `.cards` `1fr 1fr` gap 16 → 1 col @700 (`app.css:88,119`); `.detail` `1fr 1fr` gap 32 (`contact:21`).
- `.rows` flex column gap 16 (`work:35`); `.grow` `grid-template-columns:var(--cols)` gap 16 (`[slug]:85`), fed by `rowColumns()` which snaps to **2px**, not 8px.
- `.band` / `.band-bg` (`app.css:73-76`) — used at `+page:10,24`, `contact:7`; also the pointer-event root for `Ascii` (`Ascii.svelte:100`) and the query root for `avoid` (`Ascii.svelte:37`).
- `.inner-page` (`app.css:105`) on `work`, `[slug]`, `contact` — only styles `.page-head`; Home is not an inner page.
- `.site` / `.site.show-grid` (`app.css:98-102`), `.nav-chrome`, `.site-header`, `.readout`, `.global-footer`.

## 7. Inconsistencies

1. **Two hover directions for the same "action" idea.** `.cta`/`.cta-row`/nav go accent → fg fill (`app.css:79,84,56`); `.more` goes plain → accent fill (`work:44`). Both are "the button lights up".
2. **Three hover vocabularies**: fill-invert (4 rules), accent-text (`[slug]:70,78`), texture-coarsen (`app.css:90`). Only `.cta` and `.card .mono` also translate 8px.
3. **Two cursor implementations** (px+accent vs em+currentColor) and **two identical `@keyframes blink`** (`app.css:85`, `Decode.svelte:48`).
4. **`.xl` defined three times** with three different small-screen ladders (`+page:64/71/78`, `work:34/47/49/50`, `contact:20/25/26`).
5. **`.row-body h2` at 41px below 1300** (`work:46`) while `.display` only drops to 41 below 700 everywhere else — the same role at two different breakpoints.
6. **`.page-foot` margin 64/48** (`app.css:106,120`) but on Contact it also inherits the `.detail` grid `gap:32px` (`contact:21`), so its effective top space is 96, not 64.
7. **Contact keeps `padding-top:64px` at ≤700** (`contact:26`) where `+page:76,81,83` and `[slug]:95` all drop to 48.
8. **Two padding values for the same plate role**: `.metadata`/`.body` get 16 all round, `.row-body h2` gets `0 16px` (`work:38,41`).
9. **`->` renders in two faces**: Press Start inside `.mono` (7 sites) vs Silkscreen as bare text in every `.page-foot` link (`work:26`, `[slug]:64`, `contact:14`).
10. **Same project metadata, two formats**: `n / scope` (`+page:33`) vs `[n] / year / scope` (`work:18`, `[slug]:37`).
11. **Line-heights off the cell table**: `128` paired with 129 and with 82 (`+page:55-58`), `96` paired with 86 (`+page:77`). 8px-clean, em-dirty.
12. **`--u:8px` is declared and never used**; every 8-multiple is a literal.
13. **`--header-height` consumed without a declaration or fallback** (`app.css:42`) — pre-hydration the collapsed nav rule resolves to nothing.
14. **z-index 98 (grid overlay) sits above z-index 50 (sticky nav)** (`app.css:100` vs `:41`).
15. **`.display-l` (123px) is dead**; `Dither.svelte` and `Ticker.svelte` are dead components; `Ascii` `fadeIn`/`fadeOut`/`bands` and `Decode` `pool`/`once`/default `step:45` are never exercised.
16. **`.detail .body{max-width:40ch}`** (`contact:22`) is the only `ch`-based measure on the site.
17. **Two grid snap units coexist**: 8px for layout columns, 2px for images (`work.ts:267`, `Picture:11`, `Clip:12`) — intentional per decision 0054 but undocumented as a token pair.

## 8. Suggested token and component structure

**Layer 1 — primitives** (`src/lib/styles/primitives.css`): `--yellow --ink --white` plus `--u:8px` and a real step scale `--s-1:8 --s-2:16 --s-3:24 --s-4:32 --s-6:48 --s-8:64 --s-16:128`; cell constants `--cell-text:8px --cell-image:2px --cell-texture:16px`; the five breakpoints as documented constants (`700 900 1100 1300 380` — decide whether 1300 and 380 survive).

**Layer 2 — semantic tokens** (`tokens.css`): keep `--paper --fg --accent --on-accent --dim`; add `--surface-card`, `--surface-card-hover`, `--grid-line-fine`, `--grid-line-major` to name the four `color-mix` percentages; add `--z-band-bg:0 --z-band:1 --z-chrome:2 --z-nav:50 --z-grid:98 --z-skip:99`; add `--tick-cursor:1s`, `--step-nudge:8px`, `--ascii-tick-slow:160ms --ascii-tick-fast:90ms`, `--decode-step-slow:110 --decode-step:70 --decode-step-fast:55`. Also make `--header-height` a declared default of `64px`.

**Layer 3 — type roles** (`type.css`): keep the existing names, add `--face-blackletter --face-display --face-text --face-label --face-mono`, retire `.display-l`, and add `.display-xl` carrying the 258 → 172 → 86 ladder that `.xl` duplicates in three files. Decision for Timothy: fold `.hero-name`, `.title`, `.para`/`.words` into named roles (`.hero`, `.study-title`, `.statement`) or keep them route-local — the first three are genuinely one-off, `.xl` is not.

**Layer 4 — components** (`src/lib/components/`): `Plate.svelte` (paper ground + 16px, `pad` variant for `0 16`), `Cta.svelte` (variants `block | row | hint | nav`, one hover direction), `IndexRow.svelte` (label/value, `align="row|column"`, accent value), `PageFoot.svelte` (left text + right link, one arrow face), `Arrow.svelte` (`->` / `<-` / svg, always Press Start), `Cursor.svelte` (one implementation, used by `Decode` and the path), `MetaLine.svelte` (`[n] / year / scope`, `short` variant), `QuietLink.svelte` (merges `.back` and `.link`), `Band.svelte` (wraps `.band` + `.band-bg` + `Ascii`).

**Layer 5 — page compositions**: routes keep only structure and their genuinely unique sizes.

Open decisions: whether accent needs a per-theme value; whether the `.more` hover inverts to match `.cta`; whether the 1300 and 380 breakpoints stay; whether `Dither` and `Ticker` are kept or deleted.
