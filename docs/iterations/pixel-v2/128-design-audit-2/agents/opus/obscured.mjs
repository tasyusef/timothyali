// opus reviewer, PX-128: Shift+Tab up a page; how much of the focused element sits under the sticky chrome.
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, motion] of [[1440, 'reduce'], [1440, 'no-preference'], [900, 'reduce'], [390, 'reduce']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: motion });
  const page = await ctx.newPage();
  for (const p of ['/', '/work/', '/toolbox/']) {
    await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    let n = 0;
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(motion === 'reduce' ? 200 : 900);
      const r = await page.evaluate(() => {
        const el = document.activeElement; const b = el.getBoundingClientRect();
        const ch = document.querySelector('.nav-chrome').getBoundingClientRect();
        const cover = Math.max(0, Math.min(b.bottom, ch.bottom) - Math.max(b.top, ch.top));
        return { name: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28), top: Math.round(b.top), h: Math.round(b.height), chromeBottom: Math.round(ch.bottom), covered: b.height ? Math.round(100 * cover / b.height) : 0, inChrome: !!el.closest('.nav-chrome') };
      });
      if (r.inChrome) break;
      if (r.covered > 0) { console.log(`${w} ${motion} ${p} "${r.name}" top=${r.top} h=${r.h} chromeBottom=${r.chromeBottom} covered=${r.covered}%`); if (r.covered === 100 && n++ < 1) await page.screenshot({ path: `${OUT}shots/obscured-${w}-${motion}${p.replace(/\//g, '_')}.png` }); }
    }
  }
  await ctx.close();
}
await browser.close();
