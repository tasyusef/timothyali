import { chromium } from '@playwright/test';
import fs from 'node:fs';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { localStorage.setItem('tim-motion', 'off'); });
const page = await ctx.newPage();
await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
const link = page.locator('.machine .quiet-link');
await link.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
console.log('machine link', await link.evaluate((el) => ({ fv: el.matches(':focus-visible'), oc: getComputedStyle(el).outlineColor, panelBg: getComputedStyle(el.closest('.panel')).backgroundColor })));
await link.scrollIntoViewIfNeeded(); await page.screenshot({ path: 'shots/toolbox-machine-link-focus-dark.png', clip: await (async () => { const b = await page.locator('.machine').boundingBox(); return { x: b.x, y: b.y, width: b.width, height: b.height }; })() });
// plate chip focus
const chip = page.locator('.plate-dark').first(); await chip.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
const cb = await chip.boundingBox(); await page.screenshot({ path: 'shots/toolbox-plate-chip-focus-dark.png', clip: { x: cb.x - 60, y: cb.y - 20, width: 200, height: 70 } });
// contact panel focus screenshot
await page.goto(B + '/contact/', { waitUntil: 'networkidle' });
await page.locator('input[name=name]').focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
const nb = await page.locator('.contact-note').boundingBox();
await page.screenshot({ path: 'shots/contact-name-focus-dark.png', clip: { x: nb.x - 8, y: nb.y - 8, width: nb.width + 16, height: 320 } });
await page.locator('.contact-links a').nth(1).focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
await page.screenshot({ path: 'shots/contact-link-focus-dark.png', clip: { x: nb.x - 8, y: nb.y + nb.height - 120, width: nb.width + 16, height: 128 } });
// accessibility snapshots
for (const p of ['/', '/work/', '/contact/', '/toolbox/', '/work/parc/']) {
  await page.goto(B + p, { waitUntil: 'networkidle' });
  const snap = await page.locator('body').ariaSnapshot();
  fs.writeFileSync(`aria-${p === '/' ? 'home' : p.replace(/\//g, '_')}.yml`, snap);
}
await browser.close();
