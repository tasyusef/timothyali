// Project covers (direction B, Timothy's pick, 2026-09-29; Jade added 2026-09-30, the rest keep their own):
// the work large and cropped by the frame on the project's own dark ground, a faint glow of its
// colour, and its logo large in the corner. Laid out at 1600×900 and rendered at 1.8× to
// 2880×1620. Everything comes from this repository: the screens and images in static/, the logos
// in ./marks (each project's own artwork in its version for dark grounds), Jacquard 24 from
// node_modules. Run from the project root: node tools/covers/generate.mjs [slug …]
// (no slugs: all of them).
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const url = (p) => 'file://' + encodeURI(ROOT + p);
const mark = (f) => readFileSync(ROOT + 'tools/covers/marks/' + f, 'utf8').replace(/<\?xml[^>]*>/, '');
const svgLogo = (f, h) => `<div class="lock"><span class="svg fit" style="height:${h}px">${mark(f)}</span></div>`;
const cached = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : existsSync(cached) ? { executablePath: cached } : {};

// the logo is laid in at a height; `fit` crops an artboard's viewBox to its drawing first
const covers = [
  {
    out: 'static/work/sonde/cover.png', ground: '#0B0D10', glow: '232,133,108', screen: 'static/work/sonde/cut/portfolio.png',
    logo: `<div class="lock" style="gap:22px"><span class="svg" style="height:60px;color:#E8856C">${mark('sonde-mark.svg')}</span><span class="svg" style="height:48px;color:#F4F4F0">${mark('sonde-wordmark.svg')}</span></div>`
  },
  {
    out: 'static/work/pocketwatch/cover.png', ground: '#141613', glow: '207,244,40', screen: 'static/work/pocketwatch/app-dashboard.png',
    logo: `<div class="lock"><span class="svg fit" style="height:76px">${mark('pocketwatch-lockup-dark.svg')}</span></div>`
  },
  {
    out: 'static/work/toolbox/cover.png', ground: '#11110e', glow: '242,214,0', screen: 'static/toolbox/home.png',
    logo: `<div class="lock" style="margin-top:-32px"><span style="font:400 120px/1 Jacquard;color:#f2d600">toolbox</span></div>`
  },
  { out: 'static/work/jade-aesthetics/cover.png', ground: '#16130f', glow: '184,145,58', screen: 'static/work/jade-aesthetics.jpg', logo: svgLogo('jade-logo-white.svg', 84) },
];
const only = process.argv.slice(2);
const slugOf = (c) => c.out.split('/').at(-2);

const page = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Jacquard;src:url(${url('node_modules/@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2')})}
html,body{margin:0}
body{width:1600px;height:900px;overflow:hidden;position:relative;background:radial-gradient(90% 80% at 100% 100%,rgba(${c.glow},.24),transparent 60%),${c.ground}}
.lock{position:absolute;left:72px;top:72px;display:flex;align-items:center}
.svg{display:block}.svg svg{display:block;height:100%;width:auto;fill:currentColor}
.win{position:absolute;left:420px;top:200px;width:1320px;border-radius:16px 0 0 0;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.09),0 -20px 120px rgba(0,0,0,.5)}
.win img{display:block;width:100%}
</style></head><body>${c.logo}<div class="win"><img src="${url(c.screen)}" alt=""></div></body></html>`;

const b = await chromium.launch({ ...launch, args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.8 });
const tmp = ROOT + 'tools/covers/.page.html';
for (const c of covers.filter((c) => !only.length || only.includes(slugOf(c)))) {
  writeFileSync(tmp, page(c));
  await p.goto('file://' + tmp, { waitUntil: 'load' });
  await p.evaluate(async () => {
    await document.fonts.ready;
    // an artboard logo: crop its viewBox to what is drawn on it
    for (const s of document.querySelectorAll('.fit svg')) { const r = s.getBBox(); s.setAttribute('viewBox', `${r.x} ${r.y} ${r.width} ${r.height}`); }
  });
  mkdirSync(ROOT + c.out.replace(/[^/]+$/, ''), { recursive: true });
  await p.screenshot({ path: ROOT + c.out });
  console.log(c.out);
}
rmSync(tmp, { force: true });
await b.close();
