/**
 * Animation tokens — the Svelte counterpart of the old framer-motion config.
 * Durations/delays are in milliseconds (Svelte transitions expect ms).
 */

export const duration = { fast: 300, normal: 600, slow: 800, page: 400, entrance: 700 };
export const delay = { stagger: 100, section: 200, hero: 250 };

/** Spring presets for svelte/motion `Spring` (stiffness/damping are 0–1). */
export const spring = {
	cursor: { stiffness: 0.2, damping: 0.7 }
};

/**
 * cubic-bezier(0.4, 0, 0.2, 1) as a Svelte easing function — the same
 * "swiss" ease the CSS tokens use, for transition:fade/slide parity.
 */
export const easeSwiss = cubicBezier(0.4, 0, 0.2, 1);

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
	const sampleX = (t: number) => 3 * t * (1 - t) * (1 - t) * x1 + 3 * t * t * (1 - t) * x2 + t ** 3;
	const sampleY = (t: number) => 3 * t * (1 - t) * (1 - t) * y1 + 3 * t * t * (1 - t) * y2 + t ** 3;

	return (x: number): number => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		// Binary search for the bezier parameter t where sampleX(t) === x
		let lo = 0;
		let hi = 1;
		let t = x;
		for (let i = 0; i < 24; i++) {
			const cx = sampleX(t);
			if (Math.abs(cx - x) < 1e-5) break;
			if (cx < x) lo = t;
			else hi = t;
			t = (lo + hi) / 2;
		}
		return sampleY(t);
	};
}

/** True when the user prefers reduced motion (false during SSR). */
export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
