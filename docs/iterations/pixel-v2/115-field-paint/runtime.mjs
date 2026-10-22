// Runtime cost of the field by scenario (Fable, PX-115). usage: node runtime.mjs <origin> <desktop|phone> <dark|light> [path]
import { chromium } from '@playwright/test';
const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';
const prof = process.argv[3] ?? 'desktop';
const themeArg = process.argv[4] ?? 'dark';
const path = process.argv[5] ?? '/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext(prof === 'phone' ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Performance.enable');
if (prof === 'phone') await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(`try { localStorage.setItem('tim-theme', '${themeArg}'); localStorage.setItem('tim-motion', 'on'); } catch {}
  window.__frames = 0; (function f(){ window.__frames++; requestAnimationFrame(f); })(); window.__long = [];
  try { new PerformanceObserver((l)=>{ for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({type:'longtask'}); } catch {}`);
const metrics = async () => { const m = await cdp.send('Performance.getMetrics'); const o = Object.fromEntries(m.metrics.map((x) => [x.name, x.value])); return { task: o.TaskDuration * 1000, script: o.ScriptDuration * 1000, layout: o.LayoutDuration * 1000, heap: o.JSHeapUsedSize / 1048576, layouts: o.LayoutCount }; };
const frames = () => page.evaluate(() => { const f = window.__frames; window.__frames = 0; return f; });
const longs = () => page.evaluate(() => { const l = window.__long; window.__long = []; return l; });
const out = [];
async function phase(name, ms, action) {
  await frames(); await longs(); const a = await metrics(); const t0 = Date.now();
  if (action) await action();
  const left = ms - (Date.now() - t0); if (left > 0) await page.waitForTimeout(left);
  const b = await metrics(); const f = await frames(); const l = await longs(); const dt = (Date.now() - t0) / 1000;
  const row = { name, task: (b.task - a.task) / dt, script: (b.script - a.script) / dt, layout: (b.layout - a.layout) / dt, layouts: b.layouts - a.layouts, fps: f / dt, long: l, heap: b.heap };
  out.push(row);
  console.log(`${name.padEnd(36)} task ${row.task.toFixed(0).padStart(5)} ms/s  script ${row.script.toFixed(0).padStart(5)} ms/s  layout ${row.layout.toFixed(0).padStart(4)} ms/s (${row.layouts})  frames ${row.fps.toFixed(0).padStart(3)}/s  long ${JSON.stringify(l)}  heap ${row.heap.toFixed(1)} MB`);
}
await page.goto(BASE + path, { waitUntil: 'load' });
await page.waitForTimeout(3000);
console.log(`== ${prof} ${themeArg} ${path} motion=${await page.evaluate(() => document.querySelector('.site')?.dataset.motion)} theme=${await page.evaluate(() => document.documentElement.dataset.theme)} canvases=${await page.evaluate(() => [...document.querySelectorAll('canvas')].map((c) => c.width + 'x' + c.height).join(' '))} pageHeight=${await page.evaluate(() => document.documentElement.scrollHeight)}`);
await phase('idle, top of page', 5000);
if (prof !== 'phone') {
  await page.mouse.move(700, 600);
  await phase('pointer resting on field', 3000);
  await phase('pointer moving over hero', 3000, async () => { for (let i = 0; i < 150; i++) { await page.mouse.move(200 + (i % 50) * 20, 300 + Math.floor(i / 50) * 120); await page.waitForTimeout(16); } });
  await page.mouse.move(5, 5); await page.waitForTimeout(1500);
}
await phase('1 click (ripple) + 3 s', 3200, async () => { await page.mouse.click(prof === 'phone' ? 200 : 700, 500); });
await page.waitForTimeout(1500);
await phase('6 clicks (ripples) + 4 s', 4600, async () => { for (let i = 0; i < 6; i++) { await page.mouse.click((prof === 'phone' ? 60 : 300) + i * (prof === 'phone' ? 50 : 150), 500); await page.waitForTimeout(100); } });
await phase('after ripples die (idle 3 s)', 3000);
await phase('scroll to bottom in 30 steps', 3000, async () => { const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight); for (let i = 1; i <= 30; i++) { await page.evaluate((y) => scrollTo(0, y), (h * i) / 30); await page.waitForTimeout(50); } });
await phase('idle at bottom', 3000);
await phase('6 clicks at bottom + 4 s', 4600, async () => { for (let i = 0; i < 6; i++) { await page.mouse.click((prof === 'phone' ? 60 : 300) + i * (prof === 'phone' ? 50 : 150), 500); await page.waitForTimeout(100); } });
await browser.close();
