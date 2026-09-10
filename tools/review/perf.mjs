import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const cp=await import('node:child_process'); const proc=cp.spawn('python3',['-m','http.server','4173','--directory','/Users/twocakes/Desktop/PROJECTS/timothyali2/build']); await new Promise(r=>setTimeout(r,800));
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
// measure main-thread busy time over 2s while hovering the hero
const busy=await p.evaluate(async()=>{let frames=0;const t0=performance.now();let last=t0;let longest=0;await new Promise(r=>{const f=()=>{const n=performance.now();longest=Math.max(longest,n-last);last=n;frames++;if(n-t0<2000)requestAnimationFrame(f);else r()};requestAnimationFrame(f)});return {rafFps:+(frames/2).toFixed(1),longestGapMs:+longest.toFixed(1)}});
for(let i=0;i<30;i++){await p.mouse.move(200+i*10,640);await p.waitForTimeout(33)}
await p.screenshot({path:'tools/review/out/interact-30fps.png',clip:{x:0,y:400,width:900,height:400}});
console.log(JSON.stringify({busy,errors:errs}));
await b.close(); proc.kill();
