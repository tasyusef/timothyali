// Mobile audit capture (PX-104): every public page at phone sizes, full-page screenshots and
// a measurement file per page. Run against the dev server: node tools/review/mobile-audit.mjs [origin] [out]
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.argv[2] || 'http://localhost:5173', out = process.argv[3] || 'docs/iterations/pixel-v2/104-mobile-audit';
const studies = ['sonde', 'pocketwatch', 'toolbox', 'parc', 'firstledger', 'xrpcafe', 'jade-aesthetics', 'firststrike', 'do-androids-dream'];
const pages = ['/', '/work/', '/contact/', '/toolbox/', '/toolbox/agents/', '/toolbox/convert/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', ...studies.map((s) => `/work/${s}/`), '/no-such-page/'];
const name = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_'));
mkdirSync(`${out}/shots`, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const [w, h, tag, motion, theme] of [[390, 844, '390', 'off', 'dark'], [320, 640, '320', 'off', 'dark'], [390, 844, '390-light', 'off', 'light'], [390, 844, '390-motion', 'on', 'dark']]) {
  for (const path of pages) {
    if (tag !== '390' && tag !== '320' && !['/', '/work/', '/contact/', '/toolbox/', '/work/sonde/', '/toolbox/convert/'].includes(path)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: motion === 'off' ? 'reduce' : 'no-preference' });
    await ctx.addInitScript(([m, t]) => { try { localStorage.setItem('tim-motion', m); localStorage.setItem('tim-theme', t); } catch {} }, [motion, theme]);
    const p = await ctx.newPage(); const errors = []; p.on('pageerror', (e) => errors.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    let bytes = 0; p.on('response', async (r) => { try { const l = Number(r.headers()['content-length']); if (l) bytes += l; } catch {} });
    const res = await p.goto(origin + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(motion === 'on' ? 3500 : 800);
    if (tag === '390-motion') { await p.screenshot({ path: `${out}/shots/${name(path)}-${tag}.png` }); await ctx.close(); continue; }
    // scroll through so lazy images load, then back
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(600);
    const m = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth, vis = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const label = (e) => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} "${(e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`;
      const small = [...document.querySelectorAll('a,button,input,select,textarea,summary,[role=button]')].filter(vis).map((e) => ({ e, r: e.getBoundingClientRect() })).filter(({ r }) => r.width < 44 || r.height < 44).map(({ e, r }) => `${label(e)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      const tiny = new Map(); const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) { const n = walker.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement; if (!vis(el) || el.closest('.sr-only,[aria-hidden=true]')) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 14) tiny.set(label(el), fs); }
      const over = [...document.querySelectorAll('body *')].filter((e) => e.tagName !== 'CANVAS' && vis(e)).filter((e) => e.getBoundingClientRect().right > vw + 1).map(label).slice(0, 8);
      const imgs = [...document.images].map((i) => ({ src: i.currentSrc.split('/').slice(-2).join('/'), shown: Math.round(i.getBoundingClientRect().width), natural: i.naturalWidth, alt: i.alt })).filter((i) => i.shown);
      const inputs = [...document.querySelectorAll('input,textarea')].map((i) => `${i.name || i.id} type=${i.type} autocomplete=${i.autocomplete || '-'} inputmode=${i.inputMode || '-'} fs=${getComputedStyle(i).fontSize} label=${!!(i.labels && i.labels.length) || !!i.getAttribute('aria-label')}`);
      const header = document.querySelector('.nav-chrome')?.getBoundingClientRect().height;
      const h1 = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 40));
      return { docH: document.documentElement.scrollHeight, screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1), headerH: header, h1, title: document.title, overflow: over, smallTargets: small, tinyText: [...tiny].map(([k, v]) => `${k} ${v}px`).slice(0, 15), images: imgs.filter((i) => i.natural > i.shown * 3 || !i.alt), inputs };
    });
    report[`${path} @${tag}`] = { status: res.status(), bytes, errors, ...m };
    await p.screenshot({ path: `${out}/shots/${name(path)}-${tag}.png`, fullPage: true });
    await ctx.close();
  }
}
writeFileSync(`${out}/metrics.json`, JSON.stringify(report, null, 2));
await b.close();
console.log(Object.keys(report).length, 'page captures');
