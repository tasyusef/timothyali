import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, touch] of [[390, true], [390, false], [320, false], [360, false]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, hasTouch: touch });
  await ctx.addInitScript(() => { localStorage.setItem('tim-motion', 'off'); });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/toolbox/', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('main .mono')) { const r = el.getBoundingClientRect(); if (r.right > innerWidth) { const host = el.closest('a,button,li,div'); out.push({ host: host.outerHTML.slice(0, 300), hostRight: host.getBoundingClientRect().right, coarse: matchMedia('(pointer:coarse)').matches }); } }
    return { sw: document.documentElement.scrollWidth, out };
  });
  console.log(w, touch, JSON.stringify(r, null, 1));
  if (w === 390 && touch) { const el = await page.$('.on-phone'); if (el) { await el.scrollIntoViewIfNeeded(); await page.screenshot({ path: 'shots/toolbox-390-sendon-overflow.png' }); } }
  await page.goto('http://127.0.0.1:4173/toolbox/specimen/', { waitUntil: 'networkidle' });
  const s = await page.evaluate(() => { const h = document.querySelector('h1'); return { sw: document.documentElement.scrollWidth, cls: h.className, fs: getComputedStyle(h.querySelector('.decode')||h).fontSize, w: h.scrollWidth, cw: h.clientWidth }; });
  console.log('specimen', w, JSON.stringify(s));
  if (w === 320) await page.screenshot({ path: 'shots/specimen-320-title-overflow.png' });
  await ctx.close();
}
await browser.close();
