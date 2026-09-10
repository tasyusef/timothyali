// Deterministic helpers. Everything generated on the site comes from these, so a
// given seed always draws the same texture.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Integer lattice hash in [0,1).
export function hash2(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 982451653) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const fade = (t: number) => t * t * (3 - 2 * t);
// Smooth value noise in [0,1).
export function noise2(x: number, y: number, seed = 0) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = fade(x - x0), fy = fade(y - y0);
  const a = hash2(x0, y0, seed), b = hash2(x0 + 1, y0, seed);
  const c = hash2(x0, y0 + 1, seed), d = hash2(x0 + 1, y0 + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
export function fbm(x: number, y: number, seed = 0, octaves = 3) {
  let v = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < octaves; i++) { v += amp * noise2(x * f, y * f, seed + i * 17); norm += amp; amp *= 0.5; f *= 2; }
  return v / norm;
}
// 8×8 Bayer ordered-dither matrix, values 0..63.
export const BAYER8 = (() => {
  const m = [[0, 2], [3, 1]];
  let cur = m;
  for (let s = 2; s < 8; s *= 2) {
    const next: number[][] = [];
    for (let y = 0; y < s * 2; y++) { next.push([]); for (let x = 0; x < s * 2; x++) {
      const q = (y >= s ? 1 : 0) * 2 + (x >= s ? 1 : 0);
      next[y][x] = cur[y % s][x % s] * 4 + [0, 2, 3, 1][q];
    } }
    cur = next;
  }
  return cur;
})();
export const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
