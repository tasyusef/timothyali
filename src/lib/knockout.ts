// Text knockout for textures. Returns a 0..1 factor for a cell centre: 0 inside any box
// (plus `pad` cells), rising to 1 over `feather` cells. Multiplied into the field before
// the Bayer threshold, so the edge itself dithers instead of being a hard mask.
export type Box = { x0: number; y0: number; x1: number; y1: number };
export function knockout(x: number, y: number, boxes: Box[], pad: number, feather: number) {
  if (!boxes.length) return 1;
  let d = Infinity;
  for (const b of boxes) {
    const dx = Math.max(b.x0 - x, 0, x - b.x1);
    const dy = Math.max(b.y0 - y, 0, y - b.y1);
    const dist = Math.hypot(dx, dy);
    if (dist < d) d = dist;
  }
  if (d <= pad) return 0;
  if (feather <= 0) return 1;
  const t = Math.min(1, (d - pad) / feather);
  return t * t;
}

// Measure the boxes a texture should avoid, in cell units relative to the canvas.
// Text is measured per line box via a Range, so the knockout hugs the words rather
// than the full-width block; flex/grid containers fall back to their element box.
export function measureBoxes(root: ParentNode, selector: string, canvas: DOMRect, cell: number): Box[] {
  const out: Box[] = [];
  const push = (r: DOMRect) => { if (r.width > 0 && r.height > 0) out.push({ x0: (r.left - canvas.left) / cell, y0: (r.top - canvas.top) / cell, x1: (r.right - canvas.left) / cell, y1: (r.bottom - canvas.top) / cell }); };
  for (const el of root.querySelectorAll(selector)) {
    const display = getComputedStyle(el).display;
    if (display.includes('flex') || display.includes('grid')) { push(el.getBoundingClientRect()); continue; }
    const range = document.createRange(); range.selectNodeContents(el);
    const rects = [...range.getClientRects()];
    if (rects.length) rects.forEach(push); else push(el.getBoundingClientRect());
  }
  return out;
}
