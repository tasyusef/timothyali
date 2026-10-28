import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const out=path.dirname(new URL(import.meta.url).pathname),base='http://127.0.0.1:4173';
const routes=['/','/work/',...['parc','xrpcafe','firstledger','do-androids-dream','jade-aesthetics','firststrike','toolbox'].map(s=>`/work/${s}/`),'/toolbox/',...['lockup','palette','specimen','convert','agents'].map(s=>`/toolbox/${s}/`),'/contact/','/nope/'];
const browser=await chromium.launch({channel:'chrome'}),result={motion:[],keyboard:[],nojs:[],swatches:[],videos:[],contrast:[]};
// Inspect the animated counterpart of every saved static viewport/theme capture.
const jobs=['dark','light'].flatMap(theme=>routes.flatMap(route=>[1440,1100,900,700,420,390,320].map(width=>({theme,route,width}))));
await Promise.all([0,1,2].map(async worker=>{
 const c=await browser.newContext({reducedMotion:'no-preference'});await c.addInitScript(()=>localStorage.removeItem('tim-motion'));await c.route('**/api/contact',r=>r.abort());const p=await c.newPage();
 for(let i=worker;i<jobs.length;i+=3){const j=jobs[i];await p.setViewportSize({width:j.width,height:900});await p.addInitScript(t=>localStorage.setItem('tim-theme',t),j.theme);await p.goto(base+j.route,{waitUntil:'load'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);result.motion.push({...j,...await p.evaluate(()=>({motion:document.querySelector('.site')?.dataset.motion,scrollWidth:document.documentElement.scrollWidth}))});}
 await c.close();
}));
console.log('Motion matrix complete',result.motion.length);
for(const width of [1440,390]){
 const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await c.addInitScript(()=>localStorage.setItem('tim-theme','dark'));const p=await c.newPage();
 for(const route of routes){await p.goto(base+route);await p.evaluate(()=>document.fonts.ready);const count=await p.locator('a[href],button,input,textarea,select,summary').count();const states=[];
  for(let i=0;i<count+2;i++){await p.keyboard.press('Tab');await p.waitForTimeout(15);const f=await p.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,name:e.getAttribute('aria-label')||e.getAttribute('name')||e.textContent?.trim().slice(0,65),x:r.x,y:r.y,w:r.width,h:r.height,outline:s.outline,hidden:e.closest('[aria-hidden=true]')!==null,offscreen:r.width>1&&(r.right<0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight)};});states.push(f);if(i>0&&f.name==='Skip to content')break;}
  result.keyboard.push({route,width,states});
 }
 await c.close();
}
console.log('Keyboard routes complete');
for(const motion of ['reduce','no-preference']){
 const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:motion});await c.addInitScript(()=>{localStorage.setItem('tim-theme','dark');localStorage.removeItem('tim-motion');});const p=await c.newPage();await p.goto(base+'/');await p.waitForTimeout(1500);
 const before=await p.locator('canvas').first().evaluate(c=>c.toDataURL());await p.mouse.move(250,230);await p.waitForTimeout(600);const after=await p.locator('canvas').first().evaluate(c=>c.toDataURL());result[motion]={canvasChanged:before!==after,motion:await p.locator('.site').getAttribute('data-motion')};await p.screenshot({path:path.join(out,`home-motion-${motion}-390.png`)});await c.close();
}
for(const route of ['/work/parc/','/work/xrpcafe/','/work/do-androids-dream/']){
 const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});const p=await c.newPage();await p.goto(base+route);const v=p.locator('video').first();await v.scrollIntoViewIfNeeded();await p.waitForTimeout(500);const before=await v.evaluate(v=>({time:v.currentTime,paused:v.paused}));await p.waitForTimeout(600);const after=await v.evaluate(v=>({time:v.currentTime,paused:v.paused}));await p.getByRole('button',{name:/^Pause video/}).first().click();result.videos.push({route,before,after,pausedByControl:await v.evaluate(v=>v.paused)});await c.close();
}
for(const route of ['/','/toolbox/','/work/parc/','/contact/','/nope/']){
 const c=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false,reducedMotion:'reduce'});const p=await c.newPage();await p.goto(base+route);result.nojs.push({route,...await p.evaluate(()=>({mainText:document.querySelector('main')?.innerText.slice(0,300),scrollWidth:document.documentElement.scrollWidth,links:document.querySelectorAll('main a[href]').length,contactNotice:document.querySelector('noscript')?.innerText}))});await p.screenshot({path:path.join(out,(route==='/'?'home':route.slice(1,-1).replaceAll('/','-'))+'-nojs-390.png'),fullPage:true});await c.close();
}
// Recompute viewport coordinates after each scroll. The original interaction log used stale coordinates.
const c=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const p=await c.newPage();await p.goto(base+'/toolbox/');const light=p.getByRole('button',{name:'Light preview background',exact:true}),dark=p.getByRole('button',{name:'Dark preview background',exact:true});
for(const delta of [-5,-2,-1,0,3,7,8]){
 await light.click();await p.evaluate(()=>{const e=document.querySelector('[aria-label="Light preview background"]');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-400);});await p.waitForTimeout(50);const r=await light.boundingBox();const x=r.x+r.width+delta,y=r.y+r.height/2;const hit=await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.getAttribute('aria-label'),{x,y});await p.touchscreen.tap(x,y);result.swatches.push({delta,x,y,hit,dark:await dark.getAttribute('aria-pressed')});
}
await light.scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'swatch-overlap-confirmed-390.png')});
await c.close();
await browser.close();await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({motionCount:result.motion.length,motionProblems:result.motion.filter(x=>x.motion!=='on'),keyboard:result.keyboard.map(x=>({route:x.route,width:x.width,stops:x.states.length,problems:x.states.filter(s=>s.offscreen||s.hidden)})),swatches:result.swatches,videos:result.videos,reduced:result.reduce,noPreference:result['no-preference']},null,2));
