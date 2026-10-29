// opus reviewer, PX-128: click around like a visitor. Nav, cog, persistence, cards, studies, toolbox, 404.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const OUT = new URL('./', import.meta.url).pathname;
const log = (...a) => console.log(...a);
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => log('PAGEERROR', String(e)));
await page.route('**/download/**', (r) => { log('  download intercepted', r.request().url()); r.fulfill({ status: 204, body: '' }); });
await page.goto(B + '/', { waitUntil: 'networkidle' });

// nav
for (const name of ['Work', 'Contact', 'Toolbox', 'Index']) {
  const link = page.locator('nav[aria-label="Main navigation"] a', { hasText: new RegExp(name, 'i') }).first();
  await link.click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500);
  const cur = await page.locator('nav[aria-label="Main navigation"] a[aria-current]').allTextContents();
  const focus = await page.evaluate(() => document.activeElement?.tagName + '#' + document.activeElement?.id);
  log(`nav ${name}: url=${page.url()} current=${cur.join(',').replace(/\s+/g, ' ')} title="${await page.title()}" focus=${focus}`);
}

// cog
const cog = page.locator('button[aria-label="Settings"]');
await cog.click(); await page.waitForTimeout(200);
log('cog open expanded=', await cog.getAttribute('aria-expanded'), 'menu visible=', await page.locator('#settings-menu').isVisible());
const menuBtns = await page.locator('#settings-menu button').evaluateAll((bs) => bs.map((b) => ({ t: b.textContent.trim().replace(/\s+/g, ' '), pressed: b.getAttribute('aria-pressed'), label: b.getAttribute('aria-label') })));
log('menu buttons', JSON.stringify(menuBtns));
await page.screenshot({ path: OUT + 'shots/cog-open-1440.png', clip: { x: 900, y: 0, width: 540, height: 300 } });
// toggle motion, theme
const before = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site')?.classList.contains('motion') }));
for (const b of await page.locator('#settings-menu button').all()) { await b.click(); await page.waitForTimeout(700); }
const after = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site')?.classList.contains('motion'), ls: { ...localStorage } }));
log('toggles', JSON.stringify(before), '->', JSON.stringify(after));
log('menu buttons after', JSON.stringify(await page.locator('#settings-menu button').evaluateAll((bs) => bs.map((b) => ({ t: b.textContent.trim().replace(/\s+/g, ' '), pressed: b.getAttribute('aria-pressed') })))));
log('menu still open after toggles:', await page.locator('#settings-menu').isVisible());
await page.keyboard.press('Escape'); await page.waitForTimeout(200);
log('after Escape: open=', await page.locator('#settings-menu').isVisible(), 'focus=', await page.evaluate(() => document.activeElement?.getAttribute('aria-label')));
// keyboard open
await page.keyboard.press('Enter'); await page.waitForTimeout(200);
log('Enter on cog: open=', await page.locator('#settings-menu').isVisible());
await page.keyboard.press('Tab'); log('Tab from cog lands on', await page.evaluate(() => document.activeElement?.textContent?.trim().replace(/\s+/g, ' ')));
await page.keyboard.press('Tab'); log('Tab again lands on', await page.evaluate(() => document.activeElement?.textContent?.trim().replace(/\s+/g, ' ')));
await page.keyboard.press('Tab'); log('Tab again lands on', await page.evaluate(() => (document.activeElement?.textContent || document.activeElement?.tagName).trim().replace(/\s+/g, ' ').slice(0, 30)), 'menu open=', await page.locator('#settings-menu').isVisible());
await page.keyboard.press('Space'); await page.waitForTimeout(500);
// click outside
await cog.click(); await page.mouse.click(400, 600); await page.waitForTimeout(200);
log('click outside closes:', !(await page.locator('#settings-menu').isVisible()));
// persistence
await page.goto(B + '/work/', { waitUntil: 'networkidle' });
log('after nav to /work/:', JSON.stringify(await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site')?.classList.contains('motion') }))));
await page.reload({ waitUntil: 'networkidle' });
log('after reload:', JSON.stringify(await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site')?.classList.contains('motion') }))));
await page.evaluate(() => localStorage.clear());

// cards -> studies -> next
await page.goto(B + '/work/', { waitUntil: 'networkidle' });
const cards = await page.locator('a.card').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
log('work cards', cards.join(' '));
for (const href of cards) {
  await page.goto(B + '/work/', { waitUntil: 'networkidle' });
  await page.locator(`a.card[href="${href}"]`).click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(300);
  const h1 = await page.locator('h1').first().innerText();
  const next = page.locator('a', { hasText: /Next/ }).first();
  const nextHref = await next.getAttribute('href');
  const ext = await page.locator('main a[href^="http"]').evaluateAll((as) => as.map((a) => `${a.textContent.trim()}|target=${a.target}|rel=${a.rel}`));
  log(`card ${href} -> ${page.url()} h1="${h1.replace(/\s+/g, ' ')}" next=${nextHref} ext=${ext.join(' ; ')}`);
  await next.click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(300);
  log(`   next -> ${page.url()} scrollY=${await page.evaluate(() => scrollY)} focus=${await page.evaluate(() => document.activeElement?.tagName + '#' + document.activeElement?.id)}`);
  await page.goBack(); await page.waitForLoadState('networkidle');
  log(`   back -> ${page.url()}`);
}
// toolbox tool links
await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
const toolLinks = await page.locator('main a[href^="/toolbox/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href') + '|' + a.textContent.trim().replace(/\s+/g, ' ')))]);
log('toolbox links', toolLinks.join(' ; '));
for (const t of ['lockup', 'palette', 'specimen', 'convert']) {
  await page.goto(B + `/toolbox/${t}/`, { waitUntil: 'networkidle' });
  const get = page.locator('main a[href*="#download"]').first();
  log(`/toolbox/${t}/ h1="${(await page.locator('h1').first().innerText()).replace(/\s+/g, ' ')}" getIt=${await get.getAttribute('href')}`);
  await get.click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(800);
  log(`   Get it -> ${page.url()} downloadTop=${await page.evaluate(() => Math.round(document.getElementById('download')?.getBoundingClientRect().top))}`);
}
// downloads
await page.goto(B + '/toolbox/#download', { waitUntil: 'networkidle' });
const dl = await page.locator('.downloads a').evaluateAll((as) => as.map((a) => `${a.textContent.trim()} -> ${a.getAttribute('href')} download=${a.hasAttribute('download')}`));
log('download links:\n  ' + dl.join('\n  '));
await page.locator('.downloads a').first().click(); await page.waitForTimeout(500);
log('after download click url=', page.url());
// tool picker
await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
const pick = page.locator('[aria-pressed]');
log('pressed buttons', JSON.stringify(await pick.evaluateAll((bs) => bs.map((b) => b.textContent.trim().replace(/\s+/g, ' ') + ':' + b.getAttribute('aria-pressed')))));
// 404
await page.goto(B + '/nope/', { waitUntil: 'networkidle' });
log('404 title=', await page.title(), 'h1=', (await page.locator('h1').innerText()).replace(/\s+/g, ' '));
await page.locator('main a', { hasText: /home/i }).click(); await page.waitForLoadState('networkidle');
log('404 home ->', page.url());
await browser.close();
