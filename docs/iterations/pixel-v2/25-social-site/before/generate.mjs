// Deterministic terminal posters using the site's fonts, glyphs and covers.
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { studies, projects } from '../../src/lib/work.ts';
import { INK, WHITE, YELLOW } from '../../src/lib/tokens.ts';
import { GLYPHS } from '../../src/lib/glyphs.ts';
const cached='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:existsSync(cached)?{executablePath:cached}:{});
const page=await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
const data=(path,mime)=>`data:${mime};base64,${readFileSync(path).toString('base64')}`;
const font=(name,path)=>`@font-face{font-family:${name};src:url('${data(path,'font/woff2')}')}`;
const fonts=font('Jacquard','node_modules/@fontsource/jacquard-24/files/jacquard-24-latin-400-normal.woff2')+font('Parc','static/fonts/parc-pixel-bold.woff2')+font('Label','static/fonts/parc-pixel.woff2')+font('Mono','node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const pic=p=>data(`static${p.cover.src}`,p.cover.src.endsWith('.png')?'image/png':'image/jpeg');
let texture='';const chars='.:=-+*#01';
for(let col=0;col<75;col++){if((col*17)%11>4)continue;for(let row=0;row<40;row++){if((row+col*3)%29>21)continue;const g=GLYPHS[chars[(row*3+col*7)%chars.length]];g.forEach((bits,y)=>{for(let x=0;x<5;x++)if(bits&(1<<(4-x)))texture+=`<rect x="${col*16+x*2}" y="${row*16+y*2}" width="2" height="2"/>`})}}
const css=`${fonts}*{box-sizing:border-box}body{margin:0;background:${INK};color:${WHITE};font-synthesis:none;-webkit-font-smoothing:none}main{width:1200px;height:630px;position:relative;overflow:hidden;isolation:isolate}.texture{position:absolute;inset:0;opacity:.45;z-index:-1}header{position:absolute;left:0;right:0;top:0;height:80px;background:${INK};padding:16px 32px;display:flex;justify-content:space-between;align-items:center}.wordmark{font:43px/48px Jacquard}.mono{font:16px/24px Mono;text-transform:uppercase}.label{font:25px/32px Label;text-transform:uppercase}.status{position:absolute;bottom:0;left:0;right:0;height:54px;background:${YELLOW};color:${INK};padding:16px 32px;display:flex;justify-content:space-between;font:16px/24px Mono;text-transform:uppercase}.plate{background:${INK};box-shadow:8px 0 ${INK},-8px 0 ${INK};box-decoration-break:clone;-webkit-box-decoration-break:clone}.blackletter{font:344px/344px Jacquard;margin:0}.display{font:55px/64px Parc;text-transform:uppercase;margin:0}.cursor{display:inline-block;width:32px;height:96px;background:${YELLOW};margin-left:24px}.home{position:absolute;left:32px;top:80px}.home p{margin:0;font:55px/64px Parc;text-transform:uppercase}.work-title{position:absolute;left:32px;top:120px}.work-title .blackletter{font-size:258px;line-height:280px;margin-top:32px}.collage{position:absolute;right:32px;top:168px;display:grid;grid-template-columns:256px 256px;gap:16px}.collage img{width:256px;height:144px;object-fit:cover}.contact{position:absolute;top:104px;left:32px;right:32px}.contact .display{font-size:82.5px;line-height:88px}.contact .blackletter{font-size:344px;line-height:344px;text-align:right;margin-top:-48px}.study-title{position:absolute;z-index:2;left:32px;top:104px;width:1136px;margin:0;font:82.5px/88px Parc;text-transform:uppercase}.cover{position:absolute;right:32px;bottom:78px;width:608px;height:342px;object-fit:contain;background:${INK}}.study-meta{position:absolute;left:32px;top:368px;width:480px}.study-meta p{margin:0 0 16px}.study-meta .label{font-size:18.75px;line-height:32px}.study-meta .year{font:16px/24px Mono}.index{color:${YELLOW};font:32px/40px Mono;margin-bottom:16px}.work-range{position:absolute;left:32px;bottom:96px;color:${YELLOW};font:25px/32px Label}`;
const records=[{id:'home'},{id:'work'},{id:'contact'},...studies.map(p=>({id:p.slug,p}))];
mkdirSync('static/og',{recursive:true});const report=[];
for(const r of records){
 let content='';
 if(r.id==='home')content='<div class="home"><h1 class="blackletter"><span class="plate">i’m tim.</span><span class="cursor"></span></h1><p><span class="plate">Designer for teams<br>that don’t have one yet.</span></p></div>';
 else if(r.id==='work')content=`<div class="work-title"><h1 class="display"><span class="plate">Selected</span></h1><p class="blackletter"><span class="plate">work.</span></p></div><div class="collage">${projects.map(p=>`<img src="${pic(p)}" alt="">`).join('')}</div><div class="work-range"><span class="plate">[01—04]</span></div>`;
 else if(r.id==='contact')content='<div class="contact"><h1 class="display"><span class="plate">Tell me what<br>you’re</span></h1><p class="blackletter"><span class="plate">building.</span></p></div>';
 else content=`<img class="cover" src="${pic(r.p)}" alt=""><h1 class="study-title"><span class="plate">${esc(r.p.title)}</span></h1><div class="study-meta"><div class="index"><span class="plate">[${r.p.n}]</span></div><p class="label"><span class="plate">${esc(r.p.scope)}</span></p><p class="year"><span class="plate">${esc(r.p.year)}</span></p></div>`;
 const path=r.p?'~/work/'+r.p.slug:r.id==='home'?'~/tim/index':'~/tim/'+r.id;
 await page.setContent(`<style>${css}</style><main><svg class="texture" width="1200" height="630" fill="${WHITE}">${texture}</svg><header><span class="wordmark">timothy ali</span><span class="mono">${r.p?'Work / '+r.p.n:r.id==='contact'?'Get in touch':'Brand / Product / Motion'}</span></header>${content}<footer class="status"><span>${path}</span><span>${r.p?'View case study ->':r.id==='contact'?'Let’s talk ->':'timothyali.com'}</span></footer></main>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
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
mkdirSync('docs/iterations/pixel-v2/24-social-terminal',{recursive:true});writeFileSync('docs/iterations/pixel-v2/24-social-terminal/assets.json',JSON.stringify(report,null,2));
await b.close();console.log(report);
