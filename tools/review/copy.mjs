import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { studies } from '../../src/lib/work.ts';
import { tools } from '../../src/lib/toolbox.ts';
const out='docs/iterations/pixel-v2/39-copy-refinement';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const routes=['/','/work/','/contact/','/not-found/',...studies.map(p=>`/work/${p.slug}/`),'/toolbox/','/toolbox/agents/',...tools.map(t=>`/toolbox/${t.slug}/`)];
const selected=process.env.COPY_ROUTES?.split(',');
const results=selected?JSON.parse(readFileSync(`${out}/browser-review.json`,'utf8')).filter(r=>!selected.includes(r.route)):[];
for(const width of [1440,390,320]) {
 const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await ctx.addInitScript(()=>{localStorage.setItem('tim-motion','off');localStorage.setItem('tim-theme','dark')});
 for(const route of routes.filter(r=>!selected||selected.includes(r))){
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/contact', route => route.abort());
  const response=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(700);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth, h1:document.querySelector('h1')?.innerText,spills:[...document.querySelectorAll('main p,main h2,main dd')].filter(el=>{const r=el.getBoundingClientRect();return !el.classList.contains('sr-only')&&r.width>0&&el.scrollWidth>el.clientWidth+2}).map(el=>({tag:el.tagName,text:el.textContent.slice(0,90),width:el.clientWidth,scroll:el.scrollWidth}))}));
  results.push({width,route,status:response.status(),errors,...state});
  console.log(width,route,JSON.stringify({errors,overflow:state.overflow,spills:state.spills}));
  if((width===1440||width===390)&&['/work/jade-aesthetics/','/work/parc/','/toolbox/agents/','/toolbox/lockup/'].includes(route)) await page.screenshot({path:`${out}/${width}-${route.replaceAll('/','-')}.png`,fullPage:true});
  if(route==='/contact/'&&width===390){let posts=0;page.on('request',r=>{if(r.method()==='POST') posts++});await page.getByRole('button',{name:'Send',exact:true}).click();await page.locator('input[name=name]').fill('Copy review');await page.locator('input[name=email]').fill('bad-address');await page.locator('textarea').fill('Test');await page.getByRole('button',{name:'Send',exact:true}).click();const note=await page.locator('#email-note').innerText();if(!note.includes('NAME@EXAMPLE.COM')&&!note.includes('name@example.com'))throw new Error(note);if(posts)throw new Error('Validation submitted a message');await page.locator('.contact-form').screenshot({path:`${out}/contact-validation.png`});}
  await page.close();
 }
 await ctx.close();
}
writeFileSync(`${out}/browser-review.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({pages:results.length,issues:results.filter(r=>r.errors.length||r.overflow||r.spills.length||r.status>=400)},null,2));
await browser.close();
