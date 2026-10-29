// Shift+Tab under the chrome: motion on (smooth scroll) vs motion off (instant). Forced colours' state cues.
// The rest of followup.mjs after its crash: card hover, the clip with motion off, the parc head for AT.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, goto, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const browser = await launch();

for (const motion of ['on', 'off']) {
  for (const [id, path, downTo] of [['work', '/work/', 'FirstStrike'], ['home', '/', 'First Ledger'], ['parc', '/work/parc/', 'Next /']]) {
    const ctx = await context(browser, { width: 1440, motion }); const page = await ctx.newPage(); await goto(page, path);
    // tab down until the target, settle, then Shift+Tab once and twice
    let name = ''; for (let i = 0; i < 30 && !name.includes(downTo); i++) { await page.keyboard.press('Tab'); await sleep(900); name = await page.evaluate(() => document.activeElement.textContent.trim().slice(0, 30)); }
    const where = async () => page.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); const nav = document.querySelector('.nav-chrome'); return { name: el.textContent.trim().slice(0, 22), top: Math.round(r.top), navBottom: Math.round(nav.getBoundingClientRect().bottom), collapsed: nav.classList.contains('collapsed'), y: Math.round(scrollY) }; });
    const at = await where();
    await page.keyboard.press('Shift+Tab'); await sleep(1500); const back1 = await where();
    await page.keyboard.press('Shift+Tab'); await sleep(1500); const back2 = await where();
    say(`shift-tab [motion ${motion}] ${id}: at ${JSON.stringify(at)} -> back1 ${JSON.stringify(back1)} ${back1.top < back1.navBottom ? 'UNDER CHROME' : 'clear'} -> back2 ${JSON.stringify(back2)} ${back2.top < back2.navBottom ? 'UNDER CHROME' : 'clear'}`);
    if (motion === 'on' && id === 'work') await page.screenshot({ path: join(SHOTS, 'shift-tab-under-chrome-work.png') });
    await ctx.close();
  }
}

// forced colours: is the current nav item, the pressed picker, the chosen chip distinguishable?
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await page.emulateMedia({ forcedColors: 'active' });
  await goto(page, '/toolbox/');
  const cues = await page.evaluate(() => { const s = (sel) => { const el = document.querySelector(sel); const cs = getComputedStyle(el); return `${cs.backgroundColor} / ${cs.color} / border ${cs.borderTopWidth} ${cs.borderTopStyle} / outline ${cs.outlineStyle} ${cs.outlineWidth} / deco ${cs.textDecorationLine}`; }; return { navCurrent: s('nav a[aria-current]'), navOther: s('nav a:not([aria-current])'), pickerOn: s('.tool-picker [aria-pressed=true]'), pickerOff: s('.tool-picker [aria-pressed=false]'), chipOn: s('.demo .chip[aria-pressed=true]'), cta: s('.hero-actions .cta'), switchState: s('.demo .switch.on .state') }; });
  say(`forced-colors cues: ${JSON.stringify(cues, null, 0)}`);
  await page.locator('#tools').scrollIntoViewIfNeeded(); await sleep(300); await page.screenshot({ path: join(SHOTS, 'forced-colors-toolbox-picker.png') });
  await ctx.close();
}

{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, '/');
  say(`hero: sr-only texts=${JSON.stringify(await page.locator('.hero-name .sr-only').allTextContents())} static line sr=${JSON.stringify(await page.locator('.hero p.sr-only').allTextContents())}`);
  await page.locator('#work .card').first().scrollIntoViewIfNeeded(); await sleep(300);
  const before = await page.evaluate(() => { const c = document.querySelector('#work .card'); return [getComputedStyle(c).backgroundImage.slice(0, 50), getComputedStyle(c.querySelector('.mono')).color, getComputedStyle(c.querySelector('.mono')).transform]; });
  await page.locator('#work .card').first().hover(); await sleep(300);
  const after = await page.evaluate(() => { const c = document.querySelector('#work .card'); return [getComputedStyle(c).backgroundImage.slice(0, 50), getComputedStyle(c.querySelector('.mono')).color, getComputedStyle(c.querySelector('.mono')).transform]; });
  say(`card hover: before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  const cb = await page.locator('#work .card').first().boundingBox(); await page.screenshot({ path: join(SHOTS, 'card-hover.png'), clip: { x: cb.x - 8, y: cb.y - 8, width: cb.width + 16, height: cb.height + 16 } });
  await ctx.close();
}
{
  const ctx = await context(browser, { width: 1440, motion: 'off' }); const page = await ctx.newPage(); await goto(page, '/work/xrpcafe/');
  const clip = page.locator('.clip').first(); await clip.scrollIntoViewIfNeeded(); await sleep(800);
  say(`clip motion off: paused=${await clip.locator('video').evaluate((v) => v.paused)} poster=${await clip.locator('video').evaluate((v) => !!v.poster)} button="${await clip.locator('button').getAttribute('aria-label')}" size=${JSON.stringify(await clip.locator('button').boundingBox().then((b) => b && [b.width, b.height]))}`);
  await clip.locator('button').click(); await sleep(800); say(`  after click: paused=${await clip.locator('video').evaluate((v) => v.paused)} button="${await clip.locator('button').getAttribute('aria-label')}" opacity=${await clip.locator('button').evaluate((b) => getComputedStyle(b).opacity)}`);
  await page.mouse.move(10, 10); await sleep(300); say(`  pointer away: pause opacity=${await clip.locator('button').evaluate((b) => getComputedStyle(b).opacity)}`);
  await ctx.close();
  const c2 = await context(browser, { width: 1440, motion: 'on' }); const p2 = await c2.newPage(); await goto(p2, '/work/xrpcafe/');
  const clip2 = p2.locator('.clip').first(); await clip2.scrollIntoViewIfNeeded(); await sleep(1000);
  say(`clip motion on: paused=${await clip2.locator('video').evaluate((v) => v.paused)} pause button opacity (pointer away)=${await clip2.locator('button').evaluate((b) => getComputedStyle(b).opacity)}; on hover=${await (async () => { await clip2.hover(); await sleep(200); return clip2.locator('button').evaluate((b) => getComputedStyle(b).opacity); })()}`);
  const cb = await clip2.boundingBox(); await p2.screenshot({ path: join(SHOTS, 'clip-autoplay-pointer-away.png'), clip: { x: cb.x, y: Math.max(0, cb.y), width: cb.width, height: Math.min(cb.height, 900 - Math.max(0, cb.y)) } });
  await c2.close();
}
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, '/work/parc/');
  say(`parc h1 for AT: ${JSON.stringify(await page.locator('h1').first().evaluate((h) => ({ sr: h.querySelector('.sr-only')?.textContent, hidden: [...h.querySelectorAll('[aria-hidden=true]')].map((e) => e.textContent.trim().slice(0, 20)) })))}`);
  say(`parc empty alts: ${await page.locator('main img').evaluateAll((is) => is.filter((i) => !i.alt).length)} of ${await page.locator('main img').count()}; sample: ${JSON.stringify(await page.locator('main img').evaluateAll((is) => is.slice(0, 3).map((i) => i.alt.slice(0, 60))))}`);
  // the download links' accessible names on Toolbox
  await goto(page, '/toolbox/');
  say(`download link names: ${JSON.stringify(await page.locator('.downloads .files a').evaluateAll((as) => as.map((a) => a.getAttribute('aria-label') || a.textContent.trim())))}`);
  // Jersey body line-height on the tool pages
  await goto(page, '/toolbox/lockup/');
  say(`lockup paragraph: ${JSON.stringify(await page.locator('.text .paras .body').first().evaluate((p) => { const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); return { size: cs.fontSize, lh: cs.lineHeight, lines: Math.round(r.height / parseFloat(cs.lineHeight)), width: Math.round(r.width), chars: p.textContent.length }; }))}`);
  await goto(page, '/toolbox/agents/');
  say(`agents side paragraph: ${JSON.stringify(await page.locator('#advanced .side .body').first().evaluate((p) => { const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); return { size: cs.fontSize, lh: cs.lineHeight, lines: Math.round(r.height / parseFloat(cs.lineHeight)), width: Math.round(r.width) }; }))}`);
  say(`options dd: ${JSON.stringify(await page.evaluate(() => null))}`);
  await goto(page, '/toolbox/lockup/');
  say(`options dd sample: ${JSON.stringify(await page.locator('.tool-options dd').first().evaluate((p) => { const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); return { size: cs.fontSize, lh: cs.lineHeight, lines: Math.round(r.height / parseFloat(cs.lineHeight)), opacity: cs.opacity }; }))}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(DATA, 'followup2.log'), log.join('\n'));
