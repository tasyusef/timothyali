import fs from 'node:fs/promises';
import sharp from 'sharp';
import path from 'node:path';
const dir=path.dirname(new URL(import.meta.url).pathname);
const files=await fs.readdir(dir),slugs=files.filter(x=>x.endsWith('-1440-dark-top.png')).map(x=>x.replace('-1440-dark-top.png',''));
for(const slug of slugs){
 const comps=[];let row=0;
 for(const theme of ['dark','light']){
  let col=0;
  for(const width of [1440,1100,900,700,420,390,320]){
   const label=Buffer.from(`<svg width="300" height="24"><rect width="300" height="24" fill="white"/><text x="8" y="17" font-family="Arial" font-size="14">${slug} / ${width} / ${theme}</text></svg>`);
   comps.push({input:label,left:col*300,top:row*870});
   const input=await sharp(path.join(dir,`${slug}-${width}-${theme}-top.png`)).resize({width:300}).toBuffer();comps.push({input,left:col*300,top:row*870+24});col++;
  }row++;
 }
 await sharp({create:{width:2100,height:1740,channels:3,background:'#ddd'}}).composite(comps).png().toFile(path.join(dir,`${slug}-widths.png`));
}
console.log('Created',slugs.length,'width sheets');
