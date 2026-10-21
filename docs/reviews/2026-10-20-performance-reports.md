# Performance audit, 2026-10-20: full reports

## Lighthouse 13.5.0 (assistant run)


| page | preset | perf | a11y | best | seo | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|---|---|---|
| home | mobile | 83 | 100 | 96 | 100 | 1.7 s | 3.1 s | 400 ms | 0 | 1.7 s |
| home | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.7 s | 60 ms | 0 | 0.4 s |
| work | mobile | 93 | 100 | 96 | 100 | 1.7 s | 3.1 s | 0 ms | 0.001 | 1.7 s |
| work | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.6 s | 0 ms | 0.002 | 0.4 s |
| worksonde | mobile | 94 | 100 | 96 | 100 | 1.7 s | 3.0 s | 0 ms | 0.001 | 1.7 s |
| worksonde | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.8 s | 0 ms | 0 | 0.4 s |
| contact | mobile | 95 | 100 | 96 | 100 | 1.6 s | 2.8 s | 0 ms | 0 | 1.6 s |
| contact | desktop | 100 | 100 | 96 | 100 | 0.4 s | 0.6 s | 0 ms | 0 | 0.4 s |
| toolbox | mobile | 94 | 100 | 96 | 100 | 1.9 s | 2.9 s | 0 ms | 0 | 1.9 s |
| toolbox | desktop | 100 | 100 | 96 | 100 | 0.5 s | 0.7 s | 30 ms | 0.002 | 0.7 s |

## Audits under 0.9
- **Largest Contentful Paint** (largest-contentful-paint): home/mobile (3.1 s), work/mobile (3.1 s), worksonde/mobile (3.0 s), contact/mobile (2.8 s), toolbox/mobile (2.9 s)
- **Total Blocking Time** (total-blocking-time): home/mobile (400 ms)
- **Max Potential First Input Delay** (max-potential-fid): home/mobile (450 ms)
- **Browser errors were logged to the console** (errors-in-console): home/mobile, home/desktop, work/mobile, work/desktop, worksonde/mobile, worksonde/desktop, contact/mobile, contact/desktop, toolbox/mobile, toolbox/desktop
- **Use efficient cache lifetimes** (cache-insight): home/mobile (Est savings of 134 KiB), home/desktop (Est savings of 107 KiB), work/mobile (Est savings of 113 KiB), work/desktop (Est savings of 112 KiB), worksonde/mobile (Est savings of 62 KiB), worksonde/desktop (Est savings of 130 KiB), contact/mobile (Est savings of 0 KiB), contact/desktop (Est savings of 0 KiB), toolbox/mobile (Est savings of 0 KiB), toolbox/desktop (Est savings of 0 KiB)
- **Improve image delivery** (image-delivery-insight): home/mobile (Est savings of 19 KiB), worksonde/desktop (Est savings of 14 KiB)
- **Network dependency tree** (network-dependency-tree-insight): home/mobile, home/desktop, work/mobile, work/desktop, worksonde/mobile, worksonde/desktop, contact/mobile, contact/desktop, toolbox/mobile, toolbox/desktop
- **Render-blocking requests** (render-blocking-insight): home/mobile (Est savings of 430 ms), home/desktop (Est savings of 80 ms), work/mobile (Est savings of 430 ms), work/desktop (Est savings of 80 ms), worksonde/mobile (Est savings of 430 ms), worksonde/desktop (Est savings of 80 ms), contact/mobile (Est savings of 420 ms), contact/desktop (Est savings of 70 ms), toolbox/mobile (Est savings of 890 ms), toolbox/desktop
- **First Contentful Paint** (first-contentful-paint): toolbox/mobile (1.9 s)

## Notes
- Local preview, so **cache lifetimes are not representative** (vite preview does not send vercel.json's headers) and the **console error is the analytics endpoint's 403** for a non-production origin; neither is a live-site problem.
- Home mobile's one long task: `_app/immutable/chunks/COkrQXSP.js`, 449ms (4× CPU throttle, Lighthouse mobile preset). That is the source of TBT 400ms / max FID 450ms. Worth identifying (the Ascii field's first draw is the suspect).
- Render-blocking: five CSS files on Home (0.*.css, 3.*.css, Picture, Band, Decode), est. 430ms on mobile; Toolbox mobile 890ms.
- Mobile LCP is 2.8–3.1s on every page (FCP 1.6–1.9s).
- `COkrQXSP.js` is the Band/Ascii chunk (contains the scene, mountains and field-measure code): the 449ms long task is the field, most likely its first full draw of the page-tall Home sky.

## Fable

# Performance audit: timothyali2 (read-only, 2026-10-20)

Measured against the production preview on http://127.0.0.1:4173 (the build in `.svelte-kit/output`, 2026-10-20 19:08; it predates the uncommitted edits to `Band.svelte` and the dev-only `/og/[id]` route, which do not affect the client bundle) with Playwright + headless Chrome (`channel: 'chrome'`), CDP `Performance.getMetrics`, `PerformanceObserver` (LCP / CLS / longtask / event), the V8 sampling profiler, `Tracing` with the devtools.timeline categories, monkey-patched canvas calls, and `Emulation.setCPUThrottlingRate(4)` for the phone profile. The coordinator's Lighthouse 13.5 runs (`perf/lh/`) are folded in. Live-site headers were checked with `curl`. Scripts: `perf/fable/{load,profile,trace,firstdraw,runtime,nav}.mjs`, raw numbers in `perf/fable/load-results.json`.

**Headline.** Desktop is in good shape (Lighthouse 100 on every page; 0.4 s FCP / 0.6–0.8 s LCP). Phone is network-bound and otherwise fine (93–95) except Home (83), where one 450 ms task in the ASCII field at hydration costs the whole TBT budget. The field is also the only meaningful runtime cost: a pointer resting on it keeps the main thread ~44 % busy on a desktop. Everything else (fonts, images, caching, layout stability, bundle discipline) is already done carefully; the findings below are about how the field is drawn and a few bytes.

One calibration note first: every fresh headless Chrome process spends ~180 ms in its first layout/style pass (system font lookup); a bare two-paragraph test page shows the same 185 ms task. This shows up as a "no URL" long task in Lighthouse (Toolbox desktop 273 ms, "Style & Layout 552 ms") and in my traces as `Document::recalcStyle` 180 ms at DOMContentLoaded. Removing the `local()` fallback faces, the inlined PARC Pixel data URLs, or the `:root:has()` rule changed nothing. It is a harness artifact, not a site cost; discount it from TBT numbers.

## Findings, ranked by user-visible impact

### 1. Home's page-tall field is drawn in full four times at hydration, three of them thrown away

**Where:** `src/lib/components/Ascii.svelte:310` (`resize()` → `draw(!motion.on)`), `:328` (theme `$effect` → `resize()` on first run), `:330` (motion `$effect` → `draw(true)` while `motion.on` is still false), `:124` (`onMeasure` → `draw(true)` with motion off), triggered by `src/lib/components/home/Hero.svelte:35` (`field-measure` dispatched from an `$effect` at mount). `motion.on` is false until the layout's `onMount` (`src/routes/+layout.svelte:99`), which runs after every child has mounted.

**Evidence:** Patching `clearRect`/`drawImage` during load (`firstdraw.mjs`): on desktop Home the canvas (1440×2920, 180×365 cells) is cleared at its full height four times before the first visible-rows paint, with 124 k `drawImage` calls in the first 400 ms against 9.5 k per steady-state paint; same four full clears on the phone (392×3336). The V8 profile puts `draw()` at 121 ms self time plus ~60 ms in `sceneCell`/`fbm`/`knockout`/`layoutMountains` inside Home's hydration task; the trace shows that task as 180–275 ms on desktop (up to 900 ms on a cold browser) and 196–217 ms at 4× CPU, nearly all `RunMicrotasks` (hydration + these draws) plus 20–49 ms `Canvas2DResourceProvider::Snapshot` (compositing a 16 MB canvas after each full draw). Lighthouse mobile: one 449 ms long task in `COkrQXSP.js` (the Ascii chunk), TBT 400 ms, max FID 450 ms, Home mobile 83 while every other page scores 93–95 with TBT 0. The cost scales with viewport width × page height: a 2560-wide window would roughly double it.

**Fix:** (a) Draw only the rows on screen at mount whenever JavaScript is running, and fill the off-screen rows in `requestIdleCallback` chunks (or on scroll, as the motion loop already does) instead of synchronously; keep the synchronous full draw only for the motion-off path, and even there chunk it. (b) Coalesce the four mount-time triggers into one: route `onMeasure`, the theme effect's first run and the motion effect's first run through the existing `queueResize` rAF queue (or an equivalent "draw queued" flag) so the first frame draws once. (c) Let the theme effect skip its first run (it fires at mount with the value it already drew with). Nothing a visitor sees changes; the first paint of the field is identical. Expected: Home mobile TBT 400 → ~100 ms, the hydration task on desktop ~250 → ~80 ms.
**Effort:** M. **Confidence:** high.

### 2. A pointer over the field repaints every visible cell at 60 fps for four seconds after each move

**Where:** `Ascii.svelte:120` (`warm()` sets `warmUntil = now + WAVE.life[1]*1000 + 500` = 4.1 s for any pointer move), `:342–345` (`live` keeps a rAF loop going), `:273–289` (the per-frame loop redraws every on-screen cell: `bent()`, ramp lookup, `Map.get`, `drawImage` for ~20 k cells on a 1440×900 window).

**Evidence:** `runtime.mjs`, desktop Home, motion on: idle at the top of the page 84 ms/s of main thread; the pointer merely resting on the field 436 ms/s (same as moving: 429 ms/s); after six clicks (ripples) 494 ms/s; idle again 90 ms/s. 60 frames/s throughout. Phone at 4× CPU: a touch drag 545 ms/s (phones have no hover, so only during a drag). On a study page (strip field 1440×384) resting pointer 199 ms/s. The heat trail decays to <3 % in ~2 s (`DECAY` 0.94 per 33 ms, `:31`), so the last two seconds of each 4.1 s window repaint an unchanged field.

**Fix:** Repaint only what changed while live: the cells within `reach` of the pointer (plus the trail's cells, which the heat array already identifies: `heat[i] > 0.01`) and each ring's bounding box, clearing and redrawing just those cells; keep the full visible repaint for ticks, scroll and resize. Separately, let the heat's live window end when the trail has decayed (≈2 s) and let rings keep their own clock (`bursts.length`). No visual change: the same cells end up in the same state. Expected: pointer-over cost from ~430 ms/s to well under 100 ms/s on desktop, with the fan and battery benefit that implies on laptops where the cursor usually sits over the page.
**Effort:** M. **Confidence:** high.

### 3. Render-blocking CSS costs a round trip before first paint on phones

**Where:** `src/routes/+layout.svelte:4–9` and the per-route styles; the build emits five stylesheets on Home (`0.*.css` 9.1 KB gz with the two inlined PARC Pixel faces, plus `3.*.css`, `Picture`, `Band`, `Decode`, 10.4 KB gz together; Toolbox 13.6 KB gz over four files).

**Evidence:** Lighthouse "render-blocking requests": est. 430 ms on Home/Work/Sonde/Contact mobile, 890 ms on Toolbox mobile, 70–80 ms desktop. Mobile FCP is 1.6–1.9 s and LCP 2.8–3.1 s on every page, and on the text pages (Home, Contact, Toolbox) the LCP element is text (`p.hero-role`, `h1 .display`, `h2#tools-title`) with a render delay of 76–280 ms after the CSS, so first paint is the lever. The HTML itself is 4–11 KB gz.

**Fix:** Set `kit.inlineStyleThreshold` (e.g. 32768) in `svelte.config.js` so SvelteKit inlines the page's CSS into the prerendered HTML; the CSP already allows `style-src 'unsafe-inline'`, and the per-page HTML grows by ~10 KB gz while losing the CSS cache across pages (visitors see one to three pages, so first view wins). If the base64 fonts in `base.css` make the inlined block feel heavy, they can stay as a separate stylesheet that is not render-blocking (`media="print" onload`-style or a preloaded `<link>`), since they have `font-display: block` and are only 3.6 KB. Nothing visible changes.
**Effort:** S. **Confidence:** medium (Lighthouse's estimate; one RTT on slow 4G ≈ 150–300 ms).

### 4. Home and Work ship the whole work index and the Toolbox option tables to render cards

**Where:** `src/lib/components/home/WorkList.svelte:7` and `src/routes/work/+page.svelte` import `projects` from `src/lib/work.ts`, which is one array holding every study's text blocks, gallery rows and captions (`work.ts:587–591`) and imports `./toolbox.ts:8`, which imports `toolbox-options.ts`.

**Evidence:** Chunk `s5MbH-FC.js` (work.ts) is 45.9 KB raw / 16.5 KB gz and `BGpuyGUo.js` (toolbox-options) 13.4 KB raw / 4.3 KB gz; both are modulepreloaded on Home (`prerendered/pages/index.html`) and Work. Home's JavaScript is 90 KB gz in 36 files; these two are 23 % of it and the cards use nine fields per project (slug, title, description, cover). The layout already fixed the same leak for its own data (0207, `+layout.server.ts`).

**Fix:** Split `work.ts` into `work-index.ts` (the `Entry` fields + cover, imported by the cards) and the per-study content (imported only by `/work/[slug]`), or move the card data into the page `load` as the layout does for meta. Drop the `toolbox.ts` import from the index module. ~20 KB gz less on Home/Work; no visible change.
**Effort:** S–M. **Confidence:** high.

### 5. The eager study image is served at 2400 px on 2× desktops: up to 1 MB for FirstStrike

**Where:** `tools/images/derive.mjs:26` (`LADDER = [640, 1000, 1280, 1600, 2400]`), `:54–55` (quality 82/80); `src/lib/figure.ts:7–9` (`sizes` = `calc(100vw - 64px)`); `src/lib/components/Picture.svelte:32`.

**Evidence:** On a 1440 CSS px window at DPR 2 the hint resolves to 2752 px, so Chrome picks the 2400 rung for a full-frame figure. The eager (LCP) images: `work/firststrike/hero.2400.webp` 978 KB, `work/firstledger/hero.2400.webp` 481 KB; the others are 15–90 KB. These are photographs, so the top rung is where the bytes are. (The `@2x.jpg` and `.jpg` originals, 30 MB on disk, are only the no-WebP fallback and are not fetched by current browsers.)

**Fix:** Either cap the ladder for photographs at 1600 and let 2× screens upscale 1.7× (visible: slightly softer on Retina for those two heroes), or keep 2400 but encode the top rung at a lower quality (q 70–74 for `.jpg` masters; photographs hide it, ~40 % smaller) and/or add a 2000 rung. Flagged under "changes what a visitor sees".
**Effort:** S. **Confidence:** high for the bytes, medium for how much it moves LCP (both pages are below the selected four).

### 6. Every resize recomputes the whole field and re-lays the mountain picture

**Where:** `Ascii.svelte:292–311` (`resize()` sets `baseDirty = true` unconditionally and calls `layoutMountains` at `:306` whenever the image is loaded), observed by two `ResizeObserver`s including `document.body` (`:322`), `document.fonts.ready` (`:322`) and the mountain image's `onload` (`:320`).

**Evidence:** V8 profile on the phone: `layoutMountains` (`Se`) 37 ms and `sceneCell`/`fbm` ~60 ms during load; the trace shows a third long task of 62–69 ms at +455 ms (rAF → `resize` → full recompute + `Decode Image` 15 ms for the mountain WebP). The `queueResize` coalescing (`:313–314`) already limits this to one per frame, but each one is still a full `baseDirty` rebuild even when `cols`/`rows` did not change (the fonts-ready and body-size callbacks usually change nothing for a page-tall field).

**Fix:** Only set `baseDirty` when `cols`, `rows`, `screenRows` or the dither mode actually changed; cache `layoutMountains` by (`cols`, `screenRows`, `shot`, dither) and reuse it; drop the `document.body` observation for fields whose host is already observed (the host's own size changes when the body's does). No visible change.
**Effort:** S. **Confidence:** medium-high.

### 7. The light theme's dither draw is ~2× the dark draw per tick

**Where:** `Ascii.svelte:255–271`: four `fillRect` calls per cell with a `fillStyle` change per pixel.

**Evidence:** `runtime.mjs` desktop Home idle: 90 ms/s dark, 159 ms/s after flipping to light; phone 85 → 90 ms/s (fewer cells). It is per-tick work (6.25 paints/s), so it is a steady drain rather than a jank source.

**Fix:** Build the four-pixel dither patterns as sprites (16 patterns × palette colours, like the glyph sprites) and `drawImage` one per cell, or batch `fillRect` calls by colour with `beginPath`/`rect`/`fill`. Identical pixels.
**Effort:** S–M. **Confidence:** medium.

### 8. Thirty-six JavaScript files on Home; a dozen are under 1 KB

**Where:** build output `.svelte-kit/output/client/_app/immutable/chunks/` (default Rollup splitting; `vite.config.ts` sets nothing).

**Evidence:** Home preloads 36 modules (90 KB gz); Sonde 37; Contact 32. Eleven chunks are ≤ 1 KB. On HTTP/2 the requests are cheap, but under slow-4G simulation each adds queueing against the fonts and the LCP image, and Lighthouse's "network dependency tree" flags every page.

**Fix:** In `vite.config.ts`, `build: { rollupOptions: { output: { experimentalMinChunkSize: 10_000 } } }` (or a small `manualChunks` that folds the Svelte runtime + kit client together), and check the per-route totals do not grow. No visible change.
**Effort:** S. **Confidence:** low-medium (the mobile LCP gain is simulated; measured on the wire it may be ~100 ms).

### 9. Steady-state field cost on a desktop: ~100 ms/s even when nothing moves

**Where:** `Ascii.svelte:206–240` (each tick recomputes the visible rows: `field()` per cell) and `:273–289` (repaints all of them), `TICK_SLOW` 160 ms (`src/lib/tokens.ts:33`).

**Evidence:** Desktop Home idle at the bottom of the page 111 ms/s, at the top 84 ms/s (the hero's typing adds `field-measure` draws, `Hero.svelte:35`, `Ascii.svelte:124`); study pages 51–71 ms/s; Toolbox 16 ms/s; phone 4× 31–97 ms/s. 60 fps is kept everywhere and no long tasks occur, so this is battery, not jank; a 10 % core on an open tab is on the high side for an ambient texture.

**Fix:** Two cheap wins without changing the cadence: skip the tick repaint when the computed cell values did not change from the last tick (compare `bV`/`bCh` per row and only redraw changed rows; the sky and scene fields change slowly), and pause the loop when `document.hidden` (the rAF already stops, but the `setTimeout` tick keeps firing and measuring). Identical output.
**Effort:** S. **Confidence:** medium.

### 10. The long PARC clip autoplays on desktop at 5.2 MB

**Where:** `src/lib/work.ts` (PARC's `video` entry with `tap` for phones only), `src/lib/components/Clip.svelte:31–33` (`tap && phone`).

**Evidence:** `static/work/video/parc-after-darc-intro.mp4` is 5.2 MB (2:24); on a desktop with motion on it plays as soon as it scrolls into view. `preload="none"` + the WebP poster mean nothing loads until then, which is right; the phone gets the 2.5 MB encode behind a tap.

**Fix:** This is a data-cost call, not a bug: a `tap` on desktop too, or a lower-bitrate desktop encode (it is a pixel-art piece; a 1.5–2 MB encode would likely look the same). Visible either way, so flagged below.
**Effort:** S. **Confidence:** high on bytes, low on whether it matters to him.

### Smaller notes (no action needed, or trivial)

- `stir()` decays `heat` and zeroes `ring` over the whole page-tall field each live frame (`Ascii.svelte:129,134`): 65 k floats, ~0.2 ms. Fine.
- The hero loop polls every 300 ms while the hero is off screen (`Hero.svelte:45,47`) and the clock ticks every second (`+layout.svelte:106`): negligible wakeups; Chrome throttles both in background tabs.
- `measureBoxes` forces one layout per tick (`Ascii.svelte:100`, `src/lib/knockout.ts:59–75`): measured at ~1 ms/s. Fine.
- Client-side navigation Home → `/work/sonde/`: hover preload 6 requests / 9 KB; click 7–8 requests / 49–61 KB; no long tasks on desktop or at 4× CPU (`nav.mjs`). The study's strip field (1440×384) is cheap to draw in full.
- `static/fonts/parc-pixel*.woff2` (6 files, 12 KB) are not referenced by anything (the faces are inlined in `base.css`); everything else in `static/` is referenced. Deleting them is housekeeping only.
- The `/api/analytics` beacon is a POST per page view with `keepalive`, to a Node 24 function in iad1; a cold start there delays nothing a visitor sees. `api/contact.js` imports `@upstash/redis` and reaches Resend; its cold path is only paid on a form submit, behind the form's own pending state. Could not measure without the environment.
- Memory: the Home canvas backing store is 16 MB at 1440 wide (1× store, scaled with `image-rendering: pixelated`, 0207) and ~2.5 MB of typed arrays; JS heap 3–5 MB. Fine.

## Already good: do not touch

- **Fonts.** Three (study pages: four) latin-only woff2 files, all preloaded (`+layout.svelte:14,119`), `font-display: swap`, and size-adjusted `local()` fallbacks (`base.css:15–17`) so the swap does not move anything: CLS 0.000–0.002 on every page in both Lighthouse and my runs. PARC Pixel inlined (1.7 KB a weight) so labels never blank. Jersey 15 is the body face, so its preload is earned.
- **Images.** WebP ladders with correct `sizes` (the Work cards pick 640 w on desktop and the 1200 w phone crop at DPR 3, verified as the LCP resources), `width`/`height` + the `figure` action so lazy images never shift layout, `fetchpriority="high"` only on the first image, `loading="lazy"` on the rest, phone crops through `<picture>`, posters as WebP, `preload="none"` on video with the small encode on phones.
- **Delivery.** Live site: Brotli on HTML, `immutable, max-age=31536000` on `_app/immutable`, 7-day + SWR on images/hero/cursor, 1-day on the résumé, apex → www as 308, trailing-slash as 308, prerendered HTML with `must-revalidate` served from the edge cache (`x-vercel-cache: HIT`, TTFB 115–340 ms from here). CSP is a ~400-byte meta tag; no third-party requests at all.
- **The field's loop at rest** (0206/0207): it really does sleep between ticks, wakes on scroll, stops off screen, and the knockout is cached per row. Scroll stays at 60 fps on both profiles.
- **Layout stability.** No measurable CLS anywhere; the one 0.003 shift seen on Work is the card title fit (`fit.ts`) and is below any threshold.
- **The design-system CSS** is small (10 KB gz including the fonts) and the Svelte runtime + kit client are ~22 KB gz; the site has no framework bloat to cut.

## Changes that would alter what a visitor sees

Only two findings touch the pixels or the experience, and both are optional:

- **#5** capping or re-encoding the 2400 px rung: FirstStrike's and First Ledger's hero photos would be slightly softer on 2× screens (or ~40 % smaller at a quality a photograph hides). Everything else in #5 (adding a rung) is invisible.
- **#10** gating the PARC clip behind a tap on desktop, or re-encoding it: either the clip waits for a click, or it plays at a lower bitrate.

Findings #1–#4 and #6–#9 change timing and bytes only; the drawn field, the motion and the copy are unchanged.

## Measurement tables

Lighthouse 13.5 (coordinator, local preview; mobile = slow 4G + 4× CPU simulation):

| page | mobile perf | FCP | LCP | TBT | desktop perf | FCP | LCP | TBT |
|---|---|---|---|---|---|---|---|---|
| Home | 83 | 1.7 s | 3.1 s | 400 ms | 100 | 0.4 s | 0.7 s | 60 ms |
| Work | 93 | 1.7 s | 3.1 s | 0 | 100 | 0.4 s | 0.6 s | 0 |
| Sonde | 94 | 1.7 s | 3.0 s | 0 | 100 | 0.4 s | 0.8 s | 0 |
| Contact | 95 | 1.6 s | 2.8 s | 0 | 100 | 0.4 s | 0.6 s | 0 |
| Toolbox | 94 | 1.9 s | 2.9 s | 0 | 100 | 0.5 s | 0.7 s | 30 ms |

Playwright, local preview, no network throttle, median of 3 (CPU-only picture; headless FCP timing is not reliable in absolute terms, long tasks are):

| profile | page | long tasks (ms) | script ms | bytes KB (requests) | canvas |
|---|---|---|---|---|---|
| desktop 1440×900 | / | 275 + 146 (cold run 913) | 125 | 298 (60) | 1440×2920 |
| desktop | /work/ | 168 | 4 | 251 (58) | none |
| desktop | /work/sonde/ | 228 | 58 | 257 (59) | 1440×384 |
| desktop | /contact/ | 391 | 49 | 166 (50) | 1440×~900 |
| desktop | /toolbox/ | 763 (font artifact) | 22 | 187 (51) | 1440×608 |
| phone 390×844, 4× CPU | / | 100 + 210 + 67 | 183 | 325 (59) | 392×3336 |
| phone 4× | /work/sonde/ | 236 + 112 | 69 | 245 (60) | 392×240 |

(Subtract the ~180 ms fresh-process font task from the first long task in each row.)

Runtime, motion on, main-thread ms per second (`runtime.mjs`):

| state | Home desktop | Home phone 4× | PARC study desktop | Toolbox desktop |
|---|---|---|---|---|
| idle, top | 84 | 97 | 51 | 16 |
| pointer resting | 436 | 99 | 71 | 80 |
| pointer moving | 429 | 545 (drag) | 199 | 102 |
| 6 ripples + 4 s | 494 | 517 | 121 | 107 |
| scrolling | 291 | 129 | 22 | 45 |
| idle, bottom | 111 | 31 | 11 | 16 |
| idle, light theme | 159 | 90 | 104 | 63 |

Theme toggle: longest event handler 24–32 ms, no long task (INP fine). Frame rate 60 fps in every state.

Per-route payload (gz): Home 90 KB JS in 36 files + 10.4 KB CSS + 5 KB HTML + 68 KB fonts; Work 76 KB JS; Sonde 93 KB JS + 83 KB fonts; Contact 68 KB; Toolbox 83 KB JS + 13.6 KB CSS.

## Codex (gpt-6-astra)

**The strongest opportunities are excess route JavaScript and avoidable canvas work. No repo files were changed.**

LCP, FCP, TTFB, CLS, INP, and throttled browser timings remain **unmeasured**. The local preview refused connections, and browser profiling was blocked. Rankings below use source evidence and the existing production build.

Build sizes below are **KB**, with gzip calculated locally; they exclude images and fonts.

| Route | JS raw / gzip | CSS gzip | Preloaded fonts |
|---|---:|---:|---:|
| Home | 224.9 / 90.0 | 10.3 | 64.5 |
| Work | 192.9 / 76.0 | 9.4 | 64.5 |
| Sonde | 230.0 / 92.1 | 10.5 | 79.2 |
| Contact | 155.2 / 67.2 | 10.2 | 64.5 |
| Toolbox | 200.9 / 82.9 | 13.6 | 64.5 |

1. **Home, Work, and individual studies download the entire project catalog.**  
   **Where:** [work.ts:8](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/work.ts:8), [study loader:9](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/routes/work/[slug]/+page.ts:9).
   - **Evidence:** Their HTML preloads the catalog and Toolbox data chunks: **59.3 KB raw / 20.8 KB gzip** together. This includes unrelated study copy and CLI option tables.
   - **Fix:** Return card summaries through server loaders; return only the requested study and minimal Next-link data. Separate gallery helpers from the catalog.
   - **Visible change:** None.
   - **Effort: M · Confidence: high**

2. **The ASCII field still repeats substantial work when only a small area changes.**  
   **Where:** [Ascii.svelte:120](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:120), especially lines 129, 148, 216, 308 and 338.
   - **Evidence:** Pointer activity keeps viewport redraws running at display refresh rate for **4.1 seconds**. Every draw traverses the full heat array and clears the full ring array. Ambient ticks remeasure text; resize callbacks reset the canvas even when its dimensions are unchanged.
   - **Fix:** Track affected heat/ring rows, cache unchanged scene geometry, invalidate text measurements on actual changes, and skip unchanged canvas assignments. Preserve ripple shapes, cadence and interaction.
   - **Visible change:** None intended; verify frame parity.
   - **Effort: L · Confidence: medium** on visitor impact without profiling.

3. **Studies preload Jersey 15 despite using other faces for their displayed content.**  
   **Where:** [+layout.svelte:14](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/routes/+layout.svelte:14).
   - **Evidence:** Sonde preloads **16.6 KB** of Jersey. Its reading text uses Plex, headings use PARC, the wordmark uses Jacquard, and arrows/readout use Press Start.
   - **Fix:** Make the Jersey preload route-specific. Keep its CSS declaration available for navigation to routes that use it.
   - **Visible change:** None.
   - **Effort: S · Confidence: high**

4. **The Home hero reserves different text geometry before and after its loop starts.**  
   **Where:** [Hero.svelte:64](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/home/Hero.svelte:64).
   - **Evidence:** After a **2.6-second hold**, the full static paragraph becomes individually stacked line sizers. The initial combined paragraph can occupy more lines, moving the bottom-aligned heading when the branch switches. This is a CLS risk, not a measured CLS result.
   - **Fix:** Give both branches the same reserved name and paragraph geometry at each breakpoint.
   - **Visible change:** Removes possible movement during the handover; preserve the typing sequence.
   - **Effort: M · Confidence: medium**

5. **Toolbox ships inactive demos immediately and does unnecessary encoding work in Convert.**  
   **Where:** [ToolDemo.svelte:7](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/toolbox/ToolDemo.svelte:7), [ConvertDemo.svelte:20](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/toolbox/ConvertDemo.svelte:20).
   - **Evidence:** All four demos are statically imported into a **40.8 KB route chunk**. Selecting Convert creates two 1800×2400 canvases: **34.6 MB of RGBA pixels**, before encoding buffers. WebP-only output also encodes an unused JPEG at line 76.
   - **Fix:** Split inactive demos, prefetch them near the selector, skip unnecessary JPEG encoding, cache repeated results, and invalidate running jobs on unmount.
   - **Visible change:** None intended; avoid introducing a loading pause when switching tools.
   - **Effort: M · Confidence: high**

6. **Home discovers its mountain image only after JavaScript mounts.**  
   **Where:** [Ascii.svelte:320](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:320).
   - **Evidence:** The **72.7 KB** mountain WebP is requested through `new Image()` after hydration. Until it arrives, the renderer uses procedural mountains, then lays out and redraws the image-backed scene.
   - **Fix:** Add a Home-only image preload at normal priority so it starts alongside the initial resources.
   - **Visible change:** The final scene arrives sooner; its composition stays unchanged.
   - **Effort: S · Confidence: medium** on benefit without a network trace.

7. **Some image sizing hints disagree with the actual layout.**  
   **Where:** [Picture.svelte:32](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Picture.svelte:32), [study gallery sizes:46](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/routes/work/[slug]/+page.svelte:46).
   - **Evidence:** Phone crops always declare `100vw`, overriding narrower card hints. At 390px/3×, this can select 1200px covers instead of 1000px, adding **8.2 KB across three cards**. Mixed gallery rows use equal-width hints despite layouts such as PARC’s **25% / 75%** logo pair.
   - **Fix:** Pass the actual phone slot size to `<source>`; calculate gallery hints from each image’s aspect share, including gaps.
   - **Visible change:** Some undersized images become sharper; composition is unchanged.
   - **Effort: S · Confidence: high**

8. **Typing timers do not fully pause when their content leaves view.**  
   **Where:** [Decode.svelte:56](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Decode.svelte:56), [Hero.svelte:45](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/home/Hero.svelte:45).
   - **Evidence:** Decode stops for motion-off, but not for `visible=false`. Hero checks visibility between cycles and polls every **300 ms** while off screen. The layout’s one-second clock also runs when its strip is hidden on phones.
   - **Fix:** Suspend and resume typing with IntersectionObserver and document visibility; replace polling with an event-driven wait; stop the clock when hidden.
   - **Visible change:** Off-screen animation pauses at its current position.
   - **Effort: M · Confidence: high**

9. **Contact’s rate-limit check adds latency without its own deadline.**  
   **Where:** [api/contact.js:31](/Users/twocakes/Desktop/PROJECTS/timothyali2/api/contact.js:31).
   - **Evidence:** A new rate-limit window awaits `INCR`, then `EXPIRE`, before sending mail. This client uses the installed Redis SDK’s default five retries and no explicit abort signal. Resend’s eight-second timeout starts afterward.
   - **Fix:** Combine increment/expiry atomically, reuse the client, and bound Redis retries and request duration.
   - **Visible change:** Faster completion or failure during storage trouble; normal behavior stays the same.
   - **Effort: S · Confidence: high**

**Already good**

- **Prerendering:** Public HTML does not wait for authentication, Redis or mail. Analytics is asynchronous.
- **Fonts:** Latin subsets, preloads and metric-adjusted fallbacks are already present. Keep the inline PARC fonts: only **3.6 KB Brotli combined**. Jacquard subsetting was explicitly deferred.
- **Images/video:** All **147 image sources passed the read-only derivative check**. Dimensions, phone crops, lazy images, video posters, smaller encodes and playback visibility controls are already implemented.
- **Canvas foundations:** Keep the 1× backing store, sprite caches, cached knockouts and sleeping off-screen loop. Late knockout painting changes the background, not document layout.
- **Delivery:** Generated assets have one-year immutable caching; media has a weekly cache policy. CSP is only **384 bytes** in the inspected HTML. Actual live compression/cache responses remain unverified.
- **Assets:** OG images and unused files do not automatically become visitor downloads. Keep generator inputs such as `jade-aesthetics.jpg`; deleting them would not improve page loading.

**Visual-change note:** Items 4, 6, 7 and 8 affect transient movement, arrival timing, sharpness or resume behavior. None requires changing the chosen design, copy or motion style.

Browser security rejected live Chrome profiling because permission was declined; Playwright was separately blocked from creating its temporary profile. No current browser performance scores are claimed.