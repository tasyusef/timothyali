import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { PNG } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/pngjs/lib/png.js';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:4173/',{waitUntil:'networkidle'}); await p.waitForTimeout(2000);
const dark=(x)=>x[0]<60&&x[1]<60&&x[2]<60;
async function darkPixelsInHero(){const png=PNG.sync.read(await p.screenshot({clip:{x:900,y:100,width:500,height:300}}));let d=0,t=0;for(let i=0;i<png.data.length;i+=4){t++;if(dark([png.data[i],png.data[i+1],png.data[i+2]]))d++}return +(100*d/t).toFixed(1)}
console.log('dark theme: % dark pixels in hero texture region', await darkPixelsInHero());
await p.click('button:has-text("Theme")'); await p.waitForTimeout(600);
console.log('after toggle to light: % dark pixels (texture should now be dark marks on light)', await darkPixelsInHero());
await p.screenshot({path:'tools/review/out/toggled-light.png',clip:{x:0,y:0,width:1440,height:900}});
await b.close();
