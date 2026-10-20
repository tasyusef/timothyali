import { U, GALLERY_GAP } from '$lib/tokens';
/**
 * What the page frame measures, for `sizes` hints: the window less its two gutters (--gutter,
 * 32 and 16 below 701px). The page has no maximum width, so a hint must not stop at one
 * (they said 1440, and wider screens fetched softer files; 0210).
 */
export const FRAME = { desk: 'calc(100vw - 64px)', phone: 'calc(100vw - 32px)' } as const;
/** `sizes` for a figure `1/n` of the frame on desktop and the full frame on a phone. */
export const frameSizes = (n = 1) => `(min-width: 701px) calc(${FRAME.desk} / ${n}), ${FRAME.phone}`;

/** How a gallery row shares its height: the sum of its aspects and its count (0089). */
export type RowShare = { total: number; n: number };
/**
 * The height a Picture or Clip sets on itself: from its own width and aspect, floored to
 * the 8px unit so whatever follows stays on the layout grid (the 2px image cell is the
 * column snap in `rowColumns`, not the row height). A figure in a multi-image row takes
 * the row's shared height instead — the row's inner width over the sum of its aspects,
 * floored the same way — so neighbours cannot land on different multiples of 8; when the
 * row is not on one line (stacked to one column, or two to a line on a phone, PX-49) the
 * figure is wider than its share of the line and sizes itself again.
 */
export function figureHeight(host: HTMLElement, ratio: number, row?: RowShare, gap = GALLERY_GAP): number {
  const w = host.getBoundingClientRect().width;
  const parent = host.parentElement?.getBoundingClientRect().width ?? w;
  // its share of one line: the row's inner width times this figure's aspect over the total
  const share = row && row.n > 1 ? ((parent - gap * (row.n - 1)) / ratio) / row.total : parent;
  const shared = row && row.n > 1 && Math.abs(w - share) <= 4;
  const h = shared ? (parent - gap * (row.n - 1)) / row.total : w * ratio;
  return Math.floor(h / U) * U;
}

/**
 * Sizes a Picture or Clip to `figureHeight` on mount and on every resize (0210; each component
 * did this itself). `ratio` is called each time, so a phone crop can change the aspect.
 */
export function figure(node: HTMLElement, opts: { ratio: () => number; row?: RowShare }) {
  let o = opts;
  const size = () => { if (node.getBoundingClientRect().width) node.style.height = figureHeight(node, o.ratio(), o.row) + 'px'; };
  size();
  const ro = new ResizeObserver(size); ro.observe(node);
  return { update(next: typeof opts) { o = next; size(); }, destroy() { ro.disconnect(); } };
}
