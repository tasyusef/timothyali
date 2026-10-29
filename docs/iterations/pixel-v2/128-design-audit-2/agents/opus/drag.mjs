// opus reviewer, PX-128: the field drag (0230). Selection, links still click, reduced motion still, touch swipe scrolls.
import { chromium } from '@playwright/test';
import crypto from 'node:crypto';
const B = 'http://127.0.0.1:4173';
const OUT = new URL('./', import.meta.url).pathname;
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/toolbox/', '/toolbox/lockup/', '/toolbox/agents/', '/contact/', '/nope/'];
const browser = await chromium.launch({ channel: 'chrome' });
const hash = (b) => crypto.createHash('md5').update(b).digest('hex').slice(0, 8);
async function bareField(page) {
  // a point in the first .band that is over no text and no control
  return page.evaluate(() => {
    const band = document.querySelector('main .band'); if (!band) return null;
    const r = band.getBoundingClientRect();
    const top = Math.max(r.top + 10, (document.querySelector('.nav-chrome')?.getBoundingClientRect().bottom ?? 0) + 10);
    for (let y = top; y < Math.min(r.bottom, innerHeight) - 20; y += 23) for (let x = r.left + 30; x < r.right - 30; x += 37) {
      const el = document.elementFromPoint(x, y); if (!el) continue;
      if (el.closest('.nav-chrome,a,button,input,textarea,label,img,video,figure,h1,h2,p,dl,span:not(.band-bg)')) continue;
      const c = document.caretPositionFromPoint?.(x, y); if (c && c.offsetNode.nodeType === 3 && c.offsetNode.textContent.trim()) { const rg = document.createRange(); rg.setStart(c.offsetNode, Math.max(0, c.offset - 1)); rg.setEnd(c.offsetNode, Math.min(c.offsetNode.length, c.offset + 1)); const rb = rg.getBoundingClientRect(); if (x >= rb.left - 2 && x <= rb.right + 2 && y >= rb.top && y <= rb.bottom) continue; }
      return { x, y, band: [r.left, r.top, r.right, Math.min(r.bottom, innerHeight)] };
    }
    return null;
  });
}
for (const motion of ['no-preference', 'reduce']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: motion });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    const f = await bareField(page);
    if (!f) { console.log(motion, p, 'no bare field point'); continue; }
    const clip = { x: f.band[0], y: f.band[1], width: Math.min(f.band[2] - f.band[0], 1440), height: Math.max(40, f.band[3] - f.band[1]) };
    const h0 = hash(await page.screenshot({ clip }));
    // drag from bare field across the page (through text and links), hold, release
    await page.mouse.move(f.x, f.y); await page.mouse.down();
    for (let i = 1; i <= 20; i++) await page.mouse.move(f.x + i * 25, f.y + i * 12, { steps: 2 });
    const mid = hash(await page.screenshot({ clip }));
    await page.waitForTimeout(1500);
    await page.mouse.up(); await page.waitForTimeout(300);
    const sel = await page.evaluate(() => getSelection().toString());
    const h1 = hash(await page.screenshot({ clip }));
    await page.waitForTimeout(2500);
    const h2 = hash(await page.screenshot({ clip }));
    // a double click on the bare field: selects words?
    await page.mouse.dblclick(f.x, f.y); await page.waitForTimeout(200);
    const sel2 = await page.evaluate(() => getSelection().toString());
    // drag that starts on a heading's words (should select text as usual)
    console.log(`${motion} ${p} start=(${Math.round(f.x)},${Math.round(f.y)}) field ${h0}->${mid}->${h1}->${h2} moved=${h0 !== mid} selection="${sel.slice(0, 40).replace(/\s+/g, ' ')}" dbl="${sel2.slice(0, 20)}"`);
    if (p === '/' ) await page.screenshot({ path: `${OUT}shots/drag-${motion}-home.png` });
  }
  // a link still clicks after a drag
  await page.goto(B + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const f = await bareField(page);
  await page.mouse.move(f.x, f.y); await page.mouse.down(); await page.mouse.move(f.x + 200, f.y + 50, { steps: 10 }); await page.mouse.up();
  await page.locator('a', { hasText: 'Resume (PDF)' }).first().evaluate((a) => a.addEventListener('click', (e) => { e.preventDefault(); window.__clicked = true; }, { once: true }));
  await page.locator('a', { hasText: 'Resume (PDF)' }).first().click();
  console.log(motion, 'link clicks after drag:', await page.evaluate(() => !!window.__clicked));
  // drag that starts on a link and ends on the field
  const card = page.locator('a.card').first(); await card.scrollIntoViewIfNeeded(); const cb = await card.boundingBox();
  const url0 = page.url();
  await page.mouse.move(cb.x + 50, cb.y + 50); await page.mouse.down(); await page.mouse.move(cb.x + 50, cb.y - 120, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(500);
  console.log(motion, 'drag off a card navigates?', page.url() !== url0, page.url());
  await ctx.close();
}
// touch at 390: a swipe on the field scrolls
for (const p of ['/', '/toolbox/', '/contact/']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  const cdp = await ctx.newCDPSession(page);
  const f = await bareField(page) ?? { x: 200, y: 400 };
  const y0 = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: f.x, y: f.y + 200 }] });
  for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: f.x, y: f.y + 200 - i * 25 }] }); await page.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(800);
  const y1 = await page.evaluate(() => scrollY);
  console.log(`touch 390 ${p} swipe at (${Math.round(f.x)},${Math.round(f.y + 200)}) scrollY ${y0} -> ${y1} selection="${await page.evaluate(() => getSelection().toString().slice(0, 30))}"`);
  await ctx.close();
}
await browser.close();
