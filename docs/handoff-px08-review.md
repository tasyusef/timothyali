# Handoff — PX-08 built (Work rows + four case studies), awaiting Timothy’s review

> **PX-18 (newest, 2026-09-09).** The Work page and the case studies have grown since this was written: Work is two tiers (the selected four as rows, four linked index entries below), all eight visible projects have studies, counts run to 008, and `src/lib/work.ts` is one array with `tier`/`hidden` and derived numbering. Read decision 0077 and the PX-18 entry in `docs/iteration-log.md`.
>
> **PX-14 (2026-09-09).** The design system has been extracted since this was written: tokens live in `src/lib/styles/primitives.css` and `tokens.css`, type roles in `type.css`, shared blocks in `blocks.css`, and nine components in `src/lib/components/` (`Arrow Cursor Plate Cta IndexRow MetaLine PageFoot QuietLink Band`). `src/app.css` is now the cell table plus an import list. Every file path named below that points at `src/app.css` for a token or a block now points into `src/lib/styles/`. Read `docs/design-system.md` first, then decision 0071 and the PX-14 entry in `docs/iteration-log.md`.
>
> **PX-09 to PX-13 (newer).** This file is still accurate for the Work rows and the case-study template, but five iterations have landed since. PX-09 to PX-12 followed Timothy’s reactions to Home and the Work header (decisions 0057–0066: selected-work introduction, inverted statement panel, continuous rain, lowercase and direction-aware navigation, the route path in the status strip, yellow discipline labels, the Work header without its eyebrow, the yellow case-study hover and the separate metadata/body plates). PX-13 (2026-09-09) applied his three review fixes: an ink plate under the yellow discipline labels (0067), the Work header stacked below 700px (0068), and the Work-row CTA following the body plate rather than pinned to the bottom (0069). Read the tail of `docs/iteration-log.md` and `docs/decision-log.md` (0056–0069) for the current state; evidence for the latest pass is in `docs/iterations/pixel-v2/13-review-fixes/`.

Written 2026-09-09 after the PX-08 build. Read this first, then `docs/alternate-v2.md` (editing map), then the PX-08 entry in `docs/iteration-log.md`. `docs/handoff-px07-review.md` covers the home page and is still accurate for it; the “What Timothy has not reacted to yet” list there is still open too.

## What was built

Timothy said “next we need to work on the work page and the case study pages” and gave no layout direction. This is the assistant’s first pass, built for review. Nothing in it is approved; Q28 (treatment of Work/case-study pages) and Q31 (rows vs cards) stay open until he reacts, and no decision was logged.

- **Work** (`src/routes/work/+page.svelte`): head unchanged; one wide row per project (cover 3/5, label, 82px title, index line, “View case study ->”), whole row is the link, to the on-site study. Links to timothyali.com are gone.
- **Case studies** at `/work/<slug>/` (`src/routes/work/[slug]/`), data in `src/lib/work.ts` (single source for Home, Work and the studies). Template: `<- Work`, label, lowercase blackletter title (172/129/86, measured step-down when the word would not fit), 54/64 lead (`.lead`, new role) beside Role/Timeline/Tools/Live, hero row, text sections (title left half, body right half), aspect-justified gallery rows, numbered Outcome, yellow `.cta-row` to the next project, page footer.
- **Assets**: images in `static/work/<slug>/` (1600px long side plus `@2x.jpg` at 2800px where the source allowed), three videos in `static/work/video/`; about 48MB in all. Copy ported from the old site (`../timothyali/src/routes/work/*`), American spelling, no new claims. PARC lost its interactive brand-system components; its text was kept.
- **Components**: `Picture.svelte` and `Clip.svelte` (native-resolution image/video in a figure with an integer 2px-snapped height; the earlier resampling components are gone per 0054).
- **Chrome**: the terminal path shows `~/tim/work/<slug>`; Home cards link to the studies; First Ledger cover is a 16:9 crop of its hero.

## Same-evening corrections (logged as 0054 and 0055)

- Images are crisp: `Picture`/`Clip` replaced the resampling components; only textures stay pixelated. 2x JPEGs exist for 44 case-study images.
- Pocketwatch is out. Do Androids Dream is in as 04, the assistant’s pick; Timothy has not confirmed the choice of replacement. Its content is in `work.ts`; the Pocketwatch content is gone from the repo (old site still has it).
- The header path column now clips long routes; the old nav overflow between 700 and 1000px is gone with it.

## What to raise with Timothy (briefly, at the right moment)

- Rows vs cards on Work (Q31); the studies’ head (title size 172 vs 258, lowercase names without a full stop, the 54px lead); “View case study” as a label not a yellow block.
- Q33: is Do Androids Dream the right fourth project? Runner-up FirstStrike. Second tier still open.
- Phones show “do androids dream?” at 43px (step-down); the other titles stay at 86.

## Verify before reporting any change

- `pnpm check` (0/0) and `pnpm build`.
- `python3 -m http.server 4173 --directory build &`, then `node tools/review/work.mjs` (captures, overflow, errors, images/videos, `currentSrc`), `node tools/review/titles.mjs` (title fit at six widths, gallery row height spread), `node tools/review/video.mjs`, and `node tools/review/gridcheck.mjs > tools/review/out/grid-audit.txt` (now covers the four studies; must show 0 misaligned canvases, 0 fractional text boxes). `pkill -f "http.server 4173"` after.
- Grid traps learned here: `1fr` last columns in gallery rows absorb the rounding remainder and make the last image taller — round every column to the 2px cell and keep the remainder small. CSS `aspect-ratio` on a lazy figure gives a fractional height until the image loads, which pushes every text box below it off the grid — set an integer height from the width on mount. A hidden measuring span still widens the page unless it has zero width.

## Record

- Append corrections to the PX-08 entry in `docs/iteration-log.md` until a new iteration is warranted; new iteration = new `docs/iterations/pixel-v2/09-*/` folder with captures + `grid-audit.txt` + `source.zip` (zip list now includes `tools/review/*.mjs` and `tools/review/README.md`).
- Current evidence: `docs/iterations/pixel-v2/08-work/` (full captures, `crops/`, grid audit, source).
- Keep `docs/alternate-v2.md`, `README.md` and `AGENTS.md` current-version lines in step. Log a decision only when Timothy confirms, in his words.
