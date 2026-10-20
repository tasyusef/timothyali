// The primitives that JavaScript also needs. Mirrors src/lib/styles/primitives.css;
// keep the two in step. CSS is the source of truth for anything CSS can express —
// this file exists because canvases, the theme-color meta tag and the kinetic-type
// timings are set from script.
//
// src/app.html carries the same ink hex inline, because that script runs before any
// stylesheet or module loads. It is the one deliberate duplicate.

/** Colour primitives. */
export const INK = '#181814';
export const WHITE = '#efefeb';
export const YELLOW = '#f2d600';
export const YELLOW_DEEP = '#6f6200';  /* the accent as text on the light ground */
export const YELLOW_FIELD = '#c8ac00'; /* the accent in a field on the light ground (0108) */
/** A hex colour as [r, g, b], for the tools that write pixels. */
export const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** The spacing unit. Every layout number on the site is a multiple of it. */
export const U = 8;

/** The breakpoints (0076), as max-widths: the CSS media queries use the same four numbers. */
export const BP = { xs: 420, phone: 700, tablet: 900, laptop: 1100 } as const;
/** A media query for "at or below" a breakpoint, for matchMedia and <source media>. */
export const below = (bp: keyof typeof BP) => `(max-width: ${BP[bp]}px)`;
/** The gap between figures in a gallery row: --s2 (0210; figureHeight and rowColumns used the number 16). */
export const GALLERY_GAP = 2 * U;

/** The image and texture cells (decision 0054); text sits on the unit, U. */
export const CELL_IMAGE = 2;
export const CELL_TEXTURE = 16;

/** Ascii ambient cadence, ms per field step. */
export const TICK_SLOW = 160;
export const TICK_FAST = 90;

/** Decode cadence, ms per character. */
export const STEP_SLOW = 110;
export const STEP = 70;
export const STEP_FAST = 55;
