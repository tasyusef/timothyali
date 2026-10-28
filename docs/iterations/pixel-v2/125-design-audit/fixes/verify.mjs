// PX-125: re-checks every audit finding against the preview (pnpm preview --host 127.0.0.1 --port 4173)
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173', OUT = new URL('.', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome' });
const res = {}; const ok = (k, v) => { res[k] = v; console.log(v.pass ? 'PASS' : 'FAIL', k, JSON.stringify(v)); };
const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (x) => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); };
const ratio = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((p, q) => q - p); return +((x + .05) / (y + .05)).toFixed(2); };
async function ctx(opts = {}, theme) { const c = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts }); if (theme) await c.addInitScript((t) => localStorage.setItem('tim-theme', t), theme); return c; }
for (const theme of ['dark', 'light']) {
  // 1. ring on the contact panel and in the settings menu
  const p = await (await ctx({}, theme)).newPage(); await p.goto(B + '/contact/'); await p.waitForTimeout(500);
  await p.locator('input[name=name]').focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
  const f = await p.evaluate(() => { const e = document.activeElement; const panel = e.closest('.panel'); return { outline: getComputedStyle(e).outlineColor, ground: getComputedStyle(panel).backgroundColor }; });
  ok(`ring panel ${theme}`, { ...f, ratio: ratio(f.outline, f.ground), pass: ratio(f.outline, f.ground) >= 3 });
  await p.screenshot({ path: `${OUT}contact-focus-${theme}.png`, clip: { x: 700, y: 100, width: 740, height: 500 } });
  await p.getByRole('button', { name: 'Settings', exact: true }).click(); await p.keyboard.press('Tab');
  const m = await p.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return { label: e.textContent.trim(), outline: s.outlineColor, bg: s.backgroundColor, menu: getComputedStyle(e.parentElement).backgroundColor }; });
  ok(`menu focus ${theme}`, { ...m, ringOnMenu: ratio(m.outline, m.menu), rowOnMenu: ratio(m.bg, m.menu), pass: ratio(m.outline, m.menu) >= 3 && ratio(m.bg, m.menu) >= 3 });
  await p.screenshot({ path: `${OUT}menu-focus-${theme}.png`, clip: { x: 1100, y: 0, width: 340, height: 200 } });
  // dim contrast
  const d = await p.evaluate(() => getComputedStyle(document.querySelector('.field .lbl.dim')).opacity);
  ok(`dim on panel ${theme}`, { opacity: d, pass: +d >= .65 });
}
// 2/3/L: overflow sweep
for (const [path, widths, touch] of [['/toolbox/specimen/', [320], false], ['/toolbox/convert/', [320], false], ['/toolbox/', [320, 390], true], ['/toolbox/', [701, 720, 740, 760, 900], false]]) for (const w of widths) {
  const p = await (await ctx({ viewport: { width: w, height: 900 }, hasTouch: touch, isMobile: touch })).newPage(); await p.goto(B + path); await p.waitForTimeout(700);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  ok(`overflow ${path} ${w}${touch ? ' touch' : ''}`, { scrollWidth: sw, pass: sw <= w });
  if (path === '/toolbox/specimen/' || (touch && w === 390)) { if (touch) await p.locator('.on-phone').scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}${path.replaceAll('/', '_')}${w}.png` }); }
}
// swatch focus, swatch tap targets, step names, Continue/Back focus
{
  const c = await ctx({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const p = await c.newPage(); await p.goto(B + '/toolbox/'); await p.waitForTimeout(700);
  const light = p.getByRole('button', { name: 'Light preview background' }); await light.scrollIntoViewIfNeeded(); const r = await light.boundingBox();
  await p.touchscreen.tap(r.x + r.width - 2, r.y + r.height / 2);
  ok('tap right edge of Light selects Light', { pressed: await light.getAttribute('aria-pressed'), pass: (await light.getAttribute('aria-pressed')) === 'true' });
  const names = await p.locator('.steps button').evaluateAll((els) => els.map((e) => e.innerText + ' | ' + e.textContent.trim()));
  const snap = await p.locator('.steps').ariaSnapshot();
  ok('step names at 390', { snap, pass: /Outputs/.test(snap) && /Review/.test(snap) });
}
{
  const p = await (await ctx({}, 'dark')).newPage(); await p.goto(B + '/toolbox/'); await p.waitForTimeout(700);
  const dark = p.getByRole('button', { name: 'Dark preview background' }); await dark.focus(); await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
  const s = await dark.evaluate((e) => ({ outline: getComputedStyle(e).outlineColor, width: getComputedStyle(e).outlineWidth, focus: e.matches(':focus-visible') }));
  ok('swatch chip ring', { ...s, pass: s.focus && s.width === '2px' && /242, 214, 0/.test(s.outline) });
  await p.getByRole('button', { name: /Continue/ }).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  const a = await p.evaluate(() => document.activeElement.tagName + ' ' + document.activeElement.textContent.trim());
  await p.keyboard.press('Tab'); const nx = await p.evaluate(() => document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim());
  ok('Continue moves focus to review', { active: a, nextTab: nx, pass: a.startsWith('H4') });
  await p.getByRole('button', { name: /Back/ }).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
  const bk = await p.evaluate(() => document.activeElement.textContent.trim());
  ok('Back returns focus to Continue', { active: bk, pass: /Continue/.test(bk) });
}
// clip one button keeps focus
{
  const p = await (await ctx()).newPage(); await p.goto(B + '/work/xrpcafe/'); await p.waitForTimeout(500);
  const btn = p.locator('.clip button').first(); await btn.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500); await btn.focus();
  const before = await btn.getAttribute('aria-label'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const after = await p.evaluate(() => document.activeElement.tagName + ' ' + document.activeElement.getAttribute('aria-label'));
  ok('clip toggle keeps focus', { before, after, pass: after.startsWith('BUTTON') && after.slice(7) !== before });
}
// nav names, theme button, readout hidden, resume label
{
  const p = await (await ctx()).newPage(); await p.goto(B + '/'); await p.waitForTimeout(400);
  const nav = await p.locator('nav[aria-label="Main navigation"]').ariaSnapshot();
  ok('nav names', { nav, pass: !/0\d/.test(nav) });
  const th = await p.locator('#settings-menu button').nth(1).evaluate((e) => ({ pressed: e.getAttribute('aria-pressed'), text: e.textContent.trim() }));
  ok('theme button', { ...th, pass: th.pressed === null });
  const ro = await p.locator('.readout').getAttribute('aria-hidden'); ok('readout hidden', { ro, pass: ro === 'true' });
  const rs = await p.getByRole('link', { name: /Resume/ }).first().textContent(); ok('resume label', { rs: rs.trim(), pass: /PDF/.test(rs) });
  for (const w of [1440, 1100, 900, 700, 420, 390, 320]) { await p.setViewportSize({ width: w, height: 900 }); await p.waitForTimeout(250); const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > w) ok(`home overflow ${w}`, { sw, pass: false }); }
  await p.setViewportSize({ width: 390, height: 844 }); await p.screenshot({ path: `${OUT}home-390.png` });
}
// page-foot hover/press, download press, jump press
{
  const p = await (await ctx()).newPage(); await p.goto(B + '/toolbox/'); await p.waitForTimeout(500);
  const pf = p.locator('.page-foot a'); await pf.scrollIntoViewIfNeeded();
  const rest = await pf.evaluate((e) => getComputedStyle(e).color); await pf.hover(); const hov = await pf.evaluate((e) => getComputedStyle(e).color);
  await p.mouse.down(); const pr = await pf.evaluate((e) => getComputedStyle(e).backgroundColor); await p.mouse.move(1, 1); await p.mouse.up();
  ok('page-foot hover/press', { rest, hov, pr, pass: rest !== hov && /242, 214, 0/.test(pr) });
  await p.route('**/download/**', (r) => r.abort());
  const dl = p.locator('.downloads .files a').first(); await dl.hover(); await p.mouse.down(); const dp = await dl.evaluate((e) => getComputedStyle(e).backgroundColor); await p.mouse.move(1, 1); await p.mouse.up();
  ok('download press', { dp, pass: /242, 214, 0/.test(dp) });
  const note = await p.locator('.downloads .note').first().evaluate((e) => getComputedStyle(e).fontFamily); ok('download note face', { note, pass: /Plex/.test(note) });
  await p.goto(B + '/toolbox/agents/'); const j = p.locator('.jump a').first(); await j.hover(); await p.mouse.down(); const jp = await j.evaluate((e) => getComputedStyle(e).backgroundColor); await p.mouse.move(1, 1); await p.mouse.up();
  ok('jump press', { jp, pass: /242, 214, 0/.test(jp) });
}
// contact: send keeps focus, Cmd+Enter submits
{
  const p = await (await ctx()).newPage(); let posts = 0;
  await p.route('**/api/contact**', async (r) => { posts++; await new Promise((s) => setTimeout(s, 800)); r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: posts > 1 ? false : true, error: 'send-failed' }) }); });
  await p.goto(B + '/contact/'); await p.waitForTimeout(400);
  await p.fill('input[name=name]', 'Test'); await p.fill('input[name=email]', 'test@example.com'); await p.fill('textarea[name=message]', 'Hello');
  await p.locator('textarea[name=message]').focus(); await p.keyboard.press('Meta+Enter'); await p.waitForTimeout(100);
  const mid = await p.evaluate(() => document.activeElement.tagName); await p.waitForTimeout(1000);
  const status = (await p.locator('#contact-status').textContent()).trim();
  ok('cmd+enter sends', { posts, status, pass: posts === 1 && /Sent/.test(status) });
  await p.fill('input[name=name]', 'Test'); await p.fill('input[name=email]', 'test@example.com'); await p.fill('textarea[name=message]', 'Again');
  const send = p.locator('.send button'); await send.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
  const during = await p.evaluate(() => document.activeElement.tagName + ' ' + document.activeElement.getAttribute('aria-disabled')); await p.keyboard.press('Enter'); await p.waitForTimeout(1200);
  const after = await p.evaluate(() => document.activeElement.tagName);
  ok('send keeps focus, no double send', { during, after, posts, pass: during === 'BUTTON true' && after === 'BUTTON' && posts === 2 });
}
// prefers-contrast
{ const p = await (await ctx({ contrast: 'more' })).newPage(); await p.goto(B + '/'); const o = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--dim').trim()); ok('prefers-contrast', { o, pass: o === '1' }); }
// share fallback on touch
{
  const c = await ctx({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); await c.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: B });
  await c.addInitScript(() => { navigator.share = () => Promise.reject(new DOMException('no', 'NotAllowedError')); });
  const p = await c.newPage(); await p.goto(B + '/toolbox/'); await p.waitForTimeout(500); const s = p.locator('.on-phone .send'); await s.scrollIntoViewIfNeeded(); await s.tap(); await p.waitForTimeout(300);
  const st = await p.locator('.on-phone [role=status]').textContent(); ok('share refused falls back to clipboard', { st, pass: st === 'Link copied' });
}
await b.close();
const fails = Object.entries(res).filter(([, v]) => !v.pass).map(([k]) => k);
console.log(fails.length ? `\n${fails.length} FAIL: ${fails.join(', ')}` : '\nall pass');
