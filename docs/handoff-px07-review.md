# Handoff — PX-07 built, awaiting Timothy’s review

Written 2026-09-09 evening before a context clear. Read this first, then `docs/alternate-v2.md` (editing map), then decisions 0051–0053 and the PX-07 entry in `docs/iteration-log.md`. `docs/handoff-px07.md` is the previous handoff and is now history.

## State of the site (PX-07, decisions 0051–0053)

- SvelteKit static site, `pnpm dev` (port from `PORT`, else 5173; `.claude/launch.json` has autoPort), `pnpm check`, `pnpm build` → `build/`. Nothing deployed. Not a git repo.
- Black ground / off-white type, light theme via footer toggle, yellow `--accent` on cursors, active nav and action blocks (CTAs, the hero “Scroll” box). One pixel grid: every font size = cells-per-em × cell (table at top of `src/app.css`). Spacing in 8px units. No rules or borders.
- Home (`src/routes/+page.svelte`), 3,520px at 1440:
  1. **Hero** `.hero.band` — sky ASCII texture (`Ascii.svelte`, knocks out around the hint only), typed “i’m tim.”, a yellow “Scroll” box with an 8×8 pixel down-arrow (`<svg>` inline, steps 2px once a second with motion on).
  2. **Sentence** `.who` — plain ground. `h2.para`: “Designer for teams that don’t have one yet. I care how it” at 82px display on a 128px line, then `.words` block with looks. / moves. / works. inline in Jacquard at 129px, each followed by a 16px Silkscreen label (Brand / Motion / Product / front end) at the baseline. Hand-set `<br class="hide-m">` breaks above 700px; under 700px the words line takes 96px leading. Then `.who-foot`: “I’ve cofounded products. / Helped teams ship theirs.” left, yellow “See my work” CTA right. An `sr-only` sentence gives the label mapping to assistive tech.
  3. **Selected work** `.work-index` — `display` heading + “01–04” label, 2×2 cards, labels at full opacity.
  4. **Invitation** `.invitation.band` — fall texture, “Tell me what you’re / building.”, full-width yellow CTA.
- Gone since PX-06: “I get invested.” band, the IDEA/ITERATE/SHIP diagram, “From the first idea to something people use”, “Brand. Product. Motion. Front end.”, the middle-band texture, the statement/how-it split. `Ascii.svelte` `bands` mode and `fadeIn/fadeOut` are unused; `Dither.svelte` and `Ticker.svelte` unused.
- Work page: card labels at full opacity (0051 item 6). Contact unchanged.

## What Timothy has not reacted to yet (assistant choices, labelled in the logs)

- Sentence scale 82/129 rather than 41/86 (`docs/iterations/pixel-v2/07-arc/mocks/para-small-1440.png` is the small version).
- New copy “I care how it”. The copy doc `docs/landing-copy-v2.md` has not been updated for 0052/0053; do that if he confirms the line.
- Hero field knockout around the hint; hint in flow on mobile; the arrow’s 2px step.
- Whether the hero (0.9) and invitation (0.7) textures should thin — he called the middle texture “really distracting” (0052). Not raised as a question yet; raise it at the right moment, briefly.
- Footer toggles wrap to two rows on mobile (accepted in the critique).

## How to work with him on this (learned today)

- When he asks for options, mock **structurally different** layouts on the live page behind a temporary `?v=` switch (read `location.search` in `onMount`, swap the section with `{#if}`), capture the region with Playwright, compose a labelled sheet, send it. He rejected a round of mocks as “the same thing just resized”. Remove the switch and the mock component when he picks.
- Lead with an opinion, then the options. Log decisions when he confirms, in his words. Never mark anything approved without his word.
- Do not narrate execution caveats while direction is being set.

## Verify before reporting any change

- `pnpm check` (0/0) and `pnpm build`.
- `python3 -m http.server 4173 --directory build &`, then `node tools/review/audit.mjs` (captures + overflow/errors) and `node tools/review/gridcheck.mjs > tools/review/out/grid-audit.txt` (must show 0 misaligned canvases, 0 fractional text boxes). `pkill -f "http.server 4173"` after. Selectors in both scripts point at `.who`, `.hero-name`, `.card h3`, `.invitation h2`.
- Known grid traps: `1fr` columns give fractional x; use `round(down, …, 8px)`. An inline-block blackletter word inside a line whose strut is a different font grows the line by a half pixel; give the words their own block with matching font-size/line-height. Removing a CSS block by range can take shared rules with it (`.xl` was lost once).

## Record

- Append corrections to the PX-07 entry in `docs/iteration-log.md` until a new iteration is warranted; new iteration = new `docs/iterations/pixel-v2/08-*/` folder with captures + `grid-audit.txt` + `source.zip` (zip list: `.claude/launch.json package.json pnpm-lock.yaml svelte.config.js tsconfig.json vite.config.ts src/app.css src/app.html src/lib/*.ts src/lib/components/*.svelte src/routes/**`).
- Current evidence: `docs/iterations/pixel-v2/07-arc/` (captures, band crops, hint crops, grid audit, source, `mocks/` with both mock rounds).
- Keep `docs/alternate-v2.md`, `README.md` and `AGENTS.md` current-version lines in step. `docs/open-questions.md` Q31/Q32 unchanged.
