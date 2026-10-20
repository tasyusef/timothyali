/** A counter at a fixed width, “01”, “008” (0210: the studies, the index and the Toolbox examples each had one). */
export const pad = (n: number, width = 2) => String(n).padStart(width, '0');
