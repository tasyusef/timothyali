// Navigation, settings, hover and press states, scroll behaviour. Motion on, as a visitor has it.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, collectErrors, goto, BASE, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const browser = await launch();

// --- every nav link, from Home, and aria-current ---
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); const errors = collectErrors(page);
  await goto(page, '/');
  for (const [label, href] of [['Work', '/work/'], ['Contact', '/contact/'], ['Toolbox', '/toolbox/'], ['Index', '/']]) {
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: label }).click();
    await page.waitForURL(BASE + href); await sleep(500);
    const current = await page.evaluate(() => [...document.querySelectorAll('nav a[aria-current]')].map((a) => a.textContent.trim()));
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent.trim().slice(0, 30));
    const focused = await page.evaluate(() => document.activeElement?.tagName + '.' + document.activeElement?.className);
    const scrollY = await page.evaluate(() => scrollY);
    say(`nav ${label} -> ${page.url().replace(BASE, '')} aria-current=${JSON.stringify(current)} h1=${JSON.stringify(h1)} activeElement=${focused} scrollY=${scrollY}`);
  }
  // wordmark home
  await page.goto(BASE + '/work/'); await page.locator('a.wordmark').click(); await page.waitForURL(BASE + '/'); say(`wordmark -> ${page.url().replace(BASE, '')}`);
  // readout path decodes
  await page.goto(BASE + '/'); await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work' }).click(); await sleep(900);
  say(`readout after nav: ${JSON.stringify(await page.evaluate(() => document.querySelector('.readout .path-full')?.textContent))}`);
  say(`nav errors: ${JSON.stringify(errors)}`);
  await ctx.close();
}

// --- Work cards, study links, Next chain, study meta links ---
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); const errors = collectErrors(page);
  await goto(page, '/work/');
  const cards = await page.locator('.cards .card').evaluateAll((as) => as.map((a) => ({ href: a.getAttribute('href'), title: a.querySelector('h2')?.textContent.trim(), name: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) })));
  say(`work cards: ${cards.length} ${JSON.stringify(cards.map((c) => c.href))}`);
  say(`card accessible text sample: ${JSON.stringify(cards[0].name)}`);
  for (const c of cards) {
    await page.goto(BASE + '/work/'); await page.locator(`.cards .card[href="${c.href}"]`).click(); await page.waitForURL(BASE + c.href); await sleep(300);
    const t = await page.title(); say(`card ${c.href} -> "${t}"`);
  }
  // Next chain from PARC
  await goto(page, '/work/parc/');
  const chain = [];
  for (let i = 0; i < 8; i++) { const next = page.locator('.next .cta-row'); const href = await next.getAttribute('href'); chain.push(href); await next.click(); await page.waitForURL(BASE + href); await sleep(200); }
  say(`next chain from parc: ${chain.join(' -> ')}`);
  // study meta links: external, open how?
  const metas = await page.evaluate(() => [...document.querySelectorAll('.meta a')].map((a) => `${a.textContent.trim()} ${a.href} target=${a.target || '-'} rel=${a.rel || '-'}`));
  say(`study meta links (${page.url().replace(BASE, '')}): ${JSON.stringify(metas)}`);
  // study page foot link
  await goto(page, '/work/parc/'); const foot = page.locator('.page-foot a'); say(`study page-foot link: ${await foot.textContent()} -> ${await foot.getAttribute('href')}`);
  say(`home card -> study: `); await goto(page, '/'); await page.locator('#work .card').first().click(); await sleep(300); say(`  ${page.url().replace(BASE, '')}`);
  await goto(page, '/'); await page.locator('.all').click(); await page.waitForURL(BASE + '/work/'); say(`home "All work" -> ${page.url().replace(BASE, '')}`);
  await goto(page, '/'); await page.locator('.hero-hint').click(); await sleep(900); say(`home "Selected work" chip -> hash=${new URL(page.url()).hash} scrollY=${await page.evaluate(() => scrollY)}`);
  await goto(page, '/'); say(`home resume link: ${await page.locator('.hero-actions .quiet-link').getAttribute('href')}`);
  say(`study errors: ${JSON.stringify(errors)}`);
  await ctx.close();
}

// --- Toolbox links and back; 404 home; agents jumps ---
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage(); const errors = collectErrors(page);
  await goto(page, '/toolbox/');
  await page.locator('.hero-actions .cta').click(); await sleep(900); say(`toolbox "Explore the tools" -> hash=${new URL(page.url()).hash} scrollY=${await page.evaluate(() => scrollY)} picker top=${await page.evaluate(() => Math.round(document.querySelector('#tools').getBoundingClientRect().top))}`);
  for (const slug of ['lockup', 'palette', 'specimen', 'convert']) {
    await goto(page, '/toolbox/');
    await page.locator(`.tool-picker button`, { hasText: new RegExp(slug, 'i') }).click(); await sleep(400);
    const pressed = await page.evaluate(() => [...document.querySelectorAll('.tool-picker button')].map((b) => b.getAttribute('aria-pressed')));
    const story = await page.locator('.tool-story h3').textContent();
    const guide = page.locator('.tool-story .quiet-link'); const gl = await guide.textContent(); const gh = await guide.getAttribute('href');
    say(`picker ${slug}: pressed=${pressed.join(',')} story="${story}" guide="${gl.trim()}" -> ${gh}`);
    await guide.click(); await page.waitForURL(BASE + `/toolbox/${slug}/`); await sleep(300);
    const back = page.locator('.page-foot a'); say(`  tool page ${slug}: title="${await page.title()}" back="${(await back.textContent()).trim()}" -> ${await back.getAttribute('href')}; next -> ${await page.locator('.next .cta-row').getAttribute('href')}; get-it -> ${await page.locator('.meta .quiet-link').getAttribute('href')}`);
    await back.click(); await page.waitForURL(BASE + '/toolbox/'); say(`  back -> ${page.url().replace(BASE, '')}`);
  }
  await goto(page, '/toolbox/'); await page.locator('.machine .quiet-link').click(); await page.waitForURL(BASE + '/toolbox/agents/'); say(`CLI & MCP docs -> ${page.url().replace(BASE, '')}`);
  for (const [id, name] of [['setup', 'Set up'], ['organize', 'Organize']]) { await page.locator('.jump a', { hasText: name }).click(); await sleep(900); const top = await page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), id); say(`agents jump "${name}": hash=${new URL(page.url()).hash} section top=${top} (chrome 96)`); }
  await page.locator('.option-links .quiet-link').first().click(); await page.waitForURL(/\/toolbox\/lockup\/#cli/); await sleep(900); say(`agents "Lockup options" -> ${page.url().replace(BASE, '')} #cli top=${await page.evaluate(() => Math.round(document.getElementById('cli').getBoundingClientRect().top))}`);
  await goto(page, '/toolbox/'); say(`toolbox foot: ${(await page.locator('.end .page-foot a').textContent()).trim()} -> ${await page.locator('.end .page-foot a').getAttribute('href')}; releases -> ${await page.locator('.release-copy > .quiet-link').getAttribute('href')}`);
  await goto(page, '/nope/'); say(`404 status title="${await page.title()}" cta="${(await page.locator('.lost .cta').textContent()).trim()}"`); await page.locator('.lost .cta').click(); await page.waitForURL(BASE + '/'); say(`404 -> ${page.url().replace(BASE, '')}`);
  say(`toolbox errors: ${JSON.stringify(errors)}`);
  await ctx.close();
}

// --- settings cog: every option, holds across pages, Escape, click outside ---
for (const width of [1440, 390]) {
  const ctx = await context(browser, { width, height: width < 700 ? 844 : 900, motion: null }); const page = await ctx.newPage();
  await goto(page, '/');
  const cog = page.locator('.settings .cog');
  say(`[${width}] cog visible=${await cog.isVisible()} name="${await cog.getAttribute('aria-label')}" expanded=${await cog.getAttribute('aria-expanded')} box=${JSON.stringify(await cog.boundingBox())}`);
  await cog.click(); await sleep(200);
  say(`[${width}] after click: expanded=${await cog.getAttribute('aria-expanded')} menu hidden=${await page.locator('#settings-menu').getAttribute('hidden')} menu box=${JSON.stringify(await page.locator('#settings-menu').boundingBox())}`);
  await page.screenshot({ path: join(SHOTS, `settings-open-${width}.png`) });
  const theme0 = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.locator('#settings-menu button', { hasText: 'Theme' }).click(); await sleep(600);
  const theme1 = await page.evaluate(() => document.documentElement.dataset.theme);
  say(`[${width}] theme ${theme0} -> ${theme1}; menu still open=${await cog.getAttribute('aria-expanded')}; label=${JSON.stringify(await page.locator('#settings-menu button', { hasText: 'Theme' }).textContent())}`);
  const motion0 = await page.evaluate(() => document.querySelector('.site').dataset.motion);
  await page.locator('#settings-menu button', { hasText: 'Motion' }).click(); await sleep(200);
  const motion1 = await page.evaluate(() => document.querySelector('.site').dataset.motion);
  say(`[${width}] motion ${motion0} -> ${motion1}; pressed=${await page.locator('#settings-menu button', { hasText: 'Motion' }).getAttribute('aria-pressed')}`);
  await page.screenshot({ path: join(SHOTS, `settings-light-motionoff-${width}.png`) });
  // holds across pages
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work' }).click(); await page.waitForURL(BASE + '/work/'); await sleep(300);
  say(`[${width}] on /work/: theme=${await page.evaluate(() => document.documentElement.dataset.theme)} motion=${await page.evaluate(() => document.querySelector('.site').dataset.motion)} menu open=${await cog.getAttribute('aria-expanded')}`);
  // reload holds
  await page.reload(); await sleep(500);
  say(`[${width}] after reload: theme=${await page.evaluate(() => document.documentElement.dataset.theme)} motion=${await page.evaluate(() => document.querySelector('.site').dataset.motion)}`);
  // Escape closes and refocuses cog
  await cog.click(); await sleep(100); await page.locator('#settings-menu button').first().focus(); await page.keyboard.press('Escape'); await sleep(100);
  say(`[${width}] Escape: expanded=${await cog.getAttribute('aria-expanded')} focus=${await page.evaluate(() => document.activeElement?.className)}`);
  await cog.click(); await sleep(100); await page.mouse.click(width / 2, 600); await sleep(100);
  say(`[${width}] click outside: expanded=${await cog.getAttribute('aria-expanded')}`);
  // keyboard: Enter and Space on the cog
  await cog.focus(); await page.keyboard.press('Enter'); await sleep(100); const e1 = await cog.getAttribute('aria-expanded'); await page.keyboard.press('Space'); await sleep(100); const e2 = await cog.getAttribute('aria-expanded');
  say(`[${width}] cog Enter -> ${e1}, Space -> ${e2}`);
  // restore
  await page.evaluate(() => { localStorage.setItem('tim-theme', 'dark'); localStorage.setItem('tim-motion', 'on'); });
  await ctx.close();
}

// --- hover and press states ---
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  const state = (sel) => page.evaluate((sel) => { const el = document.querySelector(sel); const cs = getComputedStyle(el); return { bg: cs.backgroundColor, color: cs.color, transform: cs.transform, shadow: cs.boxShadow }; }, sel);
  async function probe(path, sel, label) {
    await goto(page, path); const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await sleep(200);
    const rest = await state(sel);
    await el.hover(); await sleep(200); const hover = await state(sel);
    const box = await el.boundingBox(); await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down(); await sleep(150); const press = await state(sel);
    await page.screenshot({ path: join(SHOTS, `press-${label}.png`), clip: { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: Math.min(1440, box.width + 48), height: box.height + 48 } });
    await page.mouse.up(); await sleep(100);
    const changed = (a, b) => a.bg !== b.bg || a.color !== b.color || a.transform !== b.transform || a.shadow !== b.shadow;
    say(`state ${label.padEnd(18)} rest=${rest.bg}/${rest.color} hover=${changed(rest, hover) ? 'changes' : 'NO CHANGE'} press=${changed(hover, press) ? 'changes' : 'NO CHANGE'} (press bg ${press.bg})`);
  }
  await probe('/', '.site-header nav a[href="/work/"]', 'nav-link');
  await probe('/', '.hero-hint', 'hero-hint');
  await probe('/', '.hero-actions .quiet-link', 'resume-link');
  await probe('/', '#work .card', 'home-card');
  await probe('/', '.all', 'all-work');
  await probe('/', '.invitation .cta-row', 'invite-cta');
  await probe('/work/', '.cards .card', 'work-card');
  await probe('/work/parc/', '.meta a', 'study-live');
  await probe('/work/parc/', '.next .cta-row', 'study-next');
  await probe('/work/parc/', '.page-foot a', 'page-foot');
  await probe('/toolbox/', '.hero-actions .cta', 'toolbox-cta');
  await probe('/toolbox/', '.tool-picker button:nth-child(2)', 'picker');
  await probe('/toolbox/', '.downloads .files a', 'download-link');
  await probe('/toolbox/', '.machine .quiet-link', 'panel-quiet');
  await probe('/toolbox/agents/', '.jump a', 'jump-link');
  await probe('/contact/', '.contact-links .quiet-link', 'contact-link');
  await probe('/contact/', '.contact-note .cta-row', 'send');
  await probe('/nope/', '.lost .cta', '404-cta');
  await probe('/toolbox/', '.demo .chip', 'demo-chip');
  await probe('/toolbox/', '.demo .switch', 'demo-switch');
  await ctx.close();
}

// --- scroll top to bottom at 390 and 1440: sticky parts, jumps, layout shift ---
for (const width of [1440, 390]) {
  for (const [id, path] of [['home', '/'], ['work', '/work/'], ['parc', '/work/parc/'], ['toolbox', '/toolbox/'], ['agents', '/toolbox/agents/'], ['contact', '/contact/'], ['lockup', '/toolbox/lockup/']]) {
    const ctx = await context(browser, { width, height: width < 700 ? 844 : 900 }); const page = await ctx.newPage();
    await goto(page, path);
    await page.evaluate(() => { window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); });
    const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = []; let y = 0; const H = width < 700 ? 844 : 900;
    while (y < h0) { await page.mouse.wheel(0, Math.round(H * 0.8)); await sleep(120); y += H * 0.8; const s = await page.evaluate(() => ({ y: Math.round(scrollY), navTop: Math.round(document.querySelector('.nav-chrome').getBoundingClientRect().top), collapsed: document.querySelector('.nav-chrome').classList.contains('collapsed'), h: document.documentElement.scrollHeight })); steps.push(s); }
    await sleep(300);
    await page.mouse.wheel(0, -200); await sleep(200);
    const back = await page.evaluate(() => ({ y: Math.round(scrollY), navTop: Math.round(document.querySelector('.nav-chrome').getBoundingClientRect().top), collapsed: document.querySelector('.nav-chrome').classList.contains('collapsed') }));
    const cls = await page.evaluate(() => window.__cls);
    const h1 = await page.evaluate(() => document.documentElement.scrollHeight);
    const navTops = [...new Set(steps.map((s) => s.navTop))];
    say(`scroll [${width}] ${id.padEnd(8)} height ${h0}->${h1} (${Math.round(h1 / H)} screens) CLS=${cls.toFixed(3)} nav tops while scrolling down=${JSON.stringify(navTops)} collapsed at end=${steps.at(-1)?.collapsed}; after wheel up: navTop=${back.navTop} collapsed=${back.collapsed}`);
    if (id === 'parc') { await page.evaluate(() => scrollTo(0, 2200)); await sleep(300); say(`  parc sticky point-text at y=2200: ${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.point-text')].slice(0, 3).map((p) => ({ hold: p.classList.contains('hold'), top: Math.round(p.getBoundingClientRect().top), h: p.offsetHeight }))))}`); await page.screenshot({ path: join(SHOTS, `parc-sticky-${width}.png`) }); }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(DATA, 'nav.log'), log.join('\n'));
