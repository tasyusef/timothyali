// Text knockout for textures. Returns a 0..1 factor for a cell centre: 0 inside any box
// (plus `pad` cells), rising to 1 over `feather` cells. Multiplied into the field before
// the Bayer threshold, so the edge itself dithers instead of being a hard mask.
export type Box = { x0: number; y0: number; x1: number; y1: number; depth?: number; feather?: number };
// `round` (0174): each box is held by a rounded rectangle, its sides on the box and its corners
// on a radius of up to 8 cells (a little over the box, so the letters' own corners stay clear),
// so a knockout reads as a soft rounded plate around the words instead of a rectangle.
const RADIUS = 8, CLEAR = 1.5;
// `depth` (0176) is how much of the field a knockout takes away: 1 clears it, 0.6 leaves 40%
// of the texture behind the words, so big type can sit in the picture without a hole.
// A box may carry its own depth (0177: small labels clear fully while big type only thins).
export function knockout(x: number, y: number, boxes: Box[], pad: number, feather: number, round = false, depth = 1) {
  if (!boxes.length) return 1;
  let k = 1;
  for (const b of boxes) {
    const fe = b.feather ?? feather; // a box may fade over its own distance (0191: small type tight, big type wide)
    // a cell past the fade's reach from the box (its rounded plate never reaches further than the
    // box plus CLEAR) is untouched by it: most of a page-tall field is, and hypot was a quarter of its time (0207)
    const c = round ? CLEAR : 0;
    if (Math.max(b.x0 - c - x, x - b.x1 - c, b.y0 - c - y, y - b.y1 - c) > pad + fe) continue;
    let dist: number;
    if (round) {
      const r = Math.min(RADIUS, (b.y1 - b.y0) / 2 + CLEAR, (b.x1 - b.x0) / 2 + CLEAR);
      const dx = Math.max(b.x0 - CLEAR + r - x, 0, x - (b.x1 + CLEAR - r));
      const dy = Math.max(b.y0 - CLEAR + r - y, 0, y - (b.y1 + CLEAR - r));
      dist = Math.max(0, Math.hypot(dx, dy) - r);
    } else {
      const dx = Math.max(b.x0 - x, 0, x - b.x1);
      const dy = Math.max(b.y0 - y, 0, y - b.y1);
      dist = Math.hypot(dx, dy);
    }
    const t = dist <= pad ? 0 : fe <= 0 ? 1 : Math.min(1, (dist - pad) / fe);
    // (1 − t)² (0190): the field starts coming back at the cutout's edge and eases in, so a wide
    // feather reads as a fade rather than a plate (1 − t² held it cleared most of the way out)
    const f = 1 - (b.depth ?? depth) * (1 - t) * (1 - t);
    if (f < k) k = f;
  }
  return k;
}

// Measure the boxes a texture should avoid, in cell units relative to the canvas.
// Text is measured per line box via a Range, so the knockout hugs the words rather
// than the full-width block; flex/grid containers fall back to their element box.
// With `hug` (0174) a line's box is cut down to the ink: a line box is the font's whole
// ascent and descent, far taller than the letters in a blackletter or a bitmap face, so the
// top and bottom move to the measured ink of the element's text in its own font.
let probe: CanvasRenderingContext2D | null = null;
function ink(el: Element, cs: CSSStyleDeclaration) {
  probe ??= document.createElement('canvas').getContext('2d');
  // `data-ink` on the element or an ancestor fixes the text measured (0191): a name typed out
  // letter by letter keeps one height instead of growing when a taller letter arrives
  let text = (el.closest('[data-ink]')?.getAttribute('data-ink') ?? el.textContent)?.trim(); if (!probe || !text) return null;
  if (cs.textTransform === 'uppercase') text = text.toUpperCase();
  probe.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = probe.measureText(text);
  if (!m.fontBoundingBoxAscent) return null;
  return { top: m.fontBoundingBoxAscent - m.actualBoundingBoxAscent, bottom: m.fontBoundingBoxAscent + m.actualBoundingBoxDescent };
}
export function measureBoxes(root: ParentNode, selector: string, canvas: DOMRect, cell: number, hug = false, depth?: number, feather?: number): Box[] {
  const out: Box[] = [];
  const push = (r: DOMRect, y0 = r.top, y1 = r.bottom) => { if (r.width > 0 && y1 > y0) out.push({ x0: (r.left - canvas.left) / cell, y0: (y0 - canvas.top) / cell, x1: (r.right - canvas.left) / cell, y1: (y1 - canvas.top) / cell, depth, feather }); };
  for (const el of root.querySelectorAll(selector)) {
    const cs = getComputedStyle(el), display = cs.display;
    // hugging, a flex or grid element is measured by its contents too (0191): a button or a
    // text column by its words, not its padding or its max-width
    if (!hug && (display.includes('flex') || display.includes('grid'))) { push(el.getBoundingClientRect()); continue; }
    const range = document.createRange(); range.selectNodeContents(el);
    const rects = [...range.getClientRects()];
    if (!rects.length) { push(el.getBoundingClientRect()); continue; }
    // the inline boxes of the text sit inside each line box; ink is measured from the top of each
    const k = hug ? ink(el, cs) : null;
    rects.forEach((r) => (k ? push(r, r.top + k.top, Math.min(r.bottom, r.top + k.bottom)) : push(r)));
  }
  return out;
}
