// Token contrast maths for the PX-125 audit (fable): WCAG 2 ratio and APCA Lc for the site's pairs,
// including the dim levels (an opacity, so the rendered colour is a blend over the ground).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const blend = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const toHex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const wcag = (f, b) => { const [a, c] = [lum(f), lum(b)].sort((x, y) => y - x); return ((a + 0.05) / (c + 0.05)).toFixed(2); };
// APCA 0.0.98G-4g
const apca = (f, b) => {
  const sc = (c) => { const r = (c / 255) ** 2.4; return r; };
  const Y = (c) => 0.2126729 * sc(c[0]) + 0.7151522 * sc(c[1]) + 0.0721750 * sc(c[2]);
  const clamp = (y) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414);
  let yt = clamp(Y(f)), yb = clamp(Y(b));
  if (Math.abs(yb - yt) < 0.0005) return 0;
  let sapc, out;
  if (yb > yt) { sapc = (yb ** 0.56 - yt ** 0.57) * 1.14; out = sapc < 0.1 ? 0 : sapc - 0.027; }
  else { sapc = (yb ** 0.65 - yt ** 0.62) * 1.14; out = sapc > -0.1 ? 0 : sapc + 0.027; }
  return (out * 100).toFixed(1);
};
const T = { yellow: '#f2d600', ink: '#181814', white: '#efefeb', deep: '#6f6200', field: '#c8ac00' };
const C = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, hex(v)]));
const rows = [];
const row = (name, f, b, note = '') => rows.push([name, toHex(f), toHex(b), wcag(f, b), apca(f, b), note]);
// dark theme
row('dark: fg on paper', C.white, C.ink);
row('dark: dim .55 fg on paper (labels, captions)', blend(C.white, C.ink, 0.55), C.ink);
row('dark: accent-text yellow on paper', C.yellow, C.ink);
row('dark: on-accent ink on yellow (cta, notes, active nav)', C.ink, C.yellow);
row('dark: panel text (paper on fg)', C.ink, C.white);
row('dark: panel dim .65 paper on fg', blend(C.ink, C.white, 0.65), C.white);
row('dark: panel accent-on-fg deep yellow on fg', C.deep, C.white);
row('dark: settings menu focus/hover fill: yellow on fg menu (adjacent)', C.yellow, C.white, 'the ring (accent-text = yellow) and the row fill sit on the white menu');
row('dark: settings menu ring deep? no: accent-text stays yellow', C.yellow, C.white);
row('dark: demo steps disabled .25', blend(C.white, C.ink, 0.25), C.ink, 'disabled, exempt');
row('dark: field-ink 40% fg over paper (decoration)', blend(C.white, C.ink, 0.4), C.ink, 'texture, not text');
row('dark: skip link paper on fg', C.ink, C.white);
// light theme
row('light: fg on paper', C.ink, C.white);
row('light: dim .65 fg on paper', blend(C.ink, C.white, 0.65), C.white);
row('light: accent-text deep yellow on paper', C.deep, C.white);
row('light: on-accent ink on yellow', C.ink, C.yellow);
row('light: panel text (paper on fg)', C.white, C.ink);
row('light: panel dim .55 paper on fg', blend(C.white, C.ink, 0.55), C.ink);
row('light: panel accent-on-fg yellow on fg', C.yellow, C.ink);
row('light: settings menu ring deep yellow on ink menu', C.deep, C.ink, 'ring colour vs the menu ground');
row('light: settings menu focus fill yellow on ink menu', C.yellow, C.ink);
row('light: field accent on paper (decoration)', C.field, C.white, 'texture, not text');
row('light: cta hover fg on paper', C.ink, C.white);
row('light: focus ring deep yellow against yellow cta fill', C.deep, C.yellow, 'ring is offset 2px onto the paper, so the paper pair applies');
row('dark: focus ring yellow against yellow cta fill', C.yellow, C.yellow, 'ring is offset 2px onto the paper, so the paper pair applies');
console.log(['pair', 'fg', 'bg', 'WCAG', 'APCA Lc', 'note'].join(' | '));
for (const r of rows) console.log(r.join(' | '));
