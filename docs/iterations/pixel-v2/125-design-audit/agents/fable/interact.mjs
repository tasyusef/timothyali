// Interaction pass for the PX-125 audit (fable), after the brief's addendum: drive real pages with
// clicks, keyboard, hover, press and scroll; intercept the relay and the downloads. Read-only.
// node docs/iterations/pixel-v2/125-design-audit/agents/fable/interact.mjs
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'shots');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
const log = [];
const note = (area, did, happened, ok = true, extra = {}) => { log.push({ area, did, happened, ok, ...extra }); console.log(`${ok ? 'ok ' : 'XX '}[${area}] ${did} => ${happened}`); };

async function ctx(width, { theme = 'dark', motion = 'on', fresh = false } = {}) {
  const phone = width <= 420;
  const c = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  if (!fresh) await c.addInitScript(([t, m]) => { try { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', m); } catch {} }, [theme, motion]);
  return c;
}
const settle = async (page, ms = 300) => { await page.waitForLoadState('networkidle').catch(() => {}); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(ms); };
const path = (page) => new URL(page.url()).pathname;

// ---------- 1. navigation like a visitor, 1440 ----------
if (!process.env.FROM || +process.env.FROM <= 1) {
  const c = await ctx(1440);
  const page = await c.newPage();
  await page.goto(BASE + '/'); await settle(page);
  for (const [label, href] of [['Work', '/work/'], ['Contact', '/contact/'], ['Toolbox', '/toolbox/'], ['Index', '/']]) {
    await page.click(`.site-header nav a[href="${href}"]`); await settle(page, 500);
    const cur = await page.evaluate((h) => document.querySelector(`.site-header nav a[href="${h}"]`)?.getAttribute('aria-current'), href);
    note('nav', `click ${label}`, `${path(page)} aria-current=${cur}`, path(page) === href && cur === 'page');
  }
  await page.click('.wordmark'); await settle(page); note('nav', 'click wordmark', path(page), path(page) === '/');
  // Work cards → study → Next → back links
  await page.goto(BASE + '/work/'); await settle(page);
  const cards = await page.$$eval('.card', (els) => els.map((a) => ({ href: a.getAttribute('href'), title: a.querySelector('h2,h3').textContent.trim() })));
  note('cards', 'count the Work cards', `${cards.length}: ${cards.map((c) => c.title).join(', ')}`);
  for (const card of cards) {
    await page.goto(BASE + '/work/'); await settle(page);
    await page.click(`.card[href="${card.href}"]`); await settle(page, 400);
    const h1 = await page.$eval('h1', (h) => h.textContent.trim().replace(/\s+/g, ' ').slice(0, 30));
    note('cards', `click card ${card.title}`, `${path(page)} h1="${h1}"`, path(page) === card.href);
  }
  // one study's links: Live, Next, the foot link, and the Home card
  await page.goto(BASE + '/work/parc/'); await settle(page);
  const studyLinks = await page.$$eval('main a[href]', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), ext: a.host !== location.host, target: a.target })));
  note('study', 'list PARC links', JSON.stringify(studyLinks));
  await page.click('.cta-row'); await settle(page, 400); note('study', 'click Next row on PARC', path(page), path(page).startsWith('/work/'));
  await page.click('.page-foot a'); await settle(page, 400); note('study', 'click foot link on the next study', path(page), path(page) === '/contact/');
  await page.goto(BASE + '/'); await settle(page);
  await page.click('.cards .card >> nth=0'); await settle(page, 400); note('home', 'click first Home card', path(page), path(page).startsWith('/work/'));
  await page.goto(BASE + '/'); await settle(page);
  await page.click('.list .all'); await settle(page, 400); note('home', 'click All work', path(page), path(page) === '/work/');
  await page.goto(BASE + '/'); await settle(page);
  await page.click('.invitation .cta-row'); await settle(page, 400); note('home', 'click Get in touch', path(page), path(page) === '/contact/');
  await page.goto(BASE + '/'); await settle(page);
  const before = await page.evaluate(() => scrollY);
  await page.click('.hero-hint'); await page.waitForTimeout(900);
  const afterY = await page.evaluate(() => ({ y: scrollY, hash: location.hash, workTop: Math.round(document.getElementById('work').getBoundingClientRect().top), chrome: getComputedStyle(document.documentElement).getPropertyValue('--chrome-height'), nav: document.querySelector('.nav-chrome').className }));
  note('home', 'click Selected work chip (#work)', `scrolled ${before}→${afterY.y}, hash=${afterY.hash}, #work top=${afterY.workTop} (chrome ${afterY.chrome.trim()}, ${afterY.nav})`, afterY.y > 0, afterY);
  await page.screenshot({ path: join(OUT, 'int-home-after-chip-1440.png') });
  // Toolbox: hero CTA, tool guide links, tool page Next and back, CLI links
  await page.goto(BASE + '/toolbox/'); await settle(page);
  await page.click('.toolbox-hero .cta'); await page.waitForTimeout(900);
  const t = await page.evaluate(() => ({ y: scrollY, top: Math.round(document.getElementById('tools').getBoundingClientRect().top) }));
  note('toolbox', 'click Explore the tools (#tools)', `scrollY=${t.y}, #tools top=${t.top}`, t.y > 0);
  await page.screenshot({ path: join(OUT, 'int-toolbox-after-explore-1440.png') });
  for (const tool of ['lockup', 'palette', 'specimen', 'convert']) {
    await page.goto(BASE + '/toolbox/'); await settle(page);
    await page.click(`.tool-picker button:has-text("${tool}")`); await page.waitForTimeout(700);
    const guide = await page.$eval('.tool-story .quiet-link', (a) => a.textContent.trim());
    await page.click('.tool-story .quiet-link'); await settle(page, 400);
    note('toolbox', `pick ${tool}, click "${guide}"`, path(page), path(page) === `/toolbox/${tool}/`);
  }
  await page.goto(BASE + '/toolbox/lockup/'); await settle(page);
  await page.click('.cta-row'); await settle(page, 400); note('toolbox', 'click Next on Lockup', path(page), path(page) === '/toolbox/palette/');
  await page.click('.page-foot a'); await settle(page, 400); note('toolbox', 'click All four tools foot link', path(page), path(page) === '/toolbox/');
  await page.goto(BASE + '/toolbox/lockup/'); await settle(page);
  await page.click('.stack .quiet-link'); await settle(page, 400); note('toolbox', 'click CLI & MCP setup on Lockup', path(page), path(page) === '/toolbox/agents/');
  await page.click('.option-links a >> nth=0'); await settle(page, 600);
  const cli = await page.evaluate(() => ({ p: location.pathname, hash: location.hash, top: Math.round(document.getElementById('cli')?.getBoundingClientRect().top ?? -1) }));
  note('toolbox', 'click first option link on CLI & MCP', `${cli.p}${cli.hash}, #cli top=${cli.top}`, cli.hash === '#cli' && cli.top >= 0 && cli.top < 300, cli);
  await page.screenshot({ path: join(OUT, 'int-lockup-cli-anchor-1440.png') });
  await page.goto(BASE + '/toolbox/agents/'); await settle(page);
  for (const id of ['setup', 'run', 'organize']) {
    await page.click(`.jump a[href="#${id}"]`); await page.waitForTimeout(900);
    const j = await page.evaluate((id) => ({ top: Math.round(document.getElementById(id).getBoundingClientRect().top), nav: document.querySelector('.nav-chrome').className }), id);
    note('agents', `click jump "${id}"`, `section top=${j.top} (${j.nav})`, j.top >= 0 && j.top < 200, j);
  }
  await page.screenshot({ path: join(OUT, 'int-agents-jump-organize-1440.png') });
  // the CLI & MCP page's "copy/command controls": are there any?
  const copyCtl = await page.$$eval('main button, main [role=button]', (bs) => bs.map((b) => b.textContent.trim().slice(0, 30)));
  note('agents', 'look for copy/command controls', `buttons in main: ${JSON.stringify(copyCtl)} (code blocks are plain <pre>; selecting text is the copy path)`);
  await page.locator('.code').first().scrollIntoViewIfNeeded();
  await page.locator('.code').first().click({ clickCount: 3 }); await page.waitForTimeout(100);
  const sel = await page.evaluate(() => getSelection().toString().slice(0, 60));
  note('agents', 'triple-click the first code block', `selection="${sel}"`, sel.length > 0);
  // the 404's way home
  await page.goto(BASE + '/nope/'); await settle(page);
  const st = await page.evaluate(() => document.title);
  await page.click('.cta'); await settle(page, 400); note('404', `click Back to home (title was "${st}")`, path(page), path(page) === '/');
  await c.close();
}

// ---------- 2. settings: every option, and persistence across pages ----------
if (!process.env.FROM || +process.env.FROM <= 2) {
  const c = await ctx(1440, { fresh: true });
  const page = await c.newPage();
  await page.goto(BASE + '/'); await settle(page);
  const s0 = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site').dataset.motion, cogVisible: getComputedStyle(document.querySelector('.settings')).visibility }));
  note('settings', 'fresh visit', JSON.stringify(s0));
  await page.click('.settings .cog'); await page.waitForTimeout(150);
  const open = await page.evaluate(() => ({ hidden: document.getElementById('settings-menu').hidden, expanded: document.querySelector('.cog').getAttribute('aria-expanded'), rows: [...document.querySelectorAll('.settings-menu button')].map((b) => b.textContent.trim()) }));
  note('settings', 'click the cog', JSON.stringify(open), !open.hidden);
  await page.screenshot({ path: join(OUT, 'int-settings-open-1440.png'), clip: { x: 1040, y: 0, width: 400, height: 200 } });
  await page.click('.settings-menu button:has-text("Motion")'); await page.waitForTimeout(150);
  const m1 = await page.evaluate(() => ({ motion: document.querySelector('.site').dataset.motion, label: document.querySelector('.settings-menu button').textContent.trim(), pressed: document.querySelector('.settings-menu button').getAttribute('aria-pressed'), menuOpen: !document.getElementById('settings-menu').hidden, cursorAnim: getComputedStyle(document.querySelector('.cursor')).animationName }));
  note('settings', 'click Motion', JSON.stringify(m1), m1.motion === 'off' && m1.menuOpen);
  await page.click('.settings-menu button:has-text("Theme")'); await page.waitForTimeout(700);
  const t1 = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, label: document.querySelectorAll('.settings-menu button')[1].textContent.trim(), meta: document.querySelector('meta[name=theme-color]').content, menuOpen: !document.getElementById('settings-menu').hidden }));
  note('settings', 'click Theme', JSON.stringify(t1), t1.theme === 'light');
  await page.screenshot({ path: join(OUT, 'int-settings-light-motion-off-1440.png') });
  await page.mouse.click(600, 500); await page.waitForTimeout(100);
  const closed = await page.evaluate(() => document.getElementById('settings-menu').hidden);
  note('settings', 'click outside the menu', `menu hidden=${closed}`, closed);
  for (const p of ['/work/', '/work/parc/', '/toolbox/', '/contact/', '/nope/']) {
    await page.click(`.site-header nav a[href="/work/"]`).catch(() => {});
    await page.goto(BASE + p); await settle(page);
    const s = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site').dataset.motion, saved: [localStorage.getItem('tim-theme'), localStorage.getItem('tim-motion')] }));
    note('settings', `open ${p} after the choices`, JSON.stringify(s), s.theme === 'light' && s.motion === 'off');
  }
  // a client-side navigation keeps them too
  await page.goto(BASE + '/'); await settle(page);
  await page.click('.site-header nav a[href="/work/"]'); await settle(page, 500);
  const s2 = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site').dataset.motion }));
  note('settings', 'client-side nav Home→Work', JSON.stringify(s2), s2.theme === 'light' && s2.motion === 'off');
  // toggle back with the keyboard: Space on each
  await page.focus('.settings .cog'); await page.keyboard.press('Space'); await page.waitForTimeout(100);
  await page.keyboard.press('Tab'); await page.keyboard.press('Space'); await page.waitForTimeout(100);
  await page.keyboard.press('Tab'); await page.keyboard.press('Space'); await page.waitForTimeout(700);
  const s3 = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, motion: document.querySelector('.site').dataset.motion, active: document.activeElement.textContent.trim() }));
  note('settings', 'Space on cog, Motion, Theme', JSON.stringify(s3), s3.theme === 'dark' && s3.motion === 'on');
  await page.keyboard.press('Escape'); await page.waitForTimeout(50);
  const s4 = await page.evaluate(() => ({ hidden: document.getElementById('settings-menu').hidden, active: document.activeElement.className }));
  note('settings', 'Escape', JSON.stringify(s4), s4.hidden && s4.active.includes('cog'));
  // the cog on a page scrolled down: the header collapses; does the menu survive a scroll?
  await page.goto(BASE + '/work/'); await settle(page);
  await page.click('.settings .cog'); await page.waitForTimeout(100);
  await page.mouse.move(700, 500); await page.mouse.wheel(0, 600); await page.waitForTimeout(400);
  const s5 = await page.evaluate(() => ({ menuHidden: document.getElementById('settings-menu').hidden, nav: document.querySelector('.nav-chrome').className, headerTop: Math.round(document.querySelector('.site-header').getBoundingClientRect().top) }));
  note('settings', 'open the menu, then scroll down 600', JSON.stringify(s5));
  await c.close();
}

// ---------- 3. hover, press, swell and ripples, 1440 ----------
{
  const c = await ctx(1440);
  const page = await c.newPage();
  const css = (sel) => page.$eval(sel, (el) => { const cs = getComputedStyle(el); return { bg: cs.backgroundColor, color: cs.color, transform: cs.transform, shadow: cs.boxShadow }; });
  const hoverPress = async (label, sel, shot) => {
    const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(100);
    const rest = await css(sel);
    const b = await el.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(150);
    const hover = await css(sel);
    if (shot) await page.screenshot({ path: join(OUT, `int-hover-${shot}.png`), clip: { x: Math.max(0, b.x - 24), y: Math.max(0, b.y - 24), width: Math.min(b.width + 48, 1440), height: Math.min(b.height + 48, 900) } });
    await page.mouse.down(); await page.waitForTimeout(120);
    const press = await css(sel);
    if (shot) await page.screenshot({ path: join(OUT, `int-press-${shot}.png`), clip: { x: Math.max(0, b.x - 24), y: Math.max(0, b.y - 24), width: Math.min(b.width + 48, 1440), height: Math.min(b.height + 48, 900) } });
    const from = page.url();
    await page.mouse.up(); await page.mouse.move(5, 5); await page.waitForTimeout(250);
    if (page.url() !== from) { await page.goto(from); await settle(page, 800); }
    const changed = (a, b2) => a.bg !== b2.bg || a.color !== b2.color || a.transform !== b2.transform || a.shadow !== b2.shadow;
    note('states', `hover+press ${label}`, `rest ${rest.bg}/${rest.color} → hover ${hover.bg}/${hover.color}${hover.transform !== rest.transform ? ' moved ' + hover.transform : ''} → press ${press.bg}/${press.color}${press.shadow !== 'none' ? ' shadow' : ''}`, changed(rest, hover) && changed(hover, press));
  };
  await page.goto(BASE + '/'); await settle(page, 1200);
  await hoverPress('nav link Work', '.site-header nav a[href="/work/"]', 'nav');
  await hoverPress('hero chip', '.hero-hint', 'chip');
  await hoverPress('hero Resume quiet link', '.hero-actions .quiet-link', 'quiet');
  await hoverPress('Home card', '.cards .card', 'card');
  await hoverPress('Get in touch row', '.invitation .cta-row', 'row');
  await page.goto(BASE + '/toolbox/'); await settle(page, 800);
  await hoverPress('Toolbox hero CTA block', '.toolbox-hero .cta', 'cta');
  await hoverPress('tool picker (unpressed)', '.tool-picker button:nth-child(2)', 'picker');
  await hoverPress('download link', '.downloads .files a', 'download');
  await page.goto(BASE + '/contact/'); await settle(page, 800);
  await hoverPress('Contact Send (on the panel)', '#contact-form button[type=submit]', 'send');
  await hoverPress('Contact quiet link on the panel', '.contact-links .quiet-link', 'panel-quiet');
  // the pointer's swell and a click's ripples on Home's field
  await page.goto(BASE + '/'); await settle(page, 1500);
  const band = page.locator('.band.page-sky').first();
  const region = { x: 200, y: 180, width: 700, height: 360 };
  const still = await page.screenshot({ clip: region });
  await page.mouse.move(400, 300); await page.mouse.move(520, 360, { steps: 12 }); await page.waitForTimeout(250);
  const swell = await page.screenshot({ clip: region, path: join(OUT, 'int-field-swell-1440.png') });
  note('field', 'move the pointer across the hero field', `pixels changed vs still: ${swell.equals(still) ? 'none' : 'yes'}`, !swell.equals(still));
  await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(350);
  const ripple = await page.screenshot({ clip: region, path: join(OUT, 'int-field-ripple-1440.png') });
  note('field', 'click the hero field', `pixels changed vs swell: ${ripple.equals(swell) ? 'none' : 'yes'}`, !ripple.equals(swell));
  const selAfter = await page.evaluate(() => getSelection().toString().length);
  await page.mouse.dblclick(560, 380); await page.waitForTimeout(100);
  const selDbl = await page.evaluate(() => getSelection().toString().length);
  note('field', 'double-click the bare field beside the copy', `selection length ${selAfter}→${selDbl}`, selDbl === 0);
  // motion off: the field must hold still under the pointer and the press must still show
  const c2 = await ctx(1440, { motion: 'off' }); const p2 = await c2.newPage();
  await p2.goto(BASE + '/'); await settle(p2, 800);
  const s1 = await p2.screenshot({ clip: region }); await p2.mouse.move(400, 300); await p2.mouse.move(520, 360, { steps: 12 }); await p2.mouse.down(); await p2.mouse.up(); await p2.waitForTimeout(400);
  const s2 = await p2.screenshot({ clip: region });
  note('field', 'motion off: move and click on the field', `pixels changed: ${s1.equals(s2) ? 'none' : 'yes'}`, s1.equals(s2));
  const r = p2.locator('.invitation .cta-row'); await r.scrollIntoViewIfNeeded(); const rb = await r.boundingBox(); await p2.mouse.move(rb.x + 40, rb.y + 20); await p2.mouse.down(); await p2.waitForTimeout(100);
  const pressOff = await p2.$eval('.invitation .cta-row', (el) => getComputedStyle(el).backgroundColor); await p2.mouse.up();
  note('field', 'motion off: press Get in touch', `bg while pressed ${pressOff}`, pressOff === 'rgb(242, 214, 0)');
  await c2.close();
  await c.close();
}

// ---------- 4. keyboard only: Enter and Space on every kind of control ----------
{
  const c = await ctx(1440);
  const page = await c.newPage();
  await page.goto(BASE + '/'); await settle(page, 600);
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => ({ el: document.activeElement.className, visible: document.activeElement.getBoundingClientRect().top >= 0 && getComputedStyle(document.activeElement).transform === 'none' }));
  await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  const afterSkip = await page.evaluate(() => ({ active: document.activeElement.id || document.activeElement.tagName, y: scrollY }));
  note('keyboard', 'Tab once, Enter on the skip link', `skip=${JSON.stringify(skip)} → active=${afterSkip.active}`, skip.el.includes('skip') && skip.visible && afterSkip.active === 'main');
  await page.keyboard.press('Tab');
  const next = await page.evaluate(() => document.activeElement.className + ' ' + document.activeElement.textContent.trim().slice(0, 20));
  note('keyboard', 'Tab after the skip', `focus on "${next}" (the first control inside main?)`, !next.includes('wordmark'));
  // Enter on a nav link navigates; Space does not (links); Space on buttons does
  await page.goto(BASE + '/'); await settle(page, 400);
  await page.focus('.site-header nav a[href="/work/"]'); await page.keyboard.press('Enter'); await settle(page, 500);
  note('keyboard', 'Enter on nav Work', path(page), path(page) === '/work/');
  await page.focus('.cards .card'); await page.keyboard.press('Enter'); await settle(page, 500);
  note('keyboard', 'Enter on the first Work card', path(page), path(page).startsWith('/work/') && path(page) !== '/work/');
  await page.goto(BASE + '/toolbox/'); await settle(page, 400);
  await page.focus('.tool-picker button:nth-child(3)'); await page.keyboard.press('Space'); await page.waitForTimeout(700);
  const pick = await page.evaluate(() => ({ pressed: document.querySelector('.tool-picker button:nth-child(3)').getAttribute('aria-pressed'), h3: document.querySelector('.tool-story h3').textContent }));
  note('keyboard', 'Space on tool picker 3 (Specimen)', JSON.stringify(pick), pick.pressed === 'true');
  // demo controls: chips, switch, steps, tree rows
  await page.goto(BASE + '/toolbox/'); await settle(page, 600);
  const first = await page.$('.demo .switch input');
  if (first) {
    await first.focus(); const name = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    const before = await page.evaluate(() => document.activeElement.checked);
    await page.keyboard.press('Space'); await page.waitForTimeout(150);
    const after = await page.evaluate(() => ({ checked: document.activeElement.checked, state: document.activeElement.closest('.switch').querySelector('.state').textContent, ringOn: getComputedStyle(document.activeElement.closest('.switch').querySelector('.state')).outlineStyle }));
    note('keyboard', `Space on demo switch "${name}"`, `${before}→${JSON.stringify(after)}`, after.checked !== before);
    await page.screenshot({ path: join(OUT, 'int-demo-switch-focus-1440.png') });
  }
  const chip = await page.$('.demo .chip');
  if (chip) { await chip.focus(); const b = await page.evaluate(() => document.activeElement.getAttribute('aria-pressed') ?? document.activeElement.className); await page.keyboard.press('Enter'); await page.waitForTimeout(150); const a = await page.evaluate(() => document.activeElement.getAttribute('aria-pressed') ?? document.activeElement.className); note('keyboard', 'Enter on a demo chip', `${b} → ${a}`, a !== b); }
  const tree = await page.$('.demo button.tree-row');
  if (tree) { await tree.focus(); const b = await page.evaluate(() => document.activeElement.getAttribute('aria-expanded')); await page.keyboard.press('Space'); await page.waitForTimeout(150); const a = await page.evaluate(() => document.activeElement.getAttribute('aria-expanded')); note('keyboard', 'Space on a plan tree row', `aria-expanded ${b} → ${a}`, a !== b); }
  const range = await page.$('.demo input[type=range]');
  if (range) { await range.focus(); const b = await page.evaluate(() => document.activeElement.value); await page.keyboard.press('ArrowRight'); const a = await page.evaluate(() => document.activeElement.value); note('keyboard', 'ArrowRight on the demo slider', `${b} → ${a}`, a !== b); }
  const sel = await page.$('.demo select');
  if (sel) { await sel.focus(); const b = await page.evaluate(() => document.activeElement.value); await page.keyboard.press('ArrowDown'); const a = await page.evaluate(() => document.activeElement.value); note('keyboard', 'ArrowDown on a demo select', `${b} → ${a}`, a !== b); }
  // Options <details> summary on a phone width, by keyboard
  const cp = await ctx(390); const pp = await cp.newPage();
  await pp.goto(BASE + '/toolbox/lockup/'); await settle(pp, 400);
  const sum = await pp.$('details.collapse summary');
  const vis = await sum.isVisible(); await sum.focus(); const b = await pp.evaluate(() => document.querySelector('details.collapse').open); await pp.keyboard.press('Enter'); await pp.waitForTimeout(100); const a = await pp.evaluate(() => document.querySelector('details.collapse').open);
  note('keyboard', 'phone: Enter on "All N options" summary', `visible=${vis}, open ${b} → ${a}`, vis && a !== b);
  await pp.screenshot({ path: join(OUT, 'int-options-open-390.png') });
  await cp.close();
  // video: Tab to the play/pause button, Space toggles
  await page.goto(BASE + '/work/parc/'); await settle(page, 400);
  await page.locator('.clip').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
  await page.focus('.clip button'); const vb = await page.evaluate(() => ({ label: document.activeElement.getAttribute('aria-label'), paused: document.querySelector('.clip video').paused, opacity: getComputedStyle(document.activeElement).opacity }));
  await page.keyboard.press('Space'); await page.waitForTimeout(400);
  const va = await page.evaluate(() => ({ label: document.querySelector('.clip button')?.getAttribute('aria-label'), paused: document.querySelector('.clip video').paused, active: document.activeElement.tagName + ' ' + document.activeElement.getAttribute('aria-label') }));
  note('keyboard', 'Tab to the clip button, Space', `${JSON.stringify(vb)} → ${JSON.stringify(va)}`, vb.paused !== va.paused, { vb, va });
  await page.screenshot({ path: join(OUT, 'int-video-after-space-1440.png') });
  await c.close();
}

// ---------- 5. downloads intercepted, the phone send-link control ----------
{
  const c = await ctx(1440);
  const page = await c.newPage();
  const hits = [];
  await page.route('**/download/**', (route) => { hits.push(route.request().url()); route.fulfill({ status: 200, contentType: 'text/plain', body: 'intercepted' }); });
  await page.goto(BASE + '/toolbox/'); await settle(page);
  const links = await page.$$eval('.downloads .files a', (as) => as.map((a) => ({ href: a.getAttribute('href'), label: a.textContent.trim(), download: a.hasAttribute('download'), target: a.target })));
  note('downloads', 'list the download links', JSON.stringify(links));
  for (const l of links) {
    await page.click(`.downloads .files a[href="${l.href}"]`); await page.waitForTimeout(500);
    note('downloads', `click ${l.label}`, `request ${hits.at(-1)?.replace(BASE, '') ?? 'none'}; now at ${path(page)}`, (hits.at(-1) || '').includes('/download/'));
    if (path(page) !== '/toolbox/') { await page.goto(BASE + '/toolbox/'); await settle(page); }
  }
  const rel = await page.$eval('.release-copy > .quiet-link', (a) => ({ href: a.href, text: a.textContent.trim(), target: a.target }));
  note('downloads', 'the releases link', JSON.stringify(rel));
  await c.close();
  const cp = await ctx(390); const pp = await cp.newPage();
  await pp.goto(BASE + '/toolbox/'); await settle(pp);
  const onPhone = await pp.$eval('.on-phone', (el) => getComputedStyle(el).display);
  const share = await pp.evaluate(() => ({ share: typeof navigator.share, clipboard: !!navigator.clipboard?.writeText }));
  await pp.locator('.on-phone .send').scrollIntoViewIfNeeded();
  await pp.locator('.on-phone .send').tap(); await pp.waitForTimeout(300);
  const label = await pp.$eval('.on-phone .send span', (s) => s.textContent.trim());
  await pp.screenshot({ path: join(OUT, 'int-send-link-390.png') });
  note('downloads', 'phone: tap "Send the link to your computer"', `panel display=${onPhone}, share=${share.share}, clipboard=${share.clipboard}, label now "${label}"`, onPhone === 'flex');
  await pp.waitForTimeout(2600);
  note('downloads', 'phone: 2.6 s later', `label "${await pp.$eval('.on-phone .send span', (s) => s.textContent.trim())}"`);
  await cp.close();
}

// ---------- 6. scroll every page top to bottom at 390 and 1440 ----------
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
for (const width of [1440, 390]) {
  const c = await ctx(width);
  const page = await c.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p); await settle(page, 600);
    const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = []; let y = 0; const vh = width <= 420 ? 844 : 900;
    let sticky = new Set(); let collapsedSeen = false; let jumps = [];
    while (true) {
      await page.mouse.move(width / 2, vh / 2); await page.mouse.wheel(0, Math.round(vh * 0.8)); await page.waitForTimeout(160);
      const s = await page.evaluate(() => {
        const nav = document.querySelector('.nav-chrome'); const r = nav.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('body *')].filter((el) => { const cs = getComputedStyle(el); return (cs.position === 'sticky' || cs.position === 'fixed') && el.getBoundingClientRect().height > 0; }).map((el) => el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.'));
        return { y: scrollY, h: document.documentElement.scrollHeight, navTop: Math.round(r.top), navH: Math.round(r.height), collapsed: nav.classList.contains('collapsed'), fixed: [...new Set(fixed)] };
      });
      s.fixed.forEach((f) => sticky.add(f)); if (s.collapsed) collapsedSeen = true;
      if (s.h !== h0) jumps.push(`height ${h0}→${s.h} at y=${s.y}`);
      steps.push(s);
      if (s.y === y || s.y + vh >= s.h - 1) break; y = s.y;
      if (steps.length > 80) break;
    }
    // scroll back up a little: the header returns
    await page.mouse.wheel(0, -300); await page.waitForTimeout(250);
    const up = await page.evaluate(() => ({ collapsed: document.querySelector('.nav-chrome').classList.contains('collapsed'), navTop: Math.round(document.querySelector('.nav-chrome').getBoundingClientRect().top) }));
    note('scroll', `${p} @${width}: wheel to the bottom in ${steps.length} steps`, `height ${h0}; sticky/fixed: ${[...sticky].join(', ')}; header collapsed while scrolling down: ${collapsedSeen}; after 300 up: collapsed=${up.collapsed} top=${up.navTop}; ${jumps.length ? 'JUMPS: ' + jumps.join('; ') : 'no height jumps'}`, jumps.length === 0);
    if (p === '/work/parc/' || p === '/') await page.screenshot({ path: join(OUT, `int-scroll-mid-${p === '/' ? 'home' : 'parc'}-${width}.png`) });
  }
  await c.close();
}

await browser.close();
writeFileSync(join(HERE, 'interact.json'), JSON.stringify(log, null, 1));
console.log(`\n${log.filter((l) => !l.ok).length} of ${log.length} interactions flagged`);
