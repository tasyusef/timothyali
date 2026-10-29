// opus reviewer, PX-128: where focus is after a keyboard send, and what a screen reader hears.
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**/api/contact**', async (r) => { await new Promise((s) => setTimeout(s, 800)); r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
await page.goto('http://127.0.0.1:4173/contact/', { waitUntil: 'networkidle' });
await page.fill('input[name=name]', 'Ada'); await page.fill('input[name=email]', 'ada@example.com'); await page.fill('textarea', 'Hi');
await page.locator('form button[type=submit]').focus(); await page.keyboard.press('Enter');
await page.waitForTimeout(150);
console.log('sending focus=', await page.evaluate(() => document.activeElement?.tagName + ' ' + document.activeElement?.innerText));
await page.waitForTimeout(1200);
console.log('sent focus=', await page.evaluate(() => document.activeElement?.tagName + ' ' + document.activeElement?.innerText), 'status=', await page.locator('#contact-status').innerText());
// status stays?
await page.waitForTimeout(5000); console.log('5s later status=', await page.locator('#contact-status').innerText());
await page.fill('input[name=name]', 'B'); console.log('after typing again status=', await page.locator('#contact-status').innerText());
await browser.close();
