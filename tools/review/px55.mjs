// Focused regression checks for Home's scroll, keyboard, and server-rendered fallbacks.
// Run with a local dev/preview server: node tools/review/px55.mjs [origin]
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin = process.argv[2] || 'http://127.0.0.1:5194';
const out = 'docs/iterations/pixel-v2/55-home-accessibility';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [];
const pass = (name) => { results.push(name); console.log('PASS', name); };
const pageFor = async (options) => {
  const page = await browser.newPage(options);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin); await page.evaluate(() => document.fonts.ready);
  if (options.javaScriptEnabled !== false) await page.waitForFunction(() => document.querySelector('.controls'));
  return page;
};
const scrollStage = async (page, selector, progress) => {
  await page.locator(selector).evaluate((e, p) => window.scrollTo({ top: e.getBoundingClientRect().top + scrollY + (e.offsetHeight - innerHeight) * p, behavior: 'instant' }), progress);
  await page.waitForTimeout(150);
};
try {
  for (const width of [1440, 390]) {
    const page = await pageFor({ viewport: { width, height: 844 }, javaScriptEnabled: false });
    assert.equal(await page.locator('.st-sec .inner').evaluate(e => getComputedStyle(e).visibility), 'visible');
    assert.match(await page.locator('.companion').textContent(), /freelancing since 2019/);
    await page.locator('.st-sec').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/nojs-${width}.png` });
    await page.locator('.inv-sec a').click();
    await page.waitForURL('**/contact/');
    pass(`No JS ${width}: introduction visible, contact link opens Contact`);
    await page.close();
  }
  for (const [width, height] of [[1440,900],[1280,720],[390,844],[320,700]]) {
    const page = await pageFor({ viewport: { width, height } });
    await scrollStage(page, '.st-sec', 0.69);
    assert.ok(await page.locator('.companion').evaluate(e => e.getBoundingClientRect().bottom <= innerHeight + 1));
    await scrollStage(page, '.wheel', 0.3);
    await scrollStage(page, '.st-sec', 0.01);
    const top = await page.locator('#statement-title').evaluate(e => e.getBoundingClientRect().top);
    assert.ok(top >= (width <= 700 ? 136 : 96), `heading must return below header: ${top}`);
    assert.equal(await page.locator('.st-sec .inner').evaluate(e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 0, 0)');
    if (width === 390) await page.screenshot({ path: `${out}/after-phone-return.png` });
    await scrollStage(page, '.st-sec', 0.69);
    if (width === 390) await page.screenshot({ path: `${out}/after-phone-paragraph.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    pass(`${width}x${height}: paragraph reachable and heading restored when scrolling back`);
    // Switching motion off also resets the translation and retains all text.
    await page.getByRole('button', { name: 'Motion [on]', exact: true }).evaluate(e => e.click());
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.st-sec .inner').evaluate(e => getComputedStyle(e).transform), 'matrix(1, 0, 0, 1, 0, 0)');
    pass(`${width}x${height}: motion toggle clears the text offset`);
    await page.close();
  }
  for (const width of [1440,390]) {
    const page = await pageFor({ viewport: { width, height: 900 } });
    const seen = new Set();
    for (let i = 0; i < 18; i++) {
      await page.keyboard.press('Tab'); await page.waitForTimeout(250);
      const state = await page.evaluate(() => {
        const e = document.activeElement;
        if (!e.closest('.hero-sec,.wheel,.inv-sec')) return null;
        const rect = e.getBoundingClientRect();
        const masks = [];
        for (let parent = e; parent; parent = parent.parentElement) {
          const style = getComputedStyle(parent);
          if (style.maskImage !== 'none') masks.push(style.getPropertyValue('--t'));
        }
        return { text: e.textContent.trim(), href: e.getAttribute('href'), top: rect.top, bottom: rect.bottom, masks };
      });
      if (!state) continue;
      assert.ok(state.top >= (width <= 700 ? 136 : 96) && state.bottom <= 901, JSON.stringify(state));
      assert.ok(state.masks.every(t => !t || t.trim() === '0px'), JSON.stringify(state));
      seen.add(state.href);
      if (state.href === '/contact/') {
        await page.screenshot({ path: `${out}/keyboard-contact-${width}.png` });
        await page.keyboard.press('Enter'); await page.waitForURL('**/contact/');
        break;
      }
    }
    assert.ok(seen.has('/work/sonde/') && seen.has('/contact/') && seen.has('/resume/Timothy-Ali-Resume.pdf'), [...seen].join(','));
    pass(`Keyboard ${width}: Home links visible on focus; Enter opens Contact`);
    await page.close();
  }
  const reduced = await pageFor({ viewport: { width:390,height:844 }, reducedMotion: 'reduce' });
  assert.equal(await reduced.locator('.site').getAttribute('data-motion'), 'off');
  assert.equal(await reduced.locator('.st-sec .inner').evaluate(e => getComputedStyle(e).visibility), 'visible');
  assert.equal(await reduced.locator('#work .row').count(), 4);
  pass('Reduced motion: visible introduction and four-project list');
  await reduced.close();
  assert.deepEqual(errors, []); pass('No browser page errors');
  await writeFile(`${out}/checks.json`, JSON.stringify({ results, errors }, null, 2) + '\n');
} finally { await browser.close(); }
