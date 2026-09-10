import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const out='tools/review/out/';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
for(const [name,path,w] of [['light-home','/',1440],['light-work','/work/',1440],['light-390-home','/',390]]){
  const ctx=await b.newContext({viewport:{width:w,height:900}}); await ctx.addInitScript(()=>{try{localStorage.setItem('tim-theme','light')}catch{}}); const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight); for(let y=0;y<h;y+=600){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(80)} await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(1200);
  console.log(name, await p.evaluate(()=>document.documentElement.dataset.theme)); await p.screenshot({path:out+name+'.png',fullPage:true}); await ctx.close();
}
await b.close();
