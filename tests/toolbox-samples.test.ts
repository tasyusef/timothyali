// The tool diagrams on /toolbox/ (PX-131) are drawn from what Toolbox wrote, so each manifest has
// to match its files: every link and picture is there, each zip holds exactly the files the
// manifest lists at their sizes, and what a diagram counts adds up (tools/toolbox/samples.mjs).
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import lockup from '../src/lib/components/toolbox/lockup-sample.json';
import palette from '../src/lib/components/toolbox/palette-sample.json';
import specimen from '../src/lib/components/toolbox/specimen-sample.json';
import convert from '../src/lib/components/toolbox/convert-sample.json';

const STATIC = join(import.meta.dirname, '..', 'static');
const local = (href: string) => join(STATIC, decodeURIComponent(href));
/** a PNG's width and height, from its IHDR chunk */
const pngSize = (href: string) => { const b = readFileSync(local(href)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
/** a zip's files and their sizes, from its central directory */
function zipped(href: string): Record<string, number> {
  const b = readFileSync(local(href));
  const end = b.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  const entries: Record<string, number> = {};
  for (let i = 0, at = b.readUInt32LE(end + 16); i < b.readUInt16LE(end + 10); i++) {
    const name = b.toString('utf8', at + 46, at + 46 + b.readUInt16LE(at + 28));
    entries[name] = b.readUInt32LE(at + 24);
    at += 46 + b.readUInt16LE(at + 28) + b.readUInt16LE(at + 30) + b.readUInt16LE(at + 32);
  }
  return entries;
}
const listed = (root: string, files: { bytes: number }[], key: (f: never) => string) => Object.fromEntries(files.map((f) => [`${root}/${key(f as never)}`, f.bytes]));

describe('toolbox sample manifests', () => {
  it('link only files that exist under static/, each zip at its size', () => {
    const hrefs = [lockup.source.href, palette.source.picture.href, specimen.sheet.href, convert.source.picture.href];
    for (const s of [lockup, palette, specimen, convert]) { hrefs.push(s.zip.href); expect(existsSync(local(s.zip.href)), s.zip.href).toBe(true); expect(statSync(local(s.zip.href)).size, s.zip.href).toBe(s.zip.bytes); }
    for (const href of hrefs) expect(existsSync(local(href)), href).toBe(true);
  });
  it('zip exactly the files they list, at their sizes', () => {
    expect(zipped(lockup.zip.href)).toEqual(listed(lockup.root, lockup.files, (f: { path: string }) => f.path));
    expect(zipped(palette.zip.href)).toEqual(listed(palette.root, palette.files, (f: { name: string }) => f.name));
    expect(zipped(specimen.zip.href)).toEqual(listed(specimen.root, specimen.files, (f: { name: string }) => f.name));
    expect(zipped(convert.zip.href)).toEqual(listed(convert.root, convert.outputs, (f: { path: string }) => f.path));
  });
  it('lockup: files every logo under a family and a colourway, and the README under neither', () => {
    expect(lockup.files).toHaveLength(39);
    for (const f of lockup.files) {
      if (f.kind === 'txt') expect([f.family, f.treatment], f.path).toEqual([null, null]);
      else { expect(['WEB', 'PRINT'], f.path).toContain(f.family); expect(['Color', 'Pantone', 'Black', 'White'], f.path).toContain(f.treatment); }
    }
    expect(lockup.files.filter((f) => f.kind === 'txt').map((f) => f.path)).toEqual(['README.txt']);
    expect(readFileSync(local(lockup.source.href), 'utf8')).toMatch(new RegExp(`<svg[^>]*\\swidth="${lockup.source.px[0]}"\\s+height="${lockup.source.px[1]}"`));
  });
  it('palette: the poster’s four colours, written as code, swatches and a sheet', () => {
    expect(palette.colors.map((c) => c.hex)).toEqual(['#F4F1E7', '#FF683B', '#174C43', '#F2D600']);
    expect(palette.files.map((f) => f.name.split('.').pop()).sort()).toEqual(['ase', 'css', 'json', 'pdf', 'png', 'scss']);
  });
  it('specimen: three styles, the sheet at its own pixel size', () => {
    expect(specimen.roles).toHaveLength(3);
    expect(pngSize(specimen.sheet.href)).toEqual(specimen.sheet.px);
    expect(specimen.files.map((f) => f.name).sort()).toEqual(['Acme.pdf', 'Acme.png']);
  });
  it('convert: every format it was asked for, each smaller than the PNG, the picture in proportion', () => {
    expect(convert.outputs.map((o) => o.kind).sort()).toEqual([...convert.settings.formats].sort());
    for (const o of convert.outputs) expect(o.bytes, o.path).toBeLessThan(convert.source.bytes);
    const [w, h] = convert.source.px, [pw, ph] = convert.source.picture.px;
    expect(pw / ph).toBeCloseTo(w / h, 2);
  });
});
