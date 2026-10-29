// opus reviewer, PX-128: what a screen reader hears for each heading (Chrome's accessibility tree).
import { chromium } from '@playwright/test';
const PAGES = ['/', '/work/', '/work/parc/', '/work/jade-aesthetics/', '/work/firststrike/', '/toolbox/', '/toolbox/lockup/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
for (const p of PAGES) {
  await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' });
  const snap = await page.locator('main').ariaSnapshot();
  const heads = snap.split('\n').filter((l) => /heading/.test(l)).map((l) => l.trim()).slice(0, 6);
  console.log(p, '\n   ' + heads.join('\n   '));
}
await browser.close();
