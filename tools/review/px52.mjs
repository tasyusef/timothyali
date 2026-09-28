// PX-52 study layout: every study at 1440 and 390, motion off, dark theme: the first screen,
// the whole page at a quarter (desktop) or half (phone) size, and each page's length in
// screens, from a given origin into a given folder. JPEG, to keep the evidence light.
//   node tools/review/px52.mjs <origin> <outdir>
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { studies } from '../../src/lib/work.ts';
const [origin = 'http://127.0.0.1:4173', out = 'tools/review/out/px52'] = process.argv.slice(2);
const exe = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: exe });
const report = {};
for (const width of [1440, 390]) {
  const height = width === 390 ? 844 : 900;
  const ctx = await b.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); } catch {} });
  const p = await ctx.newPage();
  for (const s of studies) {
    await p.goto(`${origin}/work/${s.slug}/`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += height) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(100); }
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    const m = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth }));
    await p.screenshot({ path: `${out}/${width}-${s.slug}-fold.jpg`, type: 'jpeg', quality: 72 });
    const tmp = `${out}/.tmp.png`;
    await p.screenshot({ path: tmp, fullPage: true });
    const scale = width === 390 ? 0.5 : 0.25;
    execSync(`python3 -c "from PIL import Image; im=Image.open('${tmp}'); im.resize((int(im.size[0]*${scale}), int(im.size[1]*${scale}))).convert('RGB').save('${out}/${width}-${s.slug}-page.jpg', quality=72, optimize=True)"`);
    unlinkSync(tmp);
    report[`${width} ${s.slug}`] = { screens: +(m.h / height).toFixed(1), overflow: m.sw > width };
    console.log(width, s.slug, (m.h / height).toFixed(1), 'screens', m.sw > width ? 'OVERFLOW' : '');
  }
  await ctx.close();
}
writeFileSync(`${out}/lengths.json`, JSON.stringify(report, null, 2));
await b.close();
