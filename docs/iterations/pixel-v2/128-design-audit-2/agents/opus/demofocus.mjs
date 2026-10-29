// opus reviewer, PX-128: does a focused demo button look pressed?
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  await ctx.addInitScript((t) => localStorage.setItem('tim-theme', t), theme);
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/toolbox/', { waitUntil: 'networkidle' });
  const btns = await page.locator('.demo .btn').evaluateAll((bs) => bs.map((b) => `${b.textContent.trim()}:${b.getAttribute('aria-pressed')}`));
  console.log(theme, 'demo .btn', btns.join(' '));
  // focus an unpressed one by keyboard
  const target = page.locator('.demo .btn[aria-pressed=false]').first();
  if (await target.count()) {
    await target.scrollIntoViewIfNeeded();
    await target.evaluate((b) => { const all = [...document.querySelectorAll('a,button,input,textarea,[tabindex]')]; const i = all.indexOf(b); all[i - 1].focus(); });
    await page.keyboard.press('Tab');
    const st = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return `${e.textContent.trim()} pressed=${e.getAttribute('aria-pressed')} bg=${cs.backgroundColor} color=${cs.color} outline=${cs.outlineStyle} ${cs.outlineColor}`; });
    console.log('  focused unpressed:', st);
    const pressed = await page.locator('.demo .btn[aria-pressed=true]').first().evaluate((e) => { const cs = getComputedStyle(e); return `${e.textContent.trim()} bg=${cs.backgroundColor} color=${cs.color}`; });
    console.log('  a pressed one   :', pressed);
    const box = await target.boundingBox(); const row = await target.evaluate((b) => b.closest('div,section').getBoundingClientRect().toJSON());
    await page.screenshot({ path: `${OUT}shots/demo-focus-unpressed-${theme}.png`, clip: { x: Math.max(0, row.x - 16), y: box.y - 40, width: Math.min(560, row.width + 32), height: 110 } });
  }
  // tool picker: focus an unpressed tool
  const pal = page.locator('.tool-picker button[aria-pressed=false]').first();
  await pal.evaluate((b) => { const all = [...document.querySelectorAll('a,button,input,textarea,[tabindex]')]; all[all.indexOf(b) - 1].focus(); });
  await page.keyboard.press('Tab');
  const pb = await pal.boundingBox();
  await page.screenshot({ path: `${OUT}shots/picker-focus-${theme}.png`, clip: { x: 0, y: pb.y - 30, width: 1440, height: pb.height + 60 } });
  await ctx.close();
}
await browser.close();
