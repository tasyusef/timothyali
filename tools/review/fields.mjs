// Band captures for the ASCII field treatment (0091): viewport crops of every
// field on the site in both themes at 1440, plus the Contact band at 390.
//
//   node tools/review/fields.mjs before|after     # into out/fields-<tag>/
//
// Motion is forced off (as in parity.mjs) so each field draws one static frame.
// Expects the static server on 4173 serving build/.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const OUT = 'tools/review/out/fields-' + (process.argv[2] ?? 'after') + '/';
const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
mkdirSync(OUT, { recursive: true });
const SHOTS = [
  { name: 'home-hero', path: '/', sel: '.hero' },
  { name: 'home-rain', path: '/', sel: '.work-rain' },
  { name: 'contact', path: '/contact/', sel: '.contact' },
  { name: 'not-found', path: '/not-found.html', sel: '.lost' }
];
const b = await chromium.launch({ executablePath: EXE });
for (const [width, theme] of [[1440, 'dark'], [1440, 'light'], [390, 'dark']]) {
  for (const s of SHOTS) {
    if (width === 390 && s.name !== 'contact' && s.name !== 'home-hero') continue;
    const ctx = await b.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await ctx.addInitScript(([t]) => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', t); localStorage.setItem('tim-grid', 'off'); } catch {} }, [theme]);
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    await p.goto('http://localhost:4173' + s.path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    const el = p.locator(s.sel).first();
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    const file = `${s.name}-${width}-${theme}.png`;
    await el.screenshot({ path: OUT + file });
    console.log('CAPTURE', file, 'errors', errors.length, errors.join(' | '));
    await ctx.close();
  }
}
await b.close();
