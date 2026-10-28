import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const OUT = path.dirname(new URL(import.meta.url).pathname);
const routes = ['/', '/work/', ...['parc','xrpcafe','firstledger','do-androids-dream','jade-aesthetics','firststrike','toolbox'].map(s=>`/work/${s}/`), '/toolbox/', ...['lockup','palette','specimen','convert','agents'].map(s=>`/toolbox/${s}/`), '/contact/', '/nope/'];
const widths = [320,1440,1100,900,700,420,390];
const browser = await chromium.launch({ channel: 'chrome' });
const rows=process.env.METADATA_ONLY ? await fs.readFile(path.join(OUT,'scan.json'),'utf8').then(JSON.parse).catch(()=>[]) : [];
for (const theme of ['dark','light']) {
 const context = await browser.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce', colorScheme:theme });
 await context.addInitScript(t=>{localStorage.setItem('tim-theme',t);localStorage.removeItem('tim-motion');},theme);
 await context.route('**/api/contact', r=>r.abort());
 const page = await context.newPage(); let errs=[];
 page.on('pageerror',e=>errs.push(e.message));
 for(const route of routes) {
  const slug=route==='/'?'home':route.slice(1,-1).replaceAll('/','-');
  for(const width of widths) {
   if(process.env.METADATA_ONLY&&rows.some(r=>r.route===route&&r.width===width&&r.theme===theme))continue;
   errs=[]; await page.setViewportSize({width,height:900});
   const res=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(140);
   // Read every lazy-loaded figure before taking full-page evidence.
   await page.evaluate(async()=>{for(const im of document.images){im.loading='eager';} await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
   const info=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
    const visible=e=>{const s=getComputedStyle(e);return !!e.getClientRects().length&&s.visibility!=='hidden'&&s.display!=='none';};
    const elements=[...document.querySelectorAll('main *')].filter(visible);
    return {title:document.title,theme:document.documentElement.dataset.theme,motion:document.querySelector('.site')?.dataset.motion,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.currentSrc),overflow:elements.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&!e.closest('.sr-only,.trap');}).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.trim().slice(0,100),...rect(e)})).slice(0,35),controls:[...document.querySelectorAll('main button,main input,main textarea,main select')].filter(visible).map(e=>({tag:e.tagName,text:(e.getAttribute('aria-label')||e.textContent||e.name||'').trim().slice(0,100),...rect(e)})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,paused:v.paused,time:v.currentTime})),text:document.querySelector('main')?.innerText};
   });
   const base=`${slug}-${width}-${theme}`;
   if(!process.env.METADATA_ONLY) {
    await page.screenshot({path:path.join(OUT,base+'-top.png')});
    if([320,390,1440].includes(width))await page.screenshot({path:path.join(OUT,base+'-full.png'),fullPage:true});
   }
   rows.push({route,width,theme,status:res.status(),errors:errs,...info});
  }
  console.log(theme,route,'complete');
  await fs.writeFile(path.join(OUT,'scan.pending.json'),JSON.stringify(rows,null,2));
  await fs.rename(path.join(OUT,'scan.pending.json'),path.join(OUT,'scan.json'));
 }
 await context.close();
}
await browser.close();
console.log(JSON.stringify({pages:rows.length,overflow:rows.filter(r=>r.scrollWidth>r.width).map(r=>({route:r.route,width:r.width,theme:r.theme,scrollWidth:r.scrollWidth,overflow:r.overflow})),errors:rows.filter(r=>r.errors.length||r.broken.length)},null,2));
