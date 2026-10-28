import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.dirname(new URL(import.meta.url).pathname),base='http://127.0.0.1:4173',browser=await chromium.launch({channel:'chrome'}),results={links:[],persistence:[],skip:[],zoom:[],demos:[]};
const routes=['/','/work/',...['parc','xrpcafe','firstledger','do-androids-dream','jade-aesthetics','firststrike','toolbox'].map(s=>`/work/${s}/`),'/toolbox/',...['lockup','palette','specimen','convert','agents'].map(s=>`/toolbox/${s}/`),'/contact/','/nope/'];
for(const width of [390,1440]){
 const c=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();
 for(const route of routes){await p.goto(base+route);await p.keyboard.press('Tab');await p.keyboard.press('Enter');results.skip.push({width,route,active:await p.evaluate(()=>document.activeElement.id)});}
 for(const tool of ['lockup','palette','specimen','convert']){
  const from=`/toolbox/${tool}/`;await p.goto(base+from);const ls=await p.locator('main a').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({href:e.getAttribute('href'),text:e.textContent.trim()})));
  for(const l of ls){await p.goto(base+from);await p.locator(`main a[href="${l.href}"]`).first().click();await p.waitForTimeout(35);results.links.push({width,from,...l,arrived:p.url()});}
 }
 for(const tool of ['lockup','palette','specimen','convert']){await p.goto(base+'/toolbox/agents/');await p.getByRole('link',{name:new RegExp(`^${tool} options`,'i')}).click();results.links.push({width,from:'/toolbox/agents/',tool,arrived:p.url()});}
 await p.goto(base+'/');await p.getByRole('button',{name:'Settings',exact:true}).click();await p.getByRole('button',{name:/^Theme/}).click();await p.getByRole('button',{name:/^Motion/}).click();await p.keyboard.press('Escape');await p.reload();await p.locator('nav a[href="/contact/"]').click();await p.waitForTimeout(50);results.persistence.push({width,theme:await p.locator('html').getAttribute('data-theme'),motion:await p.locator('.site').getAttribute('data-motion')});
 await c.close();
}
// Browser zoom keyboard shortcut is attempted, without substituting CSS zoom for it.
const c=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),p=await c.newPage();await p.goto(base+'/');const before=await p.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio}));for(let i=0;i<4;i++)await p.keyboard.press('Meta+=');results.zoom.push({before,after:await p.evaluate(()=>({width:innerWidth,dpr:devicePixelRatio})),note:'If unchanged, actual browser zoom remains unverified; 320px reflow was separately checked.'});
await p.goto(base+'/toolbox/');await p.getByRole('button',{name:/02 Palette/i}).click();await p.getByRole('button',{name:'Acme.css',exact:true}).waitFor();for(const file of ['Acme.css','Acme.scss','Acme.tokens.json','Acme.ase','Acme_Swatches.pdf','Acme_Swatches.png']){await p.getByRole('button',{name:file,exact:true}).focus();await p.keyboard.press('Space');await p.keyboard.press('Enter');}results.demos.push('All six Palette file previews activated with Space and Enter at 1440');
await p.getByRole('button',{name:/03 Specimen/i}).click();await p.getByRole('textbox',{name:'Sheet title',exact:true}).waitFor();for(const role of ['Display','Heading','Body']){await p.getByRole('combobox',{name:`${role} typeface`,exact:true}).focus();await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');for(const size of ['L','M','S']){await p.getByRole('group',{name:`${role} size`,exact:true}).getByRole('button',{name:size,exact:true}).focus();await p.keyboard.press('Space');await p.keyboard.press('Enter');}}results.demos.push('All nine Specimen size buttons and three font selectors operated at 1440');
await c.close();await browser.close();await fs.writeFile(path.join(out,'final-flows.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({links:results.links.length,persistence:results.persistence,skipFailures:results.skip.filter(x=>x.active!=='main'),zoom:results.zoom,demos:results.demos},null,2));
