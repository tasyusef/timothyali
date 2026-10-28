// Scroll each page top to bottom at 390 and 1440 with motion on: chrome behaviour and layout shifts.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 700 ? 900 : 844 }, hasTouch: w < 700, isMobile: w < 700, deviceScaleFactor: w < 700 ? 2 : 1 });
  await ctx.addInitScript(() => { window.__shifts = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput && e.value > 0.0005) window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), y: Math.round(scrollY), src: e.sources?.map((s) => (s.node?.className?.baseVal ?? s.node?.className ?? s.node?.nodeName ?? '') + '').slice(0, 3) }); }).observe({ type: 'layout-shift', buffered: true }); });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
    const H = await page.evaluate(() => document.documentElement.scrollHeight); const vh = await page.evaluate(() => innerHeight);
    const chromeLog = new Set(); let y = 0, steps = 0;
    while (y < H - vh && steps < 200) { y += Math.round(vh * 0.6); await page.mouse.wheel(0, Math.round(vh * 0.6)); await page.waitForTimeout(120); steps++; chromeLog.add(await page.evaluate(() => { const c = document.querySelector('.nav-chrome'); const r = c.getBoundingClientRect(); return `${c.classList.contains('collapsed') ? 'collapsed' : 'shown'}@${Math.round(r.top)}`; })); }
    await page.mouse.wheel(0, -300); await page.waitForTimeout(200);
    const up = await page.evaluate(() => { const c = document.querySelector('.nav-chrome'); return `${c.classList.contains('collapsed') ? 'collapsed' : 'shown'}@${Math.round(c.getBoundingClientRect().top)}`; });
    const shifts = await page.evaluate(() => window.__shifts);
    const cls = shifts.reduce((a, s) => a + s.v, 0);
    console.log(w, p.padEnd(26), 'H', H, '| chrome down:', [...chromeLog].join(','), '| scroll up:', up, '| CLS', cls.toFixed(4), cls > 0.01 ? JSON.stringify(shifts.slice(0, 4)) : '');
  }
  // the study's held text: does a point's text stay under the chrome without covering the screens?
  if (w === 1440) {
    await page.goto(B + '/work/parc/', { waitUntil: 'networkidle' });
    const hold = await page.evaluate(async () => { const t = document.querySelector('.point-text.hold'); if (!t) return 'no held point'; t.closest('.point').scrollIntoView(); scrollBy(0, 600); await new Promise((r) => setTimeout(r, 300)); const r = t.getBoundingClientRect(), c = document.querySelector('.nav-chrome').getBoundingClientRect(); return `held text top ${Math.round(r.top)} bottom ${Math.round(r.bottom)}, chrome bottom ${Math.round(c.bottom)}`; });
    console.log('PARC held point:', hold);
  }
  await ctx.close();
}
await browser.close();
