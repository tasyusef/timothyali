// The tactility pass (0099–0107): frames of the theme wipe, the route wipe and an image's
// arrival with their animations paused and seeked; press states under a held mouse
// button; the focus ring's colour on both grounds in both themes; the readout's path
// decoding after a navigation and its scroll offset; the field cursor; the strip's
// height with a Decode in it; and the same moments with motion off, which must be
// instant. Preview server on 4173. `node tools/review/tactility.mjs`
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { PNG } from 'pngjs';
const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = 'tools/review/out/tactility/'; mkdirSync(OUT, { recursive: true });
const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b = await chromium.launch({ executablePath: EXE });
const YELLOW = [242, 214, 0], DEEP = [111, 98, 0], WHITE = [244, 244, 240], INK = [17, 17, 14];
const near = (a, b) => a.every((v, i) => Math.abs(v - b[i]) < 6);
const rgb = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
let fails = 0; const check = (ok, msg) => { console.log((ok ? '  ok   ' : '  FAIL ') + msg); if (!ok) fails++; };
async function ctx(theme, motion, width = 1440) {
  const c = await b.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await c.addInitScript(([t, m]) => { try { localStorage.setItem('tim-motion', m); localStorage.setItem('tim-theme', t); } catch {} window.__vt = 0; const o = document.startViewTransition?.bind(document); if (o) document.startViewTransition = (u) => { window.__vt++; return o(u); }; }, [theme, motion]);
  const p = await c.newPage(); p.on('pageerror', (e) => console.log('  pageerror', String(e)));
  return [c, p];
}
const go = (p, path) => p.goto(BASE + path, { waitUntil: 'networkidle' }).then(() => p.evaluate(() => document.fonts.ready)).then(() => p.waitForTimeout(300));
// pause every animation on a pseudo-element (the view transition's) and seek it
// the transition's animations start a frame after the call, once the old page is captured
const pseudoAnims = (p) => p.waitForFunction(() => { const a = document.getAnimations().filter((a) => a.effect.pseudoElement); return a.length ? a.map((a) => ({ pseudo: a.effect.pseudoElement, name: a.animationName, duration: Math.round(a.effect.getTiming().duration), delay: Math.round(a.effect.getTiming().delay) })) : null; }, null, { timeout: 1500 }).then((h) => h.jsonValue());
const seek = (p, t) => p.evaluate((t) => document.getAnimations().filter((a) => a.effect.pseudoElement).forEach((a) => { a.pause(); a.currentTime = t; }), t);
const play = (p) => p.evaluate(() => document.getAnimations().forEach((a) => a.play()));
const clip = { x: 0, y: 0, width: 720, height: 450 };

// --- theme wipe (0100) -------------------------------------------------------
console.log('theme wipe, motion on');
{
  const [c, p] = await ctx('dark', 'on'); await go(p, '/');
  await p.evaluate(() => document.querySelectorAll('.global-footer button')[2].click());
  await p.waitForTimeout(15);
  const anims = await pseudoAnims(p);
  check(anims.some((a) => a.name === 'dither-in' && a.pseudo === '::view-transition-new(root)' && a.duration === 210), 'new(root) runs dither-in for 210ms: ' + JSON.stringify(anims));
  check(await p.evaluate(() => document.documentElement.classList.contains('vt-theme')), 'html carries .vt-theme during the wipe');
  for (const t of [10, 80, 150]) { await seek(p, t); await p.waitForTimeout(30); await p.screenshot({ path: OUT + `theme-${t}.png`, clip }); }
  await play(p); await p.waitForTimeout(400);
  check(await p.evaluate(() => document.documentElement.dataset.theme === 'light' && !document.documentElement.className), 'lands on light with the class removed');
  await c.close();
}
console.log('theme flip, motion off');
{
  const [c, p] = await ctx('dark', 'off'); await go(p, '/');
  await p.evaluate(() => document.querySelectorAll('.global-footer button')[2].click());
  await p.waitForTimeout(15);
  check(await p.evaluate(() => window.__vt === 0 && document.documentElement.dataset.theme === 'light'), 'no view transition, theme flipped at once');
  await c.close();
}

// --- route wipe (0104) -------------------------------------------------------
console.log('route wipe, motion on');
{
  const [c, p] = await ctx('dark', 'on'); await go(p, '/');
  await p.click('.site-header nav a[href="/work/"]', { noWaitAfter: true });
  await p.waitForTimeout(15);
  const anims = await pseudoAnims(p);
  check(anims.some((a) => a.name === 'dither-out' && a.pseudo === '::view-transition-old(root)' && a.duration === 165), 'old(root) runs dither-out for 165ms');
  check(anims.some((a) => a.name === 'dither-in' && a.pseudo === '::view-transition-new(root)' && a.delay === 165), 'new(root) runs dither-in after it');
  check(await p.evaluate(() => document.documentElement.classList.contains('vt-route')), 'html carries .vt-route');
  const bg = await p.evaluate(() => getComputedStyle(document.documentElement, '::view-transition').backgroundImage);
  check(bg.includes('repeating-conic-gradient'), 'the field checker sits between: ' + bg.slice(0, 60));
  for (const t of [10, 100, 200, 300]) { await seek(p, t); await p.waitForTimeout(30); await p.screenshot({ path: OUT + `route-${t}.png`, clip }); }
  await play(p); await p.waitForTimeout(600);
  check(await p.evaluate(() => location.pathname === '/work/' && !document.documentElement.className), 'lands on /work/ with the class removed');
  await c.close();
}
console.log('route change, motion off');
{
  const [c, p] = await ctx('dark', 'off'); await go(p, '/');
  await p.click('.site-header nav a[href="/work/"]'); await p.waitForTimeout(300);
  check(await p.evaluate(() => window.__vt === 0 && location.pathname === '/work/'), 'no view transition, page swapped');
  check(await p.evaluate(() => document.querySelector('.path-full [aria-hidden]').textContent === 'work'), 'path shown at once with motion off');
  await c.close();
}
console.log('hash jump on the same path');
{
  const [c, p] = await ctx('dark', 'on'); await go(p, '/toolbox/');
  await p.click('.hero-actions a.cta'); await p.waitForTimeout(800);
  check(await p.evaluate(() => window.__vt === 0 && location.hash === '#tools'), 'no view transition on #tools');
  await c.close();
}

// --- readout: path decodes, scroll offset (0102, 0105) -----------------------
console.log('readout');
{
  const [c, p] = await ctx('dark', 'on'); await go(p, '/');
  const strip = await p.evaluate(() => ({ readout: document.querySelector('.readout').getBoundingClientRect().height, path: document.querySelector('.readout .path').getBoundingClientRect().height, decode: document.querySelector('.path-full .decode').getBoundingClientRect().height }));
  check(strip.readout === 32 && strip.path === 16 && strip.decode === 16, 'strip 32, path 16, decode 16: ' + JSON.stringify(strip));
  await p.click('.site-header nav a[href="/work/"]', { noWaitAfter: true });
  const samples = []; for (let i = 0; i < 24; i++) { samples.push(await p.evaluate(() => document.querySelector('.path-full [aria-hidden]').textContent)); await p.waitForTimeout(40); }
  const distinct = [...new Set(samples)];
  check(distinct.length > 2 && samples.at(-1) === 'work', `path scrambled then settled: ${distinct.slice(0, 5).join(' | ')} … ${samples.at(-1)}`);
  await p.evaluate(() => window.scrollTo({ top: 808, behavior: 'instant' })); await p.waitForTimeout(150);
  check(await p.evaluate(() => document.querySelector('.st-scroll').textContent) === '+0101', 'scroll readout +0101 at 808px');
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(150);
  check(await p.evaluate(() => document.querySelector('.st-scroll').textContent) === '+0000', 'back to +0000');
  await p.screenshot({ path: OUT + 'readout-1440.png', clip: { x: 0, y: 64, width: 1440, height: 32 } });
  await c.close();
  const [c2, p2] = await ctx('dark', 'on', 390); await go(p2, '/work/parc/');
  const s = await p2.evaluate(() => ({ readout: document.querySelector('.readout').getBoundingClientRect().height, text: document.querySelector('.path-short').textContent.replace(/^(.*?)(\S+)$/, '$1'), scroll: document.querySelector('.st-scroll').textContent, right: document.querySelector('.st-scroll').getBoundingClientRect().right }));
  check(s.readout === 32 && s.right <= 390 - 16, 'at 390 the strip is 32 and the scroll readout fits: ' + JSON.stringify(s));
  await p2.screenshot({ path: OUT + 'readout-390.png', clip: { x: 0, y: 104, width: 390, height: 32 } });
  await c2.close();
}

// --- image arrival (0101) ----------------------------------------------------
console.log('image arrival');
{
  const [c, p] = await ctx('dark', 'on');
  // hold every cover back so it cannot be complete before the page is up
  await c.route(/\/work\/.*\.(webp|jpg|png)$/, async (route) => { await new Promise((r) => setTimeout(r, 400)); route.continue(); });
  await p.goto(BASE + '/work/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(100);
  const anim = await p.waitForFunction(() => { const a = document.getAnimations().find((x) => x.animationName === 'dither-in' && x.effect.target?.tagName === 'IMG'); if (!a) return null; a.pause(); a.currentTime = 10; return { duration: Math.round(a.effect.getTiming().duration), cls: a.effect.target.classList.contains('arrive') ? 'arrive' : a.effect.target.className }; }, null, { timeout: 5000 }).then((h) => h.jsonValue());
  check(anim.duration === 210 && anim.cls === 'arrive', 'a cover runs dither-in for 210ms: ' + JSON.stringify(anim));
  const pic = p.locator('img.arrive').first();
  for (const t of [10, 80, 150]) { await p.evaluate((t) => document.getAnimations().filter((x) => x.animationName === 'dither-in').forEach((a) => { a.pause(); a.currentTime = t; }), t); await p.waitForTimeout(30); await pic.screenshot({ path: OUT + `image-${t}.png` }); }
  await play(p);
  await c.close();
  const [c2, p2] = await ctx('dark', 'off');
  await c2.route(/\/work\/.*\.(webp|jpg|png)$/, async (route) => { await new Promise((r) => setTimeout(r, 400)); route.continue(); });
  await p2.goto(BASE + '/work/', { waitUntil: 'networkidle' }); await p2.waitForTimeout(200);
  check(await p2.evaluate(() => [...document.querySelectorAll('img.arrive')].every((i) => getComputedStyle(i).animationName === 'none')), 'motion off: images arrive with no animation');
  await c2.close();
}

// --- press states (0099) -----------------------------------------------------
console.log('press');
{
  const cases = [
    ['/', '.site-header nav a[href="/work/"]'], ['/', '.global-footer button >> nth=0'], ['/', '.hero-hint'], ['/', '.card >> nth=0'], ['/', '.work-foot .cta-quiet'], ['/', '.invitation .cta-row'],
    ['/work/', '.row >> nth=0'], ['/work/', '.entry >> nth=0'], ['/work/parc/', '.quiet-link.pad'], ['/work/parc/', '.next .cta-row'],
    ['/contact/', '.send button'], ['/contact/', '.contact-note .quiet-link'],
    ['/toolbox/', '.tool-picker button >> nth=1'], ['/toolbox/', '.demo .chip >> nth=0'], ['/toolbox/', '.demo .switch >> nth=0'], ['/toolbox/', '.machine .quiet-link']
  ];
  const [c, p] = await ctx('dark', 'off');
  let last = '';
  for (const [path, sel] of cases) {
    if (path !== last) { await go(p, path); last = path; }
    const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(100);
    const box = await el.boundingBox();
    // the sample: the block's own ground (its mat for a card/row), 3px in from the top-left
    const probe = sel.includes('.card') ? '.card' : sel.includes('.row') ? '.row .frame' : sel.includes('.entry') ? '.entry .cta-quiet' : sel.includes('.switch') ? '.switch' : null;
    const target = probe ? p.locator(probe).first() : el;
    const tb = await target.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(50);
    const hover = await target.evaluate((e) => getComputedStyle(e).backgroundColor);
    await p.mouse.down(); await p.waitForTimeout(50);
    const press = await target.evaluate((e) => ({ bg: getComputedStyle(e).backgroundColor, color: getComputedStyle(e).color, shadow: getComputedStyle(e).boxShadow }));
    const shot = await p.screenshot({ clip: { x: Math.max(0, tb.x - 16), y: Math.max(0, tb.y - 16), width: Math.min(tb.width + 32, 600), height: Math.min(tb.height + 32, 400) } });
    const png = PNG.sync.read(shot);
    const sx = 16 + 3, sy = 16 + 3; const k = (sy * png.width + sx) * 4; const px = [png.data[k], png.data[k + 1], png.data[k + 2]];
    const name = (path + sel).replace(/[^a-z0-9]+/gi, '-');
    require_ok: { const ok = near(rgb(press.bg), YELLOW) || near(px, YELLOW) || (press.shadow !== 'none' && press.shadow.includes('242, 214, 0')); check(ok, `${path} ${sel}: hover ${hover} → press ${press.bg}${press.shadow !== 'none' ? ' + shadow' : ''}; pixel ${px}`); }
    await p.screenshot({ path: OUT + `press-${name}.png`, clip: { x: Math.max(0, tb.x - 16), y: Math.max(0, tb.y - 16), width: Math.min(tb.width + 32, 600), height: Math.min(tb.height + 32, 400) } });
    await p.mouse.up(); await p.mouse.move(0, 0); await p.waitForTimeout(50);
    if (sel.includes('nav a') || sel.includes('.card') || sel.includes('.row') || sel.includes('.entry') || sel.includes('cta-row') || sel.includes('quiet') || sel.includes('cta-quiet') || sel.includes('hero-hint') || sel.includes('tool-picker')) { await go(p, path); }
  }
  await c.close();
}

// --- focus ring (0106) -------------------------------------------------------
console.log('focus');
for (const theme of ['dark', 'light']) {
  const [c, p] = await ctx(theme, 'off'); await go(p, '/contact/');
  const seen = [];
  for (let i = 0; i < 14; i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { tag: e.tagName, cls: (e.className || '').toString().slice(0, 24), text: (e.textContent || '').trim().slice(0, 20), outline: cs.outlineColor, w: cs.outlineWidth, off: cs.outlineOffset, ground: getComputedStyle(e.closest('.contact-note') || e.closest('.who') || document.body).backgroundColor }; });
    seen.push(f);
  }
  const onPaper = seen.find((f) => f.cls.includes('skip-link')) || seen[0];
  const inPanel = seen.find((f) => f.tag === 'INPUT');
  const link = seen.find((f) => f.text.startsWith('Or message'));
  const want = theme === 'dark' ? YELLOW : DEEP, wantPanel = theme === 'dark' ? DEEP : YELLOW;
  check(onPaper && near(rgb(onPaper.outline), want) && onPaper.w === '2px', `${theme}: on the paper the ring is ${onPaper?.outline} (${onPaper?.cls || onPaper?.tag})`);
  check(inPanel && near(rgb(inPanel.outline), wantPanel) && inPanel.off === '2px', `${theme}: in the ink panel a field's ring is ${inPanel?.outline}, offset ${inPanel?.off}`);
  check(link && near(rgb(link.outline), wantPanel), `${theme}: the panel's quiet link ring is ${link?.outline}`);
  await p.locator('.contact-note').screenshot({ path: OUT + `focus-${theme}.png` });
  await c.close();
}

// --- the field cursor (0103) -------------------------------------------------
console.log('cursor');
for (const theme of ['dark', 'light']) {
  const [c, p] = await ctx(theme, 'off'); await go(p, '/');
  const cur = await p.evaluate(() => ({ band: getComputedStyle(document.querySelector('.band')).cursor, link: getComputedStyle(document.querySelector('.hero-hint')).cursor, body: getComputedStyle(document.body).cursor }));
  check(cur.band.includes(`field-${theme}.png`) && /\) 7 7, crosshair$/.test(cur.band), `${theme}: .band cursor is the field crosshair, hotspot 7 7: …${cur.band.slice(-60)}`);
  check(cur.body === 'auto', 'the page keeps the browser cursor');
  const files = await Promise.all([`field-${theme}.png`, `field-${theme}@2x.png`].map((f) => p.evaluate(async (f) => { const r = await fetch('/cursor/' + f); return r.status; }, f)));
  check(files.every((s) => s === 200), 'both cursor files served');
  await c.close();
}

// --- scrollbar (0107) --------------------------------------------------------
console.log('scrollbar');
{
  const [c, p] = await ctx('dark', 'off'); await go(p, '/');
  const sb = await p.evaluate(() => { const s = [...document.styleSheets].flatMap((ss) => { try { return [...ss.cssRules]; } catch { return []; } }).map((r) => r.cssText).filter((t) => t.includes('-webkit-scrollbar')); return { rules: s.length, sample: s.find((t) => t.includes('thumb')) }; });
  check(sb.rules >= 5, `${sb.rules} scrollbar rules parsed; thumb: ${sb.sample?.slice(0, 90)}`);
  await c.close();
}
await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nall clear');
process.exit(fails ? 1 : 0);
