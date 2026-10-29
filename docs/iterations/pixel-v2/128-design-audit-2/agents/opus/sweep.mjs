// opus reviewer, PX-128: every page x width x theme. Overflow, contrast of rendered text, console errors, screenshots.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4173';
const OUT = new URL('./', import.meta.url).pathname;
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const WIDTHS = [1440, 1100, 900, 700, 420, 390, 320];
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
for (const theme of ['dark', 'light']) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    await ctx.addInitScript((t) => { try { localStorage.setItem('tim-theme', t); } catch {} }, theme);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    for (const p of PAGES) {
      errors.length = 0;
      const resp = await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const vw = de.clientWidth;
        const over = [];
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          if (el.closest('.sr-only,[hidden]')) continue;
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) continue;
          // clipped by an overflow:hidden ancestor? skip
          let clip = false; for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { const ab = a.getBoundingClientRect(); if (ab.right <= vw + 0.5) { clip = true; break; } } }
          if (!clip && (b.right > vw + 0.5 || b.left < -0.5) && el.children.length === 0) over.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${(el.textContent || '').trim().slice(0, 30)}" ${Math.round(b.left)}..${Math.round(b.right)}`);
        }
        // contrast of text leaves
        const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v[3] ?? 1 }; };
        const lum = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const mix = (fg, bg, a) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
        const bgOf = (el) => { for (let a = el; a; a = a.parentElement) { const c = parse(getComputedStyle(a).backgroundColor); if (c && c.a > 0.9) return { c, el: a }; } return { c: parse(getComputedStyle(document.body).backgroundColor), el: document.body }; };
        const low = new Map();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue;
          const el = n.parentElement; if (!el || el.closest('.sr-only,[hidden],[aria-hidden="true"] canvas')) continue;
          const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const b = el.getBoundingClientRect(); if (!b.width) continue;
          let op = 1; for (let a = el; a; a = a.parentElement) op *= Number(getComputedStyle(a).opacity);
          const fg = parse(cs.color); const { c: bg, el: bgEl } = bgOf(el);
          if (!fg || !bg) continue;
          const eff = mix(fg, bg, fg.a * op);
          const L1 = lum(eff), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          const size = parseFloat(cs.fontSize); const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
          const need = large ? 3 : 4.5;
          if (ratio < need) { const k = `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} on ${bgEl.tagName.toLowerCase()}.${[...bgEl.classList].join('.')} size ${size} op ${op.toFixed(2)} ratio ${ratio.toFixed(2)}`; if (!low.has(k)) low.set(k, n.textContent.trim().slice(0, 40)); }
        }
        return { hscroll: de.scrollWidth > de.clientWidth, sw: de.scrollWidth, vw, over: over.slice(0, 12), low: [...low].slice(0, 20), h: de.scrollHeight };
      });
      results.push({ theme, w, p, status: resp.status(), errors: [...errors], ...r });
      if ((w === 390 || w === 1440 || w === 320) && theme === 'dark') await page.screenshot({ path: `${OUT}shots/${w}-${theme}${p.replace(/\//g, '_')}.png`, fullPage: true });
      if (w === 390 && theme === 'light') await page.screenshot({ path: `${OUT}shots/${w}-${theme}${p.replace(/\//g, '_')}.png`, fullPage: false });
    }
    await ctx.close();
  }
}
fs.writeFileSync(`${OUT}sweep.json`, JSON.stringify(results, null, 1));
for (const r of results) {
  const bad = r.hscroll || r.over.length || r.low.length || r.errors.length || r.status >= 400 && r.p !== '/nope/';
  if (bad) console.log(`${r.theme} ${r.w} ${r.p} status=${r.status} hscroll=${r.hscroll}(${r.sw}/${r.vw})\n  over: ${r.over.join(' | ')}\n  low: ${r.low.map(([k, v]) => k + ' "' + v + '"').join('\n       ')}\n  err: ${r.errors.join(' | ')}`);
}
await browser.close();
