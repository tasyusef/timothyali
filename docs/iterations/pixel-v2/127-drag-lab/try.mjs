// PX-127: drags each mode across Home's hero on the dev server and screenshots it mid-drag and after.
import { chromium } from '@playwright/test';
const B = process.env.BASE ?? 'http://localhost:5174', OUT = new URL('.', import.meta.url).pathname;
const b = await chromium.launch({ channel: 'chrome' });
for (const theme of ['dark', 'light']) for (const mode of ['wake', 'bow', 'draw', 'sling', 'pan']) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript(([m, t]) => { localStorage.setItem('tim-drag-lab', m); localStorage.setItem('tim-theme', t); localStorage.setItem('tim-motion', 'on'); }, [mode, theme]);
  const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(B + '/'); await p.waitForTimeout(2500);
  const lab = await p.evaluate(() => document.querySelector('.drag-lab [aria-pressed=true]')?.textContent);
  await p.mouse.move(1000, 250); await p.mouse.down();
  if (mode === 'sling') await p.waitForTimeout(1300);
  for (let i = 0; i <= 20; i++) { await p.mouse.move(1000 - i * 25, 250 + Math.sin(i / 3) * 80); await p.waitForTimeout(16); }
  await p.waitForTimeout(80); await p.screenshot({ path: `${OUT}${mode}-${theme}-during.png`, clip: { x: 400, y: 96, width: 900, height: 400 } });
  await p.mouse.up(); await p.waitForTimeout(mode === 'sling' ? 450 : 300);
  await p.screenshot({ path: `${OUT}${mode}-${theme}-after.png`, clip: { x: 400, y: 96, width: 900, height: 400 } });
  const sel = await p.evaluate(() => getSelection()?.toString());
  console.log(theme, mode, 'lab:', lab, 'selection:', JSON.stringify(sel), errs.length ? 'ERRORS ' + errs.join(' | ') : 'no errors');
  await c.close();
}
await b.close();
