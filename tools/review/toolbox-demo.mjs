// Toolbox landing: the four tool screens (Toolbox 1.2.5) at six widths in both themes (0095). For
// each: the picker selects it by keyboard, its settings change what it shows, its guide link is
// right, nothing overflows, no page errors. Static server on 4173; BASE=http://127.0.0.1:5174
// points it at the dev server, OUT at another folder for the shots.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.BASE||'http://127.0.0.1:4173';
const out=process.env.OUT||'docs/iterations/pixel-v2/30-toolbox-landing/demos';mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});const results=[];
const text=(p,sel)=>p.evaluate(s=>document.querySelector(s)?.textContent||'',sel);
for(const width of [1440,1100,900,700,390,320])for(const theme of ['dark','light']){const c=await b.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await c.addInitScript(t=>{localStorage.setItem('tim-motion','off');localStorage.setItem('tim-theme',t)},theme);const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(`${base}/toolbox/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.locator('.tool-picker button').first().waitFor();
for(const tool of ['Lockup','Palette','Specimen','Convert']){const btn=p.locator('.tool-picker button').filter({hasText:tool});await btn.focus();await p.keyboard.press('Enter');assert.equal(await btn.getAttribute('aria-pressed'),'true');
 await p.waitForFunction(t=>document.querySelector('.demo .demo-readout')?.textContent?.startsWith(t),tool); // the demo loads when picked
 const d=p.locator('.demo'),status=d.locator('.toolbar .status');
 if(tool==='Lockup'){assert.match(await status.innerText(),/^37 files · /);await d.getByRole('button',{name:'PNG',exact:true}).click();assert.match(await status.innerText(),/^28 files/);await d.getByRole('checkbox',{name:'White',exact:true}).focus();await p.keyboard.press('Space');assert.match(await status.innerText(),/^23 files/);
  await d.getByRole('tab',{name:'Review'}).click();assert.match(await d.locator('.demo-readout').innerText(),/Review/i);assert.ok((await d.locator('.tree-row').count())>3);assert.match(await d.locator('.tree').innerText(),/README\.txt/);assert.equal(await d.getByRole('button',{name:'Export…'}).isDisabled(),true);
  await d.getByRole('tab',{name:'Review'}).focus();await p.keyboard.press('ArrowLeft');assert.equal(await d.getByRole('tab',{name:'Outputs'}).getAttribute('aria-selected'),'true');}
 if(tool==='Palette'){await d.getByRole('button',{name:/^Acme\.css$/}).click();assert.match(await d.locator('pre').innerText(),/--color-1: #174c43/);await d.getByRole('button',{name:/^Acme_Swatches\.pdf$/}).click();assert.match(await text(p,'.demo svg.sheet'),/HEX #174C43/);await d.getByRole('checkbox',{name:'Tokens',exact:true}).focus();await p.keyboard.press('Space');assert.equal(await d.locator('.file-row').count(),5);}
 if(tool==='Specimen'){await d.getByRole('combobox',{name:'Font family'}).first().selectOption('Press Start 2P');assert.match(await text(p,'.demo .sheet'),/Press Start 2P Regular/);await d.getByRole('button',{name:'Specimen',exact:true}).click();assert.match(await text(p,'.demo .sheet'),/CHARACTERS/);}
 if(tool==='Convert'){await p.waitForFunction(()=>/kB/.test(document.querySelector('.demo .outs')?.textContent||''),null,{timeout:15000});await d.getByRole('button',{name:'PNG',exact:true}).click();await d.getByRole('button',{name:'1000',exact:true}).click();await p.waitForFunction(()=>/resized to 750×1000/.test(document.querySelector('.demo .stack')?.textContent||''),null,{timeout:15000});await p.waitForFunction(()=>!/—/.test(document.querySelector('.demo .outs')?.textContent||''),null,{timeout:15000});assert.equal(await d.locator('.convert-row').first().locator('.out').count(),3);assert.match(await d.locator('.convert-totals').innerText(),/^2 images, .+ in all$/);}
 assert.equal(await d.locator('.export-note').count(),0);const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${width}/${theme}/${tool} overflow`);assert.equal(await p.getByRole('link',{name:new RegExp('^'+tool+' guide','i')}).getAttribute('href'),`/toolbox/${tool.toLowerCase()}/`);
 assert.equal(errors.length,0,errors.join('\n'));
 if([1440,390,320].includes(width))await p.locator('.tool-showcase').screenshot({path:`${out}/${width}-${theme}-${tool}.png`,style:'.nav-chrome { visibility: hidden !important; }'});results.push({width,theme,tool,overflow,errors});}
 await c.close()}
const nojs=await b.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(`${base}/toolbox/`);assert.equal(await nojs.locator('noscript a').count(),4);await b.close();writeFileSync(`${out}/report.json`,JSON.stringify(results,null,2));console.log('PASS: 48 tool/theme/width states, keyboard selection, live settings, previews and measured sizes; four no-JS links.');
