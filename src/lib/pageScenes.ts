// Page scenes (0255): the Software desk's and each app page's own background, in the landing's world
// (its materials and palettes; glyphs in dark mode, dither in light), after Timothy's picks: Software
// the giant with four moons going round it, one per app in its own colour; Toolbox a white beam
// through a prism, fanned into bands of colour that break into swatches; Gryphon a keep on a crag
// under a crescent moon, its banners in the wind.
//
// Measured like the studies' strips, in heights of the field's span: X runs 0 … A across, Y 0 … 1
// down, and `px` is one CSS pixel in those units, so a line keeps its weight in glyphs and in the
// dither. Each scene places its subject apart for a desktop (right of the title, or round the open
// window) and a phone (beside the title). A cell that never changes says so (`s: 1`), so the field
// works it out once; only the moons, the light and the banners are worked out every tick.
import { fbm } from '$lib/prng';
import { MAT } from '$lib/scene';
import { clamp, frac, ink, star, sphere, giant, seg, type Cell as StudyCell } from '$lib/studyScenes';

type Cell = StudyCell & { s?: number };
type Scene = (X: number, Y: number, A: number, t: number, seed: number, x: number, y: number, px: number) => Cell;

const EMPTY: Cell = { v: 0, c: MAT.star, s: 1 };
const still = (c: Cell): Cell => ({ ...c, s: 1 });
const sky = (x: number, y: number, seed: number): Cell => { const s = star(x, y, seed); return s.v ? still(s) : EMPTY; };
// rock, drawn by its shadows in the light-mode print like the landing's mountains
const stone = (v: number, c: number): Cell => ({ v: clamp(v), c, o: true, s: 1 });

// Software: the giant sits behind the open window (880px, centred right of the 120px icons), a
// little left of its middle, so its lit limb shows past the window's left edge. Its moons are the
// apps, in the list's order and colours: Toolbox, Sonde, Gryphon, Tome. Each has its own orbit, wide
// enough to clear the giant and come out past the window, and tipped its own way, so where they turn
// they stand apart; at rest two wait on each side. The giant holds still; the moons go round.
const MOONS = [
  { c: MAT.yellow, r: 36, off: 64, b: 0.07, k: 0.03, at: 0 },
  { c: MAT.coral, r: 30, off: 92, b: 0.1, k: 0.13, at: Math.PI },
  { c: MAT.vermilion, r: 38, off: 120, b: 0.12, k: 0.22, at: -0.15 },
  { c: MAT.snow, r: 27, off: 148, b: 0.09, k: 0.05, at: Math.PI + 0.2 },
];
const moons: Scene = (X, Y, A, t, seed, x, y, px) => {
  const W = A / px, phone = W < 700;
  const mid = phone ? W / 2 : (W + 152) / 2, half = phone ? W / 2 - 16 : Math.min(440, mid - 184);
  const cx = (phone ? mid : mid - 40) * px, cy = phone ? 0.72 : 0.68, R = (phone ? half * 0.85 : half + 60) * px;
  let live = false, orbit = 0;
  const front: Cell[] = [], back: Cell[] = [];
  for (let i = 0; i < MOONS.length; i++) {
    const rm = MOONS[i].r * px * (phone ? 0.7 : 1), m = MOONS[i], a = Math.max(R + rm + 20 * px, Math.min(R + m.off * px, (W - 34) * px - cx));
    // inner moons go round faster (Kepler's third law), the first in about four minutes
    const ph = m.at + t * 0.0045 * Math.pow((R + 64 * px) / a, 1.5);
    const mx = cx + a * Math.cos(ph), my = cy + m.b * Math.sin(ph) - m.k * Math.cos(ph);
    const s = sphere(X, Y, mx, my, rm);
    if (s) {
      const sea = fbm(s.dx * 1.6 + i * 7, s.dy * 1.6, seed + i, 2);
      const cell = ink((0.12 + 0.88 * s.lam) * (sea < 0.42 ? 0.72 : 1), m.c);
      (Math.sin(ph) > 0 ? front : back).push(cell);
    }
    // the band each orbit sweeps: cells there change as a moon passes, so they stay live
    const c = (X - cx) / a;
    if (Math.abs(c) < 1 + rm / a + 2 * px) {
      const cc = Math.max(-1, Math.min(1, c)), sn = Math.sqrt(1 - cc * cc), yF = cy + m.b * sn - m.k * cc, yB = cy - m.b * sn - m.k * cc;
      const reach = rm * 1.6 + 4 * px;
      if (Math.abs(Y - yF) < reach || Math.abs(Y - yB) < reach || (Math.abs(cc) > 0.85 && Y > Math.min(yF, yB) && Y < Math.max(yF, yB))) live = true;
      // its path, dotted and faint, where the giant doesn't cover it
      if (!orbit && Math.abs(c) <= 1) {
        const onF = Math.abs(Y - yF) < 3 * px, onB = Math.abs(Y - yB) < 3 * px;
        if ((onF || onB) && frac(((onF ? 1 : -1) * Math.acos(cc)) * 9 / Math.PI) < 0.3) orbit = 1;
      }
    }
  }
  if (front.length) return front[0];
  const p = sphere(X, Y, cx, cy, R);
  if (p) { const g = giant(p, 0, seed); return live ? g : still(g); }
  if (back.length) return back[0];
  const keep = (c: Cell) => (live ? c : still(c));
  if (orbit) return keep(ink(0.2, MAT.shade));
  // the haze just outside the lit limb, as on the landing
  const dx = (X - cx) / R, dy = (Y - cy) / R, r2 = dx * dx + dy * dy;
  if (r2 < 1.06 * 1.06) { const lam = Math.max(0, -0.55 * dx - 0.5 * dy); if (lam > 0.2) return keep({ v: 0.16 * lam, c: MAT.cream }); }
  return live ? star(x, y, seed) : sky(x, y, seed);
};

// Toolbox: white light comes down from above, crosses the prism and leaves it fanned into six bands,
// red to violet, that break into rows of swatches further out (the palettes it exports). The light
// runs along the beam and the bands; the glass holds still.
const SPECTRUM = [MAT.vermilion, MAT.orange, MAT.yellow, MAT.jade, MAT.rock, MAT.shade];
const R3 = Math.sqrt(3);
const IN = (() => { const l = Math.hypot(0.42, 1); return [0.42 / l, 1 / l]; })();
const prism: Scene = (X, Y, A, t, seed, x, y, px) => {
  const wide = A >= 1.9;
  const L = wide ? Math.min(0.46, 0.2 * A) : Math.min(0.32, Math.max(0.24, 0.2 * A));
  const cx = wide ? A - 2 * L : A - 1.05 * L, cy = wide ? 0.47 : 0.3;
  const ax = cx, ay = cy - L / R3, bx = cx - L / 2, by = cy + L / (2 * R3), qx = cx + L / 2; // apex, left foot, right foot
  const ex = ax + 0.42 * (bx - ax), ey = ay + 0.42 * (by - ay); // where the light goes in, on the left face
  const ox = ax + 0.55 * (qx - ax), oy = ay + 0.55 * (by - ay); // and where it comes out, on the right
  const run = (d: number) => 0.9 + 0.1 * Math.sin(d * 26 - t * 0.14); // the light running along
  // the glass: its faces drawn, lit from the left; the light crossing it; a faint body
  const w = 3 * px;
  if (X > bx - w && X < qx + w && Y > ay - w && Y < by + w) {
    const dl = seg(X, Y, ax, ay, bx, by), dr = seg(X, Y, ax, ay, qx, by), db = seg(X, Y, bx, by, qx, by);
    if (dl < w) return still(ink(0.95, MAT.snow));
    if (dr < w) return still(ink(0.72, MAT.snow));
    if (db < w) return still(ink(0.5, MAT.rock));
    if (Y < by && Math.abs(X - ax) < (Y - ay) / R3) {
      const k = clamp(((X - ex) * (ox - ex) + (Y - ey) * (oy - ey)) / ((ox - ex) ** 2 + (oy - ey) ** 2));
      if (seg(X, Y, ex, ey, ox, oy) < (3 + 5 * k) * px) return ink(0.62 * run(k * 0.2), MAT.cream);
      return still(ink(0.1 + 0.12 * clamp((by - Y) / L), MAT.rock));
    }
  }
  // the beam, from above the frame down to the left face, with a soft edge
  const bs = (X - ex) * -IN[0] + (Y - ey) * -IN[1];
  if (bs > 0) {
    const d = Math.abs((X - ex) * IN[1] - (Y - ey) * IN[0]);
    if (d < 3 * px) return ink(0.95 * run(-bs), MAT.snow);
    if (d < 9 * px) return ink(0.32 * (1 - (d - 3 * px) / (6 * px)) * run(-bs), MAT.snow);
  }
  // the fan: six bands by angle, a dark rule between each; past the swatch line, rows of swatches
  const fx = X - ox, fy = Y - oy, r = Math.hypot(fx, fy), th = Math.atan2(fy, fx);
  const t0 = wide ? 0.12 : 0.62, t1 = wide ? 0.6 : 1.25;
  if (th > t0 && th < t1 && r > 2 * px) {
    const n = ((th - t0) / (t1 - t0)) * SPECTRUM.length, band = Math.floor(n), gap = (frac(n) * (t1 - t0) * r) / SPECTRUM.length;
    if (gap < 6 * px && r > 0.12) return EMPTY;
    const rs = wide ? 0.5 : 0.3, sw = wide ? 0.11 : 0.07;
    if (r > rs) return frac((r - rs) / sw) > 0.8 ? EMPTY : still(ink(0.9 - 0.25 * clamp(r / 1.1), SPECTRUM[band]));
    return ink((0.92 - 0.25 * clamp(r / 1.1)) * run(r), SPECTRUM[band]);
  }
  return sky(x, y, seed);
};

// Gryphon: a keep on a crag under a crescent moon, a far range behind. The moon, up to the right,
// lights it: like the landing's mountains, the stone is worked out from how much light each face
// catches and drawn by the landing's own curve and colours (`lum`), so it turns from shade through
// rock to snow as it faces the moon, with a grain of weathering, and no outlines. The banner on the
// keep is the only thing that moves.
const lum = (L: number): Cell => ({ v: Math.max(0.14, clamp((L - 0.12) / 0.66) ** 1.1), c: L > 0.66 ? MAT.snow : L > 0.4 ? MAT.rock : MAT.shade, o: true, s: 1 });
const SUN = [0.62, 0.42, 0.66]; // toward the moon: right, up, out of the page
const lit = (nx: number, ny: number, nz: number) => { const l = Math.hypot(nx, ny, nz) || 1; return Math.max(0, (nx * SUN[0] + ny * SUN[1] + nz * SUN[2]) / l); };
// ridged noise, the landing's: sharp crests, soft valleys
const ridged = (u: number, w: number, seed: number) => {
  let v = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < 4; i++) { const n = fbm(u * f, w * f + i * 3.1, seed + i * 7, 1); v += amp * (1 - Math.abs(2 * n - 1)); norm += amp; amp *= 0.5; f *= 2.1; }
  return v / norm;
};
const keepScene: Scene = (X, Y, A, t, seed, x, y, px) => {
  const W = A / px, phone = W <= 700;
  const k = Math.min(1, Math.max(0.6, (A - 1) / 1.47)), cs = phone ? 0.5 : 0.7 * k; // the peak's scale (1 on a desktop, .6 on a phone) and the castle's
  // the summit the keep stands on, clear of the title (which ends at 812px from 901 up and 552px down
  // to 701, and the field fades for 96px round it): out in the open right of it on a desktop, pushed
  // toward the right edge on a laptop, and on a phone at the right edge, low, beside the buttons
  const textR = W > 900 ? 812 : 552;
  const KX = phone ? A - 0.17 * cs - 24 * px : Math.min(A - 0.17 * cs - 16 * px, Math.max(A - (0.24 + (0.31 * (k - 0.6)) / 0.4), (textR + 104) * px + 0.21 * cs));
  const SY = phone ? 0.8 : 0.46 + (1 - k) * 0.1;
  const mx = (X - KX) / k, my = (Y - SY) / k; // the peak's coordinates
  const lx = (X - KX) / cs, ly = (Y - SY) / cs, e = (4 * px) / cs; // the castle's, and a line's width in them
  const grain = fbm(lx * 60, ly * 60, seed + 2, 2) - 0.5;
  // the moon: a crescent lit from the left, the rest of its face just showing, a little glow round it
  const mR = 0.08 * k, mX = phone ? A - mR - 12 * px : Math.min(KX + 0.36 * k, A - mR - 0.04), mY = phone ? 0.14 : 0.17;
  const md = Math.hypot(X - mX, Y - mY);
  if (md < mR) {
    if (Math.hypot(X - mX - 0.4 * mR, Y - mY) > 0.86 * mR) return still(ink(0.86 + 0.1 * fbm((X - mX) / mR * 2, (Y - mY) / mR * 2, seed + 4, 2), MAT.cream));
    return EMPTY; // its dark face hides the stars behind it
  }
  if (md < mR * 1.3 && X < mX + 0.3 * mR) return still({ v: 0.14 * (1 - (md - mR) / (0.3 * mR)), c: MAT.cream });
  // the banner: a swallowtail from the keep's pole, rippling downwind
  const pole = (3 * px) / cs;
  if (Math.abs(lx - 0.035) < pole && ly > -0.49 && ly < -0.34) return still(ink(0.8, MAT.snow));
  const d = lx - 0.035 - pole, len = 0.2;
  if (d >= 0 && d < len && ly > -0.5 && ly < -0.36) {
    const ph = (d / len) * 5 - t * 0.22, yc = -0.448 + 0.01 * Math.sin(ph) * (0.3 + d / len) + 0.02 * (d / len) ** 2, hh = 0.036 * (1 - (0.35 * d) / len);
    const off = Math.abs(ly - yc);
    if (off < hh && !(d > 0.8 * len && off < hh * 0.5)) return ink(0.82 + 0.14 * Math.cos(ph), MAT.vermilion);
    return sky(x, y, seed);
  }
  // the castle, nearest first: a turret with a spire, the square keep, a round tower, the curtain wall.
  // A tower is round, so the light runs across it; the keep is square, its right side catching the moon
  const crown = 0.026, gap = (x0: number) => frac((lx - x0) / 0.04) > 0.5; // merlons, and the gaps between
  const cap = (L: number, y0: number) => (ly < y0 - crown + e ? L + 0.18 : L); // a merlon's top catches the moon
  const stoneL = (l: number) => 0.08 + 0.66 * l ** 1.5; // built stone: fronts sit back, the moon side shines
  const foot = (L: number) => L * (1 - 0.12 * clamp((ly + 0.08) / 0.11)) + grain * 0.05; // the stone darkens a little toward the rock
  const tower = (c: number, r: number, y0: number, merlons: boolean) => {
    const u = (lx - c) / r; if (Math.abs(u) > 1 || ly > 0.03) return null;
    if (ly < y0 - (merlons ? crown : 0) || (merlons && ly < y0 && gap(c - r))) return null;
    return foot(cap(stoneL(lit(u, 0, Math.sqrt(1 - u * u))), y0));
  };
  // the turret's spire, a cone in Gryphon's rust, lit the same way, with a point at its tip
  if (ly > -0.35 && ly < -0.22) {
    const hw = ((ly + 0.35) / 0.13) * 0.034, u = (lx - 0.12) / Math.max(hw, 1e-6);
    if (Math.abs(u) <= 1) return still(ink(0.4 + 0.55 * lit(u, 0.5, Math.sqrt(1 - u * u)), MAT.rust));
  }
  // windows, narrow and arched, some lit; a gate in the keep's foot
  const win = (wx: number, wy: number) => Math.abs(lx - wx) < 0.008 && ly > wy - 0.022 && ly < wy + 0.018 && (ly > wy - 0.015 || Math.abs(lx - wx) < 0.004);
  if (win(-0.028, -0.24) || win(0.028, -0.15) || win(0.12, -0.16) || win(-0.17, -0.12)) return still(ink(0.95, MAT.orange));
  if (win(0.028, -0.24) || win(-0.028, -0.15)) return lum(0.04);
  if (Math.abs(lx) < 0.022 && ly < 0.03 && (ly > -0.04 || (lx / 0.022) ** 2 + ((ly + 0.04) / 0.022) ** 2 < 1)) return lum(0.04);
  const tw = tower(0.12, 0.03, -0.22, false);
  if (tw !== null) return lum(tw);
  if (lx > -0.07 && lx < 0.07 && ly < 0.03 && ly > -0.32 - crown && !(ly < -0.32 && gap(-0.07))) {
    const side = lx > 0.07 - 0.024;
    return lum(foot(cap(stoneL(side ? lit(0.75, 0, 0.66) : lit(0, 0, 1)), -0.32)));
  }
  const lt = tower(-0.17, 0.036, -0.19, true);
  if (lt !== null) return lum(lt);
  if (lx > -0.2 && lx < 0.17 && ly < 0.03 && ly > -0.1 - crown && !(ly < -0.1 && gap(-0.2))) {
    const shadow = lx < -0.07 && lx > -0.13 ? 0.6 : 1; // the keep's shadow on the wall
    return lum(foot(cap(stoneL(lit(0, 0, 1)) * 0.9 * shadow, -0.1)));
  }
  // the peak: shoulders the castle stands between, then flanks falling away, the left steeper, a lesser
  // summit on the right one, and both broken. Its rock is worked out as the landing's is: ridges falling
  // from the summit and crags across them, each lit on the side that turns to the moon, the right flank
  // more than the left, and snow where the light catches high up
  const jag = (ridged(mx * 5, 0.5, seed + 5) - 0.5) * 0.1 + (fbm(mx * 18, 2.5, seed + 6, 2) - 0.5) * 0.03;
  const away = clamp((Math.abs(mx) - 0.13) / 0.12);
  const surf = 0.012 + (fbm(mx * 22, 0.5, seed + 8, 2) - 0.5) * 0.012 + (mx < -0.16 ? 1.2 * (-0.16 - mx) ** 0.85 : mx > 0.13 ? 0.9 * (mx - 0.13) ** 0.9 - 0.11 * Math.exp(-(((mx - 0.42) / 0.09) ** 2)) : 0) + jag * away;
  if (my > surf) {
    const wq = (fbm(my * 3, 0.5, seed + 11, 2) - 0.5) * 0.8;
    const H = (u: number, w: number) => 0.7 * ridged((u / (w + 0.3)) * 1.5 + wq, w * 0.6, seed + 3) + 0.3 * ridged(u * 5 + fbm(u * 2, w * 4, seed + 13, 2), w * 4, seed + 17);
    const E = 0.006, facet = 0.5 - 0.5 * Math.tanh(((H(mx + E, my) - H(mx - E, my)) / (2 * E)) * 0.4);
    const mass = fbm(mx * 4, my * 4, seed + 19, 2) - 0.5; // light and dark masses of rock
    const macro = clamp(0.5 + mx * 1.4);
    const snow = my < 0.26 ? 0.3 * facet * (1 - my / 0.26) * (0.6 + 0.4 * macro) : 0;
    const top = Math.abs(mx) < 0.2 && my - surf < 0.02 ? 0.1 : 0; // the summit's top catches the moon, so the castle stands on it
    return lum(0.26 + 0.08 * macro + 0.44 * facet * facet * (0.4 + 0.6 * macro) + mass * 0.1 + snow + top + grain * 0.05);
  }
  // a far range behind, rising toward the peak out of the page's foot (none under the words), hazed,
  // its faces to the moon lit
  const rise = clamp((mx + 1.0) / 0.7), fr = (u: number) => 0.98 - 0.4 * rise * (0.35 + 0.65 * ridged(u * 2.2, 0, seed + 21));
  const ridge = fr(X);
  if (rise > 0 && Y > ridge) {
    const H = (u: number) => ridged(u * 9 + fbm(u, Y * 6, seed + 23, 2), Y * 5, seed + 25);
    const facet = 0.5 - 0.5 * Math.tanh(((H(X + 0.004) - H(X - 0.004)) / 0.008) * 0.12);
    const L = 0.14 + 0.18 * facet + (Y < ridge + 4 * px ? 0.08 : 0) + grain * 0.06;
    return { ...lum(L), fade: 0.35 }; // hazed: pale in the print too
  }
  return sky(x, y, seed);
};

const PAGES: Record<string, Scene> = { software: moons, toolbox: prism, gryphon: keepScene };

/** one cell of a page's scene; `foot` is the band's foot in the span's heights, where the scene fades
 * out over the last fifth into the page, and `H` the span's height in CSS pixels */
export function pageCell(name: string, x: number, y: number, t: number, cols: number, S: number, seed: number, foot: number, H: number): Cell {
  const scene = PAGES[name]; if (!scene) return EMPTY;
  const Y = (y + 0.5) / S, f = scene((x + 0.5) / S, Y, cols / S, t, seed, x, y, 1 / Math.max(1, H));
  // rock is printed by its shadows, so it fades by `fade` as well as `v` (the dither inverts `v`)
  const fade = clamp((foot - Y) / 0.2);
  return fade < 1 ? { ...f, v: f.v * fade, fade: (f.fade ?? 1) * fade } : f;
}
