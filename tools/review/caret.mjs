// Block-caret check (0092): focus each Contact field, type, and capture the panel in
// both themes and both motion modes; report the caret's box against the field's.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
const OUT = 'tools/review/out/caret/'; mkdirSync(OUT, { recursive: true });
const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b = await chromium.launch({ executablePath: EXE });
for (const [theme, motion] of [['dark', 'off'], ['light', 'off'], ['dark', 'on']]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t, m]) => { try { localStorage.setItem('tim-motion', m); localStorage.setItem('tim-theme', t); } catch {} }, [theme, motion]);
  const p = await ctx.newPage(); const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto('http://localhost:4173/contact/', { waitUntil: 'networkidle' });
  await p.fill('input[name=name]', 'Ada Lovelace');
  await p.fill('input[name=email]', 'ada@example.com');
  await p.click('textarea'); await p.keyboard.type('A small tool for a team that is still finding its shape. Something that wraps to a second line so the caret has to follow it.');
  await p.waitForTimeout(300);
  const geo = await p.evaluate(() => [...document.querySelectorAll('.box')].map((box) => { const f = box.firstElementChild.getBoundingClientRect(); const c = box.querySelector('.caret'); const r = c.getBoundingClientRect(); return { field: f.height, hidden: c.style.display === "none", caret: { x: r.left - f.left, y: r.top - f.top, w: r.width, h: r.height }, blink: getComputedStyle(c).animationName }; }));
  console.log(theme, motion, JSON.stringify(geo), 'errors', errors.length);
  await p.locator('.contact-form').screenshot({ path: OUT + `form-${theme}-${motion}.png` });
  await p.keyboard.press('Home'); await p.waitForTimeout(100);
  await p.locator('.contact-form').screenshot({ path: OUT + `form-${theme}-${motion}-home.png` });
  await p.click('input[name=name]'); await p.keyboard.press('End'); await p.waitForTimeout(100);
  await p.locator('.contact-form').screenshot({ path: OUT + `form-${theme}-${motion}-name.png` });
  await ctx.close();
}
await b.close();
