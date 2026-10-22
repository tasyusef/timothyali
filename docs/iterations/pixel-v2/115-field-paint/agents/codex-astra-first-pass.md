**Large gains remain without changing the animation. The “~50 ms/s idle is inherent” claim does not hold up.** Neither repo was edited; no build was run.

**Evidence and limits**

- **Measured here:** source-derived JavaScript benchmarks in memory, Node 26 on an M5 Max, warmed runs.
- **Home model:** 1440×900 and 392×844; mountain image resized with Sharp; text knockouts omitted. These are **kernel measurements, not browser speedups or screenshot-parity proofs**.
- **Saved browser baseline:** desktop dark Home used **52 ms/s idle, 109 moving, 421 with six ripples**. These are existing audit results, not my own browser run. [Runtime results](</private/tmp/claude-501/-Users-twocakes-Desktop-PROJECTS-timothyali2/eefd56a4-67ba-4837-b87b-30d1d2e1d151/scratchpad/perf2/opus/base-desktop-dark.txt>)

The ranking balances gain, effort and visual fidelity. Savings overlap; do not add the percentages.

**1. Compare final rendered cells, not raw brightness**

**What:** [Ascii.svelte:277](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:277), [glyphRow:316](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:316).

- **Cost:** any Float32 brightness change dirties an entire row. In the desktop model, each tick repainted **10,266 cell positions**, although only **60 glyph/color choices changed**.
- **Change:** retain raw field values for lens sampling, but compare a separate final output key: glyph + resolved color; for dither, four pixel colors. Clear/draw only changed cells or contiguous runs.
- **Expected gain:** modelled idle repaint positions fall **99.4% desktop dark**, **99.0% phone dark**, and **98.9% desktop light**. Total CPU savings will be smaller. It also eliminates interaction paints that produce unchanged pixels.
- **Pixel risk: none**, if comparison happens after bending, knockout and color selection. **Effort: M.**

Do not replace `bV` with quantized values: the swell needs its original precision.

**2. Cache static scene layers and planet geometry**

**What:** [scene.ts:100](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/scene.ts:100), [rebuild:246](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:246).

- **Cost:** stars, mountain shading, sphere geometry and lighting are recomputed every tick. Only **4,413 of 20,340** desktop hero cells animated in the model. The stars do **not** twinkle.
- **Change:** classify cells once. Cache mountain/sky results and planet `lon`, `dy`, lighting; update only exposed planet bands and the moving texture below. Preserve doubles for cached geometry.
- **Expected gain — measured scene evaluation:**

| Scenario | Current | Cached static + geometry | Reduction |
|---|---:|---:|---:|
| Desktop dark hero | 0.525 ms/tick | 0.117 | **78%** |
| Desktop light hero | 2.119 | 0.503 | **76%** |
| Phone dark hero | 0.204 | 0.060 | **71%** |
| Desktop below hero | 0.591 | 0.269 | **54%** |

- **Pixel risk: none.** Tested dynamic values/materials matched after Float32 conversion across 120 ticks. **Effort: M.**

On phones, the below-hero texture becomes entirely zero after its existing fade. Those rows can stay cached indefinitely between invalidations.

**3. Cache ring distances; then visit only the active annulus**

**What:** [shapeDist:60](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:60), [ring loop:177](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:177). Same opportunity in the app.

- **Cost:** a burst’s position, rotation, shape and wobble never change, yet `hypot`, `atan2` and `sin` repeat per cell, per frame. Six test rings visited **108,171 positions** at age 1.4 seconds; only **39,642 contributed**.
- **Change:** lazily cache `shapeDist` in Float64 tiles. Then bucket cells by distance and visit only `front ± 3.5 * thickness`. Preserve burst accumulation order and the slope halo.
- **Expected gain — measured six-ring math:** **1.868 → 0.357 ms/frame** with cached distances; **0.203 ms** with an annulus index. That is **81–89%** less ring computation. Phone model: **0.400 → 0.039 ms** with both.
- **Pixel risk: none** with exact distances; tested ring buffers matched at five ages. **Effort: M** for caching; annulus indexing adds work.

Memory matters: six visible desktop distance maps used **1 MB**, 24 used **4.1 MB**, before indices. My eager sorted prototype took **17 ms** to prepare six rings. Ship lazy tiles/buckets, not that eager sort.

**4. Give the app a tick cache and changed-cell painting**

**What:** [app Ascii.svelte:180](</Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app/src/renderer/src/ui/Ascii.svelte:180>).

- **Cost:** every interaction draw measures text, reads styles, clears everything and calls `field()` for every cell. `bent()` also returns a new tuple per cell.
- **Change:** cache unbent field values once per ambient tick; return a source index from `bent()`; paint changed output cells using item 1. Cache styles until theme changes and bounds until layout changes. Port the site’s visibility/resize protections **to the app only**.
- **Expected gain:** at 30 interaction draws/s versus 6.25 ambient ticks/s, field evaluations drop **79%**; at 60 draws/s, **90%**. A normal pointer swell should touch hundreds of cells instead of the whole stage.
- **Pixel risk: none** if the app’s cached values stay **Float64**. Blindly copying the site’s Float32 storage introduces rounding changes. **Effort: M.**

**5. Render light-mode dither at its actual resolution**

**What:** [ditherRow:294](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:294), [canvas sizing:403](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:403).

- **Cost:** each dither sample becomes a solid **4×4 CSS-pixel square**, but the buffer writes all 16 identical pixels.
- **Change:** in dither mode, use a `cols * 2` backing width and two backing rows per cell. Keep CSS dimensions unchanged and scale with `image-rendering: pixelated`. Keep interaction coordinates in CSS cell units.
- **Expected gain:** **16× fewer pixel writes and upload bytes**; the 1440×2920 backing store falls from **16.8 MB to 1.05 MB**. Scene evaluation is unchanged.
- **Pixel risk: none at the existing integer grid**, subject to browser alignment verification. **Effort: M.**

This goes beyond yesterday’s DPR reduction: it exploits the dither’s actual four-pixel squares.

**6. Benchmark packed pixel writes for dense dark-mode painting**

**What:** [glyphRow:316](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:316).

- **Cost:** the saved counting run recorded approximately **474,000 `drawImage` calls/s** during six ripples. [Call counts](</private/tmp/claude-501/-Users-twocakes-Desktop-PROJECTS-timothyali2/eefd56a4-67ba-4837-b87b-30d1d2e1d151/scratchpad/perf2/opus/base-desktop-dark-count.txt>)
- **Change:** prepack each glyph/color into Uint32 pixels; copy changed glyph blocks into reusable row/tile buffers and upload merged dirty rectangles. Retain sprites for very sparse changes if faster.
- **Expected gain:** dense interaction could replace hundreds of thousands of draw calls with roughly **7,000 row uploads/s or fewer**. Actual time savings are **unmeasured**; item 1 may make sparse sprite drawing preferable.
- **Pixel risk: none** with matching resolved colors and transparent pixels. **Effort: M.**

A **2D glyph atlas alone is low priority**: it retains one draw call per glyph and adds source-rectangle arguments.

**7. Cache mode-specific terms and give study layers their own cadence**

**What:** [field:93](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:93), [studyScenes.ts:65](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/studyScenes.ts:65).

- **Cost:** `bands` and `scan` repeatedly evaluate static FBM. `fall` repeats column calculations per cell. Study buildings and most decorative geometry are static.
- **Change:** cache FBM for `bands`/`scan`; compute rain heads once per column. `sparse` changes only every **six ticks**. Cache Pocketwatch buildings, update its clock region each tick, and windows only when their existing per-lot phase changes. Apply equivalent static/dynamic separation to other studies.
- **Expected gain:** a 3,300-cell value-loop benchmark improved **75% for bands, 98% for scan, 94% for fall**. A model Pocketwatch strip evaluated 10,800 cells while averaging only **3.3 changed glyphs/tick**.
- **Pixel risk: none. Effort: M.**

For moving FBM, cache exact lattice corners before trying lower-resolution noise. `hash2` is cheap integer math; a general-purpose `Map` cache may cost more than it saves.

**8. Remove repeated measurement and allocation work**

**What:** [Ascii.svelte:166](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:166), [measurement:255](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:255), [app draw:182](</Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app/src/renderer/src/ui/Ascii.svelte:182>).

- **Cost:** site ring frames read the canvas rectangle in the loop, `stir()` and `draw()`. The app measures/styles every draw. The site clears the full page-sized ring buffer even during hover-only frames.
- **Change:** pass one rectangle through each draw; invalidate measurements on actual layout/text events; clear only previous ring regions. Allocate dither buffers only when needed. Replace app tuples with indices.
- **Expected gain:** **secondary on the site**, more useful in the app. Avoiding unused dither arrays saves about **1.3 MB** for the recorded desktop field. No credible large CPU percentage without profiling.
- **Pixel risk: none**, provided text/layout invalidation remains complete. **Effort: S–M.**

The site already returns an integer from `bent()` and already clips rings to visible rows plus a halo. Those are not new site optimizations. Small `filter()`/rectangle allocations are also unlikely to explain the dominant cost.

**9. Optimize the Gaussian only after the larger fixes**

**What:** [swell:157](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:157), [wave exponential:180](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:180).

- **Cost:** the swell computes an exponential per covered cell.
- **Change:** exploit separability: `exp(-(dx² + dy²)) = exp(-dx²) * exp(-dy²)`, with reusable X/Y arrays.
- **Expected gain:** measured **0.0059 → 0.0029 ms/frame**—only about **0.18 ms/s at 60 Hz** on this machine. Not a significant overall win.
- **Pixel risk: small** from floating-point reassociation, although tested Float32 outputs matched. **Effort: S.**

Approximate exponential/angle lookup tables and lower-resolution interpolated FBM carry threshold-crossing pixel risk. I would not introduce them before exact caching.

**10. A 30 Hz interaction cap saves work but changes feel**

**What:** [site scheduler:444](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:444), [app scheduler:233](</Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app/src/renderer/src/ui/Ascii.svelte:233>).

- **Cost:** the site paints live interactions every display frame. Its `FRAME = 33` comment does **not** enforce 30 Hz. App pointer events can repeatedly bypass its nominal timeout.
- **Change:** throttle actual interaction updates, keeping elapsed-time ring/easing calculations.
- **Expected gain:** roughly **half the interaction work at 60 Hz**, up to **three quarters at 120 Hz**, excluding ambient work.
- **Pixel risk: visible in motion**—slower response and different intermediate lens samples. **Effort: S.**

Do not choose this under the current “same feel” constraint.

**11. OffscreenCanvas is an isolation option, not the first efficiency fix**

**What:** [draw:352](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:352).

- **Cost:** field math and painting occupy the UI thread.
- **Change:** transfer canvas ownership to a worker; send pointer state, dimensions and measured knockout boxes. Keep the simulation and buffers in the worker.
- **Expected gain:** potentially much better UI responsiveness; **no inherent reduction in total computation or energy**. OffscreenCanvas supports this separation. [Chromium architecture](https://developer.chrome.com/docs/chromium/renderingng-architecture)
- **Pixel risk: small**, chiefly synchronization and interaction latency. **Effort: L.**

**Top three:** **1) final-output dirty cells, 2) static scene/geometry caching, 3) ring-distance caching.** For Toolbox, item 4 is the immediate foundation.

**WebGL verdict:** I would implement the incremental fixes first. A full shader rewrite of [scene evaluation](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/scene.ts:149) and [glyph painting](/Users/twocakes/Desktop/PROJECTS/timothyali2/src/lib/components/Ascii.svelte:316) is **L effort**, with **small-to-visible pixel risk** at noise, material and glyph thresholds; its gain remains unmeasured. If drawing still dominates afterward, the strongest GPU option is a **hybrid**: retain exact CPU field/output decisions, upload integer glyph/material IDs, and render bitmap glyphs with nearest sampling. If moving all math to WebGL, evaluate at **cell resolution**, then expand glyphs—evaluating the scene separately for every screen pixel would multiply unnecessary work. Preserve the current motion-off and no-JS fallback throughout.

Automatic approval review rejected raw CDP profiling because browser permission was denied. No fresh browser timings or rendered pixel-parity results are claimed here.