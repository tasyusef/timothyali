// Renders the story with several field settings into one sheet for review.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
const PORT = 4175, ORIGIN = `http://127.0.0.1:${PORT}`;
const cached = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const dev = spawn('pnpm', ['exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1', '--logLevel', 'error'], { stdio: ['ignore', 'inherit', 'inherit'] });
const stop = () => { if (!dev.killed) dev.kill(); }; process.on('exit', stop);
for (let i = 0; ; i++) { try { if ((await fetch(`${ORIGIN}/og/story`)).ok) break; } catch {} if (i > 200) { stop(); throw new Error('dev server did not start'); } await new Promise((r) => setTimeout(r, 100)); }
const variants = [
  ['sky s3 d.9 (current)', 'mode=sky&seed=3&density=.9'],
  ['sky s3 d.6', 'mode=sky&seed=3&density=.6'],
  ['sky s7 d.9', 'mode=sky&seed=7&density=.9'],
  ['noise s7 d.8', 'mode=noise&seed=7&density=.8'],
  ['noise s7 d.5', 'mode=noise&seed=7&density=.5'],
  ['fall s5 d.7', 'mode=fall&seed=5&density=.7'],
  ['fall s3 d.55', 'mode=fall&seed=3&density=.55'],
  ['scan s7 d.9', 'mode=scan&seed=7&density=.9'],
  ['bands s7 d.9', 'mode=bands&seed=7&density=.9'],
  ['sparse s4 d1', 'mode=sparse&seed=4&density=1']
];
const b = await chromium.launch(existsSync(cached) ? { executablePath: cached } : {});
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); } catch {} });
const page = await ctx.newPage();
mkdirSync('docs/social/story-variants', { recursive: true });
const shots = [];
for (const [label, qs] of variants) {
  await page.goto(`${ORIGIN}/og/story?${qs}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.nav-chrome{display:none}' });
  await page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); });
  await page.waitForSelector('.ascii.drawn');
  const file = `docs/social/story-variants/${qs.replace(/[=&]/g, '-').replace(/\./g, '')}.png`;
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  shots.push([label, file]);
}
await page.setViewportSize({ width: 1700, height: 1240 });
await page.setContent(`<style>body{margin:0;padding:16px;background:#252522;display:grid;grid-template-columns:repeat(5,320px);gap:16px;color:#fff;font:14px monospace}img{display:block;width:320px;height:569px}p{margin:8px 0}</style>${shots.map(([l, f]) => `<div><img src="data:image/png;base64,${readFileSync(f).toString('base64')}"><p>${l}</p></div>`).join('')}`);
await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
await page.screenshot({ path: 'docs/social/story-variants/sheet.png', fullPage: true });
await b.close(); stop(); console.log(shots.map((s) => s[0]).join('\n'));
