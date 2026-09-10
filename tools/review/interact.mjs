import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { PNG } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/pngjs/lib/png.js';
const cp=await import('node:child_process'); const proc=cp.spawn('python3',['-m','http.server','4173','--directory','/Users/twocakes/Desktop/PROJECTS/timothyali2/build']); await new Promise(r=>setTimeout(r,800));
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const light=(png,x0,y0,w,h)=>{let n=0,t=0;for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const i=(y*png.width+x)*4;t++;if(png.data[i]>120)n++}return +(100*n/t).toFixed(1)};
for(const reduced of [false,true]){
  const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:reduced?'reduce':'no-preference'}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  // region in the quiet bottom-left of the hero where the sky field is empty
  const region=[200,560,240,160];
  const before=light(PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:1440,height:900}})),...region);
  for(let i=0;i<=20;i++){await p.mouse.move(200+i*12,640);await p.waitForTimeout(40)} await p.waitForTimeout(250);
  const hover=light(PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:1440,height:900}})),...region);
  await p.screenshot({path:`tools/review/out/interact-hover${reduced?'-reduced':''}.png`,clip:{x:0,y:400,width:900,height:400}});
  await p.mouse.click(320,640); await p.waitForTimeout(reduced?150:600);
  const clicked=light(PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:1440,height:900}})),...region);
  await p.screenshot({path:`tools/review/out/interact-click${reduced?'-reduced':''}.png`,clip:{x:0,y:400,width:900,height:400}});
  await p.mouse.move(1400,20); await p.waitForTimeout(reduced?2500:2500);
  const after=light(PNG.sync.read(await p.screenshot({clip:{x:0,y:0,width:1440,height:900}})),...region);
  console.log(JSON.stringify({reducedMotion:reduced,lit_pct:{before,hover,clicked,after_cooldown:after},errors:errs}));
  await ctx.close();
}
await b.close(); proc.kill();
