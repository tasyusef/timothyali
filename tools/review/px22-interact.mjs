import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage({viewport:{width:320,height:900},reducedMotion:'reduce'});const report=[];
await p.goto('http://127.0.0.1:4173/');await p.evaluate(()=>document.fonts.ready);
for(const width of [320,375,390,420,700,701,768,900,1100,1200,1440]) {
 await p.setViewportSize({width,height:900});await p.waitForTimeout(150);
 report.push(await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,outside:[...document.querySelectorAll('h2,h3,.who .display,.card,.global-footer,.global-footer span,.global-footer button')].filter(e=>{const r=e.getBoundingClientRect();return r.width && (r.right>innerWidth||r.left<0)}).map(e=>({tag:e.tagName,class:e.className,text:e.textContent,box:e.getBoundingClientRect().toJSON()}))})));
}
for(const name of ['Motion','Grid','Theme']) {
 const btn=p.getByRole('button',{name:new RegExp(name)});const before=await btn.getAttribute('aria-pressed');
 await btn.focus();await p.keyboard.press('Enter');const after=await btn.getAttribute('aria-pressed');
 await p.reload();const persisted=await p.getByRole('button',{name:new RegExp(name)}).getAttribute('aria-pressed');
 report.push({control:name,before,after,persisted,pass:before!==after&&after===persisted});
}
await p.getByRole('button',{name:/Motion/}).click();await p.getByRole('button',{name:/Grid/}).click();
await p.locator('.card').first().focus();await p.locator('.card').first().screenshot({path:'docs/iterations/pixel-v2/22-home-work-footer/focus-card.png'});
await p.keyboard.press('Enter');await p.waitForURL('**/work/parc/');report.push({navigation:p.url()});
await p.goto('http://127.0.0.1:4173/');await p.getByRole('link',{name:'All work',exact:true}).click();await p.waitForURL('**/work/');report.push({navigation:p.url()});
await p.goto('http://127.0.0.1:4173/');await p.getByRole('link',{name:'Get in touch',exact:true}).click();await p.waitForURL('**/contact/');report.push({navigation:p.url()});
console.log(JSON.stringify(report,null,2));writeFileSync('docs/iterations/pixel-v2/22-home-work-footer/interaction-report.json',JSON.stringify(report,null,2));await b.close();
