// PX-127 combo: a click, a drag, then a hold at the drag's end and the release, on Home (dev server)
import { chromium } from '@playwright/test';
const B = process.env.BASE ?? 'http://localhost:5174', OUT = new URL('.', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((t) => { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', 'on'); }, theme);
  const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/'); await p.waitForTimeout(2500);
  const shot = (n) => p.screenshot({ path: `${OUT}combo-${theme}-${n}.png`, clip: { x: 300, y: 96, width: 1000, height: 420 } });
  await p.mouse.move(1150, 220); await p.mouse.down();
  for (let i = 0; i <= 24; i++) { await p.mouse.move(1150 - i * 22, 220 + Math.sin(i / 4) * 70); await p.waitForTimeout(16); }
  await shot('1-drag');
  await p.waitForTimeout(1500); await shot('2-held');
  await p.mouse.up(); await p.waitForTimeout(500); await shot('3-fired');
  console.log(theme, errs.length ? errs : 'ok', await p.evaluate(() => getSelection()?.toString() === ''));
  await c.close();
}
await b.close();
