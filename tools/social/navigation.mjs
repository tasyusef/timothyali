import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {projects} from '../../src/lib/work.ts';
// the first Home card, whichever project leads the selected four (0132)
const first=projects[0].slug;
const b=await chromium.launch({executablePath:'/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e)));
await p.goto('http://127.0.0.1:4173/');
assert.match(await p.locator('meta[property="og:image"]').getAttribute('content'),/home.png$/);
await p.locator('.card').first().click();await p.waitForURL(`**/work/${first}/`);
// the URL changes before the head does; wait for the study's own image rather than racing it
await p.waitForFunction((f)=>document.querySelector('meta[property="og:image"]')?.content.endsWith(`work-${f}.png`),first,{timeout:5000});
assert.equal(await p.locator('meta[property="og:image"]').count(),1);assert.match(await p.locator('meta[property="og:image"]').getAttribute('content'),new RegExp(`work-${first}.png$`));
await p.locator('nav a[href="/contact/"]').click();await p.waitForURL('**/contact/');await p.waitForFunction(()=>document.querySelector('meta[property="og:image"]')?.content.endsWith('contact.png'),null,{timeout:5000});assert.match(await p.locator('meta[property="og:image"]').getAttribute('content'),/contact.png$/);
for(const asset of ['favicon.svg','favicon.ico','apple-touch-icon.png','og/home.png',`og/work-${first}.png`])assert.equal((await p.request.get(`http://127.0.0.1:4173/${asset}`)).status(),200);
assert.deepEqual(errors,[]);writeFileSync('docs/iterations/pixel-v2/23-social/navigation.json',JSON.stringify({pass:true,errors,checks:'Client navigation Home → first card → Contact updates a single OG image; favicon and PNG assets return HTTP 200.'},null,2));await b.close();
