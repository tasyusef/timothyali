// Addendum: click around like a visitor. Nav, cards, study chain, Toolbox links, 404, settings.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const log = (...a) => console.log(...a);
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const state = () => page.evaluate(() => ({ url: location.pathname + location.hash, title: document.title, h1: document.querySelector('h1')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 40), current: document.querySelector('nav a[aria-current]')?.textContent, active: document.activeElement?.tagName + '#' + (document.activeElement?.id || '') + '.' + String(document.activeElement?.className).slice(0, 20), y: Math.round(scrollY), theme: document.documentElement.dataset.theme, motion: document.querySelector('.site')?.dataset.motion }));
await page.goto(B + '/', { waitUntil: 'networkidle' });
log('START', JSON.stringify(await state()));
// nav links
for (const name of ['Work', 'Contact', 'Toolbox', 'Index']) {
  await page.locator('nav[aria-label="Main navigation"] a', { hasText: name }).click();
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(500);
  log('NAV', name, JSON.stringify(await state()));
}
// wordmark
await page.goto(B + '/work/', { waitUntil: 'networkidle' }); await page.mouse.wheel(0, 800); await page.waitForTimeout(300);
await page.locator('.wordmark').click(); await page.waitForURL(B + '/'); await page.waitForTimeout(400); log('WORDMARK', JSON.stringify(await state()));
// Home: Selected work chip and All work
await page.locator('.hero-hint').click(); await page.waitForTimeout(1200); log('HINT #work', JSON.stringify(await state()));
await page.keyboard.press('Tab'); log('TAB after hint ->', JSON.stringify(await state()));
await page.locator('.list .all').click(); await page.waitForURL('**/work/'); log('ALL WORK', JSON.stringify(await state()));
// Work cards
const n = await page.locator('.cards .card').count();
for (let i = 0; i < n; i++) {
  await page.goto(B + '/work/', { waitUntil: 'networkidle' });
  const card = page.locator('.cards .card').nth(i); await card.scrollIntoViewIfNeeded(); const y0 = await page.evaluate(() => scrollY);
  const href = await card.getAttribute('href'); await card.click(); await page.waitForURL('**' + href); await page.waitForTimeout(400);
  const s = await state(); await page.goBack(); await page.waitForURL('**/work/'); await page.waitForTimeout(600);
  log('CARD', href, 'h1', s.h1, 'title', s.title, 'y on arrive', s.y, '| back y', await page.evaluate(() => Math.round(scrollY)), 'was', Math.round(y0));
}
// study Next chain
await page.goto(B + '/work/toolbox/', { waitUntil: 'networkidle' });
for (let i = 0; i < 8; i++) {
  const nx = page.locator('section.next a.cta-row'); const t = (await nx.textContent()).replace(/\s+/g, ' ').trim();
  await nx.click(); await page.waitForTimeout(700); const s = await state(); log('NEXT', t, '->', s.url, 'y', s.y, 'active', s.active);
}
const foot = page.locator('.page-foot a'); log('STUDY FOOT link', await foot.textContent(), await foot.getAttribute('href'));
// study meta links
await page.goto(B + '/work/parc/', { waitUntil: 'networkidle' });
log('PARC meta links', JSON.stringify(await page.$$eval('main .meta a', (as) => as.map((a) => [a.textContent.trim(), a.href, a.target]))));
// Toolbox picker, guide, chain, back
await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
await page.locator('.hero-actions .cta').click(); await page.waitForTimeout(900); log('EXPLORE', JSON.stringify(await state()));
for (const t of ['Palette', 'Specimen', 'Convert', 'Lockup']) {
  await page.locator('.tool-picker button', { hasText: t }).click(); await page.waitForTimeout(400);
  log('PICK', t, await page.$eval('.tool-picker button[aria-pressed=true]', (b) => b.textContent), '|', await page.$eval('.tool-story h3', (h) => h.textContent), '| demo', await page.$eval('.demo', (d) => d.textContent.trim().slice(0, 40)));
}
await page.locator('.tool-story .quiet-link').click(); await page.waitForURL('**/toolbox/lockup/'); log('GUIDE', JSON.stringify(await state()));
for (let i = 0; i < 4; i++) { const nx = page.locator('section.next a.cta-row'); const t = (await nx.textContent()).replace(/\s+/g, ' ').trim(); await nx.click(); await page.waitForTimeout(600); log('TOOL NEXT', t, '->', (await state()).url); }
await page.locator('.page-foot a').click(); await page.waitForTimeout(500); log('ALL FOUR TOOLS', JSON.stringify(await state()));
await page.locator('.machine .quiet-link').click(); await page.waitForURL('**/agents/'); log('CLI docs', JSON.stringify(await state()));
// 404
await page.goto(B + '/nope/', { waitUntil: 'networkidle' }); log('404', JSON.stringify(await state()));
await page.locator('main .cta').click(); await page.waitForURL(B + '/'); log('404 home', JSON.stringify(await state()));
// Settings by mouse
await page.goto(B + '/work/', { waitUntil: 'networkidle' });
await page.locator('.settings .cog').click(); log('COG open', await page.locator('#settings-menu').isVisible(), await page.locator('.cog').getAttribute('aria-expanded'));
await page.locator('#settings-menu button', { hasText: 'Theme' }).click(); await page.waitForTimeout(400);
log('THEME click', JSON.stringify(await state()), 'menu still open', await page.locator('#settings-menu').isVisible(), 'label', await page.locator('#settings-menu button', { hasText: 'Theme' }).textContent());
await page.locator('#settings-menu button', { hasText: 'Motion' }).click(); log('MOTION click', JSON.stringify(await state()), 'stored', await page.evaluate(() => localStorage.getItem('tim-motion')));
await page.mouse.click(700, 600); log('click outside -> menu', await page.locator('#settings-menu').isVisible());
await page.locator('nav a', { hasText: 'Contact' }).click(); await page.waitForTimeout(500); log('after nav', JSON.stringify(await state()));
await page.reload({ waitUntil: 'networkidle' }); log('after reload', JSON.stringify(await state()));
// Settings by keyboard
await page.locator('.settings .cog').focus(); await page.keyboard.press('Enter'); log('KB Enter cog open', await page.locator('#settings-menu').isVisible());
await page.keyboard.press('Tab'); log('KB Tab ->', await page.evaluate(() => document.activeElement.textContent));
await page.keyboard.press('Space'); await page.waitForTimeout(400); log('KB Space ->', JSON.stringify(await state()), await page.evaluate(() => document.activeElement.textContent));
await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); log('KB Tab past menu ->', await page.evaluate(() => document.activeElement.textContent?.trim().slice(0, 30)), 'menu open', await page.locator('#settings-menu').isVisible());
await page.keyboard.press('Escape'); log('KB Escape -> menu', await page.locator('#settings-menu').isVisible(), 'focus', await page.evaluate(() => document.activeElement.className));
await page.locator('.settings .cog').focus(); await page.keyboard.press('Space'); await page.keyboard.press('Escape'); log('KB Space+Escape -> menu', await page.locator('#settings-menu').isVisible(), 'focus', await page.evaluate(() => document.activeElement.className));
log('ERRORS', JSON.stringify(errors));
await browser.close();
