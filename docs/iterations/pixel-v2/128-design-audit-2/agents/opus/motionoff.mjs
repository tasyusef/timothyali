// opus reviewer, PX-128: Motion off in the cog (OS allows motion): the field holds still under a drag; the hero does not type.
import { chromium } from '@playwright/test';
import crypto from 'node:crypto';
const h = (b) => crypto.createHash('md5').update(b).digest('hex').slice(0, 8);
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
await ctx.addInitScript(() => localStorage.setItem('tim-motion', 'off'));
const page = await ctx.newPage();
for (const p of ['/contact/', '/toolbox/', '/']) {
  await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
  const clip = { x: 0, y: 120, width: 700, height: 500 };
  const a = h(await page.screenshot({ clip }));
  await page.mouse.move(30, 140); await page.mouse.down();
  for (let i = 0; i < 15; i++) await page.mouse.move(30 + i * 30, 140 + i * 15);
  const b = h(await page.screenshot({ clip }));
  await page.waitForTimeout(1500); await page.mouse.up(); await page.waitForTimeout(600);
  const c = h(await page.screenshot({ clip }));
  console.log(p, 'motion class=', await page.evaluate(() => document.querySelector('.site').classList.contains('motion')), a, b, c, 'selection=', JSON.stringify(await page.evaluate(() => getSelection().toString().slice(0, 30))));
}
await browser.close();
