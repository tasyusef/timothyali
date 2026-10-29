// Toolbox landing: the four tool diagrams (PX-131) at six widths in both themes. For each: the
// picker selects it by keyboard, its count line is the manifest's, its pictures load, its
// download is the real zip (fetched once, at its size), nothing in the diagram runs past it or
// over another part, the page doesn't overflow, its guide link is right, no page errors. Without
// JavaScript: the four links and Lockup's diagram with its download. Static server on 4173;
// BASE=http://127.0.0.1:5174 points it at the dev server, OUT at another folder for the shots.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.BASE||'http://127.0.0.1:4173';
const out=process.env.OUT||'docs/iterations/pixel-v2/131-tool-flows/review';mkdirSync(out,{recursive:true});
const sample=t=>JSON.parse(readFileSync(new URL(`../../src/lib/components/toolbox/${t}-sample.json`,import.meta.url),'utf8'));
const S={Lockup:sample('lockup'),Palette:sample('palette'),Specimen:sample('specimen'),Convert:sample('convert')};
const COUNT={Lockup:`1 logo -> ${S.Lockup.files.length} files`,Palette:`1 poster -> ${S.Palette.files.length} files`,Specimen:`${S.Specimen.roles.length} styles -> 1 sheet`,Convert:`1 poster -> ${S.Convert.outputs.length} formats`};
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});const results=[];
// the diagram's parts: none may run past the row or sit over another (a part and what it holds aside)
const layout=()=>{const row=document.querySelector('.demo .flow-row'),f=row.getBoundingClientRect(),parts=[...row.querySelectorAll('.flow-to, .flow-box, .flow-swatch, .flow-sheet, .flow-poster, .flow-files, .flow-bar, .flow-size, .flow-logo')],r=e=>e.getBoundingClientRect(),n=e=>e.className.toString().split(' ').filter(c=>!/^s-|svelte/.test(c)).join('.');
 const over=parts.filter(e=>r(e).left<f.left-.5||r(e).right>f.right+.5).map(n),hits=[];
 for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){const a=parts[i],c=parts[j];if(a.contains(c)||c.contains(a))continue;const p=r(a),q=r(c);if(p.left<q.right-.5&&q.left<p.right-.5&&p.top<q.bottom-.5&&q.top<p.bottom-.5)hits.push(`${n(a)} × ${n(c)}`)}
 return {over,hits,images:[...document.querySelectorAll('.demo img')].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}};
for(const width of [1440,1100,900,700,390,320])for(const theme of ['dark','light']){const c=await b.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await c.addInitScript(t=>{localStorage.setItem('tim-motion','off');localStorage.setItem('tim-theme',t)},theme);const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(`${base}/toolbox/`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.locator('.tool-picker button').first().waitFor();
for(const tool of ['Lockup','Palette','Specimen','Convert']){const btn=p.locator('.tool-picker button').filter({hasText:tool});await btn.focus();await p.keyboard.press('Enter');assert.equal(await btn.getAttribute('aria-pressed'),'true');
 const count=p.locator('.demo .flow-count');await p.waitForFunction(t=>document.querySelector('.demo .flow-count')?.textContent?.startsWith(t),COUNT[tool]);
 assert.match(await count.locator('.sr-only').textContent(),/^: .+\.$/,`${tool} says what the diagram shows`);
 const get=p.locator('.demo .flow-foot a');assert.equal(await get.getAttribute('href'),S[tool].zip.href);assert.equal(await get.getAttribute('download'),'');assert.match(await get.textContent(),/^Download the zip · \d/);
 if(width===1440&&theme==='dark'){const r=await p.request.get(`${base}${S[tool].zip.href}`);assert.equal(r.status(),200);assert.equal((await r.body()).length,S[tool].zip.bytes,`${tool} zip size`);}
 await p.evaluate(()=>Promise.all([...document.querySelectorAll('.demo img')].map(i=>i.decode().catch(()=>{}))));
 const l=await p.evaluate(layout);assert.deepEqual(l,{over:[],hits:[],images:[]},`${width}/${theme}/${tool} layout`);
 const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,`${width}/${theme}/${tool} overflow`);assert.equal(await p.getByRole('link',{name:new RegExp('^'+tool+' guide','i')}).getAttribute('href'),`/toolbox/${tool.toLowerCase()}/`);
 assert.equal(errors.length,0,errors.join('\n'));
 if([1440,390,320].includes(width))await p.locator('.tool-showcase').screenshot({path:`${out}/${width}-${theme}-${tool}.png`,style:'.nav-chrome { visibility: hidden !important; }'});results.push({width,theme,tool,overflow,errors});}
 await c.close()}
const nojs=await b.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(`${base}/toolbox/`);assert.equal(await nojs.locator('noscript a').count(),4);
 // without JavaScript Lockup's diagram is all there, with its download
 assert.equal(await nojs.locator('.demo .tile').count(),S.Lockup.files.length-1);assert.equal(await nojs.locator('.demo .flow-foot a').getAttribute('href'),S.Lockup.zip.href);await b.close();writeFileSync(`${out}/report.json`,JSON.stringify(results,null,2));console.log('PASS: 48 tool/theme/width states: keyboard selection, count lines, pictures, real downloads, no overflow or overlap; four no-JS links and Lockup\'s diagram without JS.');
