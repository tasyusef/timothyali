import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const rm of ['no-preference', 'reduce']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  await page.goto('http://127.0.0.1:4173/work/xrpcafe/', { waitUntil: 'networkidle' });
  const b = page.locator('figure.clip button').first(); await b.scrollIntoViewIfNeeded(); await page.waitForTimeout(800); await b.focus();
  const name0 = await b.getAttribute('aria-label'); const y0 = await page.evaluate(() => scrollY);
  await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  const f = await page.evaluate(() => document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || '').slice(0, 30));
  await page.keyboard.press('Space'); await page.waitForTimeout(600); const y1 = await page.evaluate(() => scrollY);
  console.log(rm, '| focused', name0.slice(0, 40), '| after Enter focus ->', f, '| Space then scrolled page by', Math.round(y1 - y0), 'px | video paused', await page.$eval('figure.clip video', (v) => v.paused));
  await page.close();
}
await browser.close();
