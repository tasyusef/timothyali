import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const width of [1100,1000,900]){for(const path of ['/work/do-androids-dream/','/work/firststrike/','/work/jade-aesthetics/','/work/pocketwatch/','/work/parc/','/']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const cw=document.documentElement.clientWidth;const sw=document.documentElement.scrollWidth;const bad=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.right>cw+0.5&&r.width>0)bad.push(e.tagName+'.'+String(e.className).split(' ').slice(0,2).join('.')+' r='+Math.round(r.right))});return {cw,sw,bad:bad.slice(0,8)}});
  console.log(width,path,JSON.stringify(r));await ctx.close();
}}
await b.close();
