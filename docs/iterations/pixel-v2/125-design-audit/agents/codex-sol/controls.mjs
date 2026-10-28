import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.dirname(new URL(import.meta.url).pathname),base='http://127.0.0.1:4173',browser=await chromium.launch({channel:'chrome'}),results=[];
for(const width of [390,1440]){
 const c=await browser.newContext({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce'});await c.addInitScript(()=>localStorage.setItem('tim-theme','dark'));const p=await c.newPage();
 for(const [i,tool] of ['Lockup','Palette','Specimen','Convert'].entries()){
  await p.goto(base+'/toolbox/');await p.getByRole('button',{name:new RegExp(`0${i+1} ${tool}`,'i')}).click();await p.waitForTimeout(100);
  const ids=await p.locator('.demo button:not([disabled]),.demo input,.demo select').evaluateAll(es=>es.map((e,n)=>{e.dataset.auditId='control-'+n;return {id:e.dataset.auditId,tag:e.tagName,type:e.type,name:e.getAttribute('aria-label')||e.textContent.trim()};}));
  const states=[];
  for(const item of ids){const l=p.locator(`[data-audit-id="${item.id}"]`);if(!await l.count())continue;if(await l.isDisabled())continue;
   await l.focus();const before=await l.evaluate(e=>({checked:e.checked,pressed:e.getAttribute('aria-pressed'),value:e.value}));
   if(item.tag==='SELECT'){await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');}
   else if(item.tag==='INPUT'&&item.type==='range'){await p.keyboard.press('ArrowRight');}
   else if(item.tag==='INPUT'&&item.type==='checkbox'){await p.keyboard.press('Space');await p.keyboard.press('Space');}
   else if(item.tag==='INPUT'){await p.keyboard.press('End');await p.keyboard.type(' A');await p.keyboard.press('Tab');}
   else {await p.keyboard.press('Space');await p.waitForTimeout(30);if(await l.count()&&!await l.isDisabled()){await l.focus();await p.keyboard.press('Enter');}}
   states.push({...item,before,after:await l.count()?await l.evaluate(e=>({checked:e.checked,pressed:e.getAttribute('aria-pressed'),value:e.value})):null});
  }
  results.push({width,tool,controls:states,overflow:await p.evaluate(()=>document.documentElement.scrollWidth),stepsAX:tool==='Lockup'?await p.locator('.steps').ariaSnapshot():null});
  if(tool==='Lockup'){
   const review=p.locator('.steps button').nth(2);if(await review.count()){await review.focus();await p.keyboard.press('Space');await p.waitForTimeout(30);await p.screenshot({path:path.join(out,`lockup-keyboard-review-${width}.png`)});results.at(-1).reviewAX=await p.locator('.demo').ariaSnapshot();const back=p.getByRole('button',{name:'Back',exact:true});await back.focus();await p.keyboard.press('Space');}
  }
 }
 // Native details: Enter opens, Space closes, name retained.
 for(const tool of ['lockup','palette','specimen','convert']){await p.goto(base+`/toolbox/${tool}/`);const s=p.locator('summary');if(await s.isVisible()){await s.focus();await p.keyboard.press('Enter');const open=await p.locator('details').getAttribute('open');await p.keyboard.press('Space');results.push({width,tool,detailOpenByEnter:open!==null,detailClosedBySpace:await p.locator('details').getAttribute('open')===null});}}
 await c.close();
}
const c=await browser.newContext({viewport:{width:1440,height:900},forcedColors:'active',reducedMotion:'reduce'}),p=await c.newPage();await p.goto(base+'/contact/');await p.locator('[name=name]').focus();results.push({forcedColors:await p.locator('[name=name]').evaluate(e=>({outline:getComputedStyle(e).outline,color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}))});await p.screenshot({path:path.join(out,'contact-forced-colors-1440.png')});
await c.close();await browser.close();await fs.writeFile(path.join(out,'controls.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({width:r.width,tool:r.tool,controls:r.controls?.length,overflow:r.overflow,stepsAX:r.stepsAX,forcedColors:r.forcedColors})),null,2));
