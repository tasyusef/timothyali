// The field cursor (decision 0103): a 16px bitmap crosshair on the 2px pixel, seven cells
// across with an open centre cell, so the cell under the pointer stays visible. One file per
// theme in the theme's foreground colour, at 1x and 2x. Hotspot: the centre cell, 7 7.
//   node tools/cursor/make.mjs   → static/cursor/field-{dark,light}[@2x].png
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
import { INK as INK_HEX, WHITE as WHITE_HEX, rgb } from '../../src/lib/tokens.ts';
const INK = rgb(INK_HEX), WHITE = rgb(WHITE_HEX); // the site's --ink / --white (were the pre-0171 values until 0210)
const ROWS = [
  '...X....',
  '...X....',
  '...X....',
  'XXX.XXX.',
  '...X....',
  '...X....',
  '...X....',
  '........'
];
function make(rgb, scale, file) {
  const px = 2 * scale, size = 8 * px;
  const png = new PNG({ width: size, height: size });
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (ROWS[r][c] === 'X')
    for (let y = 0; y < px; y++) for (let x = 0; x < px; x++) { const i = ((r * px + y) * size + c * px + x) * 4; png.data[i] = rgb[0]; png.data[i + 1] = rgb[1]; png.data[i + 2] = rgb[2]; png.data[i + 3] = 255; }
  writeFileSync(file, PNG.sync.write(png));
}
make(WHITE, 1, 'static/cursor/field-dark.png'); make(WHITE, 2, 'static/cursor/field-dark@2x.png');
make(INK, 1, 'static/cursor/field-light.png'); make(INK, 2, 'static/cursor/field-light@2x.png');
console.log('wrote static/cursor/field-*.png');
