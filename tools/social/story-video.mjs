// The story as video: the same /og/story composition with motion on — the field drifting,
// the words decoding — captured frame by frame under Playwright's fake clock (so every
// frame is the same on every run) and encoded to H.264 MP4 for Instagram.
import { chromium } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import ffmpeg from 'ffmpeg-static';
const PORT = 4176, ORIGIN = `http://127.0.0.1:${PORT}`;
const FPS = 30, SECONDS = Number(process.argv[2] ?? 8), FRAMES = FPS * SECONDS;
const cached = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const dev = spawn('pnpm', ['exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1', '--logLevel', 'error'], { stdio: ['ignore', 'inherit', 'inherit'] });
const stop = () => { if (!dev.killed) dev.kill(); }; process.on('exit', stop);
for (let i = 0; ; i++) { try { if ((await fetch(`${ORIGIN}/og/story`)).ok) break; } catch {} if (i > 200) { stop(); throw new Error('dev server did not start'); } await new Promise((r) => setTimeout(r, 100)); }
const b = await chromium.launch(existsSync(cached) ? { executablePath: cached } : {});
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 } });
await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'on'); localStorage.setItem('tim-theme', 'dark'); localStorage.setItem('tim-grid', 'off'); } catch {} });
const page = await ctx.newPage();
const T0 = new Date('2026-09-10T12:00:00-06:00');
await page.clock.install({ time: T0 });
await page.clock.pauseAt(T0); // nothing advances until runFor: the decode starts on frame 0
await page.goto(`${ORIGIN}/og/story`, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '.nav-chrome{display:none}' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.waitForSelector('.ascii.drawn');
const dir = 'docs/social/story-frames'; rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
for (let i = 0; i < FRAMES; i++) {
  await page.clock.runFor(Math.round(1000 / FPS));
  await page.screenshot({ path: `${dir}/${String(i).padStart(4, '0')}.png`, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
}
await b.close(); stop();
execFileSync(ffmpeg, ['-y', '-framerate', String(FPS), '-i', `${dir}/%04d.png`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'docs/social/story-launch.mp4'], { stdio: 'inherit' });
rmSync(dir, { recursive: true, force: true });
console.log(`docs/social/story-launch.mp4: ${SECONDS}s at ${FPS}fps, ${FRAMES} frames`);
