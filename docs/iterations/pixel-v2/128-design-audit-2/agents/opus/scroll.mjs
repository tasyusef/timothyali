// opus reviewer, PX-128: scroll each page top to bottom at 390 and 1440 with motion on; layout shifts, chrome state.
import { chromium } from '@playwright/test';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, hasTouch: w === 390, isMobile: w === 390 });
  await ctx.addInitScript(() => { window.__cls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && e.value > 0.002) window.__cls.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: e.sources?.map((s) => s.node ? (s.node.nodeName + '.' + (s.node.className?.baseVal ?? s.node.className ?? '')).slice(0, 50) : '?').join(',') }); }).observe({ type: 'layout-shift', buffered: true }); });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
    const loadShifts = await page.evaluate(() => window.__cls.splice(0));
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const chrome = [];
    for (let y = 0; y <= H; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(120); chrome.push(await page.evaluate(() => Math.round(document.querySelector('.nav-chrome').getBoundingClientRect().bottom))); }
    await page.waitForTimeout(800);
    const scrollShifts = await page.evaluate(() => window.__cls.splice(0));
    // back up a bit: does the header come back?
    await page.mouse.wheel(0, -200); await page.waitForTimeout(500);
    const up = await page.evaluate(() => Math.round(document.querySelector('.nav-chrome').getBoundingClientRect().bottom));
    const sum = (a) => a.reduce((s, x) => s + x.v, 0).toFixed(3);
    console.log(`${w} ${p} H=${H} loadCLS=${sum(loadShifts)} scrollCLS=${sum(scrollShifts)} chromeBottom(down)=${[...new Set(chrome)].join('/')} up=${up}${scrollShifts.length ? '\n   ' + scrollShifts.slice(0, 4).map((s) => `${s.v}@${s.t} ${s.src}`).join('\n   ') : ''}${loadShifts.length ? '\n   load: ' + loadShifts.slice(0, 3).map((s) => `${s.v} ${s.src}`).join(' | ') : ''}`);
  }
  await ctx.close();
}
await browser.close();
