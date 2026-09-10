// Share images and icons. The twelve 1200×630 PNGs are screenshots of the dev-only
// /og/<id> route, so they are drawn by the site's own components: the real header and
// status strip, the canvas ASCII field with its knockout, the cell-sized type, the
// shipped fonts. Motion is off (one static seeded frame, no blink, no Decode), the
// clock is frozen, and the coordinates are shed on study images the way the strip
// sheds them below 1100px, so a long slug never clips. Deterministic and local.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { studies } from '../../src/lib/work.ts';
import { INK, YELLOW } from '../../src/lib/tokens.ts';

const PORT = 4174, ORIGIN = `http://127.0.0.1:${PORT}`;
const FROZEN = new Date('2026-09-10T12:00:00-06:00'); // MT 12:00:00 in the strip
const cached = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : existsSync(cached) ? { executablePath: cached } : {};

// --- a dev server for the /og/ route (it is not in the build) ---------------------
const dev = spawn('pnpm', ['exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1', '--logLevel', 'error'], { stdio: ['ignore', 'inherit', 'inherit'] });
const stop = () => { if (!dev.killed) dev.kill(); };
process.on('exit', stop); process.on('SIGINT', () => { stop(); process.exit(130); });
for (let i = 0; ; i++) {
  try { if ((await fetch(`${ORIGIN}/og/home`)).ok) break; } catch {}
  if (i > 200) { stop(); throw new Error('dev server did not start'); }
  await new Promise((r) => setTimeout(r, 100));
}

const b = await chromium.launch(launch);
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { localStorage.setItem('tim-motion', 'off'); localStorage.setItem('tim-theme', 'dark'); localStorage.setItem('tim-grid', 'off'); } catch {} });
const page = await ctx.newPage();
await page.clock.setFixedTime(FROZEN);
const errors = []; page.on('pageerror', (e) => errors.push(String(e)));

mkdirSync('static/og', { recursive: true });
const ids = ['home', 'work', 'contact', ...studies.map((p) => p.slug)];
const report = [];
for (const id of ids) {
  await page.goto(`${ORIGIN}/og/${id}`, { waitUntil: 'networkidle' });
  if (!['home', 'work', 'contact'].includes(id)) await page.addStyleTag({ content: '.st-coords{display:none}' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.waitForSelector('.ascii.drawn');
  await page.screenshot({ path: `static/og/${id}.png`, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  report.push({ image: id, width: 1200, height: 630, bytes: readFileSync(`static/og/${id}.png`).length });
}
// --- the Instagram story: 1080×1920, chrome hidden, into docs/social ------------------
await page.setViewportSize({ width: 1080, height: 1920 });
await page.goto(`${ORIGIN}/og/story`, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '.nav-chrome{display:none}' });
await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); });
await page.waitForSelector('.ascii.drawn');
mkdirSync('docs/social', { recursive: true });
await page.screenshot({ path: 'docs/social/story-launch.png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });
report.push({ image: 'story-launch', width: 1080, height: 1920, bytes: readFileSync('docs/social/story-launch.png').length });
if (errors.length) { stop(); throw new Error('page errors: ' + errors.join('\n')); }

// --- favicon: the actual Jacquard uppercase T as one-pixel cells, ink on yellow -----
const data = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`;
await page.setContent(`<style>@font-face{font-family:Jacquard;src:url('${data('node_modules/@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2', 'font/woff2')}')}</style>`);
const glyph = await page.evaluate(async () => { await document.fonts.load('43px Jacquard'); const c = document.createElement('canvas'); c.width = 64; c.height = 64; const ctx = c.getContext('2d'); ctx.font = '43px Jacquard'; ctx.fillStyle = '#fff'; ctx.fillText('T', 0, 48); const d = ctx.getImageData(0, 0, 64, 64).data; const points = []; for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (d[(y * 64 + x) * 4 + 3] > 127) points.push([x, y]); return points; });
const minX = Math.min(...glyph.map((p) => p[0])), minY = Math.min(...glyph.map((p) => p[1]));
const gw = Math.max(...glyph.map((p) => p[0])) - minX + 1, gh = Math.max(...glyph.map((p) => p[1])) - minY + 1;
const gx = Math.floor((32 - gw) / 2), gy = Math.floor((32 - gh) / 2);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="${YELLOW}"/><g fill="${INK}">${glyph.map(([x, y]) => `<rect x="${x - minX + gx}" y="${y - minY + gy}" width="1" height="1"/>`).join('')}</g></svg>`;
writeFileSync('static/favicon.svg', svg);
const pngs = [];
for (const size of [16, 32, 48, 180]) { await page.setViewportSize({ width: size, height: size }); await page.setContent(`<style>body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`); const png = await page.screenshot(); writeFileSync(size === 180 ? 'static/apple-touch-icon.png' : `static/favicon-${size}.png`, png); if (size !== 180) pngs.push({ size, png }); }
const head = Buffer.alloc(6 + 16 * pngs.length); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4); let offset = head.length;
pngs.forEach(({ size, png }, i) => { const p = 6 + i * 16; head[p] = size; head[p + 1] = size; head.writeUInt16LE(1, p + 4); head.writeUInt16LE(32, p + 6); head.writeUInt32LE(png.length, p + 8); head.writeUInt32LE(offset, p + 12); offset += png.length; }); writeFileSync('static/favicon.ico', Buffer.concat([head, ...pngs.map((x) => x.png)]));

mkdirSync('docs/iterations/pixel-v2/25-social-site', { recursive: true }); writeFileSync('docs/iterations/pixel-v2/25-social-site/assets.json', JSON.stringify(report, null, 2));
await b.close(); stop(); console.table(report);
