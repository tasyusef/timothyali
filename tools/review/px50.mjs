// Screenshots for the repositioning pass (PX-50): the first screen of each route the pass
// touches, plus the full Home and Work pages, at 1440 and 390, from a given origin, into a
// given folder. A route the origin does not have (the live site before /work/toolbox/) is skipped.
//   node tools/review/px50.mjs <origin> <outdir>
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
const [origin = 'http://127.0.0.1:4173', out = 'tools/review/out/px50'] = process.argv.slice(2);
const exe = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: exe });
const routes = ['/', '/work/', '/work/sonde/', '/work/pocketwatch/', '/work/toolbox/', '/contact/'];
const full = new Set(['/', '/work/']);
for (const width of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); } catch {} });
  const p = await ctx.newPage();
  for (const path of routes) {
    const res = await p.goto(origin + path, { waitUntil: 'networkidle' });
    if (!res || res.status() !== 200) { console.log(width, path, 'skipped', res?.status()); continue; }
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
    const name = path === '/' ? 'home' : path.replaceAll('/', ' ').trim().replaceAll(' ', '-');
    await p.screenshot({ path: `${out}/${width}-${name}-fold.png` });
    if (full.has(path)) await p.screenshot({ path: `${out}/${width}-${name}-full.png`, fullPage: true });
    console.log(width, path, 'ok');
  }
  await ctx.close();
}
await b.close();
