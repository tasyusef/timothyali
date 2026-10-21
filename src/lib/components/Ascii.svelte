<script lang="ts">
  // ASCII field. Each texture cell holds a 5×7 bitmap glyph drawn with 2px pixels, chosen
  // from a density ramp by a scalar field. The canvas origin snaps to the page grid.
  // `avoid` knocks the field out around text.
  // The pointer heats nearby cells and leaves a cooling trail; a click sends a ring.
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
  let { mode = 'noise' as Mode, cell = CELL_TEXTURE, px = 2, seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad = 1, feather = 3, interactive = true, reach = 7, flip = false, shade = false, skySpan = 'box', skyRepeat = false, palette = 'scene' as Palette, lightAs = 'same' as 'same' | 'dither', mountains = '' as '' | 'a' | 'b', shot = 'hero' as Shot, hug = false, depth = 1, clear = '', clearFeather = undefined as number | undefined, sceneSpan = 'screen' as 'screen' | 'box', study = '' }: { mode?: Mode; cell?: number; px?: number; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; interactive?: boolean; reach?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; clearFeather?: number; sceneSpan?: 'screen' | 'box'; study?: string } = $props();
  // `shade` colours by weight instead: the heaviest glyph is the accent and every lighter
  // step sinks toward the ground, so a dense field reads as a few bright points on dark.
  // Each mode has one thing that draws in the accent: the rain's droplet, the scan's line,
  // a band's crest, the noise's peaks, the sky's densest cells. The pointer's heat lights
  // the same way, so touching a field is what makes it yellow.
  // `flip` mirrors the field left-to-right (the pattern, not the glyphs).
  // The sky's fall-off runs over the whole box by default; `skySpan: 'screen'` runs it over one
  // window height instead, so a page-tall sky keeps the hero's look in its first screen
  // (PX-63). Past that it thins to the quiet right-hand scatter, or with `skyRepeat` it eases
  // back and forth, one dense bank every two screens.
  const FRAME = 33; // ms between redraws while animating or cooling
  const DECAY = 0.94; // heat kept per redraw
  // A click is a drop in water (0211, from the sign-in field of Timothy's Beyond the Login,
  // ascii-touch.ts): a wave runs out from the point, a crest with a trough behind it, fading as
  // it spreads and bending the picture under it. Each ring draws its own speed, life, thickness
  // and shape from these ranges (0212); waves add, so rings that meet build up or cancel out.
  // Measured in CSS pixels and seconds, so an 8px scene and a 16px field ripple alike.
  const WAVE = { speed: [180, 380], life: [2, 3.6], thick: [14, 40], stretch: [1.5, 2.4], wobble: [0.05, 0.12], lobes: [3, 7], bend: 2.6, most: 4, cap: 24, out: 0.3 };
  const pick = ([a, b]: number[]) => a + Math.random() * (b - a);
  const SHAPES = ['circle', 'diamond', 'square', 'ellipse'] as const;
  type Burst = { x: number; y: number; t: number; speed: number; life: number; thick: number; shape: (typeof SHAPES)[number]; cos: number; sin: number; stretch: number; wobble: number; lobes: number; phase: number; span: number; die?: number };
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
  let heat = new Float32Array(0);
  // the water's height under each cell, from every click still running: crests above 0, troughs
  // below. A scene's crests invert the picture (0166, 0167); every other field's light in the accent
  let ring = new Float32Array(0);
  let pointer: { x: number; y: number } | null = null;
  // every press rings out on its own, no matter how fast (PX-64); past WAVE.cap running rings the
  // oldest fades out over WAVE.out seconds rather than vanishing (0212)
  let bursts: Burst[] = [];
  let sprites = new Map<string, HTMLCanvasElement>(); let accentSprites = new Map<string, HTMLCanvasElement>(); let shadeSprites: Map<string, HTMLCanvasElement>[] = []; let paletteSprites: Map<string, HTMLCanvasElement>[] = []; let spriteKey = ''; let paper = '';

  // a study's strip draws its own scene (0179); every other scene field draws a shot of the landing's world
  const scene = (x: number, y: number, t: number, c: number, S: number) => (study ? studyCell(study, x, y, t, c, S, seed) : sceneCell(x, y, t, c, S, seed, shot, mtn));
  type Cell = { v: number; ch?: string; hot?: boolean; c?: number; o?: boolean; fade?: number };
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

  // --- pointer heat -------------------------------------------------------
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / cell, y: (e.clientY - r.top) / cell }; };
  // with motion off the field stays still under the pointer too: no heat trail, no rings (0207)
  function onMove(e: PointerEvent) { if (!interactive || !motion.on) return; pointer = local(e); warm(); }
  function onLeave() { pointer = null; if (motion.on) warm(); }
  function onDown(e: PointerEvent) {
    if (!interactive || !motion.on) return;
    wake(); bursts.push(burstAt(local(e)));
    const running = bursts.filter((b) => b.die === undefined);
    if (running.length > WAVE.cap) running[0].die = (running[0].t * FRAME) / 1000;
  }
  // a quick second click on the bare field would select the nearest words; only there, not on text or controls
  function onMouseDown(e: MouseEvent) { if (interactive && e.detail > 1 && !(e.target as Element | null)?.closest('a, button, input, textarea, select, label, p, h1, h2, h3, h4, li, dt, dd, figure, img, span')) e.preventDefault(); }
  // The trail keeps the field painting every frame for HEAT_LIFE after the pointer last moved:
  // 0.94 a frame falls under HEAT_MIN, where a cell's heat is dropped, in about two seconds. A ring
  // keeps it painting while it runs, and for the frame after, which clears it. Past that, a frame
  // repaints only when the field's tick or the scroll position has changed (0206). (0214: the
  // window was a ring's whole life after any move, 4.1 s, and every frame repainted the screen.)
  const HEAT_LIFE = 2400, HEAT_MIN = 0.02;
  let warmUntil = 0;
  let wake = () => {}; // the motion loop's, while it runs
  const warm = () => { warmUntil = performance.now() + HEAT_LIFE; wake(); };
  // Text that changes between ticks (the hero's typed lines) asks for a measure now with a
  // `field-measure` event on the band, so its knockout does not wait up to a tick (0208).
  let remeasure = false;
  const onMeasure = () => { measuredFrame = -1; remeasure = true; invalidate(); };
  // What changed since the last paint, in cells: the heat's and the rings' boxes this frame and the
  // last (so cells that have just cooled or calmed are painted once more). A paint between ticks
  // repaints only these, not the screen (0214).
  type Rect = [number, number, number, number]; // x0, y0, x1, y1, inclusive; empty when x1 < x0
  const none = (): Rect => [Infinity, Infinity, -1, -1];
  const grow = (b: Rect, x0: number, y0: number, x1: number, y1: number) => { if (x0 < b[0]) b[0] = x0; if (y0 < b[1]) b[1] = y0; if (x1 > b[2]) b[2] = x1; if (y1 > b[3]) b[3] = y1; };
  let hb = none(), hbLast = none(), rb = none(), rbLast = none(), db = none();
  // heat and rings run on elapsed time, so they look the same at 60 or 120 frames a second
  function stir(dt: number) {
    hbLast = hb; rbLast = rb; hb = none(); rb = none(); db = none();
    if (!interactive || heat.length !== cols * rows) return;
    const keep = Math.pow(DECAY, dt / FRAME);
    for (let y = 0, i = 0; y < rows; y++) for (let x = 0; x < cols; x++, i++) {
      const h = heat[i]; if (!h) continue;
      if (h * keep < HEAT_MIN) heat[i] = 0; else { heat[i] = h * keep; grow(hb, x, y, x, y); }
    }
    if (pointer && pointer.x >= 0 && pointer.y >= 0 && pointer.x < cols && pointer.y < rows) {
      const r = reach; const x0 = Math.max(0, Math.floor(pointer.x - r)), x1 = Math.min(cols - 1, Math.ceil(pointer.x + r)), y0 = Math.max(0, Math.floor(pointer.y - r)), y1 = Math.min(rows - 1, Math.ceil(pointer.y + r));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const d = Math.hypot(x + 0.5 - pointer.x, y + 0.5 - pointer.y) / r; if (d < 1) { const g = (1 - d) * (1 - d); const i = y * cols + x; if (g > heat[i]) heat[i] = g; } }
      grow(hb, x0, y0, x1, y1);
    }
    if (ring.length !== heat.length) ring = new Float32Array(heat.length); else ring.fill(0);
    if (bursts.length) {
      // only the rows on screen and a few beyond (the bend looks up to WAVE.most cells away): a
      // page-tall field with two dozen rings would otherwise work out every cell for each of them
      const r = canvas.getBoundingClientRect();
      const vy0 = Math.max(0, Math.floor(-r.top / cell) - 6), vy1 = Math.min(rows - 1, Math.ceil((window.innerHeight - r.top) / cell) + 6);
      for (const b of bursts) {
        const age = (b.t * FRAME) / 1000, s = b.thick / cell, front = (b.speed * age) / cell;
        // fades with the square of its age, and over WAVE.out seconds once it is past the cap
        const fade = (1 - age / b.life) ** 2 * (b.die === undefined ? 1 : Math.max(0, 1 - (age - b.die) / WAVE.out));
        b.t += dt / FRAME;
        if (fade <= 0) continue;
        const R = (front + 3.5 * s) * b.span;
        const x0 = Math.max(0, Math.floor(b.x - R)), x1 = Math.min(cols - 1, Math.ceil(b.x + R)), y0 = Math.max(vy0, Math.floor(b.y - R)), y1 = Math.min(vy1, Math.ceil(b.y + R));
        if (x1 >= x0 && y1 >= y0) grow(rb, Math.max(0, x0 - 1), Math.max(0, y0 - 1), Math.min(cols - 1, x1 + 1), Math.min(rows - 1, y1 + 1)); // a cell beside the water bends too
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          // a crest ahead and a trough behind (the slope of a bell curve), 1 at the crest's top
          const off = (shapeDist(b, x + 0.5 - b.x, y + 0.5 - b.y) - front) / s; if (off > 3.5 || off < -3.5) continue;
          ring[y * cols + x] += fade * off * Math.exp(0.5 - (off * off) / 2);
        }
      }
      bursts = bursts.filter((b) => { const age = (b.t * FRAME) / 1000; return age < b.life && (b.die === undefined || age - b.die < WAVE.out); });
    }
    for (const r of [hb, hbLast, rb, rbLast]) if (r[2] >= 0) grow(db, r[0], r[1], r[2], r[3]);
  }

  // Where a cell looks through the water: the field up to four cells along the water's slope, as
  // a ripple bends what lies under it. Kept to the rows being drawn, which are the ones worked out.
  function bent(i: number, x: number, y: number, y0: number, y1: number) {
    if (!ring[i] && !(x > 0 && ring[i - 1]) && !(x < cols - 1 && ring[i + 1])) return i;
    const gx = (x < cols - 1 ? ring[i + 1] : ring[i]) - (x > 0 ? ring[i - 1] : ring[i]);
    const gy = (y < rows - 1 ? ring[i + cols] : ring[i]) - (y > 0 ? ring[i - cols] : ring[i]);
    const ox = Math.max(-WAVE.most, Math.min(WAVE.most, Math.round(gx * WAVE.bend))), oy = Math.max(-WAVE.most, Math.min(WAVE.most, Math.round(gy * WAVE.bend)));
    if (!ox && !oy) return i;
    return Math.max(y0, Math.min(y1 - 1, y + oy)) * cols + Math.max(0, Math.min(cols - 1, x + ox));
  }

  // --- glyph sprites: each ramp glyph rendered once per colour/dpr ---------------
  function spriteSet(fill: string) {
    const out = new Map<string, HTMLCanvasElement>();
    const p = px * dpr, s = cell * dpr; const ox = Math.floor((cell * dpr - 5 * p) / 2 / p) * p, oy = Math.floor((cell * dpr - 7 * p) / 2 / p) * p;
    for (const ch of Object.keys(GLYPHS)) {
      const c = document.createElement('canvas'); c.width = s; c.height = s; const g = c.getContext('2d'); if (!g) continue; g.fillStyle = fill;
      const bits = GLYPHS[ch]; for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (bits[r] & (16 >> k)) g.fillRect(ox + k * p, oy + r * p, p, p);
      out.set(ch, c);
    }
    return out;
  }
  // Canvas fills want a resolved colour; let CSS do the mixing. The probe is made on
  // first use: this component is prerendered, and there is no document then.
  let probe: HTMLSpanElement | null = null;
  function mix(a: string, b: string, t: number): string {
    probe ??= document.createElement('span');
    probe.style.color = `color-mix(in oklab, ${a} ${Math.round(t * 100)}%, ${b})`;
    host.appendChild(probe); const out = getComputedStyle(probe).color; probe.remove(); return out;
  }
  function buildSprites() {
    const key = color + '|' + accentColor + '|' + paper + '|' + shade + '|' + dpr + '|' + mode + palette + lightAs + theme.light; if (key === spriteKey) return; spriteKey = key;
    paletteSprites = mode === 'scene' ? PALETTES[palette][theme.light ? 'light' : 'dark'].map(spriteSet) : [];
    sprites = spriteSet(color); accentSprites = accentColor ? spriteSet(accentColor) : sprites;
    // one set per ramp step: near-ground at the light end, the field colour just under the top, the accent on top
    shadeSprites = shade ? RAMP.split('').map((_, i) => i === RAMP.length - 1 ? accentSprites : spriteSet(mix(color, paper, 0.08 + (0.92 * i) / (RAMP.length - 1)))) : [];
  }
  // --- drawing --------------------------------------------------------------
  // The field itself only changes once per `tick` (or on a resize or theme change), so it is
  // worked out then and kept per cell (PX-66); each animation frame only adds the pointer's heat
  // and repaints the rows on screen. Off-screen rows keep their last paint until they scroll in.
  // A row is painted again only when something in it changed (0214): its values at this tick, its
  // knockout, or the heat and rings passing over it (`db`); most of a scene is still from one tick
  // to the next, and every paint used to repaint the screen.
  let baseDirty = true, measuredFrame = -1; let rowFrame = new Int32Array(0); let rowDirty = new Uint8Array(0);
  // the knockout only changes when the boxes it steps around do: kept per row and redone when the
  // measured boxes move (0207), where before every cell on screen was worked out again each tick
  let boxesKey = '', kVersion = 0; let rowK = new Int32Array(0);
  let bV = new Float32Array(0), bC = new Int8Array(0), bHot = new Uint8Array(0), bK = new Float32Array(0); let bCh: (string | undefined)[] = [];
  let dV = new Float32Array(0), dC = new Int8Array(0); // dither: four pixels per cell
  let last = 0;
  // rows are worked out as they are painted, so a tick costs only the rows on screen
  function rebuild(y0: number, y1: number) {
    const n = cols * rows;
    if (baseDirty || bK.length !== n) {
      if (bK.length !== n) { bV = new Float32Array(n); bC = new Int8Array(n); bHot = new Uint8Array(n); bK = new Float32Array(n); bCh = new Array(n); dV = new Float32Array(n * 4); dC = new Int8Array(n * 4); rowFrame = new Int32Array(rows); rowK = new Int32Array(rows); rowDirty = new Uint8Array(rows); }
      rowFrame.fill(-1); rowDirty.fill(1); kVersion++;
      const cs = getComputedStyle(host); color = cs.color; accentColor = cs.getPropertyValue('--accent-text').trim(); paper = cs.getPropertyValue('--paper').trim(); buildSprites(); pal32 = null;
      baseDirty = false; measuredFrame = -1;
    }
    // the text the field steps around is measured once per tick, not once per frame
    if (measuredFrame !== frame) {
      measure(); measuredFrame = frame;
      const key = boxes.map((b) => `${b.x0},${b.y0},${b.x1},${b.y1},${b.depth},${b.feather}`).join(';');
      if (key !== boxesKey) { boxesKey = key; kVersion++; }
    }
    const dith = dithering(), P = pad, F = feather, H = hug, D = depth;
    for (let y = y0; y < y1; y++) {
      if (rowK[y] !== kVersion) { rowK[y] = kVersion; for (let x = 0; x < cols; x++) { const i = y * cols + x, k = Math.fround(knockout(x + 0.5, y + 0.5, boxes, P, F, H, D)); if (k !== bK[i]) { bK[i] = k; rowDirty[y] = 1; } } } // hugged knockouts are rounded too (0174)
      if (rowFrame[y] === frame) continue; rowFrame[y] = frame; let moved = 0;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (dith) {
          for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
            const X = 2 * x + q, Y = 2 * y + j, f = scene(X, Y, frame, cols * 2, screenRows * 2), o = i * 4 + j * 2 + q;
            // rock is drawn by its shadows, like ink: snow and lit faces stay paper; the planet keeps its colour; the sky is open paper;
            // the page texture below (`tex`) is drawn as it is, in the rock's colours
            const rock = !!f.o && !f.tex && (f.c === MAT.rock || f.c === MAT.shade || f.c === MAT.snow);
            const v = Math.fround(f.c === MAT.star && !f.o ? 0 : rock ? 0.9 * (1 - f.v) * (f.fade ?? 1) : f.v);
            const c = rock ? (f.v < 0.4 ? MAT.rock : MAT.shade) : f.o ? f.c! : -1;
            if (v !== dV[o] || c !== dC[o]) { dV[o] = v; dC[o] = c; moved = 1; }
          }
        } else {
          const f = field(flip ? cols - 1 - x : x, y, frame), v = Math.fround(f.v), c = f.c ?? -1, hot = f.hot ? 1 : 0;
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
  function ditherRow(y: number, x0: number, x1: number, ry0: number, ry1: number) {
    if (!ctx) return;
    const s = cell * dpr, hs = s / 2, W = cols * s;
    if (!rowImg || rowImg.width !== W || rowImg.height !== s) { rowImg = ctx.createImageData(W, s); rowPx = new Uint32Array(rowImg.data.buffer); }
    pal32 ??= palette32(PALETTES[palette].light);
    for (let x = x0; x < x1; x++) {
      const i = y * cols + x, k = bK[i];
      if (k <= 0) { for (let p = 0; p < s; p++) rowPx.fill(0, p * W + x * s, p * W + x * s + s); continue; }
      const h = heat[i] || 0, rg = ring[i] || 0, src = bent(i, x, y, ry0, ry1);
      for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
        const o = src * 4 + j * 2 + q, X = 2 * x + q, Y = 2 * y + j;
        const v = (dV[o] * density + h * 0.9) * k;
        let on = v > (BAYER8[Y % 8][X % 8] + 0.5) / 64;
        // a click's ring swaps pixel and paper as it passes, its edge dithered too
        if (rg > 0 && rg > (BAYER8[(Y + 4) % 8][(X + 4) % 8] + 0.5) / 64) on = !on;
        // the pointer's heat shows in the cell's own colour, or the sky's where there is nothing (0165)
        const col = on ? pal32[dC[o] >= 0 ? dC[o] : MAT.star] ?? 0 : 0;
        for (let p = 0, at = j * hs * W + x * s + q * hs; p < hs; p++, at += W) for (let u = 0; u < hs; u++) rowPx[at + u] = col;
      }
    }
    ctx.putImageData(rowImg, 0, y * s, x0 * s, 0, (x1 - x0) * s, s);
  }
  function glyphRow(y: number, x0: number, x1: number, ry0: number, ry1: number) {
    if (!ctx) return;
    const s = cell * dpr, heatC = mode === 'scene' ? MAT.star : -1;
    ctx.clearRect(x0 * s, y * s, (x1 - x0) * s, s);
    for (let x = x0; x < x1; x++) {
      const i = y * cols + x;
      const h = heat[i] || 0, rg = ring[i] || 0, src = bent(i, x, y, ry0, ry1);
      let b = bV[src] * density;
      // a crest in a scene swaps full and empty as it passes: glyphs thin out, the sky fills in;
      // elsewhere a crest lifts the field and a trough sinks it
      if (mode === 'scene') { if (rg > 0 && rg > (BAYER8[y % 8][x % 8] + 0.5) / 64) b = 0.75 * (1 - Math.min(1, b)); }
      else if (rg < 0) b *= 1 + 0.7 * Math.max(-1, rg);
      const v = (b + (mode === 'scene' ? h : Math.max(h, rg)) * 0.9) * bK[i];
      const level = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
      const ch = bCh[src] && v > 0.05 ? bCh[src]! : RAMP[level];
      if (ch === ' ') continue;
      // a scene keeps its own colours under the pointer and its ripple; the other fields light up in the accent
      const c = bC[src] >= 0 ? bC[src] : heatC;
      const set = mode === 'scene' ? paletteSprites[c] ?? sprites : bHot[src] || h > 0.5 || rg > 0.5 ? accentSprites : shade ? shadeSprites[level] : sprites;
      const sp = set.get(ch); if (sp) ctx.drawImage(sp, x * s, y * s);
    }
  }
  // Paints rows [y0, y1): whole where they changed, and where the heat and rings are; the water's
  // bend looks up to WAVE.most rows away, so those rows are worked out too while a ring runs.
  function paintRows(y0: number, y1: number) {
    if (!ctx || !cols || !rows) return;
    const wet = rb[2] >= 0 || rbLast[2] >= 0, ry0 = wet ? Math.max(0, y0 - WAVE.most) : y0, ry1 = wet ? Math.min(rows, y1 + WAVE.most) : y1;
    rebuild(ry0, ry1);
    const row = dithering() ? ditherRow : glyphRow;
    for (let y = y0; y < y1; y++) {
      if (rowDirty[y]) { rowDirty[y] = 0; row(y, 0, cols, ry0, ry1); }
      else if (y >= db[1] && y <= db[3]) row(y, Math.max(0, db[0]), Math.min(cols, db[2] + 1), ry0, ry1);
    }
    drawn = true;
  }
  // one frame of the field: the heat and rings move on, and the rows on screen are painted
  function draw() {
    if (!ctx || !cols || !rows) return;
    const now = performance.now(); const dt = last ? Math.min(100, now - last) : FRAME; last = now;
    stir(dt);
    const r = canvas.getBoundingClientRect();
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
    // stays a variable so the sprites and drawing keep their scale arithmetic.
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
      frame = 0; heat.fill(0); ring.fill(0); bursts = []; pointer = null; hb = none(); rb = none(); invalidate(true);
      // still, rows that scroll in before the idle fill reaches them are painted as they come
      const onScroll = () => paint(); addEventListener('scroll', onScroll, { passive: true });
      return () => removeEventListener('scroll', onScroll);
    }
    // One paint per display frame while the pointer's heat or a ring is live, so it keeps up with the
    // cursor (PX-66); otherwise only when the tick or the scroll moved (0206): a phone has no hover, and
    // repainting an unchanged field 60–120 times a second cost Home two thirds of a slow phone's main thread.
    // Between paints nothing runs (0207): the loop sleeps until the next tick, a scroll, the
    // pointer, or the field coming back on screen, and off screen or in a hidden tab it does not wake at all.
    const start = performance.now(); let id = 0, timer = 0, paintedFrame = -1, paintedTop = NaN;
    const live = () => performance.now() < warmUntil || bursts.length > 0 || rb[2] >= 0;
    const schedule = () => { if (!id && visible && !document.hidden) { clearTimeout(timer); timer = 0; id = requestAnimationFrame(loop); } };
    const loop = (now: number) => {
      id = 0; if (!visible || document.hidden) return;
      frame = Math.floor((now - start) / tick);
      const top = canvas.getBoundingClientRect().top;
      if (frame !== paintedFrame || top !== paintedTop || remeasure || repaint || live()) { paintedFrame = frame; paintedTop = top; remeasure = repaint = false; draw(); }
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
