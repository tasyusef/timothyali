import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const cp=await import('node:child_process'); const proc=cp.spawn('python3',['-m','http.server','4173','--directory','/Users/twocakes/Desktop/PROJECTS/timothyali2/build']); await new Promise(r=>setTimeout(r,800));
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const el=await p.$('.quality-grid'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
const bb=await el.boundingBox(); await p.screenshot({path:'tools/review/out/diagram.png',clip:{x:bb.x-64,y:bb.y-32,width:bb.width+128,height:bb.height+64}});
await b.close(); proc.kill();
