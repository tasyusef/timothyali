import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage(); const hits = [];
await page.route('**/download/**', (r) => { hits.push(r.request().url().replace(B, '') + ' [' + r.request().resourceType() + ']'); r.fulfill({ status: 200, contentType: 'text/plain', body: 'intercepted' }); });
const n = 8;
for (let i = 0; i < n; i++) {
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  const a = page.locator('.downloads .files a').nth(i); await a.scrollIntoViewIfNeeded();
  const before = hits.length; await a.click(); await page.waitForTimeout(800);
  console.log(i, await a.textContent().catch(() => '?'), '->', page.url().replace(B, ''), 'new hits', hits.slice(before).join(' , '));
}
await ctx.close();
// phone without the share sheet: the clipboard path
const p2 = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, permissions: ['clipboard-read', 'clipboard-write'] })).newPage();
await p2.addInitScript(() => { delete Navigator.prototype.share; });
await p2.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
const btn = p2.locator('.on-phone .send'); await btn.scrollIntoViewIfNeeded(); await btn.tap(); await p2.waitForTimeout(200);
console.log('clipboard path label', JSON.stringify(await btn.textContent()), 'clipboard', await p2.evaluate(() => navigator.clipboard.readText()));
await p2.screenshot({ path: 'shots/toolbox-390-link-copied.png' });
await browser.close();
