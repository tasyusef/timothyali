// The primitives that JavaScript also needs. Mirrors src/lib/styles/primitives.css;
// keep the two in step. CSS is the source of truth for anything CSS can express —
// this file exists because canvases, the theme-color meta tag and the kinetic-type
// timings are set from script.
//
// src/app.html carries the same ink hex inline, because that script runs before any
// stylesheet or module loads. It is the one deliberate duplicate.

/** Colour primitives. */
export const INK = '#11110e';
export const WHITE = '#f4f4f0';
export const YELLOW = '#f2d600';

/** The spacing unit. Every layout number on the site is a multiple of it. */
export const U = 8;

/** The three grid cells (decision 0054). */
export const CELL_TEXT = 8;
export const CELL_IMAGE = 2;
export const CELL_TEXTURE = 16;

/** Ascii ambient cadence, ms per field step. */
export const TICK_SLOW = 160;
export const TICK_FAST = 90;

/** Decode cadence, ms per character. */
export const STEP_SLOW = 110;
export const STEP = 70;
export const STEP_FAST = 55;
