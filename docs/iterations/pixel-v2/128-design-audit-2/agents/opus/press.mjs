// opus reviewer, PX-128: colours of a card's parts while it is pressed (mouse held down), both themes, Home and Work.
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) for (const [p, w] of [['/work/', 1440], ['/', 1440], ['/work/', 390]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript((t) => localStorage.setItem('tim-theme', t), theme);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo(0, document.querySelector('a.card').getBoundingClientRect().top + scrollY - 100)); await page.waitForTimeout(400);
  const card = page.locator('a.card').first(); const b = await card.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + 100); await page.mouse.down(); await page.waitForTimeout(150);
  const st = await card.evaluate((c) => [c, c.querySelector('.card-body'), c.querySelector('h2,h3'), c.querySelector('.desc')].map((e) => { if (!e) return '-'; const s = getComputedStyle(e); return `${e.className.split(' ')[0]}: color=${s.color} bg=${s.backgroundColor} bgimg=${s.backgroundImage.slice(0, 40)}`; }).join('\n     '));
  console.log(`${theme} ${p} ${w} pressed:\n     ${st}`);
  await page.screenshot({ path: `${OUT}shots/press-card-${theme}-${w}${p.replace(/\//g, '_')}.png`, clip: { x: b.x - 8, y: b.y - 8, width: b.width + 16, height: Math.min(b.height + 16, 900 - b.y) } });
  await page.mouse.move(2, 2); await page.mouse.up();
  await ctx.close();
}
await browser.close();
