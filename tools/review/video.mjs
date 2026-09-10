// Do the PixVideo canvases step while visible with motion on, and hold still with motion off?
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const reduced of ['no-preference','reduce']){
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:reduced});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/work/xrpcafe/',{waitUntil:'networkidle'});await p.waitForTimeout(1000);
  await p.evaluate(()=>document.querySelector('figure.clip').scrollIntoView({block:'center'}));await p.waitForTimeout(2500);
  const a=await p.evaluate(()=>{const v=document.querySelector('figure.clip video');return {sum:v.currentTime,paused:v.paused,ready:v.readyState,motion:document.querySelector('.site').dataset.motion}});
  await p.waitForTimeout(1500);
  const b2=await p.evaluate(()=>document.querySelector('figure.clip video').currentTime);
  console.log('VIDEO',reduced,JSON.stringify(a),'frame changed:',a.sum!==b2);await ctx.close();
}
await b.close();
