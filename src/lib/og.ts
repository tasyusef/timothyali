import { projects } from './projects';
import { posts, formatDate } from './posts';

export interface OgCard {
	title: string;
	subtitle?: string;
}

/**
 * Every OG image on the site, keyed by the `ogKey` passed to <Seo>.
 * Rendered to static PNGs at build time by src/routes/og/[key].png.
 */
export const ogCards: Record<string, OgCard> = {
	home: { title: 'Timothy Ali', subtitle: 'Product Design, Brand Identity & Motion' },
	about: { title: 'About', subtitle: 'Designer: product, brand, and motion' },
	blog: { title: 'Writing', subtitle: 'Notes on design systems and AI-assisted work' },
	...Object.fromEntries(
		projects.map((p) => [p.slug, { title: p.title, subtitle: `${p.category} · ${p.year}` }])
	),
	...Object.fromEntries(
		posts.map((p) => [p.slug, { title: p.title, subtitle: `Writing · ${formatDate(p.date)}` }])
	)
};
