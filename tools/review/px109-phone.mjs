// PX-109 (0213): two presses on a phone-width Home, captured at three moments.
// node tools/review/px109-phone.mjs <out dir> <origin>
import { chromium } from '@playwright/test';
const [S, base] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const theme of ['dark', 'light']) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await c.addInitScript((t) => { localStorage.setItem('tim-motion', 'on'); localStorage.setItem('tim-theme', t); }, theme);
  const p = await c.newPage(); await p.goto(base + '/'); await p.waitForTimeout(2500);
  await p.mouse.click(200, 300); await p.waitForTimeout(150); await p.mouse.click(280, 420); await p.mouse.move(2, 840);
  const t0 = Date.now();
  for (const at of [400, 900, 1600]) {
    await p.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    await p.screenshot({ path: `${S}/phone-${theme}-${at}.png`, clip: { x: 0, y: 100, width: 390, height: 600 } });
  }
  await c.close();
}
await b.close();
