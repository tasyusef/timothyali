// PARC brand values for the embedded brand-system demo. These are the showcased
// product's real colors (from the PARC brand sheet and parcxrpl.com), deliberately
// NOT the site's own design tokens — the demo has to look like PARC in both themes.
export const PARC = {
	orange: '#ef532d',
	blue: '#1d90a9',
	green: '#166249',
	yellow: '#eecd17',
	white: '#ffffff',
	ink: '#22302b',
	skyTop: '#79c9e8',
	skyMid: '#93d9e8',
	skyBottom: '#c2edda'
} as const;

export const PARC_SKY = `linear-gradient(${PARC.skyTop} 0, ${PARC.skyMid} 55%, ${PARC.skyBottom} 100%)`;

export const PARC_SWATCHES = [
	{ name: 'Orange', hex: PARC.orange, cmyk: '0-65-81-6' },
	{ name: 'Blue', hex: PARC.blue, cmyk: '83-15-0-34' },
	{ name: 'Green', hex: PARC.green, cmyk: '78-0-26-62' },
	{ name: 'Yellow', hex: PARC.yellow, cmyk: '0-14-90-7' },
	{ name: 'White', hex: PARC.white, cmyk: '0-0-0-0' }
] as const;

/** The four letter colors in logo order: P, A, R, C. */
export const PARC_CYCLE = [PARC.orange, PARC.blue, PARC.green, PARC.yellow] as const;

/** Highlight tints the site fades sparks out through (`--*-hi` on parcxrpl.com). */
export const PARC_HI: Record<string, string> = {
	[PARC.orange]: '#ffd9cc',
	[PARC.blue]: '#cdf0f8',
	[PARC.green]: '#c1efdb',
	[PARC.yellow]: '#fdf8d4'
};
