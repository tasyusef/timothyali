import type { Action } from 'svelte/action';

/**
 * Moves the node to <body> on mount — the Svelte equivalent of React's
 * createPortal. Used by fixed-position overlays (cursor preview) so a
 * transformed ancestor (e.g. a `.reveal` wrapper mid-transition) can't
 * break their positioning.
 */
export const portal: Action<HTMLElement> = (node) => {
	document.body.appendChild(node);
	return {
		destroy() {
			node.remove();
		}
	};
};
