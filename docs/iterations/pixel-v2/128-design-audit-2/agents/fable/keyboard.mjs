// Keyboard only: Tab through each page from the top (skip link, order, visible focus), Enter and
// Space on controls, Escape on what opens. Both themes for the focus ring colour.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, goto, BASE, PAGES, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const browser = await launch();

const describe = () => ({
  tag: document.activeElement?.tagName.toLowerCase(), cls: String(document.activeElement?.className).split(' ').slice(0, 2).join('.'),
  name: (document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim().replace(/\s+/g, ' ') || '').slice(0, 40),
  outline: (() => { const cs = getComputedStyle(document.activeElement); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`; })(),
  bg: getComputedStyle(document.activeElement).backgroundColor,
  // is :focus-visible matching?
  fv: document.activeElement?.matches(':focus-visible'),
  inView: (() => { const r = document.activeElement.getBoundingClientRect(); const chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome-height')) || 96; return r.bottom > 0 && r.top < innerHeight && r.top >= chrome - 1; })(),
  top: Math.round(document.activeElement.getBoundingClientRect().top),
  hidden: !!document.activeElement.closest('[aria-hidden=true]')
});

for (const [id, path] of PAGES) {
  for (const theme of ['dark', 'light']) {
    if (theme === 'light' && !['home', 'contact', 'toolbox', 'parc'].includes(id)) continue;
    const ctx = await context(browser, { width: 1440, theme }); const page = await ctx.newPage();
    await goto(page, path);
    const order = []; let underChrome = []; let noRing = []; let hiddenStops = [];
    await page.keyboard.press('Tab'); await sleep(60);
    const first = await page.evaluate(describe);
    const skipBox = await page.locator('.skip-link').boundingBox();
    say(`${id}/${theme}: first Tab = ${first.tag}.${first.cls} "${first.name}" visible box=${JSON.stringify(skipBox && { y: Math.round(skipBox.y), h: Math.round(skipBox.height) })} ring=${first.outline}`);
    // Enter on the skip link
    await page.keyboard.press('Enter'); await sleep(200);
    const afterSkip = await page.evaluate(() => ({ active: document.activeElement?.id || document.activeElement?.tagName, y: Math.round(scrollY) }));
    say(`  skip link Enter -> focus on ${afterSkip.active}, scrollY=${afterSkip.y}`);
    // tab through everything
    await page.evaluate(() => scrollTo(0, 0)); await page.keyboard.press('Tab'); // back on skip link? no: focus is on main; Tab goes to next
    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab'); await sleep(30);
      const d = await page.evaluate(describe);
      if (d.tag === 'body' || (order.length && d.tag === order[0].tag && d.name === order[0].name && d.cls === order[0].cls && i > 3)) break;
      order.push(d);
      if (!d.inView) underChrome.push(`${d.tag}.${d.cls} "${d.name}" top=${d.top}`);
      if (d.fv && d.outline.startsWith('none') && d.bg === order[0]?.bg) noRing.push(`${d.tag}.${d.cls} "${d.name}"`);
      if (d.hidden) hiddenStops.push(`${d.tag}.${d.cls} "${d.name}"`);
    }
    const rings = [...new Set(order.map((o) => o.outline))];
    say(`  ${order.length} stops; rings=${JSON.stringify(rings)}; not in view when focused: ${underChrome.length ? JSON.stringify(underChrome.slice(0, 6)) : 'none'}; no visible ring: ${noRing.length ? JSON.stringify(noRing) : 'none'}; aria-hidden stops: ${hiddenStops.length ? JSON.stringify(hiddenStops) : 'none'}`);
    if (theme === 'dark') say(`  order: ${order.map((o) => `${o.tag}${o.name ? '"' + o.name.slice(0, 18) + '"' : '.' + o.cls}`).join(' > ')}`);
    await ctx.close();
  }
}

// focus ring screenshots on the grounds: page, panel (contact note), accent (cta), card, picker, settings menu
{
  for (const theme of ['dark', 'light']) {
    const ctx = await context(browser, { width: 1440, theme }); const page = await ctx.newPage();
    const shot = async (path, sel, label) => { await goto(page, path); const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.focus(); await page.keyboard.press('Shift'); await sleep(150); const box = await el.boundingBox(); const ring = await el.evaluate((e) => { const cs = getComputedStyle(e); return { fv: e.matches(':focus-visible'), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} offset ${cs.outlineOffset}`, bg: cs.backgroundColor, color: cs.color }; }); await page.screenshot({ path: join(SHOTS, `focus-${label}-${theme}.png`), clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: Math.min(1440, box.width + 32), height: box.height + 32 } }); say(`focus ${label}/${theme}: ${JSON.stringify(ring)}`); };
    await shot('/', '.site-header nav a[href="/work/"]', 'nav');
    await shot('/', '.hero-hint', 'hint');
    await shot('/', '#work .card', 'card');
    await shot('/', '.invitation .cta-row', 'cta-row');
    await shot('/contact/', 'input[name=name]', 'input');
    await shot('/contact/', '.contact-note .cta-row', 'send');
    await shot('/contact/', '.contact-links .quiet-link', 'panel-link');
    await shot('/toolbox/', '.tool-picker button:nth-child(2)', 'picker');
    await shot('/toolbox/', '.demo .chip', 'chip');
    await shot('/toolbox/', '.demo .switch input', 'switch');
    await shot('/toolbox/', '.downloads .files a', 'download');
    await shot('/toolbox/agents/', '.jump a', 'jump');
    // settings menu rows
    await goto(page, '/'); await page.locator('.settings .cog').focus(); await page.keyboard.press('Enter'); await sleep(100); await page.keyboard.press('Tab'); await sleep(100);
    const row = page.locator('#settings-menu button').first(); const rb = await row.boundingBox(); say(`focus settings-row/${theme}: ${JSON.stringify(await row.evaluate((e) => { const cs = getComputedStyle(e); return { fv: e.matches(':focus-visible'), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, bg: cs.backgroundColor, color: cs.color }; }))}`);
    await page.screenshot({ path: join(SHOTS, `focus-settings-row-${theme}.png`), clip: { x: rb.x - 16, y: rb.y - 60, width: rb.width + 32, height: rb.height + 80 } });
    // Space and Enter on the menu buttons
    await page.keyboard.press('Space'); await sleep(100); say(`  Space on Motion row -> motion=${await page.evaluate(() => document.querySelector('.site').dataset.motion)}`);
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await sleep(500); say(`  Enter on Theme row -> theme=${await page.evaluate(() => document.documentElement.dataset.theme)}; menu open=${await page.locator('.settings .cog').getAttribute('aria-expanded')}`);
    await page.keyboard.press('Escape'); await sleep(100); say(`  Escape -> open=${await page.locator('.settings .cog').getAttribute('aria-expanded')} focus=${await page.evaluate(() => document.activeElement.className)}`);
    await ctx.close();
  }
}

// Enter / Space on controls: picker (Space), card (Enter), clip play button (Space), details summary (phone), demo switch (Space), tree row (Enter), steps (Enter)
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  await goto(page, '/toolbox/');
  await page.locator('.tool-picker button').nth(1).focus(); await page.keyboard.press('Space'); await sleep(400);
  say(`picker Space -> story "${await page.locator('.tool-story h3').textContent()}" focus=${await page.evaluate(() => document.activeElement.textContent.trim().slice(0, 12))}`);
  await page.locator('.tool-picker button').nth(2).focus(); await page.keyboard.press('Enter'); await sleep(400); say(`picker Enter -> story "${await page.locator('.tool-story h3').textContent()}"`);
  await page.locator('.tool-picker button').nth(0).focus(); await page.keyboard.press('Enter'); await sleep(400);
  const sw = page.locator('.demo .switch input').first(); await sw.focus(); const s0 = await sw.isChecked(); await page.keyboard.press('Space'); await sleep(100); say(`demo switch Space: ${s0} -> ${await sw.isChecked()} (state label "${await page.locator('.demo .switch .state').first().textContent()}")`);
  const chip = page.locator('.demo .chip').first(); await chip.focus(); const c0 = await chip.getAttribute('aria-pressed'); await page.keyboard.press('Enter'); await sleep(100); say(`demo chip Enter: pressed ${c0} -> ${await chip.getAttribute('aria-pressed')}`);
  const cont = page.locator('.demo .demo-act', { hasText: 'Continue' }); await cont.focus(); await page.keyboard.press('Enter'); await sleep(300); say(`Continue Enter -> focus on ${await page.evaluate(() => document.activeElement.tagName + ' "' + document.activeElement.textContent.trim().slice(0, 24) + '"')}; readout=${await page.locator('.demo-readout .demo-path').textContent()}`);
  const tree = page.locator('.demo button.tree-row').first(); await tree.focus(); const t0 = await tree.getAttribute('aria-expanded'); await page.keyboard.press('Enter'); await sleep(100); say(`tree row Enter: expanded ${t0} -> ${await tree.getAttribute('aria-expanded')}`);
  const back = page.locator('.demo .toolbar .btn', { hasText: 'Back' }); await back.focus(); await page.keyboard.press('Space'); await sleep(300); say(`Back Space -> focus on "${await page.evaluate(() => document.activeElement.textContent.trim().slice(0, 24))}"`);
  // the slider on convert
  await page.locator('.tool-picker button').nth(3).focus(); await page.keyboard.press('Enter'); await sleep(900);
  const range = page.locator('.demo input[type=range]'); if (await range.count()) { await range.focus(); const r0 = await range.inputValue(); await page.keyboard.press('ArrowRight'); await sleep(100); say(`convert slider ArrowRight: ${r0} -> ${await range.inputValue()} label=${await page.locator('.range-row .lbl').textContent()}`); }
  // card Enter
  await goto(page, '/work/'); await page.locator('.cards .card').first().focus(); await page.keyboard.press('Enter'); await sleep(500); say(`work card Enter -> ${page.url().replace(BASE, '')}`);
  // clip play button Space (xrpcafe has a clip)
  await goto(page, '/work/xrpcafe/'); const play = page.locator('.clip button').first(); if (await play.count()) { await play.scrollIntoViewIfNeeded(); await sleep(600); const l0 = await play.getAttribute('aria-label'); await play.focus(); await page.keyboard.press('Space'); await sleep(400); say(`clip button Space: "${l0}" -> "${await play.getAttribute('aria-label')}" paused=${await page.locator('.clip video').first().evaluate((v) => v.paused)}`); }
  // Options details on a phone width
  await ctx.close();
  const c3 = await context(browser, { width: 390, height: 844 }); const p3 = await c3.newPage(); await goto(p3, '/toolbox/lockup/');
  const sum = p3.locator('details.collapse summary'); await sum.scrollIntoViewIfNeeded(); say(`options summary at 390: visible=${await sum.isVisible()} text="${(await sum.textContent()).trim()}" open=${await p3.locator('details.collapse').evaluate((d) => d.open)}`);
  await sum.focus(); await p3.keyboard.press('Enter'); await sleep(100); say(`  Enter -> open=${await p3.locator('details.collapse').evaluate((d) => d.open)}; summary still visible=${await sum.isVisible()}`);
  await p3.keyboard.press('Space'); await sleep(100); say(`  Space -> open=${await p3.locator('details.collapse').evaluate((d) => d.open)}`);
  await c3.close();
}
await browser.close();
writeFileSync(join(DATA, 'keyboard.log'), log.join('\n'));
