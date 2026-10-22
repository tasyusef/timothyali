# ASCII field performance audit

**Measured site savings: 29–82% less main-thread task time. Toolbox: 52–77% less in the Electron field harness. Originals remain untouched.**

## Measured before → after

All entries are **measured main-thread task ms per second**, median of **three 3-second runs**. Lower is better. Phone = **390×844, 4× CPU throttle**; desktop = **1440×900**. Site is the full Home page; Toolbox uses its actual field and styles in Electron. This measures main-thread occupancy, not total CPU, GPU time or battery life.

| Home scenario | Desktop dark | Desktop light | Phone dark, 4× | Phone light, 4× |
|---|---:|---:|---:|---:|
| Idle, top | 41.8 → **15.6** | 45.2 → **23.3** | 64.8 → **30.0** | 65.8 → **44.3** |
| Idle, bottom | 49.5 → **14.5** | 46.6 → **21.9** | 20.1 → **13.9** | 36.4 → **16.0** |
| Pointer moving | 101.5 → **37.9** | 73.2 → **45.9** | 267.9 → **94.1** | 149.9 → **105.7** |
| One ripple | 252.3 → **49.6** | 131.7 → **64.6** | 312.6 → **91.2** | 182.4 → **107.1** |
| Six ripples | 518.8 → **94.1** | 235.1 → **114.4** | 549.8 → **155.2** | 296.2 → **169.5** |

**Toolbox, Electron 33.4.11 / Chromium 130:** a 1440×900 Palette-style field (`noise`, shade, density 0.8), with the real app CSS, fonts, motion state and component. The normal app view exposed no canvas; the isolated clone’s diagnostic entry avoids project/library data. Both variants use the same harness build.

| Electron field scenario | Dark | Light |
|---|---:|---:|
| Idle | 16.1 → **5.5** | 16.7 → **6.0** |
| Pointer moving | 160.0 → **36.5** | 160.3 → **40.1** |
| One ripple | 68.0 → **18.5** | 67.4 → **31.6** |
| Six ripples | 78.0 → **32.6** | 78.1 → **37.5** |

Runtime data: [site summary](summary.json), [site raw before](before.json), [site raw after](after.json), [Electron summary](app-summary.json). Raw repeats and ranges are retained. Benchmarks ran sequentially; other investigators may have shared the machine.

## Parity and trade-offs

- **Controlled canvas parity: 252/252 exact comparisons** — 36 site and 216 app snapshots. Includes desktop/phone sizes, dark/light colors, static frames, ambient ticks, pointer, one/six seeded ripples, settling, scrolling, and live theme changes. Zero differing RGBA pixels. [Site](lab-site-parity.json), [app](lab-app-parity.json).
- **Full-page parity:** **112/112 exact comparisons** on Home, with CSS animation timelines frozen in both pages and field timers/ripple RNG driven identically. The initial unfrozen run had at most 64 differing pixels; instrumentation traced them to the existing 2 px scroll-hint animation moving a knockout box, with identical scene values. Normal performance runs kept CSS animation enabled. [Final comparisons](parity.json), [diagnostic](parity-debug.json), [arrow source](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/home/Hero.svelte:112).
- **Fallbacks:** no-JS retained identical CSS fallback and content; OS reduced-motion produced a still canvas. Motion-off full-page comparisons passed. [Evidence](fallback.json).
- **Validation:** both normal production builds and both Svelte checks pass, with zero check errors/warnings. Scheduling and elapsed-time formulas are unchanged; no frame cap or grid tween was introduced.
- **Memory increases.** The row buffers and scene caches are the principal trade-off. The following are **measured medians after forced GC**, top of Home, in decimal MB; they are V8 heap/backing-storage counters, **not total renderer/GPU memory**.

| Site configuration | JS heap before → after | Backing storage before → after |
|---|---:|---:|
| Desktop dark | 3.89 → 5.57 | 2.71 → 7.92 |
| Desktop light | 3.64 → 9.41 | 2.97 → 9.16 |
| Phone dark | 3.50 → 4.04 | 0.99 → 2.29 |
| Phone light | 3.43 → 5.18 | 1.15 → 2.75 |

**Production follow-up:** bound retained row images to the visible range plus bend margin, with full redraw on cache re-entry; replace the sampler’s per-cell objects/closures with typed tables. These memory reductions are **estimates, not measured changes**. The patch currently retains visited rows until invalidation/unmount. Consider building glyph bytes directly from `GLYPHS` and packed colors, instead of retaining both sprite canvases and copied pixels.

**No startup-speed claim.** Cold-load long-task samples varied heavily: the baseline desktop-dark runs accumulated **0, 602 and 855 ms** of long tasks in the first measured window. Logs are included in [startup/memory data](memory-startup.json) and [final prototype data](memory-startup-final.json). Validate cold loading before treating this experimental patch as production-ready.

## What the profiles say

**The recorded “~50 ms/s is inherent” conclusion is wrong.** A changed floating-point brightness value does not necessarily change a glyph or a Bayer pixel. The existing dirty-row check detects the former. Also, Home’s stars and image mountains do not animate; only the giant’s bands and the texture below it use time.

The baseline desktop CPU profiles are **measured**, 5 seconds each:

- Dark, six ripples: `drawImage` **390 ms** sampled self time; `shapeDist` **102 ms**; `stir` **67 ms** excluding sampled children. Browser `(program)` accounts for another **948 ms**, which I do not attribute to a specific renderer operation.
- Light, six ripples: `ditherRow` **286 ms** self time, `shapeDist` **115 ms**, `putImageData` **27 ms**. Optimizing upload size alone misses most of this work.
- Light idle: `sceneCell` **46 ms** self time and `rebuild` **53 ms** self time. These are separate sampled buckets, not inclusive totals.

## Ranked changes

### 1. Cache the final displayed cell; buffer changed glyph pixels

- **What:** site `src/lib/components/Ascii.svelte:269`, `:294`, `:316`, `:340`.
- **Why it costs:** the existing row flag changes whenever raw values differ. In the **measured** controlled idle sequence, the original issues **104,415 glyph draws**; comparing resolved sprite identities reduces this to **1,188**, with identical pixels. Six ripples: **2,175,351 → 110,570** draws before replacing those draws with row uploads.
- **Change:** retain the selected sprite per cell *after* bending, knockout, density and ripple inversion. Skip identical output. The final prototype caches each sprite’s exact RGBA bytes, updates persistent row ImageData only for changed cells, and uploads one changed horizontal span. In light mode, cache the four final packed colors and write only changed blocks. Keep the existing source-value buffers: quantizing them before bending would change the image.
- **Gain:** **measured** isolated dark idle loop **157 → 81 ms** from output comparison alone; dark six-ripple loop **3,262 → 837 ms**. Adding glyph pixel buffering to the combined cache prototype changes six-ripple loop **643 → 543 ms**. Light persistent rows reduce the combined loop **776 → 646 ms**. These are equal-work component experiments; the full-page table is the runtime result.
- **Pixel risk:** **none in tested cases**, exact RGBA equality. Preserve palette, resize and mode invalidation. Persistent rows trade memory for speed; see memory results below.
- **Effort:** **M**. Implemented in `proto.diff`.

```ts
// Resolve these after all visual math, not from raw scene brightness.
if (displayed[i] === sprite) continue;
displayed[i] = sprite;
writeExactSpritePixels(rowPixels, x, sprite);
// One putImageData for the changed span after the row is finished.
```

### 2. Cache static scene results and invariant planet geometry

- **What:** site `src/lib/scene.ts:87`, `:100`; `src/lib/components/Ascii.svelte:89`, `:246`.
- **Why it costs:** light mode evaluates four scene samples per glyph cell. Mountains repeat alpha lookup, brightness conversion and exponentiation; stars repeat hashes; the planet repeats sphere lighting and longitude. The portrait texture still calls `fbm` where its final multiplier is zero.
- **Change:** create one sampler per dimensions/seed/shot/mountain-layout tuple. Cache static results; keep `lon`, `dy` and lighting for animated planet cells. Re-evaluate the original noise and band formulas at the original tick. Return exact zero for the known empty part of the below-hero texture. Prepare the sampler once per rebuild, outside the cell loop.
- **Gain:** **measured** isolated rebuild time: dark idle **58 → 28 ms**, light idle **160 → 39 ms**, light six ripples **167 → 46 ms**. Benefits both themes, idle Home, scrolling and phone’s empty lower page. The prototype conservatively keeps the original procedural-mountain path until the image arrives. Study scenes use the original evaluator.
- **Pixel risk:** **none in tested cases**. No lower-resolution noise, frozen bands, approximate trigonometry or changed star animation. Cache original double-precision results; do not silently substitute Float32 geometry.
- **Effort:** **M**. Implemented in `proto.diff`.

### 3. Give Toolbox field and output caches

- **What:** app `src/renderer/src/ui/Ascii.svelte:73`, `:180`, `:185`, `:188`.
- **Why it costs:** every interaction redraw recalculates the scalar field for every bent destination, resolves host styles, clears the full canvas, and draws every nonempty glyph again.
- **Change:** memoize field values by source cell and ambient tick, invalidate on mode/seed/dimensions, cache final sprite identities, and clear/redraw only changed cells. Resolve colors on theme/resize instead of every draw. This preserves the app’s existing timeout/wake behavior and field-accent override. Its existing text measurements remain intact in the prototype.
- **Gain:** **measured Electron results above**; separate exact component comparisons cover all six texture modes and theme switches. The Electron table is a field harness using the app’s own compiler, CSS, fonts and runtime, not the entire application shell. This is a smaller change than transplanting the site’s scene renderer and row machinery.
- **Pixel risk:** **none in tested modes/themes**. Additional CSS color changes must trigger color refresh. The patch retains motion-off behavior.
- **Effort:** **M**. Implemented in `proto-app.diff`.

### 4. Snapshot Svelte props once per row; retain the zero-knockout fast path

- **What:** site `Ascii.svelte:294`, `:316`.
- **Why it costs:** compiled Svelte prop reads are accessor calls. The dither loop reads density four times per cell; the glyph loop repeatedly reads mode and shade. A fully knocked-out cell need not perform bend and Bayer calculations.
- **Change:** capture density/mode/shade before the row loop. For zero knockout, clear only if its cached output was nonzero, then continue.
- **Gain:** **measured** final loop revision versus the preceding cached-pixel prototype: desktop light pointer **84 → 46 ms/s**; dark six ripples **124 → 94 ms/s**. Both revisions already had the same caches. These are separate median-of-three runtime runs, not an isolated attribution to either individual line.
- **Pixel risk:** **none in controlled comparisons**: props cannot change mid synchronous row; zero-knockout cells remain transparent.
- **Effort:** **S**. Included in `proto.diff`.

### 5. Memoize each ripple’s exact shape distance

- **What:** site `Ascii.svelte:60`, `:169`; app `Ascii.svelte:50`, `:123`.
- **Why it costs:** for one burst, its center, angle, stretch and wobble are fixed. `atan2`, `sin` and `hypot` produce the same distance for a cell on every frame; only front radius and fade change.
- **Change:** lazily allocate Float64 rows per burst, with NaN meaning uncomputed. Cache `shapeDist` exactly; keep the original off/front/exp calculation and float accumulation order. Discard with the burst and invalidate on resize. The site already culls ripple rows to the viewport plus bend margin; this is an additional optimization.
- **Gain:** **measured**, isolated six-ripple `stir`: dark **194 → 101 ms** and light **190 → 101 ms**. Combined with drawing fixes, geometry becomes a larger fraction of the remaining work. A cold ring still pays for its first visit to each cell.
- **Pixel risk:** **none in tested seeded interactions**. Float32 distance caches or interpolated lookup tables would introduce threshold risks. **Estimated numeric storage:** six bursts touching 125 rows × 180 columns require about **1.08 MB**, excluding Map overhead; scrolling can retain more rows until expiry.
- **Effort:** **M**. Included in both patches.

### 6. Extend exact caching selectively to texture and study layers

- **What:** site `Ascii.svelte:94`, `:96`, `:97`; `src/lib/studyScenes.ts:65`, `:185`, `:208`; app equivalent `field` branches.
- **Why it costs:** bands’ `fbm(x/7,y/16)` and scan’s base noise do not depend on time; rain speed/offset are column constants. Studies mix static silhouettes with small moving regions, but evaluate their decision trees for every cell each tick.
- **Change:** cache those invariant values; give each study an explicit animated-region mask and time cadence. Cache only branches proven static: a moving cloud or hand can reveal a previously covered layer. A fully static cached row can also skip source-cell iteration until layout or knockout changes.
- **Gain:** **estimate, not prototyped**. Helps texture strips and Toolbox modes; does not account for any Home gain in the table. Re-profile each study before choosing it: this audit did not run a study-page timing matrix.
- **Pixel risk:** **none if exact branch/layer dependencies are preserved**; otherwise visible stale cells.
- **Effort:** **M per scene family**. Lower priority than the measured fixes.

### 7. Reduce repeated geometry reads; leave small allocations until last

- **What:** site `Ascii.svelte:108`, `:166`, `:356`, `:455`; app `Ascii.svelte:81`, `:185`, `:237`.
- **Why it costs:** the site reads canvas bounds in the loop, draw and ring path. **Measured** desktop pointer profile: `getBoundingClientRect` **21 ms over 5 seconds**; six ripples **18 ms**. Layout duration in the runtime matrix is small. Garbage collection is **26 ms over 5 seconds** in the dark six-ripple profile.
- **Change:** pass one canvas rect/visible range through a paint; refresh on scroll/resize and when converting pointer coordinates. In the app, invalidate text measurements from layout/text changes before reducing their frequency. Reuse boxes/small arrays only after these larger fixes.
- **Gain:** **estimate:** low single-digit ms/s for bounds reads in the measured desktop scenarios. GC cleanup has a small measured ceiling; the site’s `bent()` already returns an index, not a tuple. The app still returns a tuple, but allocation elimination needs profiling rather than assumption.
- **Pixel risk:** **none with correct invalidation**; stale cached geometry is visibly wrong on scroll.
- **Effort:** **S** for sharing a rect; **M** for reliable text-measure invalidation.

## Options I would not ship for this brief

- **33 ms interaction cap** (`Ascii.svelte:451`): **estimated** roughly half the interaction-only frame work on a 60 Hz display, with ambient work unchanged. **Visible temporal risk**: fewer intermediate stepped glyph states and less responsive pointer tracking. The site currently uses rAF; `FRAME = 33` does not cap it. Keep its cadence for parity. **S**.
- **Lower-resolution noise / exp or angle LUTs** (`prng.ts:30`, `Ascii.svelte:60`): **unmeasured gain**. Small numeric errors can flip a whole glyph, material, or Bayer block. **Small-to-visible pixel risk; M**. Exact distance and geometry reuse already remove much of the redundant math.
- **Canvas2D glyph atlas alone** (`Ascii.svelte:210`, `:316`): **estimated smaller CPU benefit** than eliminating the per-cell `drawImage` calls; any GPU batching/source-switch benefit remains unmeasured. No standalone atlas benchmark was run. The measured output cache removes most of those calls; row pixels remove the remainder. **None pixel risk if integer-aligned; M**.
- **OffscreenCanvas/worker** (`Ascii.svelte:246`, `:352`): **unmeasured total-CPU gain**. It can move computation off the main thread, but still computes and paints the field and adds synchronization for pointer state, colors, image data and knockout boxes. Consider only if remaining main-thread latency warrants it. **Possible input-latency change; L**.

## Top three

1. **Ship final-output comparison first**, then the measured row-pixel renderer with an explicit memory budget.
2. **Cache static scene results and planet geometry**, preparing the sampler outside the per-cell loop.
3. **Port field/output caching to Toolbox.** The exact ripple-distance cache is small enough to accompany either application’s work.

## WebGL verdict

**A whole-field WebGL rewrite is not justified by this audit.** The measured incremental fixes preserve the existing math and cadence, and remove the dominant redundant work. A shader would still need faithful bitmap placement, palette and Bayer logic, knockout updates, image-mountain sampling and CPU-equivalent procedural noise; GPU floating-point/trigonometric differences can change thresholded pixels. A rendering-only WebGL2 path using integer textures is a more plausible future experiment, but it would not remove scene evaluation. I did not prototype WebGL and make no measured GPU-performance claim. Revisit it only if the remaining measured interaction cost is unacceptable after these changes, particularly at high refresh rates or the maximum ripple count.

## Reproduce / artifacts

- [Site patch](proto.diff), [app patch](proto-app.diff): optimization changes only. No diagnostic entry is included in the app patch.
- [Methodology](methodology.md), [runtime harness](bench.mjs), [Electron harness setup](setup-electron-harness.py), [Electron benchmark](electron-bench.mjs).
- [Controlled harness setup](setup-lab.py), [controlled checks](lab-check.mjs), [full-page checks](parity.mjs), [self control](parity-self-final.mjs).
- [Ablations](ablations.json), [ablation setup](setup-ablations.py), [loop benchmark](lab-bench.mjs), [summary script](summarize-ablations.mjs). The diagnostic loop forces equal work; its timings include instrumentation, are **not** main-thread ms/s, and phases nest.
- Original CPU profiles: `profile-before-*.cpuprofile`; [profile summary script](profile-summary.mjs). `original-field-bundle.js` records the minified-function mapping.
- `after-v1.json` and `after-v2.json` retain rejected/intermediate results. V1 regressed light-mode pointer work; final row-level preparation, persistent pixels and loop hoisting fixed it. Do not use intermediate files as final results.

No study-page timing matrix, 24-ring stress run, physical-phone power test, GPU-time measurement, worker implementation or WebGL prototype was performed. Claims above are limited accordingly.
