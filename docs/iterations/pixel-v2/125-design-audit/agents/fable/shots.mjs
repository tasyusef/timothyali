// Screens and overflow sweep for the PX-125 audit (fable). Read-only: writes only into this folder.
// node docs/iterations/pixel-v2/125-design-audit/agents/fable/shots.mjs
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'shots');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:4173';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const WIDTHS = [1440, 1100, 900, 700, 420, 390, 320];
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

async function ctx(width, { theme = 'dark', motion = 'off', reduced = false } = {}) {
  const phone = width <= 420;
  const c = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await c.addInitScript(([t, m]) => { try { localStorage.setItem('tim-theme', t); if (m) localStorage.setItem('tim-motion', m); else localStorage.removeItem('tim-motion'); } catch {} }, [theme, motion === 'auto' ? '' : motion]);
  return c;
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

const overflowProbe = () => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const culprits = [];
  if (sw > vw) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1 && getComputedStyle(el).visibility !== 'hidden') {
        culprits.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} right=${Math.round(r.right)}`);
        if (culprits.length >= 6) break;
      }
    }
  }
  return { vw, sw, culprits, title: document.title, h: document.documentElement.scrollHeight };
};

// 1. the width sweep, dark, motion off (the static version of every motion piece)
for (const width of WIDTHS) {
  const c = await ctx(width);
  const page = await c.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const o = await page.evaluate(overflowProbe);
    results.push({ page: p, width, theme: 'dark', motion: 'off', ...o });
    await page.screenshot({ path: join(OUT, `${slug(p)}-${width}.png`) });
    if (width === 1440 || width === 390) await page.screenshot({ path: join(OUT, `${slug(p)}-${width}-full.png`), fullPage: true });
  }
  await c.close();
}

// 2. light theme at 1440 and 390, motion off
for (const width of [1440, 390]) {
  const c = await ctx(width, { theme: 'light' });
  const page = await c.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const o = await page.evaluate(overflowProbe);
    results.push({ page: p, width, theme: 'light', motion: 'off', ...o });
    await page.screenshot({ path: join(OUT, `${slug(p)}-${width}-light.png`) });
    if (['/', '/work/', '/work/parc/', '/toolbox/', '/contact/', '/nope/'].includes(p)) await page.screenshot({ path: join(OUT, `${slug(p)}-${width}-light-full.png`), fullPage: true });
  }
  await c.close();
}

// 3. motion on (a visitor's default), 1440 and 390, after the hero has started typing
for (const width of [1440, 390]) {
  const c = await ctx(width, { motion: 'auto' });
  const page = await c.newPage();
  for (const p of ['/', '/work/', '/work/parc/', '/toolbox/', '/contact/', '/nope/']) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await page.waitForTimeout(3200);
    const m = await page.evaluate(() => document.querySelector('.site')?.getAttribute('data-motion'));
    results.push({ page: p, width, theme: 'dark', motion: m, ...(await page.evaluate(overflowProbe)) });
    await page.screenshot({ path: join(OUT, `${slug(p)}-${width}-motion.png`) });
  }
  await c.close();
}

// 4. prefers-reduced-motion with no saved choice: the site should read it as motion off
{
  const c = await ctx(1440, { motion: 'auto', reduced: true });
  const page = await c.newPage();
  for (const p of ['/', '/work/parc/', '/toolbox/']) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const site = document.querySelector('.site');
      const cursors = [...document.querySelectorAll('.cursor')].map((el) => getComputedStyle(el).animationName);
      const decodes = [...document.querySelectorAll('.decode')].map((el) => ({ sr: el.querySelector('.sr-only')?.textContent, shown: el.querySelector('[aria-hidden]')?.textContent }));
      const videos = [...document.querySelectorAll('video')].map((v) => ({ paused: v.paused, autoplay: v.autoplay, muted: v.muted }));
      return { motion: site?.getAttribute('data-motion'), cursors: [...new Set(cursors)], decodesMatch: decodes.every((d) => d.sr === d.shown), decodes: decodes.length, videos };
    });
    // does the field still paint? compare the band twice, 1.2 s apart
    const band = page.locator('.band').first();
    const a = await band.screenshot();
    await page.waitForTimeout(1200);
    const b = await band.screenshot();
    results.push({ page: p, width: 1440, theme: 'dark', motion: 'reduced', ...r, fieldStill: a.equals(b) });
    await page.screenshot({ path: join(OUT, `${slug(p)}-1440-reduced.png`) });
  }
  await c.close();
}

// 5. 200% zoom equivalent: a 720px viewport (1440 at 200%), and 320 is 1280 at 400%
{
  const c = await ctx(720);
  const page = await c.newPage();
  for (const p of ['/', '/work/', '/work/parc/', '/toolbox/', '/toolbox/agents/', '/contact/']) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    results.push({ page: p, width: 720, theme: 'dark', motion: 'off', ...(await page.evaluate(overflowProbe)) });
    await page.screenshot({ path: join(OUT, `${slug(p)}-720.png`) });
  }
  await c.close();
}

await browser.close();
writeFileSync(join(HERE, 'sweep.json'), JSON.stringify(results, null, 1));
const over = results.filter((r) => r.sw > r.vw);
console.log(`captures: ${results.length}; horizontal overflow on ${over.length}`);
for (const r of over) console.log(`  ${r.page} @${r.width} ${r.theme}/${r.motion}: ${r.sw}>${r.vw} ${r.culprits.join(' | ')}`);
for (const r of results.filter((r) => r.motion === 'reduced')) console.log(`  reduced ${r.page}: motion=${r.motion}, cursors=${r.cursors}, decodes ok=${r.decodesMatch}, videos=${JSON.stringify(r.videos)}, field still=${r.fieldStill}`);
console.log('titles:', [...new Set(results.map((r) => `${r.page} => ${r.title}`))].join('\n  '));
