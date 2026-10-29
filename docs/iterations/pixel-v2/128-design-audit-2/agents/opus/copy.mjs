// opus reviewer, PX-128: CLI & MCP page. Can a visitor select and copy a command? What does the copy hold?
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'], reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/toolbox/agents/', { waitUntil: 'networkidle' });
  console.log(w, 'copy buttons:', await page.locator('main button').count(), 'code blocks:', await page.locator('pre.code').count());
  const line = page.locator('pre.code .ln').first(); await line.scrollIntoViewIfNeeded();
  await line.click({ clickCount: 3 }); await page.keyboard.press('Meta+c');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  console.log('  triple-click first line ->', JSON.stringify(clip));
  // select a whole block
  await page.locator('pre.code').nth(1).evaluate((pre) => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await page.keyboard.press('Meta+c');
  console.log('  whole second block ->', JSON.stringify((await page.evaluate(() => navigator.clipboard.readText())).slice(0, 300)));
  // figure names
  console.log('  figures', JSON.stringify(await page.locator('pre.code').evaluateAll((ps) => ps.map((p) => `${p.getAttribute('role')}:${p.getAttribute('aria-label')}`))));
  // the jump nav and the setup path
  await ctx.close();
}
await browser.close();
