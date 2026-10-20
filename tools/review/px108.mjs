// PX-108 (0210) evidence: what the design-system pass changed that a still capture shows.
// Text selected on the dark panels (it was invisible), Contact on a phone, the Toolbox
// command plate. Against `pnpm preview` on 4173.
import { chromium } from '@playwright/test';
const out = 'docs/iterations/pixel-v2/108-design-system/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
async function shot(path, width, height, name, fn) {
  const c = await b.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
  await c.addInitScript(() => { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); });
  const p = await c.newPage(); await p.goto('http://127.0.0.1:4173' + path); await p.evaluate(() => document.fonts.ready);
  const el = await fn(p); await p.waitForTimeout(400);
  await el.screenshot({ path: out + name, style: '.nav-chrome{visibility:hidden!important}' }); await c.close();
}
const select = (sel, from, to) => (p) => p.evaluate(([sel, from, to]) => {
  const root = document.querySelector(sel); const a = root.querySelector(from), z = root.querySelector(to);
  const r = document.createRange(); r.setStart(a.firstChild, 0); r.setEnd(z.firstChild, Math.min(9, z.firstChild.length));
  getSelection().removeAllRanges(); getSelection().addRange(r); root.scrollIntoView({ block: 'center' });
}, [sel, from, to]);
await shot('/toolbox/', 1440, 900, 'toolbox-panel-selection.png', async (p) => { await select('.machine', '.machine-copy p', '.command-plate code')(p); return p.locator('.machine'); });
await shot('/contact/', 1440, 900, 'contact-note-selection.png', async (p) => { await select('.contact-note', 'p', 'p:last-of-type')(p); return p.locator('.contact-note'); });
await shot('/contact/', 390, 844, 'contact-390.png', async (p) => p.locator('main'));
await b.close();
console.log('captured');
