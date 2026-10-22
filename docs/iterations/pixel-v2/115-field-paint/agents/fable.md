# ASCII field performance, round 2 (Fable)

**Bottom line:** the field's cost is almost all *painting*, not maths. One `drawImage` per glyph cell costs 13.6 ms per screen on desktop and 18.7 ms on a throttled phone; writing the same glyphs as 32-bit pixels into one row `ImageData` costs 0.8 / 1.2 ms. The "idle 50 ms/s is inherent" claim is wrong: at the top of Home only **67 of 20,520 cells change their drawn glyph per tick** (0.33%), and the scene maths for the whole screen is 1.2 ms per tick (7 ms/s). The rest is repainting rows whose pixels did not change, through the slow path. A prototype of the top items (built in a scratch worktree, pixel-identical at rest on 11 captures) measured: **idle Home 58 → 27 ms/s, one ripple 322 → 143, six ripples 411 → 165 on desktop; one ripple 431 → 165 on a 4× throttled phone.** Nothing in the top items changes a pixel.

All numbers are main-thread ms per second from CDP `Performance.getMetrics` (task = everything on the main thread, script = JS only), Chrome headless at 60 Hz, 1440×900 desktop and 390×844 phone at 4× CPU throttle, against the current build on :4173 and the prototype on :4182. Ring shape/speed/thickness are random, so ripple scenarios vary ±15% run to run (the unminified control measured 357 vs 322 for the same scenario). Timothy's 16" MacBook is 120 Hz: every "live" number (swell or ring up) is about double there, since the loop paints on every `requestAnimationFrame`.

## Measured: today vs prototype

| Scenario | Desktop dark | Desktop light | Phone dark (4×) | Phone light (4×) |
|---|---|---|---|---|
| Idle, top of Home | 58 → **27** | 50 → 40 | 95 → **53** | 85 → 70 |
| Pointer resting | 79 → **43** | 72 → 54 | | |
| Pointer moving | 109 → **58** | 77 → 82 | | |
| 1 ripple (+3 s) | 322 → **143** | 167 → 141 | 431 → **165** | 236 → 160 |
| 6 ripples (+4 s) | 411 → **165** | 196 → 153 | 509 → **202** | 313 → 230 |
| After ripples die | 52 → 32 | 51 → 45 | 100 → 62 | 100 → 75 |
| Idle at bottom | 57 → 36 | 51 → 34 | 35 → 45 (noise) | 59 → 42 |
| 6 ripples at bottom | 314 → **163** | 150 → 158 | 165 → 200 (noise) | 210 → 161 |

Light mode gains less because its dither already went through `ImageData` (0214); its remaining cost is compute on 82k sub-cells and `ditherRow`'s per-cell work.

The prototype applied items 1, 2, 3, 4, 7, 8, 9 below. Its diff is `proto.diff` in this folder (1,109 lines, mostly moved code). Worktree removed.

## Where the time goes (CPU profile, unminified build, self time)

Today, desktop dark:
- **Idle top (58 ms/s task):** `drawImage` 6.4 + rebuild 2.8 + `sceneCell` 2.4 + `knockout` 2.1 + `field` 1.5 + glyphRow 1.4 (script 23–29); the other ~28 ms/s is the canvas raster/upload of those `drawImage`s outside script.
- **1 ripple (322):** `drawImage` 62 + glyphRow 13 + paintRows 5 + `bent` 4.4 + Svelte prop getters 4.2 + rebuild 3.4 + stir 2.6 (script 130); **~190 ms/s is raster outside script.**
- **6 ripples (411):** `drawImage` 72 + `shapeDist` 23 + glyphRow 15 + stir 12 + `bent` 5.5 + getters 4.9 … (script 189); ~220 raster.

Prototype:
- **Idle top (27):** glyphRow (pixel writes) 4.0 + knockout 2.2 + sceneCell 1.3 + rebuild 1.1 + putImageData 0.4 (script 14).
- **1 ripple (143):** glyphRow 109 + putImageData 11 + bent 7.7 + stir 2.4 + shapeDist 0.8 (script 122). Raster outside script is now ~20 ms/s.
- **6 ripples (165):** glyphRow 81 + shapeDist 8.8 + bent 6.9 + putImageData 6.5 + stir 5.3.

So after the prototype the remaining live cost is one thing: writing every cell in the ring's bounding box every frame, whether or not it changed. That is items 5 and 6.

## Scene facts (Node, `scenebench.mjs`, real mountain image via sharp)

Per 160 ms tick on desktop Home, 180×114 cells on screen:
- top screen: raw `v` changes in 4,309 cells / 58 rows; **drawn glyph+colour changes in 67 cells / 37 rows**. Cells by kind: mountain picture 41%, sky 37%, planet 22%, `below` 1%. Only the planet and `below` depend on `t`: **78% of the cells are static** and are recomputed every tick today.
- bottom screen (`below` texture everywhere): raw changes in 10,711 cells / all 114 rows; drawn changes in **270 cells** / 104 rows. The left third of every `below` row runs `fbm` (3 octaves) to produce 0 (`r = 0`).
- light dither (2× cells, 82,080): drawn bit changes in 122 sub-cells / 69 of 228 rows.
- cost per cell: sky 56 ns, planet 118, mountain picture 32, `below` 213 → **1.24 ms per tick for the screen (7.7 ms/s)**; light 2.3 ms.
- phone top: 27 cells change per tick.
- study strip (xrp.cafe, 180×68, TICK_FAST): 694 cells change per 90 ms tick, 0.83 ms compute.
- primitives: `Math.hypot` 7 ns vs `sqrt(u²+v²)` 1.2; `Math.exp` 2.9; `atan2` 4.9; `Map.get(ch)` 4 vs `array[level]` 1; a 4,096-entry lerp LUT of `off·e^(½−off²/2)` has max error 8.5e-7.

Canvas micro-benchmark (`canvasbench.mjs`, page-tall canvas like Home, one screen of cells, main-thread ms per paint):

| | desktop 8px (20,340 cells) | phone 4× 8px (5,537) | desktop 16px (5,130) | phone 16px (1,425) |
|---|---|---|---|---|
| `clearRect` per row + `drawImage` per cell (today) | **13.60** | **18.71** | 3.46 | 4.12 |
| Uint32 row writes + `putImageData` per row | 0.87 | 1.66 | 1.06 | 1.60 |
| Uint32 writes + one `putImageData` per screen | 0.81 | 1.16 | 1.06 | 1.58 |
| `putImageData` of a prepared screen alone | 0.20 | 0.44 | 0.26 | 0.51 |
| 40×40-cell swell box, drawImage | 1.09 | 4.35 | 1.18 | 1.60 |
| 40×40-cell swell box, Uint32 + one putImageData | 0.18 | 0.59 | 0.44 | 1.50 |

---

## Ranked list

### 1. Draw glyph rows as 32-bit pixels, not `drawImage` per cell
- **What:** `src/lib/components/Ascii.svelte:316-337` (`glyphRow`), `:206-215` (`spriteSet`), `:224-230` (`buildSprites`). Same in the app's `Ascii.svelte:155-164, 180-197`.
- **Why it costs:** 20k `drawImage` calls per screen = 13.6 ms desktop / 18.7 ms phone per paint (bench), ~1 µs per call on the JS side and about three times that again in raster outside script. It is the top self-time entry in every profile (62–72 ms/s script during ripples, plus ~190–220 ms/s raster). The light mode already proves the alternative: it writes its dither through one row `ImageData` (0214) and its ripple costs 167 ms/s where dark costs 322.
- **The change:** build each glyph once per colour as a `Uint32Array(cell×cell)` (colour resolved through the existing `palette32` swatch); `glyphRow` writes those blocks into the shared `rowImg`/`rowPx` that `ditherRow` already uses (blank cells written as 0) and ends with `ctx.putImageData(rowImg, 0, y*s, x0*s, 0, (x1-x0)*s, s)`. Index bitmaps by ramp level (`set.byLevel[level]`) and keep a `Map` only for the fall mode's `'0'`. No `clearRect`. Prototype: `proto.diff`, hunks `bitSet`/`glyphRow`.
- **Expected gain:** every scenario. Measured (with 2–4 below): desktop 1 ripple 322 → 143, 6 ripples 411 → 165; phone 431 → 165 and 509 → 202; swell (pointer moving) 109 → 58; idle 58 → 27. The app's stage: ~3.5 → ~1 ms per full repaint.
- **Pixel risk:** none. All sprite colours are opaque, cells sit on integer pixels at 1× DPR, `putImageData` replaces pixels; parity script found 0 differing pixels on Home dark/light/scrolled/phone, Contact, two studies (both themes), Toolbox (both themes, shade mix colours).
- **Effort:** M (about 60 lines, mostly deleting `spriteSet`).

### 2. Mark a row dirty by what it *draws*, not by its raw value
- **What:** `Ascii.svelte:277-278` (dark compare `v !== bV[i] || …`), `:274` (dither compare `v !== dV[o] || c !== dC[o]`).
- **Why it costs:** the planet's `turb` and the `below` texture drift a little every tick, so `Math.fround(v)` differs in 21% of cells at the top of Home and 52% at the bottom, which marks 58 of 114 rows dirty at the top and all 114 at the bottom. The glyph actually changes in 67 and 270 cells. Today that is 10.4k and 20.5k `drawImage`s per tick for 67 and 270 real changes.
- **The change:** store per cell what it draws at rest: `lv = min(9, floor(v·density·bK[i]·10))` plus colour, hot and the `ch`-shown bit as one `Int16`; for the dither, `on = v·density·bK[i] > bayer` plus colour as one byte. Set `moved` only when that changes (the raw `bV/dV` are still stored, the bend reads them). Rows marked dirty by a knockout change stay as they are.
- **Expected gain:** idle Home and every page at rest; top screen rows per tick 58 → 37, bottom 114 → 104 (the bottom's 270 changes are spread over most rows, so per-row dirtiness saturates; see 5 for the per-cell version). With 1 in place a row costs ~7 µs, so this mostly matters as the enabler for 5.
- **Pixel risk:** none (same formula the painter uses; parity 0 px).
- **Effort:** S.

### 3. Skip cells the scene says never change
- **What:** `src/lib/scene.ts:120-162` (`sceneCell` returns), `Ascii.svelte:261-282` (`rebuild` loop).
- **Why it costs:** 78% of Home's first screen (the mountain picture 41%, stars and empty sky 37%) has no `t` in it, yet is recomputed every tick: ~0.9 of the 1.24 ms per tick, 4× that in light mode (2.3 ms per tick over 82k sub-cells, the biggest single cost of light idle).
- **The change:** `sceneCell` adds `still: true` to its picture, procedural-ridge, moon, haze, star and empty-sky returns (never to planet or `below`); `below()` returns early for `u <= 1/3` (its `r` is 0 there, same output); `rebuild` keeps a `Uint8Array still` (and `stillD` per dither sub-cell), skips those cells, and clears the flags whenever `baseDirty` resets the rows (resize, theme, mountain layout). Study scenes stay as they are (their empty cells can be covered later by a moving shape, so they cannot be flagged safely).
- **Expected gain:** idle Home dark ~4 ms/s, light ~10 ms/s; part of the measured 58 → 27 / 50 → 40.
- **Pixel risk:** none (the flagged branches have no `t` term; parity 0 px).
- **Effort:** S.

### 4. Walk each ring as an annulus, and drop `hypot`/`exp`
- **What:** `Ascii.svelte:168-182` (`stir`'s burst loop), `:60-65` (`shapeDist`).
- **Why it costs:** each burst loops its whole bounding box (`R = (front + 3.5s)·span`, up to the visible screen) and calls `shapeDist` on every cell; the wave only lives in a band of width 7·s around `front`. With 6 rings that was `shapeDist` 23 + `stir` 12 = 35 ms/s.
- **The change:** per burst keep `lo`/`hi`, the bounds of its shape distance against Euclidean distance (circle 1/1; diamond 1/1.2 and √2/1.2; square 1.1/√2 and 1.1; ellipse 1/stretch and 1; times 1∓wobble). Then a cell can only be in the band if its Euclidean `r` is in `[(front−3.5s)/hi, (front+3.5s)/lo]`, so each row is walked only between `b.x ± sqrt(rOut²−dy²)` with the hole `b.x ± sqrt(rIn²−dy²)` skipped. In `shapeDist` use `sqrt(u²+v²)` (1.2 ns vs 7). Replace `off·exp(0.5−off²/2)` with a 4,096-entry lerp table. Clear only the rows written last frame instead of the page-tall `ring.fill(0)` (item 8).
- **Expected gain:** 6 ripples: `shapeDist`+`stir` 35 → 14 ms/s measured; phone the same ratio. One ripple: 3.4 → 3.2 (it was never the cost).
- **Pixel risk:** culling is exact (the bounds are conservative). The LUT changes ring values by at most 8.5e-7; those feed a 1/64-spaced Bayer threshold and a rounding to whole cells, so a flip needs a value within 1e-6 of a boundary: on the order of one cell per frame across the screen, inside a moving ripple. Call it "none in practice"; leave `Math.exp` in if you want it provably identical and accept ~3 ms/s.
- **Effort:** S–M (30 lines).

### 5. Paint only the wet cells on live frames (persistent pixel mirror)
- **What:** `Ascii.svelte:340-350` (`paintRows`, the `db` box), `glyphRow` after item 1.
- **Why it costs:** after items 1–4, one ripple still costs 143 ms/s, 109 of it writing pixels in `glyphRow`: the `db` box is the union of ring bounding boxes, which covers most of the screen once a ring is a second old, and every cell in it is rewritten every frame (64 stores each) although only the annulus (ring ≠ 0 now or last frame, plus one neighbour for the bend) can differ. Over a ring's life the annulus is roughly a third of its box.
- **The change:** keep a persistent `Uint32Array` mirror of the on-screen rows (or the whole canvas: 16.8 MB desktop, 5.3 MB phone; a viewport-tall ring buffer keyed by row is enough) and an `Int16Array` of the glyph id last drawn per cell. On a live frame compute each cell's id as now, write its 64 pixels only when the id changed, and `putImageData` the row's dirty span from the mirror. Cells that are dry this frame and were dry last frame skip even the arithmetic. This also makes item 2 per-cell for free (the idle bottom's 270 changed cells write 270 blocks, not 104 rows).
- **Expected gain:** one ripple ~143 → ~60–70 ms/s desktop (glyphRow from ~109 to ~35); six ripples ~165 → ~90; phone ~165 → ~80; swell moving ~58 → ~40. Estimate from the profile split and annulus fraction, not measured.
- **Pixel risk:** none (same ids, same bitmaps; the mirror is what the canvas already holds).
- **Effort:** M.

### 6. Cap the live frame rate
- **What:** `Ascii.svelte:450-460` (the loop schedules `requestAnimationFrame` while `live()`), `:30` (`FRAME = 33`, documented as "~30fps" but never used to pace painting).
- **Why it costs:** everything live is per frame: 60 paints a second in my runs, **120 on Timothy's MacBook and on ProMotion iPhones**. The rings and swell already advance on elapsed time, so the paint rate is free to choose.
- **The change:** in `loop`, if `live()` and `now − lastPaint < 30` (or `< 15` for a 60 Hz cap only), schedule the next rAF without drawing. Keep ticks and scroll repaints as they are.
- **Expected gain:** halves every live number: on a 120 Hz screen today's ripple goes from ~640 to ~320 ms/s before any other fix; after 1–5 it halves the remainder (one ripple ~60 → ~30).
- **Pixel risk:** visible as *feel*, not pixels: at 30 fps a 380 px/s ring front steps 1.6 cells per frame instead of 0.8, and the swell's follow lands on the same path at half the samples. A 60 Hz cap changes nothing for 60 Hz users and only removes the doubled work on 120 Hz screens. Timothy's rule set (stepped glyphs, no smooth tweening) tolerates 30; I would ship the 60 cap now and let him try 30.
- **Effort:** S.

### 7. Read the Svelte props once per paint, not once per cell
- **What:** `Ascii.svelte:89-99` (`scene`, `field` read `mode`, `study`, `seed`, `shot`, `flip` through `$props()` getters per cell), `:323-334` (`density`, `mode`, `shade` per cell in `glyphRow`).
- **Why it costs:** each prop read is a getter with a fallback check; the profile shows `getter` 4.2–4.9 + `get mode` 0.9–1.0 + `get density` 0.4 + `get flip`/`get study` ~0.5 ms/s during ripples, ~1 ms/s idle.
- **The change:** `const md = mode, fl = flip, st = study, sd = seed, sh = shot, dn = density` at the top of `rebuild` and `glyphRow`; pass `md` into `field`.
- **Expected gain:** 5–6 ms/s during ripples, ~1 idle, all scenarios. In the prototype.
- **Pixel risk:** none. **Effort:** S.

### 8. Shrink the per-frame `ring.fill(0)` to the rows written
- **What:** `Ascii.svelte:162`.
- **Why it costs:** the buffer is page-tall (65,700 floats on desktop Home) and is zeroed every live frame: ~2–3 ms/s.
- **The change:** remember `wetLo..wetHi` from the last frame and `fill(0, wetLo*cols, (wetHi+1)*cols)`. In the prototype.
- **Expected gain:** 2–3 ms/s live. **Pixel risk:** none. **Effort:** S.

### 9. Cache the canvas rect per frame
- **What:** `Ascii.svelte:111` (`local` per pointer event), `:166`, `:356`, `:455` (three `getBoundingClientRect` per frame).
- **Why it costs:** 4.3 ms/s while the pointer moves, 2.4–2.6 during ripples, but most of that is forced layout from the hero's typing (the DOM changes, the next rect read lays out), which caching does not remove; after caching it still showed 3.0.
- **The change:** one `rect()` per frame (reset in `loop` and in `paint()`), reused by `local`, `stir`, `draw`. In the prototype.
- **Expected gain:** ~1 ms/s. **Pixel risk:** none. **Effort:** S. Low priority; included because it is three lines.

### 10. Recompute the knockout only near the boxes that moved
- **What:** `Ascii.svelte:255-262` (`kVersion++` on any box change; every on-screen row then re-runs `knockout` for every cell).
- **Why it costs:** `knockout` is 2.0–2.5 ms/s in every profile, idle included: each hero line change (`field-measure`) re-runs 20k knockouts and repaints the rows whose `k` moved.
- **The change:** diff the old and new box lists; mark stale only the rows within `pad + feather + CLEAR` of a box that changed (`rowK[y] = -1` for those rows) instead of bumping the global `kVersion`.
- **Expected gain:** ~2 ms/s idle on Home and the Toolbox hero. **Pixel risk:** none. **Effort:** S.

### 11. The Toolbox app: port the site's field
- **What:** `app/src/renderer/src/ui/Ascii.svelte:180-199` (`draw`: `measure()`, `getComputedStyle(host)`, knockout key string, full `clearRect`, then per cell `bent` (allocates a `[x, y]` tuple), `field()` (an `fbm` per cell per *frame*, not per tick) and `drawImage`), `:106-138` (`stir` fills both page-tall buffers every frame), `:234-243` (30 fps `setTimeout` loop, so at least it is not 60).
- **Why it costs:** a 1400×900 stage at 16 px is ~5k cells. From the bench, a full `drawImage` repaint of that is 3.5 ms (phone-class 4.1), plus `fbm` per cell ~0.3 ms, `measure` with `getClientRects`/`measureText` and `getComputedStyle` ~0.3–0.5 ms with a forced layout, and 5k tuple allocations. At 30 fps that is **~120–150 ms/s whenever the pointer is over the stage or a ring is running**, which in a desktop app is most of the time the user is working. Not measured (no Electron build in this pass); the site's own pre-0214 figure for the same design was 450 ms/s at 60 fps.
- **The change:** port the site's structure: per-tick `rebuild` into `bV/bC/bHot/bCh` with the rest-output compare (2), per-row dirty + `db` box painting, item 1's bitmap rows, `bent` returning an index (no tuple), `measure`/`getComputedStyle`/`buildSprites` only on tick, resize or theme, and the boxed `heat`/`ring` clears. The files are meant to stay in step (0091), so the port is mostly a copy with the scene imports removed.
- **Expected gain:** live ~130 → ~15–25 ms/s; idle between ticks already sleeps.
- **Pixel risk:** none if ported faithfully (the app's `sky` mode uses `rows` where the site's uses `vert(y)`; keep the app's formula).
- **Effort:** M.

### 12. Not worth doing (checked)
- **Allocations:** `sceneCell`/`studyCell` return a fresh object per cell per tick (20k dark, 82k light) and `bent` is already index-based on the site. The profiler sampled 0 ms of GC in every phase; V8's scavenger absorbs it. Out-params would save maybe 1 ms/s and make `scene.ts` uglier.
- **Lower-resolution noise with interpolation:** changes pixels on the planet and the `below` texture (visible), and the compute it would save is ~1 ms per tick. No.
- **Caching `fbm` lattice hashes per tick:** `hash2` is 2.7 ns; a cache would cost more than it saves.
- **`measure()` per tick:** ~0.5 ms/s script + the layout it forces (1–2 ms/s). Making it event-driven risks missing text changes on pages without `field-measure`. Leave.
- **OffscreenCanvas in a worker:** would move the remaining ~30 ms/s off the main thread but not reduce it; the knockout measurement, colour resolution and pointer events all live on the main thread and would need messaging. L effort for responsiveness the page no longer lacks (no long tasks in any run). Only worth it if the app wants its stage off its main thread.

## Top 3

1. **Bitmap rows instead of `drawImage` per cell (1).** The single largest cost in every scenario, 10–17× cheaper per screen, proven pixel-identical, and the light mode already does it.
2. **Paint only what changed: rest-output dirtiness (2) + still cells (3) now, wet-only live painting with a mirror (5) next.** Together they turn "half the rows change every tick" into "67 cells change every tick", and make a ripple cost its annulus, not its box.
3. **Annulus ring walk with cheap maths (4), plus the frame cap (6) as Timothy's call.** (4) takes six rings' maths from 35 to 14 ms/s with no visible change; (6) halves whatever is left on his 120 Hz screen for free at 60, and again at 30 if he likes the feel.

With 1–5 and a 60 Hz cap the field should sit at roughly: idle Home ~20–25 ms/s desktop and ~45 on a slow phone (down from 58/95), one ripple ~60 desktop / ~80 phone (down from 322/431), six ripples ~90 / ~110 (down from 411/509), all with the same pixels.

## Is a WebGL rewrite worth it?

No. A fragment shader could draw this field, and the per-fragment work (sum of up to 24 ring profiles, a Gaussian swell, a bitmap glyph lookup) is trivial for a GPU, but it would not be pixel-faithful without re-deriving the scene on the CPU anyway: `hash2`/`fbm`, the mountain picture sampling, the knockout boxes and the Bayer thresholds would all have to be ported to GLSL, where float ordering and precision differ from V8's doubles, and every glyph-level boundary (`floor(v·10)`) and dither threshold (`> (bayer+0.5)/64`) is a place where a last-bit difference flips a visible cell. Keeping parity would mean computing the scene values in JS and uploading them as a texture every tick, at which point the GPU only replaces item 1, which `putImageData` already does for 0.2 ms per screen. It also forks the component the site and the app share (0091), adds a context-loss path, a no-WebGL fallback that is this same canvas code, and a second renderer for Timothy to keep visually in step. The measured picture is that the field is a bandwidth problem on the wrong API, not a compute problem: after the incremental fixes the whole thing is ~1–2 ms per live frame on desktop, and the remaining work scales with the annulus of water actually moving. Spend the day on 1–6 and the app port, not on a shader.

## Method and files (all in this folder)

- `baseline.mjs`: scenario runner (Playwright + CDP `Performance`), outputs `base-*.txt` (today, :4173), `control-4182-desktop-dark.txt` (unminified control), `proto-*.txt` (prototype).
- `profile.mjs`: CDP `Profiler` at 100 µs, self time per function, `profile-desktop-dark.txt` (today) and `profile-proto-desktop-dark.txt`.
- `scenebench.mjs` + `lib/`: the site's `scene.ts`/`studyScenes.ts`/`prng.ts` run in Node with the real `mountains-a.webp` laid out as `layoutMountains` does (via sharp), counting raw vs drawn changes per tick and cost per cell; `scenebench.txt`.
- `canvasbench.mjs`: `drawImage` vs `ImageData` paint strategies on a Home-sized canvas, desktop and phone; `canvasbench-*.txt`.
- `parity.mjs`: motion off, both builds, reads every canvas's pixels and counts differences; `parity.txt` (0 differing pixels in all 11 cases; 208,523 opaque pixels on Home dark, so the canvases were painted).
- `proto.diff`: the prototype (items 1, 2, 3, 4, 7, 8, 9) against `01cfcb8`, built unminified in a scratch worktree on :4182 with `static/work` and `static/toolbox` linked to the main checkout for the derived WebPs. Worktree removed; neither repo's working tree was touched (`git status` clean). The :4173 preview was not running when I started; I started `pnpm preview` there and left it running.
