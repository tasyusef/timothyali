# Website iteration log

This complements the decision log. A working iteration is not an approved design. User feedback is distinguished from implementation judgment. Earlier city history remains in decisions 0028–0043 and the saved city website.

## RM-01 — Illustrated reduced-motion study (superseded)

**Trigger:** Timothy asked to refine reduced motion. After considering still captures of the main city, he authorized the more composed still direction.

**Change:** Six editable SVG scene illustrations, distinct type layouts, normal page scrolling and a motion switch that retained the current chapter.

**Feedback:** “this looks weird to me. maybe lets make this version more type focused”.

**Disposition:** Superseded by RM-02. The illustration component and source study are retained in the import workspace under `work/reduced-motion/`; they are not part of the active alternate website. The initial screenshots were working captures overwritten during the next review, so do not claim an intact visual archive of this iteration.

## RM-02 — Type-focused reduced motion (saved with city version)

**Trigger:** Timothy’s request to make the reduced-motion version more type-focused.

**Change:** Removed illustration, enlarged Jacquard emphasis, added ruled type compositions, alternating yellow/black sections and responsive layouts. Retained chapter navigation and preference behavior.

**Validation:** Zero Svelte errors/warnings, successful build, twelve behavior checks, desktop and 390px/320px screenshots.

**Disposition:** Saved in `../timothyali2-city-v1-2026-09-08` before alternate work, including reduced-motion review images. No separate visual approval was given.

## PX-01 — First programmatic alternate

**Trigger:** Decision 0044: identity retained; city replaced by kinetic typography, pixel-grid and terminal influences.

**Change:** Shared numbered navigation, ruled modular page layouts, Jacquard hero, Courier supporting typography, an 8-unit SVG mark, restrained ASCII diagram and a project index. Work/Contact rebuilt in the same system. Type reveals use discrete steps.

**Review findings (assistant):** At 320px, the full name wrapped onto two lines. Courier’s slab-seriffed character felt more like a typewriter than the intended terminal typography. Dynamic animation class selectors needed an explicit Svelte global qualifier to avoid unused-selector warnings.

**Validation:** Home, Work and Contact captured at 1440px, 390px and 320px; all had one h1, no horizontal page overflow, no Three.js requests and no browser errors. Initial checking reported two selector warnings, resolved in PX-02.

**Saved evidence:** [Desktop](iterations/pixel-v2/01-first-pass/1440-home.png), [320px](iterations/pixel-v2/01-first-pass/320-home.png), [source](iterations/pixel-v2/01-first-pass/source.zip), [route checks](iterations/pixel-v2/01-first-pass/review.json).

**Status:** Superseded by PX-02; not user-approved.

## PX-02 — Terminal type and narrow-screen refinement

**Trigger:** PX-01 browser review.

**Change:** System monospaced supporting type replaces Courier; the narrow-screen wordmark stays on one line. Animation selectors explicitly recognize the observer’s dynamic class. Old city source/assets and unused Three.js/font dependencies are removed from the working version, with the saved snapshot intact. Existing project information and external case-study targets are retained.

**Final correction:** Keyboard testing found that the skip link did not reliably focus main after client-side navigation. An explicit focus/scroll handler now handles the enhanced case; the native anchor remains the no-JavaScript fallback.

**Validation:** Svelte check passed with zero errors/warnings; production build passed. Eight behavior checks cover stepped animation, motion toggle/persistence, project deep links, Contact, keyboard skip, reduced-motion/no-JavaScript rendering and no Three.js requests. Nine route/viewport captures cover Home, Work and Contact at 1440px, 390px and 320px, without horizontal overflow or browser errors.

**Saved evidence:** [Desktop](iterations/pixel-v2/02-terminal-refinement/1440-home.png), [mobile](iterations/pixel-v2/02-terminal-refinement/390-home.png), [source](iterations/pixel-v2/02-terminal-refinement/source.zip), [behavior checks](iterations/pixel-v2/02-terminal-refinement/verification.json), [route checks](iterations/pixel-v2/02-terminal-refinement/review.json).

**Status:** Current working implementation; visual acceptance pending.

## PX-03 — One pixel grid

**Trigger:** Timothy restated the 0044 direction in full (keep colour, pixel blackletter, name, tone; programmatic, pixelated, kinetic type, shared pixel grid, ASCII art, terminal, retro-futurist, generated textures, dystopian through type and layout, potentially everything in a pixel font). Assistant judgement: PX-02 was a Swiss monospace page with two Jacquard words and did not deliver most of that list — no pixel body face, no shared cell grid, one small ASCII box, no generated textures, and a clip-path wipe as the only motion. PX-03 rebuilds the pages against the brief.

**Type system (implementation choice, not approved):** every face is a bitmap design whose em is a known number of cells, measured from the font outlines: Jacquard 24 = 43 cells/em, Jersey 25 = 41, Jersey 15 = 27, Silkscreen = 8, Press Start 2P = 8. Font sizes are chosen as cells-per-em × cell size (43/86/129/172/258/344 for Jacquard; 41/82/123 for Jersey 25; 27 for Jersey 15 body; 16 for Silkscreen labels and Press Start 2P mono), so glyph pixels land on device pixels. Spacing is in 8px units. Roles: Jacquard 24 emphasis and wordmark, Jersey 25 uppercase display, Jersey 15 body copy, Silkscreen labels/navigation, Press Start 2P for the status readout and ASCII diagram. Rejected: Workbench and Sixtyfour (Rosetta variable pixel monos) because their pixels render as rounded dot-matrix / scanline blobs and cannot share a hard square grid with Jacquard; VT323 (curved outlines); Jersey 10 (18.667 cells/em, no integer sizes). The candidate specimen is saved as `specimen-candidates.png`.

**Generated textures:** `Dither.svelte` draws an ordered Bayer 8×8 dither of a scalar field (gradient, noise, bands, checker, rain) in 8px cells. `Ascii.svelte` draws a 5×7 bitmap glyph set from a density ramp over a noise field in 16px cells with 2px pixels. `PixImage.svelte` converts every Work photograph into a two-colour yellow/black dither in 4px cells (2px under 700px). All textures are deterministic from a seed, animate in discrete ticks only while motion is on, fall back to a CSS checker before the first draw or without JavaScript, and keep the original `<img>` for alt text.

**Kinetic type:** `Decode.svelte` types the hero name behind a block cursor and scrambles the Jacquard words (invested., look., move., work., building.) through a glyph pool before settling left to right; `Ticker.svelte` advances label text one 8px cell per tick. Hovers shift by whole cells. Nothing is continuous; everything steps.

**Terminal / Swiss chrome:** top bar with wordmark, `~/tim/<route>` path with blinking block cursor and numbered navigation; an inverted readout strip (Design + build / Denver / 39.7392N 104.9903W / live Mountain-time clock / SYS.OK); inverted footer with `EOF`, a Motion toggle and a new Grid toggle that overlays the 8px/64px grid to show the system. Rules are 2px, sections are hard-ruled, arrows are ASCII `->`.

**Labels carried over from PX-02 and still unapproved:** “Human input required” (removed), “No half measures.”, “Every detail counts.”, “Let’s make something.”, “Human to human.”, “A little human. A little machine.”, “Think / make / repeat”. New chrome strings introduced here: `~/tim/index`, `SYS.OK`, `EOF`, the coordinates and clock. All are design proposals.

**Review findings (assistant):** first render had a typing cursor the size of a glyph (fixed to 0.14em × 0.4em), a too-dense ASCII panel (density 0.85 → 0.6), mobile index arrows wrapping (column 24px → 32px), cluttered two-line meta rows on mobile (right-hand label hidden under 700px), empty texture boxes without JavaScript (CSS checker fallback), and Work dithers dissolving at 390px (cell 4 → 2).

**Validation:** svelte-check 0 errors / 0 warnings; production build passed. A pixel audit screenshot of ten text regions (wordmark, nav, readout, labels, display, body, button, hero, diagram, index titles) found 0% intermediate-colour pixels in all of them except the navigation (0.68%, the intentional 55% opacity numerals) — every face is sitting on the grid. Home, Work and Contact captured at 1440px and 390px with no horizontal overflow and no browser errors; reduced-motion renders the full text with `Motion [off]`; JavaScript-disabled renders full copy with checker placeholders. Screenshots are working captures and include mid-animation frames (the grid shot catches “building.” mid-scramble on purpose).

**Saved evidence:** `iterations/pixel-v2/03-one-grid/` — [desktop](iterations/pixel-v2/03-one-grid/1440-home.png), [desktop with grid overlay](iterations/pixel-v2/03-one-grid/1440-home-grid.png), [reduced motion](iterations/pixel-v2/03-one-grid/1440-home-reduced.png), [no JavaScript](iterations/pixel-v2/03-one-grid/1440-home-nojs.png), [hero zoom](iterations/pixel-v2/03-one-grid/zoom-hero.png), [work](iterations/pixel-v2/03-one-grid/1440-work.png), [contact](iterations/pixel-v2/03-one-grid/1440-contact.png), [390 home](iterations/pixel-v2/03-one-grid/390-home.png), [390 work](iterations/pixel-v2/03-one-grid/390-work.png), [font specimen](iterations/pixel-v2/03-one-grid/specimen-candidates.png), [source](iterations/pixel-v2/03-one-grid/source.zip), [audit script](iterations/pixel-v2/03-one-grid/audit-script.mjs).

**Status:** Current working implementation; visual acceptance pending. Supersedes PX-02.

## PX-04 — Yellow on black, no rules, quiet hero, cards

**Trigger:** Timothy confirmed the PX-03 direction (“much better than what we had before”) and asked for five layout changes, then a sixth mid-build (decision 0047).

**Change:** Black base, yellow type. Every rule and border removed; bands separated by space. Solid yellow buttons and active nav. Hero is a full-viewport `sky` dither with only the typed name; the statement and CTA move to a following band. The commitment band uses the ASCII field as its background. Look/move/work rows lose their borders. The project index becomes a 2×2 card grid with dithered images on a pixel-pattern surface; the Work page uses the same cards with descriptions. Ticker and all section eyebrows removed. Contact heading sits on a thinned falling-ASCII background.

**Review findings (assistant):** the first pass put the dense end of the gradient dither exactly behind the name and drowned it; a new `sky` field mode builds toward the top-right and empties behind the type. The commitment field was thinned from 0.5 to 0.42 density, contact from 0.55 to 0.42. `vite.config.ts` now honours `PORT` and `.claude/launch.json` allows auto-port after a stale dev server held 5173.

**Validation:** svelte-check 0 errors / 0 warnings (after adding `@types/node` for the config); production build passed; Home, Work and Contact captured at 1440px and 390px with no horizontal overflow and no browser errors; reduced-motion and JavaScript-disabled captures retained. The pixel audit is less meaningful now that dimmed text and pattern surfaces exist by design; the solid-yellow display, body, button and hero regions still measure 0–0.05% intermediate pixels.

**Saved evidence:** `iterations/pixel-v2/04-yellow-on-black/` — [desktop](iterations/pixel-v2/04-yellow-on-black/1440-home.png), [work](iterations/pixel-v2/04-yellow-on-black/1440-work.png), [contact](iterations/pixel-v2/04-yellow-on-black/1440-contact.png), [390 home](iterations/pixel-v2/04-yellow-on-black/390-home.png), [390 work](iterations/pixel-v2/04-yellow-on-black/390-work.png), [reduced motion](iterations/pixel-v2/04-yellow-on-black/1440-home-reduced.png), [no JavaScript](iterations/pixel-v2/04-yellow-on-black/1440-home-nojs.png), [source](iterations/pixel-v2/04-yellow-on-black/source.zip).

**Status:** Current working implementation. Direction confirmed (0047); this layout awaits Timothy’s visual review. Supersedes PX-03.

## PX-05 — Textured bands with type knockout, grid audit

**Trigger:** Timothy’s PX-04 review comments (decision 0048): disconnected middle section, texture on the invitation band, keep the unified grid, keep text readable on textures, revert the hero.

**Change:** Middle section merged into one band on a bands dither (lead + stacked words + diagram + copy). Invitation on a rain dither. Textures gain an `avoid` knockout that hugs text line boxes with a dithered falloff (`src/lib/knockout.ts`). Hero restored to PX-04. Canvas origins snap to the page grid and re-snap on reflow; card images use an explicit 2px cell and integer height; body line-height 32; header offsets on 8px; hero height rounds to 8px.

**Review findings (assistant):** the first knockout pass measured block boxes and wiped whole bands; measuring per line box fixed it. A grid audit initially flagged card canvases as misaligned because the image cell was driven by card width rather than viewport; making the cell explicit resolved it. A stale dev server on 5173 led to `PORT` support in `vite.config.ts` and `autoPort` in `.claude/launch.json`.

**Validation:** svelte-check 0/0, build passed. Six route/viewport captures without overflow or errors. Grid audit (saved as `grid-audit.txt`): all font sizes on the cell table, 0 fractional text boxes, 0 misaligned canvases, 0–0.04% intermediate pixels on solid type at both widths.

**Saved evidence:** `iterations/pixel-v2/05-texture-bands/` — [desktop](iterations/pixel-v2/05-texture-bands/1440-home.png), [work](iterations/pixel-v2/05-texture-bands/1440-work.png), [contact](iterations/pixel-v2/05-texture-bands/1440-contact.png), [390 home](iterations/pixel-v2/05-texture-bands/390-home.png), [grid audit](iterations/pixel-v2/05-texture-bands/grid-audit.txt), [audit script](iterations/pixel-v2/05-texture-bands/grid-audit-script.mjs), [source](iterations/pixel-v2/05-texture-bands/source.zip).

**Status:** Current working implementation; awaiting Timothy’s visual review. Supersedes PX-04.

## PX-06 — Black and white, theme toggle, yellow accent, colour photographs

**Trigger:** Decision 0049.

**Change:** Ground and type move to `--paper`/`--fg` tokens with dark and light sets on `html[data-theme]`; Theme toggle in the footer with early-paint script; `--accent` yellow on cursors, active nav and primary actions only; `PixImage` now resamples photographs in full colour at one sample per 2px cell instead of dithering to two colours; card surface and grid overlay use `color-mix` on the foreground token; footer controls wrap on narrow screens.

**Review findings (assistant):** the first early-paint script followed the OS colour scheme, which made the test browser render light by default; changed to dark-unless-stored. On 390px the three footer buttons were flex-shrunk to fractional widths; wrapping fixed it.

**Correction (2026-09-09, Timothy):** “textures dont render in light mode”. Cause: the canvases read their colour once at layout time, so a live toggle kept drawing the previous theme’s colour onto the new ground. Textures and images now re-read the colour on every draw and redraw on a theme change. Verified with a live toggle: the hero texture region went from 49% dark pixels (dark theme) to 13% (light theme, dark marks on light ground).

**Correction (2026-09-09, Timothy):** “the vertical padding between sections feels weird. kind of disconnects everything”. The 128–160px moats between bands are gone: bands butt against each other and every section uses the same 64px internal padding (48px under 700px); page footers and the global footer tighten to match. Grid audit still clean after the change.

**Correction (2026-09-09, Timothy):** “can we make the patterns interact with each other? invested kind of blends in to the look move work pattern?” `Dither` and `Ascii` gain `fadeIn`/`fadeOut` (in rows). The look/move/work band overlaps the invested band by 96px; the ASCII field fades out over its last 6 rows and the bands dither fades in over its first 12, linear and matched to the overlap, so the two interleave through the same Bayer threshold rather than cross-fading. Timothy’s interim reaction was withdrawn (“ignore my last”); the overlap stands for review.

**Correction (2026-09-09, Timothy):** “made all of these patterns ascii”. Every band texture now uses the bitmap ASCII renderer (`Ascii.svelte`), which gained `sky` and `bands` field modes for the hero and the look/move/work band; the invitation uses `fall`. The Bayer `Dither` component remains in the repo but is no longer used on any page.

**Correction (2026-09-09, Timothy):** “lets refine this” on the idea/iterate/ship diagram. Assistant’s read: the frame was a rule (dropped everywhere else) and the arrows shared columns with the letters. The box is gone; the arrows get their own column and the loop returns into ITERATE with `<--+`; the diagram takes 24px leading.

**Copy (2026-09-09, decision 0050):** the third band now reads “How it / looks. / moves. / works.”

**Interaction (2026-09-09, Timothy: “can we make these textures interactive”):** every ASCII band responds to the pointer. Each cell keeps a heat value that the pointer raises within a 7-cell reach and that cools by 18% per tick, so the cursor leaves a trail through the field; a click or tap sends an expanding ring. Heat is added before the text knockout, so type stays clear. With motion off, a cooldown loop runs only while heat remains and then stops.

**Frame rate (2026-09-09, Timothy: “increase the frame rate of these patterns a bit? so the interactions feel a bit smoother”):** the ASCII renderer now redraws every 33ms (~30fps) while motion is on or heat remains, while the ambient field still advances one step per `tick` ms so its cadence is unchanged. To keep that cheap, each ramp glyph is rendered once into a sprite per colour and pixel ratio and stamped with `drawImage`, and bands outside the viewport (64px margin) skip redraws. Measured with five bands live and the pointer moving over the hero: the page’s animation-frame loop stayed at the display rate with a longest frame gap of 11.9ms. Interaction verified in both motion modes: the lit fraction of a quiet hero region rises on hover and on click, and returns to baseline after cooldown; no errors.

**Validation:** svelte-check 0/0, build passed, six route/viewport captures without overflow or errors, light-theme captures of Home and Work, toggle persistence checked across a reload. Grid audit: 0 misaligned canvases, 0 fractional text boxes, solid type 0–0.04% intermediate pixels (accent yellow counted as a solid colour).

**Saved evidence:** `iterations/pixel-v2/06-black-white/` — [dark home](iterations/pixel-v2/06-black-white/1440-home.png), [light home](iterations/pixel-v2/06-black-white/light-home.png), [light work](iterations/pixel-v2/06-black-white/light-work.png), [390 home](iterations/pixel-v2/06-black-white/390-home.png), [grid audit](iterations/pixel-v2/06-black-white/grid-audit.txt), [source](iterations/pixel-v2/06-black-white/source.zip).

**Status:** Current working implementation; awaiting Timothy’s visual review. Supersedes PX-05.

## PX-07 — One middle band, heading for the cards, proof promoted

**Trigger:** Decision 0051 (Timothy accepted all six recommendations of the independent home-arc critique, `reviews/2026-09-09-home-arc-critique.md`).

**Change:** The “I get invested.” band and the looks/moves/works band are one band on one `bands` ASCII texture: “I get / invested. / in how it / looks. moves. works.”, left-aligned throughout, with a 16px Silkscreen label at full opacity under each word (looks → Brand, moves → Motion, works → Product / front end). The `fadeIn`/`fadeOut` overlap, the −96px margin and the 128px padding are gone. The statement band’s right column now reads “Brand. Product. Motion. Front end.” then “I’ve cofounded products. Helped teams ship theirs.” then the CTA; “From the first idea to something people use.” leaves the page (still in `landing-copy-v2.md` as superseded) and the IDEA/ITERATE/SHIP diagram is removed with its CSS. The card grid gets a `display` heading “Selected work” with a “01–04” label, matching the Work page. Card labels on Home and Work are at full opacity. The hero “Scroll” hint is at full opacity with an 8×16 yellow block cursor, and it shows on mobile.

**Assistant choices (not Timothy’s):** `bands` texture kept over `noise` because the merged band is the looks/moves/works band absorbing the invested line, not the other way round. “I care about the whole thing.” cut from the statement column: it fits, but “invested.” carries that sentiment in the next band and the promoted proof reads harder as two lines than three. The labels sit inside the heading as `aria-hidden` annotations with a visually hidden sentence after it (“Looks: brand. Moves: motion. Works: product and front end.”), so the heading’s accessible name stays “I get invested. in how it looks. moves. works.” The hero texture now knocks out around the hint only (the name still has no knockout): at full opacity it was still lost in the sky field, top-right dense. On mobile the hint sits in flow under the name, left-aligned, instead of at the right edge where it collided with the name’s own cursor. The review scripts `seam.mjs` and `diag.mjs` are obsolete (no seam, no diagram) and left in place as history.

**Correction (2026-09-09, Timothy):** “Put the scroll indicator in a yellow box”. The hint is now a filled accent block (8px 16px padding, ink text, 32px tall on the grid), the same treatment as the active nav item; the block cursor is dropped since a yellow cursor inside a yellow box would vanish. Assistant note: this is a fourth use of the accent beyond cursors, active nav and primary actions; it reads as a primary-action block, so the three-place rule in `app.css` should be read as “cursors, active nav, action blocks”. The hero field still knocks out around the box.

**Correction (2026-09-09, Timothy):** “put a little pixel arrow next to it”. A down arrow drawn as an 8×8 inline SVG on the same 2px pixel scale as the Silkscreen label (`shape-rendering: crispEdges`, ink on yellow) sits 8px after “Scroll” inside the box. Assistant choice: with motion on it steps down one pixel row (2px) and back once a second, the same cadence as the header cursor’s blink; static with motion off.

**Correction (2026-09-09, Timothy, decision 0052):** “the get invested and looks moves works sections still need work. its really tall. and the layout still feels like we stuck two sections together on top of each other.” Four variants were mocked behind a `?v=` switch on the live page and captured at 1440 and 390 ([sheet 1440](iterations/pixel-v2/07-arc/mocks/mock-sheet-1440.png), [sheet 390](iterations/pixel-v2/07-arc/mocks/mock-sheet-390.png)). Timothy chose the cut: the band is now “How it” over looks. / moves. / works. in three columns with their labels, no texture, 422px tall at 1440 (was 1,218). The mock component and switch were removed afterwards. Assistant note: the first pass used `1fr` columns, which put two of the words on fractional x positions; the columns are now rounded down to 8px, and the grid audit is clean again.

**Correction (2026-09-09, Timothy, decision 0053):** “theres too many story beats happening on the screen at once.” Two rounds of mocks (the first dismissed as “the same thing just resized”; the second four different structures, [sheet](iterations/pixel-v2/07-arc/mocks/beats2-sheet-1440.png)). Timothy chose the annotated paragraph as a starting point. The statement band and the “how it” band are now one section: the sentence “Designer for teams that don’t have one yet. I care how it looks. moves. works.” with the blackletter words inline at 129px in an 82px display sentence on a 128px line, the labels inline at the baseline, proof and CTA as a closing row. Assistant findings: an inline-block blackletter word inside a line whose strut was the heading’s default 40.5px grew the line by a half pixel and pushed everything below it off the grid; the heading now sets its own 82px size and the words sit in their own 129px/128px block, and the grid audit is clean again. Removing the old band styles also dropped the invitation’s `.xl` rule by accident (the “building.” word fell to 40.5px); restored. Under 700px the hand-set breaks are off and the word line takes 96px leading so the 86px glyphs do not collide. The 41/86 scale was captured for comparison and not used ([small](iterations/pixel-v2/07-arc/mocks/para-small-1440.png)).

**Validation:** svelte-check 0 errors / 0 warnings; production build passed; six route/viewport captures with no horizontal overflow and no browser errors; reduced-motion and no-JavaScript renders (the no-JS heading text reads the merged sentence with labels). After 0053 Home has six canvases and one sentence heading; grid audit 0/0 at both widths. Re-run after the yellow-box correction: same results. Grid audit: 0 misaligned canvases, 0 fractional or off-table text boxes at 1440 and 390; solid type 0% intermediate pixels on hero, statement, body, merged band and invitation. The 1440 capture shows one continuous band where the seam was.

**Saved evidence:** `iterations/pixel-v2/07-arc/` — [desktop](iterations/pixel-v2/07-arc/1440-home.png), [sentence band 1440](iterations/pixel-v2/07-arc/1440-home-who-band.png), [sentence band 390](iterations/pixel-v2/07-arc/390-home-who-band.png), [390 home](iterations/pixel-v2/07-arc/390-home.png), [1440 hero hint crop](iterations/pixel-v2/07-arc/1440-home-hero-hint.png), [390 hero hint crop](iterations/pixel-v2/07-arc/390-home-hero-hint.png), [work](iterations/pixel-v2/07-arc/1440-work.png), [390 work](iterations/pixel-v2/07-arc/390-work.png), [contact](iterations/pixel-v2/07-arc/1440-contact.png), [grid overlay](iterations/pixel-v2/07-arc/1440-home-grid.png), [reduced motion](iterations/pixel-v2/07-arc/1440-home-reduced.png), [no JavaScript](iterations/pixel-v2/07-arc/1440-home-nojs.png), [grid audit](iterations/pixel-v2/07-arc/grid-audit.txt), [source](iterations/pixel-v2/07-arc/source.zip).

**Status:** Current working implementation; awaiting Timothy’s visual review. Supersedes PX-06.

## PX-08 — Work index as rows, four case studies on the grid

**Trigger:** Timothy, 2026-09-09: “next we need to work on the work page and the case study pages”. No layout direction was given; this is a first built pass for his review, not an accepted design. Q28 (treatment of Work and case-study pages) stays open until he reacts.

**Change:**

- **Work page** (`src/routes/work/+page.svelte`). The head stays (“Selected” / “work.”). The 2×2 card grid, which repeated the home page’s “Selected work” cards, is replaced by one wide row per project on the same `.card` pixel surface: cover image in a 3/5 column (rounded down to 8px), then label `[01] / 2026 / Brand, product & front end`, the title in 82px display, the index line and “View case study ->”. The whole row is the link, and it goes to the case study on this site; the four external links to timothyali.com are gone. Rows stack under 900px; the title drops to 41px under 1300px where the text column narrows. 2,677px tall at 1440 (was 2,047 with the cards).
- **Case studies** at `/work/pocketwatch/`, `/work/parc/`, `/work/xrpcafe/`, `/work/firstledger/` (`src/routes/work/[slug]/`, prerendered from `src/lib/work.ts`, which is now the single source for Home, Work and the studies). One template: `<- Work` back link, index label, the project name as one lowercase blackletter word at 172px (129 under 1100, 86 under 900, one step smaller again when the word would not fit), a lead paragraph in Jersey 15 at 54/64 (new `.lead` role, the unused cell-2 size of that face) in a 2/3 column beside a Role / Timeline / Tools / Live block, then a hero row, then text sections (41px display title in the left half, 27px body in the right), galleries and a numbered Outcome list, a full-width yellow `.cta-row` to the next project, and the page footer. All copy is ported from the old site’s case studies with American spelling and no new claims; the PARC page carries the text of its brand-system and reaction components but not their interactive parts.
- **Galleries.** Every image is a `PixImage` at one sample per 2px cell, full colour, with its own aspect (reversed the same evening, see the 0054 correction below). A gallery row lists images whose column widths are proportional to their aspect ratios, snapped to the 2px cell, so a row of mixed formats comes out at (nearly) one height; rows collapse to one column under 700px. 62 images were copied from the old site into `static/work/<slug>/` at 1600px on the long side (photographs and mockups as JPEG at 85, flat graphics as PNG; 28MB in all, the largest single file 830KB). The First Ledger cover on Home and Work is now a 16:9 centre crop of its hero instead of a 4:3 image letterboxed in a 16:9 frame.
- **Video.** New `PixVideo.svelte`: a `<video>` sampled onto a canvas at one colour per 2px cell, 12 steps a second on a timer (no animation-frame loop), playing only while on screen with motion on, and holding its last frame otherwise. Used for the xrp.cafe “Explore, Create, Trade” promo (vertical, beside the logo in the hero row at the same height) and the PARC After Darc starting-soon loop.
- **Chrome.** The terminal path now shows the nested route (`~/tim/work/pocketwatch`); the Work nav item stays active on the studies. Home cards link straight to the case studies.

**Assistant choices (not Timothy’s):** rows rather than cards on Work, so Work does something Home does not (Q31 leaning updated). Titles as lowercase blackletter words without a full stop (“pocketwatch”, “parc”, “xrp.cafe”, “first ledger”): the site’s emphasis words are lowercase, and the full stops elsewhere end sentences, which a name is not; “xrp.cafe.” would have doubled the dot. Title at 172 rather than the 258 of the section heads, because “pocketwatch” at 258 is 1,110px and “first ledger” 966px, which leaves no room for the index label to read as a label. A lead role at 54/64 rather than uppercase display for the overview, since three sentences of uppercase Jersey 25 read as a poster, not a paragraph. Body columns at half width (672px, about 60 characters of Jersey 15). “View case study” inside the rows as a plain label with the arrow, not a yellow block, so the page has one action block (the next-project row on the studies, the contact line on Work) rather than four. Next-project navigation as a `.cta-row` because it is the primary action at the foot of a study. The Outcome lists keep the old site’s claims verbatim.

**Review findings (assistant):** the 82px row title spilled into the card padding at 1440 and past the viewport under 1300px (a 2/3 column gave the text 440px; “POCKETWATCH” is 460); a 3/5 split and the 41px fallback fixed it. Gallery rows used the 8px text grid for column widths with the last column taking the remainder, so the last image in a four-up row was up to 24px taller; columns now snap to the 2px image cell, and the largest height spread in any row is 4px. Figures below the fold held a fractional height from CSS `aspect-ratio` until their lazy image loaded, which put every text box after them on a fractional pixel; both image components now set an integer height from their width on mount. The long titles overflow a 375px phone at 86px; a hidden probe at the heading’s size measures the word and steps it down the table (86 → 43) when it would not fit (pocketwatch at 390 and below, first ledger at 320). The probe itself widened the page until it was given zero width. The header nav overflows the viewport between about 700 and 1000px on every page; that is pre-existing and untouched here.

**Validation:** svelte-check 0 errors / 0 warnings; production build writes the four study pages. Grid audit on seven routes at 1440 and 390: 0 misaligned canvases (13–25 per study), 0 fractional or off-table text boxes. No horizontal overflow on Work or any study at 1440, 1280, 1100, 900*, 390, 375 or 320 (*900: the pre-existing header overflow only). No page or console errors; every image resampled (13/24/16/9 per study); no broken sources. Video: canvas frames change while visible with motion on, hold with `prefers-reduced-motion`. Light theme and no-JavaScript renders captured.

**Saved evidence (final state, after 0054/0055):** `iterations/pixel-v2/08-work/` — [work 1440](iterations/pixel-v2/08-work/1440-work.png), [work 390](iterations/pixel-v2/08-work/390-work.png), [parc 1440](iterations/pixel-v2/08-work/1440-work-parc.png), [xrp.cafe 1440](iterations/pixel-v2/08-work/1440-work-xrpcafe.png), [first ledger 1440](iterations/pixel-v2/08-work/1440-work-firstledger.png), [do androids dream 1440](iterations/pixel-v2/08-work/1440-work-do-androids-dream.png), [do androids dream 390](iterations/pixel-v2/08-work/390-work-do-androids-dream.png), crops of Home (three-across cards), the study heads, gallery rows, light theme and no-JS in `crops/`, [grid audit](iterations/pixel-v2/08-work/grid-audit.txt), [source](iterations/pixel-v2/08-work/source.zip).

**Correction (2026-09-09, Timothy, decision 0054):** “we need to make sure that images arent getting made pixelated”. Images and video no longer go through the 2px resampling: `PixImage`/`PixVideo` are replaced by `Picture`/`Clip` (plain `<img>`/`<video>` in a figure that still sets an integer 2px-snapped height on mount), `image-rendering: pixelated` now applies to the texture canvases only, and every case-study image whose source allowed it gained a 2800px `@2x.jpg` in `srcset` (44 files, 20.8MB). Video plays natively: on screen with motion on, paused otherwise. Verified: every image loads and no canvas remains in a figure; the video plays with motion on and holds at 0s under reduced motion; grid audit still 0/0 on every route.

**Correction (2026-09-09, Timothy, decision 0055):** “i want to remove pocketwatch from my selected works” then “i want it replaced with another project”. Pocketwatch is out of `work.ts` and `static/work/`; Do Androids Dream (2023 title sequence, motion and art direction, the assistant’s pick, see 0055) is in as 04, with the 45-second sequence as the hero, the sun frame full width, and the four act stills in two aspect-matched rows. PARC, xrp.cafe and First Ledger move up to 01–03; the counts in the chrome (`01–04`, `End of index / 004`, `[n] / 004`) now derive from the data. Home’s card grid now reads its projects from `work.ts` too. Assistant findings: the long slug in the header path (`~/tim/work/do-androids-dream`) pushed the nav off screen below about 1150px, which exposed the pre-existing header weakness; the path column is now `minmax(0, 1fr)` and the path text clips instead of pushing, which also clears the old nav overflow between 700 and 1000px on every page. On phones the yellow next-project row shrank “Do Androids Dream? ->” to a fractional width; the row now wraps and its spans no longer shrink. Heights at 1440: Home 3,262, Work 2,677, Do Androids Dream 4,726.

**Validation (after 0054/0055):** svelte-check 0/0, build writes four study pages. Grid audit on eight routes at 1440 and 390: 0 misaligned canvases, 0 fractional or off-table text boxes. No page overflow at 1440, 1280, 1100, 1000, 900, 800, 701, 700, 600, 390, 375 or 320 on Home, Work or any study, including the header. No console or page errors, no broken images, all images loaded at their own resolution (`currentSrc` checked). Video plays with motion on and holds under reduced motion. Light theme and no-JavaScript captured. The Pocketwatch captures were removed from the evidence folder; its content is in the earlier `source.zip` only if needed from history, and in the old site.

**Status:** Current working implementation; awaiting Timothy’s visual review of the Work rows and the case-study template. Supersedes the Work page of PX-07; Home’s 2×2 card grid now reads its four projects from `work.ts`.


### Landing copy refinement — 2026-09-09 (0056)

Applied Timothy’s exact selected wording to the existing annotated paragraph: “Whatever you’re building, I care how it” replaces “I care how it”; the supporting copy becomes “I’ve built products of my own, / and helped teams ship theirs.” No new visual iteration or layout change. Previous wording is preserved in decision 0053 and the PX-07 evidence.


### Selected-work introduction — 2026-09-09 (0057)

Replaced the detached experience/CTA footer row with a work-section headline using the same accepted sentence. Added Jacquard emphasis to “of my own,” and “theirs.”; reduced “Selected work” to an index label and moved the Work link beneath the cards. Implemented on Timothy’s approval; visual acceptance pending.


### Inverted statement panel — 2026-09-09 (0058)

Applied a solid theme-aware inversion to `.who`, preserving its typography, spacing, and copy. Selected work retains the page background. Text selection is also inverted so it remains visible.


### Continuous work-to-invitation rain — 2026-09-09 (0059)

Moved the existing invitation rain into a shared wrapper spanning Selected Work and the invitation. One field now continues through both sections without restarting at their boundary. Added opaque card surfaces and knockout around work headings/links.


### Navigation wordmark casing — 2026-09-09 (0060)

Changed the shared navigation wordmark from “Timothy Ali” to “timothy ali” at Timothy’s request.


### Scroll-direction navigation — 2026-09-09 (0061)

Wrapped header and readout in one sticky, opaque surface. Its sticky offset hides only the measured header height on downward scroll; upward scroll, top-of-page, route navigation and keyboard focus expose the full header. Content stays in its original document flow.


### Status-strip route path — 2026-09-09 (0062)

Moved the route readout into the status strip in place of “Design + build”. Path and cursor remain full-opacity; secondary status items retain their dim treatment.


### Discipline label colour — 2026-09-09 (0063)

Set the three `.para .note` labels to `var(--accent)` at Timothy’s request.


### PX-12 — Work header refinement — 2026-09-09

Timothy requested a refinement of the Work header. Assistant implementation proposal: reduce “Selected” to a small lead-in above large lowercase Jacquard “work.”, with a right-aligned project index and dynamic range. Tighten the gap to the first project. Preserve the existing page copy and project rows. Mobile uses measured font steps and the same two-column relationship. This is implemented for review, not an accepted new design decision. Evidence and previous source: `docs/iterations/pixel-v2/12-work-header/`.


### PX-12 correction — remove “Selected” eyebrow

Timothy requested removing the “Selected” eyebrow from the Work header. Removed it; “work.” stands alone alongside the project index.


### PX-12 correction — Work-page accent and hover treatment (0065)

Added yellow project range and case-study arrows; hovering or keyboard-focusing a project fills its “View case study” label yellow with dark text. Reserved padding avoids movement on interaction. Headline colour is unchanged.


### PX-12 correction — Separate metadata and body plates (0066)

Added page-colour backgrounds and 16px padding to metadata and body copy independently. Titles remain unplated, aligned with the inset text. Body plates hug the paragraph rather than stretching through the unused column space; the CTA stays at the bottom.


### PX-13 — Review fixes — 2026-09-09

Timothy reviewed the site and named three problems: the yellow discipline labels were unreadable on the inverted statement panel, the Work header broke on phones, and the tall Work rows had a band of dead dither between the body copy and the CTA. All three are his direction (“have an opus agent address all 3”); decisions 0067–0069 record them.

- **Discipline labels get a plate.** `.para .note` (Brand / Motion / Product / front end) kept `color:var(--accent)` from 0063, but `.who` is inverted (0058), so in the default dark theme the panel is white and yellow-on-white measured 1.32:1. The labels now sit on their own solid plate in `var(--ink)` with `var(--yellow)` text — the site’s existing accent pairing — with 8px padding and a 16px gap after each chip. The agent’s first pass used 8px 16px padding and a 32px gap, which pushed “Product / front end” onto its own line at 1440 (the row measured 1,456px in 1,376px); the tighter spacing brings it to 1,360px and the three words and three chips sit on one line again at 1440, wrapping from 1280 down as they did before the plates. Measured 12.96:1 in both themes. In light theme the panel is already ink, so the plate is invisible and the labels read as before: same colour, same contrast, one rule. The labels stay inline on the baseline; `.words` line-height is unchanged (128px desktop, 96px phone) and the 32px label boxes sit well inside it, so nothing moved onto a fractional pixel.
- **Work header stacks on phones.** Below 700px `.work-header` becomes a column (title, then the index) and `.header-index` becomes a row with “Project index” left and the yellow range right, `white-space:nowrap`, `padding-bottom:0`, 16px gaps. Previously the index was a ~100px right-hand column, “Project index” wrapped to two lines and collided with “work.”; the wrapped span was also the last fractional text box on the site (grid audit, /work/ at 390). At 390 the index row is one line, 144px label plus 58px range in 358px; at 360 it is one line in 328px. Desktop is untouched.
- **Work CTA follows the body.** Removed `.row-body .body{margin-bottom:auto}`. “View case study” now sits 16px under the body plate like every other gap instead of being pushed to the bottom of the row, which left about 118px of empty dither in rows 3 and 4 at 1440. The row still stretches to the cover’s height; the reserved padding and yellow hover fill (0065) and the separate metadata/body plates (0066) are unchanged. Measured body-to-CTA gap is 16px on all four rows.

**Validation:** svelte-check 0 errors / 0 warnings; production build succeeded. Grid audit on seven routes at 1440 and 390: 0 misaligned canvases, 0 fractional or off-table text boxes everywhere, including /work/ at 390, which was 1 before. `overflow3.mjs` at 1100/1000/900: no page overflow (the two hero texture canvases still overhang inside their `overflow:hidden` band, as before). `work.mjs`: no overflow, no console or page errors, every image loaded on Work and the four studies. Contrast measured in the browser from computed styles: note text vs plate 12.96:1 in both themes, plate vs panel 17.15:1 in dark, 1:1 in light (deliberate).

**Evidence:** `docs/iterations/pixel-v2/13-review-fixes/` — [who 1440 dark](iterations/pixel-v2/13-review-fixes/who-1440-dark.png), [who 1440 light](iterations/pixel-v2/13-review-fixes/who-1440-light.png), [work header 390](iterations/pixel-v2/13-review-fixes/work-header-390.png), [work header 360](iterations/pixel-v2/13-review-fixes/work-header-360.png), [row 3 at 1440](iterations/pixel-v2/13-review-fixes/work-row-3-1440.png), [row 4 at 1440](iterations/pixel-v2/13-review-fixes/work-row-4-1440.png), [work 1440](iterations/pixel-v2/13-review-fixes/work-1440.png), [grid audit](iterations/pixel-v2/13-review-fixes/grid-audit.txt), [source](iterations/pixel-v2/13-review-fixes/source.zip). Capture script: `tools/review/px13.mjs`.

**Correction (2026-09-09, Timothy, decision 0070):** “lets fix the header height then”. Below 700px the header was 99px (`height:auto` around a 43px wordmark), so phone content started 3px off the 8px unit on every route. The header is now a fixed 104px grid (48px wordmark row with the wordmark bottom-aligned, 8px gap, 32px nav row, 8px padding top and bottom); header plus status strip is 136px. The tabs stay; Timothy chose this over the hamburger he had floated (Q35). Verified: header 104 and content top 136 at 390 on Home and Work; svelte-check 0/0; grid audit 0/0 on all fourteen route-width checks; no overflow at 900–1100; nav still collapses on downward scroll and the status strip stays pinned. Captures: [header 390](iterations/pixel-v2/13-review-fixes/header-390.png), [header 390 scrolled](iterations/pixel-v2/13-review-fixes/header-390-scrolled.png); grid audit and source refreshed.



### PX-14 — Design system extraction — 2026-09-09

Timothy: “then do the design system stuff” (Q34, following “start building out the design system. tokens for color type etc. components we can reuse etc.”). He has not answered the inventory’s open decisions, so the structure, the names and four unifications are the assistant’s proposals; decision 0071 records them as such and `docs/design-system.md` lists every one.

**What.** The system moved out of `src/app.css` into `src/lib/styles/` — `primitives.css` (colour, the `--s1…--s16` spacing scale, the three grid cells, the five face stacks, `--tick-cursor`/`--nudge`, and the five breakpoints as a comment because media queries cannot read custom properties), `tokens.css` (paper/fg/accent/on-accent/dim, the two card surfaces, the two Grid-overlay line colours, the six `--z-*` steps, `--gutter`, a declared `--header-height:64px`, `--texture-fallback-opacity`), `base.css`, `type.css`, `chrome.css`, `layout.css`, `blocks.css`. `src/app.css` is now the cell table and seven `@import`s. `src/lib/tokens.ts` carries the same primitives for JavaScript (`INK WHITE YELLOW`, the cells, `TICK_SLOW/TICK_FAST`, `STEP_SLOW/STEP/STEP_FAST`), consumed by `Ascii`, `Decode`, `Picture`, `Clip`, `+layout.svelte` and every call site, so no colour or cadence literal is left in a route. `src/app.html` keeps its inline hex — it runs before CSS — with a comment naming the other two homes.

Nine components were added: `Arrow`, `Cursor`, `Plate`, `Cta` (variants block/row/hint/quiet), `IndexRow`, `MetaLine`, `PageFoot`, `QuietLink`, `Band`. They emit class names; the CSS stays in `blocks.css`, which keeps specificity flat and is what made pixel verification possible. `.xl` (defined three times, three different ladders) became one `.display-xl`; `.display-l` (123px, unused) was retired; `Dither.svelte` and `Ticker.svelte` were deleted after grep confirmed nothing imports them; `Ascii`’s `fadeIn`/`fadeOut` and `Decode`’s `pool`/`once` were removed. Every padding/margin/gap in `src/` is now a `--s*` token, every z-index a `--z-*`, and there is one `@keyframes blink` instead of two. Font sizes and line-heights stayed literal on purpose: they are the cell table.

**Findings.** Four deliberate pixel changes were allowed and each was measured. (1) Unifying `.display-xl` on Work’s ladder makes “building.” 129px instead of 86px between 381 and 700 on Home and Contact. (2) Putting the three `.page-foot` arrows in Press Start like the other seven takes the footer line box from 16px to 18px and the link from 322px to 334px wide, so five pages grow 2px — measured in the browser by swapping the class back. (3) Contact’s ≤700 section padding drops 64 → 48 like every other route. (4) Decode’s cursor became `Cursor.svelte` at **zero pixel cost**, because the component keeps the em-sized geometry the 344px hero needs; an 8×16 block there would have been a 48px caret. Changes 1 and 3 change a band’s height, and `Ascii`’s `fall` field is a function of the canvas row count, so the texture re-seeds through the whole band — that is the bulk of the two 390px diffs, not a separate change.

**Validation.** svelte-check 0 errors / 0 warnings; production build succeeded. Grid audit on seven routes at 1440 and 390: **0 misaligned canvases, 0 fractional or off-table text boxes on all fourteen checks** (Home and Contact at 390 now report `Jacquard 24 129`, still on the table). `overflow3.mjs` at 1100/1000/900: no page overflow (the two hero texture canvases still overhang inside their `overflow:hidden` band, as before). `work.mjs`: no overflow, no console or page errors, every image loaded on Work and the four studies. `video.mjs`: the clip advances with motion on and holds with motion off. Light theme and the no-JavaScript render both captured and both diff at 0.

**Parity.** New harness `tools/review/parity.mjs`. Baseline captured twice and diffed against itself: 0 differing pixels on all 17 captures. After the refactor: Home at 1440 diffs at **0** in dark, light and no-JS; every other diff starts at the page-foot row and is accounted for by the four allowed changes. Full table in the report below.

**Evidence:** `docs/iterations/pixel-v2/14-design-system/` — [parity report](iterations/pixel-v2/14-design-system/parity-report.txt), [grid audit](iterations/pixel-v2/14-design-system/grid-audit.txt), [work footer diff 1440](iterations/pixel-v2/14-design-system/diff-work-1440-foot.png), [work footer diff 390](iterations/pixel-v2/14-design-system/diff-work-390-foot.png), [contact footer diff](iterations/pixel-v2/14-design-system/diff-contact-1440-foot.png), [parc footer diff](iterations/pixel-v2/14-design-system/diff-work-parc-1440-foot.png), [home 390 diff](iterations/pixel-v2/14-design-system/diff-home-390-dark.png), [contact 390 diff](iterations/pixel-v2/14-design-system/diff-contact-390-dark.png), [home light](iterations/pixel-v2/14-design-system/home-1440-light.png), [home no-JS](iterations/pixel-v2/14-design-system/home-1440-nojs.png), [source](iterations/pixel-v2/14-design-system/source.zip). The system as built is documented in `docs/design-system.md`.


### PX-15 — Mobile chrome: status strip and footer — 2026-09-09 (0072, 0073)

Timothy asked to rethink the status strip for tablet and mobile and then the footer on mobile. Built on PX-14, in the chrome layer only (`src/lib/styles/chrome.css`, `src/routes/+layout.svelte`).

- **Status strip.** The five items needed about 1,040px at 16px Press Start, so every tablet clipped the right end and phones fell to 8px type. The strip now keeps 16px and sheds by priority: ≤1100 coordinates, ≤900 Denver and SYS.OK plus a short path (`~/…/<slug>`), ≤420 the clock. Measured at eleven widths on Home and the Do Androids Dream study: every visible item inside the gutters everywhere; the long slug clips inside its own box by 9px at 375 and 64px at 320 only. Two steps moved from the proposal after measuring (SYS.OK joins the ≤900 step; the clock step is 420, not 400).
- **Footer.** Below 700px the three toggles are a settings list — 32px rows, label left, state right — above the copyright line. Footer 184px on the unit; nothing wraps at 320. The button markup wraps the state in a span; desktop is unchanged.

**Validation:** svelte-check 0/0; build ok. Grid audit 0 misaligned canvases, 0 fractional or off-table text boxes on all fourteen checks, and no 8px Press Start remains anywhere. `overflow3.mjs`: no page overflow at 900–1100; `work.mjs`: no overflow, no errors, all images loaded on eleven captures. Parity against the PX-14 build (`tools/review/parity.mjs`, baseline rebased to PX-14’s after-captures): all ten desktop captures 0 pixels; the seven phone captures differ only from the footer’s top row down (page +24px). The strip sits inside the harness’s clock mask, so it was verified by measurement and the captures below rather than by the diff.

**Evidence:** `iterations/pixel-v2/15-mobile-chrome/` — strip crops at 1024/768/390/320 on Home and the long-slug study ([390 study](iterations/pixel-v2/15-mobile-chrome/strip-390-dad.png), [768 study](iterations/pixel-v2/15-mobile-chrome/strip-768-dad.png)), footer before/after at 390/320/768 ([before 390](iterations/pixel-v2/15-mobile-chrome/footer-before-390.png), [after 390](iterations/pixel-v2/15-mobile-chrome/footer-after-390.png)), [parity report](iterations/pixel-v2/15-mobile-chrome/parity-report.txt), phone diff images, [grid audit](iterations/pixel-v2/15-mobile-chrome/grid-audit.txt), [source](iterations/pixel-v2/15-mobile-chrome/source.zip).

**Status:** Strip is Timothy’s confirmed direction (0072). The footer list is the assistant’s proposal on his “needs refinement/rethink” (0073), awaiting his look.


### PX-16 — Work rows as index entries — 2026-09-09 (0074)

Timothy: “the plates behind the text feels weird. lets brainstorm a bit”, then “yeah lets go with first” of four options (kill the surface; dither as a mat only; canvas knockout around the type; one solid panel). Built the first.

- `src/routes/work/+page.svelte`: rows are `a.row` (no `.card`), the cover inside a `.frame`, the type plain (`MetaLine`, `h2.display`, `p.body`, quiet CTA). `Plate.svelte` deleted, `.plate*` classes and `MetaLine`’s `plate` prop removed.
- `src/lib/styles/blocks.css`: `.rows` gap 64 (48 ≤900); `.row` no surface, `align-items:start`; `.frame` has a −16px margin and 16px padding so the hover dither (`--surface-card-hover`) draws in the gap while the image keeps the column width; `.cta-quiet` pulled 16px left so its text aligns with the column at rest and the fill starts in the gap on hover.

**Measured at 1440:** image 800×450 at x=32, every text line and the CTA text at x=864, CTA fill from 848 on hover. At 390: image 358 wide, type at x=16, fill from 0. Work 2,596px at 1440 (was 2,540), 2,783 at 390 (was 3,152).

**Validation:** svelte-check 0/0; build ok; grid audit 0 misaligned, 0 fractional on all fourteen checks; no overflow at 900–1100; `work.mjs` no overflow, no errors, all images loaded. Parity against PX-15: fourteen captures at 0 pixels; only the three Work captures differ, from the first row down.

**Evidence:** `iterations/pixel-v2/16-work-rows/` — [1440](iterations/pixel-v2/16-work-rows/1440-work.png), [1024](iterations/pixel-v2/16-work-rows/1024-work.png), [390](iterations/pixel-v2/16-work-rows/390-work.png), hover crops at each width ([1440 hover](iterations/pixel-v2/16-work-rows/1440-hover.png)), [parity report](iterations/pixel-v2/16-work-rows/parity-report.txt), [grid audit](iterations/pixel-v2/16-work-rows/grid-audit.txt), [source](iterations/pixel-v2/16-work-rows/source.zip).

**Status:** Timothy’s chosen direction, built; awaiting his look at the result (the hover mat and unchanged title sizes are the assistant’s calls).


### PX-17 — Design system accepted; token follow-ups — 2026-09-09 (0075, 0076)

Timothy accepted the design system as built (“everything sounds good to me”) and the assistant’s votes on the open items, then asked that the third discipline label stop wrapping on phones.

- **`--accent-text`** (`tokens.css`): yellow in dark, `--yellow-deep` `#6f6200` in light, for every place the accent is type. Fills keep `--accent`.
- **Breakpoints**: 1300 → 1100 for the Work row title; the `.display-xl` phone floor moves 380 → 420. The assistant had proposed cutting the floor; “building.” measures 372px at 129, so it clipped on 375 and 320 phones (and had since PX-14 at 381–404). Now 86 below 420: 248px, fits at 320. “work.” at 129 would have fit (246px) but follows the same ladder.
- **`IndexRow`** counter no longer `aria-hidden` on Home; the prop is gone.
- **“Product”** replaces “Product / front end” in the chip below 700; the word margin drops at ≤420 so “moves. [Motion]” fits the 320 box. Measured: each word and chip on one line at 700, 390 and 375; at 320 the third chip still wraps (one pixel over), accepted. Desktop one line for all three at 1440.

**Validation:** svelte-check 0/0; build ok; grid audit 0 misaligned, 0 fractional on all fourteen checks; no overflow at 900–1100; `work.mjs` no overflow, no errors. Parity against PX-16: 0 pixels on every 1440 dark capture, both Home light and no-JS, and every study; `work-1440-light` differs by the deeper yellow only (992 px); the three 390 captures of Home, Work and Contact differ from the `.display-xl` and chip changes down.

**Evidence:** `iterations/pixel-v2/17-system-accepted/` — the statement panel at 1440/390/320, `.display-xl` at 320 on the three pages, light-theme crops of the Work index and a hovered row, [parity report](iterations/pixel-v2/17-system-accepted/parity-report.txt), [grid audit](iterations/pixel-v2/17-system-accepted/grid-audit.txt), [source](iterations/pixel-v2/17-system-accepted/source.zip).



### PX-18 — The full index and four more studies — 2026-09-09 (0077)

Timothy: “i also want to bring in all the other projects. so we need to figure out a good way to display them in teh works page”, then on the mock “studio gridform and gridform studio should be hidden. keep them in code but just not shown. everything else looks good to me”, then “all of them should have case studies. whether theyre the 4 at the top or not”.

**What.** `src/lib/work.ts` is now one `source` array in display order — the selected four, the index four, then the two hidden ones — with `tier: 'selected' | 'index'` and `hidden?: true` on a new `Entry` interface that `Project` extends. Every number is derived: `all` maps the array and hands each visible entry `pad(++seq)`, hidden ones `--`; `studies` is the eight visible (route entries and the Next chain 01 → 08 → 01), `projects` the selected tier, `index` the index tier, `count` `004`, `total` `008`, `last` `08`. The hand-written `n: '01'…'04'` on the existing four is gone, as are the temporary `entries` / `hiddenEntries` exports. `src/routes/work/[slug]/+page.ts` prerenders from `studies`, so all eight have a page.

On Work the selected rows are untouched (0074). Each index entry became `<a class="entry">` inside its `<li>`: number / title at 41 with the one-line body and the same quiet CTA (reserved padding, pulled 16px left so its text aligns with the title, filling yellow on hover, 0065) / year / scope, stacking under 900px. Header `01–08`, `Index 05–08`, footer `End of index / 008`. The entry CSS stays route-local; only the CTA rules reach into the component with `:global()`, anchored on `.entry`.

**Per study.** Content came from `../timothyali/src/routes/work/<slug>/+page.svelte` and `projects.ts`; each overview bullet list became a numbered `list` block, each `ResultsList` an `Outcome`/`Architecture`/`Results` list, each `Quotes` block a `The reaction` list (as PARC’s was in PX-08). American spelling, no new claims.

- **[05] FirstStrike Research** — all ten presentation slides ported, nothing dropped. 20 files, **12.5MB**: 1600px 1x (PNG for the flat slides, JPEG for the four photographic ones) plus an `@2x.jpg` at 2800px for every one, since every source was 3000–4000px on the long side. Cover is the hero at 1600×900. `word` is `firststrike research`.
- **[06] Sonde** — the hero plus the eight gallery screenshots. 9 PNG files at 1600×900, **2.2MB**, no `@2x` (the sources are 1920px, so 2800 would be an upscale). Cover 1600×900. No `live` link: the old study ends “until I shut down the hosted instance”.
- **[07] PARC Website** — all 29 images at their native size (1440×900 desktop, 390×844 phone, three game frames), PNG, **6.3MB**, no `@2x`. Dropped, as PARC’s were in PX-08: the live `SkyGround`, `HangingSign`, `PxButton` swatch row and `ParcBand` components; their surrounding text is kept, with the swatch row’s sentence reworded from “The same parts build this page” to “…build every page on the site” because this page is no longer built from them. Cover cropped top-aligned to 1440×810 with a Playwright clip.
- **[08] Jade Aesthetics** — the old study carried **no images at all**: a `LiveEmbed` iframe of the live site was its only visual, and interactive components are dropped. Its 14 screenshots sit unused in `../timothyali/src/lib/images/jade-aesthetics/`; they are used here so the study is not text-only. That is the assistant’s call, recorded in 0077. 14 JPEG files, **2.9MB**, no `@2x` (sources 1920/1688px). Cover cropped to 1600×900.

**25.2MB added in all**, inside the 40MB ceiling; no video was needed, so `static/work/video/` is unchanged and `video.mjs` was not re-run.

**Findings.**
- **`firststrike research` keeps the pattern.** The full lowercase title measures 1120px at 172 in a 1376px box, so it needs no shortening to `firststrike`; the existing probe steps it to 43px at 390 like `do androids dream?`.
- **A four-up row of phone screenshots breaks the 4px rule.** Jade’s first phone gallery (four 739×1600 shots) measured an 8px height spread at 1100 and 900. `rowColumns()` snaps each column to 2px and gives the remainder to the last one; at an aspect of 0.46 a 3px width error becomes 6.5px of height, and `Picture` floors to 2px on top. Rebuilt as desktop-plus-phone pairs, which also reads better: **2px everywhere at 1440/1100/900**.
- **The index tier has no cover**, so the four new `cover` entries are only data (the type requires one, and they are the natural OG image if that ever lands).
- **Do Androids Dream’s Next now points at FirstStrike**, which is the only pixel change on any existing study.

**Validation.** `pnpm check` **0 errors / 0 warnings** (294 files); `pnpm build` wrote all eight study pages. Grid audit on eleven routes at 1440 and 390: **0 misaligned canvases and 0 fractional or off-table text boxes on all 22 checks**. `titles.mjs`: every title fits at 1440/1100/900/390/375/320 (`ov:false` on all 48), and the largest gallery-row height spread is **4px at 1440, 4px at 1100, 4px at 900** (below 900 rows collapse to one column, as before). `work.mjs`: no page overflow, **0 console or page errors, every image ready and none broken** on all 20 captures — Work 3,544px at 1440 and 4,418 at 390; FirstStrike 7,396 / 6,570 (10 images), Sonde 8,076 / 9,408 (9), PARC Website 17,146 / 19,738 (29), Jade 10,950 / 14,267 (14); `currentSrc` is the 1600px file at 1440 with the 2800px file reserved for dense screens. `overflow3.mjs` at 1100/1000/900: no page overflow on the studies (the two Home hero canvases still overhang inside their `overflow:hidden` band, as before).

**Parity** against the build taken before this pass (`tools/review/parity.mjs before` → `after` → `diff`), 17 captures, **12 at 0 pixels**:

| capture | before > after | differing | cause |
|---|---|---|---|
| `home-1440-dark` / `-light` / `-nojs`, `home-390-dark` | unchanged | **0** | — |
| `contact-1440-dark`, `contact-390-dark` | unchanged | **0** | — |
| `work-parc-1440` / `-390` | unchanged | **0** | — |
| `work-xrpcafe-1440` / `-390` | unchanged | **0** | — |
| `work-firstledger-1440` / `-390` | unchanged | **0** | — |
| `work-do-androids-dream-1440` | 4728 | 752 (0.011%), first row 4537 | the Next row: `[01] PARC` → `[05] FirstStrike Research` |
| `work-do-androids-dream-390` | 4541 > 4573 | 29,920 (1.68%), first row 4217 | same, and the longer title wraps (+32px) |
| `work-1440-dark` / `-light` | 3320 > 3544 | 394,651 / 394,635 (7.73%), first row 2691 | the index tier gains four “View case study” CTAs (+224px) |
| `work-390-dark` | 4194 > 4418 | 159,223 (9.24%), first row 2816 | same |

The four new studies have no `before` image, so they are absent from the table; `diffAll` iterates the `before` directory. The footer count did **not** change — the mocked index in PX-17 already derived `008`.

**Evidence:** `iterations/pixel-v2/18-full-index/` — [work 1440](iterations/pixel-v2/18-full-index/work-1440.png), [work 390](iterations/pixel-v2/18-full-index/work-390.png), [FirstStrike 1440](iterations/pixel-v2/18-full-index/work-firststrike-1440.png), [FirstStrike 390](iterations/pixel-v2/18-full-index/work-firststrike-390.png), [Sonde 1440](iterations/pixel-v2/18-full-index/work-sonde-1440.png), [Sonde 390](iterations/pixel-v2/18-full-index/work-sonde-390.png), [PARC Website 1440](iterations/pixel-v2/18-full-index/work-parc-site-1440.png), [PARC Website 390](iterations/pixel-v2/18-full-index/work-parc-site-390.png), [Jade 1440](iterations/pixel-v2/18-full-index/work-jade-aesthetics-1440.png), [Jade 390](iterations/pixel-v2/18-full-index/work-jade-aesthetics-390.png), [grid audit](iterations/pixel-v2/18-full-index/grid-audit.txt), [title/gallery report](iterations/pixel-v2/18-full-index/titles.txt), [parity report](iterations/pixel-v2/18-full-index/parity-report.txt), [Work diff](iterations/pixel-v2/18-full-index/diff-work-1440.png), [Do Androids Dream Next diff](iterations/pixel-v2/18-full-index/diff-dad-1440-next.png), [source](iterations/pixel-v2/18-full-index/source.zip). Capture script: `tools/review/px18.mjs`.

**Status:** Timothy’s direction, built. The per-study block order, the gallery pairings, the `word` values and Jade’s screenshots are the assistant’s calls and are awaiting his look — as is the whole Work/case-study treatment (Q28, Q31).


### PX-19 — PARC Pixel — 2026-09-10 (0078)

Timothy’s typeface replaces Jersey 25 (display) and Silkscreen (labels); Jacquard 24, Jersey 15 and Press Start 2P stay. Built from the six original cuts by `tools/fonts/extend-parc-pixel.py` (fonttools in a venv): seven missing glyphs drawn on each weight’s grid, a new ampersand in every cut (mirrored 3 with top and bottom stubs; per-weight offsets settled with Timothy over five rounds), and the Bold regridded to an 80-unit cell on an 1100 em. Specimens: [glyphs](iterations/pixel-v2/19-parc-pixel/specimen-glyphs.png), [ampersand](iterations/pixel-v2/19-parc-pixel/specimen-ampersand.png).

- **Roles.** `.display` 55/56 → 41.25/48; `.display-s` 41.25/48 → 27.5/32; `.lbl` 12.5/16. Home statement 55/64 (41.25/48), its work statement line-height 88 for the inline 86px blackletter (48 with 43 on phones); Work row title 41.25 ≤1100, 27.5 ≤420; index range 25/32. `@font-face` in `base.css`, faces in `primitives.css`, cell table in `app.css` and the audit’s table extended.
- **Findings.** Bold advances were rounded font units (945 for 13 cells), so at 55px a glyph advanced 51.975px and inline spans after bold text sat on fractional pixels (grid audit: 7 boxes) — fixed at the source by rescaling the Bold. The Work page overflowed phones by 135px: “FIRSTSTRIKE” is 429px at 41.25 in the index entry column; entries now stack the number above the title below 700 and `.display-s` steps to 27.5 there. At 320 “ANDROIDS” (312px) overflowed a row title; row titles step to 27.5 below 420. The statement’s `<br>` after “don’t” landed after a natural wrap at 55 and is removed. Labels are 30% wider than before; the three discipline chips still fit one line at 1440 (measured).
- **Not changed.** The status strip (Press Start), body and lead (Jersey 15), every blackletter size.

**Validation:** svelte-check 0/0; build ok. Grid audit on eleven routes at 1440 and 390: 0 misaligned canvases, 0 fractional or off-table text boxes (22/22). No page overflow on Work at 390, 375 or 320 after the fixes; fonts loaded on every page (`document.fonts` lists both PARC Pixel Web faces); no console or page errors. `work.mjs`: 19 captures, no overflow, no errors, no broken images, every image loaded. `titles.mjs`: no title overflow at any of the six widths on any of the eight studies; gallery row height spread ≤4px wherever rows are multi-column (the large spreads reported at ≤390 are stacked single-column rows, as before). `overflow3.mjs`: no page overflow at 1100/1000/900.

**Evidence:** `iterations/pixel-v2/19-parc-pixel/` — full pages at 1440 and 390 for Home, Work, Contact and PARC ([home 1440](iterations/pixel-v2/19-parc-pixel/1440-home.png), [work 1440](iterations/pixel-v2/19-parc-pixel/1440-work.png), [work 390](iterations/pixel-v2/19-parc-pixel/390-work.png)), crops of the statement panel, a study head and text section, a hovered row, the two specimens and `specimen.html`, [grid audit](iterations/pixel-v2/19-parc-pixel/grid-audit.txt), [source](iterations/pixel-v2/19-parc-pixel/source.zip) (includes `tools/fonts/` and `static/fonts/`).

**Status:** Timothy’s direction, built; awaiting his look at the pages (the one open nit: at 1440 the statement’s fourth line is the single word “IT”).

**Correction (2026-09-10, Timothy, decision 0079):** “i think these should be parc pixel bold” on the study title. The `h1` is now `.display` at 110/112 (82.5 ≤1100, 55 ≤900, 41.25 ≤700), wrapping between words, with the probe measuring the longest word and stepping the visible text one cell down when it would not fit. First pass put the step on the `h1` itself, so the probe measured the stepped size, found it fit and stepped back up — an oscillation the capture harness caught as an element that never became stable; the step now applies to the Decode span only, and `fit` also re-runs on `document.fonts` `loadingdone`. Verified: `titles.mjs` no overflow on eight studies at six widths (FIRSTSTRIKE and AESTHETICS at 27.5 on phones); grid audit 0/0 on 22 checks. Captures: [firststrike head 1440](iterations/pixel-v2/19-parc-pixel/head-1440-firststrike.png), [390](iterations/pixel-v2/19-parc-pixel/head-390-firststrike.png).


### PX-20 — Pocketwatch back in the index — 2026-09-10 (0080)

Timothy: “wheres pocketwatch?” … “i didnt want it removed, just not in the 4 selected works”. 0055 had been the assistant’s misreading; the PX-08 archive did not hold the study either (it was refreshed after the removal), so the study was re-ported from the old site: copy in full (six text sections, two lists), thirteen PNGs at up to 1600px (3.6MB, sources were 1200–1920px so no `@2x`), the square hero beside the campaign banner as a two-up hero row, the five product screens and six campaign ads as aspect-matched gallery rows. Index entry 09; counts run to 009; the Next chain closes 09 → 01. Review scripts’ route lists now include it.

**Validation:** svelte-check 0/0; build writes nine studies. Grid audit twelve routes × 1440/390 = 24 checks: 0 misaligned, 0 fractional. Pocketwatch at 1440 and 390: 13/13 images loaded, no errors, no overflow, gallery row spread ≤2px at 1440. `titles.mjs`: no title overflow on nine studies at six widths. Footers read `[09] / 009` and `End of index / 009`.

**Evidence:** `iterations/pixel-v2/20-pocketwatch/` — [study 1440](iterations/pixel-v2/20-pocketwatch/1440-pocketwatch.png), [study 390](iterations/pixel-v2/20-pocketwatch/390-pocketwatch.png), [work 1440](iterations/pixel-v2/20-pocketwatch/1440-work.png), [work 390](iterations/pixel-v2/20-pocketwatch/390-work.png), grid audit, titles, [source](iterations/pixel-v2/20-pocketwatch/source.zip).



### PX-21 — Contact composition — 2026-09-10

Timothy requested making Contact more visually interesting after review of the design-system updates. Assistant proposal implemented: an asymmetric composition with a small yellow “Let’s talk” label, PARC Pixel lead, centered oversized Jacquard “building.”, and an inverted contact panel offset right. One continuous rain field surrounds the composition; the copy and LinkedIn action share a quiet solid surface. A grid-drawn directional arrow points toward the contact panel. Mobile stacks the composition and keeps the action directly below the copy. Existing contact method and main copy retained.

Uses the accepted tokens and Band, Decode, Cta, Arrow, PageFoot components. New layout is local to Contact. Captures and previous source: `docs/iterations/pixel-v2/21-contact/`. Checked 1440/390/320 in dark and light themes with no horizontal overflow; Svelte check 0/0 and build passed. Implementation proposal, awaiting Timothy’s visual review.

### PX-22 — Landing selected work and closing footer — 2026-09-10 (0081)

Timothy requested a review and cohesive refinement of Selected work and the landing footer, preserving the accepted system, four projects and current copy, followed by implementation, verification and documentation. Read the project guidance, design-system reference and recent iterations before examining the implementation and desktop/mobile captures.

**Review.** The card dither carried behind captions; 16px between cards matched the internal spacing, weakening grouping. The mobile introduction broke into a tall stack before the first cover. The desktop invitation separated its headline from a full-width action, and the utility footer had small 32px phone rows without distinct state colour (the existing accent rule targeted a nonexistent `b`).

**Proposal implemented.** Cards keep their 16px dither image mat but have solid captions and 32px column / 48px row gaps. Columns snap to 8px; native-resolution pictures still snap their height to 2px. Caption rows align at their tops, including the longer fourth title. Card titles use the existing 27.5/32 cell size through 900px so the narrow two-column interval also fits. Mobile introduction uses 27.5/40 Bold with 43px blackletter. All work now reuses Cta’s quiet variant on the right column; the invitation pairs its two typefaces across the wide desktop composition and wraps when needed, with Get in touch below on the same right column. Both actions are full width on phones. Home-only footer variant: three grid-snapped controls, accent state text with legible hover/focus inversion, 48px phone rows, balanced copyright. No new copy, assets, fonts, tokens, breakpoints or motion were introduced. All four selected projects remain in the same order.

**Files.** `src/routes/+page.svelte` for composition; `src/lib/styles/blocks.css` for the card block (only Home uses it); `src/routes/+layout.svelte` adds the Home footer class; `src/lib/styles/chrome.css` owns its styling. Inner-page footers keep their existing layout. Before source is preserved in the evidence directory.

**Validation.** Svelte check 0 errors / 0 warnings; static production build passed. Dark and light captures at 1440, 900, 700, 390 and 320, all four images decoded and correct four links, no page exceptions. Layout sweep at 320/375/390/420/700/701/768/900/1100/1200/1440; refined sections fit. Keyboard Enter toggles Motion, Grid and Theme and each state persists across reload. Keyboard card activation reaches PARC; All work and Get in touch navigate correctly. No-JavaScript checks at 1440/390 retain four cards and the Contact link. Grid audit: twelve routes at 1440 and 390, 24 checks, zero misaligned canvases or fractional/off-table text boxes. Raw reports are saved alongside captures.

**Existing limitation.** The unchanged `.who .display` introductory statement above Selected work has a 327px inline box starting at x16 at 320px (right edge 343). This causes page overflow in both the baseline and final capture. It is outside this refinement; no clipping workaround was applied. Hero typography is also unchanged. Technical verification is not visual acceptance.

**Evidence:** `iterations/pixel-v2/22-home-work-footer/` — `before-*` and `after-*` section crops for five widths and both themes, `focus-card.png`, `nojs-*`, JSON reports, build/check/grid logs and `before-source/`. Crops hide the sticky nav to avoid covering the section and await image decoding; no-JS full-page captures keep chrome visible. Reproducible capture and interaction scripts: `tools/review/px22.mjs` and `px22-interact.mjs`.

**Status:** Implemented assistant proposal, awaiting Timothy’s visual review.

### PX-23 — Favicon and social previews — 2026-09-10 (0082)

**Request.** Timothy set aside further landing type experiments and requested a favicon update and Open Graph images. The starting site had one yellow favicon and no social metadata.

**Implemented proposal.** A white Jacquard t plus yellow cursor on ink, derived from the real 43px glyph and stored as SVG cells so it has no font dependency. SVG, multi-resolution ICO (16/32/48), standalone PNG sizes and 180px Apple touch icon. Twelve 1200×630 share images: Home’s “i’m tim.” and existing positioning sentence; Work’s selected four-cover collage; Contact’s existing “Tell me what you’re building.”; nine case studies with their existing title, scope, year and cover. Consistent wordmark, sparse seeded pixel field, small yellow label and footer. Covers remain full colour; typography follows the existing cell sizes. Images range from roughly 7KB to 487KB.

`tools/social/generate.mjs` uses local fonts, work data, colour primitives and Playwright; no new package or runtime service. `pnpm social:generate` regenerates all assets. `src/lib/social.ts` maps the 12 routes and retains the previous site's public `https://www.timothyali.com` origin. `SocialMeta.svelte` adds canonical, OG title/description/url/image/type/locale/site-name/dimensions/alt and Twitter large-image metadata. The layout includes it once; route document titles and descriptions are untouched. `src/app.html` references the new icon formats. Unknown routes do not inherit misleading Home metadata. Protocol reference: [Open Graph](https://ogp.me/).

**Validation.** Svelte check 0 errors / 0 warnings; production build passed. `pnpm social:verify` checked the prerendered HTML and shipped PNGs for all 12 routes: exactly one expected image URL, matching Twitter image, canonical/public URL, nonempty descriptive fields, 1200×630 dimensions, and all icon files present; ICO header contains three sizes. Browser navigation Home → PARC → Contact updates one OG image tag correctly; icon and image endpoints return HTTP 200; no page exceptions. Inspected Home, Work, Contact, representative study images and the complete 12-image contact sheet. No live-platform cache or deployment verification is claimed.

**Evidence.** `iterations/pixel-v2/23-social/`: [all twelve images](iterations/pixel-v2/23-social/contact-sheet.png), previous favicon/app template in `before-source/`, asset size inventory, generation/build output, HTML verification and navigation JSON. Shipped images are `static/og/*.png`; regeneration and verification instructions are in `tools/social/README.md`.

**Status.** Built locally, assistant visual proposal awaiting review; no page type experiments or deployment.

**PX-23 favicon correction (2026-09-10):** Timothy requested an uppercase T from the same font on yellow. Regenerated SVG, 16/32/48 PNG and ICO, and 180px touch icon using the actual Jacquard uppercase T in ink on yellow; removed the cursor. Generator and regeneration documentation updated. Inspected the 180px output. Previous icon saved under `23-social/favicon-uppercase-before/`; OG compositions unchanged.

### PX-24 — Terminal social posters — 2026-09-10 (0083)

**Request.** Timothy found the first social images boring next to the site: match its terminal aesthetic, larger type.

**Refinement.** Regenerated all twelve images as terminal compositions. Replaced the sparse dot pattern with falling columns drawn from `src/lib/glyphs.ts` (the actual 5×7 site texture glyphs, rendered at 2px). Added Press Start 2P for the 16px terminal header and yellow path/action strip. Home's Jacquard headline grows 258 → 344, with 55px supporting text. Contact combines 82.5px uppercase with 344px blackletter. Work combines large “Selected / work.” type with the four-cover grid. Every study title uses 82.5/88 PARC Pixel over the top of the composition; long titles wrap to two lines, with a per-line ink knockout. The cover anchors the lower right at 608×342, full colour; the left holds a yellow index, scope and year. Existing favicon and public metadata mapping retained. These images are static share artwork, not changes to the website layout.

**Visual check.** Inspected the full contact sheet plus full-size Home, Contact and FirstStrike. Contact's initial 344px descender met the yellow footer; moved the blackletter up 48px so the complete word clears it. Old images and generator are saved in `24-social-terminal/before/`. Restored the PX-23 contact sheet to its original artwork after producing the comparison.

**Validation.** Production build passed; all twelve prerendered pages still carry their correct unique image and canonical URLs, dimensions and descriptive tags. `pnpm social:verify` passed for all PNGs and icon formats. No metadata component or route code changed. Generation remains deterministic and local, with no new dependencies or live deployment.

**Evidence:** [revised set](iterations/pixel-v2/24-social-terminal/contact-sheet.png), `before/`, `assets.json`, `generation.txt`, `build.txt` and `verification.json` in `iterations/pixel-v2/24-social-terminal/`. Generator: `tools/social/generate.mjs`; `proof.mjs` accepts input directory and output path for old/new contact sheets.

**Status.** Implemented on Timothy’s direction; assistant compositions await visual review.

### PX-25 — Share images rendered by the site — 2026-09-10 (0084)

**Request.** Timothy: “need to make new opengraphs that actually match the aesthetic and the vibe of the site.” Third pass; the PX-24 posters were a hand-drawn imitation (an invented header bar and yellow footer strip, a sparse placed-by-formula character sprinkle in place of the ASCII field, a clipped Contact headline).

**Change of method.** Stopped imitating the site and rendered the images with it. A dev-only route, `src/routes/og/[id]/`, composes each 1200×630 image from the real components: the layout's own header and status strip (numbered nav with the active state, `~/tim/…` path with the cursor, Denver, the clock, SYS.OK), a `Band` with the canvas ASCII field and its knockout, and the page's blocks at desktop cell sizes. Home is the hero at share size: “Designer for teams that don’t have one yet.” at 41.25/48 over the sky field, “i’m tim.” at 344 with the em cursor. Work is the page head (“work.” at 258, the accent project index) with the selected four as cards. Contact is the page's head: the Let’s talk chip, “Tell me what you’re” at 55/64, “building.” at 258, on its rain. Each study is a Work row: the cover at three fifths with the dither frame, the meta line, the title in PARC Pixel Bold with the study page's fit rule (a word that will not fit drops the title to 41.25/48 — FirstStrike, Pocketwatch), the description in Jersey, the quiet View case study arrow. The layout gained a `chromePath` page-data override so the chrome reflects the page being pictured rather than `/og/…`; nothing else on the site changed.

**Generator.** `tools/social/generate.mjs` now starts a Vite dev server, sets motion off and theme dark before any script runs, freezes the clock at `MT 12:00:00` with Playwright's clock, hides the coordinates on the nine study images (what the strip does ≤1100, so a long slug never clips at 1200), waits for fonts, images and the drawn canvas, and screenshots. Favicon generation is unchanged. The route declares no entries, so it is not crawled and does not ship; `svelte.config.js` handles it as the one permitted unseen route and still fails the build on any other. Vite binds IPv6 by default, so the server is pinned to `127.0.0.1`.

**Validation.** Svelte check 0 errors / 0 warnings. Production build passed; `build/og/` holds exactly the twelve PNGs and no route pages. `pnpm social:verify` passed (metadata, dimensions, icons). Browser navigation Home → PARC → Contact still updates a single image tag; assets return 200. Inspected the contact sheet and Home, Work, Contact, FirstStrike, Pocketwatch, Sonde at full size. Image sizes 9KB–448KB.

**Evidence.** `iterations/pixel-v2/25-social-site/`: [new set](iterations/pixel-v2/25-social-site/contact-sheet.png), `before/` (PX-24 images, their contact sheet and generator), `assets.json`, `build.txt`, `verification.json`, `navigation.json`.

**Status.** Timothy’s direction implemented; compositions await his visual review.

### PX-26 — SEO pass — 2026-09-10 (0086)

Sitemap, robots pointer, JSON-LD (Person/WebSite, breadcrumbs, CollectionPage, CreativeWork per study), author meta, an in-system 404 page, and preloads for the five fonts. Audit and decisions in 0086. Svelte check clean, build passed, `social:verify` extended and passing; verified live after deploy (see the decision’s status).

### PX-27 — Pixel-grid audit and fixes — 2026-09-10 (0089)

Three-agent audit (built site, OG compositions, static read), then fixes across type, chrome, figures and the share frame until every text box is on whole pixels, every canvas on its cell and every block top on the 8px unit at 1440/1100/1000/700/390. New `tools/review/blocks.mjs`; `gridcheck.mjs` extended. Rules recorded in `docs/design-system.md` → *Staying on the unit*.

### PX-28 — Field recessed, one accent, shaded by weight — 2026-09-10 (0091)

**Request.** Timothy: bring the ASCII field treatment from GRIDFORM Studio over. The app’s `Ascii.svelte` was this site’s, ported on 2026-09-10, so the code lifted straight back with only the import paths changed.

**Change.** `--field-ink` token and `.band-bg { color }` recess every field to 40% of the foreground over paper. `field()` marks one hot thing per mode (droplet head, scan line, band crest, noise and sky peaks) and the pointer’s heat and click ring, all drawn in `--accent-text`. `shade` on `Ascii` and `Band` builds a sprite set per ramp step, the accent on top and the rest sinking toward paper in oklab; on for the hero sky (density 1.3), the Home and Contact rain, and the share-image bands (scan excepted). The 404 `sparse` field stays flat. One fix over the app’s version: the colour probe is created lazily, since the site prerenders.

**Visual check.** Before/after crops of the hero, the Home rain, Contact and the 404 band at 1440 in both themes and at 390 (`fields.mjs`). The sky now sits behind “i’m tim.” in grey steps with a single yellow crest top right; the rain shades from a yellow head down its trail; on the light ground the field is a pale grey and the accent deepens to `--yellow-deep` as everywhere else. Share images regenerated and inspected on the contact sheet.

**Validation.** Svelte check 0/0; build passed; `parity.mjs`: 27 captures, 6 differing (Home dark/light/390, Home no-JS, Contact 1440/390), every one starting at row 140 (the first field) and none changing size; the Work page and nine studies identical. `pnpm social:verify` passed. `blocks.mjs` 0 on Contact at every width; `gridcheck` canvases aligned.

**Evidence.** `docs/iterations/pixel-v2/28-field-shade/`: `before/` and `after/` crops, `pair-*.png` stacked comparisons (before above, after below), `parity.txt`, the regenerated `contact-sheet.png`, and the previous Home/Contact/PARC share images in `social-before/`. The generator also refreshed the story and wide launch stills in `docs/social/`; it rewrote PX-25’s `assets.json` too, which was restored so that evidence stays as it was.

**Status.** Assistant port on Timothy’s direction; awaiting his eye on the hero crest. Site and app `Ascii.svelte` are now meant to stay in step.

### PX-29 — Contact form: block caret and validation notes — 2026-09-10 (0092)

**Request.** Timothy, mid-PX-28: a custom cursor that fits the site for the contact section; then, on the browser’s “Please fill out this field.” bubble: “these need to be customized as well”.

**Change.** `src/lib/caret.ts` (an action) puts the site’s 8-wide, line-tall accent block at the insertion point of each field, blinking with the other cursors while motion is on. Native caret transparent. The form runs `novalidate`; on submit, note chips in the label face appear under the wrong fields, the first takes focus, `aria-invalid`/`aria-describedby` are set, and typing clears a note.

**Visual check.** Panel captures with text typed in both themes and both motion modes (`caret.mjs`), and the empty-submit and bad-address states (`validate.mjs`). Three rounds to get it right: the marker span first reported the font’s content box (caret 2px low → inline-block marker one line tall); blurred fields kept their block (`hidden` lost to the `.cursor` display rule, and Svelte pruned a `[hidden]` selector → inline display); the note chip inherited the label’s dim (→ `.field .note { opacity: 1 }`).

**Validation.** Svelte check 0/0; build passed. Caret box 8×32 at (16, 8) in an empty 48-tall input and on the third line (y 72) of a wrapped textarea; `animation-name: blink` only with motion on; only the focused field shows one. Empty submit: three notes, focus on Name, three `aria-invalid` fields each described by its note, no POST sent; bad address: one note on Email. Contact block tops 0 off the unit at 1440/1100/700/390.

**Evidence.** `docs/iterations/pixel-v2/29-contact-caret/`: `form-{theme}-{motion}[-home|-name].png`, `notes-{theme}-{empty|email}.png`.

**Status.** Assistant proposal on Timothy’s two asks; awaiting his eye.

### PX-30 — Toolbox: one product, four live examples — 2026-09-10 (0093)

**Request.** Timothy found Toolbox cluttered, indistinct and hard to follow. He asked for a cleaner second landing page and proposed showing real app components instead of a stack of screenshots.

**Refinement.** Rebuilt `/toolbox/` around a large blackletter hero with the shared shaded ASCII bands, a single four-tool selector, and a two-column product story/live example. A short inverted App/CLI/MCP band and a release-status section complete the page. The landing page now has zero raster images instead of five; the measured default desktop page drops from 5,064 to 2,592px, and the 390px phone page from 4,800 to 3,536px. Tool detail pages, catalog descriptions, CLI/MCP docs and the waiting-on-signing status remain intact. New headlines and page copy are assistant proposals.

**App reuse.** Copied the app’s Toggle, PlateToggle and SwatchDot components into `src/lib/components/toolbox/` with provenance in its README. `ToolDemo.svelte` composes those controls into four lightweight examples: Acorn logo treatment switches; three palettes with generated CSS; an editable type specimen using the site fonts; and a format/size illustration. The Acorn mark and poster are authored SVG/CSS. These examples do not run the desktop export engine; each carries an example label and the page says to export in the app. No app source was edited.

**Responsive and visual checks.** Inspected full pages at desktop and 320px plus individual demo views. Phone selectors use the label face to keep the names legible in two columns; grid tracks allow content to shrink. Shortened the Specimen heading and phone workflow heading size after narrow-screen checks. Centered the logo on whole pixels and its block on the 8px unit; palette columns round to the same unit. Captured all four demos in both themes, including edited states. The evidence hides sticky navigation in component-only crops so it cannot obscure the preview.

**Validation.** `pnpm check` reports zero errors/warnings; production build passes. `toolbox-demo.mjs` verifies 48 tool/theme/width combinations (1440, 1100, 900, 700, 390, 320), keyboard tool selection, control changes, each detail link, no horizontal overflow, and no browser page errors. A no-JavaScript check confirms all four detail links remain available. Full-page captures cover five widths in both themes with motion off. The targeted block audit reports zero block tops off the 8px unit for the default preview at six widths; these checks support implementation, not visual acceptance.

**Evidence.** `docs/iterations/pixel-v2/30-toolbox-landing/`: `before/` includes old source and full-page captures; `after/` contains the revised pages and measurements; `demos/` contains interactive-state captures and the 48-state report. `grid.txt`, `check.txt`, `build.txt`, and repeatable scripts in `tools/review/toolbox-{landing,demo}.mjs` record verification.

**Status.** Local implementation on Timothy’s direction; layout, sample artwork and new copy await his review. No commit, push or deployment.

**PX-30 logo correction (2026-09-11):** Timothy requested “acme” instead of “acorn” and pixel art to match the font. Renamed the visible wordmark, accessible label and output treatment name to Acme. Replaced the curved acorn SVG with an authored stepped A monogram on a 32-cell grid, rendered at 3px per cell on desktop and 2px on phones, matching the Jacquard text’s cell scale. The existing background and monochrome controls still color the mark via `currentColor`. Inspected desktop/390px captures, confirmed no horizontal overflow, and ran Svelte check (0 errors/warnings). Source before and updated screenshots: `30-toolbox-landing/acme/`. Name/pixel direction is Timothy’s; the A drawing is the assistant’s interpretation.

### PX-31 — Toolbox: the four examples, polished — 2026-09-11 (0094)

**Request.** Timothy: the Codex build of `/toolbox/` (0093) is “in a decent spot but needs polish”; refine the mocks/demos and do an overall design review.

**Review.** Page structure kept whole. Findings were in the example card: it sat 16px inside the picker's right edge with a dither-on-dither bottom row; the Acme lockup was 21px off centre in a fixed box and its A read as an arch; the specimen's alphabet ignored the chosen face and offered two faces; Convert's half size was a 32px change; two hand-made cursors stood in for the site's `Cursor`.

**Refinement.** Card flush with the picker, wrap removed. Lockup box 358 with the mark and word at its ends, on whole pixels and the unit. A redrawn with legs, counter and crossbar on the 32-cell grid. Specimen in all four site faces at cell-table sizes, alphabet in the chosen face, Bold sheet uppercase, block caret in the line field. Poster authored at 256×320 and 128×160 (192/96 on phones) so half size is half and both are whole cells; output row names file and size. Shared `Cursor` in the card bar and the terminal. Luminance-based swatch labels, tool names in the bar, Mono / Colour / Reversed output name.

**Validation.** `pnpm check` 0 errors 0 warnings; build passes; `toolbox-demo.mjs` 48/48; `toolbox-landing.mjs` no overflow at 1440/900/700/390/320 both themes; new `tools/review/toolbox-grid.mjs` 0 block tops off the unit and 0 fractional text boxes across 24 tool/width states. Inspected each tool at 1440 and 390 in the browser, including Jacquard / PARC Bold / Press Start sheets and the caret.

**Evidence.** `docs/iterations/pixel-v2/30-toolbox-landing/`: `demos/` and `after/` recaptured, `grid.txt`, `check.txt`.

**Status.** Proposal on Timothy's polish request; awaiting his eye. Not committed.

### PX-32 — Toolbox: the four tool screens, in miniature — 2026-09-11 (0095)

**Request.** Timothy on the 0094 demos: they don't look like the app, don't function like it, and don't abstract it in a way that shows what the tools do. His examples: Lockup's file tree and output-file buttons, Convert's compression slider and file-type selectors.

**Refinement.** Each example rebuilt as that tool's own screen: readout strip, stage beside a 376px rail, bottom bar, from the app's blocks (`demo.css`) and its logic (`plan.ts`: export plan, tree, palette exporters, OKLCH). Lockup: live file count and the exact folder tree; Palette: colour rows, outputs, previewable files; Specimen: two templates over the four site faces; Convert: real in-browser encoding with measured sizes. Details in 0095.

**Validation.** Check 0/0, build passes, `toolbox-demo.mjs` 48/48 (rewritten), `toolbox-grid.mjs` 0 off-unit blocks and 0 fractional text boxes across 24 states, `toolbox-landing.mjs` no overflow at 1440/900/700/390/320 both themes. Captures reviewed at 1440, 390 and 320. The hero ladder gained a 900 step after the audit found the 258px word clipped between 700 and 890.

**Evidence.** `docs/iterations/pixel-v2/30-toolbox-landing/`: `demos/`, `after/`, `grid.txt`, `check.txt`.

**Status.** Proposal on Timothy's direction; awaiting his eye. Not committed.

### PX-33 — Agents page restructured — 2026-09-11 (0096)

Timothy: the layout looks bad. Rebuilt `/toolbox/agents/` on the tool page's shape: two-column intro with the binary paths as meta; each section explanation left, material right; the three machine modes as three sections; the rules as one definition list. Grid clean and no overflow at six widths. Details in 0096. Proposal, uncommitted.

### PX-34 — Every button's ink centred — 2026-09-11 (0097)

Timothy: check every button, the text inside must actually be centred. New `tools/review/buttons.mjs` measures the ink in each button's screenshot; 172 of 178 were 1px high and 1px left from the label face's line placement and trailing bearing. Fixed as padding on every button block, heights unchanged; the block audits skip in-button text. Rule recorded in `docs/design-system.md` under *Staying on the unit*. Proposal, uncommitted.

### PX-35 — Native smooth scrolling — 2026-09-11 (0098)

Timothy asked for smooth scroll. Native `scroll-behavior: smooth` on the root, gated by the motion toggle; route changes stay instant via `beforeNavigate` / `afterNavigate` in the layout. Inertial wheel-hijacking libraries rejected for blurring bitmap type on fractional positions. Measured both toggles. Accepted with PX-36.

### PX-36 — The tactility pass — 2026-09-11 (0099–0107)

Timothy: “what else can we do to really refine the tactility and visual polish of the site?” — nine items approved as a list, built as one pass on top of 0098. The system's gap was not motion but the moments still handled by browser defaults: press, theme flip, image arrival, navigation, focus, the scrollbar. Each now uses the grammar of cells and dither: every press is the accent (0099); the theme flips through a three-step dither wipe (0100) and images arrive through the same one (0101); the readout's path decodes on a route change (0102) and reports the scroll offset in cells (0105); the pointer over a field is a bitmap crosshair (0103); a route change dithers out to the field and in again, six fast steps (0104); one focus ring in the accent on either ground, with a token for the accent on a panel (0106); the page scrollbar is a dithered track with a cursor-block thumb (0107). Motion [off] is instant everywhere. New `tools/review/tactility.mjs` freezes the wipes mid-frame and holds the mouse down on seventeen controls; block, Toolbox and button audits re-run. Accepted and pushed the same night.

Timothy, same day: the field's yellow differed between themes. `.band-bg` now sets `--accent-text` to `--accent`, so the fields draw the brand yellow on the light theme too, then “slightly darker” on seeing it: `--accent-field`, `#c8ac00` on the light theme, his pick of five rendered steps; type inside a band still deepens (0108, accepted).
