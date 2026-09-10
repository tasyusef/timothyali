// PX-13 review-fix captures: the .who discipline plates in both themes, the Work header on phones,
// a tall Work row at 1440, and the measured contrast of the note labels against their plate.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const out='docs/iterations/pixel-v2/13-review-fixes/';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
const lum=c=>{const [r,g,bl]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*r+0.7152*g+0.0722*bl};
const ratio=(a,c)=>{const l1=lum(a),l2=lum(c);return +(((Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)).toFixed(2))};
const rgb=s=>s.match(/\d+/g).slice(0,3).map(Number);

for(const theme of ['dark','light']){
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/',{waitUntil:'networkidle'});
  await p.evaluate(t=>{document.documentElement.dataset.theme=t},theme);
  await p.waitForTimeout(1200);
  const who=await p.$('.who'); await who.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await who.screenshot({path:`${out}who-1440-${theme}.png`});
  const m=await p.evaluate(()=>[...document.querySelectorAll('.para .note')].map(n=>{const cs=getComputedStyle(n);const r=n.getBoundingClientRect();const panel=getComputedStyle(document.querySelector('.who'));
    return {text:n.textContent,color:cs.color,plate:cs.backgroundColor,panel:panel.backgroundColor,pad:cs.padding,
      box:{top:r.top+window.scrollY,left:r.left+window.scrollX,w:r.width,h:r.height},lineH:getComputedStyle(document.querySelector('.words')).lineHeight}}));
  for(const n of m)console.log('NOTE',theme,JSON.stringify(n),'contrast text/plate',ratio(rgb(n.color),rgb(n.plate)),'plate/panel',ratio(rgb(n.plate),rgb(n.panel)),'text/panel(old)',ratio(rgb(n.color),rgb(n.panel)));
  console.log('WHO height',theme,await p.evaluate(()=>document.querySelector('.who').getBoundingClientRect().height));
  await ctx.close();
}
for(const width of [390,360]){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/work/',{waitUntil:'networkidle'});await p.waitForTimeout(1200);
  const h=await p.$('.work-header'); await h.screenshot({path:`${out}work-header-${width}.png`});
  const info=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return {top:r.top+scrollY,left:r.left+scrollX,w:r.width,h:r.height,lines:e.getClientRects().length}};
    return {header:g('.work-header'),title:g('.page-head'),index:g('.header-index'),label:g('.header-index span'),range:g('.header-index .range'),overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth}});
  console.log('WORKHEADER',width,JSON.stringify(info));
  await ctx.close();
}
{
  const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});const p=await ctx.newPage();
  await p.goto('http://localhost:4173/work/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
  const rows=await p.$$('.row');
  for(const i of [2,3]){await rows[i].scrollIntoViewIfNeeded();await p.waitForTimeout(400);await rows[i].screenshot({path:`${out}work-row-${i+1}-1440.png`})}
  const geom=await p.evaluate(()=>[...document.querySelectorAll('.row')].map(r=>{const rb=r.querySelector('.row-body').getBoundingClientRect();const body=r.querySelector('.body').getBoundingClientRect();const more=r.querySelector('.more').getBoundingClientRect();
    return {row:Math.round(r.getBoundingClientRect().height),bodyBottom:Math.round(body.bottom-rb.top),moreTop:Math.round(more.top-rb.top),gap:Math.round(more.top-body.bottom),trailing:Math.round(rb.bottom-more.bottom)}}));
  console.log('ROWS',JSON.stringify(geom));
  await p.screenshot({path:`${out}work-1440.png`,fullPage:true});
  await ctx.close();
}
await b.close();
