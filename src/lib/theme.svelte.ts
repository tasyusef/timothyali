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
	set(next: Theme) {
		if (typeof document === 'undefined') return;
		current = next;
		document.documentElement.dataset.theme = next;
		localStorage.setItem('theme', next);
	},
	toggle() {
		this.set(current === 'dark' ? 'light' : 'dark');
	}
};
