# ASCII field performance audit — measured prototypes

**Incremental fixes cut dark Home interaction work substantially, preserve pixels, and make the old “~50 ms/s is inherent” claim untenable.**

## Measured before / after

**Unit: main-thread task milliseconds per real second, lower is better.** Live CDP `Performance.TaskDuration`; median of three independent two-second windows after each reload/settle. These are whole-renderer task durations, not battery measurements or GPU time. The prototype keeps the existing tick cadence and interaction rAF cadence. “one” and “six” are simultaneous seeded drops measured over their first two seconds.

| Viewport / CPU | Theme | Scenario | Before | Prototype | Less work |
|---|---|---|---:|---:|---:|
| 1440×900 / 1× | dark | idle-top | 39.4 | 14.9 | 62% |
| 1440×900 / 1× | dark | idle-bottom | 47.5 | 14.6 | 69% |
| 1440×900 / 1× | dark | pointer | 97.5 | 44.2 | 55% |
| 1440×900 / 1× | dark | one | 200.5 | 59.4 | 70% |
| 1440×900 / 1× | dark | six | 448.5 | 112.9 | 75% |
| 1440×900 / 1× | light | idle-top | 48.6 | 22.0 | 55% |
| 1440×900 / 1× | light | idle-bottom | 43.8 | 24.7 | 44% |
| 1440×900 / 1× | light | pointer | 71.1 | 47.6 | 33% |
| 1440×900 / 1× | light | one | 127.3 | 78.5 | 38% |
| 1440×900 / 1× | light | six | 219.4 | 139.5 | 36% |
| 390×844 / 4× | dark | idle-top | 62.9 | 28.2 | 55% |
| 390×844 / 4× | dark | idle-bottom | 20.0 | 11.0 | 45% |
| 390×844 / 4× | dark | pointer | 295.9 | 109.6 | 63% |
| 390×844 / 4× | dark | one | 303.6 | 112.0 | 63% |
| 390×844 / 4× | dark | six | 470.6 | 173.9 | 63% |
| 390×844 / 4× | light | idle-top | 66.8 | 43.0 | 36% |
| 390×844 / 4× | light | idle-bottom | 34.4 | 11.6 | 66% |
| 390×844 / 4× | light | pointer | 150.3 | 114.6 | 24% |
| 390×844 / 4× | light | one | 158.8 | 123.0 | 23% |
| 390×844 / 4× | light | six | 250.1 | 183.3 | 27% |


**Measured app, real Electron 33.4.11, viewport 1440×900, 1× CPU:** Lockup's field is 1216×768; Palette's is 816×768 because its controls occupy the right panel. Existing ~33 ms scheduling is retained.

| Tool | Theme | Scenario | Before | Prototype | Less work |
|---|---|---|---:|---:|---:|
| Lockup | dark | idle | 12.3 | 9.4 | 24% |
| Lockup | dark | pointer | 58.0 | 23.4 | 60% |
| Lockup | dark | one | 52.8 | 27.6 | 48% |
| Lockup | dark | six | 65.2 | 39.9 | 39% |
| Palette | dark | idle | 18.7 | 6.0 | 68% |
| Palette | dark | pointer | 81.4 | 20.3 | 75% |
| Palette | dark | one | 65.6 | 23.4 | 64% |
| Palette | dark | six | 55.3 | 37.7 | 32% |
| Lockup | light | idle | 17.4 | 12.0 | 31% |
| Lockup | light | pointer | 93.8 | 41.5 | 56% |
| Lockup | light | one | 87.0 | 27.8 | 68% |
| Lockup | light | six | 102.8 | 51.0 | 50% |
| Palette | light | idle | 18.9 | 7.7 | 60% |
| Palette | light | pointer | 71.4 | 21.0 | 71% |
| Palette | light | one | 70.0 | 27.3 | 61% |
| Palette | light | six | 55.0 | 40.3 † | 27% |


† This cell uses **median of nine**. Its first triplicate was unusually slow (64.9–95.2 ms/s); two further triplicates were 37.4–43.1 ms/s. All samples remain in `app-prototype.json`; no unfavorable samples were deleted. Other cells use median of three.

**Scope:** live original site at :4173; isolated local clones only. Site source HEAD `01cfcb8217a59f9de6140fb7e85fff36298d74a0`. Prototype at :4186 (:4184 was occupied and left alone). Original source trees were never edited or built. Original app HEAD is recorded in `originals-integrity.json`. No pushes.

## Ranked changes

### 1. Compare final cell output; stop repainting unchanged glyphs

- **What:** site `src/lib/components/Ascii.svelte:246,316,340`; app `src/renderer/src/ui/Ascii.svelte:180`.
- **Why it costs — measured:** a changed float marks an entire row dirty. In 120 controlled frames, dark Home idle-top made **55,030 glyph draws**; the output-aware renderer made **679**. Bottom: **84,261 → 2,444**. Six drops: **992,999 → 77,068**. The original two-second six-drop CPU profile sampled 197 ms directly in `drawImage`.
- **The change:** retain the last actual sprite per destination cell. Compare **after** density, knockout, bend, ramp quantization and material selection. Clear/draw only changed cells. Reset this cache when the canvas is cleared or the rendering mode/theme changes; empty cells must also be invalidated on dither→glyph transitions.

`if (lastSprite[i] !== sprite) { clearCell(i); drawSprite(i, sprite); lastSprite[i] = sprite; }`

- **Expected gain — measured:** in the controlled ablation, dark desktop pointer work fell **70.7 → 22.7 task ms per simulated second** when changing only the renderer/output test, with the other optimizations held fixed. The full live bundle gives desktop dark six drops **448.5 → 112.9 ms/s (75% less)** and phone dark pointer **295.9 → 109.6 ms/s (63% less)**. These bundle gains are not attributed to this item alone.
- **Drawing choice — measured:** changed sprites beat row buffers on controlled desktop six-drop work (**102.2 vs 134.3**); row buffers beat sprites on the throttled phone (**123.6 vs 147.3**). The prototype keeps both and uses sprites at ≥100 columns, row buffers below that. **That threshold is a prototype heuristic**, not a proven optimum across devices. A single atlas still needs one native draw per glyph; an atlas alone does not solve the observed redundant work.
- **Pixel risk:** **none in the tested scenes**, exact output. The optimization does not intentionally drop animation samples. **Effort: M.**

### 2. Cache each ripple's fixed shape distance, exactly

- **What:** site `Ascii.svelte:60,166–180`; equivalent app `Ascii.svelte:52–58,124–133`.
- **Why it costs — measured:** the original six-drop profile spent **72 ms of two seconds** in `shapeDist`, plus 41 ms in `stir` itself. Over 120 fixed frames, `hypot` calls fell **4,338,064 → 58,320**; `atan2` calls fell **2,970,293 → 92,904**. These counters include the remaining scene/knockout calls.
- **The change:** the click's centre, rotation, stretch, wobble and phase do not change. Lazily memoize `shapeDist(b,x+.5-b.x,y+.5-b.y)` in **Float64Array rows per burst**, then vary only front/width/fade each frame. Keep existing viewport culling; allocate new rows as they become needed, clear on a column-count change, and release with the burst.
- **Expected gain — measured, controlled ablation:** desktop dark six drops **178.7 → 134.3 (25%)**; desktop light **218.0 → 166.6 (24%)**; phone dark **158.5 → 123.6 (22%)**. These figures use the row-buffer renderer on both sides and are CPU per simulated second, not the live table's wall-clock duty.
- **Memory — derived estimate:** 178 columns × about 126 visible/halo rows × 8 bytes ≈ **175 KiB per drop**, about **1.0 MiB for six**, excluding Map/array overhead. A long scroll can accumulate more rows during a burst's life. Bound or evict distant rows if that becomes an issue.
- **Pixel risk:** **none** with Float64; a Float32 distance cache or a trigonometric LUT would change rounding. **Effort: M.** Site prototype includes this; the app prototype does not yet, so its measured app gains leave this opportunity available.

### 3. Cache the app's base field per tick, then diff its final glyphs

- **What:** app `src/renderer/src/ui/Ascii.svelte:141,180–198`.
- **Why it costs — measured/code:** the app recalculates `field` at every bent destination and repaints the whole canvas while live. A 1216×768 field contains **3,648 cells** (derived); at a nominal 30 fps that is about **109,440 field evaluations and tuple returns per second** before culling by glyph density. Palette pointer work measured **81.4 ms/s dark, 71.4 light**.
- **The change:** cache exact Cell objects at unbent coordinates by `cols,rows,frame,mode,seed,flip`; have `bent` return an index; read the cached source. Keep unrounded numbers, because the old app did not pass these through Float32. Diff final sprites as in #1. Resolve colors/build sprites on theme/resize/style changes; measure knockout geometry per tick or explicit invalidation, rather than every live frame. Keep `--field-accent` support and the current scheduler.
- **Expected gain — measured, bundled app prototype:** Palette pointer **81.4 → 20.3 ms/s (75%) dark**, **71.4 → 21.0 (71%) light**. Lockup dark pointer **58.0 → 23.4 (60%)**. The table includes the weaker six-drop cases; this is not a blanket 75% claim.
- **Pixel risk:** **none across 72 tested captures**, including all four tools, both themes, motion off and seeded six-drop sequences. Color/geometry caching must be invalidated when those inputs change. **Effort: M.** A wholesale copy of the site's scheduler would also change the app's cadence; the prototype does not do that.

### 4. Make scene worklists describe what really animates

- **What:** site `src/lib/scene.ts:87–98,100–166`; `Ascii.svelte:89,246–281`.
- **Why it costs — measured:** in a direct scene scan, **4,266 / 20,114** desktop top-screen values changed between two adjacent ticks (**21.2%**), versus **10,469 / 20,114 (52.0%)** at the sampled lower-page location. On the portrait lower-page sample, **zero values changed**. Stars and image mountains have no time input; only the planet's bands and the below-scene noise animate there.
- **The change:** classify the actual `sceneCell` branch once. Cache static cells; keep per-row lists of animated x positions, and only evaluate those on subsequent ticks. In light mode a cell stays active if **any** of its four samples animate. Rebuild lists when dimensions, shot, seed, dither grid or mountain data changes. Return zero before `fbm` where the left-third mask or portrait cutoff guarantees zero.

`if (u <= 1/3 || (cols/S < .9 && w >= 1.3)) return EMPTY_TEXTURE;`

- **Expected gain — measured:** controlled light desktop idle-top **35.3 → 19.4 ms per simulated second (45%)** with drawing/rings held fixed. Portrait light idle-bottom **18.5 → 3.1 (83%)**. Live bundle idle dark top is **39.4 → 14.9 ms/s (62% less)**; bottom is **47.5 → 14.6 ms/s (69% less)**. The old ~50 ms/s assumption is therefore **not inherent**.
- **Skeptical result — measured:** simply wrapping every call in a memoizer is insufficient: the direct desktop light lower-page microbenchmark became **1.830 → 1.960 ms/tick (7% slower)**. Skipping static indices, rather than repeatedly looking them up, matters. The sampler microbench and live worklist timings measure different scopes.
- **Pixel risk:** **none** for the explicit branch classification. Do **not** infer “static” because `t=0` and `t=1` match: city windows change on a 37-tick schedule, ledger positions on 60, and lightning on 64. Study masks/worklists need their own annotations; this prototype only caches the main scene. **Effort: M.**

### 5. In light mode, diff final colored squares and defer redundant pixel stores

- **What:** site `Ascii.svelte:294–314`.
- **Why it costs — measured:** even the shipped per-row ImageData path writes every square in a numeric-dirty row. Over 120 fixed frames, idle-top's declared dirty `putImageData` area fell **8,065,536 → 648,256 pixels**. Bottom fell **14,217,216 → 767,360**. These are dirty-rectangle areas, not a measured GPU transfer-byte count.
- **The change:** retain the four final Uint32 colors per cell; compare colors after Bayer/inversion. Find the changed span first, then expand just that span into the row image and put it. Skip the color math for exact transparent cases: zero knockout, or no heat/positive crest and four zero source values. Do not reintroduce per-square fills.
- **Expected gain — measured:** the final light refinement improves desktop six drops **167.9 → 139.5 ms/s**, on top of the earlier fixes. Against the original, desktop light six is **219.4 → 139.5 ms/s (36% less)**; phone light pointer is **150.3 → 114.6 ms/s (24% less)**. Savings are smaller for active light scenes than dark glyph scenes because Bayer/bend/ripple work still runs.
- **Pixel risk:** **none** with comparisons of final packed colors and correct invalidation on canvas/theme changes. **Effort: M.** The existing per-row ImageData implementation is retained, not proposed as a new fix.

### 6. Offer a real 30 fps interaction gate only if the owner accepts the feel

- **What:** site `Ascii.svelte:452–460`. `FRAME=33` is currently an age/time unit; it does **not** cap the site's rAF loop.
- **The change:** keep rAF scheduling but skip live paints until about 33 ms have elapsed; continue using elapsed time for waves/swell. The prototype's opt-in `fps30` flag does this; it is **off by default**.
- **Expected gain — measured:** same optimized prototype, dark mode, live metrics below. Ambient tick work still has to happen.

| Scenario | Same prototype, rAF | 30 fps gate | Reduction |
|---|---:|---:|---:|
| 1440, dark, pointer | 44.2 | 42.8 | 3% |
| 1440, dark, six | 112.9 | 66.9 | 41% |
| 390, dark, pointer | 109.6 | 78.2 | 29% |
| 390, dark, six | 173.9 | 108.1 | 38% |

- **Pixel risk:** **visible in time**: fewer animation samples, up to roughly one extra display frame of response delay on a 60 Hz display (derived). The grid remains stepped; that does not make 30 and 60 fps feel identical. I would ship the zero-change fixes first. **Effort: S.**

### 7. Cache remaining static planet geometry and texture coefficients

- **What:** `scene.ts:138–150`; `Ascii.svelte:94–98`; `studyScenes.ts` sphere/static-shape branches; equivalent app `field`.
- **Why it costs — measured/code:** idle light top still executes **210,864 planet `atan2` calls in 120 frames**. Dynamic bands repeatedly recover the same `dx,dy,nz,lon,lam`. Bands mode's `fbm(x/7,y/16)`, scan's base noise and fall's per-column speed/offset are static even though their outputs move.
- **The change:** precompute geometry in Float64 and static noise coefficients; evaluate only the drifting part. Cache fall's head once per column/tick. For study strips, cache explicit static masks/lighting and retain the current time-dependent branches and foot fade.
- **Expected gain:** **unmeasured estimate**, smaller than #1–4 after these prototypes. It can eliminate the counted repeated geometry calls; page-level CPU savings are not established. Lower-resolution noise, interpolation and dropping octaves are different changes: they alter the field and material thresholds. Reducing three octaves to two can change the normalized noise by up to **1/7** (analytic bound), enough to move planet bands.
- **Pixel risk:** **none in principle** for Float64 reuse with identical arithmetic; needs parity tests. **Visible** for noise approximation; differing-pixel percentage is unmeasured. **Effort: M.**

### 8. Hoist repeated reads; treat layout/GC as secondary work

- **What:** site `Ascii.svelte:108,144,316,352,452`; app `Ascii.svelte:141,185`.
- **Why it costs — measured:** the original six-drop profile sampled **9 ms / 2 s** in `getBoundingClientRect`, **14 ms / 2 s** in GC, and about **14 ms / 2 s** in the Svelte prop accessor helper. Compare those with **197 ms / 2 s** directly in `drawImage`. Multiple rect reads are redundant; they are not proof of forced layout.
- **The change:** obtain one rect/visible-row range per paint and pass it to `stir`/drawing; cache the document offset between scroll/resize events if needed. Hoist mode, density, ramp length, cell size and palette references outside inner loops. Reuse tiny bounds arrays and compact bursts in place if profiling still points there. The app prototype removes its per-cell bend tuples and every-frame style lookup already.
- **Expected gain:** **unmeasured estimate: a few ms/s**, not another 2×. Read caching must still handle scrolling, font/knockout changes and layout movement. The current site already sleeps correctly when hidden/off screen; this audit does not recommend doing that again.
- **Pixel risk:** **none** for local hoisting/reuse; **small** if DOM geometry is cached without proper invalidation. **Effort: S.**

### 9. Keep exp/LUTs and workers behind the measured fixes

- **What:** site `Ascii.svelte:158,180,191`; scene/noise pipeline.
- **Why it costs — measured:** after shape caching, the six-drop count still has **2,829,478 `Math.exp` calls over 120 frames**. That work was not removed by the distance cache. The swell's box and `bent` are bounded already; the site already returns a source index rather than a tuple.
- **The change:** if a later profile justifies it, try a finely sampled wave-profile table, or move the existing JS/Canvas pipeline to an OffscreenCanvas worker. Main-thread DOM/knockout measurement must remain and feed the worker. Workers need visibility/input messages and a fallback; they do not automatically lower total CPU.
- **Expected gain:** **unmeasured**. A worker can move compute/painting off the main thread, but no battery or throughput gain is demonstrated here. A LUT may reduce transcendental work; end-to-end savings are unmeasured, and thresholds/rounded bending make tiny approximation errors capable of changing cells. An atlas alone leaves the counted native call volume intact.
- **Pixel risk:** **small** for LUT approximations, even if most test images match; **small until tested** for a worker using the same Float64 math and rasterizer. **Effort: M for LUT experiments; L for a robust worker port.**

## Top 3

1. **Diff final output, then draw only changed cells/squares.** This attacks the largest sampled drawing cost and disproves the “dirty rows must be repainted” assumption.
2. **Cache ripple distances in Float64.** Exact, independent of the drawing backend, with measured gains in both themes.
3. **Give the app a per-tick base cache and output diff.** Its older whole-field path has a clear measured win; keep its current cadence.

For idle/light battery cost specifically, do **#4 immediately alongside #1**.

## WebGL verdict

**A full WebGL field rewrite is not worth doing first.** The measured incremental bundle already gets desktop dark six drops from **448.5 to 112.9 ms/s**, preserves the field's cadence, and passes the canvas comparisons. The final two-second profiles sampled only **21 ms directly in glyph drawImage** in dark mode and **21 ms in putImageData** in light mode; light ditherRow itself still used **110 ms**. A raster-only shader cannot remove all that cell computation. Light mode still has meaningful compute cost, but moving `fbm`, waves and threshold decisions into float32 shaders creates real pixel-parity risk: JS uses double arithmetic before storing its existing Float32 buffers, and glyph/Bayer/rounded-bend boundaries expose tiny errors. A later WebGL **raster backend fed CPU-quantized cell codes** could avoid that precision problem, while a whole-field shader is a larger behavioral port. Neither has a measured performance result here, so I am not claiming a shader speedup. Revisit it only if an explicit budget such as sustained 24-drop performance remains unmet after the incremental fixes; 24-drop performance itself was not benchmarked in this run.

## Validation and reproducibility

- **Measured pixel comparisons:** **284 site captures, 0 mismatches**; **72 Electron captures, 0 mismatches**. Site coverage includes both sizes/themes, Home top/bottom, pointer swell, six seeded drops over time, motion off, theme flips/back, Toolbox/PARC study strips, Contact/rise, the 404 moon, and the classic Toolbox bands field. App covers all four current tool fields, both themes and motion settings. These are exact RGBA comparisons, not visual judgments.
- The initial uncontrolled comparison also found tiny differences between **two runs of the original**. The moving CSS hint arrow changes knockout bounds independently of the mocked JS clock. The final harness fixes that geometry and uses identical sampled mountain input pixels. No field output pixels are masked out of the comparison. Motion-off initial real-source comparisons also matched in the earlier run.
- Direct scene numeric checks: **250,060 cells checked, 0 differences** across desktop/portrait and both sample-grid sizes, top/lower page.
- Both clone builds and both Svelte checks passed with **0 errors and 0 warnings**; diff whitespace checks passed.
- No-JS fallback/navigation checks: see `nojs.json`. Both source components' fallback markup/CSS are retained. Builds were run only in clones.
- `baseline.json`, `prototype.json`, `app-baseline.json`, `app-prototype.json`: all live triplicates. `prototype-stage2.json` preserves the version before the final light-only refinement; dark rendering code was unchanged in that refinement.
- `ablation-buffer-default.json`: 60 controlled conditions, three repeats each; CPU per simulated second. These tests fix 120 animation frames and isolate algorithmic work; they are **not interchangeable** with the live timing table. They preceded the final dither-store refinement.
- `counts.json`: instrumented operation counts, not timing measurements. `micro.json`: median-of-three standalone sampler timings. Raw `.cpuprofile` files preserve sampled stacks. All gains are scenario-specific and not additive.
- Final diffs: [site prototype](proto.diff), [app prototype](proto-app.diff). Alternative renderers and benchmark flags are retained for inspection; remove the test branches for a production patch. Effort labels are estimates: S = a small focused change, M = several hours including parity testing, L = multi-day integration.
- Commands and script map: [REPRODUCE.md](REPRODUCE.md). Original trees' final status checks and source hashes: `originals-integrity.json`.
