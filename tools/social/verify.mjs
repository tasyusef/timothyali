import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { PNG } from 'pngjs';
import { studies } from '../../src/lib/work.ts';
const cases=[['/','home'],['/work/','work'],['/contact/','contact'],...studies.map(p=>[`/work/${p.slug}/`,p.slug])];
const results=[];
for(const [path,id] of cases){
 const html=readFileSync(`build${path}index.html`,'utf8');
 const tag=(attr,key)=>{const all=[...html.matchAll(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*>`, 'g'))];assert.equal(all.length,1,`${path} ${key} count`);return all[0][0].match(/content="([^"]*)"/)?.[1]};
 assert.equal(tag('property','og:image'),`https://www.timothyali.com/og/${id}.png`);
 assert.equal(tag('property','og:url'),`https://www.timothyali.com${path}`);
 assert.equal(tag('name','twitter:card'),'summary_large_image');
 assert.equal(tag('name','twitter:image'),tag('property','og:image'));
 for(const key of ['og:title','og:description','og:image:alt'])assert.ok(tag('property',key));
 assert.equal(tag('property','og:image:width'),'1200');assert.equal(tag('property','og:image:height'),'630');
 assert.match(html,new RegExp(`<link rel="canonical" href="https://www.timothyali.com${path}"`));
 assert.ok(!html.includes('og:image" content="http://127.0.0.1'));
 const image=PNG.sync.read(readFileSync(`build/og/${id}.png`));assert.equal(image.width,1200);assert.equal(image.height,630);
 for(const name of ['favicon.svg','favicon.ico','apple-touch-icon.png'])assert.ok(existsSync(`build/${name}`));
 results.push({path,image:`/og/${id}.png`,serverRendered:true,dimensions:'1200×630',pass:true});
}
const sitemap=readFileSync('build/sitemap.xml','utf8');for(const [path] of cases)assert.ok(sitemap.includes(`<loc>https://www.timothyali.com${path}</loc>`),`sitemap ${path}`);assert.equal((sitemap.match(/<loc>/g)||[]).length,cases.length);assert.ok(existsSync('build/404.html'));assert.match(readFileSync('build/404.html','utf8'),/name="robots" content="noindex"/);
for(const [path] of cases){const html=readFileSync(`build${path}index.html`,'utf8');assert.match(html,/application\/ld\+json/,`json-ld ${path}`);JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])}
const ico=readFileSync('build/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
writeFileSync('docs/iterations/pixel-v2/23-social/verification.json',JSON.stringify(results,null,2));console.log('PASS: 12 prerendered pages, absolute unique metadata, valid JSON-LD, sitemap, 404.html, 12 PNGs, SVG/ICO/touch icon.');
