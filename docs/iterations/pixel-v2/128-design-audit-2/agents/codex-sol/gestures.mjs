import {paths,key} from './tasks.mjs';
const base='http://127.0.0.1:4173';
const fields=paths.filter(p=>p==='/'||p.startsWith('/work/')&&p!=='/work/'||['/toolbox/','/contact/','/nope/'].includes(p));
async function gesture(pg){
 const box=await pg.locator('.band').first().boundingBox();
 const w=pg.viewportSize().width;
 const start={x:Math.min(w-40,box.x+box.width-40),y:Math.max(140,box.y+80)};
 const end={x:Math.max(60,w*.28),y:Math.min(620,box.y+box.height-40)};
 await pg.mouse.move(start.x,start.y);await pg.mouse.down();await pg.mouse.move(end.x,end.y,{steps:18});await pg.waitForTimeout(1550);
 const held=await pg.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());
 await pg.mouse.up();await pg.waitForTimeout(220);
 return {start,end,selected:await pg.evaluate(()=>getSelection()?.toString()),held};
}
async function setMotion(pg,on){
 if(await pg.locator('.site').getAttribute('data-motion')===(on?'on':'off'))return;
 await pg.getByRole('button',{name:'Settings',exact:true}).click();await pg.getByRole('button',{name:/Motion/}).click();await pg.keyboard.press('Escape');
}
export async function run(){
 await page.setViewportSize({width:1440,height:960});await page.goto(base);await setMotion(page,true);const rows=[];
 for(const p of fields){
  await page.goto(base+p);await page.waitForTimeout(1500);
  const before=await page.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());
  const moving=await gesture(page);await page.screenshot({path:out+'field-'+key(p)+'-release.png'});
  const nav=page.locator('header nav a[href="/work/"]');await nav.click();await page.waitForTimeout(400);const click=page.url();
  await page.goto(base+p);await setMotion(page,false);await page.waitForTimeout(400);
  const stillBefore=await page.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());await gesture(page);await page.waitForTimeout(300);const stillAfter=await page.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());
  rows.push({p,w:1440,onChanged:before!==moving.held,selection:moving.selected,click,offStatic:stillBefore===stillAfter,start:moving.start,end:moving.end});
  await setMotion(page,true);
 }
 const reduced=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});const rp=await reduced.newPage();
 for(const p of fields){await rp.goto(base+p);await rp.waitForTimeout(500);const a=await rp.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());await gesture(rp);const b=await rp.locator('.band-bg canvas').first().evaluate(c=>c.toDataURL());rows.push({p,w:1440,reduced:true,motion:await rp.locator('.site').getAttribute('data-motion'),static:a===b});}
 await reduced.close();await fs.writeFile(out+'gestures.json',JSON.stringify(rows,null,2));return rows;
}
export async function touch(){
 const tc=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'no-preference'});const tp=await tc.newPage();const cdp=await tc.newCDPSession(tp),rows=[];
 for(const p of fields){await tp.goto(base+p);await tp.waitForTimeout(300);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y:650}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:330,y:650-i*32}]});await tp.waitForTimeout(20);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await tp.waitForTimeout(200);rows.push({p,y:await tp.evaluate(()=>scrollY),height:await tp.evaluate(()=>document.documentElement.scrollHeight)});}
 await tc.close();await fs.writeFile(out+'touch-swipes.json',JSON.stringify(rows,null,2));return rows;
}
