import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const bad = new Map();
page.on('response', (r) => { if (r.status() >= 400) bad.set(r.url() + ' ' + r.status() + ' ' + r.request().method(), 1); });
for (const p of ['/', '/work/', '/work/parc/', '/contact/', '/toolbox/']) { await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500); }
console.log([...bad.keys()].join('\n'));
await browser.close();
