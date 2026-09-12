// Every button-like element on every route: is the type's ink centred in its box? The
// element is screenshotted at 1×, the pixels near its computed colour are the ink, and
// the gaps above and below (and left and right, for chips and blocks) are compared.
// A bitmap face sits at a fixed offset in its line box, so equal padding is not enough.
// Dev server on 5173. `node tools/review/buttons.mjs [width]`
import {chromium} from '@playwright/test';
import {PNG} from 'pngjs';
const width=Number(process.argv[2]||1440);
const only=process.argv[3]||null; // a selector to measure instead, e.g. '.mono' for the arrows alone
const exe='/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const b=await chromium.launch({executablePath:exe});
const routes=['/','/work/','/work/parc/','/contact/','/toolbox/','/toolbox/lockup/','/toolbox/agents/','/not-found/'];
const SEL='button, a.cta, .cta, .cta-row, .cta-hint, .cta-quiet, .chip, .btn, .file-row, .quiet-link, .site-header nav a, .status, .tree-row, .switch';
const parse=(s)=>{const m=s.match(/\d+/g).map(Number);return m};
let bad=0, total=0;
for(const path of routes){
  const ctx=await b.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  await ctx.addInitScript(()=>{localStorage.setItem('tim-motion','off')});
  const p=await ctx.newPage();await p.goto('http://localhost:5173'+path,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
  // the four toolbox screens, one after another
  const passes=path==='/toolbox/'?['Lockup','Palette','Specimen','Convert']:[null];
  for(const tool of passes){
    if(tool){await p.locator('.tool-picker button').filter({hasText:tool}).click();await p.waitForTimeout(tool==='Convert'?2500:300);}
    const S=only||SEL;const n=await p.locator(S).count();
    for(let i=0;i<n;i++){
      const el=p.locator(S).nth(i);
      const info=await el.evaluate((e)=>{const cs=getComputedStyle(e);const r=e.getBoundingClientRect();const text=(e.textContent||'').trim();
        // the text node's own colour: the first non-empty text node's parent
        const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let node,color=cs.color;while((node=walker.nextNode())){if(node.textContent.trim()){color=getComputedStyle(node.parentElement).color;break;}}
        return {text:text.slice(0,28),w:r.width,h:r.height,display:cs.display,color,bg:cs.backgroundColor,vis:cs.visibility,cls:(e.className||'').toString().slice(0,40),tag:e.tagName,pt:cs.paddingTop,pb:cs.paddingBottom,pl:cs.paddingLeft,pr:cs.paddingRight,ta:cs.textAlign,jc:cs.justifyContent}});
      if(!info.text||info.w<8||info.h<8||info.vis==='hidden'||(info.display==='inline'&&!only))continue;
      await el.scrollIntoViewIfNeeded().catch(()=>{});
      const buf=await el.screenshot({animations:'disabled'}).catch(()=>null);if(!buf)continue;
      const png=PNG.sync.read(buf);const [cr,cg,cb]=parse(info.color);
      let top=-1,bot=-1,left=1e9,right=-1;
      for(let y=0;y<png.height;y++){let hit=false;for(let x=0;x<png.width;x++){const k=(y*png.width+x)*4;if(Math.abs(png.data[k]-cr)<24&&Math.abs(png.data[k+1]-cg)<24&&Math.abs(png.data[k+2]-cb)<24){hit=true;if(x<left)left=x;if(x>right)right=x;}}if(hit){if(top<0)top=y;bot=y;}}
      if(top<0)continue;
      total++;
      const gt=top,gb=png.height-1-bot,gl=left,gr=png.width-1-right;
      // a box reads as centred when its content is centred, not a full-width row with its ends apart
      const centeredH=info.jc==='center'||(info.ta==='center'&&!info.display.includes('flex')&&!info.display.includes('grid'));
      const vOff=gt-gb, hOff=gl-gr;
      const flag=Math.abs(vOff)>1||(centeredH&&Math.abs(hOff)>1);
      if(flag){bad++;console.log(`${path}${tool?' ['+tool+']':''} <${info.tag.toLowerCase()} .${info.cls}> “${info.text}” ${Math.round(info.w)}×${Math.round(info.h)} pad ${info.pt}/${info.pb} ink gaps top ${gt} bottom ${gb}${centeredH?` left ${gl} right ${gr}`:''}`);}
    }
  }
  await ctx.close();
}
console.log(`${bad} of ${total} buttons off centre at ${width}`);
await b.close();
