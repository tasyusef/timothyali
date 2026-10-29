const base='http://127.0.0.1:4173';
export async function run(w,touch=false){
 const dc=await browser.newContext({viewport:{width:w,height:900},hasTouch:touch,isMobile:touch,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});const p=await dc.newPage();
 await p.goto(base+'/toolbox/');await p.waitForTimeout(400);const results=[];
 const snap=async(name)=>{await p.screenshot({path:out+name+'-'+w+(touch?'-touch':'')+'.png',fullPage:!touch});const data=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,coarse:matchMedia('(pointer:coarse)').matches,onphone:getComputedStyle(document.querySelector('.on-phone')).display,focus:document.activeElement.outerHTML.slice(0,300),overflow:[...document.querySelectorAll('.demo *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({t:e.innerText?.slice(0,70),tag:e.tagName,c:e.className,r:e.getBoundingClientRect().toJSON()})).slice(0,15)}));results.push({name,...data});await fs.writeFile(out+'demos-'+w+(touch?'-touch':'')+'.json',JSON.stringify(results,null,2));};
 await p.getByRole('button',{name:'Dark preview background'}).click();await p.getByRole('button',{name:'Light preview background'}).focus();await p.keyboard.press('Space');
 await p.getByRole('switch',{name:'Web',exact:true}).focus();await p.keyboard.press('Space');await p.keyboard.press('Space');
 await p.locator('.demo .chip').filter({hasText:'PNG'}).first().click();await p.getByRole('button',{name:'Continue',exact:true}).focus();await p.keyboard.press('Enter');await p.waitForTimeout(100);await snap('lockup-review');
 const tree=p.locator('.tree button').first();await tree.focus();await p.keyboard.press('Space');await p.keyboard.press('Enter');
 await p.getByRole('textbox',{name:'Package name'}).fill('Audit Example');await p.getByRole('button',{name:'Back',exact:true}).click();await snap('lockup-back');
 await p.locator('.tool-picker button').nth(1).focus();await p.keyboard.press('Space');await p.waitForTimeout(300);
 await p.getByRole('textbox',{name:'Palette name'}).fill('Audit Palette');await p.getByRole('textbox',{name:'Hex for color 1',exact:true}).fill('bad-hex');await p.keyboard.press('Tab');results.push({name:'invalid-hex',value:await p.getByRole('textbox',{name:'Hex for color 1',exact:true}).inputValue()});
 await p.getByRole('button',{name:'Add color'}).click();await p.getByRole('button',{name:'Remove color 5',exact:true}).focus();await p.keyboard.press('Space');await snap('palette-remove');
 await p.locator('.file-row').first().focus();await p.keyboard.press('Enter');await snap('palette-css');
 await p.locator('.tool-picker button').nth(2).focus();await p.keyboard.press('Enter');await p.waitForTimeout(300);
 await p.getByRole('combobox',{name:'Display typeface',exact:true}).selectOption('parc');await p.getByRole('textbox',{name:'Sample line'}).fill('Testing type at a narrow width.');await snap('specimen-parc');
 await p.getByRole('button',{name:'Specimen',exact:true}).click();await p.getByRole('combobox',{name:'Family',exact:true}).selectOption('press');await snap('specimen-classic');
 await p.locator('.tool-picker button').nth(3).focus();await p.keyboard.press('Space');await p.waitForTimeout(500);
 for(const label of ['PNG','TIFF','PDF','500'])await p.getByRole('button',{name:label,exact:true}).click();
 await p.getByRole('slider',{name:'Compression'}).focus();await p.keyboard.press('ArrowRight');await p.keyboard.press('End');await p.waitForTimeout(400);await snap('convert-all');
 const downloaded=[];await p.route('**/download/**',async route=>{downloaded.push(route.request().url());await route.abort();});
 const downloads=await p.locator('a[href^="/download/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));for(const href of downloads){await p.goto(base+'/toolbox/');await p.locator('a[href="'+href+'"]').click({timeout:5000}).catch(()=>{});await p.waitForTimeout(100);}await p.goto(base+'/toolbox/');results.push({name:'downloads',downloaded});
 if(touch){await p.evaluate(()=>Object.defineProperty(navigator,'share',{configurable:true,value:undefined}));await p.getByRole('button',{name:'Send the link to your computer',exact:true}).click();results.push({name:'send-link-success',status:await p.locator('.on-phone [role=status]').innerText(),clipboard:await p.evaluate(()=>navigator.clipboard.readText())});
  await p.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Denied','NotAllowedError');}});Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:async()=>{throw new Error('Denied');}});});
  await p.waitForTimeout(4100);await p.getByRole('button',{name:'Send the link to your computer',exact:true}).click();await snap('send-link-failed');const immediate=await p.locator('.on-phone [role=status]').innerText();await p.waitForTimeout(4200);results.push({name:'send-link-failure',immediate,after:await p.locator('.on-phone [role=status]').innerText()});}
 await fs.writeFile(out+'demos-'+w+(touch?'-touch':'')+'.json',JSON.stringify(results,null,2));await dc.close();return results.map(r=>({name:r.name,sw:r.sw,w:r.w,overflow:r.overflow?.length,focus:r.focus,downloaded:r.downloaded?.length,immediate:r.immediate,after:r.after}));
}
