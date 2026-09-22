// Screenshots for the hiring-fit pass (PX-43): the first screen and the full page for the
// routes the pass touches, at 1440 and 390, from a given origin, into a given folder.
//   node tools/review/hiring-fit.mjs <origin> <outdir>
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
const [origin = 'http://127.0.0.1:4173', out = 'tools/review/out/hiring-fit'] = process.argv.slice(2);
const exe = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: exe });
const routes = ['/', '/work/', '/work/parc/', '/work/jade-aesthetics/', '/contact/'];
for (const width of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); } catch {} });
  const p = await ctx.newPage();
  for (const path of routes) {
    await p.goto(origin + path, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
    const name = path === '/' ? 'home' : path.replaceAll('/', ' ').trim().replaceAll(' ', '-');
    await p.screenshot({ path: `${out}/${width}-${name}-fold.png` });
    await p.screenshot({ path: `${out}/${width}-${name}-full.png`, fullPage: true });
    console.log(width, path, 'ok');
  }
  await ctx.close();
}
await b.close();
