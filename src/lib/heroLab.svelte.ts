// The hero's motion lab (PX-139, mock): parallax as the page scrolls and a slow side-to-side pan,
// both off unless the dev-only /dev/hero/ route turns them on. Home reads it, so the lab tunes the real page.
export const heroLab = $state({ parallax: false, far: 0.8, mid: 0.9, planet: 0.6, stars: 0.5, pan: false, amount: 0.03, period: 40, cell: 0 });
// `cell`: the scene's grain in px, 0 for the Band's own (0243: 6 dark, 4 light)
