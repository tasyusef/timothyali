import fs from 'node:fs'; import path from 'node:path';
const root = '.vercel/output/static';
const files = fs.readdileSync ? [] : [];
function walk(d){ return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.html')?[path.join(d,e.name)]:[]); }
const sitemap = fs.readFileSync('.vercel/output/static/sitemap.xml','utf8').match(/<loc>(.*?)<\/loc>/g).map(s=>s.replace(/<\/?loc>/g,'').replace('https://www.timothyali.com',''));
const pages = walk(root).sort();
const rows=[]; const linkTargets=new Set();
for (const f of pages){
  const html=fs.readFileSync(f,'utf8');
  const g=(re)=>{const m=html.match(re);return m?m[1]:null};
  const title=g(/<title>(.*?)<\/title>/s); const desc=g(/<meta name="description" content="(.*?)"/);
  const canon=g(/<link rel="canonical" href="(.*?)"/); const robots=g(/<meta name="robots" content="(.*?)"/);
  const h1=(html.match(/<h1[\s>]/g)||[]).length; const h2=(html.match(/<h2[\s>]/g)||[]).length; const h3=(html.match(/<h3[\s>]/g)||[]).length;
  const imgs=[...html.matchAll(/<img\b([^>]*)>/g)].map(m=>m[1]);
  const noAlt=imgs.filter(a=>!/\balt=/.test(a)).length; const emptyAlt=imgs.filter(a=>/\balt=""/.test(a)).length;
  const noDims=imgs.filter(a=>!/\bwidth=/.test(a)||!/\bheight=/.test(a)).length; const lazy=imgs.filter(a=>/loading="lazy"/.test(a)).length;
  const ld=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>{try{return JSON.parse(m[1].replaceAll('<\\/','</'))}catch(e){return 'INVALID'}});
  const text=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const words=text.split(' ').filter(Boolean).length;
  const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]); links.forEach(l=>{if(l.startsWith('/'))linkTargets.add(l.split('#')[0])});
  const ext=links.filter(l=>/^https?:/.test(l)&&!l.includes('timothyali.com'));
  const extNoRel=[...html.matchAll(/<a\b([^>]*href="https?:[^"]+"[^>]*)>/g)].filter(m=>!m[1].includes('timothyali.com')&&!/rel=/.test(m[1])).length;
  const route='/'+path.relative(root,f).replace(/index\.html$/,'').replace(/\.html$/,'');
  rows.push({route,title,tlen:title?.length,desc:desc?.slice(0,40),dlen:desc?.length,canon:canon?.replace('https://www.timothyali.com',''),robots,h1,h2,h3,imgs:imgs.length,noAlt,emptyAlt,noDims,lazy,ld:ld.length?ld.map(x=>x['@graph']?.map(n=>n['@type']).join('+')??'?').join('|'):'-',words,ext:ext.length,extNoRel,inSitemap:sitemap.includes(route)});
}
console.table(rows);
console.log('sitemap entries not built:', sitemap.filter(s=>!pages.some(p=>'/'+path.relative(root,p).replace(/index\.html$/,'')===s)));
console.log('linked internal paths not in sitemap:', [...linkTargets].filter(l=>!sitemap.includes(l)&&!l.startsWith('/_app')).sort());
const ids=new Set(fs.readdirSync('.vercel/output/static/og').filter(f=>f.endsWith('.png')).map(f=>f.replace('.png','')));
const used=new Set(); for(const f of pages){const html=fs.readFileSync(f,'utf8'); for(const m of html.matchAll(/\/og\/([a-z0-9-]+)\.png/g)) used.add(m[1]);}
console.log('og missing:', [...used].filter(u=>!ids.has(u)), 'og unused:', [...ids].filter(i=>!used.has(i)));
