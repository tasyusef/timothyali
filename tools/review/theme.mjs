import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const out='tools/review/out/';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
for(const [name,scheme,path] of [['light-home','light','/'],['light-work','light','/work/']]){
  const ctx=await b.newContext({viewport:{width:1440,height:900},colorScheme:scheme}); const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight); for(let y=0;y<h;y+=600){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(80)} await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(1200);
  console.log(name,'theme attr:',await p.evaluate(()=>document.documentElement.dataset.theme),'button:',await p.evaluate(()=>[...document.querySelectorAll('.global-footer button')].map(b=>b.textContent).join(' | ')));
  await p.screenshot({path:out+name+'.png',fullPage:true}); await ctx.close();
}
// toggle persistence
const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.click('button:has-text("Theme")'); await p.waitForTimeout(300);
console.log('after click:',await p.evaluate(()=>document.documentElement.dataset.theme)); await p.reload({waitUntil:'networkidle'}); console.log('after reload:',await p.evaluate(()=>document.documentElement.dataset.theme), 'stored:', await p.evaluate(()=>localStorage.getItem('tim-theme')));
await b.close();
