// Re-measurements after the first passes: focus scroll settled, the phone share fallback, settings
// across a hard reload, forced colours, prefers-contrast, lazy covers, 200% zoom, the hero loop,
// the card/arrow hover (background-image), the clip at motion off.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, goto, BASE, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const browser = await launch();

// focus scroll: where does a focused element land once the smooth scroll settles? under the chrome?
for (const [id, path] of [['home', '/'], ['work', '/work/'], ['toolbox', '/toolbox/'], ['agents', '/toolbox/agents/'], ['parc', '/work/parc/']]) {
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, path);
  const bad = []; let n = 0;
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab'); await sleep(700);
    const d = await page.evaluate(() => { const el = document.activeElement; if (!el || el === document.body) return null; const r = el.getBoundingClientRect(); const nav = document.querySelector('.nav-chrome').getBoundingClientRect(); return { name: (el.getAttribute('aria-label') || el.textContent.trim()).slice(0, 24), top: Math.round(r.top), bottom: Math.round(r.bottom), navBottom: Math.round(nav.bottom), collapsed: document.querySelector('.nav-chrome').classList.contains('collapsed'), vh: innerHeight }; });
    if (!d) break; n++;
    if (d.top < d.navBottom || d.bottom > d.vh) bad.push(`${d.name} top=${d.top} bottom=${d.bottom} navBottom=${d.navBottom} collapsed=${d.collapsed}`);
  }
  say(`focus-scroll ${id}: ${n} stops; hidden under chrome or off screen after 700ms: ${bad.length ? JSON.stringify(bad) : 'none'}`);
  // Shift+Tab back up: does the header come back over the element?
  const up = []; for (let i = 0; i < 6; i++) { await page.keyboard.press('Shift+Tab'); await sleep(700); const d = await page.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); const nav = document.querySelector('.nav-chrome').getBoundingClientRect(); return { name: (el.getAttribute('aria-label') || el.textContent.trim()).slice(0, 20), top: Math.round(r.top), navBottom: Math.round(nav.bottom) }; }); if (d.top < d.navBottom && d.top > -2000) up.push(`${d.name} top=${d.top} navBottom=${d.navBottom}`); }
  say(`  Shift+Tab up: under chrome: ${up.length ? JSON.stringify(up) : 'none'}`);
  await ctx.close();
}

// the phone send-link: share present (headless), share absent (clipboard fallback), clipboard refused
{
  for (const mode of ['share-logged', 'no-share', 'no-share-no-clipboard']) {
    const ctx = await context(browser, { width: 390, height: 844, touch: true }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = await ctx.newPage();
    if (mode === 'share-logged') await page.addInitScript(() => { const orig = navigator.share?.bind(navigator); window.__share = []; navigator.share = (d) => { window.__share.push(JSON.stringify(d)); return orig ? orig(d).then((r) => { window.__share.push('resolved'); return r; }, (e) => { window.__share.push('rejected ' + e.name); throw e; }) : Promise.resolve(); }; });
    if (mode.startsWith('no-share')) await page.addInitScript(() => { Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }); });
    if (mode === 'no-share-no-clipboard') await page.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true }); });
    await goto(page, '/toolbox/'); const btn = page.locator('.on-phone .send'); await btn.scrollIntoViewIfNeeded(); await btn.tap(); await sleep(300);
    say(`send-link ${mode}: label="${(await btn.textContent()).trim()}" status="${await page.locator('.on-phone [role=status]').textContent()}" share=${JSON.stringify(await page.evaluate(() => window.__share ?? null))} clipboard="${await page.evaluate(() => navigator.clipboard?.readText?.().catch(() => 'n/a') ?? 'n/a')}"`);
    if (mode === 'no-share') await page.screenshot({ path: join(SHOTS, 'toolbox-onphone-390-copied.png'), clip: { x: 0, y: (await btn.boundingBox()).y - 200, width: 390, height: 320 } });
    await ctx.close();
  }
}

// settings across a hard reload, without the init script re-seeding storage
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage(); await goto(page, '/');
  await page.locator('.settings .cog').click(); await page.locator('#settings-menu button', { hasText: 'Theme' }).click(); await sleep(400); await page.locator('#settings-menu button', { hasText: 'Motion' }).click(); await sleep(100);
  const before = await page.evaluate(() => [document.documentElement.dataset.theme, document.querySelector('.site').dataset.motion, localStorage.getItem('tim-theme'), localStorage.getItem('tim-motion')]);
  await page.goto(BASE + '/work/'); await sleep(600);
  const after = await page.evaluate(() => [document.documentElement.dataset.theme, document.querySelector('.site').dataset.motion]);
  // first paint theme: is there a flash? check the html attribute before hydration via a fresh page with JS disabled
  const flash = await page.evaluate(() => document.documentElement.outerHTML.includes('data-theme="light"'));
  say(`settings hard reload: before=${JSON.stringify(before)} after full load of /work/=${JSON.stringify(after)} data-theme in html=${flash}`);
  await ctx.close();
}

// forced colours and prefers-contrast
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  await page.emulateMedia({ forcedColors: 'active' }); await goto(page, '/'); await page.screenshot({ path: join(SHOTS, 'forced-colors-home.png') });
  say(`forced-colors home: nav current bg=${await page.evaluate(() => getComputedStyle(document.querySelector('nav a[aria-current]')).backgroundColor)} cta=${await page.evaluate(() => getComputedStyle(document.querySelector('.hero-hint')).backgroundColor)} canvas visible=${await page.evaluate(() => getComputedStyle(document.querySelector('canvas')).visibility)}`);
  await page.locator('.site-header nav a[href="/work/"]').focus(); say(`  focus ring: ${await page.evaluate(() => { const cs = getComputedStyle(document.activeElement); return cs.outlineStyle + ' ' + cs.outlineColor; })}`);
  await goto(page, '/toolbox/'); await page.screenshot({ path: join(SHOTS, 'forced-colors-toolbox.png'), fullPage: false });
  await page.emulateMedia({ forcedColors: 'none', contrast: 'more' }); await goto(page, '/toolbox/');
  say(`prefers-contrast more: --dim=${await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--dim'))} dim label opacity=${await page.evaluate(() => getComputedStyle(document.querySelector('.lbl.dim')).opacity)}`);
  await ctx.close();
}

// lazy covers: scroll Work slowly, then check every card image has loaded (the Androids cover)
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, '/work/');
  for (let y = 0; y < 3200; y += 600) { await page.evaluate((y) => scrollTo(0, y), y); await sleep(500); }
  say(`work covers after scrolling: ${JSON.stringify(await page.locator('.card img').evaluateAll((is) => is.map((i) => ({ src: i.currentSrc.split('/').pop().slice(0, 40), ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, h: i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height) }))))}`);
  await page.locator('.cards .card').last().scrollIntoViewIfNeeded(); await sleep(400); const b = await page.locator('.cards .card').last().boundingBox(); await page.screenshot({ path: join(SHOTS, 'work-androids-card.png'), clip: { x: b.x, y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, 900 - Math.max(0, b.y)) } });
  await ctx.close();
}

// 200% zoom on a 1440 screen ~ 720 CSS px at DPR 2: overflow and the type sizes
{
  for (const [id, path] of [['home', '/'], ['toolbox', '/toolbox/'], ['lockup', '/toolbox/lockup/'], ['parc', '/work/parc/'], ['contact', '/contact/'], ['agents', '/toolbox/agents/']]) {
    const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 }); const page = await ctx.newPage(); await goto(page, path);
    say(`zoom200 ${id}: overflow=${await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)} (${await page.evaluate(() => document.documentElement.scrollWidth + '>' + document.documentElement.clientWidth)}) nav height=${await page.evaluate(() => document.querySelector('.site-header').offsetHeight)}`);
    if (id === 'toolbox') await page.screenshot({ path: join(SHOTS, 'zoom200-toolbox.png') });
    await ctx.close();
  }
}

// the hero loop: does it ever stop? how long is a cycle; is there a visible way to stop it besides the cog?
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, '/');
  const samples = []; for (let i = 0; i < 16; i++) { samples.push(await page.evaluate(() => (document.querySelector('.hero-name .decode [aria-hidden]')?.textContent ?? '-') + ' | ' + (document.querySelector('.hero-role .decode [aria-hidden]')?.textContent?.slice(0, 30) ?? '-'))); await sleep(1000); }
  say(`hero loop over 16s: ${JSON.stringify([...new Set(samples)])}`);
  say(`hero: sr-only name="${await page.locator('.hero-name .sr-only').textContent()}" live region=${await page.evaluate(() => document.querySelector('.hero')?.getAttribute('aria-live'))} controls to pause in view: ${await page.evaluate(() => [...document.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') || b.textContent.trim()).join(', '))}`);
  // card hover: background-image and the arrow
  await page.locator('#work .card').first().scrollIntoViewIfNeeded(); await sleep(300);
  const before = await page.evaluate(() => { const c = document.querySelector('#work .card'); return [getComputedStyle(c).backgroundImage.slice(0, 60), getComputedStyle(c.querySelector('.mono')).color, getComputedStyle(c.querySelector('.mono')).transform]; });
  await page.locator('#work .card').first().hover(); await sleep(300);
  const after = await page.evaluate(() => { const c = document.querySelector('#work .card'); return [getComputedStyle(c).backgroundImage.slice(0, 60), getComputedStyle(c.querySelector('.mono')).color, getComputedStyle(c.querySelector('.mono')).transform]; });
  say(`card hover: before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
  const cb = await page.locator('#work .card').first().boundingBox(); await page.screenshot({ path: join(SHOTS, 'card-hover.png'), clip: { x: cb.x - 8, y: cb.y - 8, width: cb.width + 16, height: cb.height + 16 } });
  await ctx.close();
}

// the clip with motion off: a still with a play button; after a tap it plays
{
  const ctx = await context(browser, { width: 1440, motion: 'off' }); const page = await ctx.newPage(); await goto(page, '/work/xrpcafe/');
  const clip = page.locator('.clip').first(); await clip.scrollIntoViewIfNeeded(); await sleep(800);
  say(`clip motion off: paused=${await clip.locator('video').evaluate((v) => v.paused)} poster=${await clip.locator('video').evaluate((v) => !!v.poster)} button="${await clip.locator('button').getAttribute('aria-label')}" button size=${JSON.stringify(await clip.locator('button').boundingBox().then((b) => b && [b.width, b.height]))}`);
  await clip.locator('button').click(); await sleep(800); say(`  after click: paused=${await clip.locator('video').evaluate((v) => v.paused)} button="${await clip.locator('button').getAttribute('aria-label')}" pause button opacity=${await clip.locator('button').evaluate((b) => getComputedStyle(b).opacity)}`);
  const cb = await clip.boundingBox(); await page.screenshot({ path: join(SHOTS, 'clip-playing-hover-off.png'), clip: { x: cb.x, y: Math.max(0, cb.y), width: cb.width, height: Math.min(cb.height, 900) } });
  await page.mouse.move(10, 10); await sleep(300); say(`  pointer away: pause button opacity=${await clip.locator('button').evaluate((b) => getComputedStyle(b).opacity)} (motion off, playing by the reader's choice)`);
  await ctx.close();
}

// the Decode headings and the readout when motion is on: text duplicated for AT?
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); await goto(page, '/work/parc/');
  const snap = await page.accessibility?.snapshot?.() ?? null;
  const h1 = await page.locator('h1').first().evaluate((h) => ({ sr: h.querySelector('.sr-only')?.textContent, hidden: [...h.querySelectorAll('[aria-hidden=true]')].map((e) => e.textContent.trim().slice(0, 20)) }));
  say(`parc h1 for AT: ${JSON.stringify(h1)}; aria snapshot h1 name: ${JSON.stringify(snap?.children?.find?.((c) => c.role === 'heading')?.name ?? 'n/a')}`);
  say(`parc meta dl: ${JSON.stringify(await page.locator('.meta').evaluate((dl) => [...dl.querySelectorAll('dt')].map((d) => d.textContent + ': ' + d.nextElementSibling.textContent.trim().slice(0, 30))))}`);
  // the point counters "01 / 09" are .lbl.dim
  say(`point counters: ${JSON.stringify(await page.locator('.point-text > .lbl').evaluateAll((ls) => ls.slice(0, 3).map((l) => l.textContent)))}`);
  // the image alt texts on parc
  say(`parc image alts (first 5): ${JSON.stringify(await page.locator('.gallery img, .point-figs img').evaluateAll((is) => is.slice(0, 5).map((i) => i.alt.slice(0, 70))))}; empty alts: ${await page.locator('main img').evaluateAll((is) => is.filter((i) => !i.alt).length)}`);
  await ctx.close();
}
await browser.close();
writeFileSync(join(DATA, 'followup.log'), log.join('\n'));
