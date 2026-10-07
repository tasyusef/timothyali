// SEO audit of the production build (PX-59, 0145). Reads .vercel/output/static after
// `pnpm build` and checks every prerendered page: one title of 15–60 characters and one
// description of 50–160, one h1, a canonical that matches the sitemap, alt text and
// dimensions on every image, a WebP source wherever derive.mjs has made one, JSON-LD that
// parses and names the page, the share image on disk, the sitemap and robots.txt, the 404
// page's noindex, and no stray `http://` references. Prints one row per page and exits 1
// on any error; shorter descriptions and other soft points are listed as warnings.
//   node tools/review/seo.mjs            (or pnpm seo:check, which first checks the derivatives)
//   node tools/review/seo.mjs --json out.json   also writes the table
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = '.vercel/output/static';
const ORIGIN = 'https://www.timothyali.com';
const manifest = JSON.parse(readFileSync('src/lib/images.json', 'utf8'));
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.html') ? [join(d, e.name)] : []));
const pages = walk(OUT).sort();
const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).filter((l) => !/\.(png|jpg|webp)$/.test(l)).map((l) => l.replace(ORIGIN, ''));
const errors = [], warnings = [], rows = [];
const err = (route, msg) => errors.push(`${route}: ${msg}`);
const warn = (route, msg) => warnings.push(`${route}: ${msg}`);
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(OUT, file).replace(/index\.html$/, '').replace(/\.html$/, '');
  const one = (re, what) => { const all = [...html.matchAll(re)]; if (all.length !== 1) err(route, `${what} ×${all.length}`); return all[0]?.[1]; };
  const title = one(/<title>(.*?)<\/title>/gs, 'title');
  const desc = one(/<meta name="description" content="(.*?)"/g, 'description');
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(route, `h1 ×${h1}`);
  if (title && (title.length < 15 || title.length > 60)) warn(route, `title ${title.length} chars`);
  if (desc && (desc.length < 50 || desc.length > 160) && !noindex) err(route, `description ${desc.length} chars`);
  else if (desc && desc.length < 70 && !noindex) warn(route, `description ${desc.length} chars, could say more`);
  if (/&amp;/.test(desc ?? '') === false && /[<>]/.test(desc ?? '')) err(route, 'description has unescaped markup');
  const canon = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];
  if (noindex) { if (canon) warn(route, 'noindex page has a canonical'); }
  else {
    if (canon !== ORIGIN + route) err(route, `canonical ${canon}`);
    if (!locs.includes(route)) err(route, 'not in sitemap');
    if (!/<meta property="og:title"/.test(html)) err(route, 'no og:title');
    const og = html.match(/<meta property="og:image" content="(.*?)"/)?.[1];
    if (!og || !existsSync(join(OUT, og.replace(ORIGIN, '')))) err(route, `og:image missing on disk: ${og}`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    if (ld.length !== 1) err(route, `json-ld ×${ld.length}`);
    else {
      try {
        const g = JSON.parse(ld[0][1].replaceAll('<\\/', '</'));
        const types = g['@graph'].map((n) => n['@type']);
        if (!types.some((t) => /Page$/.test(t))) err(route, `json-ld has no WebPage node (${types})`);
        const page = g['@graph'].find((n) => /Page$/.test(n['@type']));
        if (page && page.url !== ORIGIN + route) err(route, `json-ld page url ${page.url}`);
        if (page && page.name !== title?.replaceAll('&amp;', '&')) err(route, `json-ld page name differs from title`);
        rows.push({ route, title: title?.length, desc: desc?.length, h1, ld: types.join('+') });
      } catch (e) { err(route, `json-ld invalid: ${e.message}`); }
    }
  }
  const imgs = [...html.matchAll(/<img\b([^>]*)>/g)].map((m) => m[1]);
  for (const a of imgs) {
    const src = a.match(/\bsrc="([^"]*)"/)?.[1] ?? '';
    if (!/\balt=/.test(a)) err(route, `img without alt: ${src}`);
    if (!/\bwidth=/.test(a) || !/\bheight=/.test(a)) err(route, `img without dimensions: ${src}`);
    if (/loading="eager"/.test(a) && !/fetchpriority="high"/.test(a)) warn(route, `eager img without fetchpriority: ${src}`);
  }
  // every manifest image that is shown gets its WebP source
  for (const m of html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g)) {
    const src = m[1].match(/<img[^>]*\bsrc="([^"]*)"/)?.[1];
    if (src && manifest[src] && !/type="image\/webp"/.test(m[1])) err(route, `no webp source for ${src}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*\bsrc="(\/(?:work|toolbox)\/[^"]*\.(?:png|jpg))"/g)) {
    if (manifest[m[1]] && !new RegExp(`<picture\\b[^>]*>[^]*?${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(html)) err(route, `${m[1]} is shown outside <picture>`);
  }
  if (/\bhttp:\/\/(?!www\.w3\.org|schema\.org|www\.google\.com\/schemas)/.test(html)) err(route, 'http:// reference');
  const words = text(html.split('<main')[1] ?? html).split(' ').length;
  if (!noindex && words < 80) warn(route, `thin page: ${words} words in main`);
  const r = rows.find((x) => x.route === route); if (r) r.words = words;
  if (!/<html lang="en">/.test(html)) err(route, 'no lang');
}
// sitemap parity and the rest of the site
const built = pages.map((f) => '/' + relative(OUT, f).replace(/index\.html$/, '')).filter((r) => !r.endsWith('.html'));
for (const l of locs) if (!built.includes(l)) err(l, 'in sitemap but not built');
if (!/xmlns:image=/.test(sitemap)) err('/sitemap.xml', 'no image namespace');
const imageLocs = [...sitemap.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map((m) => m[1].replaceAll('&amp;', '&').replace(ORIGIN, ''));
for (const l of imageLocs) if (!existsSync(join(OUT, l))) err('/sitemap.xml', `image not on disk: ${l}`);
const robots = readFileSync(join(OUT, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) err('/robots.txt', 'no sitemap line');
const nf = readFileSync(join(OUT, 'not-found.html'), 'utf8');
if (!/name="robots" content="noindex"/.test(nf)) err('/not-found', 'not noindex');
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
if (!vercel.headers?.some((h) => h.headers.some((x) => x.key === 'Cache-Control'))) err('vercel.json', 'no Cache-Control header rule');

console.table(rows.map((r) => ({ ...r, ld: r.ld.length > 40 ? r.ld.slice(0, 37) + '…' : r.ld })));
console.log(`${pages.length} pages, ${locs.length} in sitemap, ${imageLocs.length} sitemap images`);
if (warnings.length) console.log('warnings:\n  ' + warnings.join('\n  '));
if (errors.length) { console.error('errors:\n  ' + errors.join('\n  ')); process.exit(1); }
const j = process.argv.indexOf('--json'); if (j > 0) writeFileSync(process.argv[j + 1], JSON.stringify({ rows, warnings }, null, 2));
console.log('PASS');
