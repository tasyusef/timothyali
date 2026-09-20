import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const origin = 'http://127.0.0.1:5193';
const out = 'docs/iterations/pixel-v2/41-private-analytics';
const [owner, stranger] = JSON.parse(readFileSync('/tmp/tim-admin-test-cookies.json', 'utf8'));
const browser = await chromium.launch({ channel: 'chrome' }); const results = [];
try {
  const anon = await browser.newContext();
  for (const path of ['/admin/', '/admin/__data.json']) {
    const response = await anon.request.get(origin + path, { maxRedirects: 0 });
    const body = await response.text(); assert.ok(response.status() === 303 || body.includes('"type":"redirect"')); assert.ok(!body.includes('Toolbox downloads')); results.push(`Anonymous ${path} blocked`);
  }
  const other = await browser.newContext(); await other.addCookies([stranger]);
  const denied = await other.request.get(origin + '/admin/', { maxRedirects: 0 }); assert.equal(denied.status(), 303); results.push('Real signed JWT for other email denied');
  const admin = await browser.newContext({ viewport: { width: 1440, height: 1050 } }); await admin.addCookies([owner]); const page = await admin.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(origin + '/admin/'); assert.equal(response.status(), 200); assert.match(response.headers()['cache-control'], /no-store/);
  await page.getByRole('heading', { name: 'Site activity.' }).waitFor(); await page.getByText('Toolbox-1.1.0-arm64.dmg', { exact: true }).waitFor();
  assert.equal(await page.locator('.stats article').first().locator('.display').innerText(), '360');
  await page.screenshot({ path: `${out}/dashboard-desktop-fixture.png`, fullPage: true });
  await page.getByRole('link', { name: '7 days', exact: true }).click(); await page.waitForURL('**/?days=7'); await page.getByText('Page views / 7 days', { exact: true }).waitFor();
  await page.getByRole('combobox').selectOption('v1.0.0'); assert.equal(await page.locator('.build-table tbody tr').count(), 1); results.push('Date range and release filter work');
  await page.getByRole('combobox').selectOption('all');
  for (const width of [390, 320]) { await page.setViewportSize({ width, height: 844 }); await page.screenshot({ path: `${out}/dashboard-${width}-fixture.png`, fullPage: true }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`); }
  results.push('Dashboard fits 1440, 390 and 320px');
  const cookie = (await admin.cookies()).find(cookie => cookie.name === 'tim-analytics-exclude'); assert.equal(cookie?.value, '1');
  await page.getByRole('button', { name: 'Sign out', exact: false }).click(); await page.waitForURL('**/admin/login/'); assert.equal((await admin.request.get(origin + '/admin/', { maxRedirects: 0 })).status(), 303); results.push('Sign out invalidates this session');
  assert.deepEqual(errors, []); results.push('No browser runtime errors');
  // Count requests without writing data: ANALYTICS_DEV is off on this server.
  const visitor = await browser.newContext(); const publicPage = await visitor.newPage(); const events = [];
  publicPage.on('request', req => { if (req.url().includes('/api/analytics/')) events.push(req.postDataJSON()); });
  await publicPage.goto(origin + '/'); await publicPage.waitForTimeout(500); assert.equal(events.filter(event => event.type === 'view').length, 1);
  await publicPage.evaluate(() => { location.hash = '#test'; }); await publicPage.waitForTimeout(100); assert.equal(events.filter(event => event.type === 'view').length, 1);
  await publicPage.goto(origin + '/toolbox/'); await publicPage.waitForTimeout(400);
  await publicPage.route('https://github.com/tasyusef/toolbox/releases/download/**', route => route.abort());
  await publicPage.locator('a[href$="Toolbox-1.1.1-arm64.dmg"]').first().click({ noWaitAfter: true }); await publicPage.waitForTimeout(300);
  assert.ok(events.some(event => event.type === 'download' && event.file === 'Toolbox-1.1.1-arm64.dmg')); results.push('Public views, hash deduplication and build clicks send the right events');
  writeFileSync(`${out}/browser-verification.json`, JSON.stringify({ fixtureData: true, results }, null, 2)); console.log(results.join('\n'));
} finally { await browser.close(); }
