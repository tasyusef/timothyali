// PX-18 captures: the Work page and the four new studies at 1440 and 390, full page,
// into docs/iterations/pixel-v2/18-full-index/. Motion is forced off so the seeded
// textures draw one frame. Pages are scrolled in steps so every lazy image loads, then
// each image is awaited with a timeout — the PARC Website study is 17,000px tall with 29
// images and `networkidle` plus a bare `decode()` hung on it.
//
//   node tools/review/px18.mjs                 # everything
//   node tools/review/px18.mjs parc-site       # only routes whose name matches
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const OUT = 'docs/iterations/pixel-v2/18-full-index/';
const PATHS = ['/work/', '/work/firststrike/', '/work/sonde/', '/work/parc-site/', '/work/jade-aesthetics/','/work/pocketwatch/'];
const name = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replaceAll('/', '-'));
const only = process.argv[2];

mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: EXE });
for (const width of [1440, 390]) {
  for (const path of PATHS) {
    if (only && !path.includes(only)) continue;
    const ctx = await b.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => {
      try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); localStorage.setItem('tim-grid', 'off'); } catch {}
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`http://localhost:4173${path}`, { waitUntil: 'load', timeout: 60000 });
    // scroll the whole page in viewport steps so every lazy image is asked for
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    // wait for the images, but never forever
    const ready = await page.evaluate(async () => {
      const wait = (img) => new Promise((res) => {
        if (img.complete) return res(1);
        const done = () => res(1);
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 20000);
      });
      await Promise.all([...document.images].map(wait));
      return [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length;
    });
    await page.waitForTimeout(400);
    const file = `${OUT}${name(path)}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true, timeout: 180000 });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
    console.log(file, 'height', h, 'images', ready, 'errors', errors.length, 'broken', broken.length, broken.join(' '));
    await ctx.close();
  }
}
await b.close();
