import type { Action } from 'svelte/action';

interface RevealOptions {
	/** Transition delay in ms (matches the old ScrollReveal `delay` prop). */
	delay?: number;
	/** IntersectionObserver bottom margin — element reveals once it's this far into view. */
	margin?: string;
}

/**
 * Scroll-triggered entrance reveal. Pairs with the `.reveal` / `.reveal-visible`
 * classes in app.css. Reduced motion is handled in CSS, so observation still
 * runs but the transition is disabled.
 *
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 100 }}>
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const { delay = 0, margin = '-80px' } = options ?? {};

	node.classList.add('reveal');
	if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('reveal-visible');
					observer.disconnect();
				}
			}
		},
		{ rootMargin: `0px 0px ${margin} 0px` }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
