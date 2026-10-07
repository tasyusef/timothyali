// Home as a page that scrolls (PX-61): the sections are in flow, the statement plays once it is
// in view, keyboard focus lands on visible links, the no-JavaScript render is complete, and
// nothing overflows at any width. Run with a local preview: node tools/review/px61.mjs [origin] [outdir]
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin = process.argv[2] || 'http://127.0.0.1:4173';
const out = process.argv[3] || 'tools/review/out/px61';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const pass = (name) => console.log('PASS', name);
const pageFor = async (options) => {
  const page = await browser.newPage(options);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin); await page.evaluate(() => document.fonts.ready);
  if (options.javaScriptEnabled !== false) await page.waitForFunction(() => document.querySelector('.controls'));
  return page;
};
try {
  for (const width of [1440, 390]) {
    const page = await pageFor({ viewport: { width, height: 844 }, javaScriptEnabled: false });
    assert.match(await page.locator('#statement-title').textContent(), /I design the product and the brand/);
    assert.match(await page.locator('.companion').textContent(), /Freelance since 2019/);
    assert.equal(await page.locator('.list .row').count(), 4);
    await page.screenshot({ path: `${out}/nojs-${width}.png`, fullPage: true });
    await page.locator('.invitation a').click();
    await page.waitForURL('**/contact/');
    pass(`No JS ${width}: statement, paragraph, four rows, contact link opens Contact`);
    await page.close();
  }
  for (const [width, height] of [[1440, 900], [1100, 800], [700, 900], [390, 844], [320, 700]]) {
    const page = await pageFor({ viewport: { width, height } });
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('main *')].filter((e) => getComputedStyle(e).position === 'sticky').length), 0, 'nothing pinned');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow');
    await page.locator('#statement-title').scrollIntoViewIfNeeded(); await page.waitForTimeout(9000);
    assert.match(await page.locator('.typed').textContent(), /I care how it/);
    assert.equal(await page.locator('.words .ghost').count(), 0, 'every word and chip shown');
    assert.equal(await page.locator('.companion').evaluate((e) => e.style.clipPath), 'none', 'paragraph printed');
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/full-${width}.png`, fullPage: true });
    pass(`${width}x${height}: in flow, no overflow, statement plays to the end`);
    await page.close();
  }
  for (const width of [1440, 390]) {
    const page = await pageFor({ viewport: { width, height: 900 } });
    const seen = new Set();
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(700); // in-page scrolls ease (0098)
      const info = await page.evaluate(() => { const a = document.activeElement; if (!(a instanceof HTMLElement) || !a.closest('main')) return null; const r = a.getBoundingClientRect(); return { href: a.getAttribute('href'), visible: r.width > 0 && r.bottom > 0 && r.top < innerHeight }; });
      if (info) { assert.ok(info.visible, `focused ${info.href} is on screen`); seen.add(info.href); }
    }
    for (const href of ['#work', '/work/sonde/', '/work/', '/contact/']) assert.ok(seen.has(href), `tab reaches ${href}`);
    pass(`Keyboard ${width}: Home links reachable and on screen when focused`);
    await page.close();
  }
  assert.equal(errors.length, 0, errors.join('\n'));
  pass('No browser page errors');
} finally { await browser.close(); }
