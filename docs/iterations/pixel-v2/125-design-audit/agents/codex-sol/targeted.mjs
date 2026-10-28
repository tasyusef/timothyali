import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.dirname(new URL(import.meta.url).pathname),base='http://127.0.0.1:4173',browser=await chromium.launch({channel:'chrome'}),results={phone:[],detail:[],palette:[],specimen:[],contrast:[],motion:[]};
const c=await browser.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});const p=await c.newPage();await p.goto(base+'/toolbox/');
for(const width of [320,390,420,700,900,1100,1440]){await p.setViewportSize({width,height:900});await p.waitForTimeout(50);results.phone.push({width,...await p.evaluate(()=>({innerWidth,sw:document.documentElement.scrollWidth,over:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>1}).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,70),right:e.getBoundingClientRect().right})).slice(0,12)}))});}
await p.setViewportSize({width:390,height:900});
await p.evaluate(()=>{
 window.auditShare=[];
 if(navigator.share){
  const original=navigator.share.bind(navigator);
  navigator.share=async args=>{window.auditShare.push({args});try{const v=await original(args);window.auditShare.push({ok:true});return v;}catch(e){window.auditShare.push({error:e.name,message:e.message});throw e;}};
 }
});
await p.getByRole('button',{name:/Send the link to your computer/}).click();await p.waitForTimeout(300);results.phone.push({share:await p.evaluate(()=>({available:typeof navigator.share,log:window.auditShare})),label:await p.locator('.on-phone .send').innerText(),clipboard:await p.evaluate(()=>navigator.clipboard.readText())});
await p.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});});await p.getByRole('button',{name:/Send the link to your computer/}).click();await p.waitForTimeout(150);results.phone.push({fallback:true,label:await p.locator('.on-phone .send').innerText(),clipboard:await p.evaluate(()=>navigator.clipboard.readText())});await p.screenshot({path:path.join(out,'phone-link-copied-390.png')});
await p.goto(base+'/toolbox/');await p.locator('.on-phone').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'phone-cta-overflow-390.png')});
// Wait for the selected lazy-loaded demo, then operate every additional stateful control.
await p.getByRole('button',{name:/02 Palette/i}).click();await p.getByRole('textbox',{name:'Palette name',exact:true}).waitFor();await p.waitForTimeout(150);
for(const file of ['Acme.css','Acme.scss','Acme.tokens.json','Acme.ase','Acme_Swatches.pdf','Acme_Swatches.png']){const l=p.getByRole('button',{name:file,exact:true});await l.focus();await p.keyboard.press('Enter');results.palette.push({file,pressed:await l.getAttribute('aria-pressed'),stage:await p.locator('.demo .stage').innerText()});await p.keyboard.press('Space');}
await p.getByRole('button',{name:/03 Specimen/i}).click();await p.getByRole('textbox',{name:'Sheet title',exact:true}).waitFor();await p.getByRole('textbox',{name:'Sheet title',exact:true}).fill('Audit sheet');await p.getByRole('textbox',{name:'Sample line',exact:true}).fill('Make something good.');
for(const role of ['Display','Heading','Body']){const s=p.getByRole('combobox',{name:`${role} typeface`,exact:true});await s.focus();await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');for(const size of ['L','M','S']){const b=p.getByRole('group',{name:`${role} size`,exact:true}).getByRole('button',{name:size,exact:true});await b.focus();await p.keyboard.press('Space');results.specimen.push({role,size,pressed:await b.getAttribute('aria-pressed')});}}
await p.getByRole('button',{name:'Specimen',exact:true}).focus();await p.keyboard.press('Enter');await p.getByRole('combobox',{name:'Family',exact:true}).focus();await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');await p.screenshot({path:path.join(out,'specimen-keyboard-390.png')});
await c.close();
// Measure rendered contrast numerically. No color changes are applied.
const lum=a=>a.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
results.contrast=[{fg:'#f2d600',bg:'#efefeb',ratio:ratio([242,214,0],[239,239,235]),use:'dark-theme panel focus ring'},{fg:'#6f6200',bg:'#181814',ratio:ratio([111,98,0],[24,24,20]),use:'light-theme panel focus ring'},{fg:'#6f6200',bg:'#efefeb',ratio:ratio([111,98,0],[239,239,235]),use:'intended dark-theme panel focus ring'},{fg:'#f2d600',bg:'#181814',ratio:ratio([242,214,0],[24,24,20]),use:'intended light-theme panel focus ring'}];
for(const reduce of ['reduce','no-preference']){const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:reduce});const p=await c.newPage();await p.goto(base+'/');await p.getByRole('button',{name:'Settings',exact:true}).click();const theme=p.getByRole('button',{name:/^Theme/});await theme.click();await p.waitForTimeout(15);const animations=await p.evaluate(()=>document.getAnimations().map(a=>({type:a.constructor.name,name:a.animationName,playState:a.playState,rate:a.playbackRate})));await p.evaluate(()=>document.getAnimations().forEach(a=>a.updatePlaybackRate(.1)));await p.screenshot({path:path.join(out,`theme-slow-${reduce}-1440.png`)});results.motion.push({reduce,animations});await c.close();}
await browser.close();await fs.writeFile(path.join(out,'targeted.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({phone:results.phone,contrast:results.contrast,palette:results.palette.length,specimen:results.specimen.length},null,2));
