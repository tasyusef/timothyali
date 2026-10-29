// The contact form (empty, invalid, fixed, sending, sent, failed, network, rate-limited; the relay
// intercepted), the Toolbox download links (intercepted), the phone send-link, the CLI & MCP code blocks.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, context, goto, BASE, SHOTS, DATA, sleep } from './lib.mjs';

const log = []; const say = (s) => { log.push(s); console.log(s); };
const browser = await launch();

for (const width of [1440, 390]) {
  for (const theme of width === 1440 ? ['dark', 'light'] : ['dark']) {
    const ctx = await context(browser, { width, height: width < 700 ? 844 : 900, theme }); const page = await ctx.newPage();
    const posts = [];
    await page.route('**/api/contact**', async (route) => { posts.push(route.request().postData()?.slice(0, 200)); await sleep(700); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }); });
    await goto(page, '/contact/');
    const form = page.locator('#contact-form');
    const snap = async (label) => { const b = await page.locator('.contact-note').boundingBox(); await page.screenshot({ path: join(SHOTS, `contact-${label}-${width}-${theme}.png`), clip: { x: Math.max(0, b.x - 8), y: Math.max(0, b.y - 8), width: Math.min(width, b.width + 16), height: Math.min((width < 700 ? 844 : 900) - Math.max(0, b.y - 8), b.height + 16) } }); };
    // labels and names via the accessibility tree
    const names = await page.evaluate(() => [...document.querySelectorAll('#contact-form input:not([tabindex="-1"]), #contact-form textarea')].map((el) => ({ n: el.name, label: el.closest('label')?.querySelector('.lbl')?.textContent.trim(), type: el.type, ac: el.autocomplete, req: el.required, fontSize: getComputedStyle(el).fontSize })));
    say(`[${width}/${theme}] fields: ${JSON.stringify(names)}`);
    // Tab through the form
    await page.locator('input[name=name]').focus(); const seq = []; for (let i = 0; i < 6; i++) { seq.push(await page.evaluate(() => document.activeElement.name || document.activeElement.textContent.trim().slice(0, 20))); await page.keyboard.press('Tab'); } say(`[${width}/${theme}] tab order from Name: ${seq.join(' > ')}`);
    // the block caret
    await page.locator('input[name=name]').click(); await page.keyboard.type('Ti'); await sleep(200);
    const caret = await page.evaluate(() => { const c = document.querySelector('input[name=name] ~ .caret'); const cs = getComputedStyle(c); return { display: cs.display, left: c.style.left, top: c.style.top, h: c.style.height, anim: cs.animationName, bg: cs.backgroundColor }; });
    say(`[${width}/${theme}] block caret after typing "Ti": ${JSON.stringify(caret)}; native caret-color=${await page.evaluate(() => getComputedStyle(document.querySelector('input[name=name]')).caretColor)}`);
    await page.locator('input[name=name]').fill('');
    // submit empty
    await page.locator('.contact-note .cta-row').click(); await sleep(200);
    const empty = await page.evaluate(() => ({ active: document.activeElement.name, invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.name), notes: [...document.querySelectorAll('.note')].map((n) => n.id + ': ' + n.textContent.trim()), describedby: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.getAttribute('aria-describedby') + '=' + !!document.getElementById(e.getAttribute('aria-describedby'))), status: document.getElementById('contact-status').textContent.trim() }));
    say(`[${width}/${theme}] submit empty: focus=${empty.active} invalid=${empty.invalid} notes=${JSON.stringify(empty.notes)} describedby=${empty.describedby} posts=${posts.length}`);
    await snap('empty');
    // the note colours
    say(`[${width}/${theme}] note chip colours: ${JSON.stringify(await page.evaluate(() => { const n = document.querySelector('.note'); const cs = getComputedStyle(n); return { bg: cs.backgroundColor, color: cs.color, size: cs.fontSize }; }))}`);
    // invalid email
    await page.locator('input[name=name]').fill('Audit Bot'); await page.locator('input[name=email]').fill('not-an-email'); await page.locator('textarea[name=message]').fill('Hello from the audit.');
    await page.locator('.contact-note .cta-row').click(); await sleep(200);
    const invalid = await page.evaluate(() => ({ active: document.activeElement.name, invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((e) => e.name), notes: [...document.querySelectorAll('.note')].map((n) => n.textContent.trim()) }));
    say(`[${width}/${theme}] submit invalid email: focus=${invalid.active} invalid=${invalid.invalid} notes=${JSON.stringify(invalid.notes)} posts=${posts.length}`);
    await snap('invalid');
    // typing clears the note
    await page.locator('input[name=email]').type('x'); await sleep(100); say(`[${width}/${theme}] after typing in email: notes=${await page.locator('.note').count()} aria-invalid=${await page.locator('input[name=email]').getAttribute('aria-invalid')}`);
    // fix and send: ok
    await page.locator('input[name=email]').fill('audit@example.com');
    await page.locator('.contact-note .cta-row').click(); await sleep(150);
    const sending = await page.evaluate(() => { const b = document.querySelector('.contact-note .cta-row'); const cs = getComputedStyle(b); return { label: b.textContent.trim(), ariaDisabled: b.getAttribute('aria-disabled'), disabled: b.disabled, opacity: cs.opacity, pointer: cs.pointerEvents, focused: document.activeElement === b }; });
    say(`[${width}/${theme}] sending: ${JSON.stringify(sending)}`);
    await snap('sending');
    await sleep(900);
    const sent = await page.evaluate(() => { const s = document.getElementById('contact-status'); return { status: s.textContent.trim(), live: s.getAttribute('aria-live'), on: s.classList.contains('on'), label: document.querySelector('.contact-note .cta-row').textContent.trim(), values: [...document.querySelectorAll('#contact-form input:not([tabindex="-1"]),#contact-form textarea')].map((e) => e.value), focused: document.activeElement.tagName + '.' + document.activeElement.className }; });
    say(`[${width}/${theme}] sent: ${JSON.stringify(sent)} posts=${posts.length} body=${JSON.stringify(posts[0])}`);
    await snap('sent');
    // failed
    await page.unroute('**/api/contact**'); await page.route('**/api/contact**', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'send-failed' }) }));
    await page.locator('input[name=name]').fill('Audit Bot'); await page.locator('input[name=email]').fill('audit@example.com'); await page.locator('textarea[name=message]').fill('Second try.');
    await page.locator('.contact-note .cta-row').click(); await sleep(400);
    say(`[${width}/${theme}] failed: status="${await page.locator('#contact-status').textContent()}" values kept=${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#contact-form input:not([tabindex="-1"]),#contact-form textarea')].map((e) => e.value.length)))} send label="${await page.locator('.contact-note .cta-row').textContent()}"`);
    await snap('failed');
    // rate limited and network
    await page.unroute('**/api/contact**'); await page.route('**/api/contact**', (route) => route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'rate-limited' }) }));
    await page.locator('.contact-note .cta-row').click(); await sleep(300); say(`[${width}/${theme}] rate-limited: "${(await page.locator('#contact-status').textContent()).trim()}"`);
    await page.unroute('**/api/contact**'); await page.route('**/api/contact**', (route) => route.abort('failed'));
    await page.locator('.contact-note .cta-row').click(); await sleep(300); say(`[${width}/${theme}] network: "${(await page.locator('#contact-status').textContent()).trim()}"`);
    await page.unroute('**/api/contact**'); await page.route('**/api/contact**', (route) => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'unconfigured' }) }));
    await page.locator('.contact-note .cta-row').click(); await sleep(300); say(`[${width}/${theme}] unconfigured: "${(await page.locator('#contact-status').textContent()).trim()}"`);
    // Cmd+Enter in the message
    await page.unroute('**/api/contact**'); const n0 = posts.length; await page.route('**/api/contact**', (route) => { posts.push('x'); route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await page.locator('textarea[name=message]').fill('Third'); await page.locator('textarea[name=message]').focus(); await page.keyboard.press('Meta+Enter'); await sleep(300); say(`[${width}/${theme}] Cmd+Enter in message: posted=${posts.length > n0}`);
    // status chip and note contrast
    say(`[${width}/${theme}] status chip: ${JSON.stringify(await page.evaluate(() => { const s = document.getElementById('contact-status'); const cs = getComputedStyle(s); return { bg: cs.backgroundColor, color: cs.color, size: cs.fontSize, lh: cs.lineHeight, width: Math.round(s.getBoundingClientRect().width) }; }))}`);
    await snap('end');
    // one screen on desktop?
    if (width === 1440) say(`[${width}/${theme}] page height ${await page.evaluate(() => document.documentElement.scrollHeight)} vs viewport 900`);
    await ctx.close();
  }
}

// Toolbox downloads: intercept, never download
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  const hits = []; await page.route('**/download/**', (route) => { hits.push(route.request().url().replace(BASE, '')); route.fulfill({ status: 204 }); });
  await goto(page, '/toolbox/');
  const links = await page.locator('.downloads .files a').evaluateAll((as) => as.map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href'), download: a.hasAttribute('download'), h: Math.round(a.getBoundingClientRect().height) })));
  say(`downloads: ${links.length} links ${JSON.stringify(links)}`);
  for (let i = 0; i < links.length; i++) { await page.locator('.downloads .files a').nth(i).click(); await sleep(150); }
  say(`download clicks hit the route: ${hits.length}/${links.length} ${JSON.stringify(hits.slice(0, 3))}`);
  say(`download rows: ${JSON.stringify(await page.locator('.downloads li').evaluateAll((lis) => lis.map((l) => l.textContent.trim().replace(/\s+/g, ' ').slice(0, 120))))}`);
  say(`on-phone panel visible at 1440 mouse: ${await page.locator('.on-phone').isVisible()}`);
  await ctx.close();
}
// the phone send-link at 390 touch
{
  const ctx = await context(browser, { width: 390, height: 844, touch: true }); const page = await ctx.newPage();
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await goto(page, '/toolbox/');
  const panel = page.locator('.on-phone'); await panel.scrollIntoViewIfNeeded(); await sleep(200);
  say(`on-phone panel at 390 touch: visible=${await panel.isVisible()} share=${await page.evaluate(() => typeof navigator.share)} text="${(await panel.locator('.body').textContent()).trim()}"`);
  const btn = panel.locator('.send'); const bb = await btn.boundingBox(); say(`send button: "${(await btn.textContent()).trim()}" box=${JSON.stringify(bb && { w: Math.round(bb.width), h: Math.round(bb.height), right: Math.round(bb.x + bb.width) })}`);
  await page.screenshot({ path: join(SHOTS, 'toolbox-onphone-390.png') });
  await btn.tap(); await sleep(300);
  say(`after tap: label="${(await btn.textContent()).trim()}" status="${await page.locator('.on-phone [role=status]').textContent()}" clipboard="${await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e.message))}"`);
  await page.screenshot({ path: join(SHOTS, 'toolbox-onphone-390-copied.png') });
  await sleep(4200); say(`after 4s: label="${(await btn.textContent()).trim()}"`);
  // download links at 390 touch: tap targets
  say(`download links at 390 touch: ${JSON.stringify(await page.locator('.downloads .files a').evaluateAll((as) => as.map((a) => ({ t: a.textContent.trim(), h: Math.round(a.getBoundingClientRect().height) }))))}`);
  // the demo's export note
  say(`export note at touch: visible=${await page.locator('.export-note').isVisible()} "${(await page.locator('.export-note').textContent()).trim()}"`);
  await ctx.close();
}
// CLI & MCP page: code blocks, selection, copy controls
{
  const ctx = await context(browser, { width: 1440 }); const page = await ctx.newPage();
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await goto(page, '/toolbox/agents/');
  const blocks = await page.locator('pre.code').evaluateAll((ps) => ps.map((p) => ({ label: p.getAttribute('aria-label'), role: p.getAttribute('role'), lines: p.querySelectorAll('.ln').length, userSelect: getComputedStyle(p).userSelect, buttons: p.parentElement.querySelectorAll('button').length })));
  say(`agents code blocks: ${blocks.length} ${JSON.stringify(blocks)}`);
  say(`copy buttons on the page: ${await page.locator('button').evaluateAll((bs) => bs.map((b) => b.textContent.trim() || b.getAttribute('aria-label')).filter((t) => /copy/i.test(t)).length)}; all buttons: ${JSON.stringify(await page.locator('main button').evaluateAll((bs) => bs.map((b) => b.textContent.trim() || b.getAttribute('aria-label'))))}`);
  // select a block with a triple click and copy: line breaks kept?
  const pre = page.locator('pre.code').nth(1); await pre.scrollIntoViewIfNeeded();
  const copied = await pre.evaluate((p) => { const r = document.createRange(); r.selectNodeContents(p); getSelection().removeAllRanges(); getSelection().addRange(r); return getSelection().toString(); });
  say(`selecting the Commands block gives ${copied.split('\n').length} lines; first="${copied.split('\n')[0].slice(0, 60)}"`);
  // Playwright: copy via keyboard
  await page.keyboard.press('Meta+C'); await sleep(100); const clip = await page.evaluate(() => navigator.clipboard.readText().catch((e) => 'ERR ' + e.message)); say(`clipboard after Cmd+C: ${clip.split('\n').length} lines; "${clip.split('\n')[0].slice(0, 60)}"`);
  // the example command on a tool page and its `.w` nowrap behaviour at 390
  await ctx.close();
  const c2 = await context(browser, { width: 390, height: 844 }); const p2 = await c2.newPage(); await goto(p2, '/toolbox/agents/');
  say(`agents at 390: overflow=${await p2.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)} code block widths ok=${await p2.locator('pre.code').evaluateAll((ps) => ps.every((p) => p.scrollWidth <= p.clientWidth + 1))}; jump nav: ${JSON.stringify(await p2.locator('.jump a').evaluateAll((as) => as.map((a) => ({ t: a.textContent.trim(), h: Math.round(a.getBoundingClientRect().height) }))))}`);
  const b = await p2.locator('#run pre.code').first().boundingBox(); await p2.evaluate((y) => scrollTo(0, y - 120), b.y); await sleep(200); await p2.screenshot({ path: join(SHOTS, 'agents-run-390.png') });
  await c2.close();
}
await browser.close();
writeFileSync(join(DATA, 'forms.log'), log.join('\n'));
