/**
 * A Svelte action for a display title that must not break a word: when its longest word is
 * wider than the box, it steps down the PARC Pixel Bold ladder (55 → 41.25 → 27.5) until it
 * fits, by setting `data-fit` for the stylesheet to size (0132). The Work rows use it since
 * “POCKETWATCH” (572px at 55) outgrew the row's text column from 901 to about 1500px; the
 * study title does the same with its own probe, because its text is typed in (0079).
 */
export function fitTitle(node: HTMLElement) {
  const fit = () => {
    delete node.dataset.fit;
    for (const size of ['41', '27']) {
      if (node.scrollWidth <= node.clientWidth) break;
      node.dataset.fit = size;
    }
  };
  fit();
  document.fonts?.ready.then(fit);
  const ro = new ResizeObserver(fit);
  ro.observe(node);
  return { destroy: () => ro.disconnect() };
}
