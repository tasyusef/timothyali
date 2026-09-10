// Pixel-parity harness for the PX-14 design-system extraction.
//
//   node tools/review/parity.mjs before     # capture into out/parity-before/
//   node tools/review/parity.mjs after      # capture into out/parity-after/
//   node tools/review/parity.mjs diff       # compare the two, write out/parity-diff/
//   node tools/review/parity.mjs            # same as `diff`
//
// Captures full-page PNGs of all seven routes with motion forced off
// (`localStorage['tim-motion']='off'` set before any script runs, plus
// `reducedMotion:'reduce'`) so the seeded ASCII/Decode textures draw one static
// frame and the run is deterministic. Dark at 1440 and 390 for every route,
// plus Home and Work in light theme, plus Home with JavaScript disabled.
//
// The clock in the status strip is the one inherently non-deterministic region;
// `MASK` blanks it in both images before the compare. The compare is a plain
// per-pixel RGBA equality test (pixelmatch is not a dependency); it reports the
// number of differing pixels and writes a red-on-grey diff image for any capture
// that is not identical.
import { chromium } from '/Users/twocakes/Desktop/PROJECTS/timothyali2/node_modules/@playwright/test/index.mjs';
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';

const OUT = 'tools/review/out/';
const EXE = '/Users/twocakes/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const ROUTES = ['/', '/work/', '/contact/', '/work/parc/', '/work/xrpcafe/', '/work/firstledger/', '/work/do-androids-dream/', '/work/firststrike/', '/work/sonde/', '/work/parc-site/', '/work/jade-aesthetics/','/work/pocketwatch/'];
const name = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replaceAll('/', '-'));

// Two regions are inherently non-deterministic and are blanked before the compare:
//  1. the clock in the status strip — a full-width band under the header, covered
//     generously so it holds at both widths and both header heights;
//  2. every <video> (figure.clip). The clips never play in these captures, but which
//     decoded frame the compositor has presented differs between builds by a few
//     hundred scattered pixels of colour noise. Their page-space boxes are recorded
//     during the capture pass into <name>.json and masked from both sides.
const CLOCK = { x: 0, y: 0, w: 1440, h: 140 };

async function capture(dir) {
  mkdirSync(OUT + dir, { recursive: true });
  const b = await chromium.launch({ executablePath: EXE });
  const shots = [];
  for (const [width, theme] of [[1440, 'dark'], [390, 'dark']]) {
    for (const path of ROUTES) shots.push({ width, theme, path, js: true });
  }
  shots.push({ width: 1440, theme: 'light', path: '/', js: true });
  shots.push({ width: 1440, theme: 'light', path: '/work/', js: true });
  shots.push({ width: 1440, theme: 'dark', path: '/', js: false });

  for (const s of shots) {
    const ctx = await b.newContext({
      viewport: { width: s.width, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      javaScriptEnabled: s.js
    });
    if (s.js) {
      await ctx.addInitScript(([theme]) => {
        try {
          localStorage.setItem('tim-motion', 'off');
          localStorage.setItem('tim-theme', theme);
          localStorage.setItem('tim-grid', 'off');
        } catch {}
      }, [s.theme]);
    }
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await p.goto('http://localhost:4173' + s.path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    if (s.js) {
      const h = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 600) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(90); }
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.waitForTimeout(1200);
    }
    const file = `${name(s.path)}-${s.width}-${s.theme}${s.js ? '' : '-nojs'}.png`;
    await p.screenshot({ path: OUT + dir + '/' + file, fullPage: true });
    const clips = await p.evaluate(() => [...document.querySelectorAll('figure.clip')].map((f) => {
      const r = f.getBoundingClientRect();
      return { x: Math.floor(r.left + scrollX) - 2, y: Math.floor(r.top + scrollY) - 2, w: Math.ceil(r.width) + 4, h: Math.ceil(r.height) + 4 };
    }));
    writeFileSync(OUT + dir + '/' + file.replace(/\.png$/, '.json'), JSON.stringify(clips));
    console.log('CAPTURE', dir, file, 'errors', errors.length, errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await b.close();
}

function maskInto(png, extra = []) {
  for (const m of [CLOCK, ...extra]) {
    for (let y = m.y; y < Math.min(m.y + m.h, png.height); y++) {
      for (let x = m.x; x < Math.min(m.x + m.w, png.width); x++) {
        const i = (png.width * y + x) << 2;
        png.data[i] = 0; png.data[i + 1] = 0; png.data[i + 2] = 0; png.data[i + 3] = 255;
      }
    }
  }
}

// Compares on the union of the two canvases. A row that exists in only one image
// counts as differing in full, so a page that got taller reports the added rows
// plus whatever moved. `firstRow` is the topmost differing row, which is what
// tells you where a change actually starts.
function readClips(png) {
  const f = png.replace(/\.png$/, '.json');
  try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return []; }
}

function compare(a, b, outFile) {
  const A = PNG.sync.read(readFileSync(a));
  const B = PNG.sync.read(readFileSync(b));
  const clips = [...readClips(a), ...readClips(b)];
  maskInto(A, clips); maskInto(B, clips);
  const W = Math.max(A.width, B.width), H = Math.max(A.height, B.height);
  const at = (P, x, y) => (x < P.width && y < P.height ? (P.width * y + x) << 2 : -1);
  const D = new PNG({ width: W, height: H });
  let n = 0, firstRow = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ia = at(A, x, y), ib = at(B, x, y), id = (W * y + x) << 2;
    const same = ia >= 0 && ib >= 0 &&
      A.data[ia] === B.data[ib] && A.data[ia + 1] === B.data[ib + 1] &&
      A.data[ia + 2] === B.data[ib + 2] && A.data[ia + 3] === B.data[ib + 3];
    if (same) {
      const g = (A.data[ia] * 0.3 + A.data[ia + 1] * 0.59 + A.data[ia + 2] * 0.11) * 0.25 + 190;
      D.data[id] = g; D.data[id + 1] = g; D.data[id + 2] = g; D.data[id + 3] = 255;
    } else {
      n++; if (firstRow < 0) firstRow = y;
      D.data[id] = 255; D.data[id + 1] = 0; D.data[id + 2] = 0; D.data[id + 3] = 255;
    }
  }
  if (n > 0) { mkdirSync(OUT + 'parity-diff', { recursive: true }); writeFileSync(outFile, PNG.sync.write(D)); }
  const size = A.width === B.width && A.height === B.height
    ? `${A.width}x${A.height}`
    : `${A.width}x${A.height}>${B.width}x${B.height}`;
  return { size, diff: n, total: W * H, firstRow };
}

function diffAll(dirA = 'parity-before', dirB = 'parity-after') {
  const files = readdirSync(OUT + dirA).filter((f) => f.endsWith('.png')).sort();
  const rows = [];
  for (const f of files) {
    const b = OUT + dirB + '/' + f;
    if (!existsSync(b)) { rows.push([f, 'MISSING', '', '', '']); continue; }
    const r = compare(OUT + dirA + '/' + f, b, OUT + 'parity-diff/' + f);
    rows.push([f, r.size, String(r.diff), r.diff > 0 ? (100 * r.diff / r.total).toFixed(4) + '%' : '0', r.firstRow < 0 ? '-' : String(r.firstRow)]);
  }
  const w = [Math.max(...rows.map((r) => r[0].length), 8), 22, 10, 9, 9];
  const line = (r) => r.map((c, i) => String(c).padEnd(w[i])).join('  ').trimEnd();
  const table = [line(['capture', 'size (before>after)', 'differing', 'share', 'first row']), line(w.map((n) => '-'.repeat(n))), ...rows.map(line)].join('\n');
  console.log(table);
  const bad = rows.filter((r) => r[2] !== '0');
  console.log('\n' + rows.length + ' captures, ' + bad.length + ' differing.');
  return table;
}

const mode = process.argv[2] ?? 'diff';
if (mode === 'before') await capture('parity-before');
else if (mode === 'after') await capture('parity-after');
else diffAll();
