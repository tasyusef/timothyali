import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
const jobs=[[1440,'/',0,3600,'home-full'],[1440,'/work/',0,2300,'work-top'],[1440,'/work/do-androids-dream/',0,2400,'dad-top'],[1440,'/work/do-androids-dream/',2400,2400,'dad-mid'],[1440,'/work/parc/',0,2300,'parc-top'],[1440,'/work/parc/',2300,2300,'parc-mid'],[390,'/work/do-androids-dream/',0,2400,'390-dad-top'],[390,'/',0,3000,'390-home'],[1440,'/work/xrpcafe/',0,2300,'cafe-top']];
for(const [width,path,y,h,name] of jobs){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let s=0;s<H;s+=600){await p.evaluate(v=>window.scrollTo(0,v),s);await p.waitForTimeout(100)}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1200);
  await p.screenshot({path:`tools/review/out/crops/${name}.png`,fullPage:true,clip:{x:0,y,width,height:Math.min(h,H-y)}});
  console.log(name,'H',H);await ctx.close();
}
await b.close();
