// opus reviewer, PX-128: touch target sizes at 320 and 390 with a coarse pointer (hit area by elementFromPoint, so ::after counts).
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
for (const w of [320, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of ['/', '/contact/', '/work/parc/', '/toolbox/', '/toolbox/agents/']) {
    await page.goto('http://127.0.0.1:4173' + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const out = [];
      const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), textarea, summary')].filter((e) => !e.closest('.sr-only,[hidden],.trap') && e.getBoundingClientRect().width > 2);
      for (const e of els) {
        e.scrollIntoView({ block: 'center' });
        const b = e.getBoundingClientRect();
        // probe the hit area: walk out from the centre until the hit leaves the element
        const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
        const hits = (x, y) => { const h = document.elementFromPoint(x, y); return h && (h === e || e.contains(h)); };
        let up = 0, dn = 0, lf = 0, rt = 0;
        while (up < 40 && hits(cx, cy - up - 1)) up++;
        while (dn < 40 && hits(cx, cy + dn + 1)) dn++;
        while (lf < 200 && hits(cx - lf - 1, cy)) lf++;
        while (rt < 200 && hits(cx + rt + 1, cy)) rt++;
        const H = up + dn + 1, W = lf + rt + 1;
        if (H < 24 || W < 24) out.push(`${e.tagName.toLowerCase()} "${(e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 24)}" hit ${W}x${H} (box ${Math.round(b.width)}x${Math.round(b.height)})`);
      }
      return out;
    });
    if (r.length) console.log(`${w} ${p}:\n   ${r.join('\n   ')}`);
  }
  await ctx.close();
}
await browser.close();
