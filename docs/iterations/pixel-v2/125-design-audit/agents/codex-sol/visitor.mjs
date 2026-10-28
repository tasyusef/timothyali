import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.dirname(new URL(import.meta.url).pathname),base='http://127.0.0.1:4173';
const studies=['parc','xrpcafe','firstledger','do-androids-dream','jade-aesthetics','firststrike','toolbox'];
const routes=['/','/work/',...studies.map(s=>`/work/${s}/`),'/toolbox/',...['lockup','palette','specimen','convert','agents'].map(s=>`/toolbox/${s}/`),'/contact/','/nope/'];
const browser=await chromium.launch({channel:'chrome'}),result={nav:[],cards:[],studyLinks:[],toolLinks:[],settings:[],states:[],scroll:[],contact:[],downloads:[],phone:[],commands:[],focusChanges:[],demoActions:[],errors:[]};
const save=async()=>{await fs.writeFile(path.join(out,'visitor.pending.json'),JSON.stringify(result,null,2));await fs.rename(path.join(out,'visitor.pending.json'),path.join(out,'visitor.json'));};
const active=p=>p.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.getAttribute('aria-label')||document.activeElement.textContent?.trim().slice(0,90)}));
for(const width of [390,1440]){
 const c=await browser.newContext({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});await c.addInitScript(()=>localStorage.setItem('tim-theme','dark'));
 let external=[];await c.route('https://**',async r=>{external.push(r.request().url());await r.fulfill({status:200,contentType:'text/html',body:'<title>External destination intercepted by audit</title><p>External destination intercepted</p>'});});
 await c.route('**/download/**',async r=>{result.downloads.push({width,url:r.request().url()});await r.fulfill({status:204,body:''});});
 const p=await c.newPage();p.on('pageerror',e=>result.errors.push({width,error:e.message}));
 await p.route('**/api/contact**',r=>r.abort());
 // Exercise each navigation destination with real clicks.
 for(const href of ['/','/work/','/contact/','/toolbox/']){await p.goto(base+'/');await p.locator(`nav[aria-label="Main navigation"] a[href="${href}"]`).click();await p.waitForTimeout(80);result.nav.push({width,href,arrived:new URL(p.url()).pathname});}
 // Every Work card, plus the selected-work jump and cards on Home.
 await p.goto(base+'/work/');const cards=await p.locator('.card').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 for(const href of cards){await p.locator(`.card[href="${href}"]`).click();await p.waitForTimeout(70);result.cards.push({width,from:'/work/',href,arrived:new URL(p.url()).pathname});await p.goBack();}
 await p.goto(base+'/');await p.getByRole('link',{name:/^Selected work/i}).click();result.cards.push({width,from:'/',jump:p.url(),y:await p.evaluate(()=>scrollY)});
 const selected=await p.locator('.card').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 for(const href of selected){await p.locator(`.card[href="${href}"]`).click();await p.waitForTimeout(50);result.cards.push({width,from:'/',href,arrived:new URL(p.url()).pathname});await p.goBack();}
 // Next, contact and live/source/watch links in each study. External navigation is intercepted.
 for(const s of studies){const url=base+`/work/${s}/`;await p.goto(url);const links=await p.locator('main a[href]').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));
  for(const l of links){await p.goto(url);const link=p.locator('main a').filter({hasText:l.text}).first();await link.click();await p.waitForTimeout(60);result.studyLinks.push({width,from:s,...l,arrived:p.url(),externalIntercept:external.includes(p.url())});}
 }
 // Four tool guides and their return/next links, all through the landing picker.
 for(const [n,name] of ['Lockup','Palette','Specimen','Convert'].entries()){
  await p.goto(base+'/toolbox/');const pick=p.getByRole('button',{name:new RegExp(`0${n+1} ${name}`,'i')});await pick.focus();await p.keyboard.press('Space');await p.waitForTimeout(100);await p.getByRole('link',{name:new RegExp(`^${name} guide`,'i')}).click();await p.waitForTimeout(50);result.toolLinks.push({width,name,guide:p.url()});await p.getByRole('link',{name:/All four tools/}).click();result.toolLinks.at(-1).back=p.url();
 }
 await p.goto(base+'/nope/');await p.getByRole('link',{name:/Back to home/}).click();result.nav.push({width,from:'/nope/',arrived:p.url()});
 // Real settings toggles, cross-page persistence and keyboard Escape.
 await p.goto(base+'/');const cog=p.getByRole('button',{name:'Settings',exact:true});await cog.focus();await p.keyboard.press('Enter');await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.keyboard.press('Tab');await p.keyboard.press('Space');await p.keyboard.press('Escape');await p.locator('nav a[href="/work/"]').click();await p.waitForTimeout(100);
 result.settings.push({width,theme:await p.locator('html').getAttribute('data-theme'),motion:await p.locator('.site').getAttribute('data-motion'),saved:await p.evaluate(()=>({theme:localStorage.getItem('tim-theme'),motion:localStorage.getItem('tim-motion')}))});
 await p.getByRole('button',{name:'Settings',exact:true}).click();await p.getByRole('button',{name:/^Motion/}).click();await p.getByRole('button',{name:/^Theme/}).click();await p.keyboard.press('Escape');
 // Top-to-bottom wheel scrolling at both requested visitor widths. Keep the footer and midpoint.
 for(const route of routes){await p.goto(base+route);await p.evaluate(()=>document.fonts.ready);let last=-1,steps=0;const samples=[];let midSaved=false;
  while(steps++<100){const state=await p.evaluate(()=>({y:scrollY,h:document.documentElement.scrollHeight,navTop:document.querySelector('.nav-chrome').getBoundingClientRect().top,hold:[...document.querySelectorAll('.point-text.hold')].map(e=>({y:e.getBoundingClientRect().top,h:e.getBoundingClientRect().height})).filter(e=>e.y>=0&&e.y<innerHeight)}));samples.push(state);if(!midSaved&&state.y>(state.h-900)/2){await p.screenshot({path:path.join(out,`scroll-${route==='/'?'home':route.slice(1,-1).replaceAll('/','-')}-${width}-mid.png`)});midSaved=true;}if(state.y>=state.h-900-2||state.y===last)break;last=state.y;await p.mouse.wheel(0,600);await p.waitForTimeout(55);}
  await p.screenshot({path:path.join(out,`scroll-${route==='/'?'home':route.slice(1,-1).replaceAll('/','-')}-${width}-bottom.png`)});result.scroll.push({width,route,steps,samples,footerVisible:await p.locator('.global-footer').evaluate(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;})});await save();
 }
 // Contact validation and actual sending/success/failure UI, with all POSTs answered here.
 for(const outcome of ['success','failure','network']){
  await p.goto(base+'/contact/');await p.unroute('**/api/contact**');let calls=0,release;const gate=new Promise(r=>release=r);
  await p.route('**/api/contact**',async r=>{calls++;await gate;if(outcome==='network')await r.abort('failed');else await r.fulfill({status:outcome==='success'?200:502,contentType:'application/json',body:JSON.stringify(outcome==='success'?{ok:true}:{ok:false,error:'send-failed'})});});
  await p.getByRole('button',{name:'Send',exact:true}).click();const empty=await active(p);
  await p.locator('[name=name]').fill('Audit visitor');await p.keyboard.press('Tab');await p.locator('[name=email]').fill('invalid');await p.locator('textarea').fill('Intercepted design audit message.');await p.getByRole('button',{name:'Send',exact:true}).click();const invalid=await active(p);
  await p.locator('[name=email]').fill('audit@example.com');await p.getByRole('button',{name:'Send',exact:true}).focus();await p.keyboard.press('Enter');await p.waitForTimeout(80);const sending=await p.locator('.send').innerText();await p.screenshot({path:path.join(out,`contact-sending-${width}.png`),fullPage:true});
  release();await p.waitForTimeout(120);const status=await p.locator('#contact-status').innerText(),values=await p.locator('textarea').inputValue();result.contact.push({width,outcome,empty,invalid,calls,sending,status,values});await p.screenshot({path:path.join(out,`contact-${outcome}-${width}.png`),fullPage:true});
 }
 // Intercept each actual download; no file leaves the site.
 await p.goto(base+'/toolbox/');const ds=await p.locator('a[href*="/download/"]').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));for(const d of ds){await p.locator(`a[href="${d.href}"]`).click();await p.waitForTimeout(30);}result.downloads.push({width,visibleLinks:ds});
 if(width===390){const send=p.getByRole('button',{name:/Send the link to your computer/});await send.click();result.phone.push({width,text:await send.innerText(),clipboard:await p.evaluate(()=>navigator.clipboard.readText())});await p.screenshot({path:path.join(out,'phone-send-link-390.png')});}
 // CLI has selectable commands, no copy buttons. Exercise jump links and selection/copy.
 await p.goto(base+'/toolbox/agents/');const jumps=await p.locator('.jump a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));for(const j of jumps){await p.locator(`.jump a[href="${j.href}"]`).click();result.commands.push({width,...j,hash:new URL(p.url()).hash,headingY:await p.locator(j.href+' h2').first().evaluate(e=>e.getBoundingClientRect().top)});}
 const code=p.getByRole('figure',{name:'macOS shortcut',exact:true});await code.scrollIntoViewIfNeeded();await code.evaluate(e=>{const s=getSelection(),r=document.createRange();r.selectNodeContents(e);s.removeAllRanges();s.addRange(r);});await p.keyboard.press('Meta+c');result.commands.push({width,copyButtons:await p.getByRole('button',{name:/copy/i}).count(),copied:await p.evaluate(()=>navigator.clipboard.readText())});
 // Focus transfer when real controls change state.
 await p.goto(base+'/toolbox/');const cont=p.getByRole('button',{name:'Continue',exact:true});await cont.focus();await p.keyboard.press('Enter');result.focusChanges.push({width,action:'Lockup Continue',active:await active(p)});await p.keyboard.press('Tab');result.focusChanges.at(-1).nextTab=await active(p);await p.screenshot({path:path.join(out,`lockup-after-continue-${width}.png`)});
 await p.goto(base+'/work/do-androids-dream/');const play=p.getByRole('button',{name:/^Play video/}).first();await play.focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);result.focusChanges.push({width,action:'Play video',active:await active(p)});await p.keyboard.press('Tab');result.focusChanges.at(-1).nextTab=await active(p);
 // Contrast pairs around the focused form input, on the panel's actual surface.
 for(const theme of ['dark','light']){await p.goto(base+'/contact/');if(await p.locator('html').getAttribute('data-theme')!==theme){await p.getByRole('button',{name:'Settings',exact:true}).click();await p.getByRole('button',{name:/^Theme/}).click();await p.keyboard.press('Escape');}await p.locator('[name=name]').focus();result.states.push({width,theme,focus:await p.locator('[name=name]').evaluate(e=>{const s=getComputedStyle(e),a=getComputedStyle(e.closest('.panel'));return {outline:s.outline,outlineOffset:s.outlineOffset,panelBackground:a.backgroundColor,accentText:s.getPropertyValue('--accent-text'),focusToken:s.getPropertyValue('--focus-ring')};})});await p.screenshot({path:path.join(out,`contact-focus-${width}-${theme}.png`)});}
 await save();await c.close();console.log('Visitor flows complete',width);
}
// Desktop hover/press and field interaction, using actual mouse inputs.
const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});const p=await c.newPage();await p.goto(base+'/');await p.waitForTimeout(800);
for(const selector of ['.cta-hint','.hero-actions .quiet-link','.card']){const l=p.locator(selector).first();if(!await l.count())continue;await l.scrollIntoViewIfNeeded();await l.hover();const hover=await l.evaluate(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color,transform:getComputedStyle(e).transform}));const b=await l.boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();const press=await l.evaluate(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color}));await p.screenshot({path:path.join(out,'press-'+selector.replaceAll(/[^a-z]/g,'')+'-1440.png')});await p.mouse.move(0,0);await p.mouse.up();result.states.push({selector,hover,press});}
await p.goto(base+'/');await p.waitForTimeout(1000);const canvas=p.locator('canvas').first();const before=await canvas.evaluate(c=>c.toDataURL());await p.mouse.move(1150,220);await p.waitForTimeout(100);const swell=await canvas.evaluate(c=>c.toDataURL());await p.mouse.click(1150,220);await p.waitForTimeout(140);const ring=await canvas.evaluate(c=>c.toDataURL());result.states.push({field:true,swellChanged:before!==swell,ringChanged:swell!==ring});await p.screenshot({path:path.join(out,'field-ring-1440.png')});await c.close();await browser.close();await save();console.log(JSON.stringify({nav:result.nav.length,cards:result.cards.length,studyLinks:result.studyLinks.length,tools:result.toolLinks.length,scroll:result.scroll.length,contact:result.contact,focus:result.focusChanges,phone:result.phone,errors:result.errors},null,2));
