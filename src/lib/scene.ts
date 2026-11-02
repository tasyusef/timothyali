// The hero's scene (PX-65, mock): a range of mountains in front of a very large gas giant,
// on Timothy's “id like to do mountains. but maybe also a very large gas giant in the
// background”. It is drawn in the field's own cells: each cell asks the scene how much is
// there (`v`, which picks the glyph) and what it is made of (`c`, which picks the colour), so
// it stays on the grid, knocks out around text and answers the pointer like any field.
// The scene is composed in one window height (`S` rows); the planet's bands drift slowly.
import { fbm, hash2, noise2 } from '$lib/prng';
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
// Its depth (PX-139, mock): picture `a` traced by hand into three layers, the far range, the two
// big massifs and the near ridge, as two lines in the picture's own 836 × 470 pixels: the top of
// the massifs' layer and the top of the near ridge's. Everything above the first is the far range.
const DEPTH_W = 836, DEPTH_H = 470;
const MID_TOP = [[0,300],[40,305],[80,300],[140,300],[150,290],[165,270],[180,256],[190,246],[200,258],[215,240],[245,210],[270,200],[290,215],[295,222],[305,228],[312,240],[320,250],[338,240],[345,262],[360,280],[375,290],[400,305],[420,305],[440,320],[450,330],[500,340],[540,335],[570,330],[600,325],[610,310],[625,285],[640,270],[655,245],[675,232],[700,228],[715,235],[735,232],[745,250],[760,272],[770,290],[800,320],[836,330]];
const NEAR_TOP = [[0,350],[30,345],[60,325],[80,320],[100,315],[130,308],[150,318],[170,330],[190,345],[220,355],[260,360],[300,365],[340,372],[380,375],[410,350],[420,340],[450,345],[480,350],[510,345],[540,345],[560,350],[600,355],[640,365],[680,385],[700,395],[720,385],[740,400],[760,400],[800,380],[836,390]];
const lineAt = (L: number[][], x: number) => { for (let i = 1; i < L.length; i++) if (x <= L[i][0]) { const [a, ya] = L[i - 1], [b, yb] = L[i]; return ya + ((yb - ya) * (x - a)) / (b - a); } return L[L.length - 1][1]; };
/** the picture laid out in cells, with each pixel's layer, 0 far to 2 near */
export type Mountains = { x0: number; y0: number; w: number; h: number; data: Uint8ClampedArray; layer?: Uint8Array };
/** Where each layer is (far, massifs, near ridge; the planet; the stars): how far it has sunk as
 * the page scrolls, in screens (`off`), and how far the slow pan has carried it sideways, in widths (`pan`) */
export type Par = { off: [number, number, number]; pan: [number, number, number]; planet: [number, number]; stars: [number, number] };
/** how fast each layer moves as the page scrolls, as a share of the page's own speed: the near ridge moves with it (1) */
export type Depth = { far: number; mid: number; planet: number; stars: number };
/** the slow side-to-side drift: the near ridge's swing, in widths, and the seconds a round trip takes */
export type Pan = { amount: number; period: number };

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
  // each pixel's layer, 0 far to 2 near, from the traced lines
  const layer = new Uint8Array(w * h);
  for (let x = 0; x < w; x++) {
    const px = ((x + 0.5) / w) * DEPTH_W, m = (lineAt(MID_TOP, px) / DEPTH_H) * h, n = (lineAt(NEAR_TOP, px) / DEPTH_H) * h;
    for (let y = 0; y < h; y++) layer[y * w + x] = y + 0.5 >= n ? 2 : y + 0.5 >= m ? 1 : 0;
  }
  if (top === undefined) return { x0, y0, w, h, data, layer };
  // a strip puts the highest peak, not the picture's empty top, at `top`
  let first = 0;
  find: for (; first < h; first++) for (let x = 0; x < w; x++) if (data[(first * w + x) * 4 + 3] > 128) break find;
  return { x0, y0: y0 - first, w, h, data, layer };
}

// Below the scene (PX-68, 0169, 0170): the page keeps the hero's old sky texture (0162), in the
// mountains' colours, easing back and forth with one bank every two screens. Measured in screens, not
// cells, so the glyphs and the dither (twice the cells) draw the same shape.
function below(x: number, y: number, t: number, cols: number, S: number, seed: number) {
  const u = x / Math.max(1, cols), w = y / S;
  // nothing in the left third, nor past the end on a portrait screen: empty for good, and no noise worked out (0218)
  if (u <= 1 / 3 || (cols / S < 0.9 && w >= 1.3)) return { v: 0, c: MAT.shade, o: true, tex: true, s: 1 };
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

// Which layer of the picture a cell shows once the layers have sunk and panned (PX-139): the
// nearest whose own pixels are there. Past the picture's sides the pan reads it mirrored, a cell or
// two at most. The far range takes any of the picture's pixels, so where a nearer layer moves away
// from what it hid, the gap is filled in with rock, not sky.
const mirror = (x: number, w: number) => (x < 0 ? -x : x > w - 1 ? 2 * (w - 1) - x : x);
function sunk(M: Mountains, ix: number, iy: number, C: number, S: number, P: Par) {
  for (let j = 2; j >= 0; j--) {
    const q = iy - P.off[j] * S, r = Math.round(q);
    if (r < 0 || r >= M.h) continue;
    const fx = mirror(ix - P.pan[j] * C, M.w), k = r * M.w + Math.round(fx), l = M.layer![k];
    if (M.data[k * 4 + 3] > 128 && (l === j || j === 0)) return { fx, q };
  }
  return null;
}
// the picture's brightness at a point between pixels, and the cell it makes
function rock(M: Mountains, fx: number, q: number, y: number, S: number, foot0?: number) {
  const c0 = Math.max(0, Math.min(M.w - 1, Math.floor(fx))), g = Math.max(0, fx - c0), c1 = Math.min(M.w - 1, c0 + 1);
  const r0 = Math.max(0, Math.min(M.h - 1, Math.floor(q))), f = Math.max(0, q - r0), r1 = Math.min(M.h - 1, r0 + 1);
  const at = (r: number, c: number) => M.data[(r * M.w + c) * 4];
  const L = ((at(r0, c0) * (1 - g) + at(r0, c1) * g) * (1 - f) + (at(r1, c0) * (1 - g) + at(r1, c1) * g) * f) / 255;
  const v = Math.min(1, Math.max(0, (L - 0.12) / 0.66)) ** 1.1; // stretched: shadows drop away, lit faces and snow carry the shape
  const fade = Math.min(1, (M.h - q) / (0.14 * M.h)); // the foot of the picture eases out
  const foot = foot0 ? Math.min(1, Math.max(0, (S - y) / (foot0 * S))) : 1; // a strip eases out at its own foot
  return { v: Math.max(0.14, v) * foot, c: L > 0.66 ? MAT.snow : L > 0.4 ? MAT.rock : MAT.shade, o: true, fade: fade * foot, s: 1 };
}

// Lightning on the hero (PX-140), after FirstStrike's strip (0179): now and then a bolt from the
// top of the sky down behind the peaks, a double flicker, and an afterglow on the rock where it
// lands. Measured in screens like the rest; `t` counts the field's ticks (160 ms on Home), so a
// period is about five seconds, most of them with a strike (more often on Timothy's word, 0244); the first comes about four seconds
// in. None before then, so motion off (`t` stays 0) and the first paint stay still. `boxes` are what it touches, in screens (the
// bolt, its fork, the glow), so the field works only those cells out again while it is up (and once more to clear it).
const BOLT = { period: 32, glow: 8, chance: 0.85, from: 0.04, reach: 0.14, first: 24 };
export type Bolt = { key: string; x: (w: number) => number; from: number; land: [number, number]; fork: [number, number, number]; flash: number; glow: number; boxes: [number, number, number, number][] };
// it is asked for once a cell, so the last answer is kept and compared by its numbers first
let boltMemo: { t: number; seed: number; cols: number; S: number; M: Mountains | null; b: Bolt | null } = { t: -1, seed: 0, cols: 0, S: 0, M: null, b: null };
export function boltAt(t: number, seed: number, cols: number, S: number, M: Mountains | null): Bolt | null {
  const m = boltMemo; if (t === m.t && seed === m.seed && cols === m.cols && S === m.S && M === m.M) return m.b;
  const b = strikeAt(t, seed, cols, S, M); boltMemo = { t, seed, cols, S, M, b }; return b;
}
function strikeAt(t: number, seed: number, cols: number, S: number, M: Mountains | null): Bolt | null {
  const tt = t - BOLT.first; if (tt < 0 || !M) return null;
  const phase = tt % BOLT.period, id = Math.floor(tt / BOLT.period);
  if (phase >= BOLT.glow || (id > 0 && hash2(id, 5, seed) > BOLT.chance)) return null;
  // anywhere from a third of the way across to the right edge
  const A = cols / S, x0 = A * (0.34 + 0.6 * hash2(id, 1, seed));
  const x = (w: number) => x0 + 0.1 * (noise2(w * 9, id * 7.3, seed) - 0.5) + 0.035 * (noise2(w * 31, id * 3.1, seed + 1) - 0.5);
  // it lands on the ridge under its foot: the picture's first solid pixel in that column
  let land = 1; const ix = Math.round(x(0.6) * S) - M.x0;
  if (ix >= 0 && ix < M.w) for (let r = 0; r < M.h; r++) if (M.data[(r * M.w + ix) * 4 + 3] > 128) { land = (M.y0 + r) / S; break; }
  const fw = BOLT.from + (0.35 + 0.2 * hash2(id, 2, seed)) * (land - BOLT.from), dir = hash2(id, 3, seed) > 0.5 ? 1 : -1;
  const flash = phase === 0 || phase === 2 ? 1 : phase === 1 || phase === 3 ? 0.4 : 0, glow = 1 - phase / BOLT.glow;
  const fork: [number, number, number] = [fw, fw + 0.4 * (land - fw), dir * 0.6], hw = 2.5 / S;
  let lo = Infinity, hi = -Infinity; for (let w = BOLT.from; w <= land + 0.02; w += 0.01) { const v = x(w); if (v < lo) lo = v; if (v > hi) hi = v; }
  const fx0 = x(fw), fx1 = fx0 + (fork[1] - fw) * fork[2], lx = x(land);
  const boxes: [number, number, number, number][] = [
    [lo - hw, BOLT.from, hi + hw, land + 0.03],
    [Math.min(fx0, fx1) - hw, fw, Math.max(fx0, fx1) + hw, fork[1]],
    [lx - BOLT.reach, land - BOLT.reach, lx + BOLT.reach, land + BOLT.reach],
  ];
  const b: Bolt = { key: `${id}|${phase}`, x, from: BOLT.from, land: [lx, land], fork, flash, glow, boxes };
  return b;
}
// the rock near where it lands lights up with the flash and fades with the glow
function litBy(c: { v: number; c: number; o: boolean; fade?: number; s?: number }, x: number, y: number, S: number, B: Bolt) {
  const d = Math.hypot((x + 0.5) / S - B.land[0], (y + 0.5) / S - B.land[1]) / BOLT.reach;
  if (d >= 1) return c;
  const k = (1 - d) * (1 - d);
  return { ...c, v: Math.min(1, c.v + k * (0.35 * B.glow + 0.4 * B.flash)), s: undefined };
}
// the bolt itself: a line a cell or two wide, wider in the flash, with one fork
function boltCell(x: number, y: number, S: number, B: Bolt) {
  const X = (x + 0.5) / S, W = (y + 0.5) / S, hw = (0.6 + 0.6 * B.flash) / S;
  if (W < B.from || W > B.land[1] + 0.02) return null;
  const on = Math.abs(X - B.x(W)) < hw || (W > B.fork[0] && W < B.fork[1] && Math.abs(X - (B.x(B.fork[0]) + (W - B.fork[0]) * B.fork[2])) < hw * 0.7);
  return on ? { v: 0.45 + 0.55 * Math.max(B.glow, B.flash), c: MAT.snow, o: true, tex: true } : null;
}

// `s: 1` marks a cell that never changes with `t` (the picture, the ridges, the moon, the haze, the stars and
// the empty sky), so the field works it out once (0218). Anything that reads `t` must leave it unset.
// With parallax (`P`) the field works those cells out again whenever the layers move.
// `sky: 1` marks a moving cell that no ridge covers (the planet); while the layers stay put the field
// passes `open` for it, so the planet's cells skip the search through the picture's layers.
export function sceneCell(x: number, y: number, t: number, cols: number, S: number, seed: number, shot: Shot = 'hero', M: Mountains | null = null, P: Par | null = null, open = false): { v: number; c: number; o?: boolean; fade?: number; tex?: boolean; s?: number; sky?: number } {
  const u = x / Math.max(1, cols), w = y / S, sh = SHOTS[shot];
  const B = shot === 'hero' ? boltAt(t, seed, cols, S, M) : null;
  if (open) { /* no ridge here */ } else if (sh.ridge && M) {
    const ix = x - M.x0, iy = y - M.y0;
    if (ix >= 0 && iy >= 0 && ix < M.w && iy < M.h) {
      if (P && M.layer) { const hit = sunk(M, ix, iy, cols, S, P); if (hit) { const r = rock(M, hit.fx, hit.q, y, S, sh.foot); return B ? litBy(r, x, y, S, B) : r; } }
      else if (M.data[(iy * M.w + ix) * 4 + 3] >= 128) { const r = rock(M, ix, iy, y, S, sh.foot); return B ? litBy(r, x, y, S, B) : r; }
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
    if (depth * S < 1.6 + 2.5 * high * high) return { v: Math.min(1, (lit ? 0.92 : 0.6) + grain) * fadeOut, c: high > 0.62 ? MAT.snow : MAT.rock, o, s: 1 };
    const v = (lit ? r.lit : r.dark) + grain;
    return { v: Math.max(0, Math.min(1, v)) * fadeOut, c: lit ? MAT.rock : MAT.shade, o, s: 1 };
  }
  }
  // the bolt is behind the peaks (they were drawn first) and in front of the planet
  if (B) { const b = boltCell(x, y, S, B); if (b) return b; }
  // the planet: huge, low, to the right, lit from the upper left, its round edge in view
  // portrait: sized to the width and raised, so its round edge shows under the chrome
  const portrait = cols < S, b = portrait ? sh.port : sh.land;
  const R = b.R * (portrait ? cols : S), cx = (b.cx + (P ? P.planet[1] : 0)) * cols, cy = (b.cy + (P ? P.planet[0] : 0)) * S;
  const dx = (x + 0.5 - cx) / R, dy = (y + 0.5 - cy) / R, r2 = dx * dx + dy * dy;
  if (r2 < 1) {
    const nz = Math.sqrt(1 - r2);
    const lam = Math.max(0, -0.55 * dx - 0.5 * dy + 0.67 * nz);
    if (b.moon) {
      // a moon: no bands, darker seas and a few craters, the same light
      const sea = fbm(dx * 2.2 + 5, dy * 2.2, seed + 3, 3), pit = fbm(dx * 7, dy * 7, seed + 9, 2);
      const v = (0.08 + 0.92 * lam) * (sea < 0.47 ? 0.6 : 0.95) * (pit > 0.68 ? 0.7 : 1);
      return { v: v < 0.07 ? 0 : Math.min(1, v), c: sea < 0.47 ? MAT.brown : MAT.cream, o: true, s: 1 };
    }
    const lon = Math.atan2(dx, nz);
    const turb = fbm(lon * 2.4 + t * 0.012, dy * 9, seed, 3);
    const band = Math.sin(dy * 15 + turb * 3.2);
    // the band picks the material and its weight; the light shapes the sphere
    const [c, weight] = band > 0.55 ? [MAT.cream, 1] : band > 0 ? [MAT.orange, 0.86] : band > -0.55 ? [MAT.rust, 0.7] : [MAT.brown, 0.56];
    const v = (0.06 + 0.94 * lam) * weight * (0.9 + 0.2 * turb);
    return { v: v < 0.07 ? 0 : Math.min(1, v), c, o: true, sky: 1 };
  }
  // a thin haze just outside the lit limb
  if (r2 < 1.06 * 1.06) { const lam = Math.max(0, -0.55 * dx - 0.5 * dy); if (lam > 0.2) return { v: 0.16 * lam, c: MAT.cream, s: 1 }; }
  // the sky: a few stars, more of them higher up
  const sx = P ? Math.round(x - P.stars[1] * cols) : x, sy = P ? Math.round(y - P.stars[0] * S) : y, s = hash2(sx, sy, seed + 99);
  if (s > 0.992 - 0.01 * Math.max(0, 0.5 - sy / S)) return { v: 0.18 + 0.2 * hash2(sx, sy, seed + 7), c: MAT.star, s: 1 };
  return { v: 0, c: MAT.star, s: 1 };
}
