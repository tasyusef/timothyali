// opus reviewer, PX-128: landmarks, headings, names, lang, titles, images without alt, duplicate ids.
import { chromium } from '@playwright/test';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
for (const p of PAGES) {
  await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName[1]}:${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 22)}`);
    let skip = []; let prev = 0; for (const h of hs) { const l = +h[0]; if (prev && l > prev + 1) skip.push(h); prev = l; }
    const ids = {}; for (const e of document.querySelectorAll('[id]')) ids[e.id] = (ids[e.id] || 0) + 1;
    const dup = Object.entries(ids).filter(([, n]) => n > 1).map(([k]) => k);
    const noalt = [...document.querySelectorAll('img:not([alt])')].length;
    const unnamed = [...document.querySelectorAll('a[href],button')].filter((e) => !e.closest('[hidden]') && !(e.getAttribute('aria-label') || e.textContent.trim() || e.querySelector('img[alt]:not([alt=""])'))).map((e) => e.outerHTML.slice(0, 60));
    const groups = [...document.querySelectorAll('[role=group]')].filter((g) => !g.getAttribute('aria-label') && !g.getAttribute('aria-labelledby')).map((g) => g.id || g.className);
    return { lang: document.documentElement.lang, h1: hs.filter((h) => h[0] === '1').length, hs: hs.join(' > '), skip, dup, noalt, unnamed, mains: document.querySelectorAll('main').length, groups };
  });
  console.log(`${p} lang=${r.lang} mains=${r.mains} h1s=${r.h1} skips=${r.skip.join(',')} dupIds=${r.dup.join(',')} noAlt=${r.noalt} unnamed=${r.unnamed.join(' ')} unlabelledGroups=${r.groups.join(',')}\n   ${r.hs}`);
}
await browser.close();
