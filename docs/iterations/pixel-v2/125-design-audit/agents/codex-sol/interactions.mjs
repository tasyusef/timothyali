import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.dirname(new URL(import.meta.url).pathname), base='http://127.0.0.1:4173';
const browser=await chromium.launch({channel:'chrome'}), results={};
const context=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
await context.addInitScript(()=>{localStorage.setItem('tim-theme','dark');localStorage.removeItem('tim-motion');});
await context.route('**/api/contact',r=>r.abort());
const p=await context.newPage();
await p.goto(base+'/toolbox/');await p.evaluate(()=>document.fonts.ready);
results.mobilePointer=await p.evaluate(()=>({coarse:matchMedia('(pointer:coarse)').matches,hover:matchMedia('(hover:hover)').matches}));
await p.getByRole('button',{name:'Light preview background',exact:true}).scrollIntoViewIfNeeded();
results.swatches=await p.locator('.stage .swatch-chip').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e,'::after');return {name:e.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height,after:{left:s.left,right:s.right,top:s.top,bottom:s.bottom}};}));
await p.screenshot({path:path.join(out,'toolbox-touch-swatches-390.png')});
const a=results.swatches[0],b=results.swatches[1],y=a.y+a.h/2;
results.swatchHitTest=[];
for(const x of [a.x+a.w-2,a.x+a.w-1,a.x+a.w,a.x+a.w+3,b.x-1,b.x]){
 await p.getByRole('button',{name:'Light preview background',exact:true}).click();
 await p.mouse.click(x,y);
 results.swatchHitTest.push({x,y,dark:await p.getByRole('button',{name:'Dark preview background',exact:true}).getAttribute('aria-pressed'),element:await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.getAttribute('aria-label'),{x,y})});
}
results.demos=[];
for(const name of ['Lockup','Palette','Specimen','Convert']){
 await p.getByRole('button',{name:new RegExp(`0[1-4] ${name}`,'i')}).click();await p.waitForTimeout(300);
 await p.locator('.demo').scrollIntoViewIfNeeded();
 await p.screenshot({path:path.join(out,`toolbox-touch-${name.toLowerCase()}-390.png`),fullPage:true});
 for(const width of [320,390,700,900,1100,1440]){
  await p.setViewportSize({width,height:900});await p.waitForTimeout(100);
  results.demos.push({name,width,...await p.evaluate(()=>({sw:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('.demo *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)}).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent?.slice(0,80)})).slice(0,12)}))});
 }
 await p.setViewportSize({width:390,height:900});
 if(name==='Lockup'){
  await p.getByRole('button',{name:'Continue',exact:true}).click();
  results.lockupReview=await p.locator('.demo').innerText();
  await p.screenshot({path:path.join(out,'toolbox-lockup-review-390.png'),fullPage:true});
 }
 if(name==='Palette'){
  await p.getByRole('button',{name:'Acme.ase',exact:true}).click();await p.locator('.demo .stage').scrollIntoViewIfNeeded();
  await p.screenshot({path:path.join(out,'toolbox-palette-ase-390-dark.png')});
 }
 if(name==='Specimen'){
  await p.getByRole('button',{name:'Specimen',exact:true}).click();
  await p.screenshot({path:path.join(out,'toolbox-specimen-classic-390.png'),fullPage:true});
 }
}
results.options=[];
for(const tool of ['lockup','palette','specimen','convert']){
 await p.setViewportSize({width:320,height:900});await p.goto(base+`/toolbox/${tool}/`);
 await p.locator('summary').click();
 results.options.push({tool,...await p.evaluate(()=>({sw:document.documentElement.scrollWidth,text:document.querySelector('.tool-options').innerText,overflow:[...document.querySelectorAll('.tool-options *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({cls:e.className,text:e.textContent.slice(0,100)}))}))});
 await p.locator('.tool-options').screenshot({path:path.join(out,`options-${tool}-320.png`)});
}
// Empty and invalid submits are intercepted as a safeguard and must make zero requests.
let posts=0;p.on('request',r=>{if(r.url().endsWith('/api/contact'))posts++;});
await p.setViewportSize({width:390,height:900});await p.goto(base+'/contact/');
await p.getByRole('button',{name:'Send',exact:true}).click();
results.contactEmpty=await p.evaluate(()=>({active:document.activeElement.name,notes:[...document.querySelectorAll('.note')].map(e=>e.textContent),fields:[...document.querySelectorAll('input,textarea')].map(e=>({name:e.name,invalid:e.getAttribute('aria-invalid'),description:e.getAttribute('aria-describedby')}))}));
await p.screenshot({path:path.join(out,'contact-empty-390-dark.png'),fullPage:true});
await p.locator('input[name=name]').fill('Audit');await p.locator('input[name=email]').fill('invalid');await p.locator('textarea').fill('Read-only validation check.');await p.getByRole('button',{name:'Send',exact:true}).click();
results.contactInvalid=await p.evaluate(()=>({active:document.activeElement.name,note:document.querySelector('#email-note')?.textContent}));
results.contactPosts=posts;await p.screenshot({path:path.join(out,'contact-invalid-390-dark.png'),fullPage:true});
// Render redirect/query outcomes without submitting a form.
for(const state of ['sent=1','error=send-failed']){await p.goto(base+'/contact/?'+state);await p.waitForTimeout(100);results[state]=await p.locator('#contact-status').innerText();await p.screenshot({path:path.join(out,'contact-'+state.split('=')[0]+'-390-dark.png'),fullPage:true});}
await context.close();
results.settings=[];
for(const theme of ['dark','light']){
 const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await c.addInitScript(t=>localStorage.setItem('tim-theme',t),theme);const q=await c.newPage();await q.goto(base+'/');
 await q.getByRole('button',{name:'Settings',exact:true}).focus();await q.keyboard.press('Enter');await q.keyboard.press('Tab');
 results.settings.push({theme,...await q.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e),p=getComputedStyle(e.parentElement);return {text:e.textContent,color:s.color,background:s.backgroundColor,outline:s.outline,outlineOffset:s.outlineOffset,parentBackground:p.backgroundColor};})});
 await q.screenshot({path:path.join(out,`settings-focus-1440-${theme}.png`)});
 await q.keyboard.press('Tab');await q.keyboard.press('Space');await q.waitForTimeout(100);results.settings.at(-1).themeToggle=await q.locator('html').getAttribute('data-theme');await q.keyboard.press('Escape');results.settings.at(-1).restored=await q.evaluate(()=>document.activeElement.getAttribute('aria-label'));
 await c.close();
}
await browser.close();await fs.writeFile(path.join(out,'interactions.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
