import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import readline from 'node:readline';
const out = new URL('.', import.meta.url).pathname;
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
const log = [];
page.on('pageerror', e => log.push({ error: e.message, url: page.url() }));
Object.assign(globalThis, { browser, ctx, page, fs, out, log });
await page.goto('http://127.0.0.1:4173/');
console.log('READY', await page.title());
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
for await (const code of readline.createInterface({ input: process.stdin })) {
  if (!code.trim()) continue;
  if (code === 'CLOSE') { await browser.close(); break; }
  await fs.appendFile(out + 'commands.jsonl', JSON.stringify({time:new Date().toISOString(), code}) + '\n');
  try { console.log(JSON.stringify(await new AsyncFunction(code)())); }
  catch (e) { console.log('ERROR', e.stack); }
}
