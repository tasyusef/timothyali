import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const stage=process.argv[2]||'after';
const out='docs/iterations/pixel-v2/22-home-work-footer';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const report=[];
for(const width of [1440,900,700,390,320]) for(const theme of ['dark','light']) {
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.addInitScript(({theme})=>{localStorage.setItem('tim-motion','off');localStorage.setItem('tim-theme',theme)}, {theme});
 const page=await context.newPage(); const errors=[];
 page.on('pageerror', e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4173/');await page.evaluate(()=>document.fonts.ready);
 await page.locator('.global-footer').scrollIntoViewIfNeeded();await page.locator('.cards img').last().waitFor();
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
 await page.addStyleTag({content:'.nav-chrome{visibility:hidden}'});
 await page.waitForTimeout(350);
 for(const [name,sel] of [['work','.work-index'],['invitation','.invitation'],['footer','.global-footer']]) await page.locator(sel).screenshot({path:`${out}/${stage}-${width}-${theme}-${name}.png`});
 report.push({width,theme,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,links:[...document.querySelectorAll('.card')].map(a=>a.getAttribute('href')),images:[...document.querySelectorAll('.cards img')].every(i=>i.complete&&i.naturalWidth>0)}))});
 await context.close();
}
writeFileSync(`${out}/${stage}-report.json`,JSON.stringify(report,null,2));await browser.close();
console.log(report);
