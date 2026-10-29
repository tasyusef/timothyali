export const paths=['/','/work/','/work/parc/','/work/xrpcafe/','/work/firstledger/','/work/do-androids-dream/','/work/jade-aesthetics/','/work/firststrike/','/work/toolbox/','/toolbox/','/toolbox/lockup/','/toolbox/palette/','/toolbox/specimen/','/toolbox/convert/','/toolbox/agents/','/contact/','/nope/'];
export const key=p=>p==='/'?'home':p.replace(/^\//,'').replaceAll('/','_');
export const survey=[];
export async function scan(w,theme){
  await page.setViewportSize({width:w,height:960});
  await page.evaluate(t=>localStorage.setItem('tim-theme',t),theme);
  const rows=[];
  for(const p of paths){
    await page.goto('http://127.0.0.1:4173'+p); await page.waitForTimeout(200);
    await page.evaluate(()=>document.fonts.ready);
    if(w===1440||w===390){
      const h=await page.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<h;y+=740){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(30);}
      await page.screenshot({path:out+key(p)+w+'-'+theme+'-bottom.png'});
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    }
    const s=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.innerText,sw:document.documentElement.scrollWidth,w:innerWidth,height:document.documentElement.scrollHeight,fields:document.querySelectorAll('.band-bg canvas').length,
      overflow:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).position!=='absolute'&&(e.getBoundingClientRect().right>innerWidth+2||e.getBoundingClientRect().left < -2)).slice(0,15).map(e=>({tag:e.tagName,c:e.className,t:e.innerText?.slice(0,90),rect:e.getBoundingClientRect().toJSON()})),
      text:document.querySelector('main')?.innerText,
      controls:[...document.querySelectorAll('main a,main button,main input,main select,main textarea')].map(e=>({tag:e.tagName,text:e.innerText,aria:e.getAttribute('aria-label'),href:e.getAttribute('href')}))}));
    await page.screenshot({path:out+key(p)+w+'-'+theme+'.png',fullPage:true});
    rows.push({p,w,theme,...s});
  }
  survey.push(...rows); await fs.writeFile(out+'survey.json',JSON.stringify(survey,null,2));
  return rows.map(s=>({p:s.p,h:s.height,overflow:s.overflow.length,sw:s.sw,fields:s.fields}));
}
export async function keyboard(w){
  await page.setViewportSize({width:w,height:960});const results=[];
  for(const p of paths){
    await page.goto('http://127.0.0.1:4173'+p);await page.waitForTimeout(180);
    const n=await page.locator('a,button,input,select,textarea,[tabindex="0"]').count();const stops=[];
    for(let i=0;i<n+3;i++){
      await page.keyboard.press('Tab');
      const f=await page.evaluate(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),c=getComputedStyle(e);return {tag:e.tagName,text:(e.getAttribute('aria-label')||e.innerText||e.getAttribute('name')||'').slice(0,110),href:e.getAttribute('href'),outline:c.outline,rect:r.toJSON(),y:scrollY,hidden:e.closest('[aria-hidden="true"]')!==null,top:document.querySelector('.nav-chrome').getBoundingClientRect().bottom};});
      stops.push(f);if(i>1&&f.href==='#main')break;
    }
    results.push({p,w,stops});
  }
  await fs.writeFile(out+'keyboard-'+w+'.json',JSON.stringify(results,null,2));return results.map(r=>({p:r.p,stops:r.stops.length,issues:r.stops.filter(s=>s.hidden||s.outline.includes('none')||s.rect.right>w+1)}));
}
