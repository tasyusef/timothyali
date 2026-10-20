// The hero's scene (PX-65, mock): a range of mountains in front of a very large gas giant,
// on Timothy's “id like to do mountains. but maybe also a very large gas giant in the
// background”. It is drawn in the field's own cells: each cell asks the scene how much is
// there (`v`, which picks the glyph) and what it is made of (`c`, which picks the colour), so
// it stays on the grid, knocks out around text and answers the pointer like any field.
// The scene is composed in one window height (`S` rows); the planet's bands drift slowly.
import { fbm, hash2 } from '$lib/prng';
import { INK, WHITE, YELLOW, YELLOW_FIELD } from '$lib/tokens';

/** what a cell is made of; the palettes below give each one a colour per theme */
export const MAT = { cream: 0, orange: 1, rust: 2, brown: 3, rock: 4, shade: 5, snow: 6, star: 7, jade: 8, night: 9 } as const; // night: the ink ground in both themes, for silhouettes
export type Palette = 'scene' | 'accent';
// 'scene': the scene's own colours, a handful of tones; 'accent': the site's yellow and three
// tones around it. The light ground takes darker values of the same hues.
export const PALETTES: Record<Palette, { dark: string[]; light: string[] }> = {
  scene: {
    dark: ['#ecd9b0', '#e48a3a', '#b9502b', '#7d4a2a', '#a9b2d6', '#59628a', WHITE, '#9a9a90', '#8fc4a6', INK],
    light: ['#9c7a3c', '#c2601c', '#93391b', '#5c3520', '#33406a', '#7c86aa', INK, '#6a6a62', '#3b7658', INK],
  },
  accent: {
    dark: [YELLOW, '#e0902a', '#b8641c', '#7a6a3a', '#a8a8a0', '#5a5a53', WHITE, '#8c8c84', '#8fc4a6', INK],
    light: [YELLOW_FIELD, '#b8641c', '#8f4a12', '#5e5230', '#3a3a35', '#8a8a82', INK, '#6a6a62', '#3b7658', INK],
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

// The mountains can come from a picture instead (PX-65): a generated reference keyed onto
// transparency, drawn at one pixel per cell by the field (`layoutMountains`), so each cell
// reads its own average of the rock under it.
// grey WebP (0193): the field reads only brightness and alpha, so the colour went; 351 → 73 KB each
export const MOUNTAIN_REFS = { a: '/hero/mountains-a.webp', b: '/hero/mountains-b.webp' } as const;
export type Mountains = { x0: number; y0: number; w: number; h: number; data: Uint8ClampedArray };

// One world, several shots (0173): the hero's giant behind the peaks; the giant high over
// Contact's “building.” ('rise'); one small moon in an empty sky for the 404. A body is placed in fractions of the window: landscape R × its height, portrait R × its width.
export type Shot = 'hero' | 'rise' | 'moon' | 'strip';
type Body = { cx: number; cy: number; R: number; moon?: boolean };
const SHOTS: Record<Shot, { land: Body; port: Body; ridge: boolean; below: boolean; foot?: number; top?: number }> = {
  hero: { land: { cx: 0.72, cy: 0.64, R: 0.5 }, port: { cx: 0.64, cy: 0.42, R: 0.54 }, ridge: true, below: true }, // just above the peaks (0203)
  rise: { land: { cx: 0.56, cy: 0.34, R: 0.34 }, port: { cx: 0.72, cy: 0.2, R: 0.5 }, ridge: false, below: false },
  moon: { land: { cx: 0.76, cy: 0.36, R: 0.11, moon: true }, port: { cx: 0.72, cy: 0.3, R: 0.17, moon: true }, ridge: false, below: false },
  // a study's head (0178): measured on the head itself, not the window; the top of the range
  // from `top` down, fading out over the strip's last 30%, and the giant rising behind them on the right
  strip: { land: { cx: 0.8, cy: 0.95, R: 0.85 }, port: { cx: 0.75, cy: 0.95, R: 0.62 }, ridge: true, below: false, foot: 0.3, top: 0.38 },
};
export const shotHasRidge = (shot: Shot) => SHOTS[shot].ridge;
/** where the picture sits in cells: as wide as the window or taller on phones, its foot on the first screen's foot */
export function layoutMountains(img: HTMLImageElement, cols: number, S: number, shot: Shot = 'hero'): Mountains | null {
  const top = SHOTS[shot].top;
  const aspect = img.naturalWidth / img.naturalHeight;
  // landscape: at least as wide as the window, its foot on the first screen's foot; portrait
  // (phones, tablets): at least 0.8 of the screen tall as on desktop, cropped at the sides, its foot on the first
  // screen's foot like the landscape shot's, so the copy stands in the picture, not on empty
  // ground under it (0203; it was sized to the width with its foot at 0.58, above the name)
  const portrait = cols < S;
  const h = Math.round(top !== undefined ? Math.max(cols / aspect, 1.3 * S) : portrait ? Math.max((cols / aspect) * 1.5, 0.8 * S) : Math.max(cols / aspect, 0.8 * S)), w = Math.round(h * aspect);
  // a strip hangs the picture from `top`, so its peaks, not its foot, are what shows
  const x0 = Math.round((cols - w) / 2), y0 = Math.round(top !== undefined ? top * S : S - h);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true }); if (!g) return null;
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, w, h);
  const data = g.getImageData(0, 0, w, h).data;
  if (top === undefined) return { x0, y0, w, h, data };
  // a strip puts the highest peak, not the picture's empty top, at `top`
  let first = 0;
  find: for (; first < h; first++) for (let x = 0; x < w; x++) if (data[(first * w + x) * 4 + 3] > 128) break find;
  return { x0, y0: y0 - first, w, h, data };
}

// Below the scene (PX-68, 0169, 0170): the page keeps the hero's old sky texture (0162), in the
// mountains' colours, easing back and forth with one bank every two screens. Measured in screens, not
// cells, so the glyphs and the dither (twice the cells) draw the same shape.
function below(x: number, y: number, t: number, cols: number, S: number, seed: number) {
  const u = x / Math.max(1, cols), w = y / S;
  const vert = 0.5 + 0.5 * Math.cos(Math.PI * w);
  const n = fbm(u * (cols / S) * 9 + t * 0.03, w * 11, seed + 51);
  // only the right two thirds (0169): nothing in the left third, building to the right edge, lighter overall
  const r = Math.min(1, Math.max(0, (u - 1 / 3) * 1.5)), h = r * r * (3 - 2 * r);
  // on a portrait screen (a phone) it ends a third of a screen past the hero (0188): there it ran behind every card
  const portrait = cols / S < 0.9 ? Math.min(1, Math.max(0, (1.3 - w) / 0.3)) : 1;
  const v = Math.min(1, Math.max(0, h * (0.3 + 0.4 * vert + (n - 0.5) * 0.4) - 0.04)) * portrait;
  // in the mountains' own blues (0170): the denser cells in the rock's tone, the lighter in its shade
  return { v, c: v > 0.45 ? MAT.rock : MAT.shade, o: true, tex: true };
}

export function sceneCell(x: number, y: number, t: number, cols: number, S: number, seed: number, shot: Shot = 'hero', M: Mountains | null = null): { v: number; c: number; o?: boolean; fade?: number; tex?: boolean } {
  const u = x / Math.max(1, cols), w = y / S, sh = SHOTS[shot];
  if (sh.ridge && M) {
    const ix = x - M.x0, iy = y - M.y0;
    if (ix >= 0 && iy >= 0 && ix < M.w && iy < M.h) {
      const i = (iy * M.w + ix) * 4, a = M.data[i + 3] / 255;
      if (a > 0.5) {
        const L = M.data[i] / 255;
        const v = Math.min(1, Math.max(0, (L - 0.12) / 0.66)) ** 1.1; // stretched: shadows drop away, lit faces and snow carry the shape
        const fade = Math.min(1, (M.h - iy) / (0.14 * M.h)); // the foot of the picture eases out
        const foot = sh.foot ? Math.min(1, Math.max(0, (S - y) / (sh.foot * S))) : 1; // a strip eases out at its own foot
        return { v: Math.max(0.14, v) * foot, c: L > 0.66 ? MAT.snow : L > 0.4 ? MAT.rock : MAT.shade, o: true, fade: fade * foot };
      }
    } else if (iy >= M.h && sh.below) return below(x, y, t, cols, S, seed);
  } else if (sh.ridge) {
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
  const portrait = cols < S, b = portrait ? sh.port : sh.land;
  const R = b.R * (portrait ? cols : S), cx = b.cx * cols, cy = b.cy * S;
  const dx = (x + 0.5 - cx) / R, dy = (y + 0.5 - cy) / R, r2 = dx * dx + dy * dy;
  if (r2 < 1) {
    const nz = Math.sqrt(1 - r2);
    const lam = Math.max(0, -0.55 * dx - 0.5 * dy + 0.67 * nz);
    if (b.moon) {
      // a moon: no bands, darker seas and a few craters, the same light
      const sea = fbm(dx * 2.2 + 5, dy * 2.2, seed + 3, 3), pit = fbm(dx * 7, dy * 7, seed + 9, 2);
      const v = (0.08 + 0.92 * lam) * (sea < 0.47 ? 0.6 : 0.95) * (pit > 0.68 ? 0.7 : 1);
      return { v: v < 0.07 ? 0 : Math.min(1, v), c: sea < 0.47 ? MAT.brown : MAT.cream, o: true };
    }
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
