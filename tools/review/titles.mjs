import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
for(const width of [1440,1100,900,390,375,320]){for(const slug of ['parc','xrpcafe','firstledger','do-androids-dream','firststrike','sonde','parc-site','jade-aesthetics','pocketwatch']){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const p=await ctx.newPage();
  await p.goto(`http://localhost:4173/work/${slug}/`,{waitUntil:'networkidle'});await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{const d=document.querySelector('.title .decode');const r=d.getBoundingClientRect();const cw=document.documentElement.clientWidth;const rows=[...document.querySelectorAll('.grow')].map(g=>[...g.children].map(c=>Math.round(c.getBoundingClientRect().height))).filter(h=>h.length>1).map(h=>Math.max(...h)-Math.min(...h));return {w:Math.round(r.width),fs:getComputedStyle(d).fontSize,avail:cw-2*parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gutter')),ov:document.documentElement.scrollWidth>cw,rowHeightSpread:Math.max(0,...rows)}});
  console.log(width,slug,JSON.stringify(r));await ctx.close();
}}
await b.close();
