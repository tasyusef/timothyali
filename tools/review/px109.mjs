// PX-109 (0211) evidence: a click on each field, captured at three moments after it.
// node tools/review/px109.mjs <out dir> <origin> <label>
import { chromium } from '@playwright/test';
const [S, base, label] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const [path, x, y, theme] of [['/', 1000, 330, 'dark'], ['/', 1000, 330, 'light'], ['/toolbox/', 1000, 330, 'dark'], ['/contact/', 520, 560, 'dark']]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((t) => { localStorage.setItem('tim-motion', 'on'); localStorage.setItem('tim-theme', t); }, theme);
  const p = await c.newPage(); await p.goto(base + path); await p.waitForTimeout(2500);
  await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.up(); await p.mouse.move(5, 895);
  const t0 = Date.now();
  for (const at of [300, 700, 1200]) {
    await p.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    await p.screenshot({ path: `${S}/${label}-${path.replace(/\//g, '') || 'home'}-${theme}-${at}.png`, clip: { x: x - 400, y: Math.max(0, y - 300), width: 800, height: 600 } });
  }
  await c.close();
}
await b.close();
