import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const width of [1280,1100]){for(const path of ['/','/work/','/contact/','/work/parc/']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const cw=document.documentElement.clientWidth;const sw=document.documentElement.scrollWidth;const wide=[];document.querySelectorAll('body *').forEach(e=>{if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX==='visible'&&e.clientWidth>0)wide.push(e.tagName+'.'+String(e.className).split(' ').slice(0,2).join('.')+' sw='+e.scrollWidth+' cw='+e.clientWidth)});return {cw,sw,wide:wide.slice(0,8)}});
  console.log(width,path,JSON.stringify(r));await ctx.close();
}}
await b.close();
