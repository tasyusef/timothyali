// Follow-up probes for the PX-125 audit (fable): the focus ring on inverted grounds, the demo swatch chips,
// the long measures, and the readout clock. Read-only.
import { chromium } from '@playwright/test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url)); const OUT = join(HERE, 'shots');
const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const settle = async (page) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300); };
for (const theme of ['dark', 'light']) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await c.addInitScript((t) => { try { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', 'off'); } catch {} }, theme);
  const page = await c.newPage();
  // 1. the focus ring on the contact panel: an input, then Send
  await page.goto(BASE + '/contact/'); await settle(page);
  await page.keyboard.press('Tab'); for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
  let r = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); const panel = getComputedStyle(el.closest('.panel')); return { el: el.name, ring: cs.outlineColor, panelBg: panel.backgroundColor, panelAccentText: panel.getPropertyValue('--accent-text').trim(), focusRingVar: cs.getPropertyValue('--focus-ring').trim() }; });
  console.log(theme, 'contact input focus', JSON.stringify(r));
  let b = await page.locator('.contact-form').boundingBox();
  await page.screenshot({ path: join(OUT, `ring-panel-input-${theme}.png`), clip: { x: b.x - 16, y: b.y - 16, width: b.width + 32, height: 140 } });
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  r = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { el: el.textContent.trim(), ring: cs.outlineColor, bg: cs.backgroundColor, color: cs.color }; });
  console.log(theme, 'contact Send focus', JSON.stringify(r));
  b = await page.locator('#contact-form button[type=submit]').boundingBox();
  await page.screenshot({ path: join(OUT, `ring-panel-send-${theme}.png`), clip: { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 } });
  // 2. the settings menu rows, zoomed
  await page.goto(BASE + '/'); await settle(page);
  await page.focus('.settings .cog'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await page.waitForTimeout(100);
  b = await page.locator('.settings-menu').boundingBox();
  await page.screenshot({ path: join(OUT, `ring-settings-${theme}.png`), clip: { x: b.x - 16, y: b.y - 60, width: b.width + 32, height: b.height + 76 } });
  // 3. the demo plate chips
  await page.goto(BASE + '/toolbox/'); await settle(page);
  const chips = page.locator('.demo .swatch-chip');
  await chips.first().scrollIntoViewIfNeeded();
  for (const i of [0, 1]) {
    await chips.nth(i).focus(); await page.waitForTimeout(80);
    r = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { name: el.getAttribute('aria-label'), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} off ${cs.outlineOffset}`, fv: el.matches(':focus-visible') }; });
    console.log(theme, 'plate chip focus', JSON.stringify(r));
    b = await page.locator('.demo .swatch-chip').first().boundingBox();
    await page.screenshot({ path: join(OUT, `ring-plate-chip-${i}-${theme}.png`), clip: { x: b.x - 60, y: b.y - 24, width: 180, height: b.height + 48 } });
  }
  // 4. a Toolbox tool page's rail: the demo's focus ring on the select, range and field
  await page.focus('.demo input[type=range]').catch(() => {});
  r = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { el: el.tagName + ' ' + el.type, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}` }; });
  console.log(theme, 'demo range focus', JSON.stringify(r));
  await c.close();
}
// 5. long measures: which elements run past 75 characters a line at 1440
{
  const c = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); } catch {} });
  const page = await c.newPage();
  for (const p of ['/toolbox/agents/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/lockup/', '/toolbox/']) {
    await page.goto(BASE + p); await settle(page);
    const rows = await page.evaluate(() => {
      const cv = document.createElement('canvas').getContext('2d');
      return [...document.querySelectorAll('p, dd, li, dt')].filter((el) => el.textContent.trim().length > 90 && !el.closest('[aria-hidden]') && el.getBoundingClientRect().width > 0).map((el) => { const s = getComputedStyle(el); cv.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`; const t = el.textContent.trim().replace(/\s+/g, ' '); const avg = cv.measureText(t).width / t.length; const w = el.getBoundingClientRect().width; const parent = el.parentElement; return { el: el.tagName.toLowerCase() + '.' + [...el.classList].join('.'), parent: parent.tagName.toLowerCase() + '.' + [...parent.classList].join('.'), w: Math.round(w), maxW: s.maxWidth, cpl: Math.round(w / avg), text: t.slice(0, 50) }; }).filter((r) => r.cpl > 75).sort((a, b) => b.cpl - a.cpl).slice(0, 6);
    });
    console.log('measure', p, JSON.stringify(rows));
  }
  // 6. the readout clock: does it update, is it in any live region, does Motion off stop it
  await page.goto(BASE + '/'); await settle(page);
  const c1 = await page.textContent('.st-clock'); await page.waitForTimeout(2100); const c2 = await page.textContent('.st-clock');
  console.log('clock', JSON.stringify({ c1, c2, motion: await page.getAttribute('.site', 'data-motion'), ariaHidden: await page.getAttribute('.st-clock', 'aria-hidden'), live: await page.getAttribute('.readout', 'aria-live') }));
  // 7. the hero's typing loop with motion on: how long does one pass take, and is there a pause control outside the cog?
  await c.close();
}
await browser.close();
