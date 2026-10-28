// Tab through every page in both themes and measure each focus indicator against the ground it sits on.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4173';
const PAGES = ['/', '/work/', '/work/parc/', '/work/do-androids-dream/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
const all = [];
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((t) => { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', 'off'); }, theme);
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    const seen = new Set();
    for (let i = 0; i < 90; i++) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b, a = 1] = m.map(Number); const ch = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return { L: 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b), a, rgb: [r, g, b] }; };
        // the ground behind the outline: the first ancestor (excluding el) with an opaque background colour
        let bg = null, bgEl = null;
        for (let a = el.parentElement; a; a = a.parentElement) { const c = getComputedStyle(a).backgroundColor; const l = lum(c); if (l && l.a > 0.5) { bg = c; bgEl = a.className || a.tagName; break; } }
        bg ??= getComputedStyle(document.documentElement).backgroundColor;
        const cs = getComputedStyle(el);
        const oc = cs.outlineColor, os = cs.outlineStyle, ow = cs.outlineWidth;
        const L1 = lum(oc), L2 = lum(bg);
        const ratio = L1 && L2 ? (Math.max(L1.L, L2.L) + 0.05) / (Math.min(L1.L, L2.L) + 0.05) : null;
        const r = el.getBoundingClientRect();
        const name = el.getAttribute('aria-label') || (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50) || el.getAttribute('name') || el.tagName;
        const chrome = document.querySelector('.nav-chrome')?.getBoundingClientRect();
        const covered = chrome && !el.closest('.nav-chrome') && r.top < chrome.bottom && r.bottom > chrome.top;
        return { tag: el.tagName.toLowerCase(), cls: String(el.className?.baseVal ?? el.className).slice(0, 40), name, os, ow, oc, bg, bgEl: String(bgEl).slice(0, 40), ratio: ratio && +ratio.toFixed(2), visible: r.width > 0 && r.height > 0, inView: r.bottom > 0 && r.top < innerHeight, covered, fv: el.matches(':focus-visible') };
      });
      if (!f) continue;
      const key = f.tag + f.name + f.cls;
      if (seen.has(key)) break; seen.add(key);
      all.push({ theme, p, ...f });
    }
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(new URL('./focus.json', import.meta.url), JSON.stringify(all, null, 1));
for (const f of all) {
  const flag = (f.os === 'none' ? 'NO-OUTLINE ' : '') + (f.ratio !== null && f.ratio < 3 ? 'LOW ' : '') + (f.covered ? 'COVERED ' : '') + (!f.visible ? 'INVISIBLE ' : '');
  if (flag) console.log(f.theme, f.p, flag, f.tag, JSON.stringify(f.name), f.oc, 'on', f.bg, f.bgEl, f.ratio);
}
console.log('stops', all.length);
