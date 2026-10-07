// Responsive WebP derivatives for the site's photographs and screens (PX-59, 0145).
//
// Every raster under static/work and static/toolbox that a page shows is kept at its own
// resolution (0054): the originals stay the `<img src>`. This script writes WebP copies of
// each one at a ladder of widths beside it (`name.<width>.webp`) and a manifest,
// src/lib/images.json, that Picture reads to build a `<source type="image/webp" srcset>`.
// Where a `name@2x.jpg` exists it is the master for every width, so the ladder reaches 2800px.
//
//   node tools/images/derive.mjs            # write what is missing or stale
//   node tools/images/derive.mjs --force    # rewrite everything
//   node tools/images/derive.mjs --check    # exit 1 if anything is missing or stale
//
// Skipped: `static/og` (share images must stay PNG at 1200×630), the Convert demo's
// thumbnails (`static/toolbox/convert-*`, 96px), `@2x` masters themselves, and the
// derivatives this script wrote. The ladder is 640, 1000, 1600 and 2400, capped at the master’s own width: a 1376px frame at 2× is served the 2400.
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, relative, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const STATIC = join(ROOT, 'static');
const MANIFEST = join(ROOT, 'src/lib/images.json');
const LADDER = [640, 1000, 1600, 2400];
const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const isSource = (f) => /\.(png|jpe?g)$/i.test(f) && !/@2x\.\w+$/.test(f) && !/\.\d+\.webp$/.test(f) && !/\/toolbox\/convert-/.test(f);
const sources = ['work', 'toolbox'].flatMap((d) => walk(join(STATIC, d))).filter(isSource).sort();

const manifest = {};
let written = 0, stale = 0, bytesOut = 0;
for (const file of sources) {
  const ext = extname(file), stem = file.slice(0, -ext.length);
  const x2 = [stem + '@2x.jpg', stem + '@2x.png'].find(existsSync);
  const master = x2 ?? file;
  const meta = await sharp(master).metadata();
  const base = await (x2 ? sharp(file).metadata() : meta);
  const widths = LADDER.filter((w) => w < meta.width).concat(meta.width > LADDER.at(-1) ? [] : [meta.width]);
  const url = '/' + relative(STATIC, file).split('/').join('/');
  const entry = { w: base.width, h: base.height, webp: [] };
  const srcTime = Math.max(statSync(master).mtimeMs, statSync(file).mtimeMs);
  for (const w of widths) {
    const out = `${stem}.${w}.webp`;
    const fresh = existsSync(out) && statSync(out).mtimeMs >= srcTime;
    if (!fresh) {
      stale++;
      if (check) { console.log('missing/stale', relative(ROOT, out)); continue; }
      // UI screens (PNG sources) keep more detail; photographs (JPEG sources) compress further.
      const quality = /\.png$/i.test(master) ? 90 : 82;
      await sharp(master).resize({ width: w, withoutEnlargement: true }).webp({ quality, effort: 6, smartSubsample: true }).toFile(out);
      written++;
    }
    if (existsSync(out)) bytesOut += statSync(out).size;
    entry.webp.push(w);
  }
  manifest[url] = entry;
}
const json = '{\n' + Object.entries(manifest).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n') + '\n}\n';
if (check) {
  const current = existsSync(MANIFEST) ? readFileSync(MANIFEST, 'utf8') : '';
  if (current !== json) { console.log('manifest differs'); stale++; }
  if (stale) { console.error(`derivatives out of date (${stale}); run node tools/images/derive.mjs`); process.exit(1); }
  console.log(`derivatives current: ${sources.length} sources`);
} else {
  writeFileSync(MANIFEST, json);
  console.log(`${sources.length} sources, ${written} files written, ${(bytesOut / 1048576).toFixed(1)} MB of WebP in total`);
}
