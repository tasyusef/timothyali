// PX-125 opus reviewer: page × width × theme sweep. Read-only against the preview server.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4173';
const OUT = new URL('./shots/', import.meta.url).pathname;
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const WIDTHS = [1440, 1100, 900, 700, 420, 390, 320];
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
for (const theme of ['dark', 'light']) {
  for (const w of WIDTHS) {
    if (theme === 'light' && ![1440, 390].includes(w)) continue;
    const ctx = await browser.newContext({ viewport: { width: w, height: w <= 420 ? 800 : 900 }, deviceScaleFactor: 1, hasTouch: w <= 420, isMobile: false });
    await ctx.addInitScript((t) => { try { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', 'off'); } catch {} }, theme);
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const res = await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const over = [];
        for (const el of document.querySelectorAll('main *, header *, footer *')) {
          if (el.closest('.band-bg, .sr-only, .trap, [hidden]')) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden') continue;
          if (r.right > vw + 0.5 || r.left < -0.5) {
            // is it clipped by an overflow:hidden ancestor?
            let clipped = false; for (let a = el.parentElement; a; a = a.parentElement) { const s = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= vw + 0.5 && ar.left >= -0.5) { clipped = true; break; } } }
            over.push({ tag: el.tagName.toLowerCase(), cls: el.className?.baseVal ?? el.className, text: (el.textContent || '').trim().slice(0, 40), left: Math.round(r.left), right: Math.round(r.right), clipped });
          }
        }
        return { vw, sw, title: document.title, h: document.documentElement.scrollHeight, over: over.slice(0, 12) };
      });
      results.push({ theme, w, p, status: res?.status(), ...info });
      if ([1440, 390, 320].includes(w) || theme === 'light') {
        await page.screenshot({ path: `${OUT}${slug(p)}-${w}-${theme}.jpg`, type: 'jpeg', quality: 70 });
      }
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./sweep.json', import.meta.url), JSON.stringify(results, null, 1));
for (const r of results) {
  const bad = r.over.filter((o) => !o.clipped);
  if (r.sw > r.vw || bad.length || r.status !== 200) console.log(r.theme, r.w, r.p, 'status', r.status, 'scrollW', r.sw, 'vw', r.vw, JSON.stringify(bad.slice(0, 4)));
}
console.log('done', results.length);
