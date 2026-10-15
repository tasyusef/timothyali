// A scene for each case study's head strip (0179), loosely after its project, all in the
// landing's world: the same materials and palettes, glyphs in dark mode, dither in light.
// Timothy's list: Sonde a weather balloon, Pocketwatch a cityscape, Toolbox a planet being
// assembled, PARC a rowboat off an island, First Ledger big candlesticks (0180),
// xrp.cafe a big coffee cup with the coffee moving, Jade still water under a jade moon,
// FirstStrike a lightning strike, Do Androids Dream? a sun with beams behind a lone figure.
//
// Every scene is measured in strip heights: X runs 0 … cols/S across, Y 0 … 1 down, so a
// shape keeps its size whether the strip is drawn in glyphs or at twice the cells in dither.
// The focal shapes sit right of centre, clear of the title. `t` counts the field's ticks.
import { fbm, hash2, noise2 } from '$lib/prng';
import { MAT } from '$lib/scene';

type Cell = { v: number; c: number; o?: boolean; tex?: boolean; fade?: number };
type Scene = (X: number, Y: number, A: number, t: number, seed: number, x: number, y: number) => Cell;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const NONE: Cell = { v: 0, c: MAT.star };
// drawn as it is in both themes: no rock-by-its-shadows inversion in the dither
const ink = (v: number, c: number): Cell => ({ v: clamp(v), c, o: true, tex: true });
// stars: sparse, and like the hero's, left out of the light-mode print
const star = (x: number, y: number, seed: number, rate = 0.988): Cell => {
  const s = hash2(x, y, seed + 99);
  return s > rate ? { v: 0.18 + 0.2 * hash2(x, y, seed + 7), c: MAT.star } : NONE;
};
const frac = (v: number) => v - Math.floor(v);
// a lit sphere: null outside, else its offsets and the light on it (from the upper left)
function sphere(X: number, Y: number, cx: number, cy: number, R: number) {
  const dx = (X - cx) / R, dy = (Y - cy) / R, r2 = dx * dx + dy * dy;
  if (r2 >= 1) return null;
  const nz = Math.sqrt(1 - r2);
  return { dx, dy, nz, r2, lam: Math.max(0, -0.55 * dx - 0.5 * dy + 0.67 * nz) };
}
// the giant's banded face, as on the landing
function giant(s: { dx: number; dy: number; nz: number; lam: number }, t: number, seed: number): Cell {
  const lon = Math.atan2(s.dx, s.nz);
  const turb = fbm(lon * 2.4 + t * 0.008, s.dy * 9, seed, 3);
  const band = Math.sin(s.dy * 15 + turb * 3.2);
  const [c, weight] = band > 0.55 ? [MAT.cream, 1] : band > 0 ? [MAT.orange, 0.86] : band > -0.55 ? [MAT.rust, 0.7] : [MAT.brown, 0.56];
  const v = (0.06 + 0.94 * s.lam) * weight * (0.9 + 0.2 * turb);
  return v < 0.07 ? NONE : ink(v, c);
}
// distance from a point to a segment, in strip heights
function seg(X: number, Y: number, x0: number, y0: number, x1: number, y1: number) {
  const vx = x1 - x0, vy = y1 - y0, k = clamp(((X - x0) * vx + (Y - y0) * vy) / (vx * vx + vy * vy || 1));
  return Math.hypot(X - x0 - k * vx, Y - y0 - k * vy);
}
const LINE = 0.016; // about one glyph cell on a desktop strip

const sonde: Scene = (X, Y, A, t, seed, x, y) => {
  const bx = A * 0.74, sway = Math.sin(t * 0.05) * 0.035;
  // the balloon, lit; its tether and the instrument box swinging under it
  const b = sphere(X, Y, bx, 0.25, 0.15);
  if (b) return ink(0.2 + 0.8 * b.lam, MAT.snow);
  if (Y > 0.39 && Y < 0.66 && Math.abs(X - (bx + (sway * (Y - 0.39)) / 0.27)) < LINE * 0.7) return ink(0.75, MAT.snow);
  if (Math.abs(X - bx - sway) < 0.03 && Math.abs(Y - 0.68) < 0.025) return ink(0.95, MAT.orange);
  // cloud banks drifting under it
  if (Y > 0.48) {
    const n = fbm(X * 3 + t * 0.01, Y * 9, seed, 3), cloud = (n - 0.42) * 3 * clamp((Y - 0.48) / 0.15);
    if (cloud > 0.08) return ink(cloud, n > 0.6 ? MAT.rock : MAT.shade);
  }
  return star(x, y, seed);
};

const city: Scene = (X, Y, A, t, seed, x, y) => {
  // drawn, not shaded (0182): every building outlined, windows on the cell grid, crowns and
  // masts on the roofline, so the skyline reads as a city in the light-mode print too
  const u = x > 0 ? X / x : 1 / 64; // one cell, in strip heights
  // the clock tower (a nod to the watch): a round face, two hands that turn
  const tx = A * 0.84, face = Math.hypot(X - tx, Y - 0.24);
  if (face < 0.07) {
    const turn = t * 0.012, m = seg(X, Y, tx, 0.24, tx + 0.055 * Math.sin(turn), 0.24 - 0.055 * Math.cos(turn)), h = seg(X, Y, tx, 0.24, tx + 0.035 * Math.sin(turn / 12), 0.24 - 0.035 * Math.cos(turn / 12));
    if (m < LINE * 0.6 || h < LINE * 0.8) return ink(1, MAT.snow);
    if (face > 0.058) return ink(1, MAT.rock);
    return ink(0.85, MAT.cream);
  }
  const td = Math.abs(X - tx);
  if (td < 0.075 && Y > 0.15) {
    if (Y < 0.17 || td > 0.075 - u * 1.5) return ink(1, MAT.rock);
    return x % 4 === 1 && y % 5 > 1 && Y > 0.33 ? ink(0.25, MAT.rock) : ink(0.78, MAT.rock);
  }
  // the front row: a block per lot, some with a stepped crown, some with a mast
  const fw = 0.11;
  const fTop = (X: number) => {
    const s = Math.floor(X / fw), f = frac(X / fw);
    if (f >= 0.86) return 2;
    const top = 0.5 + 0.26 * hash2(s, 1, seed);
    return hash2(s, 4, seed) > 0.5 && (f < 0.2 || f > 0.66) ? top + 0.05 : top;
  };
  const ft = fTop(X);
  if (Y > ft) {
    if (fTop(X - u) > Y || fTop(X + u) > Y || Y - u < ft) return ink(1, MAT.rock);
    if (x % 3 === 1 && y % 3 === 1 && Y > ft + 3 * u) {
      const lit = hash2(x, y + Math.floor(t / 37 + hash2(Math.floor(X / fw), 3, seed) * 9) * 101, seed);
      return lit > 0.55 ? ink(1, lit > 0.85 ? MAT.orange : MAT.cream) : ink(0.45, MAT.rock);
    }
    return ink(0.92, MAT.rock);
  }
  const fs = Math.floor(X / fw), mx = (fs + 0.43) * fw;
  if (hash2(fs, 5, seed) > 0.6 && Math.abs(X - mx) < u * 0.6 && Y > ft - 0.09 && Y <= ft) return Y < ft - 0.08 ? ink(1, MAT.orange) : ink(1, MAT.rock);
  // the row behind: paler, outlined, a few windows
  const bw = 0.07, bTop = (X: number) => (frac((X + 0.03) / bw) < 0.9 ? 0.38 + 0.24 * hash2(Math.floor((X + 0.03) / bw), 2, seed) : 2);
  const bt = bTop(X);
  if (Y > bt) {
    if (bTop(X - u) > Y || bTop(X + u) > Y || Y - u < bt) return ink(0.6, MAT.shade);
    if (x % 3 === 1 && y % 4 === 2 && hash2(x, y, seed + 11) > 0.8) return ink(0.8, MAT.cream);
    return ink(0.2, MAT.shade);
  }
  return star(x, y, seed);
};

const toolbox: Scene = (X, Y, A, t, seed, x, y) => {
  // a planet being put together: solid up to a seam that sweeps across, wireframe past it
  const s = sphere(X, Y, A * 0.74, 0.55, 0.42);
  if (s) {
    const lon = Math.atan2(s.dx, s.nz), lat = Math.asin(Math.max(-1, Math.min(1, s.dy)));
    const seam = -Math.PI / 2 + frac(t * 0.0025) * (Math.PI + 0.6);
    if (lon < seam - 0.06) return giant(s, t, seed);
    if (lon < seam + 0.02) return ink(1, MAT.orange); // the welding line
    const step = Math.PI / 12, gl = Math.abs(frac(lon / step + 0.5) - 0.5) * step * s.nz, gt = Math.abs(frac(lat / step + 0.5) - 0.5) * step;
    if (gl < 0.035 || gt < 0.035 || s.r2 > 0.93) return ink(0.55 + 0.3 * s.lam, MAT.rock);
    return NONE;
  }
  return star(x, y, seed);
};

// the palm's fronds as line segments, worked out once per tick and crown rather than once per cell (0207)
let fronds: number[][] = [], frondsKey = '';
function palmFronds(cx: number, cy: number, t: number) {
  const key = `${cx},${t}`; if (key === frondsKey) return fronds;
  frondsKey = key; fronds = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 5) * Math.PI * 0.9 + 0.15 + Math.sin(t * 0.04 + k) * 0.04;
    let px = cx, py = cy;
    for (let r = 0.025; r <= 0.13; r += 0.025) { const nx = cx + Math.cos(a) * r, ny = cy - Math.sin(a) * r * 0.6 + 2.2 * r * r; fronds.push([px, py, nx, ny]); px = nx; py = ny; }
  }
  return fronds;
}
const parc: Scene = (X, Y, A, t, seed) => {
  const H = 0.6, ix = A * 0.82;
  // the palm on its island: a bent trunk, fronds drooping from the crown
  const crown = { x: ix + 0.04, y: 0.33 };
  // the fronds reach 0.13 from the crown, and droop at most 0.04 below it
  if (Math.abs(X - crown.x) < 0.13 + LINE && Y > crown.y - 0.1 && Y < crown.y + 0.06) {
    for (const [x0, y0, x1, y1] of palmFronds(crown.x, crown.y, t)) if (seg(X, Y, x0, y0, x1, y1) < LINE * 0.9) return ink(0.95, MAT.jade);
  }
  if (Y > crown.y && Y < H - 0.02) { const tx = ix + 0.04 * ((H - 0.02 - Y) / (H - 0.02 - crown.y)) ** 2; if (Math.abs(X - tx) < LINE * 0.8) return ink(0.9, MAT.brown); }
  const isl = (X - ix) / 0.26;
  if (Y < H + 0.02 && Y > H - 0.07 * (1 - isl * isl)) return ink(0.85, MAT.cream);
  // the rowboat, bobbing, its oar dipping
  const bx = A * 0.56 + Math.sin(t * 0.02) * 0.02, by = H + 0.03 + Math.sin(t * 0.07) * 0.006;
  if (Y > by - 0.03 && Y < by && Math.abs(X - bx) < 0.08 - (Y - by + 0.03) * 0.9) return ink(0.95, MAT.brown);
  if (Math.hypot(X - bx, Y - (by - 0.055)) < 0.022) return ink(0.9, MAT.rust);
  const oa = Math.sin(t * 0.07) * 0.25;
  if (seg(X, Y, bx + 0.01, by - 0.04, bx + 0.11 * Math.cos(oa), by + 0.04 + 0.06 * Math.sin(oa)) < LINE * 0.6) return ink(0.85, MAT.brown);
  // the sea: lines of swell under the horizon
  if (Y > H) { const ripple = frac((Y - H) * 28 + 0.35 * Math.sin(X * 5 + t * 0.06)); return ink(ripple < 0.3 ? 0.5 : 0.14, ripple < 0.3 ? MAT.rock : MAT.shade); }
  // a low sun and blocky pixel clouds in a day sky
  const sun = Math.hypot(X - A * 0.95, Y - 0.2);
  if (sun < 0.08) return ink(0.9, MAT.cream);
  const cb = 0.045, n = fbm(Math.floor(X / cb) * 0.35 + t * 0.01, Math.floor(Y / cb) * 0.7, seed, 2);
  if (Y < 0.45 && n > 0.6) return ink(0.5, MAT.rock);
  return NONE;
};

const ledger: Scene = (X, Y, A, t, seed, x, y) => {
  // big candlesticks across the whole strip, behind the title (0180, no giant): a wide body from open to close, a wick above and below
  // to the high and the low; up in green, down in rust; the newest one still trading,
  // the chart stepping along
  const w = 0.42, x0 = 0, shift = Math.floor(t / 60);
  if (X > x0) {
    const k = Math.floor((X - x0) / w), i = k + shift, f = frac((X - x0) / w);
    const last = Math.floor((A - x0) / w);
    const base = 0.5 + 0.28 * Math.sin(i * 0.9 + seed), move = (hash2(i, 5, seed) - 0.5) * 1.1 + (k === last ? 0.06 * Math.sin(t * 0.2) : 0);
    const d = Math.sign(move || 1) * Math.max(0.38, Math.abs(move));
    const open = base - d / 2, close = base + d / 2, top = Math.min(open, close), bot = Math.max(open, close);
    const high = top - 0.1 - 0.18 * hash2(i, 6, seed), low = bot + 0.1 + 0.18 * hash2(i, 7, seed); // tall: they run off the strip
    const c = close < open ? MAT.jade : MAT.rust; // up in green (0181), down in rust
    if (f > 0.18 && f < 0.82 && Y > top && Y < bot) return ink(0.95, c);
    if (Math.abs(f - 0.5) < 0.035 && Y > high && Y < low) return ink(0.75, c);
  }
  return star(x, y, seed);
};

const cafe: Scene = (X, Y, A, t, seed) => {
  // a big mug, its coffee turning, steam rising off it
  const cx = A * 0.74, rim = 0.4, hw = (yy: number) => 0.34 - 0.05 * Math.max(0, yy - rim);
  const ex = (X - cx) / hw(rim), ey = (Y - rim) / 0.075, e = ex * ex + ey * ey;
  if (e < 0.8) {
    const ang = Math.atan2(ey, ex), rr = Math.sqrt(e);
    const swirl = Math.sin(ang * 2 + rr * 9 - t * 0.18) * 0.5 + 0.5 + (fbm(ex * 3 + t * 0.02, ey * 3, seed, 2) - 0.5) * 0.6;
    return swirl > 0.62 ? ink(0.8, MAT.cream) : ink(0.75 + 0.2 * swirl, swirl > 0.4 ? MAT.rust : MAT.brown);
  }
  if (e < 1) return ink(0.9, MAT.snow);
  const half = hw(Y);
  if (Y > rim && Math.abs(X - cx) < half) { const u = (X - cx) / half; return ink(0.3 + 0.6 * clamp(1 - (u + 0.35) ** 2), MAT.rock); }
  const hr = Math.hypot(X - (cx + hw(0.62) + 0.02), Y - 0.62);
  if (X > cx + hw(0.62) - 0.02 && Math.abs(hr - 0.1) < 0.03) return ink(0.75, MAT.rock);
  if (Y < rim - 0.05) {
    for (let k = -1; k <= 1; k++) {
      const sx = cx + k * 0.11 + 0.035 * Math.sin(Y * 16 + t * 0.12 + k * 2);
      if (Math.abs(X - sx) < LINE * 0.9 && frac(Y * 6 + t * 0.03 + k * 0.3) < 0.7) return { v: clamp(0.45 * (Y / (rim - 0.05))), c: MAT.star, o: true, tex: true };
    }
  }
  return NONE;
};

const jade: Scene = (X, Y, A, t, seed, x, y) => {
  // a pale jade moon over still water, its reflection breaking up in slow ripples
  const H = 0.55, mx = A * 0.74, my = 0.25, R = 0.15;
  const m = sphere(X, Y, mx, my, R);
  if (m) return ink(0.2 + 0.8 * m.lam, MAT.jade);
  if (Y < H && Y > H - 0.09 * fbm(X * 2, 0, seed, 2)) return ink(0.45, MAT.shade);
  if (Y >= H) {
    const ry = 2 * H - Y, rx = X + 0.018 * Math.sin(Y * 70 - t * 0.1);
    const r = sphere(rx, ry, mx, my + 0.04, R);
    if (r && frac(Y * 40 + 0.3 * Math.sin(X * 8 + t * 0.05)) < 0.65) return ink((0.3 + 0.6 * r.lam) * (1 - (Y - H) * 0.8), MAT.jade);
    if (frac((Y - H) * 22 + 0.25 * Math.sin(X * 3 + t * 0.04)) < 0.28) return ink(0.34, MAT.shade);
    return NONE;
  }
  return star(x, y, seed);
};

const strike: Scene = (X, Y, A, t, seed) => {
  // storm banks overhead; every few seconds a bolt to the plain, a double flicker, an afterglow
  const P = 64, phase = t % P, id = Math.floor(t / P), flash = phase === 0 || phase === 2 ? 1 : phase === 1 || phase === 3 ? 0.4 : 0;
  const glow = phase < 8 ? 1 - phase / 8 : 0, G = 0.84;
  const bx0 = A * (0.62 + 0.2 * hash2(id, 1, seed)), path = (yy: number) => bx0 + 0.14 * (noise2(yy * 13, id * 7.3, seed) - 0.5) + 0.05 * (noise2(yy * 41, id * 3.1, seed + 1) - 0.5);
  if (glow > 0 && Y > 0.3 && Y < G) {
    if (Math.abs(X - path(Y)) < LINE * (0.6 + 0.6 * flash)) return ink(0.4 + 0.6 * glow, MAT.snow);
    if (Y > 0.5 && Y < 0.66 && Math.abs(X - (path(0.5) + (Y - 0.5) * 0.7)) < LINE * 0.5) return ink(0.3 + 0.5 * glow, MAT.snow);
  }
  if (glow > 0 && Math.hypot(X - path(G), Y - G) < 0.05 + 0.04 * flash) return ink(0.5 + 0.5 * glow, MAT.cream);
  if (Y > G) return ink(0.32 + 0.1 * fbm(X * 6, Y * 20, seed, 2), MAT.brown);
  if (Y < 0.48) {
    const n = fbm(X * 2.4 + t * 0.004, Y * 6, seed, 3), v = (n - 0.26) * 2.4 * clamp((0.5 - Y) / 0.14);
    if (v > 0.05) return ink(v + flash * 0.35, flash || n > 0.55 ? MAT.rock : MAT.shade);
  }
  return NONE;
};

const androids: Scene = (X, Y, A, t) => {
  // a lone figure against a setting sun, its beams turning slowly; the figure in solid ink
  const cx = A * 0.86, cy = 0.56, G = 0.86; // far right: this title is long
  const fig = (Math.hypot(X - cx, Y - 0.45) < 0.042) || (Y > 0.49 && Y < G && Math.abs(X - cx) < 0.03 + (Y - 0.49) * 0.14);
  if (fig) return ink(1, MAT.night);
  if (Y > G) return ink(0.55, MAT.brown);
  const dx = X - cx, dy = Y - cy, d = Math.hypot(dx, dy);
  if (d < 0.3) return ink(0.95, dy < -0.12 ? MAT.cream : MAT.orange);
  const a = Math.atan2(dy, dx) / (Math.PI * 2);
  if (frac(a * 18 + t * 0.002) < 0.45) return ink(0.55 * clamp(1 - (d - 0.3) / 1.1), MAT.orange);
  return NONE;
};

const SCENES: Record<string, Scene> = {
  sonde, pocketwatch: city, toolbox, parc, firstledger: ledger, xrpcafe: cafe,
  'jade-aesthetics': jade, firststrike: strike, 'do-androids-dream': androids,
};
export const hasStudyScene = (slug: string) => slug in SCENES;

/** one cell of a study's strip; fades out over the strip's last quarter into the page */
export function studyCell(slug: string, x: number, y: number, t: number, cols: number, S: number, seed: number): Cell {
  const scene = SCENES[slug]; if (!scene) return NONE;
  // a strip narrower than 2.4 heights (a phone) shows the right part of a 2.4-wide scene, so
  // subjects placed for the desktop strip stay whole (0184); shifted by whole cells, so cell-grid detail stays put
  const off = Math.max(0, Math.round(2.4 * S) - cols), X = x + off;
  const Y = (y + 0.5) / S, f = scene((X + 0.5) / S, Y, (cols + off) / S, t, seed, X, y);
  const foot = clamp((1 - Y) / 0.25);
  return foot < 1 ? { ...f, v: f.v * foot } : f;
}
