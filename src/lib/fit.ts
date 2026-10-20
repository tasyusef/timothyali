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

/**
 * A title may wrap between words but must not break one (0079, 0207; one action since 0210, for
 * the study title, its share image and the tool share images). A hidden probe inside the
 * heading, at the heading's base size, measures the longest word; when it is wider than the
 * heading, `.small` is set for the stylesheet to step the title down a rung. The probe's size
 * is read with `.small` off, so the step cannot shrink the probe and flip the result back; the
 * probe is observed too, because the face it is set in can arrive after `fonts.ready` (0207).
 */
export function fitWord(node: HTMLElement, text: string) {
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;left:0;top:0;width:0;overflow:hidden;visibility:hidden;white-space:pre;pointer-events:none';
  if (getComputedStyle(node).position === 'static') node.style.position = 'relative';
  node.prepend(probe);
  const set = (t: string) => { probe.textContent = t.split(/\s+/).sort((a, b) => b.length - a.length)[0] ?? ''; };
  const fit = () => {
    node.classList.remove('small');
    probe.style.fontSize = getComputedStyle(node).fontSize;
    node.classList.toggle('small', probe.scrollWidth > node.clientWidth);
  };
  set(text); fit();
  document.fonts?.ready.then(fit);
  document.fonts?.addEventListener('loadingdone', fit);
  const ro = new ResizeObserver(fit); ro.observe(node); ro.observe(probe);
  return {
    update(t: string) { set(t); fit(); },
    destroy() { ro.disconnect(); document.fonts?.removeEventListener('loadingdone', fit); probe.remove(); }
  };
}
