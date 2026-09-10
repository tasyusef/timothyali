import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
const jobs=[[1440,'/work/',0,2300,'work-top'],[1440,0,2300,'pw-top'],[1440,'/work/parc/',0,1500,'parc-top'],[1440,'/work/xrpcafe/',0,1600,'cafe-top'],[1440,'/work/firstledger/',0,1500,'fl-top'],[1440,2300,2300,'pw-mid'],[1440,5600,1600,'pw-end'],[390,'/work/',0,2600,'390-work'],[390,0,2400,'390-pw-top'],[1280,'/work/',0,1400,'1280-work'],[1100,'/work/',0,1400,'1100-work']];
for(const [width,path,y,h,name] of jobs){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let s=0;s<H;s+=600){await p.evaluate(v=>window.scrollTo(0,v),s);await p.waitForTimeout(100)}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1200);
  await p.screenshot({path:`tools/review/out/crops/${name}.png`,fullPage:true,clip:{x:0,y,width,height:h}});
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);console.log(name,'overflow',ov);await ctx.close();
}
await b.close();
