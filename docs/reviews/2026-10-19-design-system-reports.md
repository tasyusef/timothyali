# Design-system audit reports, 2026-10-19

Two read-only reviewers on one brief (`2026-10-19-design-system-audit.md` merges them). Codex ran `gpt-6-astra`; the other was a Claude Opus agent.

---

# Opus report


Read-only audit of `src/`, `api/` and the `tools/` scripts that duplicate site code. Every finding below was checked against the file. Line numbers are from the current `master` (clean tree, `b2e88b9`).

Key: **sev** high / medium / low · **vis** = visual change if fixed (none / possible / yes) · **effort** S ≤ 1 h, M ≤ half a day, L more.

---

## 1. Merge (duplicated components, CSS, logic)

### M1 — The inverted panel exists five times, and text selected on it is invisible
- **sev** high · **vis** yes (selection becomes visible) · **effort** S
- **Where**
  - `src/routes/contact/+page.svelte:37` `.contact-note{--accent-text:var(--accent-on-fg);--dim:.65;…background:var(--fg);color:var(--paper)}`, plus its own hover and press overrides at `:40-41`
  - `src/lib/styles/blocks.css:82-83` `.code{--accent-text:var(--accent-on-fg);--dim:.65;…background:var(--fg);color:var(--paper)}` and `.code ::selection{…}`
  - `src/routes/toolbox/+page.svelte:90` `.machine{--accent-text:var(--accent-on-fg);…background:var(--fg);color:var(--paper)}` (no `--dim` override)
  - `src/routes/toolbox/+page.svelte:101` `.on-phone{…background:var(--fg);color:var(--paper)}` (no `--accent-text` and no `--dim`)
  - `src/routes/admin/+page.svelte:66` `.stats article{…background:var(--fg);color:var(--paper)}`
  - also `src/routes/og/[id]/+page.svelte:154` `.og-command`
- **Now:** each copy sets a different subset of the panel's variables. `base.css:25` sets `::selection{background:var(--fg);color:var(--paper)}`, which on a `--fg` panel is the panel's own colours. Selecting text in the Contact note, `.machine` or `.on-phone` shows no highlight. Only `.code` fixes this.
- **Do:** add one `.panel` block (or `.on-fg`) to `blocks.css` that sets `--accent-text:var(--accent-on-fg)`, `--dim` (see MT3), the background and colour, the inverted `::selection`, and the `.cta-row` hover inversion that Contact hand-writes. Give `.code` the class too, and delete the five local copies.

### M2 — The page-title ladder is written out in three routes
- **sev** high · **vis** none · **effort** M
- **Where**
  - `src/routes/work/[slug]/+page.svelte:133,138,168-170`: 110/112 → 82.5/88 (≤1100) → 55/56 (≤900) → 41.25/48 (≤700), with a `.small` step one rung down
  - `src/routes/toolbox/[tool]/+page.svelte:50,58-60`: the same four steps, with no `.small` step
  - `src/routes/toolbox/agents/+page.svelte:110,125-126`: the same ladder starting one rung lower (82.5)
  - `src/routes/work/[slug]/+page.svelte:139` and `agents/+page.svelte:111`: an identical `.title :global(.decode){display:inline;white-space:normal}`. The tool page lacks it, so a two-word tool name could not wrap.
- **Now:** the design-system doc calls the study title "genuinely one-off". It is no longer one-off: three routes copy it.
- **Do:** add a `.display-title` role to `type.css` (110 ladder, plus a `.small` / `-s` step for agents and the fit step-down). Also add a shared `PageTitle.svelte` that carries the Decode and the fit probe (see M8).

### M3 — The inner-page head and paragraph column are re-implemented, and the layout rule meant for them goes unused
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}` and, at ≤700, `padding-top:var(--s3)`: `src/routes/toolbox/[tool]/+page.svelte:49,60` and `src/routes/toolbox/agents/+page.svelte:109,126`
  - `.paras{display:flex;flex-direction:column;gap:var(--s3);min-width:0}`: `toolbox/[tool]/+page.svelte:57` and `agents/+page.svelte:121`. The study's `.paras` (`work/[slug]/+page.svelte:154`) and `.lead-col` (`:143`) are the same column plus `max-width:64ch`.
  - `src/lib/styles/layout.css:28` `.inner-page .page-head{padding:var(--s4) 0 0}` is used only by Work's `<h1>`.
- **Do:** put `.page-head` (flex column, gap `--s2`, top `--s4` → `--s3` on phones) and `.paras` in `layout.css` under `:where(.inner-page)`, next to `.intro` (which was merged the same way in 0207). Then delete the four route copies.

### M4 — "Tell me what you're building." is built three times, at different sizes
- **sev** high · **vis** yes · **effort** M
- **Where**
  - `src/lib/components/home/Invite.svelte:12,20-21,24`
  - `src/routes/contact/+page.svelte:15,34-36,52,62,66`
  - `src/routes/og/[id]/+page.svelte:70,143-144`
- **Now:** both pages use the same markup (`.display.intro` with a 64px line, then `.blackletter.display-xl`). Contact steps "building." down to 172 at ≤1300, and Invite keeps `.display-xl`'s ≤1100 step. Between 1101 and 1300px Home shows "building." at 258 and Contact shows it at 172, while both intros are already at 41.25. Contact also restates the whole `.display-xl` ladder (`.building` 258/264, 172/176, 129/136, 86/88), although the element already wears `.display-xl`. The 448px column (`Invite.svelte:22`, `contact/+page.svelte:32`) is the same width written twice.
- **Do:** create one `BuildingHead.svelte` (the h2/h1 with a `level` prop and the Decode step), with its ladder in one place. Pick one breakpoint for the intro and the word. Delete `.building` from Contact.

### M5 — `.display-xl` ladder re-typed on Toolbox at different breakpoints
- **sev** medium · **vis** none · **effort** S
- **Where:** `src/routes/toolbox/+page.svelte:78,110,113,119`. `.hero-copy h1` is 258/264 → 172/176 (≤900) → 129/136 (≤700) → 86/88 (≤420), and it does not use the `.display-xl` class (`type.css:42-52`).
- **Now:** the only difference is that it holds 258 down to 901 (the comment says "toolbox." is 822px at 258).
- **Do:** wear `.display-xl` and override only the 901–1100 step locally. That leaves one copy of the ladder.

### M6 — A Band that holds a full-bleed scene restates the same four declarations everywhere
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `src/routes/+page.svelte:22`: `position:relative;isolation:isolate;overflow:hidden`
  - `src/routes/contact/+page.svelte:32`: `flex:1;position:relative;isolation:isolate;overflow:hidden`
  - `src/routes/not-found/+page.svelte:20`: `flex:1;position:relative;isolation:isolate;overflow:hidden`
  - `src/routes/work/[slug]/+page.svelte:132`: `position:relative;isolation:isolate;overflow:hidden`
  - `src/routes/og/[id]/+page.svelte:117`: the same three
  - `src/routes/toolbox/+page.svelte:76`: `overflow:hidden` only
  - The fill-the-screen pair (`.contact-main` / `.lost-main{display:flex;flex-direction:column}` with the band at `flex:1`) appears twice: `contact/+page.svelte:31-32` and `not-found/+page.svelte:19-20`.
- **Do:** move `position:relative;isolation:isolate;overflow:hidden` onto `.band` in `layout.css:20-24`, and add a `.band.fill` modifier (or a `fill` prop on `Band`).

### M7 — Every page's scene field passes the same knockout preset by hand
- **sev** medium · **vis** none · **effort** S
- **Where:** `lightAs="dither" feather={12} depth={0.85} clearFeather={3}` appears in
  - `src/routes/+page.svelte:15`
  - `src/routes/contact/+page.svelte:13`
  - `src/routes/not-found/+page.svelte:10`
  - and, minus `lightAs`, `src/routes/toolbox/+page.svelte:31` (copied in `og/[id]/+page.svelte:74`)
  - The study head (`work/[slug]/+page.svelte:85`) uses `feather={1} depth={0.85}`.
- **Now:** `Band.svelte:8-9,20` already gives a scene its defaults for `cell`, `px`, `hug` and `pad` "as every scene band asked for".
- **Do:** add `feather`, `depth`, `clearFeather` and `lightAs` to those scene defaults, or export a `PAGE_FIELD` preset. Call sites then pass only what differs.

### M8 — Two word-fit systems, and the probe version is copied three times
- **sev** medium · **vis** none · **effort** M
- **Where**
  - `src/lib/fit.ts:10-28`: the `fitTitles` action, a ladder through `data-fit`
  - `src/routes/work/[slug]/+page.svelte:21-29,86,134,138`: a hidden probe plus `small`
  - `src/routes/og/[id]/+page.svelte:27-40,94,106,164,179`: the same probe logic, twice in one file
- **Do:** add a `fitWord` action to `fit.ts` (probe the longest word at the base size and set `data-fit` / `.small`), and use it in the study title, `PageTitle` (M2) and the share route.

### M9 — Picture and Clip duplicate the figure block and its sizing
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `src/lib/components/Picture.svelte:27-31,33,41-45`
  - `src/lib/components/Clip.svelte:32-35,48-53,66-67`
- **Now:** both carry a scoped `.pic{position:relative;margin:0;width:100%;overflow:hidden;background:var(--paper)}` and an identical media rule (`display:block;width:100%;height:100%;object-fit:cover`). Both run the same `size()` plus `ResizeObserver(figureHeight)`. This breaks the system rule that "a component never carries a scoped `<style>` for a shared block". `blocks.css:47` `.card .pic{background:var(--paper)}` then restates the paper ground.
- **Do:** move `.pic` and its media rule to `blocks.css`. Add a `figure` action to `figure.ts` that observes, measures and sets the height, and use it in both components. Delete `.card .pic`.

### M10 — The study and tool "Next" footer is the same markup twice
- **sev** medium · **vis** possible (the top padding unifies) · **effort** S
- **Where**
  - `src/routes/work/[slug]/+page.svelte:126-129` (`.next` top padding `--s12`, `:162`)
  - `src/routes/toolbox/[tool]/+page.svelte:43-46` (`.next` top padding `--s8`, `:51`)
  - The loaders are identical too: `src/routes/work/[slug]/+page.ts:8-12` and `src/routes/toolbox/[tool]/+page.ts:8-12` (`findIndex`, then `next = list[(i+1)%len]`).
- **Do:** create a `NextFoot.svelte` with props `href`, `n`, `name`, `note`, `footHref` and `footLabel`: the `Cta variant="row"` plus `PageFoot`. Add a `withNext(list, key, value)` helper for both loaders.

### M11 — The four Toolbox demos repeat their chrome markup
- **sev** medium · **vis** none · **effort** M
- **Where**
  - The readout row: `LockupDemo.svelte:42`, `PaletteDemo.svelte:32`, `SpecimenDemo.svelte:28`, `ConvertDemo.svelte:85`
  - The toolbar's disabled Back button plus the Export CTA: `LockupDemo.svelte:88-96`, `PaletteDemo.svelte:78-82`, `SpecimenDemo.svelte:74-78`, `ConvertDemo.svelte:120-124`
  - The identical "Destination / Choose where to save…" section, with the inline `style="width:100%;justify-content:space-between"`: `LockupDemo.svelte:81-84`, `SpecimenDemo.svelte:68-71`, `ConvertDemo.svelte:114-117`
  - `style="gap:var(--s1)"` on `.rail-section`: `SpecimenDemo.svelte:45,52,63` and `ConvertDemo.svelte:100,105,110`
- **Do:** add `DemoReadout`, `DemoToolbar` and `DestinationRow` to `components/toolbox/`, and a `.rail-section.tight` class in `demo.css`. Replace the inline styles.

### M12 — The card mat over a field is restated
- **sev** low · **vis** none · **effort** S
- **Where**
  - `src/lib/components/home/WorkList.svelte:22-23`: `background:var(--surface-card),var(--paper)` for rest, focus and hover
  - `src/routes/og/[id]/+page.svelte:140`: the same
  - `src/lib/styles/blocks.css:45-46` sets the mat alone.
- **Do:** layer `var(--paper)` under the mat in `blocks.css` itself. Paper is the page ground, so there is no change off a field. Then delete the WorkList overrides.

### M13 — The gallery gap is a CSS token in one place and the number 16 in four
- **sev** medium · **vis** none (until the gap changes, when rows break) · **effort** S
- **Where**
  - CSS: `src/routes/work/[slug]/+page.svelte:146` `.grow{gap:var(--s2)}`
  - JS defaults: `src/lib/figure.ts:13` `gap = 16`, `src/lib/work.ts:572` `rowColumns(row, gap = 16)`
  - Hand-maths: `work/[slug]/+page.svelte:177` `(100% - 16px) / 2` and `:56` `100vw - 48px`
- **Do:** add `GALLERY_GAP = 2 * U` to `tokens.ts` and use it in both functions. Write the CSS formulas with `var(--s2)`.

### M14 — Image `sizes` strings re-derive the gutters by hand, and assume a 1440 cap the CSS does not have
- **sev** medium · **vis** possible (sharper images above 1440px) · **effort** M
- **Where**
  - `src/lib/components/Picture.svelte:16` `'(min-width: 1440px) 1376px, calc(100vw - 64px)'`
  - `src/lib/components/Card.svelte:10` `calc((100vw - 160px) / 2)`, `calc(100vw - 64px)`
  - `src/routes/work/[slug]/+page.svelte:56-58` (`1376`, `896`, `100vw - 96px`, `- 64px`, `- 48px`, `- 32px`)
- **Now:** nothing in the CSS caps the page at 1440, so at 1920px the browser is told 1376px for a figure about 1856px wide.
- **Do:** add one `sizes()` helper in `figure.ts` built from `GUTTER` and the breakpoints (MT1). Drop the 1440 clause or add the cap it assumes.

### M15 — The block-panel command plate is a near-copy
- **sev** low · **vis** none · **effort** S
- **Where:** `src/routes/toolbox/+page.svelte:92` `.command{padding:var(--s3);…display:flex;flex-direction:column;gap:var(--s2)}.command code{font-family:var(--face-text)}.command :global(.cursor){height:24px;vertical-align:top}`, and `src/routes/og/[id]/+page.svelte:154-155`, the same rules on the inverse ground.
- **Do:** make a `CommandPlate.svelte` (or a `.command` block in `blocks.css`). The `code` font rule is also redundant: the element already has `.body`.

---

## 2. Missing tokens

### MT1 — The chrome height is the literal 96/104 in four places, while the layout already measures the header
- **sev** high · **vis** none · **effort** S
- **Where**
  - `src/routes/+page.svelte:22-23` `--chrome:96px` / `104px`
  - `src/lib/components/home/Hero.svelte:80,108`: the same pair again. Hero sits inside `.page-sky`, so this copy is redundant.
  - `src/routes/work/[slug]/+page.svelte:61` `const CHROME = 96 + 32 + 32` and `:166` `top:calc(96px + var(--s4))`
- **Now:** `+layout.svelte:27,77,124` measures `headerHeight` but writes it only onto `.nav-chrome`, and `tokens.css:20` declares `--header-height:64px`.
- **Do:** add `--chrome-height` to `tokens.css` (96, then 104 at ≤700) and read it everywhere. Better, have the layout write the measured header height plus the strip height on `.site` so pages inherit it.

### MT2 — JavaScript breakpoints are retyped as media strings
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `src/lib/components/Picture.svelte:17` `const PHONE = '(max-width: 700px)'`
  - `src/lib/components/Clip.svelte:50` `'(max-width: 700px)'`
  - `src/lib/components/toolbox/Options.svelte:9` `'(max-width: 700px)'`
  - `src/lib/components/toolbox/SpecimenDemo.svelte:23` `'(max-width: 420px)'`
- **Do:** add `BP = { phoneFloor: 420, phone: 700, column: 900, wide: 1100 }` and a `mq(px)` helper to `tokens.ts`, in step with the comment block in `primitives.css:47-60`.

### MT3 — The dim opacity on a `--fg` panel is the literal `.65`, twice
- **sev** medium · **vis** none · **effort** S
- **Where:** `src/lib/styles/blocks.css:82` and `src/routes/contact/+page.svelte:37` (`--dim:.65`). It is the same value `tokens.css:41` gives the light ground.
- **Do:** add `--dim-on-fg` to `tokens.css` (the other ground's `--dim`, swapped per theme like `--accent-on-fg`) and set it in the M1 panel block.

### MT4 — An fg tint scale is spread across ad-hoc `color-mix` calls
- **sev** low · **vis** none · **effort** S
- **Where**
  - `tokens.css:23-24,29-30` (14, 26, 12, 22%)
  - `base.css:84` (14% over paper)
  - `components/toolbox/demo.css:10` (`--rim` 14%), `:65,80,82` (30%), `:66` (50%), `:103` (8%)
  - `PaletteDemo.svelte:87` (`--rim`)
- **Do:** name the steps once in `tokens.css` (for example `--tint-8/14/30/50`). Define `--surface-card`, `--rim` and the scrollbar fallback from them, and keep `--grid-*` only if they are renamed (N4).

### MT5 — The small-button padding (0097) is repeated as a literal
- **sev** low · **vis** none · **effort** S
- **Where:** `9px 14px 7px 16px` appears at `chrome.css:22,37`, `blocks.css:31` and `demo.css:30,40`. Variants of the same rule appear at `demo.css:37,49,50,152`, `chrome.css:73,88`, `blocks.css:36`, `contact/+page.svelte:63`, and `toolbox/+page.svelte:83,103,115`.
- **Do:** add `--pad-btn-s` and `--pad-btn-m` (`17px 14px 15px 16px`) tokens next to `--nudge`. Each one then documents the 1-up / 2-right rule once.

### MT6 — The phone caption type role is restated by hand, identically
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `src/routes/work/[slug]/+page.svelte:190` `.cap{…font-family:var(--face-read);font-size:14px;line-height:24px;text-transform:none;…-webkit-font-smoothing:antialiased}`
  - `src/routes/toolbox/+page.svelte:106` `.downloads .note{font-family:var(--face-read);font-size:14px;line-height:24px;text-transform:none;-webkit-font-smoothing:antialiased}`
- **Do:** add a `.read-s` role to `type.css` (14/24), so 14px gets a role instead of two copies.

### MT7 — The dither-in animation shorthand is repeated
- **sev** low · **vis** none · **effort** S
- **Where:** `base.css:62`, `components/Picture.svelte:46` and `components/toolbox/demo.css:133` all use `dither-in calc(3 * var(--step)) steps(3) both`.
- **Do:** add `--wipe-in` to `primitives.css`, or an `.arrive` utility in `base.css`.

### MT8 — Anchor offsets under the sticky chrome are inconsistent
- **sev** low · **vis** possible · **effort** S
- **Where:** `scroll-margin-top` is `--s4` at `WorkList.svelte:20`, `--s2` at `work/+page.svelte:27`, `--s8` at `toolbox/+page.svelte:80`, `--s12` at `toolbox/[tool]/+page.svelte:53`, `--s4` at `toolbox/agents/+page.svelte:115`, and `--s2` at `toolbox/demo.css:10`.
- **Do:** add one `--anchor-offset` derived from MT1.

### MT9 — The focus ring is restated in the demo CSS
- **sev** low · **vis** none · **effort** S
- **Where:** `outline:2px solid var(--accent-text)` at `demo.css:61,67,70,85`, a copy of `base.css:27`.
- **Do:** add `--focus-ring` to `tokens.css`.

---

## 3. Raw values where a token exists

### T1 — Scene palettes hard-code the brand hexes
- **sev** medium · **vis** none · **effort** S
- **Where:** `src/lib/scene.ts:16-21` uses `#181814` (INK), `#efefeb` (WHITE), `#f2d600` (YELLOW) and `#c8ac00` (`--yellow-field`, which has no JS twin).
- **Do:** import `INK`, `WHITE` and `YELLOW` from `tokens.ts`, and add `YELLOW_FIELD` (and `YELLOW_DEEP`) there.

### T2 — The field-cursor generator carries the pre-0171 ink and white
- **sev** medium · **vis** yes (the cursor tint shifts slightly) · **effort** S
- **Where:** `tools/cursor/make.mjs:7` `INK = [0x11,0x11,0x0e], WHITE = [0xf4,0xf4,0xf0] // primitives.css --ink / --white`. The current values are `#181814` / `#efefeb` (`primitives.css:8-9`). I decoded the PNGs to check: `static/cursor/field-dark.png` holds `#f4f4f0` and `field-light.png` holds `#11110e`, so neither cursor matches `--fg`.
- **Do:** import `INK` and `WHITE` from `src/lib/tokens.ts`, as `tools/social/generate.mjs:12` already does, and regenerate.

### T3 — The other old-ink literals
- **sev** low · **vis** possible · **effort** S
- **Where**
  - `tools/covers/generate.mjs:30-31`: the Toolbox cover ground `#11110e` and `#f2d600`
  - `src/lib/components/toolbox/ConvertDemo.svelte:38` and `PaletteDemo.svelte:15`: `#11110e` in the demo artwork
  - `src/lib/components/toolbox/LockupDemo.svelte:40`: `#f2d600`
- **Do:** import from `tokens.ts` where the colour means the site ink or yellow. Leave it where it is demo artwork, but then write `#181814`.

### T4 — Face stacks restated in the Specimen demo
- **sev** low · **vis** none · **effort** S
- **Where:** `src/lib/components/toolbox/SpecimenDemo.svelte:9-12` (`"'Jacquard 24', serif"`, `"'Jersey 15', sans-serif"`, `"'PARC Pixel Bold Web', sans-serif"`, `"'Press Start 2P', monospace"`). These drop the sized fallbacks that `primitives.css:32-36` adds.
- **Do:** use `var(--face-blackletter)` and the others. The Helvetica sheet stack is repeated three times (`PaletteDemo.svelte:89`, `SpecimenDemo.svelte:82,84`), so give it a demo-local `--face-sheet`.

### T5 — Type roles restated outside `type.css`
- **sev** low · **vis** none · **effort** S
- **Where**
  - `blocks.css:82`: `.code` sets Jersey 27/32, which is `.body`
  - `demo.css:73`: `.select::after` sets Press Start 16/16, which is `.mono`
  - `demo.css:76,139`: re-sets `.body` on `.body` elements, which is redundant
  - `toolbox/+page.svelte:115`: `.tool-picker .display-s` sets `--face-label` 12.5/16, which is `.lbl`
  - `PaletteDemo.svelte:85`: `font:27px/32px var(--face-text)`, which is `.body`
  - `admin/+page.svelte:68`: `thead th` sets the `.lbl` declarations
- **Do:** emit the role class (`class="code body"`, `.mono` on the element), or swap the role class at the breakpoint, and delete the restated declarations.

### T6 — Off-table font sizes in the admin page
- **sev** low (private page) · **vis** yes (the text becomes crisp) · **effort** S
- **Where:** `src/routes/admin/+page.svelte:67` `.note,small{font-family:var(--face-text);font-size:22.5px;line-height:24px}` and `:69` `.days{font-size:18px}`. Jersey 15 is 27 cells/em, so neither size is a cell-table row and both render blurred.
- **Do:** use `.lbl`, or Jersey 27/32 via `.body`.

### T7 — Raw spacing in the demos
- **sev** low · **vis** none · **effort** S
- **Where:** `LockupDemo.svelte:59` and `PlanRow.svelte:29` (`style="display:inline-flex;gap:4px"`), `demo.css:50` (`gap:8px 4px`), `PlateToggle.svelte:9-10` and `ConvertDemo.svelte:107` (inline layout styles).
- **Do:** use a `.swatches` class in `demo.css` with the token where one exists (`var(--s1)`). The 4px half-unit is the app's value, so keep it named.

---

## 4. Hand-rolled UI a shared component covers

### C1 — `Cta` cannot render a `<button>`, so action buttons are hand-rolled
- **sev** medium · **vis** possible · **effort** S
- **Where**
  - `src/lib/components/ContactForm.svelte:61`: `<button class="cta-row lbl">`, plus the Contact overrides at `contact/+page.svelte:39-41,63`
  - `src/routes/toolbox/+page.svelte:64,103-104`: `.send`, a hand-built accent block with its own padding (14/16/12, which is off the 0097 9/7 · 17/15 pattern). It has no hover, and its press goes to paper instead of the accent (0099).
  - `src/routes/admin/login/+page.svelte:27,37` and `src/routes/admin/+page.svelte:19,64`
- **Do:** let `Cta` render `<button>` when it has no `href` (with `type`, `disabled` and `onclick` in rest props), and use it for all of these.

### C2 — Home's "All work" is a fourth link style
- **sev** medium · **vis** yes · **effort** S
- **Where:** `src/lib/components/home/WorkList.svelte:16,24-25`. A hand-built `.all` with a paper plate that inverts on hover. `blocks.css:38` carries `.list .all` in the shared pointer rule, so a route class has leaked into the blocks file.
- **Now:** every other text link with an arrow is `QuietLink`, which lights to `--accent-text`.
- **Do:** use `QuietLink pad`, or give `QuietLink` a `plate` variant for over-field use. Then remove `.list .all` from `blocks.css`.

### C3 — Arrows and icons outside `Arrow`
- **sev** low · **vis** yes (admin) · **effort** S
- **Where**
  - `src/lib/components/home/Hero.svelte:73,101-103`: an inline 8×8 down-arrow SVG with its own `@keyframes nudge`
  - `src/routes/admin/+page.svelte:19` and `src/routes/admin/login/+page.svelte:31`: the `↗` glyph
  - Pixel icons: `src/lib/components/Clip.svelte:60,62` (play, pause) and `src/routes/+layout.svelte:136` (cog)
- **Do:** give `Arrow` `dir='down'` (the pixel SVG) and use `Arrow` in admin. Add a small `PixelIcon.svelte` (cog, play, pause, down) so the four 8×8 SVGs share one `viewBox` and `shape-rendering` setup.

### C4 — The block caret and the command cursor bypass `Cursor`
- **sev** low · **vis** none · **effort** S
- **Where**
  - `src/lib/components/ContactForm.svelte:56-58`: `<span class="cursor caret">` ×3
  - `src/routes/toolbox/+page.svelte:92` and `og/[id]/+page.svelte:155`: the cursor height is overridden to 24px
- **Do:** add `class` passthrough and a `size='line'` (24) option to `Cursor`, and use it in all three.

### C5 — The error page skips the system
- **sev** low · **vis** yes · **effort** S
- **Where:** `src/routes/+error.svelte:7`: an inline `style="padding:var(--s8) var(--gutter);min-height:65vh"` and a bare `<a href="/">Back to home</a>`.
- **Do:** reuse the 404's layout (Band plus `Cta`), or at least `Cta` and a class.

---

## 5. Constants written twice (TS/JS)

### K1 — Site constants exist but are retyped
- **sev** medium · **vis** none · **effort** S
- **Where**
  - `SITE_URL` (`src/lib/site.ts:4`) is retyped in `src/hooks.server.ts:22-23`, `src/routes/api/analytics/+server.ts:11`, `src/lib/analytics.ts:22` (hostnames) and `api/contact.js:19`.
  - `EMAIL` lives in `src/lib/seo.ts:13`, which imports the whole work index. It is retyped ×6 in `ContactForm.svelte:38-41,63-64,66`, in `contact/+page.svelte:24` and in `api/contact.js:17`.
  - `RELEASES` is redefined in `src/lib/seo.ts:14`, although `seo.ts` already imports `$lib/toolbox`, which exports it (`toolbox.ts:128`).
  - The LinkedIn URL is `https://www.linkedin.com/in/timothyali` at `seo.ts:12` but `https://linkedin.com/in/timothyali` at `contact/+page.svelte:25`.
- **Do:** move `EMAIL`, `LINKEDIN` and the hostnames into `site.ts`, which has no imports for exactly this reason, and import them everywhere. `api/contact.js` can import a plain-JS copy.

### K2 — The `?via=` pattern is in two places
- **sev** low · **vis** none · **effort** S
- **Where:** `src/lib/components/Analytics.svelte:14` and `src/lib/analytics.ts:10`. The comment says it was copied so the bundle would not import the work index.
- **Do:** put `VIA` in `site.ts` (no imports), which solves the bundle concern the copy was made for.

### K3 — Contact validation is duplicated client and server
- **sev** low · **vis** none · **effort** S
- **Where:** the EMAIL regex at `ContactForm.svelte:19` and `api/contact.js:26`. The limits are `maxlength` 120/200/5000 at `ContactForm.svelte:56-58` and `LIMITS` at `api/contact.js:20`.
- **Do:** add a shared `src/lib/contact.js` (plain JS, importable by the Vercel function).

### K4 — Two-digit padding written three times
- **sev** low · **vis** none · **effort** S
- **Where:** `src/lib/work.ts:581` `pad`, `src/lib/components/toolbox/plan.ts:182` `pad2`, `src/routes/work/[slug]/+page.svelte:50` `pad`, plus inline `padStart` at `SpecimenDemo.svelte:53` and `LockupDemo.svelte:70`.
- **Do:** export one `pad(n, width=2)` (from `work.ts` or a small `format.ts`).

### K5 — The admin day ranges appear twice
- **sev** low · **vis** none · **effort** S
- **Where:** `[7,30,90]` at `src/routes/admin/+page.server.ts:7` and `src/routes/admin/+page.svelte:22`.
- **Do:** return it in the load data.

---

## 6. Naming and cascade collisions

### N1 — The demo `.cta` collides with the site's `.cta`, so the demo buttons nudge on hover
- **sev** high · **vis** yes · **effort** S
- **Where:** `src/lib/components/toolbox/demo.css:37-39` (`.demo .cta{…transform:none}`, specificity 0,2,0) against `src/lib/styles/blocks.css:27` (`.motion .cta:hover{transform:translate(var(--nudge),0)}`, specificity 0,3,0). Affected buttons: `LockupDemo.svelte:95`, `PaletteDemo.svelte:81`, `SpecimenDemo.svelte:77` and `ConvertDemo.svelte:123`.
- **Now:** with motion on, Continue and the disabled Export/Convert buttons slide 8px on hover, which the demo meant to prevent. `blocks.css:74` `.cta:active` also applies.
- **Do:** rename the demo voice (for example `.demo .act`), or scope `blocks.css` `.cta` to `:not(.demo *)`.

### N2 — The demo `.readout` and `.path` pick up the site chrome's rules
- **sev** medium · **vis** possible · **effort** S
- **Where:** the demo rules are at `demo.css:13-16` and their markup at `LockupDemo.svelte:42`, `PaletteDemo.svelte:32`, `SpecimenDemo.svelte:28` and `ConvertDemo.svelte:85`. They inherit `chrome.css:16` `.path{display:flex}`, `:43` `.readout{z-index…}`, `:45-49` and `:78` `.readout{display:none}`. A higher-specificity demo rule wins over that last one.
- **Now:** `.path` becomes a flex container, so the demo's `text-overflow:ellipsis` on `.demo .readout .path` cannot work.
- **Do:** prefix the chrome classes (`.st-readout`, `.st-path`) or the demo ones.

### N3 — `Cta` and `QuietLink` leave the type role to every caller
- **sev** low · **vis** none · **effort** S
- **Where:** all 10 `<Cta>` uses pass `class="lbl"`: `Hero.svelte:73`, `Invite.svelte:13`, `not-found/+page.svelte:14`, `work/+page.svelte:21`, `work/[slug]/+page.svelte:127`, `toolbox/+page.svelte:36`, `toolbox/[tool]/+page.svelte:44` and `og/[id]/+page.svelte:57,77,96`. Ten of the 15 `QuietLink` uses pass `lbl`. By contrast, `PageFoot.svelte:6` and `MetaLine.svelte:7` add `lbl` themselves.
- **Do:** default `Cta` to `lbl` and give `QuietLink` a `role='lbl'|'inherit'` prop, so all four components behave the same way.

### N4 — Token and class names that no longer say what they are
- **sev** low · **vis** none · **effort** S
- **Where**
  - `tokens.css:29-30` `--grid-fine` / `--grid-major`: the Grid overlay is gone (0168) and only `admin/+page.svelte:68-69` uses them.
  - `blocks.css:14` and `Cursor.svelte:7`: `.cursor.on-fg` means "currentColor", while `--accent-on-fg` means "on a `--fg` panel".
  - `.pad` means three things: `Code.svelte:26` / `blocks.css:87` (alignment spaces), `blocks.css:36` `.quiet-link.pad`, and `Band`/`Ascii` `pad` (knockout cells).
  - `.intro` is both the inner-page head grid (`layout.css:33`) and the "Tell me what you're" line (`Invite.svelte:12`, `contact/+page.svelte:15`).
  - `contact/+page.svelte:23-25,42`: `.alt` is used to mean `.dim`.
- **Do:** rename (`--tint-*`, `.cursor.current`, `.code .align`, `.building-intro`), and use `dim` in place of `.alt`.

---

## 7. Dead or orphaned

### D1 — Declared tokens with no consumer
- **sev** low · **vis** none · **effort** S
- **Where:** `primitives.css:23` `--s16`, `:26-27` `--cell-text` / `--cell-image`, and `tokens.ts:18-19` `CELL_TEXT` / `CELL_IMAGE`. `CELL_IMAGE` should be used in `work.ts:577` (`round(…, 2px)`) and `work/[slug]/+page.svelte:177`.
- **Do:** use `CELL_IMAGE` in `rowColumns`, and delete `--s16`, `--cell-text` and `CELL_TEXT` (which duplicates `U`).

### D2 — Components and variants that live only in the share-image route
- **sev** low · **vis** none · **effort** S
- **Where:** `MetaLine.svelte` is imported only by `og/[id]/+page.svelte:10,105`. `Cta`'s `quiet` variant (`Cta.svelte:8-9`) has no rules in `blocks.css`; they live at `og/[id]/+page.svelte:173-174`, the only use (`:96`).
- **Do:** either move both into the og route or keep them deliberately, and correct the "Used by" note.

### D3 — Small leftovers
- **sev** low · **vis** none · **effort** S
- **Where**
  - `layout.css:28` `.inner-page .page-head` is used once (it becomes the shared rule in M3).
  - `ContactForm.svelte:73` `.field .lbl{opacity:var(--dim)}` repeats the `dim` class on the same elements (`:56-58`).
  - `+layout.svelte:96` `localStorage.removeItem('tim-grid')` is a migration for a removed toggle.
  - `work.ts:584` exports `all` and `Item`, which nothing outside the file uses.
  - `+layout.svelte:27` `headerHeight = $state(64)` repeats the `--header-height` default.
- **Do:** delete or fold these into the merges above.

### D4 — A demo toolbar puts three items on `space-between`
- **sev** low · **vis** possible · **effort** S
- **Where:** `demo.css:28` `.demo .toolbar{…justify-content:space-between}` with three children (Back, steps or count, Export). This is the case the "No space-between over bitmap text" rule (0089) forbids, because the centre item lands on a fractional pixel.
- **Do:** use `margin-left:auto` gaps, or round the centre the way the nav does.

---

## Top 10 to do first

1. **M1**: one `.panel` block for the inverted ground. This fixes the invisible text selection on Contact and Toolbox and removes five copies.
2. **N1**: rename the demo `.cta`. It stops the demo buttons nudging 8px on hover.
3. **MT1**: a `--chrome-height` token, or the measured header height lifted to `.site`. It replaces four 96/104 literals.
4. **M4**: one "Tell me what you're building." component with one ladder. It fixes the 1101–1300px size mismatch between Home and Contact.
5. **M2 + M8**: a `.display-title` role and a `fitWord` action. These merge the three page-title ladders and the three probe copies.
6. **M9**: move `.pic` to `blocks.css` and add a shared figure-sizing action for `Picture` and `Clip`.
7. **C1 + C2**: let `Cta` render buttons (Contact send, Toolbox send, admin), and replace Home's hand-built "All work" with `QuietLink`.
8. **M3 + M6**: put the inner-page `.page-head` / `.paras` and the full-bleed band rules in `layout.css`.
9. **K1 + K2**: move `EMAIL`, `VIA`, `LINKEDIN` and the hostnames into `site.ts`. That ends the retyped site URL, email, releases and LinkedIn constants.
10. **T1 + T2**: scene palettes and the cursor generator import `tokens.ts`. Regenerating the field cursors puts them on the current ink and white.

## Count per category

- **merge:** 15 (M1–M15)
- **missing-token:** 9 (MT1–MT9)
- **token:** 7 (T1–T7)
- **component:** 5 (C1–C5)
- **merge, constants (TS/JS):** 5 (K1–K5)
- **naming:** 4 (N1–N4)
- **dead:** 4 (D1–D4; D4 is a system-rule breach filed here)

Total: 49 findings. Merge is 20 counting the constants group.

---

# Codex report

**30 verified findings.** The biggest gaps are overridden shared states, off-grid typography, duplicated component contracts and repeated validation logic.

Read-only review completed. No files changed; no installs, builds, servers or tests run. **Visual change** below describes the proposed fix, based on source inspection.

## Component — 4 findings

### C01 — Local overrides defeat shared press states
**Severity: high · Visual change: yes · Effort: M**

- **Where:** [WorkList.svelte:22,23](src/lib/components/home/WorkList.svelte:22); [Hero.svelte:100](src/lib/components/home/Hero.svelte:100); [blocks.css:46,74](src/lib/styles/blocks.css:74).
- **Now:** Home’s card background selectors outrank `.card:active`. The hero hint’s local hover/focus selector similarly outranks `.cta-hint:active`.
- **Do:** Put the card’s opaque background treatment in a shared `Card` variant. Move hint interaction states into `blocks.css`, with press rules winning over hover/focus.

### C02 — `Cta` cannot render buttons, encouraging separate implementations
**Severity: high · Visual change: yes · Effort: M**

- **Where:** [Cta.svelte:7,11](src/lib/components/Cta.svelte:7); [ContactForm.svelte:61,85,86](src/lib/components/ContactForm.svelte:61); [admin/login/+page.svelte:27,37,38](src/routes/admin/login/+page.svelte:27); [toolbox/+page.svelte:64,103,104](src/routes/toolbox/+page.svelte:64).
- **Now:** Contact manually applies `cta-row`; admin sign-in recreates the action styling; Toolbox’s send button implements another version whose pressed colour differs from the shared accent state.
- **Do:** Add native-button support to `Cta`, including `type`, `disabled` and event forwarding. Migrate these actions and centralise their state styling.

### C03 — Contact manually renders three shared cursors
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [ContactForm.svelte:56,57,58,80](src/lib/components/ContactForm.svelte:56); [Cursor.svelte:5,7](src/lib/components/Cursor.svelte:5); [caret.ts:14](src/lib/caret.ts:14).
- **Now:** Each field repeats `<span class="cursor caret" aria-hidden="true">`.
- **Do:** Let `Cursor` accept a class and render `<Cursor class="caret" />`. Preserve the immediate-sibling relationship required by `blockCaret`.

### C04 — Quiet navigation links bypass `QuietLink`
**Severity: medium · Visual change: possible · Effort: M**

- **Where:** [PageFoot.svelte:8](src/lib/components/PageFoot.svelte:8); [WorkList.svelte:16,24,25](src/lib/components/home/WorkList.svelte:16); [admin/login/+page.svelte:21,31,38](src/routes/admin/login/+page.svelte:21); [+error.svelte:7](src/routes/+error.svelte:7); [QuietLink.svelte:5,9](src/lib/components/QuietLink.svelte:5).
- **Now:** Footer links repeat label-plus-arrow markup; Home’s “All work” implements separate feedback; admin/error return links use plain anchors.
- **Do:** Use `QuietLink`, adding an explicit surface variant for “All work”. Preserve footer placement and existing link text while sharing hover, press and touch-target behaviour.

## Token — 7 findings

### T01 — Cursor generation still uses the previous palette
**Severity: high · Visual change: yes, on regeneration · Effort: S**

- **Where:** [tools/cursor/make.mjs:7](tools/cursor/make.mjs:7); [tools/review/gridcheck.mjs:6](tools/review/gridcheck.mjs:6); [tools/review/tactility.mjs:14](tools/review/tactility.mjs:14); [tokens.ts:10,11](src/lib/tokens.ts:10).
- **Now:** The generator and review declarations retain `#11110e`/`#f4f4f0`; current tokens are `#181814`/`#efefeb`.
- **Do:** Import `INK` and `WHITE` and convert them to RGB where required. Remove the unused `WHITE`/`INK` declarations in `tactility.mjs`.

### T02 — Three text treatments fall off the bitmap cell table
**Severity: high · Visual change: yes · Effort: S**

- **Where:** [admin/+page.svelte:67,69](src/routes/admin/+page.svelte:67); [Options.svelte:12,23](src/lib/components/toolbox/Options.svelte:23).
- **Now:** Admin notes use Jersey at `22.5px`; referral dates use Jersey at `18px`. The options disclosure marker changes to Press Start but inherits the label’s `12.5px` size.
- **Do:** Use `.body` for bitmap reading text, or an explicitly shared reading role. Render the disclosure marker with `.mono` at `16/16`.

### T03 — Scene palettes repeat existing brand tokens
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [scene.ts:16,17,20,21](src/lib/scene.ts:16); [tokens.ts:10,11,12](src/lib/tokens.ts:10); [tokens.css:41](src/lib/styles/tokens.css:41).
- **Now:** Scene palettes repeat ink, white, yellow and the light-theme field yellow as hex values.
- **Do:** Reuse `INK`, `WHITE`, `YELLOW` and the resolved `--accent-field` value. Keep the scene-specific orange, rock and other artwork colours local.

### T04 — Existing type roles are restated outside `type.css`
**Severity: medium · Visual change: possible · Effort: M**

- **Where:** [blocks.css:82](src/lib/styles/blocks.css:82); [Code.svelte:26](src/lib/components/Code.svelte:26); [demo.css:76,139](src/lib/components/toolbox/demo.css:76); [admin/+page.svelte:68](src/routes/admin/+page.svelte:68); [toolbox/+page.svelte:115](src/routes/toolbox/+page.svelte:115).
- **Now:** Code and demo controls repeat `.body`; admin table headings repeat `.lbl`; the phone tool picker reconstructs `.lbl` on elements still carrying `.display-s`.
- **Do:** Apply the existing roles and remove redundant declarations. Define the picker’s responsive role centrally so its face, weight, size and casing change together.

### T05 — Specimen repeats the site’s font stacks
**Severity: medium · Visual change: possible during font loading · Effort: S**

- **Where:** [SpecimenDemo.svelte:9,10,11,12](src/lib/components/toolbox/SpecimenDemo.svelte:9); [primitives.css:32,33,34,36](src/lib/styles/primitives.css:32).
- **Now:** The specimen defines four family strings separately. Three omit the metric-adjusted fallback families now present in the tokens.
- **Do:** Use `var(--face-blackletter)`, `var(--face-text)`, `var(--face-display)` and `var(--face-mono)` in the sample styles. Keep its deliberate size ladders.

### T06 — Several spacing and grid values bypass available units
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [PlanRow.svelte:24,26](src/lib/components/toolbox/PlanRow.svelte:24); [LockupDemo.svelte:99,108](src/lib/components/toolbox/LockupDemo.svelte:99); [demo.css:50](src/lib/components/toolbox/demo.css:50); [figure.ts:13](src/lib/figure.ts:13); [work.ts:572](src/lib/work.ts:572); [Band.svelte:20](src/lib/components/Band.svelte:20); [caret.ts:39](src/lib/caret.ts:39).
- **Now:** Tree indentation uses `depth * 16`; plate padding uses `96px`; chip row gap uses `8px`; gallery helpers default to `16`; scene cells and caret clearance repeat `8`.
- **Do:** Use `--s2`, `--s12`, `--s1`, and `U` multiples in JavaScript. Keep the documented literal `round()` formulas unchanged.

### T07 — Admin disabled opacity bypasses `--dim`
**Severity: low · Visual change: yes · Effort: S**

- **Where:** [admin/login/+page.svelte:38](src/routes/admin/login/+page.svelte:38).
- **Now:** Disabled sign-in uses `.6`, while shared controls use theme-aware `var(--dim)`.
- **Do:** Use `var(--dim)`, preferably through the shared button work in **C02**.

## Merge — 11 findings

### M01 — Contact validation has two sources of truth
**Severity: high · Visual change: none · Effort: M**

- **Where:** [ContactForm.svelte:19,20,56,57,58](src/lib/components/ContactForm.svelte:19); [api/contact.js:20,26,76,77](api/contact.js:20).
- **Now:** Client and endpoint repeat the email regex, required-field rules and length limits.
- **Do:** Extract a dependency-free, runtime-compatible contact contract. Share the regex and limits; retain server sanitisation and client-specific error messages.

### M02 — Analytics duplicates its tag validator
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [Analytics.svelte:11,14](src/lib/components/Analytics.svelte:14); [analytics.ts:10,20](src/lib/analytics.ts:10).
- **Now:** The same `via` regex is copied to avoid importing the work/catalog dependency graph into the browser.
- **Do:** Move the pattern into a small dependency-free module used by both sides. Preserve the existing bundle separation.

### M03 — `Band` duplicates an incomplete `Ascii` prop contract
**Severity: high · Visual change: possible · Effort: M**

- **Where:** [Band.svelte:13,14,15,20](src/lib/components/Band.svelte:13); [Ascii.svelte:18,19](src/lib/components/Ascii.svelte:18).
- **Now:** Mode and field props are declared twice. `Ascii` supports `interactive` and `reach`; `Band` omits them, so those values would fall into wrapper attributes instead of reaching `Ascii`.
- **Do:** Derive the field prop type from `Ascii`, separate wrapper attributes, and forward the complete field-prop set.

### M04 — Study and share-image titles duplicate fitting logic
**Severity: high · Visual change: none · Effort: M**

- **Where:** [work/[slug]/+page.svelte:21,23,24,25](src/routes/work/[slug]/+page.svelte:21); [og/[id]/+page.svelte:27,29,33,39,40](src/routes/og/[id]/+page.svelte:27).
- **Now:** Both find the longest word, compare a probe with its container, observe resizing and wait for fonts.
- **Do:** Extract a probe-fitting action with consistent setup and cleanup. Keep each page’s size ladder and the OG row-centering calculation separate.

### M05 — Four Toolbox demos repeat the same screen shell
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [LockupDemo.svelte:42,81,88](src/lib/components/toolbox/LockupDemo.svelte:42); [PaletteDemo.svelte:32,78](src/lib/components/toolbox/PaletteDemo.svelte:32); [SpecimenDemo.svelte:28,68,74](src/lib/components/toolbox/SpecimenDemo.svelte:28); [ConvertDemo.svelte:85,114,120](src/lib/components/toolbox/ConvertDemo.svelte:85).
- **Now:** Readout, stage/rail structure, destination control and Back/count/Export toolbar are repeated.
- **Do:** Extract a demo frame with content slots and a shared destination control. Keep Lockup’s step navigation and each tool’s logic inside its own demo.

### M06 — `Picture` and `Clip` duplicate frame sizing and CSS
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [Picture.svelte:27,32,42,45](src/lib/components/Picture.svelte:27); [Clip.svelte:32,47,53,66,67](src/lib/components/Clip.svelte:32).
- **Now:** Both measure width, call `figureHeight`, assign height and manage a `ResizeObserver`. Frame and media-fit rules also repeat.
- **Do:** Extract a sizing action accepting the ratio and row share. Move the common frame rules into the shared block layer; retain image loading and video playback separately.

### M07 — Layout rule blocks are copied between pages
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [toolbox/[tool]/+page.svelte:49,57,60](src/routes/toolbox/[tool]/+page.svelte:49); [toolbox/agents/+page.svelte:109,121,126](src/routes/toolbox/agents/+page.svelte:109); [work/[slug]/+page.svelte:150,158](src/routes/work/[slug]/+page.svelte:150).
- **Now:** Guide headers and paragraph stacks have identical rules. Study `.point` and `.list` repeat the same grid, gap, alignment and top padding.
- **Do:** Share the guide layout classes through `layout.css`; combine the study selectors locally. Preserve the independent title ladders.

### M08 — Home and Contact duplicate the invitation heading
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [Invite.svelte:12,20,21,24](src/lib/components/home/Invite.svelte:12); [contact/+page.svelte:15,34,35,52](src/routes/contact/+page.svelte:15).
- **Now:** The same sentence, line break, `Decode` word and heading-stack treatment are maintained twice.
- **Do:** Extract an invitation heading supporting `h1`/`h2` and the existing word-size variants. Leave page composition outside it.

### M09 — Public-origin configuration is repeated
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [site.ts:4](src/lib/site.ts:4); [api/contact.js:19](api/contact.js:19); [hooks.server.ts:22,23](src/hooks.server.ts:22); [api/analytics/+server.ts:11](src/routes/api/analytics/+server.ts:11); [analytics.ts:22](src/lib/analytics.ts:22); [og/[id]/+page.svelte:57](src/routes/og/[id]/+page.svelte:57); [tools/review/seo.mjs:14](tools/review/seo.mjs:14); [tools/social/verify.mjs:12,13,18,24](tools/social/verify.mjs:12).
- **Now:** Redirects, origin checks, referral filtering, links and verification scripts independently encode the public hostname.
- **Do:** Share a dependency-free site configuration usable by both runtimes and tools. Derive the canonical hostname while keeping the apex alias explicit.

### M10 — Toolbox release location is defined independently
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [toolbox.ts:128](src/lib/toolbox.ts:128); [seo.ts:14](src/lib/seo.ts:14); [server/releases.ts:19](src/lib/server/releases.ts:19).
- **Now:** Toolbox and SEO each define `RELEASES`; the admin API independently embeds the repository identity.
- **Do:** Define the repository once and derive its public releases URL and API URL. Import the public URL into SEO.

### M11 — Share-image route mapping is reconstructed repeatedly
**Severity: medium · Visual change: none · Effort: M**

- **Where:** [social.ts:23](src/lib/social.ts:23); [tools/social/generate.mjs:39](tools/social/generate.mjs:39); [tools/social/verify.mjs:6](tools/social/verify.mjs:6); [og/[id]/+page.ts:11,12,13,15,18](src/routes/og/[id]/+page.ts:11).
- **Now:** Metadata, image generation, verification and OG loading separately reconstruct page/image naming.
- **Do:** Use `socialPages` for generation IDs, verification cases and chrome-path lookup. Retain `story` and `wide` as explicit extra compositions.

## Missing-token — 3 findings

### MT01 — The mobile reading caption needs a shared type role
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [work/[slug]/+page.svelte:190](src/routes/work/[slug]/+page.svelte:190); [toolbox/+page.svelte:106](src/routes/toolbox/+page.svelte:106).
- **Now:** Both reconstruct IBM Plex Mono `14/24`, sentence case and antialiasing on phones.
- **Do:** Add a shared caption role in `type.css`, preserving the desktop label treatment and phone reading treatment.

### MT02 — Focus-ring dimensions are repeated
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [base.css:27](src/lib/styles/base.css:27); [demo.css:61,67,70,85](src/lib/components/toolbox/demo.css:61).
- **Now:** The global ring and four demo rules repeat `2px solid var(--accent-text)` and usually a `2px` offset.
- **Do:** Define shared focus width/offset tokens. Preserve the dithered field’s deliberate zero-offset variant.

### MT03 — The same field appearance preset is copied five times
**Severity: medium · Visual change: none · Effort: S**

- **Where:** [routes/+page.svelte:15](src/routes/+page.svelte:15); [contact/+page.svelte:13](src/routes/contact/+page.svelte:13); [not-found/+page.svelte:10](src/routes/not-found/+page.svelte:10); [toolbox/+page.svelte:31](src/routes/toolbox/+page.svelte:31); [og/[id]/+page.svelte:74](src/routes/og/[id]/+page.svelte:74).
- **Now:** Each specifies `feather={12}`, `depth={0.85}`, `clearFeather={3}`.
- **Do:** Export a named field-appearance preset and spread it into these calls. Keep scene geometry, selectors and page-specific overrides local.

## Dead — 3 findings

### D01 — `Decode.live` has no consumer
**Severity: low · Visual change: none · Effort: S**

- **Where:** [Decode.svelte:15,31,38,62,73](src/lib/components/Decode.svelte:15).
- **Now:** Reactive state is updated throughout playback solely to emit a `live` class. No source or tool consumes that class.
- **Do:** Remove the state, assignments and class directive. Keep `done`, which controls playback.

### D02 — Retired card metadata leaves an unused branch and selector
**Severity: low · Visual change: none · Effort: S**

- **Where:** [MetaLine.svelte:5,6,9](src/lib/components/MetaLine.svelte:5); [blocks.css:54](src/lib/styles/blocks.css:54); [Card.svelte:14](src/lib/components/Card.svelte:14); [og/[id]/+page.svelte:105](src/routes/og/[id]/+page.svelte:105).
- **Now:** No caller uses `MetaLine.short`; cards no longer render a `.lbl` inside `.card-body`.
- **Do:** Remove the short branch and `.card-body .lbl` selector. Keep `MetaLine` itself: OG images still use its full form.

### D03 — Two imports are unused
**Severity: low · Visual change: none · Effort: S**

- **Where:** [social.ts:3](src/lib/social.ts:3); [og/[id]/+page.svelte:14](src/routes/og/[id]/+page.svelte:14).
- **Now:** `social.ts` imports `SITE_URL` without reading it; its separate re-export does not require that import. OG imports `STEP` but uses only `STEP_SLOW`.
- **Do:** Remove those unused imports.

## Naming — 2 findings

### N01 — Media dimensions use two naming conventions
**Severity: low · Visual change: none · Effort: M**

- **Where:** [work.ts:13](src/lib/work.ts:13); [toolbox.ts:8](src/lib/toolbox.ts:8); [Picture.svelte:16](src/lib/components/Picture.svelte:16); [Clip.svelte:17](src/lib/components/Clip.svelte:17); [work/[slug]/+page.svelte:76](src/routes/work/[slug]/+page.svelte:76).
- **Now:** Data uses `w`/`h`; component props use `width`/`height`; phone-image objects revert to `w`/`h`.
- **Do:** Introduce one shared image-source type and use one dimension convention across data, crops and components.

### N02 — Image-size helpers are named as CSS classes
**Severity: low · Visual change: none · Effort: S**

- **Where:** [work/[slug]/+page.svelte:57,58,76](src/routes/work/[slug]/+page.svelte:57).
- **Now:** `galleryClass()` and `heroClass()` return HTML `sizes` strings.
- **Do:** Rename them `gallerySizes()` and `heroSizes()` to match their purpose and the `Picture.sizes` prop.

## Top 10 to do first

1. **C01:** Restore shared press states on Home.
2. **T02:** Fix off-grid admin text and disclosure markers.
3. **M03:** Unify and complete `Band`’s field-prop contract.
4. **C02:** Add button support to `Cta`.
5. **M01:** Share contact validation rules and limits.
6. **T01:** Correct the cursor generator’s palette.
7. **M04:** Extract title-probe fitting.
8. **M05:** Consolidate the four demo shells.
9. **T04:** Remove restated type roles.
10. **MT01:** Centralise mobile caption typography.

**Counts**

- **Component:** 4
- **Token:** 7
- **Merge:** 11
- **Missing-token:** 3
- **Dead:** 3
- **Naming:** 2
- **Total:** 30