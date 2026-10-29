// opus reviewer, PX-128: anchor jumps vs sticky chrome, forced colors, text spacing (1.4.12), hover/press looks.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
// anchors
for (const [w, motion] of [[1440, 'no-preference'], [390, 'no-preference'], [1440, 'reduce']]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: motion })).newPage();
  for (const [p, text] of [['/', 'Selected work'], ['/toolbox/', 'Explore the tools'], ['/toolbox/agents/', 'Serve'], ['/toolbox/lockup/', 'Download for']]) {
    await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const a = page.locator('main a', { hasText: text }).first();
    const href = await a.getAttribute('href');
    await a.click(); await page.waitForTimeout(1600);
    const r = await page.evaluate((h) => { const id = h.split('#')[1]; const t = document.getElementById(id); const ch = document.querySelector('.nav-chrome').getBoundingClientRect(); const first = t.querySelector('h1,h2,h3,a,p') ?? t; return { tTop: Math.round(t.getBoundingClientRect().top), firstTop: Math.round(first.getBoundingClientRect().top), first: first.textContent.trim().slice(0, 20), chromeBottom: Math.round(ch.bottom), focus: document.activeElement?.tagName + '#' + document.activeElement?.id }; }, href);
    console.log(`anchor ${w} ${motion} ${p} "${text}" -> ${href}: target top=${r.tTop} first "${r.first}" top=${r.firstTop} chromeBottom=${r.chromeBottom} focus=${r.focus}`);
  }
}
// forced colors
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active', reducedMotion: 'reduce' })).newPage();
  await page.goto(B + '/work/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: OUT + 'shots/forced-colors-work-1440.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  await page.locator('#tools').scrollIntoViewIfNeeded();
  await page.screenshot({ path: OUT + 'shots/forced-colors-toolbox-1440.png' });
  await page.goto(B + '/contact/', { waitUntil: 'networkidle' });
  await page.locator('input[name=email]').focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  await page.screenshot({ path: OUT + 'shots/forced-colors-contact-1440.png' });
}
// text spacing 1.4.12
for (const w of [1440, 390, 320]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of ['/', '/contact/', '/toolbox/', '/work/parc/', '/toolbox/agents/']) {
    await page.goto(B + p, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '*{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}p{margin-bottom:2em !important}' });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const out = []; const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw) out.push(`page scrolls sideways ${document.documentElement.scrollWidth}/${vw}`);
      for (const el of document.querySelectorAll('nav a, button, a.card, .cta, input, textarea, h1, h2, .lbl')) {
        if (el.closest('.sr-only,[hidden]')) continue;
        const cs = getComputedStyle(el); if (cs.display === 'none') continue;
        if (el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible') out.push(`clipped x ${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 20)}" ${el.scrollWidth}/${el.clientWidth}`);
        if (el.scrollHeight > el.clientHeight + 1 && cs.overflow !== 'visible') out.push(`clipped y ${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 20)}" ${el.scrollHeight}/${el.clientHeight}`);
        const b = el.getBoundingClientRect(); if (b.right > vw + 1 && b.width) out.push(`past edge ${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 20)}" right=${Math.round(b.right)}`);
      }
      // nav items overlapping each other
      const ns = [...document.querySelectorAll('nav[aria-label="Main navigation"] a, button[aria-label=Settings]')].map((a) => a.getBoundingClientRect());
      for (let i = 1; i < ns.length; i++) if (ns[i].left < ns[i - 1].right - 1 && Math.abs(ns[i].top - ns[i - 1].top) < 5) out.push(`nav items overlap #${i}`);
      return [...new Set(out)].slice(0, 10);
    });
    if (r.length) console.log(`spacing ${w} ${p}:\n   ${r.join('\n   ')}`);
    if (p === '/' || p === '/contact/') await page.screenshot({ path: `${OUT}shots/text-spacing-${w}${p.replace(/\//g, '_')}.png` });
  }
  await ctx.close();
}
await browser.close();
