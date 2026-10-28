// Accessibility, state and typography checks for the PX-125 audit (fable). Read-only: writes only into this folder.
// node docs/iterations/pixel-v2/125-design-audit/agents/fable/checks.mjs
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'shots');
mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:4173';
const PAGES = ['/', '/work/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/jade-aesthetics/', '/work/firststrike/', '/work/toolbox/', '/toolbox/', '/toolbox/lockup/', '/toolbox/palette/', '/toolbox/specimen/', '/toolbox/convert/', '/toolbox/agents/', '/contact/', '/nope/'];
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const browser = await chromium.launch({ channel: 'chrome' });
const out = { pages: {}, focus: {}, form: {}, settings: {}, video: {}, measure: {} };

async function ctx(width, { theme = 'dark', motion = 'off' } = {}) {
  const phone = width <= 420;
  const c = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await c.addInitScript(([t, m]) => { try { localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', m); } catch {} }, [theme, motion]);
  return c;
}
async function settle(page) { await page.waitForLoadState('networkidle').catch(() => {}); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300); }

const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}`;

const pageProbe = () => {
  const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}`;
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const name = (el) => {
    const lb = el.getAttribute('aria-labelledby'); if (lb) return [...lb.split(/\s+/)].map((id) => document.getElementById(id)?.textContent?.trim() ?? '').join(' ');
    const al = el.getAttribute('aria-label'); if (al) return al;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') { const l = el.id && document.querySelector(`label[for="${el.id}"]`); if (l) return l.textContent.trim(); const w = el.closest('label'); if (w) return w.textContent.trim(); return ''; }
    return (el.textContent || '').trim() || [...el.querySelectorAll('img[alt]')].map((i) => i.alt).join(' ');
  };
  const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => `${h.tagName} ${Math.round(parseFloat(getComputedStyle(h).fontSize))}px ${h.classList.contains('sr-only') || h.querySelector('.sr-only') ? '(sr) ' : ''}"${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)}"`);
  const landmarks = [...document.querySelectorAll('main,nav,header,footer,[role]')].map((el) => `${describe(el)}${el.getAttribute('role') ? '[role=' + el.getAttribute('role') + ']' : ''}${el.getAttribute('aria-label') ? '[label=' + el.getAttribute('aria-label') + ']' : ''}`);
  const controls = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,video,[tabindex]')].filter(visible);
  const unnamed = controls.filter((el) => !name(el) && el.tagName !== 'VIDEO').map(describe);
  const small = controls.filter((el) => el.tagName !== 'VIDEO' && !el.closest('[aria-hidden="true"]')).map((el) => { const r = el.getBoundingClientRect(); const after = getComputedStyle(el, '::after'); return { el: describe(el), w: Math.round(r.width), h: Math.round(r.height), after: after.content !== 'none' && after.position === 'absolute' ? after.inset : '' }; }).filter((x) => x.w < 24 || x.h < 24);
  const hiddenFocusable = [...document.querySelectorAll('[aria-hidden="true"] a[href],[aria-hidden="true"] button,[aria-hidden="true"] input,[aria-hidden="true"] [tabindex]')].map((el) => `${describe(el)} tabindex=${el.getAttribute('tabindex')}`);
  const imgs = [...document.querySelectorAll('img')].map((i) => ({ alt: i.hasAttribute('alt') ? i.alt.slice(0, 50) : null, src: i.currentSrc.split('/').pop() }));
  const noAlt = imgs.filter((i) => i.alt === null).length;
  const live = [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((el) => `${describe(el)} ${el.getAttribute('aria-live') || el.getAttribute('role')}`);
  const nav = [...document.querySelectorAll('.site-header nav a')].map((a) => `"${name(a)}"${a.hasAttribute('aria-current') ? ' current' : ''}`);
  const skipFirst = (() => { const f = [...document.querySelectorAll('a[href],button,input,[tabindex="0"]')].find(visible) || document.querySelector('a[href],button'); return describe(f); })();
  const lang = document.documentElement.lang; const vp = document.querySelector('meta[name=viewport]')?.content;
  const linkNames = [...document.querySelectorAll('a[href]')].filter(visible).map((a) => name(a).replace(/\s+/g, ' ').slice(0, 70));
  const dupNames = Object.entries(linkNames.reduce((m, n) => ((m[n] = (m[n] || 0) + 1), m), {})).filter(([, c]) => c > 1).map(([n, c]) => `${c}× "${n}"`);
  return { title: document.title, lang, vp, headings, landmarks, unnamed, small, hiddenFocusable, imgs: imgs.length, noAlt, live, nav, skipFirst, dupNames, linkNames: linkNames.slice(0, 40) };
};

// measure: characters per line and line-height ratios of the text roles on a page
const measureProbe = () => {
  const cv = document.createElement('canvas').getContext('2d');
  const roles = ['.body', '.read', '.lead', '.lbl.dim.cap', '.read-s', '.downloads .note', 'dd.body', '.rules dd'];
  const res = {};
  for (const sel of roles) {
    const els = [...document.querySelectorAll(sel)].filter((el) => el.textContent.trim().length > 60 && el.getBoundingClientRect().width > 0 && !el.closest('[aria-hidden="true"]') && !el.classList.contains('sr-only'));
    if (!els.length) continue;
    const rows = els.map((el) => { const s = getComputedStyle(el); cv.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`; const t = el.textContent.trim().replace(/\s+/g, ' '); const avg = cv.measureText(t).width / t.length; const w = el.getBoundingClientRect().width; return { cpl: Math.round(w / avg), w: Math.round(w), fs: s.fontSize, lh: s.lineHeight, ratio: (parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2), chars: t.length, tt: s.textTransform, op: s.opacity, lines: Math.round(el.getBoundingClientRect().height / parseFloat(s.lineHeight)) }; });
    rows.sort((a, b) => b.cpl - a.cpl);
    res[sel] = { n: rows.length, maxCpl: rows[0], longest: rows.sort((a, b) => b.chars - a.chars)[0] };
  }
  return res;
};

// ---- per page at 1440 (desktop) and 390 (phone, touch) ----
for (const width of [1440, 390]) {
  const c = await ctx(width);
  const page = await c.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    out.pages[`${p}@${width}`] = await page.evaluate(pageProbe);
    if (width === 1440 || ['/', '/work/parc/', '/toolbox/', '/toolbox/agents/', '/toolbox/lockup/'].includes(p)) out.measure[`${p}@${width}`] = await page.evaluate(measureProbe);
  }
  await c.close();
}

// ---- keyboard walk and focus rings, 1440 dark and light ----
for (const theme of ['dark', 'light']) {
  const c = await ctx(1440, { theme });
  const page = await c.newPage();
  for (const p of ['/', '/work/', '/work/parc/', '/toolbox/', '/contact/']) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const stops = [];
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => {
        const el = document.activeElement; if (!el || el === document.body) return { el: 'body' };
        const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}`;
        const fv = el.matches(':focus-visible');
        return { el: describe(el), fv, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} off ${cs.outlineOffset}`, bg: cs.backgroundColor, color: cs.color, inView: r.top >= 0 && r.bottom <= innerHeight, top: Math.round(r.top), text: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) };
      });
      stops.push(s);
      if (s.el === 'body' && i > 2) break;
      if (i === 0) await page.screenshot({ path: join(OUT, `focus-${slug(p)}-skip-${theme}.png`), clip: { x: 0, y: 0, width: 600, height: 120 } });
      if (i === 2) await page.screenshot({ path: join(OUT, `focus-${slug(p)}-nav-${theme}.png`), clip: { x: 0, y: 0, width: 1440, height: 112 } });
    }
    out.focus[`${p}@${theme}`] = stops;
  }
  // the settings cog and its menu by keyboard
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
  await page.focus('.settings .cog');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const open = await page.evaluate(() => !document.getElementById('settings-menu').hidden);
  await page.keyboard.press('Tab');
  const onMotion = await page.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); const menu = getComputedStyle(el.closest('.settings-menu')); return { el: el.textContent.trim(), bg: cs.backgroundColor, color: cs.color, outline: cs.outlineColor, menuBg: menu.backgroundColor, pressed: el.getAttribute('aria-pressed') }; });
  await page.screenshot({ path: join(OUT, `settings-menu-focus-${theme}.png`), clip: { x: 1040, y: 0, width: 400, height: 200 } });
  await page.mouse.move(1300, 80);
  // hover state of the second row with the first still focused
  const theme2 = await page.evaluate(() => { const b = document.querySelectorAll('.settings-menu button')[1]; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await page.mouse.move(theme2.x, theme2.y);
  await page.waitForTimeout(100);
  await page.screenshot({ path: join(OUT, `settings-menu-hover-${theme}.png`), clip: { x: 1040, y: 0, width: 400, height: 200 } });
  const hoverCss = await page.evaluate(() => { const b = document.querySelectorAll('.settings-menu button')[1]; const cs = getComputedStyle(b); return { bg: cs.backgroundColor, color: cs.color }; });
  await page.keyboard.press('Escape');
  const after = await page.evaluate(() => ({ hidden: document.getElementById('settings-menu').hidden, active: document.activeElement.className }));
  out.settings[theme] = { open, onMotion, hoverCss, after };
  // theme toggle by keyboard flips data-theme
  await page.focus('.settings .cog'); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  out.settings[theme].toggled = await page.evaluate(() => document.documentElement.dataset.theme);
  await c.close();
}

// ---- the contact form's states (the relay is never hit: /api/contact is mocked) ----
for (const width of [1440, 390]) {
  for (const theme of width === 1440 ? ['dark', 'light'] : ['dark']) {
    const c = await ctx(width, { theme });
    const page = await c.newPage();
    const f = {};
    await page.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' }); await settle(page);
    const formTop = async () => { const b = await page.locator('.contact-note').boundingBox(); return b; };
    await page.screenshot({ path: join(OUT, `form-empty-${width}-${theme}.png`) });
    // empty submit
    await page.click('#contact-form button[type=submit]');
    await page.waitForTimeout(150);
    f.empty = await page.evaluate(() => ({ active: document.activeElement.name, invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => `${e.name}→${e.getAttribute('aria-describedby')}:${document.getElementById(e.getAttribute('aria-describedby'))?.textContent}`), focusOutline: getComputedStyle(document.activeElement).outlineColor }));
    await page.screenshot({ path: join(OUT, `form-invalid-empty-${width}-${theme}.png`) });
    // bad email
    await page.fill('input[name=name]', 'Ada'); await page.fill('input[name=email]', 'ada@'); await page.fill('textarea[name=message]', 'Hello');
    await page.click('#contact-form button[type=submit]'); await page.waitForTimeout(150);
    f.badEmail = await page.evaluate(() => ({ active: document.activeElement.name, note: document.getElementById('email-note')?.textContent }));
    await page.screenshot({ path: join(OUT, `form-invalid-email-${width}-${theme}.png`) });
    // typing clears the note
    await page.type('input[name=email]', 'x'); await page.waitForTimeout(50);
    f.cleared = await page.evaluate(() => !document.getElementById('email-note'));
    // sending → sent, with a slow mocked relay
    await page.route('**/api/contact', async (route) => { await new Promise((r) => setTimeout(r, 1500)); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }); });
    await page.fill('input[name=email]', 'ada@example.com');
    await page.focus('#contact-form button[type=submit]');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    f.sending = await page.evaluate(() => { const b = document.querySelector('#contact-form button[type=submit]'); return { label: b.textContent.trim(), disabled: b.disabled, active: document.activeElement === document.body ? 'body' : document.activeElement.tagName + ' ' + (document.activeElement.textContent || '').trim(), opacity: getComputedStyle(b).opacity }; });
    await page.screenshot({ path: join(OUT, `form-sending-${width}-${theme}.png`) });
    await page.waitForTimeout(1600);
    f.sent = await page.evaluate(() => ({ status: document.getElementById('contact-status').textContent.trim(), active: document.activeElement === document.body ? 'body' : document.activeElement.tagName, name: document.querySelector('input[name=name]').value, label: document.querySelector('#contact-form button[type=submit]').textContent.trim() }));
    await page.screenshot({ path: join(OUT, `form-sent-${width}-${theme}.png`) });
    // failed
    await page.unroute('**/api/contact');
    await page.route('**/api/contact', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'send-failed' }) }));
    await page.fill('input[name=name]', 'Ada'); await page.fill('input[name=email]', 'ada@example.com'); await page.fill('textarea[name=message]', 'Hello again');
    await page.focus('#contact-form button[type=submit]'); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
    f.failed = await page.evaluate(() => ({ status: document.getElementById('contact-status').textContent.trim(), active: document.activeElement === document.body ? 'body' : document.activeElement.tagName, kept: document.querySelector('textarea[name=message]').value, disabled: document.querySelector('#contact-form button[type=submit]').disabled }));
    await page.screenshot({ path: join(OUT, `form-failed-${width}-${theme}.png`) });
    // the query-string states the no-JavaScript post comes back to
    await page.goto(BASE + '/contact/?error=rate-limited', { waitUntil: 'domcontentloaded' }); await settle(page);
    f.rateLimited = await page.evaluate(() => document.getElementById('contact-status').textContent.trim());
    // caret: focus the name field and look
    await page.goto(BASE + '/contact/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await page.focus('input[name=name]'); await page.type('input[name=name]', 'Ada Lovelace'); await page.waitForTimeout(200);
    const box = await page.locator('.contact-form').boundingBox();
    await page.screenshot({ path: join(OUT, `form-caret-${width}-${theme}.png`), clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(box.width + 16, width), height: Math.min(box.height + 16, 600) } });
    f.inputFont = await page.evaluate(() => { const i = document.querySelector('input[name=name]'); const cs = getComputedStyle(i); return { fs: cs.fontSize, caret: cs.caretColor, h: i.offsetHeight }; });
    out.form[`${width}-${theme}`] = f;
    await c.close();
  }
}

// ---- video controls on PARC and Androids, desktop, motion on and off ----
for (const motion of ['on', 'off']) {
  const c = await ctx(1440, { motion });
  const page = await c.newPage();
  for (const p of ['/work/parc/', '/work/do-androids-dream/']) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' }); await settle(page);
    await page.locator('video').first().scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
    out.video[`${p}@${motion}`] = await page.evaluate(() => [...document.querySelectorAll('.clip')].map((f) => { const v = f.querySelector('video'); const b = f.querySelector('button'); const cs = getComputedStyle(b); return { label: v.getAttribute('aria-label')?.slice(0, 40), paused: v.paused, controls: v.controls, button: b.getAttribute('aria-label')?.slice(0, 30), opacity: cs.opacity, w: b.offsetWidth, h: b.offsetHeight }; }));
    const clip = page.locator('.clip').first();
    await clip.screenshot({ path: join(OUT, `video-${slug(p)}-${motion}.png`) });
  }
  await c.close();
}

// ---- the study's sticky point text and the tool picker ----
{
  const c = await ctx(1440);
  const page = await c.newPage();
  await page.goto(BASE + '/work/parc/', { waitUntil: 'domcontentloaded' }); await settle(page);
  const pt = page.locator('.point-text').first();
  await pt.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, 600)); await page.waitForTimeout(300);
  out.study = await page.evaluate(() => [...document.querySelectorAll('.point-text')].slice(0, 4).map((el) => ({ hold: el.classList.contains('hold'), pos: getComputedStyle(el).position, top: Math.round(el.getBoundingClientRect().top), h: el.offsetHeight })));
  await page.screenshot({ path: join(OUT, 'study-sticky-1440.png') });
  await page.goto(BASE + '/toolbox/', { waitUntil: 'domcontentloaded' }); await settle(page);
  await page.locator('.tool-picker').scrollIntoViewIfNeeded();
  await page.focus('.tool-picker button:nth-child(2)'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  out.picker = await page.evaluate(() => ({ pressed: [...document.querySelectorAll('.tool-picker button')].map((b) => b.getAttribute('aria-pressed')), story: document.querySelector('.tool-story h3').textContent, active: document.activeElement.textContent.trim().slice(0, 20) }));
  await page.screenshot({ path: join(OUT, 'toolbox-picker-palette-1440.png') });
  // the Lockup demo's controls by keyboard: tab through the rail and note the stops
  await page.goto(BASE + '/toolbox/', { waitUntil: 'domcontentloaded' }); await settle(page);
  await page.locator('.demo').scrollIntoViewIfNeeded();
  await page.focus('.demo button, .demo input');
  const demoStops = [];
  for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); const s = await page.evaluate(() => { const el = document.activeElement; if (!el.closest('.demo')) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { el: el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.'), name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), outline: cs.outlineStyle + ' ' + cs.outlineColor, bg: cs.backgroundColor }; }); if (!s) break; demoStops.push(s); }
  out.demo = demoStops;
  await page.screenshot({ path: join(OUT, 'toolbox-demo-focus-1440.png') });
  await c.close();
}

await browser.close();
writeFileSync(join(HERE, 'checks.json'), JSON.stringify(out, null, 1));
console.log('done');
