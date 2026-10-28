// Hover and press on links, CTAs and cards; the field's swell and ripples; reduced motion.
import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
const B = 'http://127.0.0.1:4173';
const diff = (a, b) => { const x = PNG.sync.read(a), y = PNG.sync.read(b); let n = 0; for (let i = 0; i < x.data.length; i += 4) if (Math.abs(x.data[i] - y.data[i]) + Math.abs(x.data[i + 1] - y.data[i + 1]) + Math.abs(x.data[i + 2] - y.data[i + 2]) > 30) n++; return n; };
const browser = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((t) => { localStorage.setItem('tim-theme', t); }, theme);
  const page = await ctx.newPage();
  const look = (sel) => page.$eval(sel, (el) => { const c = getComputedStyle(el); return `bg=${c.backgroundColor} fg=${c.color} tf=${c.transform} cursor=${c.cursor}`; });
  const probe = async (label, sel) => {
    const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded({ timeout: 5000 }); await page.mouse.move(5, 5); await page.waitForTimeout(150);
    const rest = await look(sel); await el.hover(); await page.waitForTimeout(150); const hov = await look(sel);
    const b = await el.boundingBox(); await page.mouse.down(); await page.waitForTimeout(80); const press = await look(sel); await page.mouse.move(2, 2); await page.mouse.up(); await page.waitForTimeout(100);
    console.log(theme, label, '\n   rest ', rest, '\n   hover', hov, '\n   press', press);
  };
  await page.goto(B + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
  // the field: hover swell and click ripple on the bare sky
  const clip = { x: 1000, y: 150, width: 300, height: 250 };
  await page.mouse.move(10, 890); await page.waitForTimeout(1500);
  const a = await page.screenshot({ clip }); await page.mouse.move(1150, 275, { steps: 8 }); await page.waitForTimeout(250); const h = await page.screenshot({ clip });
  await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(400); const r = await page.screenshot({ clip });
  console.log(theme, 'FIELD changed px: hover', diff(a, h), 'ripple', diff(h, r));
  if (theme === 'dark') { (await import('node:fs')).writeFileSync('shots/field-ripple-dark.png', r); }
  // double click beside the hero text selects nothing (0225)
  await page.mouse.dblclick(1000, 640); console.log(theme, 'dblclick on field selection:', JSON.stringify(await page.evaluate(() => getSelection().toString())));
  await probe('nav link', 'nav[aria-label="Main navigation"] a:not([aria-current])');
  await probe('hero hint', '.hero-hint');
  await probe('quiet Resume', '.hero-actions .quiet-link');
  await probe('card', '.cards .card');
  await probe('invite row', '.invitation .cta-row');
  await page.goto(B + '/work/parc/', { waitUntil: 'networkidle' });
  await probe('study next row', 'section.next .cta-row');
  await probe('study page-foot link', '.page-foot a');
  await probe('study meta link', 'main .meta a');
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  await probe('tool picker (unpressed)', '.tool-picker button[aria-pressed=false]');
  await probe('download link', '.downloads .files a');
  await ctx.close();
}
// reduced motion, no saved choice
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(B + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(3500);
console.log('RM motion', await page.$eval('.site', (s) => s.dataset.motion), 'h1', await page.$eval('h1', (h) => h.textContent), 'anims', await page.evaluate(() => document.getAnimations().length));
const clip = { x: 1000, y: 150, width: 300, height: 250 };
await page.mouse.move(10, 890); await page.waitForTimeout(800); const a = await page.screenshot({ clip });
await page.mouse.move(1150, 275, { steps: 8 }); await page.waitForTimeout(250); const h = await page.screenshot({ clip });
await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(400); const r = await page.screenshot({ clip });
console.log('RM field changed px: hover', diff(a, h), 'ripple', diff(h, r));
const t0 = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } }); await page.waitForTimeout(2000); const t1 = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log('RM idle change over 2s px', diff(t0, t1));
await page.goto(B + '/work/do-androids-dream/', { waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
console.log('RM video paused', await page.$$eval('video', (vs) => vs.map((v) => v.paused)), 'play buttons', await page.locator('button.play').count());
await page.goto(B + '/work/parc/', { waitUntil: 'networkidle' });
const nx = page.locator('section.next .cta-row'); await nx.scrollIntoViewIfNeeded(); await nx.hover(); await page.waitForTimeout(100);
console.log('RM cta hover transform', await nx.evaluate((e) => getComputedStyle(e).transform));
await browser.close();
