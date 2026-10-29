// opus reviewer, PX-128: keyboard only from the top of each page. Focus order, visible ring, covered by chrome, backwards jumps.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4173';
const OUT = new URL('./', import.meta.url).pathname;
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
const out = {};
const DIR = process.argv[2] === 'back' ? 'Shift+Tab' : 'Tab';
for (const [w, theme] of [[1440, 'dark'], [900, 'dark'], [390, 'light']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('tim-theme', t); } catch {} }, theme);
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const stops = [];
    for (let i = 0; i < 140; i++) {
      await page.keyboard.press(DIR);
      await page.waitForTimeout(220);
      const s = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return null;
        const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        const cx = Math.min(Math.max(b.left + b.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(b.top + Math.min(b.height / 2, 12), 0), innerHeight - 1);
        const hit = document.elementFromPoint(cx, cy);
        const covered = hit && !el.contains(hit) && !hit.contains(el) ? (hit.closest('.nav-chrome') ? 'chrome' : hit.tagName.toLowerCase() + '.' + [...hit.classList].join('.')) : '';
        const name = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 40);
        return { tag: el.tagName.toLowerCase(), id: el.id, name, top: Math.round(b.top + scrollY), left: Math.round(b.left), vt: Math.round(b.top), vb: Math.round(b.bottom), h: Math.round(b.height), wd: Math.round(b.width), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? `${cs.outlineWidth} ${cs.outlineColor}` : (cs.boxShadow !== 'none' ? 'shadow' : 'NONE'), bg: cs.backgroundColor, inView: b.bottom > 0 && b.top < innerHeight, covered };
      });
      if (!s) { stops.push({ tag: 'body' }); break; }
      const last = stops.at(-1);
      if (stops.length > 2 && stops[0].tag === s.tag && stops[0].name === s.name && stops[0].top === s.top) break;
      stops.push(s);
    }
    out[`${w} ${p}`] = stops;
  }
  await ctx.close();
}
fs.writeFileSync(`${OUT}keys-${DIR}.json`, JSON.stringify(out, null, 1));
for (const [k, stops] of Object.entries(out)) {
  const issues = [];
  stops.forEach((s, i) => {
    if (s.tag === 'body') return;
    if (s.ring === 'NONE') issues.push(`no ring #${i} ${s.tag} "${s.name}"`);
    if (!s.inView) issues.push(`off screen #${i} ${s.tag} "${s.name}" vt=${s.vt}`);
    if (s.covered) issues.push(`covered by ${s.covered} #${i} ${s.tag} "${s.name}"`);
    const prev = stops[i - 1]; if (prev && prev.top && (DIR === 'Tab' ? s.top < prev.top - 60 : s.top > prev.top + 60) && i > 1) issues.push(`back jump #${i} ${s.tag} "${s.name}" ${prev.top}->${s.top}`);
    if (s.h && (s.h < 24 || s.wd < 24)) issues.push(`small target #${i} ${s.tag} "${s.name}" ${s.wd}x${s.h}`);
  });
  console.log(`${k}: ${stops.length} stops; first="${stops[0]?.name}"`);
  for (const x of issues) console.log('   ' + x);
}
await browser.close();
