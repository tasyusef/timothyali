// The hero's scene (PX-65, mock): a range of mountains in front of a very large gas giant,
// on Timothy's “id like to do mountains. but maybe also a very large gas giant in the
// background”. It is drawn in the field's own cells: each cell asks the scene how much is
// there (`v`, which picks the glyph) and what it is made of (`c`, which picks the colour), so
// it stays on the grid, knocks out around text and answers the pointer like any field.
// The scene is composed in one window height (`S` rows); the planet's bands drift slowly.
import { fbm, hash2 } from '$lib/prng';

/** what a cell is made of; the palettes below give each one a colour per theme */
export const MAT = { cream: 0, orange: 1, rust: 2, brown: 3, rock: 4, shade: 5, snow: 6, star: 7 } as const;
export type Palette = 'scene' | 'accent';
// 'scene': the scene's own colours, a handful of tones; 'accent': the site's yellow and three
// tones around it. The light ground takes darker values of the same hues.
export const PALETTES: Record<Palette, { dark: string[]; light: string[] }> = {
  scene: {
    dark: ['#ecd9b0', '#e48a3a', '#b9502b', '#7d4a2a', '#a9b2d6', '#59628a', '#f4f4f0', '#9a9a90'],
    light: ['#9c7a3c', '#c2601c', '#93391b', '#5c3520', '#33406a', '#7c86aa', '#11110e', '#6a6a62'],
  },
  accent: {
    dark: ['#f2d600', '#e0902a', '#b8641c', '#7a6a3a', '#a8a8a0', '#5a5a53', '#f4f4f0', '#8c8c84'],
    light: ['#c8ac00', '#b8641c', '#8f4a12', '#5e5230', '#3a3a35', '#8a8a82', '#11110e', '#6a6a62'],
  },
};

const ridged = (x: number, seed: number) => {
  // ridged fbm along one axis: sharp peaks, soft valleys
  let v = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < 4; i++) { const n = fbm(x * f, i * 3.1, seed + i * 7, 1); v += amp * (1 - Math.abs(2 * n - 1)); norm += amp; amp *= 0.5; f *= 2.1; }
  return v / norm;
};
// three ranges, far to near: where the ridge sits (a fraction of the window from the top), how
// high it climbs, how often it peaks, and how much of it shows (the far range is hazed)
const RANGES = [
  { base: 0.8, amp: 0.3, freq: 1.8, lit: 0.3, dark: 0.16, seed: 11 },
  { base: 0.93, amp: 0.3, freq: 2.8, lit: 0.62, dark: 0.3, seed: 23 },
  { base: 1.04, amp: 0.24, freq: 4.2, lit: 0.95, dark: 0.5, seed: 37 },
];
const top = (k: number, u: number) => RANGES[k].base - RANGES[k].amp * ridged(u * RANGES[k].freq, RANGES[k].seed);

/** The same scene for ink on paper (PX-65, mock of light mode): weight comes from shadow, not
 * light, like an engraving; the sky and the stars stay paper. */
export function sceneInk(x: number, y: number, t: number, cols: number, S: number, seed: number) {
  const f = sceneCell(x, y, t, cols, S, seed);
  if (!f.o) return { v: 0, c: f.c };
  return { v: Math.min(1, 0.1 + 0.9 * (1 - f.v)) * (f.v === 0 && y / S > 1 ? 0 : 1), c: f.c };
}
// The mountains can come from a picture instead (PX-65): a generated reference keyed onto
// transparency, drawn at one pixel per cell by the field (`layoutMountains`), so each cell
// reads its own average of the rock under it.
export const MOUNTAIN_REFS = { a: '/hero/mountains-a.png', b: '/hero/mountains-b.png' } as const;
let M: { x0: number; y0: number; w: number; h: number; data: Uint8ClampedArray } | null = null;
/** where the picture sits in cells: as wide as the window or taller on phones, its foot on the first screen's foot */
export function layoutMountains(img: HTMLImageElement, cols: number, S: number) {
  const aspect = img.naturalWidth / img.naturalHeight;
  // landscape: at least as wide as the window, its foot on the first screen's foot; portrait
  // (phones): half again as wide as the window, its foot just above the name, so the peaks stand
  // in the open sky above the copy instead of behind it
  const portrait = cols < S;
  const h = Math.round(portrait ? (cols / aspect) * 1.5 : Math.max(cols / aspect, 0.8 * S)), w = Math.round(h * aspect);
  const x0 = Math.round((cols - w) / 2), y0 = Math.round((portrait ? 0.58 : 1) * S - h);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true }); if (!g) return;
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, w, h);
  M = { x0, y0, w, h, data: g.getImageData(0, 0, w, h).data };
}
export function clearMountains() { M = null; }

// Below the scene (PX-68, 0169, 0170): the page keeps the hero's old sky texture (0162), in the
// mountains' colours, easing back and forth with one bank every two screens. Measured in screens, not
// cells, so the glyphs and the dither (twice the cells) draw the same shape.
function below(x: number, y: number, t: number, cols: number, S: number, seed: number) {
  const u = x / Math.max(1, cols), w = y / S;
  const vert = 0.5 + 0.5 * Math.cos(Math.PI * w);
  const n = fbm(u * (cols / S) * 9 + t * 0.03, w * 11, seed + 51);
  // only the right two thirds (0169): nothing in the left third, building to the right edge, lighter overall
  const r = Math.min(1, Math.max(0, (u - 1 / 3) * 1.5)), h = r * r * (3 - 2 * r);
  const v = Math.min(1, Math.max(0, h * (0.3 + 0.4 * vert + (n - 0.5) * 0.4) - 0.04));
  // in the mountains' own blues (0170): the denser cells in the rock's tone, the lighter in its shade
  return { v, c: v > 0.45 ? MAT.rock : MAT.shade, o: true, tex: true };
}

export function sceneCell(x: number, y: number, t: number, cols: number, S: number, seed: number): { v: number; c: number; o?: boolean; fade?: number; tex?: boolean } {
  const u = x / Math.max(1, cols), w = y / S;
  if (M) {
    const ix = x - M.x0, iy = y - M.y0;
    if (ix >= 0 && iy >= 0 && ix < M.w && iy < M.h) {
      const i = (iy * M.w + ix) * 4, a = M.data[i + 3] / 255;
      if (a > 0.5) {
        const L = M.data[i] / 255;
        const v = Math.min(1, Math.max(0, (L - 0.12) / 0.66)) ** 1.1; // stretched: shadows drop away, lit faces and snow carry the shape
        const fade = Math.min(1, (M.h - iy) / (0.14 * M.h)); // the foot of the picture eases out
        return { v: Math.max(0.14, v), c: L > 0.66 ? MAT.snow : L > 0.4 ? MAT.rock : MAT.shade, o: true, fade };
      }
    } else if (iy >= M.h) return below(x, y, t, cols, S, seed);
  } else {
  // mountains, nearest first: the first range the cell is under is the one it shows
  for (let k = RANGES.length - 1; k >= 0; k--) {
    const r = RANGES[k], h = top(k, u);
    if (w < h) continue;
    // past the first screen the near range thins away, so the rest of the page is clear
    const fadeOut = Math.max(0, 1 - Math.max(0, w - 0.97) / 0.06);
    if (fadeOut <= 0) return below(x, y, t, cols, S, seed);
    const o = true;
    const e = 1.5 / cols; const slope = top(k, u - e) - top(k, u + e); // > 0: the face turns to the light on the left
    const lit = slope > 0;
    const grain = (fbm(u * 60, (w - top(k, u)) * 50, seed + k * 5) - 0.5) * 0.14; // strata that follow the ridge
    const depth = w - h;
    // the ridge catches the light: a bright rim one or two cells deep, snow on the tallest peaks
    const high = 1 - (h - (r.base - r.amp)) / r.amp; // 1 at the tallest peaks
    if (depth * S < 1.6 + 2.5 * high * high) return { v: Math.min(1, (lit ? 0.92 : 0.6) + grain) * fadeOut, c: high > 0.62 ? MAT.snow : MAT.rock, o };
    const v = (lit ? r.lit : r.dark) + grain;
    return { v: Math.max(0, Math.min(1, v)) * fadeOut, c: lit ? MAT.rock : MAT.shade, o };
  }
  }
  // the planet: huge, low, to the right, lit from the upper left, its round edge in view
  // portrait: sized to the width and raised, so its round edge shows under the chrome
  const portrait = cols < S;
  const R = portrait ? 0.54 * cols : 0.5 * S, cx = (portrait ? 0.64 : 0.72) * cols, cy = (portrait ? 0.4 : 0.64) * S;
  const dx = (x + 0.5 - cx) / R, dy = (y + 0.5 - cy) / R, r2 = dx * dx + dy * dy;
  if (r2 < 1) {
    const nz = Math.sqrt(1 - r2);
    const lam = Math.max(0, -0.55 * dx - 0.5 * dy + 0.67 * nz);
    const lon = Math.atan2(dx, nz);
    const turb = fbm(lon * 2.4 + t * 0.012, dy * 9, seed, 3);
    const band = Math.sin(dy * 15 + turb * 3.2);
    // the band picks the material and its weight; the light shapes the sphere
    const [c, weight] = band > 0.55 ? [MAT.cream, 1] : band > 0 ? [MAT.orange, 0.86] : band > -0.55 ? [MAT.rust, 0.7] : [MAT.brown, 0.56];
    const v = (0.06 + 0.94 * lam) * weight * (0.9 + 0.2 * turb);
    return { v: v < 0.07 ? 0 : Math.min(1, v), c, o: true };
  }
  // a thin haze just outside the lit limb
  if (r2 < 1.06 * 1.06) { const lam = Math.max(0, -0.55 * dx - 0.5 * dy); if (lam > 0.2) return { v: 0.16 * lam, c: MAT.cream }; }
  // the sky: a few stars, more of them higher up
  const s = hash2(x, y, seed + 99);
  if (s > 0.992 - 0.01 * Math.max(0, 0.5 - w)) return { v: 0.18 + 0.2 * hash2(x, y, seed + 7), c: MAT.star };
  return { v: 0, c: MAT.star };
}
