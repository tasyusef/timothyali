// Download links intercepted; the phone's "send the link" control; the options fold.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const hits = [];
  await page.route('**/download/**', (r) => { hits.push(r.request().url().replace(B, '')); r.fulfill({ status: 200, contentType: 'text/plain', body: 'intercepted' }); });
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  const links = await page.$$eval('.downloads li', (lis) => lis.map((li) => [li.querySelector('.lbl').textContent, [...li.querySelectorAll('.files a')].map((a) => `${a.textContent} -> ${a.getAttribute('href')} download=${a.hasAttribute('download')} target=${a.target}`), li.querySelector('.note')?.textContent]));
  console.log(JSON.stringify(links, null, 1));
  for (let i = 0; i < await page.locator('.downloads .files a').count(); i++) { await page.goto(B + '/toolbox/#download', { waitUntil: 'networkidle' }); await page.locator('.downloads .files a').nth(i).click(); await page.waitForTimeout(400); }
  console.log('download requests', hits.length, hits.join(' | '));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  console.log('phone: share API', await page.evaluate(() => typeof navigator.share), '| panel visible', await page.locator('.on-phone').isVisible(), '| scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth));
  const btn = page.locator('.on-phone .send'); await btn.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'shots/toolbox-390-phone-send.png' });
  await btn.tap(); await page.waitForTimeout(200);
  console.log('after tap label', JSON.stringify(await btn.textContent()), '| clipboard', await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e.message)), '| live region?', await btn.evaluate((b) => b.closest('[aria-live]') ? 'yes' : 'no'));
  await page.screenshot({ path: 'shots/toolbox-390-phone-sent.png' });
  await page.waitForTimeout(2600); console.log('after 2.6s label', JSON.stringify(await btn.textContent()));
  // denied clipboard: what the reader sees
  await ctx.clearPermissions(); await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }); });
  await btn.tap(); await page.waitForTimeout(300); console.log('clipboard refused -> label', JSON.stringify(await btn.textContent()));
  // download links on a phone: what a tap does
  console.log('phone download rows visible', await page.locator('.downloads').isVisible());
  // demos on a phone: export note, disabled export
  await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
  console.log('phone export note', await page.locator('.export-note').isVisible(), await page.locator('.export-note').textContent());
  // a tool page's options fold
  await page.goto(B + '/toolbox/lockup/', { waitUntil: 'networkidle' });
  const sum = page.locator('.tool-options summary'); console.log('options folded', !(await page.$eval('.tool-options details', (d) => d.open)), 'summary', await sum.textContent(), 'height', (await sum.boundingBox()).height);
  await sum.tap(); console.log('after tap open', await page.$eval('.tool-options details', (d) => d.open));
  await ctx.close();
}
await browser.close();
