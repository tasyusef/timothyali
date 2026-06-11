import type { Action } from 'svelte/action';

interface FocusTrapOptions {
	/** Called when the user presses Escape inside the trap. */
	onEscape?: () => void;
	/** Move focus to the first focusable element on mount (default true). */
	autofocus?: boolean;
}

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus within the node (for modal overlays: mobile nav, lightbox),
 * wires up Escape-to-close, and returns focus to the previously focused
 * element when the trap is destroyed.
 */
export const focusTrap: Action<HTMLElement, FocusTrapOptions | undefined> = (node, options) => {
	const { onEscape, autofocus = true } = options ?? {};

	const previouslyFocused =
		document.activeElement instanceof HTMLElement ? document.activeElement : null;

	if (autofocus) {
		const first = node.querySelector<HTMLElement>(FOCUSABLE);
		first?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onEscape?.();
			return;
		}
		if (e.key !== 'Tab') return;

		const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	document.addEventListener('keydown', onKeydown);

	return {
		destroy() {
			document.removeEventListener('keydown', onKeydown);
			previouslyFocused?.focus();
		}
	};
};
