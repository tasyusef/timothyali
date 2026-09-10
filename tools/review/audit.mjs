import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { PNG } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/pngjs/lib/png.js';
const out='tools/review/out/';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
// 1. crispness: fraction of pixels that are neither paper nor ink
const near=(a,b)=>Math.abs(a[0]-b[0])<12&&Math.abs(a[1]-b[1])<12&&Math.abs(a[2]-b[2])<12;
const Y=[242,214,0],K=[17,17,14];
{
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
  const sels={wordmark:'.wordmark',nav:'.site-header nav',readout_mono:'.readout',display:'.who h2',body:'.who .body',cta:'.who .cta',hero_name:'.hero-name',card_title:'.card h3'};
  const rep={};
  for(const [k,sel] of Object.entries(sels)){
    const el=await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const buf=await el.screenshot(); const png=PNG.sync.read(buf); let mid=0,tot=0;
    for(let i=0;i<png.data.length;i+=4){const px=[png.data[i],png.data[i+1],png.data[i+2]];tot++;if(!near(px,Y)&&!near(px,K))mid++;}
    rep[k]={w:png.width,h:png.height,intermediate_pct:+(100*mid/tot).toFixed(2)};
  }
  console.log('CRISPNESS',JSON.stringify(rep));
  // grid overlay on for a shot
  await p.evaluate(()=>window.scrollTo(0,0)); await p.click('button:has-text("Grid")'); await p.waitForTimeout(300);
  await p.screenshot({path:out+'1440-home-grid.png',clip:{x:0,y:0,width:1440,height:900}});
  await ctx.close();
}
// 2. reduced motion
{
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  const m=await p.evaluate(()=>({motion:document.querySelector('.site')?.dataset.motion,heroText:document.querySelector('.hero-name [aria-hidden]')?.textContent,btn:document.querySelector('.global-footer button')?.textContent}));
  console.log('REDUCED',JSON.stringify(m));
  await p.screenshot({path:out+'1440-home-reduced.png',fullPage:true});
  await ctx.close();
}
// 3. no JavaScript
{
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,javaScriptEnabled:false});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/',{waitUntil:'load'});await p.waitForTimeout(1200);
  const t=await p.evaluate(()=>({hero:document.querySelector('.hero-name')?.textContent?.trim(),invested:document.querySelector('#how-title')?.textContent?.replace(/\s+/g,' ').trim(),canvases:document.querySelectorAll('canvas').length}));
  console.log('NOJS',JSON.stringify(t));
  await p.screenshot({path:out+'1440-home-nojs.png',fullPage:true});
  await ctx.close();
}
// 4. refreshed full captures after fixes
for(const width of [1440,390]){for(const path of ['/','/work/','/contact/']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(2500);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<h;y+=600){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(100)}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1500);
  const name=(path==='/'?'home':path.replaceAll('/',''));await p.screenshot({path:`${out}${width}-${name}.png`,fullPage:true});
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
  console.log('CAPTURE',width,path,'overflow',ov,'errors',errors.length);await ctx.close();
}}
await b.close();
