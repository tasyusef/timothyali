export async function run(){
 const base='http://127.0.0.1:4173';await page.setViewportSize({width:1440,height:960});await page.goto(base);await page.evaluate(()=>{localStorage.setItem('tim-motion','on');localStorage.setItem('tim-theme','dark')});await page.reload();await page.waitForTimeout(2000);const records=[];
 for(const [name,fn] of [['theme',async()=>{await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:/Theme/}).click();}],['route',async()=>{await page.locator('header nav a[href="/work/"]').click();}]]){
  await fn();await page.waitForTimeout(20);const animations=await page.evaluate(()=>document.getAnimations().map(a=>{a.playbackRate=.1;return{name:a.animationName||a.constructor.name,rate:a.playbackRate,duration:a.effect?.getTiming().duration}}));await page.waitForTimeout(130);await page.screenshot({path:out+'slow-'+name+'.png'});await page.evaluate(()=>document.getAnimations().forEach(a=>{if(a.effect?.getTiming().iterations!==Infinity)a.finish();else a.playbackRate=1}));await page.waitForTimeout(300);records.push({name,animations,url:page.url()});
 }
 await fs.writeFile(out+'motion-check.json',JSON.stringify(records,null,2));return records;
}
