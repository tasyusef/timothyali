import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [320, 340, 352, 375, 390, 420, 500, 700, 1100]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' })).newPage();
  await page.goto('http://127.0.0.1:4173/contact/', { waitUntil: 'networkidle' });
  console.log(w, JSON.stringify(await page.evaluate(() => {
    const panel = document.querySelector('.contact-note').getBoundingClientRect();
    return [...document.querySelectorAll('.contact-links a')].map((a) => { const r = a.getBoundingClientRect(); const arrow = a.querySelector('[aria-hidden]')?.getBoundingClientRect(); return `${a.textContent.trim().slice(0, 12)} a.right=${Math.round(r.right)} arrow.right=${Math.round(arrow?.right)} panel.right=${Math.round(panel.right)}`; });
  })));
}
await browser.close();
