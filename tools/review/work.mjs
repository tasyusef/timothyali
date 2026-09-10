// Captures of the Work index and the four case studies at 1440 and 390, with overflow/error checks,
// the title width, the video element dimensions and the state of every PixVideo canvas.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const out='tools/review/out/';
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
const paths=['/work/','/work/parc/','/work/xrpcafe/','/work/firstledger/','/work/do-androids-dream/','/work/firststrike/','/work/sonde/','/work/parc-site/','/work/jade-aesthetics/','/work/pocketwatch/'];
for(const width of [1440,900,390]){for(const path of paths){
  if(width===900&&path!=='/work/firstledger/')continue;
  const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await p.goto('http://localhost:4173'+path,{waitUntil:'networkidle'});await p.waitForTimeout(2500);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<h;y+=600){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(120)}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(1500);
  const name=path.replaceAll('/','').replace(/^work/,'work-').replace(/-$/,'');await p.screenshot({path:`${out}${width}-${name}.png`,fullPage:true});
  const info=await p.evaluate(()=>{const t=document.querySelector('.title');const r=t?.getBoundingClientRect();const vids=[...document.querySelectorAll('figure.clip')].map(f=>{const v=f.querySelector('video');return {vw:v.videoWidth,vh:v.videoHeight,paused:v.paused,ready:v.readyState,box:Math.round(f.getBoundingClientRect().width)+'x'+Math.round(f.getBoundingClientRect().height)}});const imgs=[...document.querySelectorAll('figure.pic:not(.clip) img')];return {height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,title:r?{w:Math.round(r.width),h:Math.round(r.height)}:null,path:document.querySelector('.path')?.textContent,vids,images:imgs.length,imagesReady:imgs.filter(i=>i.complete&&i.naturalWidth>0).length,current:imgs.slice(0,3).map(i=>i.currentSrc.split('/').pop()),broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'))}});
  console.log('CAPTURE',width,path,JSON.stringify(info),'errors',errors.length,errors.slice(0,3).join(' | '));await ctx.close();
}}
await b.close();
