import sharp from 'sharp';
export async function run(){
 const rows=[];await page.setViewportSize({width:390,height:960});
 for(const theme of ['dark','light']){
  await page.goto('http://127.0.0.1:4173/');await page.evaluate(t=>{localStorage.setItem('tim-theme',t);localStorage.setItem('tim-motion','off')},theme);
  for(const slug of ['xrpcafe','do-androids-dream','parc']){
   await page.goto('http://127.0.0.1:4173/work/'+slug+'/');const b=page.locator('.clip button').first();await b.focus();await page.waitForTimeout(200);const data=await b.evaluate(e=>({r:e.getBoundingClientRect().toJSON(),outline:getComputedStyle(e).outlineColor,bg:getComputedStyle(e).backgroundColor,focused:e.matches(':focus-visible')}));
   const name='media-focus-'+slug+'-'+theme+'.png';await page.screenshot({path:out+name});const {data:pixels,info}=await sharp(out+name).removeAlpha().raw().toBuffer({resolveWithObject:true});const at=(x,y)=>{const i=(Math.round(y)*info.width+Math.round(x))*info.channels;return [...pixels.slice(i,i+3)];};const r=data.r;
   const samples=[];for(let k=.1;k<1;k+=.2){samples.push({side:'top',ring:at(r.x+r.width*k,r.y-4),outside:at(r.x+r.width*k,r.y-5)});samples.push({side:'left',ring:at(r.x-4,r.y+r.height*k),outside:at(r.x-5,r.y+r.height*k)});}
   rows.push({slug,theme,...data,samples,screenshot:name});
  }
 }
 await fs.writeFile(out+'media-focus.json',JSON.stringify(rows,null,2));return rows;
}
