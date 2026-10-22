# ASCII field performance, round 2 (Opus), condensed

The Opus agent could not write its own report file; this is its returned report, condensed by the assistant. Its prototype patch is the base of PX-115 (0218).

**Bottom line:** 2–5× cheaper with no pixel change, built and measured. The field repaints ~60× more cells than change at rest, ~25× during ripples. At the top of Home 86 of 20,340 visible cells change per tick; the page without the field costs 4 ms/s. WebGL: not worth it.

## Where the time goes (baseline, desktop dark, Home, task ms/s)

| | ms/s |
|---|---|
| idle top, whole page | 41–57 |
| idle top, field hidden | 4 |
| idle top, field computes, draws nothing | 21 |
| 6 ripples, whole page | 372–438 |
| 6 ripples, field hidden | 11 |
| 6 ripples, field computes, draws nothing | 106 |

Changed vs repainted cells: idle top 86 vs 10,800 per tick; mid-page 290 vs 20,700; 6 ripples 688 vs 17,645 per frame; pointer moving 143 vs 2,736.

## Prototype (items 1–7) vs baseline, task ms/s

| Scenario | Baseline | Prototype |
|---|---|---|
| Desktop dark, idle top | 47–57 | 20–25 |
| Desktop dark, pointer moving | 107–115 | 46–60 |
| Desktop dark, 6 ripples | 372–438 | 72–99 |
| Desktop light, 6 ripples | 171–231 | 87–113 |
| Phone dark, pointer moving | 311–336 | 109–120 |
| Phone dark, 6 ripples | 435–539 | 112–126 |
| Phone light, 6 ripples | 269–286 | 141–148 |
| Phone load, field script (dark / light) | 147 / 212 ms | 92 / 138 ms |

Parity: deterministic harness (virtual timers, IntersectionObserver, transitions off) passed on Home 3 rings both themes at 1440 and 390; Home, Contact, Toolbox, 404 with 14 rings; two study strips.

## Ranked list
1. Paint only cells whose output code changed (`shown` per cell, span `putImageData`). M.
2. Draw dark glyphs as pixels like the dither (drawImage stubbed: ripples 402 → 106). S after 1.
3. Tiles from glyph bits, no sprite canvases (240 canvases in a scene; a read-back attempt added an 85 ms long task). S.
4. Cache each ring's shape distance per cell (Float64, ~180 KB a ring). S.
5. Walk the ring's annulus, not its box. S.
6. Skip time-independent scene cells (`s: 1`) and dry cells between ticks. S–M.
7. Read props once per call. S.
8. 60 fps cap on 120 Hz (not 30: stepped motion). S.
9. Cache the canvas rect per frame (phone pointer −7 ms/s). S.
10. Knockout only near boxes that moved (−2 ms/s idle). S.
11. Micro-tuning (flat Bayer, hoisting). S.
12. Toolbox app: port; its cost is almost all drawImage (pointer moving 57–62 ms/s at 30 fps).
13. Allocations: leave.

Not recommended: lower-resolution noise or LUTs (pixel changes), 30 fps (stepped), OffscreenCanvas worker (moves cost, breaks toDataURL tooling), viewport-sized canvas (measure on a real phone first).

Side finding: the committed `tools/review/px111.mjs` failed baseline against itself (8–4,500 px) because the hero's typing ran on real timers; fixed in PX-115.
