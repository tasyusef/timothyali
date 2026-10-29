// Static pass: every page at every width, both themes at 1440 and 390, motion off (so the seeded fields
// are still). Records overflow, headings, landmarks, focusables and their names, images without alt,
// font sizes off the cell table, text contrast of visible text (WCAG + APCA), errors. Screenshots the
// first screen at every width in dark and the full page at 1440 and 390 in both themes.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, collectErrors, goto, PAGES, WIDTHS, SHOTS, DATA } from './lib.mjs';

const CELLS = { 'Jacquard 24': 43, 'PARC Pixel Bold Web': 13.75, 'Jersey 15': 27, 'PARC Pixel Web': 6.25, 'Press Start 2P': 8 };

// --- contrast maths (sRGB) ---
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const wcag = (f, b) => { const a = lum(f) + 0.05, c = lum(b) + 0.05; return a > c ? a / c : c / a; };
// APCA 0.1.9 (W3 version), simplified for opaque sRGB
function apca(f, b) {
  const sc = (c) => Math.pow(c / 255, 2.4);
  const Y = ([r, g, b]) => 0.2126729 * sc(r) + 0.7151522 * sc(g) + 0.0721750 * sc(b);
  const clamp = (y) => (y > 0.022 ? y : y + Math.pow(0.022 - y, 1.414));
  let yt = clamp(Y(f)), yb = clamp(Y(b));
  if (Math.abs(yb - yt) < 0.0005) return 0;
  let c;
  if (yb > yt) c = (Math.pow(yb, 0.56) - Math.pow(yt, 0.57)) * 1.14; else c = (Math.pow(yb, 0.65) - Math.pow(yt, 0.62)) * 1.14;
  if (Math.abs(c) < 0.1) return 0;
  return Math.round((c > 0 ? c - 0.027 : c + 0.027) * 100);
}
const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[\s,\/]+/).map(Number); return { rgb: p.slice(0, 3), a: p[3] ?? 1 }; };
const blend = (f, a, b) => f.map((v, i) => Math.round(v * a + b[i] * (1 - a)));

async function inspect(page) {
  return page.evaluate(() => {
    const out = {};
    out.title = document.title;
    out.scrollW = document.documentElement.scrollWidth; out.clientW = document.documentElement.clientWidth;
    out.overflow = out.scrollW > out.clientW;
    // who widens the page
    if (out.overflow) {
      out.wide = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > out.clientW + 1 && r.width > 0; }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').join('.') : ''} right=${Math.round(el.getBoundingClientRect().right)}`);
    }
    out.headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName} ${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)}${h.closest('[aria-hidden=true]') ? ' (aria-hidden)' : ''}`);
    out.landmarks = [...document.querySelectorAll('main,nav,header,footer,aside,[role=main],[role=navigation],[role=banner],[role=contentinfo]')].map((l) => `${l.tagName.toLowerCase()}${l.getAttribute('aria-label') ? `[${l.getAttribute('aria-label')}]` : ''}`);
    out.imgs = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src.slice(-50));
    // focusables and accessible names (rough: aria-label > text > alt > title)
    const name = (el) => el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent.trim()) || el.textContent.trim().replace(/\s+/g, ' ') || el.querySelector('img')?.alt || el.getAttribute('title') || '';
    out.focusables = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),summary')].filter((el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; if (el.closest('[hidden]')) return false; return true; }).map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 40), name: name(el).slice(0, 60), hidden: !!el.closest('[aria-hidden=true]'), size: (() => { const r = el.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; })(), disabled: el.disabled || el.getAttribute('aria-disabled') === 'true' }));
    out.unnamed = out.focusables.filter((f) => !f.name && !f.disabled);
    out.ariaHiddenFocusable = out.focusables.filter((f) => f.hidden);
    // font sizes: every element with its own text, size against the cell table
    const cells = { 'Jacquard 24': 43, 'PARC Pixel Bold Web': 13.75, 'Jersey 15': 27, 'PARC Pixel Web': 6.25, 'Press Start 2P': 8 };
    const off = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode; if (!t.nodeValue.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const fam = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim(); const size = parseFloat(cs.fontSize);
      if (cells[fam]) { const cell = size / cells[fam]; if (Math.abs(cell - Math.round(cell)) > 0.01) off.add(`${fam} ${size}px (${cell.toFixed(2)} cells) <${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}>`); }
    }
    out.offTable = [...off];
    // text contrast: visible text nodes, their colour against the first opaque ancestor background
    const pairs = new Map();
    const bgOf = (el) => { let e = el; while (e) { const cs = getComputedStyle(e); const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[\s,\/]+/).map(Number); if ((p[3] ?? 1) > 0.95) return cs.backgroundColor; } if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('repeating')) return 'image'; e = e.parentElement; } return getComputedStyle(document.documentElement).backgroundColor; };
    const w2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const seen2 = new Set();
    while (w2.nextNode()) {
      const t = w2.currentNode; if (!t.nodeValue.trim()) continue; const el = t.parentElement; if (!el || seen2.has(el)) continue; seen2.add(el);
      if (el.closest('.sr-only,[aria-hidden=true],canvas,script,style,noscript')) continue;
      const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      // effective opacity up the tree
      let op = 1, e = el; while (e) { op *= parseFloat(getComputedStyle(e).opacity); e = e.parentElement; }
      const key = `${cs.color}|${bgOf(el)}|${op.toFixed(2)}|${Math.round(parseFloat(cs.fontSize))}|${cs.fontFamily.split(',')[0].replace(/['"]/g, '')}`;
      if (!pairs.has(key)) pairs.set(key, { color: cs.color, bg: bgOf(el), opacity: +op.toFixed(2), size: Math.round(parseFloat(cs.fontSize)), face: cs.fontFamily.split(',')[0].replace(/['"]/g, ''), sample: t.nodeValue.trim().slice(0, 40), where: `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')}` });
    }
    out.pairs = [...pairs.values()];
    out.canvases = document.querySelectorAll('canvas').length;
    out.sticky = [...document.querySelectorAll('*')].filter((el) => { const p = getComputedStyle(el).position; return p === 'sticky' || p === 'fixed'; }).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} ${getComputedStyle(el).position}`);
    out.inputFonts = [...document.querySelectorAll('input,textarea,select')].filter((i) => getComputedStyle(i).display !== 'none').map((i) => `${i.name || i.getAttribute('aria-label') || i.className} ${getComputedStyle(i).fontSize}`);
    out.viewportMeta = document.querySelector('meta[name=viewport]')?.content;
    out.lang = document.documentElement.lang;
    return out;
  });
}

const browser = await launch();
const results = {};
for (const [id, path] of PAGES) {
  results[id] = {};
  for (const width of WIDTHS) {
    for (const theme of (width === 1440 || width === 390) ? ['dark', 'light'] : ['dark']) {
      const ctx = await context(browser, { width, height: width <= 420 ? 844 : 900, theme, motion: 'off' });
      const page = await ctx.newPage(); const errors = collectErrors(page);
      await goto(page, path);
      const r = await inspect(page);
      r.errors = errors;
      // contrast evaluation
      r.contrast = r.pairs.map((p) => {
        const f = parse(p.color), b = p.bg === 'image' ? null : parse(p.bg);
        if (!f || !b) return { ...p, note: 'on image/texture' };
        const fg = blend(f.rgb, Math.min(1, f.a * p.opacity), b.rgb);
        return { ...p, fg: `rgb(${fg.join(',')})`, wcag: +wcag(fg, b.rgb).toFixed(2), apca: apca(fg, b.rgb) };
      }).filter((c) => c.wcag !== undefined && (c.wcag < 4.5 || Math.abs(c.apca) < 60));
      delete r.pairs;
      results[id][`${width}-${theme}`] = r;
      const tag = `${id}-${width}-${theme}`;
      await page.screenshot({ path: join(SHOTS, `${tag}.png`) });
      if (width === 1440 || width === 390) await page.screenshot({ path: join(SHOTS, `${tag}-full.png`), fullPage: true });
      await ctx.close();
      const flags = [r.overflow ? `OVERFLOW ${r.scrollW}>${r.clientW} ${JSON.stringify(r.wide)}` : '', r.unnamed.length ? `UNNAMED ${r.unnamed.length}` : '', r.ariaHiddenFocusable.length ? `HIDDEN-FOCUSABLE ${r.ariaHiddenFocusable.length}` : '', r.imgs.length ? `NOALT ${r.imgs.length}` : '', r.offTable.length ? `OFFTABLE ${r.offTable.length}` : '', r.contrast.length ? `CONTRAST ${r.contrast.length}` : '', r.errors.length ? `ERRORS ${r.errors.length}` : ''].filter(Boolean).join(' | ');
      console.log(`${tag.padEnd(28)} ${flags || 'ok'}`);
    }
  }
}
await browser.close();
writeFileSync(join(DATA, 'static.json'), JSON.stringify(results, null, 1));
console.log('wrote data/static.json');
