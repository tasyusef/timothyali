/**
 * A Svelte action for a grid of card titles that must not break a word (0132, 0196): when a
 * title's longest word is wider than its card, the titles step down the PARC Pixel Bold ladder,
 * 27.5 then 20.625/24 (the font's pixel at 1.5 px, whole device pixels on the 2× screens a
 * 320px phone has; “POCKETWATCH” at 27.5 is wider than a card at 320px, and breaking it reads
 * worse, 0204), by setting `data-fit` for the stylesheet to size. Each title finds the step it
 * needs, then every title in the grid takes the smallest of them, so the cards in one grid share
 * one title size (0206: at 320 three Work titles were 20.625 beside six at 27.5).
 */
export function fitTitles(node: HTMLElement, selector = '.card-body h2, .card-body h3') {
  const LADDER = ['27', '20'];
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
