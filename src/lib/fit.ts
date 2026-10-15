/**
 * A Svelte action for a display title that must not break a word: when its longest word is
 * wider than the box, it steps down the PARC Pixel Bold ladder (55 → 41.25 → 27.5) until it
 * fits, by setting `data-fit` for the stylesheet to size (0132). The Work rows use it since
 * “POCKETWATCH” (572px at 55) outgrew the row's text column from 901 to about 1500px; the
 * study title does the same with its own probe, because its text is typed in (0079). Past 27.5 a
 * card or row title takes one more step, 20.625/24 (`20`, the font's pixel at 1.5 px, whole
 * device pixels on the 2× screens a 320px phone has): “POCKETWATCH” at 27.5 is wider than a
 * card at 320px, and breaking it reads worse (0204).
 */
export function fitTitle(node: HTMLElement) {
  const fit = () => {
    delete node.dataset.fit;
    for (const size of ['41', '27', '20']) {
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

/**
 * The same ladder for a grid of card titles, stepped together (0206): each title finds the step
 * it needs, then every title in the grid takes the smallest of them, so the cards in one grid
 * share one title size (at 320 three Work titles were 20.625 beside six at 27.5).
 */
export function fitTitles(node: HTMLElement, selector = '.card-body h2, .card-body h3') {
  const LADDER = ['41', '27', '20'];
  const fit = () => {
    const els = [...node.querySelectorAll<HTMLElement>(selector)];
    let step = -1;
    for (const e of els) {
      delete e.dataset.fit;
      let s = -1;
      while (e.scrollWidth > e.clientWidth && s < LADDER.length - 1) e.dataset.fit = LADDER[++s];
      step = Math.max(step, s);
    }
    for (const e of els) { if (step < 0) delete e.dataset.fit; else e.dataset.fit = LADDER[step]; }
  };
  fit();
  document.fonts?.ready.then(fit);
  const ro = new ResizeObserver(fit);
  ro.observe(node);
  return { destroy: () => ro.disconnect() };
}
