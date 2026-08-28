// Homepage work-section layout exploration — the dev-only switcher flips
// between these; delete the losers once a layout is chosen.
export type HomeLayout = 'index' | 'hybrid' | 'bento' | 'dense' | 'sheet' | 'combo';

export const HOME_LAYOUTS: { id: HomeLayout; label: string }[] = [
	{ id: 'index', label: 'Index' },
	{ id: 'hybrid', label: 'Hybrid' },
	{ id: 'bento', label: 'Bento' },
	{ id: 'dense', label: 'Dense' },
	{ id: 'sheet', label: 'Sheet' },
	{ id: 'combo', label: 'Combo' }
];

export const HOME_LAYOUT_STORAGE_KEY = 'home-layout';
