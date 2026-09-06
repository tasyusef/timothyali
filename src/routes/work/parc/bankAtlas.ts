// Rowboat Racer's bank sprite sheet, copied from the PARC site (generated there by
// brand/brand-tools/bank_props.py). Rects into static/parc/game/bank.png as
// (x, y, w, h) per kind, flat, indexed by kind * 4. Only IslandScene reads this.

export const BK = {
	GRASS: 0,
	SHELL: 5,
	STARFISH: 6,
	DRIFTWOOD: 7,
	DOCK: 8,
	BUSH0: 10,
	BUSH1: 11,
	BUSH2: 12,
	BUSH_FLOWER: 13,
	FERN: 14,
	BANANA_PLANT: 15,
	PALM: 16,
	TREE0: 17,
	TREE1: 18,
	BOULDER0: 19,
	HUT: 22,
	HUT_ROUND: 23,
	CRATE: 24,
	BARREL: 25,
	CANOE_RACK: 29
} as const;

// prettier-ignore
export const BANK_RECTS = new Int16Array([
	0, 0, 16, 16, 17, 0, 16, 16, 34, 0, 16, 16, 51, 0, 15, 17,
	67, 0, 15, 17, 83, 0, 10, 9, 94, 0, 11, 11, 106, 0, 20, 11,
	127, 0, 20, 28, 0, 29, 16, 24, 17, 29, 18, 16, 36, 29, 16, 14,
	53, 29, 21, 17, 75, 29, 18, 16, 94, 29, 18, 15, 113, 29, 22, 22,
	0, 54, 30, 32, 31, 54, 30, 30, 62, 54, 30, 30, 93, 54, 18, 15,
	112, 54, 22, 18, 0, 87, 30, 18, 31, 87, 28, 26, 60, 87, 24, 24,
	85, 87, 13, 13, 99, 87, 12, 14, 112, 87, 10, 14, 123, 87, 20, 11,
	144, 87, 14, 14, 0, 114, 22, 13, 23, 114, 22, 12,
]);
