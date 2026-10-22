<script lang="ts">
  // ASCII field. Each texture cell holds a 5×7 bitmap glyph drawn with 2px pixels, chosen
  // from a density ramp by a scalar field. The canvas origin snaps to the page grid.
  // `avoid` knocks the field out around text.
  // A soft swell follows the pointer and bends the picture round it; a click sends a ring.
  // While motion is on the canvas redraws at ~30fps for the interaction, but the
  // ambient field only advances one step every `tick` ms, so it keeps its cadence.
  // This file and GRIDFORM Studio's src/renderer/src/ui/Ascii.svelte are the same
  // component and are meant to stay in step (0091); only the import paths differ.
  import { onMount } from 'svelte';
  import { motion, theme } from '$lib/motion.svelte';
  import { fbm, hash2, BAYER8 } from '$lib/prng';
  import { GLYPHS, RAMP } from '$lib/glyphs';
  import { knockout, measureBoxes, type Box } from '$lib/knockout';
  import { CELL_TEXTURE, TICK_SLOW } from '$lib/tokens';
  import { studyCell } from '$lib/studyScenes';
  import { sceneCell, PALETTES, MAT, MOUNTAIN_REFS, layoutMountains, shotHasRidge, type Palette, type Shot, type Mountains } from '$lib/scene';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands' | 'scene';
  let { mode = 'noise' as Mode, cell = CELL_TEXTURE, px = 2, seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad = 1, feather = 3, interactive = true, reach = 4.5, flip = false, shade = false, skySpan = 'box', skyRepeat = false, palette = 'scene' as Palette, lightAs = 'same' as 'same' | 'dither', mountains = '' as '' | 'a' | 'b', shot = 'hero' as Shot, hug = false, depth = 1, clear = '', clearFeather = undefined as number | undefined, sceneSpan = 'screen' as 'screen' | 'box', study = '' }: { mode?: Mode; cell?: number; px?: number; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; interactive?: boolean; reach?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; clearFeather?: number; sceneSpan?: 'screen' | 'box'; study?: string } = $props();
  // `shade` colours by weight instead: the heaviest glyph is the accent and every lighter
  // step sinks toward the ground, so a dense field reads as a few bright points on dark.
  // Each mode has one thing that draws in the accent: the rain's droplet, the scan's line,
  // a band's crest, the noise's peaks, the sky's densest cells. A click's ring lights the
  // same way, so pressing a field is what makes it yellow.
  // `flip` mirrors the field left-to-right (the pattern, not the glyphs).
  // The sky's fall-off runs over the whole box by default; `skySpan: 'screen'` runs it over one
  // window height instead, so a page-tall sky keeps the hero's look in its first screen
  // (PX-63). Past that it thins to the quiet right-hand scatter, or with `skyRepeat` it eases
  // back and forth, one dense bank every two screens.
  const FRAME = 33; // ms between redraws while animating or cooling
  // The pointer's swell (0217, after the sign-in field of Timothy's Beyond the Login,
  // ascii-touch.ts): one soft bump a few cells across eases after the pointer, rising while it
  // moves and settling about a second after it stops or leaves; no trail. It thickens the field
  // a little and bends the picture outward round it, like a lens, in the field's own colours.
  // `follow`, `rise` and `fall` are kept per `step` ms; `reach` is the bump's size in CSS px
  // (the `reach` prop is cells of a 16px field), `rest` how long a still pointer keeps it up.
  const SWELL = { follow: 0.3, rise: 0.25, fall: 0.85, step: 40, rest: 900, lift: 0.5, lens: 0.85 };
  // A click is a drop in water (0211, from the sign-in field of Timothy's Beyond the Login,
  // ascii-touch.ts): a wave runs out from the point, a crest with a trough behind it, fading as
  // it spreads and bending the picture under it. Each ring draws its own speed, life, thickness
  // and shape from these ranges (0212); waves add, so rings that meet build up or cancel out.
  // Measured in CSS pixels and seconds, so an 8px scene and a 16px field ripple alike.
  const WAVE = { speed: [180, 380], life: [2, 3.6], thick: [14, 40], stretch: [1.5, 2.4], wobble: [0.05, 0.12], lobes: [3, 7], bend: 4.2, most: 6, cap: 24, out: 0.3 };
  const pick = ([a, b]: number[]) => a + Math.random() * (b - a);
  const SHAPES = ['circle', 'diamond', 'square', 'ellipse'] as const;
  type Burst = { x: number; y: number; t: number; speed: number; life: number; thick: number; shape: (typeof SHAPES)[number]; cos: number; sin: number; stretch: number; wobble: number; lobes: number; phase: number; span: number; die?: number; map?: Float64Array; my0?: number; my1?: number; mc?: number };
  // The ranges are for a desktop window; a narrower field scales a ring's speed and thickness down
  // with its width, to under half on a phone (0213: at full size one ring crossed the whole screen),
  // never thinner than one and a half cells.
  const ringScale = () => Math.min(1, Math.max(0.4, canvas.getBoundingClientRect().width / 1200));
  function burstAt(p: { x: number; y: number }): Burst {
    const k = ringScale();
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)], a = Math.random() * Math.PI, stretch = shape === 'ellipse' ? pick(WAVE.stretch) : 1;
    const wobble = Math.random() < 0.5 ? pick(WAVE.wobble) : 0;
    // how far, at most, a point at a given distance by this shape's measure lies from the click: the loop's reach
    const span = (shape === 'diamond' ? 1.2 : shape === 'square' ? 1.3 : stretch) / (1 - wobble);
    return { ...p, t: 0, speed: pick(WAVE.speed) * k, life: pick(WAVE.life), thick: Math.max(1.5 * cell, pick(WAVE.thick) * k), shape, cos: Math.cos(a), sin: Math.sin(a), stretch, wobble, lobes: Math.round(pick(WAVE.lobes)), phase: Math.random() * 2 * Math.PI, span };
  }
  // a point's distance from the click, by the ring's shape, turned to its angle
  function shapeDist(b: Burst, dx: number, dy: number) {
    const u = dx * b.cos + dy * b.sin, v = -dx * b.sin + dy * b.cos;
    let d = b.shape === 'diamond' ? (Math.abs(u) + Math.abs(v)) / 1.2 : b.shape === 'square' ? Math.max(Math.abs(u), Math.abs(v)) * 1.1 : b.shape === 'ellipse' ? Math.hypot(u / b.stretch, v) : Math.hypot(u, v);
    if (b.wobble) d *= 1 + b.wobble * Math.sin(b.lobes * Math.atan2(v, u) + b.phase);
    return d;
  }
  let canvas: HTMLCanvasElement; let host: HTMLElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let cols = 0, rows = 0, screenRows = 1, lastW = 0, dpr = 1, frame = 0, color = '', accentColor = '', offX = 0, offY = 0;
  let drawn = $state(false);
  // A field that mounts off screen waits for its first draw until it comes within 64px of
  // the viewport (PX-59): Home mounts three, and drawing them all at once was the page's
  // longest task. The on-screen check at mount is synchronous, so a visible field still
  // paints in its first frame; off screen, the grid fallback shows until the field is due.
  let visible = true; let due = true;
  let boxes: Box[] = [];
  // the swell's height under each cell, 0 to 1, inside its box (`hb`) and 0 everywhere else
  let heat = new Float32Array(0);
  let swell = { x: 0, y: 0, s: 0 }, movedAt = 0;
  // the water's height under each cell, from every click still running: crests above 0, troughs
  // below. A scene's crests invert the picture (0166, 0167); every other field's light in the accent
  let ring = new Float32Array(0);
  let pointer: { x: number; y: number } | null = null;
  // every press rings out on its own, no matter how fast (PX-64); past WAVE.cap running rings the
  // oldest fades out over WAVE.out seconds rather than vanishing (0212)
  let bursts: Burst[] = [];
  let paper = '';

  // a study's strip draws its own scene (0179); every other scene field draws a shot of the landing's world
  const scene = (x: number, y: number, t: number, c: number, S: number) => (study ? studyCell(study, x, y, t, c, S, seed) : sceneCell(x, y, t, c, S, seed, shot, mtn));
  type Cell = { v: number; ch?: string; hot?: boolean; c?: number; o?: boolean; fade?: number; tex?: boolean; s?: number };
  const field = (x: number, y: number, t: number): Cell => {
    if (mode === 'scene') return scene(x, y, t, cols, screenRows);
    if (mode === 'noise') { const v = fbm(x / 6 + t * 0.04, y / 4 - t * 0.015, seed, 2); return { v, hot: v > 0.9 }; }
    if (mode === 'sky') { const d = (x / cols) * 0.55 + vert(y) * 0.6 - 0.28; const v = Math.min(1, Math.max(0, d + (fbm(x / 6 + t * 0.03, y / 5, seed) - 0.5) * 0.45)); return { v, hot: v > 0.92 }; }
    if (mode === 'bands') { const b = Math.sin((y - t * 0.3) / 1.6 + fbm(x / 7, y / 16, seed) * 4) * 0.5 + 0.5; return { v: b * (0.2 + 0.8 * (1 - x / cols)), hot: b > 0.995 }; }
    if (mode === 'fall') { const sp = 1 + Math.floor(hash2(x, 0, seed) * 3); const head = (t * sp * 0.5 + hash2(x, 1, seed) * rows * 3) % (rows * 1.8); const d = head - y; if (d > 0 && d < 1) return { v: 1, ch: '0', hot: true }; return { v: d > 0 && d < rows * 0.6 ? 1 - d / (rows * 0.6) : 0 }; }
    if (mode === 'scan') { const line = Math.abs(((t * 0.7) % (rows + 6)) - 3 - y); return { v: Math.max(0, 1 - line / 3) * 0.8 + fbm(x / 8, y / 8, seed) * 0.25, hot: line < 0.5 }; }
    return { v: hash2(x, y, seed + Math.floor(t / 6)) > 0.93 ? fbm(x, y, seed) : 0 };
  };
  // the sky's vertical fall-off, 1 at the top of its span to 0 at the bottom
  const vert = (y: number) => {
    const span = skySpan === 'screen' ? screenRows : rows;
    if (skyRepeat) return 0.5 + 0.5 * Math.cos((Math.PI * y) / span);
    return Math.max(0, 1 - y / span);
  };
  const dithering = () => mode === 'scene' && lightAs === 'dither' && theme.light;
  // `clear` (0177): selectors knocked out in full whatever `depth` is, for small type over the picture
  function measure() { const root = host.closest('.band') ?? document, r = canvas.getBoundingClientRect(); boxes = [...(avoid ? measureBoxes(root, avoid, r, cell, hug) : []), ...(clear ? measureBoxes(root, clear, r, cell, hug, 1, clearFeather) : [])]; } // `clearFeather` (0191): the cleared small type fades over its own, shorter distance

  // --- the pointer's swell ------------------------------------------------
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / cell, y: (e.clientY - r.top) / cell }; };
  // with motion off the field stays still under the pointer too: no swell, no rings (0207)
  function onMove(e: PointerEvent) {
    if (!interactive || !motion.on) return;
    pointer = local(e); movedAt = performance.now();
    if (!swell.s) { swell.x = pointer.x; swell.y = pointer.y; } // a new swell starts under the pointer, not where the last one sank
    wake();
  }
  function onLeave() { pointer = null; if (motion.on) wake(); }
  function onDown(e: PointerEvent) {
    if (!interactive || !motion.on) return;
    wake(); bursts.push(burstAt(local(e)));
    const running = bursts.filter((b) => b.die === undefined);
    if (running.length > WAVE.cap) running[0].die = (running[0].t * FRAME) / 1000;
  }
  // a quick second click on the bare field would select the nearest words; only there, not on text or controls
  function onMouseDown(e: MouseEvent) { if (interactive && e.detail > 1 && !(e.target as Element | null)?.closest('a, button, input, textarea, select, label, p, h1, h2, h3, h4, li, dt, dd, figure, img, span')) e.preventDefault(); }
  // The swell keeps the field painting every frame while it is up, and while the pointer has moved
  // in the last SWELL.rest; a ring while it runs; each for the frame after, which clears it. Past
  // that, a frame repaints only when the field's tick or the scroll position has changed (0206).
  let wake = () => {}; // the motion loop's, while it runs
  // Text that changes between ticks (the hero's typed lines) asks for a measure now with a
  // `field-measure` event on the band, so its knockout does not wait up to a tick (0208).
  let remeasure = false;
  const onMeasure = () => { measuredFrame = -1; remeasure = true; invalidate(); };
  // What changed since the last paint, in cells: the swell's and the rings' boxes this frame and the
  // last (so cells that have just cooled or calmed are painted once more). A paint between ticks
  // repaints only these, not the screen (0214).
  type Rect = [number, number, number, number]; // x0, y0, x1, y1, inclusive; empty when x1 < x0
  const none = (): Rect => [Infinity, Infinity, -1, -1];
  const grow = (b: Rect, x0: number, y0: number, x1: number, y1: number) => { if (x0 < b[0]) b[0] = x0; if (y0 < b[1]) b[1] = y0; if (x1 > b[2]) b[2] = x1; if (y1 > b[3]) b[3] = y1; };
  let hb = none(), hbLast = none(), rb = none(), rbLast = none(), db = none(), wetLo = 0, wetHi = -1;
  // the swell and rings run on elapsed time, so they look the same at 60 or 120 frames a second
  function stir(dt: number, r: DOMRect) {
    hbLast = hb; rbLast = rb; hb = none(); rb = none(); db = none();
    if (!interactive || heat.length !== cols * rows) return;
    // last frame's swell is cleared, then laid down where it is now
    if (hbLast[2] >= 0) for (let y = hbLast[1]; y <= hbLast[3]; y++) heat.fill(0, y * cols + hbLast[0], y * cols + hbLast[2] + 1);
    const k = dt / SWELL.step, still = !pointer || performance.now() - movedAt > SWELL.rest;
    if (pointer) { const f = 1 - Math.pow(1 - SWELL.follow, k); swell.x += (pointer.x - swell.x) * f; swell.y += (pointer.y - swell.y) * f; }
    swell.s = still ? (swell.s < 0.02 ? 0 : swell.s * Math.pow(SWELL.fall, k)) : swell.s + (1 - swell.s) * (1 - Math.pow(1 - SWELL.rise, k));
    if (swell.s) {
      // a bell 1 at the centre; past 2.2 radii it is under a hundredth and left out
      const R = (reach * CELL_TEXTURE) / cell, M = 2.2 * R;
      const x0 = Math.max(0, Math.floor(swell.x - M)), x1 = Math.min(cols - 1, Math.ceil(swell.x + M)), y0 = Math.max(0, Math.floor(swell.y - M)), y1 = Math.min(rows - 1, Math.ceil(swell.y + M));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const d2 = ((x + 0.5 - swell.x) ** 2 + (y + 0.5 - swell.y) ** 2) / (R * R);
        if (d2 < 4.84) heat[y * cols + x] = swell.s * Math.exp(-d2);
      }
      if (x1 >= x0 && y1 >= y0) grow(hb, x0, y0, x1, y1);
    }
    // only the rows the rings wrote last frame are cleared, not the page-tall buffer (0218)
    if (ring.length !== heat.length) ring = new Float32Array(heat.length); else if (wetHi >= wetLo) ring.fill(0, wetLo * cols, (wetHi + 1) * cols);
    wetLo = rows; wetHi = -1;
    if (bursts.length) {
      // only the rows on screen and a few beyond (the bend looks up to WAVE.most cells away): a
      // page-tall field with two dozen rings would otherwise work out every cell for each of them
      const vy0 = Math.max(0, Math.floor(-r.top / cell) - 6), vy1 = Math.min(rows - 1, Math.ceil((window.innerHeight - r.top) / cell) + 6);
      for (const b of bursts) {
        const age = (b.t * FRAME) / 1000, s = b.thick / cell, front = (b.speed * age) / cell;
        // fades with the square of its age, and over WAVE.out seconds once it is past the cap
        const fade = (1 - age / b.life) ** 2 * (b.die === undefined ? 1 : Math.max(0, 1 - (age - b.die) / WAVE.out));
        b.t += dt / FRAME;
        if (fade <= 0) continue;
        const R = (front + 3.5 * s) * b.span;
        const x0 = Math.max(0, Math.floor(b.x - R)), x1 = Math.min(cols - 1, Math.ceil(b.x + R)), y0 = Math.max(vy0, Math.floor(b.y - R)), y1 = Math.min(vy1, Math.ceil(b.y + R));
        if (y0 < wetLo) wetLo = y0; if (y1 > wetHi) wetHi = y1;
        if (x1 >= x0 && y1 >= y0) grow(rb, Math.max(0, x0 - 1), Math.max(0, y0 - 1), Math.min(cols - 1, x1 + 1), Math.min(rows - 1, y1 + 1)); // a cell beside the water bends too
        // only the ring's band is walked, not its box (0218): a shape's distance is at most `hi` times the
        // plain distance, so a cell nearer than (front − 3.5 s) / hi is still dry; a cell of margin each side
        const hi = (b.shape === 'diamond' ? Math.SQRT2 / 1.2 : b.shape === 'square' ? 1.1 : 1) * (1 + b.wobble);
        const rIn = Math.max(0, (front - 3.5 * s) / hi - 1), rOut = R + 1, rIn2 = rIn * rIn, rOut2 = rOut * rOut;
        // a cell's distance from the click by this ring's shape never changes: worked out once and kept
        // per ring for the rows on screen and 24 either side (about 180 KB a ring on a desktop)
        if (!b.map || b.mc !== cols || b.my0! > vy0 || b.my1! < vy1) { b.my0 = Math.max(0, vy0 - 24); b.my1 = Math.min(rows - 1, vy1 + 24); b.mc = cols; b.map = new Float64Array((b.my1 - b.my0 + 1) * cols).fill(NaN); }
        const dm = b.map, my0 = b.my0!;
        for (let y = y0; y <= y1; y++) {
          const dy = y + 0.5 - b.y, dy2 = dy * dy; if (dy2 > rOut2) continue;
          const xo = Math.sqrt(rOut2 - dy2), xi = dy2 < rIn2 ? Math.sqrt(rIn2 - dy2) : -1;
          const xa = Math.max(x0, Math.floor(b.x - xo - 0.5)), xb = Math.min(x1, Math.ceil(b.x + xo - 0.5));
          const la = xi < 0 ? xb : Math.min(xb, Math.floor(b.x - xi - 0.5)), ra = xi < 0 ? xb + 1 : Math.max(xa, Math.ceil(b.x + xi - 0.5));
          for (let x = xa; x <= xb; x++) {
            if (x > la && x < ra) { x = ra - 1; continue; }
            // a crest ahead and a trough behind (the slope of a bell curve), 1 at the crest's top
            const k = (y - my0) * cols + x; let d = dm[k]; if (d !== d) dm[k] = d = shapeDist(b, x + 0.5 - b.x, dy);
            const off = (d - front) / s; if (off > 3.5 || off < -3.5) continue;
            ring[y * cols + x] += fade * off * Math.exp(0.5 - (off * off) / 2);
          }
        }
      }
      bursts = bursts.filter((b) => { const age = (b.t * FRAME) / 1000; return age < b.life && (b.die === undefined || age - b.die < WAVE.out); });
    }
    for (const r of [hb, hbLast, rb, rbLast]) if (r[2] >= 0) grow(db, r[0], r[1], r[2], r[3]);
  }

  // Where a cell looks through the water: the field up to six cells along the water's slope, as
  // a ripple bends what lies under it; under the swell, a little nearer its centre, so what is
  // under the pointer swells outward. Kept to the rows being drawn, which are the ones worked out.
  function bent(i: number, x: number, y: number, y0: number, y1: number) {
    const h = heat[i], wet = ring[i] || (x > 0 && ring[i - 1]) || (x < cols - 1 && ring[i + 1]);
    if (!h && !wet) return i;
    let gx = 0, gy = 0;
    if (wet) {
      gx = ((x < cols - 1 ? ring[i + 1] : ring[i]) - (x > 0 ? ring[i - 1] : ring[i])) * WAVE.bend;
      gy = ((y < rows - 1 ? ring[i + cols] : ring[i]) - (y > 0 ? ring[i - cols] : ring[i])) * WAVE.bend;
    }
    if (h) { gx += (swell.x - x - 0.5) * SWELL.lens * h; gy += (swell.y - y - 0.5) * SWELL.lens * h; }
    const ox = Math.max(-WAVE.most, Math.min(WAVE.most, Math.round(gx))), oy = Math.max(-WAVE.most, Math.min(WAVE.most, Math.round(gy)));
    if (!ox && !oy) return i;
    return Math.max(y0, Math.min(y1 - 1, y + oy)) * cols + Math.max(0, Math.min(cols - 1, x + ox));
  }

  // --- glyph tiles ----------------------------------------------------------
  // Canvas fills want a resolved colour; let CSS do the mixing. The probe is made on
  // first use: this component is prerendered, and there is no document then.
  let probe: HTMLSpanElement | null = null;
  function mix(a: string, b: string, t: number): string {
    probe ??= document.createElement('span');
    probe.style.color = `color-mix(in oklab, ${a} ${Math.round(t * 100)}%, ${b})`;
    host.appendChild(probe); const out = getComputedStyle(probe).color; probe.remove(); return out;
  }
  // A glyph is drawn as a tile: its pixels in one colour, a Uint32Array a cell square, made from
  // its bits the first time it is needed and copied into the row's image (0218; it was one sprite
  // canvas per glyph and colour, 240 of them in a scene, and one drawImage per cell). A tile's
  // colour is a set: 0 the field's colour, 1 the accent, 2 + level a `shade` step; in a scene
  // 1 + c, the palette's colour c. Tiles are dropped whenever the colours may have changed.
  const GKEYS = Object.keys(GLYPHS), GI = new Map(GKEYS.map((k, i) => [k, i])), RAMPGI = RAMP.split('').map((c) => GI.get(c) ?? 0), BLANK = GI.get(' ');
  let tiles: (Uint32Array | undefined)[] = [], setCols: (number | undefined)[] = [], palLen = 0, tileKey = '';
  function resetTiles() {
    const key = color + '|' + accentColor + '|' + paper + '|' + shade + '|' + dpr + '|' + mode + palette + lightAs + theme.light; if (key === tileKey) return; tileKey = key;
    tiles = []; setCols = []; palLen = mode === 'scene' ? PALETTES[palette][theme.light ? 'light' : 'dark'].length : 0;
  }
  function setColour(id: number) {
    let c = setCols[id]; if (c !== undefined) return c;
    let css: string;
    if (mode === 'scene') css = id === 0 ? color : PALETTES[palette][theme.light ? 'light' : 'dark'][id - 1];
    // the heaviest shade step is the accent; every lighter one sinks toward the ground
    else css = id === 0 ? color : id === 1 || id === 2 + RAMP.length - 1 ? accentColor || color : mix(color, paper, 0.08 + (0.92 * (id - 2)) / (RAMP.length - 1));
    c = palette32([css])[0]; setCols[id] = c; return c;
  }
  // a tile's code: set × 32 + glyph + 1; 0 is a blank cell
  function tileOf(code: number) {
    let t = tiles[code]; if (t) return t;
    const col = setColour(code >> 5), bits = GLYPHS[GKEYS[(code & 31) - 1]];
    const p = px * dpr, s = cell * dpr, ox = Math.floor((s - 5 * p) / 2 / p) * p, oy = Math.floor((s - 7 * p) / 2 / p) * p;
    t = new Uint32Array(s * s);
    for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (bits[r] & (16 >> k)) for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) { const X = ox + k * p + b, Y = oy + r * p + a; if (X >= 0 && Y >= 0 && X < s && Y < s) t[Y * s + X] = col; }
    tiles[code] = t; return t;
  }
  // --- drawing --------------------------------------------------------------
  // The field itself only changes once per `tick` (or on a resize or theme change), so it is
  // worked out then and kept per cell (PX-66); each animation frame only adds the pointer's swell
  // and repaints the rows on screen. Off-screen rows keep their last paint until they scroll in.
  // A row is painted again only when something in it changed (0214): its values at this tick, its
  // knockout, or the swell and rings passing over it (`db`); most of a scene is still from one tick
  // to the next, and every paint used to repaint the screen.
  let baseDirty = true, measuredFrame = -1; let rowFrame = new Int32Array(0); let rowDirty = new Uint8Array(0);
  // the knockout only changes when the boxes it steps around do: kept per row and redone when the
  // measured boxes move (0207), where before every cell on screen was worked out again each tick
  let boxesKey = '', kVersion = 0; let rowK = new Int32Array(0); let boxKeys: string[] = [], lastBoxes: Box[] = [];
  let bV = new Float32Array(0), bC = new Int8Array(0), bHot = new Uint8Array(0), bK = new Float32Array(0); let bCh: (string | undefined)[] = [];
  let dV = new Float32Array(0), dC = new Int8Array(0); // dither: four pixels per cell
  // What each cell shows on the canvas now, as one code (-1 unknown): a tile's code, or in light mode
  // its four pixels' palette indices. A cell is written only when its code changes (0218): rows used
  // to be repainted whole when any value in them moved, ~60 times the cells that changed.
  let shown = new Int32Array(0);
  // cells drawn wet last time (under the swell or a ring), so they are drawn once more when dry; and
  // cells and dither pixels whose scene value never changes, worked out once (`s` from sceneCell)
  let aff = new Uint8Array(0), bS = new Uint8Array(0), dS = new Uint8Array(0);
  let last = 0;
  // rows are worked out as they are painted, so a tick costs only the rows on screen
  function rebuild(y0: number, y1: number) {
    const n = cols * rows;
    if (baseDirty || bK.length !== n) {
      if (bK.length !== n) { bV = new Float32Array(n); bC = new Int8Array(n); bHot = new Uint8Array(n); bK = new Float32Array(n); bCh = new Array(n); dV = new Float32Array(n * 4); dC = new Int8Array(n * 4); rowFrame = new Int32Array(rows); rowK = new Int32Array(rows); rowDirty = new Uint8Array(rows); shown = new Int32Array(n); aff = new Uint8Array(n); bS = new Uint8Array(n); dS = new Uint8Array(n * 4); }
      rowFrame.fill(-1); rowDirty.fill(1); kVersion++; shown.fill(-1); bS.fill(0); dS.fill(0);
      const cs = getComputedStyle(host); color = cs.color; accentColor = cs.getPropertyValue('--accent-text').trim(); paper = cs.getPropertyValue('--paper').trim(); resetTiles(); pal32 = null;
      baseDirty = false; measuredFrame = -1;
    }
    // the text the field steps around is measured once per tick, not once per frame
    if (measuredFrame !== frame) {
      measure(); measuredFrame = frame;
      const keys = boxes.map((b) => `${b.x0},${b.y0},${b.x1},${b.y1},${b.depth},${b.feather}`), key = keys.join(';');
      if (key !== boxesKey) {
        // only the rows a box that came, went or moved can reach are worked out again (0218): the hero
        // types a letter every few hundred ms, and every row on screen was worked out again for it
        const now = new Set(keys), before = new Set(boxKeys), c = hug ? 1.5 : 0;
        const touch = (b: Box) => { const r = c + pad + (b.feather ?? feather) + 1; for (let y = Math.max(0, Math.floor(b.y0 - r)); y <= Math.min(rows - 1, Math.ceil(b.y1 + r)); y++) rowK[y] = -1; };
        lastBoxes.forEach((b, i) => { if (!now.has(boxKeys[i])) touch(b); });
        boxes.forEach((b, i) => { if (!before.has(keys[i])) touch(b); });
        boxesKey = key; boxKeys = keys; lastBoxes = boxes;
      }
    }
    const dith = dithering(), P = pad, F = feather, H = hug, D = depth;
    // props read once here, not once a cell: each is a getter
    const md = mode, st = study, sd = seed, sh = shot, fl = flip, M = mtn, C = cols, SR = screenRows;
    const sc: (x: number, y: number, t: number, c: number, S: number) => Cell = st ? (x, y, t, c, S) => studyCell(st, x, y, t, c, S, sd) : (x, y, t, c, S) => sceneCell(x, y, t, c, S, sd, sh, M);
    for (let y = y0; y < y1; y++) {
      if (rowK[y] !== kVersion) { rowK[y] = kVersion; for (let x = 0; x < cols; x++) { const i = y * cols + x, k = Math.fround(knockout(x + 0.5, y + 0.5, boxes, P, F, H, D)); if (k !== bK[i]) { bK[i] = k; rowDirty[y] = 1; } } } // hugged knockouts are rounded too (0174)
      if (rowFrame[y] === frame) continue; rowFrame[y] = frame; let moved = 0;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (dith) {
          for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
            const o = i * 4 + j * 2 + q; if (dS[o]) continue;
            const X = 2 * x + q, Y = 2 * y + j, f = sc(X, Y, frame, C * 2, SR * 2); if (f.s) dS[o] = 1;
            // rock is drawn by its shadows, like ink: snow and lit faces stay paper; the planet keeps its colour; the sky is open paper;
            // the page texture below (`tex`) is drawn as it is, in the rock's colours
            const rock = !!f.o && !f.tex && (f.c === MAT.rock || f.c === MAT.shade || f.c === MAT.snow);
            const v = Math.fround(f.c === MAT.star && !f.o ? 0 : rock ? 0.9 * (1 - f.v) * (f.fade ?? 1) : f.v);
            const c = rock ? (f.v < 0.4 ? MAT.rock : MAT.shade) : f.o ? f.c! : -1;
            if (v !== dV[o] || c !== dC[o]) { dV[o] = v; dC[o] = c; moved = 1; }
          }
        } else {
          if (bS[i]) continue;
          const f = md === 'scene' ? sc(fl ? C - 1 - x : x, y, frame, C, SR) : field(fl ? C - 1 - x : x, y, frame), v = Math.fround(f.v), c = f.c ?? -1, hot = f.hot ? 1 : 0;
          if (f.s) bS[i] = 1;
          if (v !== bV[i] || c !== bC[i] || hot !== bHot[i] || f.ch !== bCh[i]) { bV[i] = v; bC[i] = c; bHot[i] = hot; bCh[i] = f.ch; moved = 1; }
        }
      }
      if (moved) rowDirty[y] = 1;
    }
  }
  // Light mode's dither is written as pixels into one row's image and put down at once (0214):
  // four fills a cell, each setting its own colour, made the light field cost twice the dark one.
  let rowImg: ImageData | null = null, rowPx = new Uint32Array(0), pal32: Uint32Array | null = null; let swatch: CanvasRenderingContext2D | null = null;
  function palette32(list: string[]) {
    swatch ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    return Uint32Array.from(list, (c) => { if (!swatch) return 0; swatch.clearRect(0, 0, 1, 1); swatch.fillStyle = c; swatch.fillRect(0, 0, 1, 1); const d = swatch.getImageData(0, 0, 1, 1).data; return ((d[3] << 24) | (d[2] << 16) | (d[1] << 8) | d[0]) >>> 0; });
  }
  // light mode, the scene as pixel dither (PX-65): each cell is four square pixels at half the
  // cell, lit if they beat the Bayer threshold, in their material's colour; no glyphs and no
  // stars, so it reads as a print on the paper
  function ditherRow(y: number, x0: number, x1: number, ry0: number, ry1: number, part = false) {
    if (!ctx) return;
    const s = cell * dpr, hs = s / 2, W = cols * s, dens = density;
    if (!rowImg || rowImg.width !== W || rowImg.height !== s) { rowImg = ctx.createImageData(W, s); rowPx = new Uint32Array(rowImg.data.buffer); }
    pal32 ??= palette32(PALETTES[palette].light);
    let lo = Infinity, hi = -1;
    for (let x = x0; x < x1; x++) {
      const i = y * cols + x, k = bK[i]; let code = 1 << 20;
      const wet = heat[i] || ring[i] || (x > 0 && ring[i - 1]) || (x < cols - 1 && ring[i + 1]) ? 1 : 0; if (part && !wet && !aff[i]) continue; aff[i] = wet;
      if (k > 0) {
        const h = heat[i] || 0, rg = ring[i] || 0, src = bent(i, x, y, ry0, ry1);
        for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
          const o = src * 4 + j * 2 + q, X = 2 * x + q, Y = 2 * y + j;
          const v = (dV[o] * dens + h * SWELL.lift) * k;
          let on = v > (BAYER8[Y % 8][X % 8] + 0.5) / 64;
          if (rg > 0 && rg > (BAYER8[(Y + 4) % 8][(X + 4) % 8] + 0.5) / 64) on = !on;
          if (on) code |= ((dC[o] >= 0 ? dC[o] : MAT.star) + 1) << (5 * (j * 2 + q));
        }
      }
      if (code !== shown[i]) { shown[i] = code; if (x < lo) lo = x; hi = x; }
    }
    if (hi < 0) return;
    for (let x = lo; x <= hi; x++) {
      const code = shown[y * cols + x];
      for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
        const ix = (code >> (5 * (j * 2 + q))) & 31, col = ix ? pal32[ix - 1] ?? 0 : 0;
        for (let p = 0, at = j * hs * W + x * s + q * hs; p < hs; p++, at += W) for (let u = 0; u < hs; u++) rowPx[at + u] = col;
      }
    }
    ctx.putImageData(rowImg, 0, y * s, lo * s, 0, (hi - lo + 1) * s, s);
  }
  function glyphRow(y: number, x0: number, x1: number, ry0: number, ry1: number, part = false) {
    if (!ctx) return;
    const s = cell * dpr, W = cols * s, scn = mode === 'scene', heatC = scn ? MAT.star : -1, dens = density, shd = shade;
    let lo = Infinity, hi = -1;
    for (let x = x0; x < x1; x++) {
      const i = y * cols + x;
      const wet = heat[i] || ring[i] || (x > 0 && ring[i - 1]) || (x < cols - 1 && ring[i + 1]) ? 1 : 0; if (part && !wet && !aff[i]) continue; aff[i] = wet;
      const h = heat[i] || 0, rg = ring[i] || 0, src = bent(i, x, y, ry0, ry1);
      let b = bV[src] * dens;
      if (scn) { if (rg > 0 && rg > (BAYER8[y % 8][x % 8] + 0.5) / 64) b = 0.75 * (1 - Math.min(1, b)); }
      else if (rg < 0) b *= 1 + 0.7 * Math.max(-1, rg);
      const v = (b + (scn ? h * SWELL.lift : Math.max(h * SWELL.lift, rg * 0.9))) * bK[i];
      const level = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
      const cch = bCh[src];
      const gi = cch && v > 0.05 ? GI.get(cch)! : RAMPGI[level];
      let code = 0;
      if (gi !== BLANK) {
        const c = bC[src] >= 0 ? bC[src] : heatC;
        const set = scn ? (c >= 0 && c < palLen ? 1 + c : 0) : bHot[src] || rg > 0.5 ? 1 : shd ? 2 + level : 0;
        code = set * 32 + gi + 1;
      }
      if (code !== shown[i]) { shown[i] = code; if (x < lo) lo = x; hi = x; }
    }
    if (hi < 0) return;
    if (!rowImg || rowImg.width !== W || rowImg.height !== s) { rowImg = ctx.createImageData(W, s); rowPx = new Uint32Array(rowImg.data.buffer); }
    for (let x = lo; x <= hi; x++) {
      const code = shown[y * cols + x], t = code ? tileOf(code) : null;
      if (t) { for (let p = 0, at = x * s, k = 0; p < s; p++, at += W) for (let u = 0; u < s; u++) rowPx[at + u] = t[k++]; }
      else for (let p = 0, at = x * s; p < s; p++, at += W) rowPx.fill(0, at, at + s);
    }
    ctx.putImageData(rowImg, 0, y * s, lo * s, 0, (hi - lo + 1) * s, s);
  }
  // Paints rows [y0, y1): whole where they changed, and where the swell and rings are; their bend
  // looks up to WAVE.most rows away, so those rows are worked out too while either is up.
  function paintRows(y0: number, y1: number) {
    if (!ctx || !cols || !rows) return;
    const wet = rb[2] >= 0 || rbLast[2] >= 0 || hb[2] >= 0, ry0 = wet ? Math.max(0, y0 - WAVE.most) : y0, ry1 = wet ? Math.min(rows, y1 + WAVE.most) : y1;
    rebuild(ry0, ry1);
    const row = dithering() ? ditherRow : glyphRow;
    for (let y = y0; y < y1; y++) {
      if (rowDirty[y]) { rowDirty[y] = 0; row(y, 0, cols, ry0, ry1); }
      else if (y >= db[1] && y <= db[3]) row(y, Math.max(0, db[0]), Math.min(cols, db[2] + 1), ry0, ry1, true);
    }
    drawn = true;
  }
  // one frame of the field: the swell and rings move on, and the rows on screen are painted
  // the canvas's place is read once a frame and shared (0218): it was read three times
  function draw(r = canvas.getBoundingClientRect()) {
    if (!ctx || !cols || !rows) return;
    const now = performance.now(); const dt = last ? Math.min(100, now - last) : FRAME; last = now;
    stir(dt, r);
    const y0 = Math.max(0, Math.floor(-r.top / cell) - 1), y1 = Math.min(rows, Math.ceil((window.innerHeight - r.top) / cell) + 1);
    if (y1 > y0) paintRows(y0, y1);
  }
  // Every change asks for a paint here, and they share one (0214). With motion on, the loop paints
  // in its next frame. With it off, the rows on screen are painted in the next frame and the rest of
  // the field in idle time, a few rows at a go. Home's page-tall field used to be drawn whole four
  // times as the page started (a resize, the theme, the motion setting and the hero's measure): one
  // 449 ms task on a slow phone.
  let paintQueued = 0, repaint = false; let idleStop = () => {};
  function invalidate(all = false) {
    if (all) rowDirty.fill(1);
    if (!alive || !due) return;
    if (motion.on) { repaint = true; wake(); } else paint();
  }
  function paint() { if (!paintQueued && alive && due) paintQueued = requestAnimationFrame(() => { paintQueued = 0; draw(); fillLater(); }); }
  const stale = (y: number) => rowDirty[y] === 1 || rowK[y] !== kVersion || rowFrame[y] !== frame;
  function fillLater() {
    if (motion.on || !alive) return;
    idleStop();
    const run = (left: () => number) => {
      idleStop = () => {}; if (motion.on || !alive) return;
      let y = 0;
      do { while (y < rows && !stale(y)) y++; if (y >= rows) return; const e = Math.min(rows, y + 8); paintRows(y, e); y = e; } while (left() > 2);
      fillLater();
    };
    if (typeof requestIdleCallback === 'function') { const id = requestIdleCallback((d) => run(() => d.timeRemaining()), { timeout: 1000 }); idleStop = () => cancelIdleCallback(id); }
    else { const id = window.setTimeout(() => { const end = performance.now() + 8; run(() => end - performance.now()); }, 32); idleStop = () => clearTimeout(id); }
  }
  // Only a real change resizes the canvas, lays the picture out again or works the field out again
  // (0214): the observers, the fonts and the picture fire with nothing changed as often as not.
  let sizeKey = '', baseKey = '', placeKey = '', mtnKey = '';
  function resize() {
    if (!alive) return;
    const r = host.getBoundingClientRect();
    // Everything the field draws sits on whole CSS pixels (glyph pixels of `px`, dither squares of
    // half a cell), and the canvas is scaled up `pixelated`, so a 1× backing store looks the same
    // on a 2× or 3× screen at a ninth of the memory (Home's was 20 MB on a phone, 0207). `dpr`
    // stays a variable so the tiles and drawing keep their scale arithmetic.
    dpr = 1;
    const pageX = r.left + window.scrollX, pageY = r.top + window.scrollY; const g = cell;
    offX = ((pageX % g) + g) % g; offY = ((pageY % g) + g) % g;
    cols = Math.ceil((r.width + offX) / cell); rows = Math.ceil((r.height + offY) / cell);
    // measured when the width changes, so a phone's toolbar showing and hiding does not move the sky
    if ((skySpan === 'screen' || mode === 'scene') && window.innerWidth !== lastW) { screenRows = Math.max(1, window.innerHeight / cell); lastW = window.innerWidth; }
    if (mode === 'scene' && sceneSpan === 'box') screenRows = Math.max(1, r.height / cell); // a strip composes on its own height (0178)
    let changed = false;
    if (`${cols}x${rows}` !== sizeKey) { sizeKey = `${cols}x${rows}`; canvas.width = cols * cell * dpr; canvas.height = rows * cell * dpr; canvas.style.width = cols * cell + 'px'; canvas.style.height = rows * cell + 'px'; baseDirty = changed = true; }
    if (`${screenRows}` !== baseKey) { baseKey = `${screenRows}`; baseDirty = changed = true; }
    // the text inside moves with the box: measured again
    const place = `${r.width},${r.height},${offX},${offY}`;
    if (place !== placeKey) { placeKey = place; canvas.style.left = -offX + 'px'; canvas.style.top = -offY + 'px'; measuredFrame = -1; changed = true; }
    if (mode === 'scene' && mountainImg?.complete && mountainImg.naturalWidth) {
      const d = dithering() ? 2 : 1, key = `${cols * d},${screenRows * d}`;
      if (key !== mtnKey) { mtnKey = key; mtn = layoutMountains(mountainImg, cols * d, screenRows * d, shot); baseDirty = changed = true; }
    }
    if (heat.length !== cols * rows) heat = new Float32Array(cols * rows);
    ctx ??= canvas.getContext('2d');
    if (changed) invalidate();
  }
  // the observers, the fonts and the picture each asked for a full resize at load (six in 75 ms): one per frame now
  let resizeQueued = 0;
  const queueResize = () => { if (alive && !resizeQueued) resizeQueued = requestAnimationFrame(() => { resizeQueued = 0; resize(); }); };
  // the picture and the fonts can land after the field is gone (a quick page change); they find it gone (0207)
  let alive = true;
  // each field lays out its own copy of the picture (0173), so two scenes never share one
  let mountainImg: HTMLImageElement | null = null; let mtn: Mountains | null = null;
  onMount(() => {
    if (mode === 'scene' && mountains && shotHasRidge(shot)) { mountainImg = new Image(); mountainImg.onload = () => queueResize(); mountainImg.src = MOUNTAIN_REFS[mountains]; }
    const r0 = host.getBoundingClientRect(); visible = due = r0.bottom > -64 && r0.top < window.innerHeight + 64;
    // the body too: a change above the field moves it on the page grid without resizing it
    const ro = new ResizeObserver(queueResize); ro.observe(host); ro.observe(document.body); resize(); document.fonts?.ready.then(() => { queueResize(); onMeasure(); });
    const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (visible && !due) { due = true; invalidate(); } if (visible) wake(); }), { rootMargin: '64px' }); io.observe(host);
    const band = (host.closest('.band') as HTMLElement | null) ?? host;
    band.addEventListener('pointermove', onMove); band.addEventListener('pointerleave', onLeave); band.addEventListener('pointerdown', onDown); band.addEventListener('mousedown', onMouseDown); band.addEventListener('field-measure', onMeasure);
    return () => { band.removeEventListener('field-measure', onMeasure); alive = false; if (mountainImg) mountainImg.onload = null; cancelAnimationFrame(resizeQueued); cancelAnimationFrame(paintQueued); idleStop(); ro.disconnect(); io.disconnect(); band.removeEventListener('pointermove', onMove); band.removeEventListener('pointerleave', onLeave); band.removeEventListener('pointerdown', onDown); band.removeEventListener('mousedown', onMouseDown); };
  });
  // A theme change recolours the field; the scene lays its picture out again for the dither grid.
  // The first run is the theme the field is about to be drawn in, so it draws nothing (0214).
  let seenLight: boolean | null = null;
  $effect(() => { const l = theme.light; if (seenLight === null || l === seenLight) { seenLight = l; return; } seenLight = l; baseDirty = true; if (mode === 'scene' && ctx) resize(); invalidate(); });
  $effect(() => {
    if (!motion.on) {
      frame = 0; heat.fill(0); ring.fill(0); bursts = []; pointer = null; swell.s = 0; hb = none(); rb = none(); invalidate(true);
      // still, rows that scroll in before the idle fill reaches them are painted as they come
      const onScroll = () => paint(); addEventListener('scroll', onScroll, { passive: true });
      return () => removeEventListener('scroll', onScroll);
    }
    // One paint per display frame while the pointer's swell or a ring is live, so it keeps up with the
    // cursor (PX-66); otherwise only when the tick or the scroll moved (0206): a phone has no hover, and
    // repainting an unchanged field 60–120 times a second cost Home two thirds of a slow phone's main thread.
    // Between paints nothing runs (0207): the loop sleeps until the next tick, a scroll, the
    // pointer, or the field coming back on screen, and off screen or in a hidden tab it does not wake at all.
    const start = performance.now(); let id = 0, timer = 0, paintedFrame = -1, paintedTop = NaN;
    const live = () => swell.s > 0 || hb[2] >= 0 || (pointer !== null && performance.now() - movedAt < SWELL.rest) || bursts.length > 0 || rb[2] >= 0;
    const schedule = () => { if (!id && visible && !document.hidden) { clearTimeout(timer); timer = 0; id = requestAnimationFrame(loop); } };
    const loop = (now: number) => {
      id = 0; if (!visible || document.hidden) return;
      frame = Math.floor((now - start) / tick);
      const r = canvas.getBoundingClientRect(), top = r.top;
      if (frame !== paintedFrame || top !== paintedTop || remeasure || repaint || live()) { paintedFrame = frame; paintedTop = top; remeasure = repaint = false; draw(r); }
      else last = now;
      if (live()) schedule();
      else timer = window.setTimeout(schedule, tick - ((now - start) % tick) + 1);
    };
    wake = schedule;
    addEventListener('scroll', schedule, { passive: true }); document.addEventListener('visibilitychange', schedule);
    schedule();
    return () => { cancelAnimationFrame(id); clearTimeout(timer); removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule); wake = () => {}; };
  });
</script>
<div class="ascii" class:drawn bind:this={host} aria-hidden="true"><canvas bind:this={canvas}></canvas></div>
<style>.ascii{position:relative;width:100%;height:100%;overflow:hidden}.ascii:not(.drawn){background:repeating-conic-gradient(currentColor 0 25%,transparent 0 50%) 0 0/var(--cell-texture) var(--cell-texture);opacity:var(--texture-fallback-opacity)}canvas{position:absolute;left:0;top:0;display:block;image-rendering:pixelated}</style>
