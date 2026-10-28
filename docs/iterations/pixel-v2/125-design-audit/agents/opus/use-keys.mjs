// Keyboard only: skip link, focus order, Enter/Space on controls, Escape.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const act = () => page.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); return `${e.tagName}${e.id ? '#' + e.id : ''} "${(e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)}" top=${Math.round(r.top)} y=${Math.round(scrollY)}`; });
for (const p of ['/', '/work/', '/work/parc/', '/toolbox/', '/toolbox/agents/', '/contact/', '/nope/']) {
  await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  await page.keyboard.press('Tab');
  const skip = await page.$eval('.skip-link', (s) => { const r = s.getBoundingClientRect(); return `visible=${r.top >= 0 && r.bottom <= innerHeight} top=${Math.round(r.top)}`; });
  await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  const afterSkip = await act(); await page.keyboard.press('Tab'); const firstInMain = await act();
  console.log(p, '| skip', skip, '| Enter ->', afterSkip, '| Tab ->', firstInMain);
}
// Home: Enter on the Selected work chip, then Tab
await page.goto(B + '/', { waitUntil: 'networkidle' });
await page.locator('.hero-hint').focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(1200); await page.keyboard.press('Tab'); console.log('Home Enter on hint, Tab ->', await act());
// Toolbox picker with Space and Enter; tool demo controls
await page.goto(B + '/toolbox/', { waitUntil: 'networkidle' });
await page.locator('.tool-picker button').nth(1).focus(); await page.keyboard.press('Space'); await page.waitForTimeout(300);
console.log('Picker Space ->', await page.$eval('.tool-picker [aria-pressed=true]', (b) => b.textContent));
await page.keyboard.press('ArrowRight'); console.log('Picker ArrowRight ->', await act());
await page.locator('.tool-picker button').nth(3).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500); console.log('Picker Enter ->', await page.$eval('.tool-picker [aria-pressed=true]', (b) => b.textContent));
// walk the Convert demo with the keyboard
const stops = []; for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); stops.push(await page.evaluate(() => { const e = document.activeElement; return e.closest('.demo') ? `${e.tagName.toLowerCase()}${e.disabled ? '(disabled)' : ''}:${(e.getAttribute('aria-label') || e.textContent || e.value || '').trim().slice(0, 18)}` : null; })); }
console.log('Convert demo stops', stops.filter(Boolean).join(' | '));
// study clip play with Enter and Space
await page.goto(B + '/work/do-androids-dream/', { waitUntil: 'networkidle' });
const pb = page.locator('figure.clip button').first(); await pb.focus(); console.log('Clip button', await pb.getAttribute('aria-label'));
await page.keyboard.press('Enter'); await page.waitForTimeout(800); console.log('Clip after Enter paused', await page.$eval('video', (v) => v.paused), 'focus', await act());
await page.keyboard.press('Space'); await page.waitForTimeout(500); console.log('Clip after Space paused', await page.$eval('video', (v) => v.paused), 'focus', await act(), 'y', await page.evaluate(() => scrollY));
// CLI page jump links
await page.goto(B + '/toolbox/agents/', { waitUntil: 'networkidle' });
for (const id of ['run', 'organize']) { await page.locator(`.jump a[href="#${id}"]`).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(900); console.log('Jump', id, await page.$eval('#' + id, (s) => { const h = s.querySelector('h2').getBoundingClientRect(); const c = document.querySelector('.nav-chrome').getBoundingClientRect(); return `h2 top=${Math.round(h.top)} chrome bottom=${Math.round(c.bottom)} collapsed=${document.querySelector('.nav-chrome').classList.contains('collapsed')}`; })); await page.keyboard.press('Tab'); console.log('   Tab after jump ->', await act()); }
// copy a code block by selecting it
const txt = await page.evaluate(() => { const pre = document.querySelector('#run pre'); const r = document.createRange(); r.selectNodeContents(pre); getSelection().removeAllRanges(); getSelection().addRange(r); return getSelection().toString(); });
console.log('Selected #run code block:\n' + txt);
console.log('copy buttons on CLI page:', await page.locator('main button').count());
await browser.close();
