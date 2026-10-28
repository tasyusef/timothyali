import { chromium } from '@playwright/test';
const B = 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [1440, 390]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: w > 700 ? 900 : 844 }, hasTouch: w < 700 })).newPage();
  for (const p of ['/', '/work/parc/', '/toolbox/']) {
    await page.goto(B + p, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const s = () => page.evaluate(() => { const c = document.querySelector('.nav-chrome'); return `${c.classList.contains('collapsed') ? 'collapsed' : 'shown'}@${Math.round(c.getBoundingClientRect().top)} y=${Math.round(scrollY)}`; });
    await page.mouse.move(w / 2, 400);
    for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(250); }
    const down = await s(); await page.mouse.wheel(0, -120); await page.waitForTimeout(600); const up = await s();
    await page.mouse.wheel(0, -120); await page.waitForTimeout(600); const up2 = await s();
    console.log(w, p, 'down', down, '| up 120', up, '| up 240', up2);
  }
  if (w === 1440) {
    await page.goto(B + '/work/parc/', { waitUntil: 'networkidle' });
    const top = await page.evaluate(() => document.querySelectorAll('.point')[1].getBoundingClientRect().top + scrollY);
    for (const dy of [0, 400, 900]) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top + dy); await page.waitForTimeout(300); console.log('PARC point 2 +' + dy, await page.evaluate(() => { const t = document.querySelectorAll('.point')[1].querySelector('.point-text'); const r = t.getBoundingClientRect(); const c = document.querySelector('.nav-chrome').getBoundingClientRect(); return `hold=${t.classList.contains('hold')} text top ${Math.round(r.top)} chrome bottom ${Math.round(c.bottom)}`; })); }
    await page.screenshot({ path: 'shots/parc-held-point-1440.jpg', type: 'jpeg', quality: 70 });
  }
}
await browser.close();
