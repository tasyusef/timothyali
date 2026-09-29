// Home's stages (PX-54). Helpers they share: scroll progress through a pinned
// section, the scanline visibility used everywhere (the ground showing through 4px lines),
// and text drawn in the ASCII field's own glyphs, so a word can turn into the texture and
// back.
import { GLYPHS, RAMP } from '$lib/glyphs';
import { CELL_TEXTURE } from '$lib/tokens';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** 0 before `a`, 1 after `b`, linear between */
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** the same, eased at both ends */
export const smooth = (p: number, a: number, b: number) => { const t = span(p, a, b); return t * t * (3 - 2 * t); };
/** scanline thickness for a visibility 0…1: 1 is clear, 0 is 4px of every 4px gone; half-pixel steps */
export const lines = (vis: number) => Math.round((1 - clamp01(vis)) * 8) / 2;
/** 0 when a pinned section's top reaches the top of the window, 1 when its bottom reaches the bottom */
export function pinned(el: HTMLElement) {
  const r = el.getBoundingClientRect(); const run = r.height - window.innerHeight;
  return run > 0 ? clamp01(-r.top / run) : 0;
}
/** calls `fn` once per frame while the page scrolls or resizes */
export function onScroll(fn: () => void) {
  let q = 0; const on = () => { if (!q) q = requestAnimationFrame(() => { q = 0; fn(); }); };
  window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on); fn();
  return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(q); };
}
/** a stable 0…1 per cell */
export const hash = (x: number, y: number, s = 1) => { let h = (x * 374761393 + y * 668265263 + s * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ---- text as glyphs --------------------------------------------------------------------
export type Mask = { x0: number; y0: number; cols: number; rows: number; cov: Float32Array };
const cache = new Map<string, Mask>();
/**
 * How much of each texture cell the text of `el` covers, measured where the page draws it.
 * `origin` is the element the glyph canvas is laid on; cells are counted from its corner.
 */
export function textMask(el: Element, origin: Element, cell = CELL_TEXTURE): Mask | null {
  const text = el.textContent ?? ''; if (!text.trim()) return null;
  const range = document.createRange(); range.selectNodeContents(el);
  const rects = [...range.getClientRects()].filter((r) => r.width > 0);
  if (!rects.length) return null;
  const o = origin.getBoundingClientRect(); const cs = getComputedStyle(el);
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const L = Math.min(...rects.map((r) => r.left)) - o.left, T = Math.min(...rects.map((r) => r.top)) - o.top;
  const R = Math.max(...rects.map((r) => r.right)) - o.left, B = Math.max(...rects.map((r) => r.bottom)) - o.top;
  const x0 = Math.floor(L / cell), y0 = Math.floor(T / cell), cols = Math.ceil(R / cell) - x0, rows = Math.ceil(B / cell) - y0;
  const key = [text, font, x0, y0, cols, rows, Math.round(L), Math.round(T)].join('|');
  const hit = cache.get(key); if (hit) return hit;
  const c = document.createElement('canvas'); c.width = cols * cell; c.height = rows * cell;
  const g = c.getContext('2d', { willReadFrequently: true }); if (!g) return null;
  g.font = font; g.textBaseline = 'alphabetic'; g.fillStyle = '#000';
  // one line per client rect (the text may wrap); each line's words in order
  const m = g.measureText('Hg'); const ascent = m.fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
  if (rects.length === 1) g.fillText(text, rects[0].left - o.left - x0 * cell, rects[0].top - o.top - y0 * cell + ascent);
  else {
    // split the text into the lines the browser made, by walking the characters' rects
    const node = [...el.childNodes].find((n) => n.nodeType === 3) as Text | undefined;
    if (!node) g.fillText(text, rects[0].left - o.left - x0 * cell, rects[0].top - o.top - y0 * cell + ascent);
    else {
      let line = '', top = -1, left = 0;
      const flush = () => { if (line.trim()) g.fillText(line, left - o.left - x0 * cell, top - o.top - y0 * cell + ascent); line = ''; };
      for (let i = 0; i < node.length; i++) {
        const r = document.createRange(); r.setStart(node, i); r.setEnd(node, i + 1); const b = r.getBoundingClientRect();
        if (b.width === 0 && node.data[i] === ' ') { line += ' '; continue; }
        if (Math.abs(b.top - top) > 2) { flush(); top = b.top; left = b.left; }
        line += node.data[i];
      }
      flush();
    }
  }
  const px = g.getImageData(0, 0, c.width, c.height).data; const cov = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    let s = 0; for (let j = 0; j < cell; j++) { const row = ((y * cell + j) * c.width + x * cell) * 4; for (let i = 0; i < cell; i++) s += px[row + i * 4 + 3]; }
    cov[y * cols + x] = s / (cell * cell * 255);
  }
  const out = { x0, y0, cols, rows, cov }; cache.set(key, out); return out;
}

// ---- glyph sprites ------------------------------------------------------------------------
// The field's glyphs (5×7 bits drawn with 2px pixels in a 16px cell), one set per colour.
const sets = new Map<string, Map<string, HTMLCanvasElement>>();
export function sprites(fill: string, dpr: number, cell = CELL_TEXTURE, px = 2) {
  const key = fill + '|' + dpr; const hit = sets.get(key); if (hit) return hit;
  const out = new Map<string, HTMLCanvasElement>(); const p = px * dpr, s = cell * dpr;
  const ox = Math.floor((s - 5 * p) / 2 / p) * p, oy = Math.floor((s - 7 * p) / 2 / p) * p;
  for (const ch of Object.keys(GLYPHS)) {
    const c = document.createElement('canvas'); c.width = s; c.height = s; const g = c.getContext('2d'); if (!g) continue; g.fillStyle = fill;
    const bits = GLYPHS[ch]; for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (bits[r] & (16 >> k)) g.fillRect(ox + k * p, oy + r * p, p, p);
    out.set(ch, c);
  }
  sets.set(key, out); return out;
}
export { RAMP };
/** any CSS colour (tokens included) as the computed rgb() the canvas can mix */
export function resolve(host: Element, value: string) {
  const s = document.createElement('span'); s.style.color = value; host.appendChild(s);
  const c = getComputedStyle(s).color; s.remove(); return c;
}
/** mix two computed rgb() colours in sRGB */
export function mix(a: string, b: string, t: number) {
  const pa = (a.match(/[\d.]+/g) ?? ['0', '0', '0']).map(Number), pb = (b.match(/[\d.]+/g) ?? ['0', '0', '0']).map(Number);
  return `rgb(${[0, 1, 2].map((i) => Math.round(pa[i] * t + pb[i] * (1 - t))).join(',')})`;
}
/** one colour per ramp step: the lightest step sinks toward the ground, the heaviest is `top` */
export function ramp(fg: string, ground: string, top = fg) {
  return RAMP.split('').map((_, i) => (i === RAMP.length - 1 ? top : mix(fg, ground, 0.08 + (0.92 * i) / (RAMP.length - 1))));
}
