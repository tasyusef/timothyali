import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const cp=await import('node:child_process'); const proc=cp.spawn('python3',['-m','http.server','4173','--directory','/Users/twocakes/Desktop/PROJECTS/timothyali2/build']); await new Promise(r=>setTimeout(r,800));
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}); const p=await ctx.newPage();
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
await p.evaluate(()=>{window.__ev=[];const h=document.querySelector('.hero');['pointermove','pointerleave','pointerdown'].forEach(t=>h.addEventListener(t,e=>window.__ev.push(t)))});
for(let i=0;i<=10;i++){await p.mouse.move(200+i*24,640);await p.waitForTimeout(40)}
await p.screenshot({path:'tools/review/out/cool-0.png',clip:{x:300,y:500,width:400,height:300}});
await p.mouse.move(1400,20); await p.waitForTimeout(2500);
await p.screenshot({path:'tools/review/out/cool-1.png',clip:{x:300,y:500,width:400,height:300}});
console.log('events:',JSON.stringify(await p.evaluate(()=>window.__ev.reduce((a,t)=>(a[t]=(a[t]||0)+1,a),{}))));
await b.close(); proc.kill();
