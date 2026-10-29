import {paths,key} from './tasks.mjs';
const base='http://127.0.0.1:4173';
const result=[];
const record=async(name,data)=>{result.push({name,...data});await fs.writeFile(out+'interactions.json',JSON.stringify(result,null,2));};
export async function links(w){
 await page.setViewportSize({width:w,height:960});
 const clicks=[];
 for(const p of paths){
  await page.goto(base+p);await page.waitForTimeout(150);
  const links=await page.locator('a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.innerText})).filter(e=>e.href&&!e.href.startsWith('mailto:')&&!e.href.includes('/resume/')&&!e.href.includes('/download/')));
  for(const a of links){
   await page.goto(base+p);await page.waitForTimeout(70);
   const l=page.locator('a').filter({has:undefined});
   const target=page.locator('a').filter({visible:true});
   const exact=page.locator('a').filter({hasText:a.text}).filter({visible:true});
   const byHref=page.locator('a').filter({visible:true});
   let match=null;for(const e of await byHref.all())if(await e.getAttribute('href')===a.href){match=e;break;}
   if(!match){clicks.push({p,...a,skipped:'hidden'});continue;}
   if(/^https?:/.test(a.href)){
     const dest=new URL(a.href);await page.route(a.href,route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Audit destination intercepted</title>External destination intercepted for audit.'}));
   }
   try{if(a.href==='#main'){await page.keyboard.press('Tab');await page.keyboard.press('Enter');}else await match.click({timeout:5000});await page.waitForTimeout(110);clicks.push({p,...a,url:page.url(),focus:await page.evaluate(()=>document.activeElement?.tagName),scroll:await page.evaluate(()=>scrollY)});}
   catch(e){clicks.push({p,...a,error:e.message.slice(0,300)});}
  }
 }
 await record('links',{w,clicks});return {w,count:clicks.length,errors:clicks.filter(c=>c.error)};
}
export async function contact(w){
 await page.setViewportSize({width:w,height:960});let count=0,mode='failed';
 await page.route('**/api/contact',async route=>{count++;await new Promise(r=>setTimeout(r,800));if(mode==='network')return route.abort();await route.fulfill({status:mode==='sent'?200:502,contentType:'application/json',body:JSON.stringify(mode==='sent'?{ok:true}:{ok:false,error:'send-failed'})});});
 await page.goto(base+'/contact/');await page.waitForTimeout(200);
 const send=page.getByRole('button',{name:'Send',exact:true});
 await send.click();const empty={focus:await page.evaluate(()=>document.activeElement.name),errors:await page.locator('.note').allTextContents(),count};
 await page.screenshot({path:out+'contact-'+w+'-empty.png',fullPage:true});
 await page.locator('input[name=name]').fill('Audit Example');
 await page.locator('input[name=email]').fill('bad-address');
 await page.locator('textarea[name=message]').fill('Intercepted audit message. No real email.');
 await send.click();const invalid={focus:await page.evaluate(()=>document.activeElement.name),errors:await page.locator('.note').allTextContents(),count};
 await page.locator('input[name=email]').fill('audit@example.com');
 await send.click();await page.waitForTimeout(100);const sending={label:await page.locator('.send button').innerText(),ariaDisabled:await page.locator('.send button').getAttribute('aria-disabled'),focus:await page.evaluate(()=>document.activeElement.innerText)};
 await page.screenshot({path:out+'contact-'+w+'-sending.png',fullPage:true});
 await page.waitForTimeout(900);const failed={status:await page.locator('#contact-status').innerText(),value:await page.locator('textarea').inputValue(),focus:await page.evaluate(()=>document.activeElement.innerText)};
 await page.screenshot({path:out+'contact-'+w+'-failed.png',fullPage:true});
 mode='sent';await page.locator('textarea').focus();await page.keyboard.press('Meta+Enter');await page.waitForTimeout(950);const sent={status:await page.locator('#contact-status').innerText(),name:await page.locator('input[name=name]').inputValue(),message:await page.locator('textarea').inputValue(),count};
 await page.screenshot({path:out+'contact-'+w+'-sent.png',fullPage:true});await page.unroute('**/api/contact');
 await record('contact',{w,empty,invalid,sending,failed,sent});return {w,empty,invalid,sending,failed,sent};
}
