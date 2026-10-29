// The tool samples on /toolbox/: what the real Toolbox makes from two inputs, so every count, colour,
// size and picture the landing diagrams show is the app's own output, not a sketch of it (PX-131).
// It runs the app's CLI on tools/toolbox/acme.svg (Lockup) and tools/toolbox/poster.svg (Palette,
// Convert); Specimen sets the site's own faces, which must be installed (below). Then, for each tool:
//
//   static/toolbox/samples/<tool>/<name>.zip       what the tool wrote, with fixed dates so reruns match
//   static/toolbox/samples/<tool>/…                the pictures its diagram shows
//   src/lib/components/toolbox/<tool>-sample.json  what the diagram reads
//
// Every picture is the app's too: the poster at display size is a Convert of it. Rerun after each
// Toolbox release:
//
//   node tools/toolbox/samples.mjs /path/to/toolbox
//
// Specimen's faces: PARC Pixel (installed with the site's fonts) and Jersey 15, which the site only
// has as a web font. The app sets installed fonts only, so Jersey 15 is the site's own WOFF
// (@fontsource/jersey-15, latin) unpacked to a TTF and put in ~/Library/Fonts (Oct 29, 2026).
//
// acme.svg is the landing demo's logo: the anvil and "acme." in Jacquard 24, traced on its 2px cell
// (Jacquard is 43 cells to the em, so at 43px one cell is one pixel) so it needs no font.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.argv[2];
if (!bin || !existsSync(bin)) throw new Error('Usage: node tools/toolbox/samples.mjs /path/to/toolbox');
const IN = join(ROOT, 'tools/toolbox');
const STATIC = join(ROOT, 'static/toolbox/samples');
const COMPONENTS = join(ROOT, 'src/lib/components/toolbox');
const run = (...a) => JSON.parse(execFileSync(bin, [...a, '--json'], { encoding: 'utf8', timeout: 300_000, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] }));
const version = execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim().replace(/^toolbox\s+/, '');
const generated = `Toolbox ${version}`;
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const pngSize = async (f) => { const m = await sharp(f).metadata(); return [m.width, m.height]; };

/** run a tool into a fresh folder; returns the folder it made and its files, relative and sorted */
function make(...args) {
  const work = mkdtempSync(join(tmpdir(), 'toolbox-sample-'));
  run(...args, '--out', work);
  const [root] = readdirSync(work).filter((n) => statSync(join(work, n)).isDirectory());
  const dir = join(work, root);
  return { work, root, dir, files: walk(dir).map((f) => relative(dir, f)).sort() };
}
/** the zip: the folder as the app wrote it, every date set to the release day, sorted */
function zip(made, dest) {
  const day = new Date('2026-10-28T12:00:00Z');
  for (const f of walk(made.dir)) utimesSync(f, day, day);
  rmSync(dest, { force: true });
  execFileSync('zip', ['-X', '-D', '-9', '-q', dest, '-@'], { cwd: made.work, input: made.files.map((f) => `${made.root}/${f}`).join('\n') });
  return statSync(dest).size;
}
function out(tool) { const d = join(STATIC, tool); rmSync(d, { recursive: true, force: true }); mkdirSync(d, { recursive: true }); return d; }
const href = (tool, name) => `/toolbox/samples/${tool}/${name}`;
const save = (tool, data) => writeFileSync(join(COMPONENTS, `${tool}-sample.json`), JSON.stringify({ generated, ...data }, null, 2) + '\n');
const done = [];

// Lockup: the logo, its colours with Pantone names (so the package has its PMS folder), the demo's
// 10% padding and hard edges for a pixel logo
{
  const d = out('lockup');
  const args = ['lockup', join(IN, 'acme.svg'), '--name', 'Acme', '--padding', '0.1', '--edgeSmoothing', 'hard',
    '--variations', JSON.stringify([{ index: 0, name: 'Primary' }]),
    '--palette', JSON.stringify([{ sourceHex: '#FF683B', pantone: '1645 C' }, { sourceHex: '#174C43', pantone: '3435 C' }])];
  const { palette } = run(...args, '--action', 'inspect', '--out', tmpdir()).data;
  const made = make(...args);
  const files = made.files.map((path) => {
    const parts = path.split('/'), name = parts.at(-1), ext = name.split('.').pop().toLowerCase();
    // PRINT/<treatment folder>/[<format>/]<file> or WEB/<treatment folder>/<format>/<file>
    const family = parts.find((p) => p === 'PRINT' || p === 'WEB') ?? null;
    const folder = family ? parts[parts.indexOf(family) + 1] : null;
    const treatment = folder === null ? null : /^PMS/.test(folder) ? 'Pantone' : /Color/.test(folder) ? 'Color' : folder;
    return { path, kind: { jpg: 'jpeg' }[ext] ?? ext, family, treatment, size: /_(Large|Medium|Small)\.\w+$/.exec(name)?.[1] ?? null, bytes: statSync(join(made.dir, path)).size };
  });
  cpSync(join(IN, 'acme.svg'), join(d, 'acme.svg'));
  const name = `${made.root.replace(/\s+/g, '-')}.zip`;
  save('lockup', { root: made.root, source: { name: 'acme.svg', href: href('lockup', 'acme.svg'), px: [236, 34] }, palette: palette.map(({ hex, pantone }) => ({ hex, pantone })), files, zip: { href: href('lockup', name), bytes: zip(made, join(d, name)) } });
  rmSync(made.work, { recursive: true, force: true });
  done.push(`lockup: ${files.length} files`);
}

// the poster, drawn by Convert: the full-size PNG is Convert's input, the 800px WebP is the
// picture Palette and Convert show
const poster = make('convert', join(IN, 'poster.svg'), '--formats', 'png');
const posterPng = join(poster.dir, 'poster.png');
const posterPx = await pngSize(posterPng);
{
  const pic = make('convert', posterPng, '--formats', 'webp', '--longestEdge', '800', '--compression', '25');
  mkdirSync(STATIC, { recursive: true });
  cpSync(join(pic.dir, 'poster.webp'), join(STATIC, 'poster.webp'));
  rmSync(pic.work, { recursive: true, force: true });
}
const posterPic = { href: '/toolbox/samples/poster.webp', px: await pngSize(join(STATIC, 'poster.webp')) };

// Palette: the colours in the poster SVG (its exact fills), every output
{
  const d = out('palette');
  const made = make('palette', '--input', join(IN, 'poster.svg'), '--name', 'Acme');
  const { entries } = run('palette', '--input', join(IN, 'poster.svg'), '--name', 'Acme', '--action', 'inspect', '--out', tmpdir()).data;
  const files = made.files.map((name) => ({ name, bytes: statSync(join(made.dir, name)).size }));
  const name = `${made.root.replace(/\s+/g, '-')}.zip`;
  save('palette', { root: made.root, source: { name: 'poster.svg', picture: posterPic }, colors: entries.map(({ name, hex }) => ({ name, hex })), files, zip: { href: href('palette', name), bytes: zip(made, join(d, name)) } });
  rmSync(made.work, { recursive: true, force: true });
  done.push(`palette: ${entries.length} colours, ${files.length} files`);
}

// Specimen: the site's three type roles at the site's sizes, in points (the sheet draws two pixels
// to the point, so each face lands on whole cells: Bold 8px, Regular 4px, Jersey 2px), hard edges
// for pixel faces; the sheet as PDF and PNG
{
  const d = out('specimen');
  const roles = [{ label: 'Display', family: 'PARC_Pixel', face: 'Bold', size: 55 }, { label: 'Label', family: 'PARC_Pixel', face: 'Regular', size: 12.5 }, { label: 'Body', family: 'Jersey 15', face: 'Regular', size: 27 }];
  const made = make('specimen', '--title', 'Acme', '--sample', 'Make something good.', '--edgeSmoothing', 'hard', '--roles', JSON.stringify(roles));
  const files = made.files.map((name) => ({ name, bytes: statSync(join(made.dir, name)).size }));
  const png = made.files.find((f) => f.endsWith('.png'));
  cpSync(join(made.dir, png), join(d, png));
  const name = `${made.root.replace(/\s+/g, '-')}.zip`;
  save('specimen', { root: made.root, roles, sheet: { href: href('specimen', png), px: await pngSize(join(made.dir, png)) }, files, zip: { href: href('specimen', name), bytes: zip(made, join(d, name)) } });
  rmSync(made.work, { recursive: true, force: true });
  done.push(`specimen: ${files.length} files`);
}

// Convert: the poster PNG to WebP and JPEG, a quarter of the way to the strongest compression
{
  const d = out('convert');
  const settings = { formats: ['webp', 'jpeg'], compression: 25 };
  const made = make('convert', posterPng, '--formats', ...settings.formats, '--compression', String(settings.compression));
  const outputs = made.files.map((path) => ({ path, kind: path.split('.').pop() === 'jpg' ? 'jpeg' : path.split('.').pop(), bytes: statSync(join(made.dir, path)).size }));
  const name = 'Acme-Poster-Converted.zip';
  save('convert', { root: made.root, settings, source: { name: 'poster.png', kind: 'png', bytes: statSync(posterPng).size, px: posterPx, picture: posterPic }, outputs, zip: { href: href('convert', name), bytes: zip(made, join(d, name)) } });
  rmSync(made.work, { recursive: true, force: true });
  done.push(`convert: ${outputs.map((o) => `${o.kind} ${(o.bytes / 1e6).toFixed(1)} MB`).join(', ')} from png ${(statSync(posterPng).size / 1e6).toFixed(1)} MB`);
}
rmSync(poster.work, { recursive: true, force: true });
console.log(`${generated}: ${done.join('; ')}`);
