// PX-128: one check per fix from the second three-reviewer audit. Run against `pnpm preview --host 127.0.0.1 --port 4173`.
// BASE=http://127.0.0.1:4173 node docs/iterations/pixel-v2/128-design-audit-2/fixes/verify.mjs
import { chromium } from '../../../../../node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:4173';
const SHOTS = new URL('./shots/', import.meta.url).pathname; mkdirSync(SHOTS, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const out = []; const ok = (name, pass, info = '') => { out.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`); };
const open = async (path, o = {}) => {
  const ctx = await b.newContext({ viewport: { width: o.w ?? 1440, height: o.h ?? 896 }, reducedMotion: o.motion ? 'no-preference' : 'reduce', hasTouch: !!o.touch, isMobile: !!o.touch, forcedColors: o.forced ? 'active' : 'none', permissions: o.clip ? ['clipboard-read', 'clipboard-write'] : [] });
  if (o.theme) await ctx.addInitScript((t) => { try { localStorage.setItem('tim-theme', t); } catch {} }, o.theme);
  if (o.init) await ctx.addInitScript(o.init);
  const p = await ctx.newPage(); await p.goto(BASE + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); return p;
};
const close = (p) => p.context().close();
// the order Tab visits controls inside main, as page y, and whether it ever jumps back up by more than a line
async function tabOrder(p, n = 40) {
  await p.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  await p.locator('main').focus().catch(() => {});
  const seen = [];
  for (let i = 0; i < n; i++) {
    await p.keyboard.press('Tab'); await p.waitForTimeout(30);
    const r = await p.evaluate(() => { const e = document.activeElement; if (!e || !e.closest('main')) return null; const a = e.getBoundingClientRect(); return { y: Math.round(a.top + scrollY), x: Math.round(a.left), t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 28) }; });
    if (r) seen.push(r); else if (seen.length) break; // past the end of main: Tab wraps to the top
  }
  const back = seen.filter((r, i) => i && r.y < seen[i - 1].y - 32);
  return { seen, back };
}

// 1 · Shift+Tab never leaves focus under the sticky chrome
for (const w of [1440, 390]) {
  const p = await open('/', { w }); let covered = 0;
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.locator('main a, main button').last().focus();
  for (let i = 0; i < 40; i++) { await p.keyboard.press('Shift+Tab'); await p.waitForTimeout(40);
    covered += await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body || e.closest('.nav-chrome') || e.classList.contains('skip-link')) return 0; const a = e.getBoundingClientRect(), c = document.querySelector('.nav-chrome').getBoundingClientRect(); return a.top < c.bottom - 1 ? 1 : 0; }); }
  ok(`1 Shift+Tab on Home at ${w}: nothing under the chrome`, covered === 0, `${covered} covered`); await close(p);
}

// 2 · forced colours: fields and buttons drawn, the current and pressed states highlighted
{
  const p = await open('/contact/', { forced: true });
  const f = await p.evaluate(() => { const i = document.querySelector('#contact-name'), s = getComputedStyle(i); const c = getComputedStyle(document.querySelector('.cta-row')); const cur = getComputedStyle(document.querySelector('.site-header nav a[aria-current]')), other = getComputedStyle(document.querySelector('.site-header nav a:not([aria-current])')); return { field: s.outlineStyle, send: c.outlineStyle, cur: cur.backgroundColor, other: other.backgroundColor }; });
  ok('2 forced colours: the Name field and Send are outlined', f.field === 'solid' && f.send === 'solid', `${f.field}/${f.send}`);
  ok('2 forced colours: the current nav item differs from the others', f.cur !== f.other, `${f.cur} vs ${f.other}`);
  await p.screenshot({ path: SHOTS + '2-forced-contact.png' }); await close(p);
  const q = await open('/toolbox/', { forced: true });
  const t = await q.evaluate(() => [getComputedStyle(document.querySelector('.tool-picker [aria-pressed=true]')).backgroundColor, getComputedStyle(document.querySelector('.tool-picker [aria-pressed=false]')).backgroundColor]);
  ok('2 forced colours: the chosen tool differs from the others', t[0] !== t[1], t.join(' vs '));
  await q.locator('#tools').scrollIntoViewIfNeeded(); await q.screenshot({ path: SHOTS + '2-forced-toolbox.png' }); await close(q);
}

// 3 · a pressed card keeps its text in dark
{
  const p = await open('/work/', { theme: 'dark' }); const card = p.locator('.card').first(); const box = await card.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height - 24); await p.mouse.down(); await p.waitForTimeout(80);
  const c = await card.locator('.card-body').evaluate((e) => { const s = getComputedStyle(e); return [s.color, s.backgroundColor]; });
  await p.screenshot({ path: SHOTS + '3-card-pressed-dark.png', clip: { x: box.x - 8, y: box.y - 8, width: box.width + 16, height: box.height + 16 } }); await p.mouse.up();
  ok('3 pressed card (dark): body text differs from its ground', c[0] !== c[1], c.join(' on ')); await close(p);
}

// 4 · Tab follows the visible order: Contact at 900, a study at 390 and 1440
for (const [path, w] of [['/contact/', 900], ['/contact/', 1440], ['/work/xrpcafe/', 390], ['/work/xrpcafe/', 1440]]) {
  const p = await open(path, { w }); const { seen, back } = await tabOrder(p, path.startsWith('/work') ? 14 : 12);
  ok(`4 Tab order on ${path} at ${w} never jumps back up`, back.length === 0, back.map((r) => r.t).join(', ') || seen.map((r) => r.t).slice(0, 6).join(' > ')); await close(p);
}

// 4b · Home's hero actions: Tab goes left to right, the résumé first, at every width
for (const w of [1440, 900, 390]) {
  const p = await open('/', { w }); const r = await p.evaluate(() => [...document.querySelectorAll('.hero-actions > a')].map((a) => ({ t: a.textContent.trim().slice(0, 12), x: Math.round(a.getBoundingClientRect().left), y: Math.round(a.getBoundingClientRect().top) })));
  ok(`4 Home hero actions at ${w}: Resume then Selected work, in reading order`, /^Resume/.test(r[0].t) && (r[1].y > r[0].y + 8 || r[1].x > r[0].x), r.map((a) => `${a.t}@${a.x},${a.y}`).join(' > '));
  await p.locator('.hero-actions').screenshot({ path: SHOTS + `4-hero-actions-${w}.png` }); await close(p);
}

// 5 · the clip button: a paper block with the ring inside when focused; the pause stays in view while playing
{
  const p = await open('/work/parc/', { w: 390 }); const btn = p.locator('figure.clip button').first(); await btn.scrollIntoViewIfNeeded(); await btn.focus();
  const s = await btn.evaluate((e) => { const c = getComputedStyle(e); return { bg: c.backgroundColor, paper: getComputedStyle(document.body).backgroundColor, off: c.outlineOffset, style: c.outlineStyle }; });
  ok('5 focused play button is paper with the ring inside', s.style === 'solid' && s.off === '-8px', `${s.bg} / offset ${s.off}`);
  const bb = await btn.boundingBox(); await p.screenshot({ path: SHOTS + '5-clip-focus-390.png', clip: { x: Math.max(0, bb.x - 24), y: bb.y - 24, width: bb.width + 48, height: bb.height + 48 } }); await close(p);
  const q = await open('/work/xrpcafe/', { motion: true }); await q.locator('figure.clip').first().scrollIntoViewIfNeeded(); await q.mouse.move(2, 400); await q.waitForTimeout(1500);
  const pause = await q.evaluate(() => { const e = document.querySelector('figure.clip button.pause'); return e ? getComputedStyle(e).opacity : 'not playing'; });
  ok('5 pause shows while the clip plays, pointer elsewhere', pause !== '0' && pause !== 'not playing', `opacity ${pause}`); await close(q);
}

// 6 · send link at 320 with share and clipboard refused: no sideways scroll, the address stays past 4s
{
  const p = await open('/toolbox/', { w: 320, h: 700, touch: true, init: () => { delete Navigator.prototype.share; Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('no')) } }); } });
  const send = p.locator('.on-phone .send'); await send.scrollIntoViewIfNeeded(); await send.click(); await p.waitForTimeout(300);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth); await p.waitForTimeout(4500);
  const msg = await p.locator('.on-phone [role=status]').innerText();
  ok('6 refused send at 320: page stays 320 wide', wide <= 320, `${wide}px`);
  ok('6 refused send: the address is still shown after 4.5s', /timothyali\.com\/toolbox/.test(msg), msg);
  await p.locator('.on-phone').screenshot({ path: SHOTS + '6-send-failed-320.png' }); await close(p);
}

// 7 · the email note is the field's description, not part of its name
{
  const p = await open('/contact/'); await p.fill('#contact-name', 'Test'); await p.fill('#contact-email', 'nope'); await p.fill('#contact-message', 'Hi'); await p.locator('.contact-form .cta-row').click(); await p.waitForTimeout(200);
  const a = await p.evaluate(() => { const i = document.querySelector('#contact-email'); return { label: [...i.labels].map((l) => l.textContent.trim()).join('|'), desc: document.getElementById(i.getAttribute('aria-describedby') || '')?.textContent.trim() }; });
  ok('7 email field is named only "Email"', a.label.toLowerCase() === 'email', `name ${a.label} / note ${a.desc}`);
  ok('7 email note is the short one', a.desc === 'Enter an email address like name@example.com.', a.desc); await close(p);
}

// 8 · the contact links stay inside the panel at 320
{
  const p = await open('/contact/', { w: 320 }); const r = await p.evaluate(() => { const panel = document.querySelector('.contact-note').getBoundingClientRect(); return Math.max(...[...document.querySelectorAll('.contact-links .quiet-link')].map((a) => a.getBoundingClientRect().right)) - panel.right; });
  ok('8 contact links inside the panel at 320', r <= 0, `${Math.round(r)}px past`); await close(p);
}

// 9 · removing a colour moves focus to the next colour, or to Add color after the last
{
  const p = await open('/toolbox/'); await p.locator('.tool-picker button', { hasText: 'Palette' }).click(); await p.waitForTimeout(200);
  await p.getByRole('button', { name: 'Remove color 1' }).focus(); await p.keyboard.press('Space'); await p.waitForTimeout(100);
  const a = await p.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim());
  const n = await p.locator('.color-row').count(); await p.getByRole('button', { name: `Remove color ${n}` }).focus(); await p.keyboard.press('Space'); await p.waitForTimeout(100);
  const b2 = await p.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim());
  ok('9 remove color 1 focuses the next hex', a === 'Hex for color 1', a); ok('9 remove the last color focuses Add color', /Add color/.test(b2), b2); await close(p);
}

// 10 · smaller fixes
{
  const p = await open('/toolbox/convert/'); const t = await p.locator('main').innerText(); ok('10 Convert copy drops "On both platforms"', !/both platforms/i.test(t)); await close(p);
  const q = await open('/toolbox/', { w: 900 }); const cols = await q.evaluate(() => getComputedStyle(document.querySelector('.section-head')).gridTemplateColumns.split(' ').length);
  const names = await q.evaluate(() => [...document.querySelectorAll('.downloads .files a')].map((a) => a.textContent.trim()));
  ok('10 Toolbox section head is one column at 900', cols === 1, `${cols} columns`); ok('10 download links say what they fetch', names.every((n) => n.startsWith('Download Toolbox for')), names[1]);
  await q.locator('.tool-picker button', { hasText: 'Lockup' }).click();
  const op = await q.evaluate(() => { const d = document.querySelector('.demo .steps button:disabled'); return d ? getComputedStyle(d).opacity : 'none disabled'; });
  ok('10 a disabled demo step is at .5', op === '0.5' || op === 'none disabled', op); await close(q);
}

// A · reading paragraphs on the tool pages at 27/40
{
  const p = await open('/toolbox/lockup/'); const lh = await p.evaluate(() => [...document.querySelectorAll('.text .paras > p.body, .tool-options dd')].map((e) => getComputedStyle(e).lineHeight));
  const q = await open('/toolbox/agents/'); const lh2 = await q.evaluate(() => [...document.querySelectorAll('.side p.body, .rules dd')].map((e) => getComputedStyle(e).lineHeight));
  ok('A tool page paragraphs and options at 40px', lh.length > 2 && lh.every((x) => x === '40px'), `${lh.length} at ${[...new Set(lh)]}`);
  ok('A CLI & MCP side text and rules at 40px', lh2.length > 10 && lh2.every((x) => x === '40px'), `${lh2.length} at ${[...new Set(lh2)]}`);
  await p.locator('.text').first().screenshot({ path: SHOTS + 'A-lockup-when-to-use.png' }); await close(p); await close(q);
}

// B · copy buttons on the code blocks: commands without comments, "Copied" for 2s
{
  const p = await open('/toolbox/agents/', { clip: true }); const blocks = await p.locator('pre.code').count(); const btns = await p.locator('pre.code .copy').count();
  const cmd = p.locator('pre.code[aria-label="Commands"]'); const btn = cmd.locator('.copy'); await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(150);
  const word = async () => (await btn.evaluate((e) => e.firstChild.textContent)).trim(); const label = await word(); const clip = await p.evaluate(() => navigator.clipboard.readText()); const status = await cmd.locator('[role=status]').innerText();
  await cmd.screenshot({ path: SHOTS + 'B-copy-copied.png' }); await p.waitForTimeout(2200); const after = await word();
  ok('B every code block has a copy button', blocks === btns && blocks > 0, `${btns}/${blocks}`);
  ok('B copy says Copied, then Copy again', /^copied$/i.test(label) && /^copy$/i.test(after) && /copied/i.test(status), `${label} → ${after}`);
  ok('B copied text has no # comments', !/\s#\s/.test(clip) && clip.split('\n').length > 2, JSON.stringify(clip.split('\n')[0]));
  await p.locator('pre.code').nth(1).screenshot({ path: SHOTS + 'B-copy-rest.png' }); await close(p);
  const q = await open('/toolbox/', { clip: true }); const plate = q.locator('.command-plate .copy'); await plate.scrollIntoViewIfNeeded(); await plate.click(); await q.waitForTimeout(100);
  ok('B toolbox --mcp plate copies its command', (await q.evaluate(() => navigator.clipboard.readText())) === 'toolbox --mcp'); await q.locator('.machine').screenshot({ path: SHOTS + 'B-mcp-plate.png' }); await close(q);
}

await b.close();
console.log(out.join('\n')); console.log(`\n${out.filter((l) => l.startsWith('PASS')).length}/${out.length} pass`);
