import fs from 'node:fs/promises';
const out=new URL('.',import.meta.url).pathname;
const data=JSON.parse(await fs.readFile(out+'final-checks.json'));
const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
const blend=(f,b,a)=>f.map((v,i)=>v*a+b[i]*(1-a));
const lum=c=>c.map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
const ratio=(f,b)=>{const a=lum(f),c=lum(b);return (Math.max(a,c)+.05)/(Math.min(a,c)+.05)};
const apca=(f,b)=>{const y=c=>c.reduce((n,v,i)=>n+(v/255)**2.4*[.2126729,.7151522,.072175][i],0);let t=y(f),g=y(b);if(t<.022)t+=(.022-t)**1.414;if(g<.022)g+=(.022-g)**1.414;if(Math.abs(g-t)<.0005)return 0;const s=g>t?(g**.56-t**.57)*1.14:(g**.65-t**.62)*1.14;return g>t?(s<.1?0:(s-.027)*100):(s>-.1?0:(s+.027)*100)};
const rows=[];
for(const r of data.filter(r=>r.kind==='colors')){
 const c=r.colors,p=rgb(c.paper),f=rgb(c.fg),a=rgb(c.accent),t=rgb(c.accentText),pa=rgb(c.panelAccent);
 for(const [name,fg,bg] of [['body',f,p],['dim label',blend(f,p,c.dim),p],['panel dim label',blend(p,f,c.panelDim),f],['accent type and focus',t,p],['panel focus',pa,f],['button',rgb('rgb(24,24,20)'),a]])rows.push({theme:r.theme,name,fg,bg,ratio:+ratio(fg,bg).toFixed(2),Lc:+apca(fg,bg).toFixed(1)});
}
await fs.writeFile(out+'contrast.json',JSON.stringify(rows,null,2));console.log(rows);
