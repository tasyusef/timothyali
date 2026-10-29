import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
Object.assign(globalThis,{browser,fs,out:new URL('.',import.meta.url).pathname});
try{
 const {run}=await import('./demos.mjs');
 for(const [w,touch] of [[1440,false],[390,true],[320,true],[900,true]]){
  try{console.log(JSON.stringify(await run(w,touch)));}catch(e){console.log(w,'ERROR',e.stack);}
 }
}finally{await browser.close();}
