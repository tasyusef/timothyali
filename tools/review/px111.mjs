// PX-111 (0214) check: the field painting only what changed must look exactly like the field
// repainting the screen every frame. Two builds are driven on one clock: the page's frames and
// performance.now are stepped by hand and Math.random is seeded, so the same clicks make the
// same rings, and the canvases are compared pixel for pixel at several moments.
//   node tools/review/px111.mjs <out dir> <origin A> <origin B>
import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
const [OUT, A, B] = process.argv.slice(2);
const CLOCK = `(() => {
  let T = 1000, q = [], s = 7;
  Math.random = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  performance.now = () => T;
  window.requestAnimationFrame = (f) => { q.push(f); return q.length; };
  window.cancelAnimationFrame = () => {};
  window.__step = (n) => { for (let i = 0; i < n; i++) { T += 1000 / 60; const fs = q; q = []; fs.forEach((f) => f(T)); } };
})();`;
const b = await chromium.launch({ channel: 'chrome', headless: true });
const shots = async (origin, theme, width) => {
  const c = await b.newContext({ viewport: { width, height: 900 } });
  await c.addInitScript((t) => { localStorage.setItem('tim-motion', 'on'); localStorage.setItem('tim-theme', t); }, theme);
  await c.addInitScript(CLOCK);
  const p = await c.newPage(); await p.goto(origin + '/'); await p.waitForTimeout(1500);
  const step = (n) => p.evaluate((k) => window.__step(k), n);
  await step(10);
  const out = [];
  const x = Math.round(width * 0.6), y = 330;
  // a pointer pass, then three clicks a few frames apart, then frames on
  for (let i = 0; i < 8; i++) { await p.mouse.move(x - 200 + i * 40, y + 40); await step(2); }
  for (const [dx, dy] of [[0, 0], [-160, 80], [140, -40]]) { await p.mouse.move(x + dx, y + dy); await p.mouse.down(); await p.mouse.up(); await step(6); }
  await p.mouse.move(5, 895);
  for (const n of [10, 20, 40, 80, 200]) { await step(n); out.push(await p.evaluate(() => document.querySelector('.page-sky canvas').toDataURL())); }
  await c.close();
  return out;
};
let bad = 0;
for (const [theme, width] of [['dark', 1440], ['light', 1440], ['dark', 390], ['light', 390]]) {
  const a = await shots(A, theme, width), z = await shots(B, theme, width);
  a.forEach((u, k) => {
    const pa = PNG.sync.read(Buffer.from(u.split(',')[1], 'base64')), pz = PNG.sync.read(Buffer.from(z[k].split(',')[1], 'base64'));
    let diff = 0; for (let i = 0; i < pa.data.length; i += 4) if (pa.data.readUInt32LE(i) !== pz.data.readUInt32LE(i)) diff++;
    if (pa.width !== pz.width || pa.height !== pz.height) diff = -1;
    if (diff) { bad++; writeFileSync(`${OUT}/px111-${theme}-${width}-${k}-a.png`, PNG.sync.write(pa)); writeFileSync(`${OUT}/px111-${theme}-${width}-${k}-b.png`, PNG.sync.write(pz)); }
    console.log(`${theme} ${width} moment ${k}: ${diff === -1 ? 'size differs' : diff + ' pixels differ'}`);
  });
}
await b.close();
console.log(bad ? `FAIL: ${bad} moments differ` : 'PASS: every moment identical');
process.exit(bad ? 1 : 0);
