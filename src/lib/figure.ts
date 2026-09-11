import { U } from '$lib/tokens';
/** How a gallery row shares its height: the sum of its aspects and its count (0089). */
export type RowShare = { total: number; n: number };
/**
 * The height a Picture or Clip sets on itself: from its own width and aspect, floored to
 * the 8px unit so whatever follows stays on the layout grid (the 2px image cell is the
 * column snap in `rowColumns`, not the row height). A figure in a multi-image row takes
 * the row's shared height instead — the row's inner width over the sum of its aspects,
 * floored the same way — so neighbours cannot land on different multiples of 8; when the
 * row has stacked to one column (the figure is as wide as the row) it sizes itself again.
 */
export function figureHeight(host: HTMLElement, ratio: number, row?: RowShare, gap = 16): number {
  const w = host.getBoundingClientRect().width;
  const parent = host.parentElement?.getBoundingClientRect().width ?? w;
  const shared = row && row.n > 1 && w < parent - 1;
  const h = shared ? (parent - gap * (row.n - 1)) / row.total : w * ratio;
  return Math.floor(h / U) * U;
}
