import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const motion of ['no-preference', 'reduce']) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: motion })).newPage();
  await page.goto('http://127.0.0.1:4173/nope/', { waitUntil: 'networkidle' });
  const links = await page.locator('main a').evaluateAll((as) => as.map((a) => a.textContent.trim() + ' -> ' + a.getAttribute('href') + ' rel=' + a.getAttribute('data-sveltekit-reload')));
  console.log(motion, 'links', links);
  await page.locator('main a').first().click();
  try { await page.waitForURL('http://127.0.0.1:4173/', { timeout: 4000 }); console.log('  navigated', page.url(), await page.title()); } catch { console.log('  STILL', page.url()); }
}
await browser.close();
