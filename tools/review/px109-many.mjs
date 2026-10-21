// PX-109 (0212): many presses at once. Captures the interference and measures frame times
// with the cap's two dozen rings running. node tools/review/px109-many.mjs <out dir> <origin>
import { chromium } from '@playwright/test';
const [S, base] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const [path, theme] of [['/', 'light'], ['/', 'dark'], ['/toolbox/', 'dark']]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((t) => { localStorage.setItem('tim-motion', 'on'); localStorage.setItem('tim-theme', t); }, theme);
  const p = await c.newPage(); await p.goto(base + path); await p.waitForTimeout(2500);
  for (const [x, y] of [[800, 300], [1050, 380], [900, 520], [1200, 260], [700, 450], [1000, 300]]) { await p.mouse.click(x, y); await p.waitForTimeout(90); }
  await p.mouse.move(5, 895); await p.waitForTimeout(500);
  const name = `${S}/many-${path.replace(/\//g, '') || 'home'}-${theme}.png`;
  await p.screenshot({ path: name, clip: { x: 520, y: 40, width: 880, height: 640 } });
  // 30 presses in a burst, then the slowest of the next sixty frames
  for (let k = 0; k < 30; k++) await p.mouse.click(600 + (k * 37) % 700, 200 + (k * 53) % 400);
  const worst = await p.evaluate(() => new Promise((done) => { const t = []; let last = performance.now(); const f = (n) => { t.push(n - last); last = n; t.length < 60 ? requestAnimationFrame(f) : done(Math.max(...t.slice(1))); }; requestAnimationFrame(f); }));
  console.log(path, theme, 'slowest frame with 24 rings:', Math.round(worst), 'ms');
  await c.close();
}
await b.close();
