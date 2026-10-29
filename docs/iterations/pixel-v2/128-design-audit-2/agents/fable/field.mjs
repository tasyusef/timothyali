// The field (0230): swell on hover, click ring, drag wake and trench, held press, drag across text and
// links, no selection, links still click; reduced motion and motion off: nothing moves; touch swipe at
// 390 scrolls. Every page with a field.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, goto, BASE, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const FIELDS = [['home', '/', '.page-sky'], ['parc', '/work/parc/', '.head'], ['jade', '/work/jade-aesthetics/', '.head'], ['toolbox', '/toolbox/', '.toolbox-hero'], ['contact', '/contact/', '.contact'], ['404', '/nope/', '.lost']];
const browser = await launch();

// canvas pixel hash of a region, to see whether anything moved
const hashCanvas = (page, sel) => page.evaluate((sel) => { const c = document.querySelector(`${sel} canvas`); if (!c) return 'no-canvas'; const g = c.getContext('2d'); const d = g.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0; return h.toString(16); }, sel);
// a bare spot in the band: a point not over words/controls (uses the component's own test via elementFromPoint and caret check)
async function bareSpot(page, sel) {
  return page.evaluate((sel) => {
    const band = document.querySelector(sel); const r = band.getBoundingClientRect();
    const onWords = (x, y) => { const at = document.caretPositionFromPoint?.(x, y); if (!at || at.offsetNode.nodeType !== 3) return false; const range = document.createRange(); for (const i of [at.offset - 1, at.offset]) { if (i < 0 || i >= at.offsetNode.nodeValue.length) continue; range.setStart(at.offsetNode, i); range.setEnd(at.offsetNode, i + 1); for (const q of range.getClientRects()) if (x >= q.left && x <= q.right && y >= q.top && y <= q.bottom) return true; } return false; };
    for (let y = Math.max(120, r.top + 40); y < Math.min(innerHeight - 20, r.bottom - 20); y += 24) for (let x = r.left + 40; x < r.right - 40; x += 48) {
      const el = document.elementFromPoint(x, y); if (!el || !band.contains(el)) continue; if (el.closest('a, button, input, textarea, select, label, img, video, figure')) continue; if (onWords(x, y)) continue; return { x, y };
    }
    return null;
  }, sel);
}

for (const [id, path, sel] of FIELDS) {
  // motion on
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  await goto(page, path, { wait: 800 });
  const spot = await bareSpot(page, sel); if (!spot) { say(`${id}: no bare spot found`); await ctx.close(); continue; }
  const cursor = await page.evaluate((sel) => getComputedStyle(document.querySelector(sel)).cursor.slice(0, 60), sel);
  const h0 = await hashCanvas(page, sel);
  await page.mouse.move(spot.x, spot.y); await sleep(250); const hHover = await hashCanvas(page, sel);
  await page.mouse.down(); await sleep(60); await page.mouse.up(); await sleep(150); const hClick = await hashCanvas(page, sel);
  await page.screenshot({ path: join(SHOTS, `field-${id}-click.png`), clip: { x: spot.x - 200, y: Math.max(0, spot.y - 150), width: 400, height: 300 } });
  // drag
  await page.mouse.move(spot.x, spot.y); await page.mouse.down(); for (let i = 1; i <= 20; i++) { await page.mouse.move(spot.x + i * 12, spot.y + Math.sin(i / 3) * 20); await sleep(16); } await sleep(80); const hDrag = await hashCanvas(page, sel);
  await page.screenshot({ path: join(SHOTS, `field-${id}-drag.png`), clip: { x: spot.x - 60, y: Math.max(0, spot.y - 150), width: 480, height: 300 } });
  await page.mouse.up(); await sleep(400);
  // hold still 1.5 s then release
  await page.mouse.move(spot.x, spot.y); await page.mouse.down(); await sleep(1500); const hHold = await hashCanvas(page, sel);
  await page.screenshot({ path: join(SHOTS, `field-${id}-hold.png`), clip: { x: spot.x - 200, y: Math.max(0, spot.y - 150), width: 400, height: 300 } });
  await page.mouse.up(); await sleep(120); const hRelease = await hashCanvas(page, sel);
  await page.screenshot({ path: join(SHOTS, `field-${id}-release.png`), clip: { x: spot.x - 200, y: Math.max(0, spot.y - 150), width: 400, height: 300 } });
  await sleep(900);
  const sel0 = await page.evaluate(() => getSelection()?.toString().length ?? 0);
  say(`${id.padEnd(8)} motion on: cursor=${cursor.includes('cursor/field') ? 'field crosshair' : cursor} hover ${h0 !== hHover ? 'moves' : 'STILL'}, click ${hHover !== hClick ? 'rings' : 'STILL'}, drag ${hDrag !== hClick ? 'moves' : 'STILL'}, hold ${hHold !== hDrag ? 'charges' : 'STILL'}, release ${hRelease !== hHold ? 'fires' : 'STILL'}; selection after=${sel0}`);
  // drag across text and links: from the bare spot across the h1 and the first link in the band
  const h1 = await page.evaluate((sel) => { const h = document.querySelector(`${sel} h1`) ?? document.querySelector('h1'); const r = h.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: h.textContent.trim().slice(0, 20) }; }, sel);
  const link = await page.evaluate((sel) => { const a = document.querySelector(`${sel} a, main a`); if (!a) return null; const r = a.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, href: a.getAttribute('href'), text: a.textContent.trim().slice(0, 30) }; }, sel);
  await page.mouse.move(spot.x, spot.y); await page.mouse.down(); for (let i = 1; i <= 15; i++) { await page.mouse.move(spot.x + (h1.x - spot.x) * i / 15, spot.y + (h1.y - spot.y) * i / 15); await sleep(16); } if (link) for (let i = 1; i <= 15; i++) { await page.mouse.move(h1.x + (link.x - h1.x) * i / 15, h1.y + (link.y - h1.y) * i / 15); await sleep(16); } await page.mouse.up(); await sleep(200);
  const selAfter = await page.evaluate(() => getSelection()?.toString().replace(/\s+/g, ' ').slice(0, 40) ?? '');
  const active = await page.evaluate(() => document.activeElement?.tagName);
  say(`${id.padEnd(8)} drag across "${h1.text}" and "${link?.text}": selection="${selAfter}" (len ${selAfter.length}) activeElement=${active}`);
  // a drag that starts on the text itself: does text selection still work for a reader?
  await page.mouse.click(spot.x, spot.y); await sleep(100);
  await page.mouse.move(h1.x - 60, h1.y); await page.mouse.down(); for (let i = 1; i <= 10; i++) { await page.mouse.move(h1.x - 60 + i * 14, h1.y); await sleep(16); } await page.mouse.up(); await sleep(150);
  say(`${id.padEnd(8)} drag starting on the heading selects: "${await page.evaluate(() => getSelection()?.toString().replace(/\s+/g, ' ').slice(0, 30))}"`);
  // links still click after a drag
  if (link) { await page.mouse.click(spot.x, spot.y); await sleep(100); const before = page.url(); await page.mouse.click(link.x, link.y); await sleep(700); say(`${id.padEnd(8)} link "${link.text}" click after drag: ${page.url() === before ? 'did not navigate' : 'navigated to ' + page.url().replace(BASE, '')}`); }
  await ctx.close();

  // reduced motion (no saved choice) and motion off
  for (const [mode, opts] of [['reduced-motion', { motion: null, reducedMotion: 'reduce' }], ['motion-off', { motion: 'off' }]]) {
    const c2 = await context(browser, { width: 1440, ...opts }); const p2 = await c2.newPage(); await goto(p2, path, { wait: 800 });
    const m = await p2.evaluate(() => document.querySelector('.site').dataset.motion);
    const a = await hashCanvas(p2, sel); await p2.mouse.move(spot.x, spot.y); await sleep(200); const b = await hashCanvas(p2, sel);
    await p2.mouse.down(); for (let i = 1; i <= 20; i++) { await p2.mouse.move(spot.x + i * 12, spot.y + Math.sin(i / 3) * 20); await sleep(16); } await sleep(1500); const c = await hashCanvas(p2, sel); await p2.mouse.up(); await sleep(300); const d = await hashCanvas(p2, sel);
    const cursorBlink = await p2.evaluate(() => { const c = document.querySelector('.cursor'); return c ? getComputedStyle(c).animationName : 'no cursor'; });
    const decode = await p2.evaluate(() => document.querySelector('h1 .decode [aria-hidden]')?.textContent);
    say(`${id.padEnd(8)} ${mode}: data-motion=${m} hover ${a === b ? 'still' : 'MOVES'}, drag+hold ${b === c ? 'still' : 'MOVES'}, release ${c === d ? 'still' : 'MOVES'}; cursor animation=${cursorBlink}; h1 shown="${decode}"`);
    await c2.close();
  }
}

// touch at 390: a swipe scrolls, a tap rings
for (const [id, path, sel] of [['home', '/', '.page-sky'], ['contact', '/contact/', '.contact'], ['parc', '/work/parc/', '.head']]) {
  const ctx = await context(browser, { width: 390, height: 844, touch: true }); const page = await ctx.newPage();
  await goto(page, path, { wait: 800 });
  const coarse = await page.evaluate(() => matchMedia('(pointer:coarse)').matches);
  const cdp = await ctx.newCDPSession(page);
  const y0 = await page.evaluate(() => scrollY);
  const h0 = await hashCanvas(page, sel);
  // swipe up in the band (field area)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 600 }] });
  for (let i = 1; i <= 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 600 - i * 30 }] }); await sleep(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(600);
  const y1 = await page.evaluate(() => scrollY);
  const sel1 = await page.evaluate(() => getSelection()?.toString().length ?? 0);
  await page.evaluate(() => scrollTo(0, 0)); await sleep(300);
  const h1 = await hashCanvas(page, sel);
  await page.touchscreen.tap(195, 500); await sleep(200); const h2 = await hashCanvas(page, sel);
  say(`touch 390 ${id.padEnd(8)} pointer:coarse=${coarse} swipe scrolled ${y0}->${y1} ${y1 > y0 ? 'OK' : 'DID NOT SCROLL'}; selection=${sel1}; tap ${h1 !== h2 ? 'rings' : 'still'}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(DATA, 'field.log'), log.join('\n'));
