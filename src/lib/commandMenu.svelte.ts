/**
 * Command menu open state — a runes-based store so triggers (Navigation,
 * StatusBar) and the menu itself (mounted once in +layout.svelte) stay in sync.
 */

let open = $state(false);

export const commandMenu = {
	get open() {
		return open;
	},
	show() {
		open = true;
	},
	hide() {
		open = false;
	},
	toggle() {
		open = !open;
	}
};
