import { GALLERY_GAP, CELL_IMAGE } from './tokens.ts';
import type { Row } from './work.ts';

/** a row that sits two to a line on a phone instead of stacking (PX-49): every figure portrait
 *  or square and all the same shape, so a phone screenshot never fills the phone's screen */
export function rowTiles(row: Row): boolean {
  const a = row[0].w / row[0].h;
  return row.length > 1 && row.every((m) => m.h >= m.w && Math.abs(m.w / m.h - a) < 0.01);
}

/** grid-template-columns for a gallery row: widths proportional to aspect, snapped to the 2px image cell (galleries hold no text, so the 8px text grid does not apply), the last column taking the small remainder so every image in the row is within a few pixels of the same height */
export function rowColumns(row: Row, gap = GALLERY_GAP): string {
  if (row.length === 1) return '100%';
  const aspects = row.map((m) => m.w / m.h);
  const total = aspects.reduce((a, b) => a + b, 0);
  const inner = `(100% - ${gap * (row.length - 1)}px)`;
  return aspects.slice(0, -1).map((a) => `round(nearest, calc(${inner} * ${(a / total).toFixed(6)}), ${CELL_IMAGE}px)`).join(' ') + ' 1fr';
}
