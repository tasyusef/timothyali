// The contact form with /api/contact intercepted: nothing reaches the relay.
import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, theme] of [[1440, 'dark'], [390, 'light']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 700 ? 900 : 800 }, hasTouch: w < 700 });
  await ctx.addInitScript((t) => localStorage.setItem('tim-theme', t), theme);
  const page = await ctx.newPage();
  let answer = { body: { ok: true }, delay: 1200, abort: false }; const posted = [];
  await page.route('**/api/contact**', async (route) => { posted.push(route.request().postData()?.slice(0, 120)); await new Promise((r) => setTimeout(r, answer.delay)); if (answer.abort) return route.abort(); await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(answer.body) }); });
  await page.goto(B + '/contact/', { waitUntil: 'networkidle' });
  const st = () => page.evaluate(() => { const e = document.activeElement; return { focus: e.name || e.tagName + ':' + (e.textContent || '').trim().slice(0, 20), notes: [...document.querySelectorAll('.contact-form .note')].map((n) => n.textContent), invalid: [...document.querySelectorAll('[aria-invalid=true]')].map((i) => i.name + '>' + i.getAttribute('aria-describedby')), status: document.querySelector('#contact-status').textContent.trim(), btn: document.querySelector('.send button').textContent.trim() + (document.querySelector('.send button').disabled ? ' (disabled)' : '') }; });
  const send = page.locator('.send button');
  // Tab order through the form
  await page.locator('input[name=name]').focus(); const order = ['name']; for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => document.activeElement.name || document.activeElement.textContent.trim().slice(0, 22))); }
  console.log(w, theme, 'tab order', order.join(' > '));
  await send.click(); await page.waitForTimeout(150); console.log(w, 'submit empty', JSON.stringify(await st()));
  await page.screenshot({ path: `shots/contact-empty-${w}-${theme}.png`, fullPage: w < 700 });
  await page.locator('input[name=name]').fill('Ada Lovelace'); console.log(w, 'typed name ->', JSON.stringify((await st()).notes));
  await page.locator('input[name=email]').fill('ada@'); await page.keyboard.press('Enter'); await page.waitForTimeout(150); console.log(w, 'Enter in email (invalid)', JSON.stringify(await st()));
  await page.locator('input[name=email]').fill('ada@example.com'); await page.locator('textarea').fill('Hello'); await page.locator('textarea').press('Enter'); console.log(w, 'Enter in textarea value', JSON.stringify(await page.locator('textarea').inputValue()));
  await page.locator('textarea').press('Meta+Enter'); await page.waitForTimeout(100); console.log(w, 'Cmd+Enter in textarea -> posted', posted.length);
  // sending -> sent
  await send.click(); await page.waitForTimeout(300); console.log(w, 'sending', JSON.stringify(await st()));
  await page.waitForTimeout(1300); console.log(w, 'sent', JSON.stringify(await st()), 'fields', await page.locator('input[name=name]').inputValue());
  await page.screenshot({ path: `shots/contact-sent-${w}-${theme}.png`, fullPage: w < 700 });
  // failed
  for (const [label, a] of [['send-failed', { body: { ok: false, error: 'send-failed' }, delay: 200 }], ['rate-limited', { body: { ok: false, error: 'rate-limited' }, delay: 200 }], ['network', { abort: true, delay: 200 }]]) {
    answer = a; await page.locator('input[name=name]').fill('Ada'); await page.locator('input[name=email]').fill('ada@example.com'); await page.locator('textarea').fill('Hi');
    await send.click(); await page.waitForTimeout(600); console.log(w, label, JSON.stringify(await st()), 'fields kept', await page.locator('input[name=name]').inputValue());
  }
  await page.screenshot({ path: `shots/contact-failed-${w}-${theme}.png`, fullPage: w < 700 });
  // iOS zoom risk: input font size
  console.log(w, 'input font-size', await page.$eval('input[name=name]', (i) => getComputedStyle(i).fontSize), 'label hit: click label text focuses?', await (async () => { await page.locator('.field .lbl', { hasText: 'Email' }).click(); return page.evaluate(() => document.activeElement.name); })());
  console.log(w, 'posts intercepted', posted.length);
  await ctx.close();
}
// no JavaScript: the native post redirects to ?sent=1 / ?error=
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
const np = await nojs.newPage();
await np.goto(B + '/contact/?sent=1#contact-sent'); console.log('nojs sent visible', await np.locator('#contact-sent').isVisible(), '| failed visible', await np.locator('#contact-failed').isVisible());
await np.goto(B + '/contact/?error=send-failed#contact-failed'); console.log('nojs failed visible', await np.locator('#contact-failed').isVisible());
await np.goto(B + '/contact/?error=invalid#contact-failed'); console.log('nojs invalid shows', JSON.stringify(await np.locator('#contact-failed').textContent()));
await browser.close();
