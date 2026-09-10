// Deterministic typography and existing covers; no web service or runtime renderer.
// Run from project root with Node 22.18+ (native TypeScript stripping).
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { studies, projects } from '../../src/lib/work.ts';
import { INK, WHITE, YELLOW } from '../../src/lib/tokens.ts';
const cached='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:existsSync(cached)?{executablePath:cached}:{});
const page=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
const data=(path,mime)=>`data:${mime};base64,${readFileSync(path).toString('base64')}`;
const font=(name,path)=>`@font-face{font-family:${name};src:url('${data(path,'font/woff2')}')}`;
const fonts=font('Jacquard','node_modules/@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2')+font('Parc','static/fonts/parc-pixel-bold.woff2')+font('Label','static/fonts/parc-pixel.woff2');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const pic=p=>data(`static${p.cover.src}`,p.cover.src.endsWith('.png')?'image/png':'image/jpeg');
let texture='';for(let y=0;y<630;y+=16)for(let x=0;x<1200;x+=16){if((x*7+y*13)%97<12)texture+=`<rect x="${x}" y="${y}" width="4" height="4"/>`;}
const css=`${fonts}*{box-sizing:border-box}body{margin:0;background:${INK};color:${WHITE};font-synthesis:none;-webkit-font-smoothing:none}main{width:1200px;height:630px;position:relative;padding:48px;overflow:hidden}.texture{position:absolute;inset:0;opacity:.22;z-index:-1}header,footer{position:absolute;left:48px;right:48px;display:flex;justify-content:space-between;align-items:center}header{top:40px}footer{bottom:38px}.wordmark{font:43px/48px Jacquard}.label{font:12.5px/16px Label;text-transform:uppercase}.tag{background:${YELLOW};color:${INK};padding:8px 16px}.display{font:55px/64px Parc;text-transform:uppercase;margin:0}.blackletter{font:258px/258px Jacquard;margin:0}.home{position:absolute;left:48px;top:128px}.home p{font:41.25px/48px Parc;text-transform:uppercase;max-width:980px;margin:8px 0}.cursor{display:inline-block;width:24px;height:64px;background:${YELLOW};margin-left:24px}.split{position:absolute;left:48px;right:48px;top:144px;display:grid;grid-template-columns:368px 704px;gap:32px;align-items:center;height:368px}.split h1{font:41.25px/48px Parc;text-transform:uppercase;margin:16px 0;overflow-wrap:normal}.cover{width:704px;height:396px;object-fit:contain;background:${INK}}.collage{display:grid;grid-template-columns:344px 344px;gap:16px}.collage img{width:344px;height:194px;object-fit:cover}.contact{position:absolute;top:152px;left:48px;right:48px}.contact .blackletter{text-align:right;margin-top:16px}.plate{background:${INK}}`;
const records=[{id:'home'},{id:'work'},{id:'contact'},...studies.map(p=>({id:p.slug,p}))];
mkdirSync('static/og',{recursive:true});const report=[];
for(const r of records){
 let content='';
 if(r.id==='home') content='<div class="home"><h1 class="blackletter">i’m tim.<span class="cursor"></span></h1><p class="plate">Designer for teams<br>that don’t have one yet.</p></div>';
 else if(r.id==='work')content=`<div class="split"><h1 class="display plate">Selected<br>work</h1><div class="collage">${projects.map(p=>`<img src="${pic(p)}" alt="">`).join('')}</div></div>`;
 else if(r.id==='contact') content='<div class="contact"><h1 class="display plate">Tell me what<br>you’re</h1><p class="blackletter">building.</p></div>';
 else content=`<div class="split"><div class="plate"><span class="label">${esc(r.p.scope)}</span><h1>${esc(r.p.title)}</h1><span class="label">${esc(r.p.year)}</span></div><img class="cover" src="${pic(r.p)}" alt=""></div>`;
 await page.setContent(`<style>${css}</style><main style="isolation:isolate"><svg class="texture" width="1200" height="630" fill="${WHITE}">${texture}</svg><header><span class="wordmark">timothy ali</span><span class="tag label">${r.p?'Work / '+r.p.n:r.id==='contact'?'Get in touch':'Brand · Product · Motion'}</span></header>${content}<footer class="label"><span>timothyali.com</span><span>${r.p?'View case study':r.id==='work'?'Selected work / 01–04':'A little human. A little machine.'}</span></footer></main>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));const h=document.querySelector('.split h1');if(h){const probe=document.createElement('span');probe.style.cssText='position:absolute;white-space:nowrap;font:'+getComputedStyle(h).font;probe.textContent=h.innerText.split(/\s/).sort((a,b)=>b.length-a.length)[0];document.body.append(probe);if(probe.getBoundingClientRect().width>368){h.style.fontSize='27.5px';h.style.lineHeight='32px'}probe.remove()}});
 await page.screenshot({path:`static/og/${r.id}.png`});
 report.push({image:r.id,width:1200,height:630,bytes:readFileSync(`static/og/${r.id}.png`).length});
}
// Extract the actual Jacquard T as a one-pixel bitmap; SVG has no font dependency.
const glyph=await page.evaluate(async()=>{await document.fonts.load('43px Jacquard');const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');ctx.font='43px Jacquard';ctx.fillStyle='#fff';ctx.fillText('T',0,48);const d=ctx.getImageData(0,0,64,64).data;const points=[];for(let y=0;y<64;y++)for(let x=0;x<64;x++)if(d[(y*64+x)*4+3]>127)points.push([x,y]);return points});
const minX=Math.min(...glyph.map(p=>p[0])),minY=Math.min(...glyph.map(p=>p[1]));
const gw=Math.max(...glyph.map(p=>p[0]))-minX+1,gh=Math.max(...glyph.map(p=>p[1]))-minY+1;
const gx=Math.floor((32-gw)/2),gy=Math.floor((32-gh)/2);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect width="32" height="32" fill="${YELLOW}"/><g fill="${INK}">${glyph.map(([x,y])=>`<rect x="${x-minX+gx}" y="${y-minY+gy}" width="1" height="1"/>`).join('')}</g></svg>`;
writeFileSync('static/favicon.svg',svg);
const pngs=[];
for(const size of [16,32,48,180]){await page.setViewportSize({width:size,height:size});await page.setContent(`<style>body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);const png=await page.screenshot();writeFileSync(size===180?'static/apple-touch-icon.png':`static/favicon-${size}.png`,png);if(size!==180)pngs.push({size,png})}
const head=Buffer.alloc(6+16*pngs.length);head.writeUInt16LE(1,2);head.writeUInt16LE(pngs.length,4);let offset=head.length;
pngs.forEach(({size,png},i)=>{const p=6+i*16;head[p]=size;head[p+1]=size;head.writeUInt16LE(1,p+4);head.writeUInt16LE(32,p+6);head.writeUInt32LE(png.length,p+8);head.writeUInt32LE(offset,p+12);offset+=png.length});writeFileSync('static/favicon.ico',Buffer.concat([head,...pngs.map(x=>x.png)]));
mkdirSync('docs/iterations/pixel-v2/23-social',{recursive:true});writeFileSync('docs/iterations/pixel-v2/23-social/assets.json',JSON.stringify(report,null,2));
await b.close();console.log(report);
