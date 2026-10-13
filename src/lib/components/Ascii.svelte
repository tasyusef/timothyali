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
  let { mode = 'noise' as Mode, cell = CELL_TEXTURE, px = 2, seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad = 1, feather = 3, interactive = true, reach = 7, flip = false, shade = false, skySpan = 'box', skyRepeat = false, palette = 'scene' as Palette, lightAs = 'same' as 'same' | 'dither', mountains = '' as '' | 'a' | 'b', shot = 'hero' as Shot, hug = false, depth = 1, clear = '', sceneSpan = 'screen' as 'screen' | 'box', study = '' }: { mode?: Mode; cell?: number; px?: number; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; interactive?: boolean; reach?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; sceneSpan?: 'screen' | 'box'; study?: string } = $props();
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
  // a scene keeps its clicks apart from the hover: a ring there inverts the picture (0166, 0167)
  let ring = new Float32Array(0);
  let pointer: { x: number; y: number } | null = null;
  // every click rings out on its own, so the field can be clicked as fast as anyone likes (PX-64);
  // the oldest ring gives way past MAX_BURSTS
  const MAX_BURSTS = 24;
  let bursts: { x: number; y: number; t: number }[] = [];
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
  function measure() { const root = host.closest('.band') ?? document, r = canvas.getBoundingClientRect(); boxes = [...(avoid ? measureBoxes(root, avoid, r, cell, hug) : []), ...(clear ? measureBoxes(root, clear, r, cell, hug, 1) : [])]; }

  // --- pointer heat -------------------------------------------------------
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / cell, y: (e.clientY - r.top) / cell }; };
  function onMove(e: PointerEvent) { if (!interactive) return; pointer = local(e); if (!motion.on) cool(); }
  function onLeave() { pointer = null; if (!motion.on) cool(); }
  function onDown(e: PointerEvent) { if (!interactive) return; bursts.push({ ...local(e), t: 0 }); if (bursts.length > MAX_BURSTS) bursts.shift(); if (!motion.on) cool(); }
  // a quick second click on the bare field would select the nearest words; only there, not on text or controls
  function onMouseDown(e: MouseEvent) { if (interactive && e.detail > 1 && !(e.target as Element | null)?.closest('a, button, input, textarea, select, label, p, h1, h2, h3, h4, li, dt, dd, figure, img, span')) e.preventDefault(); }
  // heat and rings run on elapsed time, so they look the same at 60 or 120 frames a second
  function stir(dt: number) {
    if (!interactive || heat.length !== cols * rows) return;
    const keep = Math.pow(DECAY, dt / FRAME);
    for (let i = 0; i < heat.length; i++) heat[i] *= keep;
    if (pointer && pointer.x >= 0 && pointer.y >= 0 && pointer.x < cols && pointer.y < rows) {
      const r = reach; const x0 = Math.max(0, Math.floor(pointer.x - r)), x1 = Math.min(cols - 1, Math.ceil(pointer.x + r)), y0 = Math.max(0, Math.floor(pointer.y - r)), y1 = Math.min(rows - 1, Math.ceil(pointer.y + r));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const d = Math.hypot(x + 0.5 - pointer.x, y + 0.5 - pointer.y) / r; if (d < 1) { const g = (1 - d) * (1 - d); const i = y * cols + x; if (g > heat[i]) heat[i] = g; } }
    }
    const inv = mode === 'scene';
    if (inv) { if (ring.length !== heat.length) ring = new Float32Array(heat.length); else ring.fill(0); }
    if (bursts.length) {
      const R = reach * 2.2;
      const into = inv ? ring : heat, width = inv ? 2.5 : 1.5;
      for (const burst of bursts) {
        const rad = burst.t / 4; // ring grows a quarter cell per 33 ms
        if (rad > R + 1) continue;
        const x0 = Math.max(0, Math.floor(burst.x - R)), x1 = Math.min(cols - 1, Math.ceil(burst.x + R)), y0 = Math.max(0, Math.floor(burst.y - R)), y1 = Math.min(rows - 1, Math.ceil(burst.y + R));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const d = Math.hypot(x + 0.5 - burst.x, y + 0.5 - burst.y); const g = Math.max(0, 1 - Math.abs(d - rad) / width); const i = y * cols + x; if (g > into[i]) into[i] = g; }
        burst.t += dt / FRAME;
      }
      bursts = bursts.filter((b) => b.t / 4 <= R + 1);
    }
  }
  let cooling = 0;
  function cool() { if (cooling || motion.on) return; cooling = window.setInterval(() => { draw(); let m = 0; for (let i = 0; i < heat.length; i++) if (heat[i] > m) m = heat[i]; if (m < 0.03 && !pointer && !bursts.length) { clearInterval(cooling); cooling = 0; draw(true); } }, 16); }

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
  let baseDirty = true, measuredFrame = -1; let rowFrame = new Int32Array(0);
  let bV = new Float32Array(0), bC = new Int8Array(0), bHot = new Uint8Array(0), bK = new Float32Array(0); let bCh: (string | undefined)[] = [];
  let dV = new Float32Array(0), dC = new Int8Array(0); // dither: four pixels per cell
  let last = 0;
  // rows are worked out as they are painted, so a tick costs only the rows on screen
  function rebuild(y0: number, y1: number) {
    const n = cols * rows;
    if (baseDirty || bK.length !== n) {
      if (bK.length !== n) { bV = new Float32Array(n); bC = new Int8Array(n); bHot = new Uint8Array(n); bK = new Float32Array(n); bCh = new Array(n); dV = new Float32Array(n * 4); dC = new Int8Array(n * 4); rowFrame = new Int32Array(rows); }
      rowFrame.fill(-1);
      const cs = getComputedStyle(host); color = cs.color; accentColor = cs.getPropertyValue('--accent-text').trim(); paper = cs.getPropertyValue('--paper').trim(); buildSprites();
      baseDirty = false; measuredFrame = -1;
    }
    // the text the field steps around is measured once per tick, not once per frame
    if (measuredFrame !== frame) { measure(); measuredFrame = frame; rowFrame.fill(-1); }
    const dith = dithering();
    for (let y = y0; y < y1; y++) { if (rowFrame[y] === frame) continue; rowFrame[y] = frame; for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      bK[i] = knockout(x + 0.5, y + 0.5, boxes, pad, feather, hug, depth); // hugged knockouts are rounded too (0174)
      if (dith) {
        for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
          const X = 2 * x + q, Y = 2 * y + j, f = scene(X, Y, frame, cols * 2, screenRows * 2), o = i * 4 + j * 2 + q;
          // rock is drawn by its shadows, like ink: snow and lit faces stay paper; the planet keeps its colour; the sky is open paper;
          // the page texture below (`tex`) is drawn as it is, in the rock's colours
          const rock = !!f.o && !f.tex && (f.c === MAT.rock || f.c === MAT.shade || f.c === MAT.snow);
          dV[o] = f.c === MAT.star && !f.o ? 0 : rock ? 0.9 * (1 - f.v) * (f.fade ?? 1) : f.v;
          dC[o] = rock ? (f.v < 0.4 ? MAT.rock : MAT.shade) : f.o ? f.c : -1;
        }
      } else {
        const f = field(flip ? cols - 1 - x : x, y, frame);
        bV[i] = f.v; bC[i] = f.c ?? -1; bHot[i] = f.hot ? 1 : 0; bCh[i] = f.ch;
      }
    } }
  }
  function draw(full = false) {
    if (!ctx || !cols || !rows) return;
    const now = performance.now(); const dt = last ? Math.min(100, now - last) : FRAME; last = now;
    stir(dt);
    const s = cell * dpr;
    let y0 = 0, y1 = rows;
    if (!full) { const r = canvas.getBoundingClientRect(); y0 = Math.max(0, Math.floor(-r.top / cell) - 1); y1 = Math.min(rows, Math.ceil((window.innerHeight - r.top) / cell) + 1); if (y1 <= y0) return; }
    rebuild(y0, y1);
    ctx.clearRect(0, y0 * s, canvas.width, (y1 - y0) * s);
    // the pointer's heat shows in the cell's own colour, or the sky's where there is nothing (0165)
    const heatC = mode === 'scene' ? MAT.star : -1;
    // light mode, the scene as pixel dither (PX-65): each cell is four square pixels at half the
    // cell, lit if they beat the Bayer threshold, in their material's colour; no glyphs and no
    // stars, so it reads as a print on the paper
    if (dithering()) {
      const hs = s / 2, pal = PALETTES[palette].light;
      for (let y = y0; y < y1; y++) for (let x = 0; x < cols; x++) {
        const i = y * cols + x, k = bK[i]; if (k <= 0) continue;
        const h = heat[i] || 0, rg = ring[i] || 0;
        for (let j = 0; j < 2; j++) for (let q = 0; q < 2; q++) {
          const o = i * 4 + j * 2 + q, X = 2 * x + q, Y = 2 * y + j;
          const v = (dV[o] * density + h * 0.9) * k;
          let on = v > (BAYER8[Y % 8][X % 8] + 0.5) / 64;
          // a click's ring swaps pixel and paper as it passes, its edge dithered too
          if (rg > 0 && rg > (BAYER8[(Y + 4) % 8][(X + 4) % 8] + 0.5) / 64) on = !on;
          if (!on) continue;
          const c = dC[o] >= 0 ? dC[o] : heatC;
          ctx.fillStyle = pal[c]; ctx.fillRect(x * s + q * hs, y * s + j * hs, hs, hs);
        }
      }
      drawn = true; return;
    }
    for (let y = y0; y < y1; y++) for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const h = heat[i] || 0, rg = ring[i] || 0;
      let b = bV[i] * density;
      // a click's ring in a scene swaps full and empty as it passes: glyphs thin out, the sky fills in
      if (rg > 0 && rg > (BAYER8[y % 8][x % 8] + 0.5) / 64) b = 0.75 * (1 - Math.min(1, b));
      const v = (b + h * 0.9) * bK[i];
      const level = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
      const ch = bCh[i] && v > 0.05 ? bCh[i]! : RAMP[level];
      if (ch === ' ') continue;
      // a scene keeps its own colours under the pointer; the other fields light up in the accent as before
      const c = bC[i] >= 0 ? bC[i] : heatC;
      const set = mode === 'scene' ? paletteSprites[c] ?? sprites : bHot[i] || h > 0.5 ? accentSprites : shade ? shadeSprites[level] : sprites;
      const sp = set.get(ch); if (sp) ctx.drawImage(sp, x * s, y * s);
    }
    drawn = true;
  }
  function resize() {
    const r = host.getBoundingClientRect(); dpr = Math.max(1, Math.min(3, Math.round(window.devicePixelRatio || 1)));
    const pageX = r.left + window.scrollX, pageY = r.top + window.scrollY; const g = cell;
    offX = ((pageX % g) + g) % g; offY = ((pageY % g) + g) % g;
    cols = Math.ceil((r.width + offX) / cell); rows = Math.ceil((r.height + offY) / cell);
    // measured when the width changes, so a phone's toolbar showing and hiding does not move the sky
    if ((skySpan === 'screen' || mode === 'scene') && window.innerWidth !== lastW) { screenRows = Math.max(1, window.innerHeight / cell); lastW = window.innerWidth; }
    if (mode === 'scene' && sceneSpan === 'box') screenRows = Math.max(1, r.height / cell); // a strip composes on its own height (0178)
    if (mode === 'scene' && mountainImg?.complete && mountainImg.naturalWidth) { const d = dithering() ? 2 : 1; mtn = layoutMountains(mountainImg, cols * d, screenRows * d, shot); }
    if (heat.length !== cols * rows) heat = new Float32Array(cols * rows);
    canvas.width = cols * cell * dpr; canvas.height = rows * cell * dpr; canvas.style.width = cols * cell + 'px'; canvas.style.height = rows * cell + 'px';
    canvas.style.left = -offX + 'px'; canvas.style.top = -offY + 'px';
    ctx = canvas.getContext('2d'); baseDirty = true; if (due) draw(true);
  }
  // each field lays out its own copy of the picture (0173), so two scenes never share one
  let mountainImg: HTMLImageElement | null = null; let mtn: Mountains | null = null;
  onMount(() => {
    if (mode === 'scene' && mountains && shotHasRidge(shot)) { mountainImg = new Image(); mountainImg.onload = () => resize(); mountainImg.src = MOUNTAIN_REFS[mountains]; }
    const r0 = host.getBoundingClientRect(); visible = due = r0.bottom > -64 && r0.top < window.innerHeight + 64;
    const ro = new ResizeObserver(resize); ro.observe(host); ro.observe(document.body); resize(); document.fonts?.ready.then(resize);
    const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; if (visible && !due) { due = true; draw(true); } }), { rootMargin: '64px' }); io.observe(host);
    const band = (host.closest('.band') as HTMLElement | null) ?? host;
    band.addEventListener('pointermove', onMove); band.addEventListener('pointerleave', onLeave); band.addEventListener('pointerdown', onDown); band.addEventListener('mousedown', onMouseDown);
    return () => { ro.disconnect(); io.disconnect(); band.removeEventListener('pointermove', onMove); band.removeEventListener('pointerleave', onLeave); band.removeEventListener('pointerdown', onDown); band.removeEventListener('mousedown', onMouseDown); if (cooling) clearInterval(cooling); };
  });
  $effect(() => { void theme.light; if (!due) return; baseDirty = true; if (mode === 'scene' && ctx) resize(); else draw(true); }); // the scene re-lays its picture for the dither grid
  $effect(() => {
    if (!motion.on) { frame = 0; if (due) draw(true); return; }
    // one paint per display frame, so the pointer's heat keeps up with the cursor (PX-66)
    const start = performance.now(); let id = 0;
    const loop = (now: number) => { id = requestAnimationFrame(loop); if (!visible) return; frame = Math.floor((now - start) / tick); draw(); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  });
</script>
<div class="ascii" class:drawn bind:this={host} aria-hidden="true"><canvas bind:this={canvas}></canvas></div>
<style>.ascii{position:relative;width:100%;height:100%;overflow:hidden}.ascii:not(.drawn){background:repeating-conic-gradient(currentColor 0 25%,transparent 0 50%) 0 0/var(--cell-texture) var(--cell-texture);opacity:var(--texture-fallback-opacity)}canvas{position:absolute;left:0;top:0;display:block;image-rendering:pixelated}</style>
