// APCA 0.0.98G-4g and WCAG 2 ratios for the site's rendered text pairs (opacity mixed in sRGB, as the browser composites).
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const Y = ([r, g, b]) => 0.2126729 * (r / 255) ** 2.4 + 0.7151522 * (g / 255) ** 2.4 + 0.072175 * (b / 255) ** 2.4;
function apca(txt, bg) {
  let Yt = Y(txt), Yb = Y(bg); const bt = 0.022, bc = 1.414;
  Yt = Yt > bt ? Yt : Yt + (bt - Yt) ** bc; Yb = Yb > bt ? Yb : Yb + (bt - Yb) ** bc;
  let S; if (Yb > Yt) { S = (Yb ** 0.56 - Yt ** 0.57) * 1.14; return S < 0.1 ? 0 : (S - 0.027) * 100; }
  S = (Yb ** 0.65 - Yt ** 0.62) * 1.14; return S > -0.1 ? 0 : (S + 0.027) * 100;
}
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const wcag = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const INK = hex('#181814'), WHITE = hex('#efefeb'), Y1 = hex('#f2d600'), YD = hex('#6f6200'), YF = hex('#c8ac00');
const rows = [
  ['dark: fg on paper', WHITE, INK],
  ['dark: .dim (.55) fg on paper', mix(WHITE, INK, 0.55), INK],
  ['light: fg on paper', INK, WHITE],
  ['light: .dim (.65) fg on paper', mix(INK, WHITE, 0.65), WHITE],
  ['dark panel: .dim-on-fg (.65) ink on white', mix(INK, WHITE, 0.65), WHITE],
  ['light panel: .dim-on-fg (.55) white on ink', mix(WHITE, INK, 0.55), INK],
  ['dark: accent-text yellow on ink', Y1, INK],
  ['light: accent-text yellow-deep on white', YD, WHITE],
  ['on-accent ink on yellow', INK, Y1],
  ['field-ink 40% fg (dark)', mix(WHITE, INK, 0.4), INK],
  ['field-ink 40% fg (light)', mix(INK, WHITE, 0.4), WHITE],
  ['focus ring dark: yellow on white panel', Y1, WHITE],
  ['focus ring light: yellow-deep on ink panel', YD, INK],
  ['focus ring intended dark panel: yellow-deep on white', YD, WHITE],
  ['focus ring intended light panel: yellow on ink', Y1, INK],
  ['dark: .dim on fg cta hover? .cta:disabled .55 ink on yellow', mix(INK, Y1, 0.55), Y1],
];
for (const [n, t, b] of rows) console.log(n.padEnd(58), 'WCAG', wcag(t, b).toFixed(2).padStart(5), ' APCA Lc', apca(t, b).toFixed(1).padStart(6));
for (const a of [0.6, 0.65, 0.7, 0.75, 0.8]) console.log('dark dim', a, 'WCAG', wcag(mix(WHITE, INK, a), INK).toFixed(2), 'Lc', apca(mix(WHITE, INK, a), INK).toFixed(1));
