// The hero's motion (PX-139, 0244): parallax as the page scrolls and a slow side-to-side pan, at
// the values Timothy picked in the dev-only /dev/hero/ lab. Home reads this, so the lab tunes the real page.
const LIVE = { parallax: true, far: 0.8, mid: 0.9, planet: 0.6, stars: 0.5, pan: true, amount: 0.015, period: 30, cell: 0 };
export const heroLab = $state({ ...LIVE });
// `cell`: the scene's grain in px, 0 for the Band's own (0243: 6 dark, 4 light)
export const resetHeroLab = () => Object.assign(heroLab, LIVE);
