> Done 2026-09-09. PX-07 was built and then revised the same day (decisions 0052–0053). For the current state read `docs/handoff-px07-review.md`.

# Handoff — build PX-07

Written 2026-09-09 before a context reset. Read this first, then `docs/alternate-v2.md` (editing map), then decision 0051 and the critique it accepts.

## State of the site (PX-06 + same-day corrections)

- SvelteKit static site, `pnpm dev` (port from `PORT`, else 5173; `.claude/launch.json` has autoPort), `pnpm check`, `pnpm build` → `build/`. Node 26, pnpm 10. Nothing deployed.
- Black ground / off-white type by default, light theme via footer toggle, yellow `--accent` in exactly three places (block cursors, active nav, primary actions). Tokens in `src/app.css`, early-paint theme script in `src/app.html`.
- One pixel grid: every font size = cells-per-em × cell (table at top of `src/app.css`; Jacquard 24 = 43, Jersey 25 = 41, Jersey 15 = 27, Silkscreen = 8, Press Start 2P = 8). Spacing in 8px units. Sections butt against each other with 64px internal padding (48 mobile). No rules or borders anywhere.
- Every band texture is `src/lib/components/Ascii.svelte` (modes sky/noise/bands/fall; `avoid` selector knocks the field out around text line boxes; `fadeIn`/`fadeOut` rows; pointer heat + click ring; 30fps redraw, sprite-cached glyphs, off-screen bands paused; origin snapped to the page grid). `Dither.svelte` exists but is unused.
- Kinetic type is `Decode.svelte` (type / scramble, once per view, only with motion on). Photographs are `PixImage.svelte` (full colour, one sample per 2px cell, integer height, grid-snapped).
- Home structure today (`src/routes/+page.svelte`): hero (sky texture, typed “i’m tim.”, dim “Scroll”) → statement (Jersey 25 “Designer for teams that don’t have one yet” + right column body copy + yellow CTA) → invested band (`.invested.band`, noise texture, “I get / invested. / in what I make.”, padding-bottom 128) → quality band (`.quality.band`, bands texture, margin-top −96, “How it / looks. moves. works.” left, diagram + copy right-bottom) → cards 2×2 (`.work-index`, no heading) → invitation (fall texture, “Tell me what you’re / building.”, full-width yellow `.cta-row`). Footer has Motion / Grid / Theme toggles.

## What to build (decision 0051, all six accepted)

1. **Merge the two middle bands.** One `.band` with one Ascii texture (suggest `noise` at ~0.5 or `bands` at ~0.6; pick one, delete the other, remove `fadeIn/fadeOut`, the −96px margin and the 128px padding). Composition: `I get` (display lead) / `invested.` (blackletter xl, Decode scramble) / `in how it` (display) / `looks.` `moves.` `works.` (blackletter l, staggered Decode). Left-aligned throughout; no right-aligned tail. Keep `avoid` covering every text span. Update the `#invested` / `#quality-title` ids and aria so the section has one heading.
2. **Cards heading.** In `.work-index`, add `<h2 class="display">Selected work</h2>` above `.cards` (optionally a `lbl` “01–04”). Match the Work page.
3. **Promote the proof.** Statement band right column becomes: “Brand. Product. / Motion. Front end.” then “I’ve cofounded products. / Helped teams ship theirs.” then the CTA. Remove “From the first idea to something people use.” from the page and remove the `<pre class="diagram">` entirely (and its CSS, including the 8px mobile rule). Keep “I care about the whole thing.”? Reviewer didn’t say; suggest keep it as the last line of that column only if it fits on one screen at 1440 — otherwise cut.
4. **Discipline labels.** Under each of the three words, a `lbl` at full opacity: looks → `Brand`, moves → `Motion`, works → `Product / front end`. On the pixel grid (16px Silkscreen). Include them in `avoid`.
5. **Scroll hint.** `.hero-hint` at full opacity; or replace with an 8×16 yellow block cursor (`background:var(--accent)`) plus “Scroll”. Show it on mobile too (currently `display:none` under 700px).
6. **Card labels.** Remove `dim` from `.card-body .lbl` on home and on `/work/`.

Also from the critique’s mobile notes (not numbered but consistent with 1–6): the diagram goes anyway; footer toggles may wrap to two rows — acceptable.

## Verify before reporting

- `pnpm check` (0/0) and `pnpm build`.
- `python3 -m http.server 4173 --directory build &` then `node tools/review/audit.mjs` (captures + overflow/errors) and `node tools/review/gridcheck.mjs` (must show 0 misaligned canvases, 0 fractional text boxes). Kill the server after.
- View the 1440 and 390 home captures in `tools/review/out/` and check the seam problem is gone.

## Record

- Append PX-07 to `docs/iteration-log.md` (trigger = 0051; change; assistant findings; validation; saved evidence under `docs/iterations/pixel-v2/07-arc/`; status “awaiting visual review”). Copy captures + `source.zip` there.
- Update `docs/alternate-v2.md` (home structure, remove diagram/fades mention), `README.md` and `AGENTS.md` current-version lines, and `docs/open-questions.md` (Q31/Q32 unchanged).
- Rules: decisions are logged when Timothy confirms them; label assistant choices as such; never mark a design approved without his word; be a blunt peer.
