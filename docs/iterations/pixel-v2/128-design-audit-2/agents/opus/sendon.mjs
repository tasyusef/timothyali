// opus reviewer, PX-128: the "Send the link to your computer" control at 390 with touch; the tool story live region.
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
for (const mode of ['share', 'noshare']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, permissions: ['clipboard-read', 'clipboard-write'] });
  await ctx.addInitScript((m) => { if (m === 'noshare') { delete Navigator.prototype.share; } else { Navigator.prototype.share = async (d) => { window.__shared = d; }; } }, mode);
  const page = await ctx.newPage();
  await page.route('**/download/**', (r) => r.fulfill({ status: 204, body: '' }));
  await page.goto('http://127.0.0.1:4173/toolbox/', { waitUntil: 'networkidle' });
  const btn = page.locator('.on-phone button');
  console.log(mode, 'visible=', await btn.isVisible(), 'label=', (await btn.innerText()).replace(/\s+/g, ' '), 'box=', JSON.stringify(await btn.boundingBox()));
  await btn.scrollIntoViewIfNeeded(); await btn.tap(); await page.waitForTimeout(300);
  console.log('  after tap label=', (await btn.innerText()).replace(/\s+/g, ' '), 'status=', await page.locator('.on-phone [role=status]').innerText(), 'shared=', JSON.stringify(await page.evaluate(() => window.__shared)), 'clip=', await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e.name)));
  await page.screenshot({ path: `${OUT}shots/send-on-${mode}-390.png` });
  // download links on a phone
  const links = await page.locator('.downloads a').evaluateAll((as) => as.map((a) => { const r = a.getBoundingClientRect(); return `${a.textContent.trim()} ${Math.round(r.width)}x${Math.round(r.height)}`; }));
  console.log('  download links', links.join(', '));
  await ctx.close();
}
// tool story live region
{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto('http://127.0.0.1:4173/toolbox/', { waitUntil: 'networkidle' });
  const live = await page.locator('[aria-live]').evaluateAll((els) => els.map((e) => `${e.className} live=${e.getAttribute('aria-live')} text="${e.textContent.trim().replace(/\s+/g, ' ').slice(0, 120)}" len=${e.textContent.trim().length}`));
  console.log('live regions:\n  ' + live.join('\n  '));
  await page.locator('.tool-picker button').nth(1).click(); await page.waitForTimeout(300);
  console.log('after picking Palette:', await page.locator('.tool-story').evaluate((e) => e.textContent.trim().replace(/\s+/g, ' ')));
  console.log('preview region:', await page.locator('#tool-preview').evaluate((e) => `${e.tagName} role=${e.getAttribute('role')} label=${e.getAttribute('aria-label')} live=${e.getAttribute('aria-live')}`));
}
await browser.close();
