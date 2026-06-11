/**
 * Theme state — a tiny runes-based store. The initial value is read from
 * the DOM (set pre-hydration by the inline script in app.html).
 */

export type Theme = 'dark' | 'light';

function initialTheme(): Theme {
	if (typeof document === 'undefined') return 'dark';
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

let current = $state<Theme>(initialTheme());

export const theme = {
	get current() {
		return current;
	},
	toggle() {
		if (typeof document === 'undefined') return;
		current = current === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = current;
		localStorage.setItem('theme', current);
	}
};
