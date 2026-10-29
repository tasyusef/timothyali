// opus reviewer, PX-128: text or controls that run past their own panel or card (clipped, not page overflow).
import { chromium } from '@playwright/test';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [320, 352, 390, 420, 700, 900]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' })).newPage();
  for (const p of PAGES) {
    await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('main a, main button, main p, main span, main h1, main h2, main h3, main dd, main code, main li')) {
        if (el.closest('.sr-only,[aria-hidden=true],.band-bg,canvas')) continue;
        const b = el.getBoundingClientRect(); if (!b.width) continue;
        // nearest panel/card/clipping box
        let box = null; for (let a = el.parentElement; a && a.tagName !== 'MAIN'; a = a.parentElement) { const cs = getComputedStyle(a); if (a.classList.contains('panel') || a.classList.contains('card') || cs.overflowX !== 'visible') { box = a; break; } }
        if (!box) continue;
        const bb = box.getBoundingClientRect(); const cs = getComputedStyle(box);
        const inner = bb.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
        // use the text's own extent via a range
        const rg = document.createRange(); rg.selectNodeContents(el); const tb = rg.getBoundingClientRect();
        const right = Math.max(b.right, tb.right);
        if (right > bb.right + 0.5 && el.children.length === 0) out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${el.textContent.trim().slice(0, 30)}" right=${Math.round(right)} > ${box.tagName.toLowerCase()}.${[...box.classList].join('.')} edge=${Math.round(bb.right)}`);
        else if (right > inner + 0.5 && el.children.length === 0 && box.classList.contains('panel')) out.push(`(into padding) ${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}" right=${Math.round(right)} > inner=${Math.round(inner)}`);
      }
      return [...new Set(out)].slice(0, 8);
    });
    if (r.length) console.log(w, p, '\n   ' + r.join('\n   '));
  }
}
await browser.close();
