// Shared bits for the fable audit scripts (PX-128). Read-only against http://127.0.0.1:4173.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASE = process.env.BASE ?? 'http://127.0.0.1:4173';
export const HERE = dirname(fileURLToPath(import.meta.url));
export const SHOTS = join(HERE, 'shots');
export const DATA = join(HERE, 'data');
mkdirSync(SHOTS, { recursive: true });
mkdirSync(DATA, { recursive: true });

export const PAGES = [
  ['home', '/'], ['work', '/work/'],
  ['parc', '/work/parc/'], ['xrpcafe', '/work/xrpcafe/'], ['firstledger', '/work/firstledger/'],
  ['androids', '/work/do-androids-dream/'], ['jade', '/work/jade-aesthetics/'], ['firststrike', '/work/firststrike/'], ['toolbox-study', '/work/toolbox/'],
  ['toolbox', '/toolbox/'], ['lockup', '/toolbox/lockup/'], ['palette', '/toolbox/palette/'], ['specimen', '/toolbox/specimen/'], ['convert', '/toolbox/convert/'], ['agents', '/toolbox/agents/'],
  ['contact', '/contact/'], ['404', '/nope/']
];
export const WIDTHS = [1440, 1100, 900, 700, 420, 390, 320];

export async function launch(opts = {}) {
  return chromium.launch({ channel: 'chrome', headless: true, ...opts });
}

/** a context with the theme and motion choices pre-set in localStorage, so the first paint has them */
export async function context(browser, { width = 1440, height = 900, theme = 'dark', motion = 'on', reducedMotion = 'no-preference', touch = false, ua } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion, hasTouch: touch, isMobile: touch, userAgent: ua });
  await ctx.addInitScript(([t, m]) => { try { localStorage.setItem('tim-theme', t); if (m) localStorage.setItem('tim-motion', m); else localStorage.removeItem('tim-motion'); } catch {} }, [theme, motion]);
  return ctx;
}

export function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  return errors;
}

export async function goto(page, path, { wait = 400 } = {}) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
