// opus reviewer, PX-128: hover and press looks on a card, a CTA, a quiet link and a nav link, in both themes.
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem('tim-theme', t), theme);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/work/', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  const card = page.locator("a.card").first(); await page.evaluate(() => scrollTo(0, document.querySelector("a.card").getBoundingClientRect().top + scrollY - 120)); await page.waitForTimeout(300); const cb = await card.boundingBox();
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2); await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}shots/hover-card-${theme}.png`, clip: { x: cb.x - 8, y: cb.y - 8, width: cb.width + 16, height: cb.height + 16 } });
  await page.mouse.down(); await page.waitForTimeout(100);
  await page.screenshot({ path: `${OUT}shots/press-card-${theme}.png`, clip: { x: cb.x - 8, y: cb.y - 8, width: cb.width + 16, height: cb.height + 16 } });
  await page.mouse.move(5, 500); await page.mouse.up(); await page.waitForTimeout(300);
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' }); await page.waitForTimeout(600);
  for (const [sel, name] of [['.hero-actions a.cta-hint, .hero-actions a.cta', 'cta'], ['.hero-actions .quiet-link', 'quiet'], ['nav[aria-label="Main navigation"] a:not([aria-current])', 'nav']]) {
    const el = page.locator(sel).first(); const b = await el.boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(400);
    const st = await el.evaluate((e) => { const c = getComputedStyle(e); return `color=${c.color} bg=${c.backgroundColor}`; });
    await page.screenshot({ path: `${OUT}shots/hover-${name}-${theme}.png`, clip: { x: Math.max(0, b.x - 16), y: Math.max(0, b.y - 16), width: b.width + 32, height: b.height + 32 } });
    console.log(theme, name, 'hover', st);
    await page.mouse.move(5, 500); await page.waitForTimeout(200);
  }
  await ctx.close();
}
await browser.close();
