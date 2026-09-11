// Validation notes check (0092): submit the Contact form empty, then with a bad
// address; capture the panel and report notes, focus and aria wiring.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
const OUT = 'tools/review/out/caret/'; mkdirSync(OUT, { recursive: true });
const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b = await chromium.launch({ executablePath: EXE });
for (const theme of ['dark', 'light']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t]) => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', t); } catch {} }, [theme]);
  const p = await ctx.newPage(); const errors = []; const posts = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('request', (r) => { if (r.method() === 'POST') posts.push(r.url()); });
  await p.goto('http://localhost:4173/contact/', { waitUntil: 'networkidle' });
  await p.click('button[type=submit]'); await p.waitForTimeout(300);
  const state = () => p.evaluate(() => ({ notes: [...document.querySelectorAll('.note')].map((n) => n.id + ': ' + n.textContent), focused: document.activeElement?.getAttribute('name'), invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.getAttribute('name') + '→' + e.getAttribute('aria-describedby')), noteTops: [...document.querySelectorAll('.note')].map((n) => n.getBoundingClientRect().top + scrollY), noteH: [...document.querySelectorAll('.note')].map((n) => n.getBoundingClientRect().height) }));
  console.log(theme, 'empty', JSON.stringify(await state()));
  await p.locator('.contact-form').screenshot({ path: OUT + `notes-${theme}-empty.png` });
  await p.fill('input[name=name]', 'Ada'); await p.fill('input[name=email]', 'not an address'); await p.fill('textarea', 'hi');
  await p.click('button[type=submit]'); await p.waitForTimeout(300);
  console.log(theme, 'bad email', JSON.stringify(await state()), 'posts', posts.length, 'errors', errors.length);
  await p.locator('.contact-form').screenshot({ path: OUT + `notes-${theme}-email.png` });
  await ctx.close();
}
await b.close();
