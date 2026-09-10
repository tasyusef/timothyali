<script lang="ts">
  // ASCII field. Each texture cell holds a 5×7 bitmap glyph drawn with 2px pixels, chosen
  // from a density ramp by a scalar field. The canvas origin snaps to the page grid.
  // `avoid` knocks the field out around text.
  // The pointer heats nearby cells and leaves a cooling trail; a click sends a ring.
  // While motion is on the canvas redraws at ~30fps for the interaction, but the
  // ambient field only advances one step every `tick` ms, so it keeps its cadence.
  import { onMount } from 'svelte';
  import { motion, theme } from '$lib/motion.svelte';
  import { fbm, hash2 } from '$lib/prng';
  import { GLYPHS, RAMP } from '$lib/glyphs';
  import { knockout, measureBoxes, type Box } from '$lib/knockout';
  import { CELL_TEXTURE, TICK_SLOW } from '$lib/tokens';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands';
  let { mode = 'noise' as Mode, cell = CELL_TEXTURE, px = 2, seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad = 1, feather = 3, interactive = true, reach = 7, flip = false }: { mode?: Mode; cell?: number; px?: number; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; interactive?: boolean; reach?: number; flip?: boolean } = $props();
  // `flip` mirrors the field left-to-right (the pattern, not the glyphs).
  const FRAME = 33; // ms between redraws while animating or cooling
  const DECAY = 0.94; // heat kept per redraw
  let canvas: HTMLCanvasElement; let host: HTMLElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let cols = 0, rows = 0, dpr = 1, frame = 0, color = '', offX = 0, offY = 0;
  let drawn = $state(false);
  let visible = true;
  let boxes: Box[] = [];
  let heat = new Float32Array(0);
  let pointer: { x: number; y: number } | null = null;
  let burst: { x: number; y: number; t: number } | null = null;
  let sprites = new Map<string, HTMLCanvasElement>(); let spriteKey = '';

  const field = (x: number, y: number, t: number): { v: number; ch?: string } => {
    if (mode === 'noise') return { v: fbm(x / 6 + t * 0.04, y / 4 - t * 0.015, seed, 2) };
    if (mode === 'sky') { const d = (x / cols) * 0.55 + (1 - y / rows) * 0.6 - 0.28; return { v: Math.min(1, Math.max(0, d + (fbm(x / 6 + t * 0.03, y / 5, seed) - 0.5) * 0.45)) }; }
    if (mode === 'bands') { const b = Math.sin((y - t * 0.3) / 1.6 + fbm(x / 7, y / 16, seed) * 4) * 0.5 + 0.5; return { v: b * (0.2 + 0.8 * (1 - x / cols)) }; }
    if (mode === 'fall') { const sp = 1 + Math.floor(hash2(x, 0, seed) * 3); const head = (t * sp * 0.5 + hash2(x, 1, seed) * rows * 3) % (rows * 1.8); const d = head - y; if (d > 0 && d < 1) return { v: 1, ch: '0' }; return { v: d > 0 && d < rows * 0.6 ? 1 - d / (rows * 0.6) : 0 }; }
    if (mode === 'scan') { const line = Math.abs(((t * 0.7) % (rows + 6)) - 3 - y); return { v: Math.max(0, 1 - line / 3) * 0.8 + fbm(x / 8, y / 8, seed) * 0.25 }; }
    return { v: hash2(x, y, seed + Math.floor(t / 6)) > 0.93 ? fbm(x, y, seed) : 0 };
  };
  function measure() { boxes = avoid ? measureBoxes(host.closest('.band') ?? document, avoid, canvas.getBoundingClientRect(), cell) : []; }

  // --- pointer heat -------------------------------------------------------
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / cell, y: (e.clientY - r.top) / cell }; };
  function onMove(e: PointerEvent) { if (!interactive) return; pointer = local(e); if (!motion.on) cool(); }
  function onLeave() { pointer = null; if (!motion.on) cool(); }
  function onDown(e: PointerEvent) { if (!interactive) return; burst = { ...local(e), t: 0 }; if (!motion.on) cool(); }
  function stir() {
    if (!interactive || heat.length !== cols * rows) return;
    for (let i = 0; i < heat.length; i++) heat[i] *= DECAY;
    if (pointer && pointer.x >= 0 && pointer.y >= 0 && pointer.x < cols && pointer.y < rows) {
      const r = reach; const x0 = Math.max(0, Math.floor(pointer.x - r)), x1 = Math.min(cols - 1, Math.ceil(pointer.x + r)), y0 = Math.max(0, Math.floor(pointer.y - r)), y1 = Math.min(rows - 1, Math.ceil(pointer.y + r));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const d = Math.hypot(x + 0.5 - pointer.x, y + 0.5 - pointer.y) / r; if (d < 1) { const g = (1 - d) * (1 - d); const i = y * cols + x; if (g > heat[i]) heat[i] = g; } }
    }
    if (burst) {
      const R = reach * 2.2; const ring = burst.t / 4; // ring grows a quarter cell per redraw
      if (ring > R + 1) burst = null; else {
        const x0 = Math.max(0, Math.floor(burst.x - R)), x1 = Math.min(cols - 1, Math.ceil(burst.x + R)), y0 = Math.max(0, Math.floor(burst.y - R)), y1 = Math.min(rows - 1, Math.ceil(burst.y + R));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const d = Math.hypot(x + 0.5 - burst.x, y + 0.5 - burst.y); const g = Math.max(0, 1 - Math.abs(d - ring) / 1.5); const i = y * cols + x; if (g > heat[i]) heat[i] = g; }
        burst.t++;
      }
    }
  }
  let cooling = 0;
  function cool() { if (cooling || motion.on) return; cooling = window.setInterval(() => { draw(); let m = 0; for (let i = 0; i < heat.length; i++) if (heat[i] > m) m = heat[i]; if (m < 0.03 && !pointer && !burst) { clearInterval(cooling); cooling = 0; } }, FRAME); }

  // --- glyph sprites: each ramp glyph rendered once per colour/dpr ---------------
  function buildSprites() {
    const key = color + '|' + dpr; if (key === spriteKey) return; spriteKey = key; sprites = new Map();
    const p = px * dpr, s = cell * dpr; const ox = Math.floor((cell * dpr - 5 * p) / 2 / p) * p, oy = Math.floor((cell * dpr - 7 * p) / 2 / p) * p;
    for (const ch of Object.keys(GLYPHS)) {
      const c = document.createElement('canvas'); c.width = s; c.height = s; const g = c.getContext('2d'); if (!g) continue; g.fillStyle = color;
      const bits = GLYPHS[ch]; for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (bits[r] & (16 >> k)) g.fillRect(ox + k * p, oy + r * p, p, p);
      sprites.set(ch, c);
    }
  }
  function draw() {
    if (!ctx || !cols || !rows) return;
    measure(); stir();
    color = getComputedStyle(host).color; buildSprites();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = cell * dpr;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const f = field(flip ? cols - 1 - x : x, y, frame);
      const v = (f.v * density + (heat[y * cols + x] || 0) * 0.9) * knockout(x + 0.5, y + 0.5, boxes, pad, feather);
      const ch = f.ch && v > 0.05 ? f.ch : RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
      if (ch !== ' ') { const sp = sprites.get(ch); if (sp) ctx.drawImage(sp, x * s, y * s); }
    }
    drawn = true;
  }
  function resize() {
    const r = host.getBoundingClientRect(); dpr = Math.max(1, Math.min(3, Math.round(window.devicePixelRatio || 1)));
    const pageX = r.left + window.scrollX, pageY = r.top + window.scrollY; const g = cell;
    offX = ((pageX % g) + g) % g; offY = ((pageY % g) + g) % g;
    cols = Math.ceil((r.width + offX) / cell); rows = Math.ceil((r.height + offY) / cell);
    if (heat.length !== cols * rows) heat = new Float32Array(cols * rows);
    canvas.width = cols * cell * dpr; canvas.height = rows * cell * dpr; canvas.style.width = cols * cell + 'px'; canvas.style.height = rows * cell + 'px';
    canvas.style.left = -offX + 'px'; canvas.style.top = -offY + 'px';
    ctx = canvas.getContext('2d'); draw();
  }
  onMount(() => {
    const ro = new ResizeObserver(resize); ro.observe(host); ro.observe(document.body); resize(); document.fonts?.ready.then(resize);
    const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; }), { rootMargin: '64px' }); io.observe(host);
    const band = (host.closest('.band') as HTMLElement | null) ?? host;
    band.addEventListener('pointermove', onMove); band.addEventListener('pointerleave', onLeave); band.addEventListener('pointerdown', onDown);
    return () => { ro.disconnect(); io.disconnect(); band.removeEventListener('pointermove', onMove); band.removeEventListener('pointerleave', onLeave); band.removeEventListener('pointerdown', onDown); if (cooling) clearInterval(cooling); };
  });
  $effect(() => { void theme.light; draw(); });
  $effect(() => {
    if (!motion.on) { frame = 0; draw(); return; }
    const start = performance.now();
    const id = setInterval(() => { if (!visible) return; frame = Math.floor((performance.now() - start) / tick); draw(); }, FRAME);
    return () => clearInterval(id);
  });
</script>
<div class="ascii" class:drawn bind:this={host} aria-hidden="true"><canvas bind:this={canvas}></canvas></div>
<style>.ascii{position:relative;width:100%;height:100%;overflow:hidden}.ascii:not(.drawn){background:repeating-conic-gradient(currentColor 0 25%,transparent 0 50%) 0 0/var(--cell-texture) var(--cell-texture);opacity:var(--texture-fallback-opacity)}canvas{position:absolute;left:0;top:0;display:block;image-rendering:pixelated}</style>
