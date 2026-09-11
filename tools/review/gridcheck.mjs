import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { PNG } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/pngjs/lib/png.js';
import fs from 'node:fs';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch(fs.existsSync(exe)?{executablePath:exe}:{});
const near=(a,b)=>Math.abs(a[0]-b[0])<12&&Math.abs(a[1]-b[1])<12&&Math.abs(a[2]-b[2])<12; const Y=[244,244,240],K=[17,17,14],A=[242,214,0];
const ROUTES=['/','/work/','/contact/','/work/parc/','/work/xrpcafe/','/work/firstledger/','/work/do-androids-dream/','/work/firststrike/','/work/sonde/','/work/parc-site/','/work/jade-aesthetics/','/work/pocketwatch/','/not-found.html'];
const ALL={};
for(const width of [1440,1100,700,390]){ for(const path of ROUTES){
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}); const p=await ctx.newPage();
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{
    const sy=window.scrollY,sx=window.scrollX; const out={canvas:[],fractional:[],fontSizes:{},spacing:[]};
    document.querySelectorAll('canvas').forEach(c=>{const r=c.getBoundingClientRect(); const host=c.parentElement; const cell=host.classList.contains('ascii')?16:(host.classList.contains('pix')?2:8); const x=r.left+sx,y=r.top+sy; out.canvas.push({host:host.className,cell,x,y,w:r.width,h:r.height,okX:Math.abs(x/cell-Math.round(x/cell))<1e-6,okY:Math.abs(y/cell-Math.round(y/cell))<1e-6});});
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT); let n; const table={'Jacquard 24':43,'Jersey 25':41,'Jersey 15':27,'Silkscreen':8,'Press Start 2P':8,'PARC Pixel Web':6.25,'PARC Pixel Bold Web':13.75};
    const props=['paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','rowGap','columnGap'];
    const seen={};
    while((n=walker.nextNode())){
      const cs=getComputedStyle(n); if(cs.display==='none')continue;
      // spacing check for every element
      for(const pr of props){ const v=cs[pr]; if(!v||v==='normal'||v==='auto')continue; const f=parseFloat(v); if(!f)continue; if(Math.abs(f/8-Math.round(f/8))>1e-6){ const key=n.tagName+'|'+n.className+'|'+pr+'|'+f; if(seen[key])continue; seen[key]=1; out.spacing.push({tag:n.tagName,cls:String(n.className),prop:pr,value:f}); } }
      if(!n.childNodes.length||![...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim()))continue; if(cs.visibility==='hidden'||n.classList.contains('sr-only'))continue; const r=n.getBoundingClientRect(); const fam=cs.fontFamily.split(',')[0].replace(/['"]/g,'').trim(); const fs=parseFloat(cs.fontSize); const cellsPerEm=table[fam]; const onTable=cellsPerEm?Number.isInteger(+(fs/cellsPerEm).toFixed(6)):null; const key=fam+' '+fs; out.fontSizes[key]=(out.fontSizes[key]||0)+1; if(onTable===false)out.fractional.push({tag:n.tagName,cls:String(n.className),fam,fs,reason:'size not on cell table'}); if(onTable===null)out.fractional.push({tag:n.tagName,cls:String(n.className),fam,fs,reason:'family not in table'}); if(Math.abs((r.top+sy)-Math.round(r.top+sy))>1e-6||Math.abs((r.left+sx)-Math.round(r.left+sx))>1e-6)out.fractional.push({tag:n.tagName,cls:String(n.className),top:r.top+sy,left:r.left+sx,reason:'fractional box origin'}); }
    return out; });
  const badCanvas=r.canvas.filter(c=>!c.okX||!c.okY);
  ALL[width+' '+path]={fontSizes:r.fontSizes,canvases:r.canvas.length,badCanvas,fractional:r.fractional,spacing:r.spacing};
  console.log(`\n== ${width} ${path}`); console.log('font sizes in use:',JSON.stringify(r.fontSizes)); console.log('canvases:',r.canvas.length,'misaligned:',JSON.stringify(badCanvas)); console.log('fractional/off-table text boxes:',r.fractional.length,JSON.stringify(r.fractional)); console.log('non-8px spacing:',r.spacing.length,JSON.stringify(r.spacing));
  if(path==='/'){ const rep={}; for(const [k,sel] of Object.entries({hero:'.hero-name',who:'.who h2',body:'.who .body',cards:'.card h3',invite:'.invitation h2'})){ const el=await p.$(sel); if(!el)continue; await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const png=PNG.sync.read(await el.screenshot()); let mid=0,tot=0; for(let i=0;i<png.data.length;i+=4){const px=[png.data[i],png.data[i+1],png.data[i+2]];tot++;if(!near(px,Y)&&!near(px,K)&&!near(px,A))mid++;} rep[k]=+(100*mid/tot).toFixed(2);} console.log('intermediate px % (0 = crisp):',JSON.stringify(rep)); ALL[width+' '+path].crisp=rep; }
  await ctx.close(); }}
await b.close();
fs.writeFileSync(process.argv[2]||'/dev/null',JSON.stringify(ALL,null,1));
