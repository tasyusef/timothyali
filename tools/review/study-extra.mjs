import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
{ // light theme
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.addInitScript(()=>localStorage.setItem('tim-theme','light'));
  await p.goto('http://localhost:4173/work/parc/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  await p.screenshot({path:'tools/review/out/crops/light-parc-top.png',clip:{x:0,y:0,width:1440,height:1500}});
  await p.goto('http://localhost:4173/work/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  await p.screenshot({path:'tools/review/out/crops/light-work-top.png',clip:{x:0,y:0,width:1440,height:1400}});await ctx.close();
}
{ // no JavaScript
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,javaScriptEnabled:false});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/work/xrpcafe/',{waitUntil:'load'});await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>({title:document.querySelector('.title')?.textContent?.trim(),imgs:document.images.length,videos:document.querySelectorAll('video').length,ov:document.documentElement.scrollWidth>document.documentElement.clientWidth}));
  console.log('NOJS',JSON.stringify(r));await p.screenshot({path:'tools/review/out/crops/nojs-cafe-top.png',clip:{x:0,y:0,width:1440,height:1600}});await ctx.close();
}
for(const [slug,h] of [['parc',1500],['firstledger',1500],['xrpcafe',2600]]){const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});const p=await ctx.newPage();await p.goto(`http://localhost:4173/work/${slug}/`,{waitUntil:'networkidle'});await p.waitForTimeout(1500);const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let s=0;s<H;s+=600){await p.evaluate(v=>window.scrollTo(0,v),s);await p.waitForTimeout(80)}await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1000);await p.screenshot({path:`tools/review/out/crops/${slug}-top.png`,fullPage:true,clip:{x:0,y:0,width:1440,height:h}});await ctx.close();}
{ const ctx=await b.newContext({viewport:{width:375,height:800},deviceScaleFactor:1});const p=await ctx.newPage();await p.goto('http://localhost:4173/work/pocketwatch/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.screenshot({path:'tools/review/out/crops/375-pw-top.png',clip:{x:0,y:0,width:375,height:900}});await ctx.close();}
await b.close();
