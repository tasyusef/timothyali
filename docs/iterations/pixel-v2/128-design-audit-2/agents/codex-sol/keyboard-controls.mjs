export async function run(){
 const rows=[];await page.setViewportSize({width:390,height:960});const tools=['lockup','palette','specimen','convert'];
 const open=async(i)=>{await page.goto('http://127.0.0.1:4173/toolbox/');await page.locator('.tool-picker button').nth(i).click();await page.waitForTimeout(160);await page.locator('.demo .demo-path').filter({hasText:new RegExp(tools[i],'i')}).waitFor();};
 for(let t=0;t<tools.length;t++){
  await open(t);const buttons=await page.locator('main button').evaluateAll(es=>es.map((e,i)=>({i,text:e.getAttribute('aria-label')||e.innerText,disabled:e.disabled,visible:!!e.getClientRects().length})).filter(e=>!e.disabled&&e.visible));
  for(const b of buttons)for(const key of ['Enter','Space']){await open(t);const button=page.locator('main button').nth(b.i);await button.focus();await page.keyboard.press(key);await page.waitForTimeout(25);await page.keyboard.press('Escape');rows.push({tool:tools[t],name:b.text,key,focus:await page.evaluate(()=>({tag:document.activeElement.tagName,name:document.activeElement.getAttribute('aria-label')||document.activeElement.innerText?.slice(0,60)}))});}
  await open(t);const inputs=await page.locator('.demo input,.demo select').evaluateAll(es=>es.map((e,i)=>({i,name:e.getAttribute('aria-label'),type:e.type,tag:e.tagName})));
  for(const input of inputs){await open(t);const target=page.locator('.demo input,.demo select').nth(input.i);await target.focus();await page.keyboard.press('Space');await page.keyboard.press('Escape');await page.keyboard.press('Enter');await page.keyboard.press('Escape');rows.push({tool:tools[t],input:input.name,type:input.type,focus:await target.evaluate(e=>e===document.activeElement)});}
 }
 await fs.writeFile(out+'keyboard-controls.json',JSON.stringify(rows,null,2));return {count:rows.length,bodyFocus:rows.filter(r=>r.focus?.tag==='BODY').map(r=>({tool:r.tool,name:r.name,key:r.key}))};
}
