// Block tops on the 8px unit: every block/flex/grid element in <main> whose top edge is not a
// multiple of 8 relative to the page, per route and width (decision 0089). Static server on 4173.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const width of [1440,1100,700,390]){ for(const path of ['/','/work/','/contact/','/not-found.html','/work/parc/','/work/xrpcafe/','/work/sonde/']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}); const p=await ctx.newPage();
  await p.goto('http://127.0.0.1:4173'+path,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{ const sy=window.scrollY; const out=[];
    // every block-level element that is a direct child of a section/main/div in the page body, not inside the chrome
    // text inside a button sits 1px down on purpose (0097), so a button's descendants are the button's business
    const els=[...document.querySelectorAll('main *')].filter(e=>{const cs=getComputedStyle(e); return ['block','flex','grid'].includes(cs.display)&&cs.position!=='absolute'&&e.getBoundingClientRect().height>0&&!e.closest('button, .cta, .cta-row, .cta-quiet, .cta-hint, .site-header nav a, .quiet-link.pad, .status, .chip, .btn, .switch, .steps')});
    for(const e of els){const r=e.getBoundingClientRect(); const top=r.top+sy; if(Math.abs(top/8-Math.round(top/8))>1e-6) out.push({tag:e.tagName,cls:e.className.toString().slice(0,50),top,left:r.left,h:r.height});}
    return out; });
  console.log(`== ${width} ${path}: ${r.length} block tops off the 8-grid`, JSON.stringify(r.slice(0,10)));
  await ctx.close(); }}
await b.close();
