// opus reviewer, PX-128: the contact form. Empty, invalid, fix, sending, sent, failed (api intercepted, nothing sent).
import { chromium } from '@playwright/test';
const OUT = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
const ax = async (page, sel) => {
  const cdp = await page.context().newCDPSession(page);
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: (await cdp.send('DOM.getDocument')).root.nodeId, selector: sel });
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
  const n = nodes[0]; return { role: n.role?.value, name: n.name?.value, desc: n.description?.value, invalid: n.properties?.find((p) => p.name === 'invalid')?.value?.value };
};
for (const [w, theme] of [[1440, 'dark'], [390, 'light']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript((t) => localStorage.setItem('tim-theme', t), theme);
  const page = await ctx.newPage();
  let mode = 'ok', calls = 0;
  await page.route('**/api/contact**', async (r) => { calls++; await new Promise((s) => setTimeout(s, 1200)); r.fulfill({ status: mode === 'ok' ? 200 : 502, contentType: 'application/json', body: JSON.stringify(mode === 'ok' ? { ok: true } : { ok: false, error: mode }) }); });
  await page.goto('http://127.0.0.1:4173/contact/', { waitUntil: 'networkidle' });
  console.log(`--- ${w} ${theme}`);
  console.log('name field', JSON.stringify(await ax(page, 'input[name=name]')));
  const send = page.locator('form button[type=submit]');
  await send.click(); await page.waitForTimeout(200);
  console.log('empty submit: focus=', await page.evaluate(() => document.activeElement?.name), 'notes=', JSON.stringify(await page.locator('.note').allTextContents()), 'calls=', calls);
  console.log('  name ax', JSON.stringify(await ax(page, 'input[name=name]')));
  await page.screenshot({ path: `${OUT}shots/contact-empty-${w}-${theme}.png`, fullPage: w === 390 });
  await page.keyboard.type('Ada');
  console.log('  after typing name, notes=', JSON.stringify(await page.locator('.note').allTextContents()));
  await page.keyboard.press('Tab'); await page.keyboard.type('ada@nowhere');
  await page.keyboard.press('Tab'); await page.keyboard.type('Hello there');
  await send.click(); await page.waitForTimeout(200);
  console.log('invalid email: focus=', await page.evaluate(() => document.activeElement?.name), 'notes=', JSON.stringify(await page.locator('.note').allTextContents()), 'calls=', calls);
  console.log('  email ax', JSON.stringify(await ax(page, 'input[name=email]')));
  await page.screenshot({ path: `${OUT}shots/contact-invalid-${w}-${theme}.png`, fullPage: w === 390 });
  await page.keyboard.type('.com');
  // send with Cmd+Enter from message
  await page.locator('textarea').focus(); await page.keyboard.press('Meta+Enter'); await page.waitForTimeout(300);
  console.log('sending: label=', (await send.innerText()).replace(/\s+/g, ' '), 'aria-disabled=', await send.getAttribute('aria-disabled'), 'focus=', await page.evaluate(() => document.activeElement?.tagName), 'calls=', calls);
  await page.screenshot({ path: `${OUT}shots/contact-sending-${w}-${theme}.png`, fullPage: w === 390 });
  await send.click({ force: true }); await page.waitForTimeout(100); console.log('  second press while sending, calls=', calls);
  await page.waitForTimeout(1500);
  console.log('sent: status=', (await page.locator('#contact-status').innerText()).trim(), 'fields=', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#contact-form input:not([name=hp_check]),#contact-form textarea')].map((e) => e.value))), 'focus=', await page.evaluate(() => document.activeElement?.tagName + ' ' + document.activeElement?.textContent?.trim()));
  await page.screenshot({ path: `${OUT}shots/contact-sent-${w}-${theme}.png`, fullPage: w === 390 });
  for (const m of ['send-failed', 'rate-limited']) {
    mode = m;
    await page.fill('input[name=name]', 'Ada'); await page.fill('input[name=email]', 'ada@example.com'); await page.fill('textarea', 'Hi');
    await send.click(); await page.waitForTimeout(1700);
    console.log(`${m}: status="${(await page.locator('#contact-status').innerText()).trim()}" fields kept=`, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('#contact-form input:not([name=hp_check]),#contact-form textarea')].map((e) => e.value))));
  }
  await page.screenshot({ path: `${OUT}shots/contact-failed-${w}-${theme}.png`, fullPage: w === 390 });
  // network failure
  await page.unroute('**/api/contact**'); await page.route('**/api/contact**', (r) => r.abort());
  await send.click(); await page.waitForTimeout(500);
  console.log(`network: status="${(await page.locator('#contact-status').innerText()).trim()}"`);
  await ctx.close();
}
await browser.close();
