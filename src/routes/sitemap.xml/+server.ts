import { projects } from '$lib/projects';
import { posts } from '$lib/posts';
import { SITE_URL } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

interface SitemapEntry {
	path: string;
	changefreq: string;
	priority: number;
	/** ISO date of the last real content change — omitted when unknown,
	 *  rather than stamping every URL with the build date. */
	lastmod?: string;
}

const entries: SitemapEntry[] = [
	{ path: '', changefreq: 'monthly', priority: 1 },
	{ path: '/about', changefreq: 'monthly', priority: 0.8 },
	{ path: '/blog', changefreq: 'weekly', priority: 0.7, lastmod: posts[0]?.date },
	...posts.map((p) => ({
		path: `/blog/${p.slug}`,
		changefreq: 'yearly',
		priority: 0.6,
		lastmod: p.date
	})),
	{ path: '/contact', changefreq: 'yearly', priority: 0.7 },
	...projects.map((p) => ({
		path: `/work/${p.slug}`,
		changefreq: 'yearly',
		priority: 0.8
	}))
];

export const GET: RequestHandler = () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `	<url>
		<loc>${SITE_URL}${e.path}</loc>
${e.lastmod ? `		<lastmod>${e.lastmod}</lastmod>\n` : ''}		<changefreq>${e.changefreq}</changefreq>
		<priority>${e.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
