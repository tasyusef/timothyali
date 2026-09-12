// Toolbox landing: block tops on the 8px unit and text boxes on whole pixels, per tool state and width (0094). Static server on 4173.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
for(const width of [1440,1100,900,700,390,320]){ for(const tool of ['Lockup','Palette','Specimen','Convert']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}); const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4173/toolbox/',{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
  await p.locator('.tool-picker button').filter({hasText:tool}).click(); await p.waitForTimeout(300);
  const r=await p.evaluate(()=>{ const sy=window.scrollY; const out=[];
    const els=[...document.querySelectorAll('main *')].filter(e=>{const cs=getComputedStyle(e); return ['block','flex','grid'].includes(cs.display)&&cs.position!=='absolute'&&e.getBoundingClientRect().height>0&&!e.closest('button, .cta, .cta-row, .cta-quiet, .cta-hint, .site-header nav a, .quiet-link.pad, .status, .chip, .btn, .switch, .steps')}); // in-button text is 1px down on purpose (0097)
    for(const e of els){const r=e.getBoundingClientRect(); const top=r.top+sy; if(Math.abs(top/8-Math.round(top/8))>1e-6) out.push({tag:e.tagName,cls:e.className.toString().slice(0,40),top,left:r.left,h:r.height});}
    const t=[...document.querySelectorAll('.demo *')].filter(e=>e.children.length===0&&e.textContent.trim()&&!e.closest('button, .cta, .cta-row, .cta-quiet, .cta-hint, .site-header nav a, .quiet-link.pad, .status, .chip, .btn, .switch, .steps')).map(e=>{const r=e.getBoundingClientRect();return {cls:e.className.toString().slice(0,30),l:r.left,t:r.top+sy}}).filter(o=>o.l%1||o.t%1);
    return {blocks:out,frac:t}; });
  console.log(`== ${width} ${tool}: ${r.blocks.length} block tops off unit ${JSON.stringify(r.blocks.slice(0,6))} | ${r.frac.length} text boxes on fractional px ${JSON.stringify(r.frac.slice(0,4))}`);
  await ctx.close(); }}
await b.close();
