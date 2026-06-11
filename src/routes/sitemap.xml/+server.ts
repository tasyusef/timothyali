import { projects } from '$lib/projects';
import { posts } from '$lib/posts';
import { SITE_URL } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

interface SitemapEntry {
	path: string;
	changefreq: string;
	priority: number;
}

const entries: SitemapEntry[] = [
	{ path: '', changefreq: 'monthly', priority: 1 },
	{ path: '/about', changefreq: 'monthly', priority: 0.8 },
	{ path: '/blog', changefreq: 'weekly', priority: 0.7 },
	...posts.map((p) => ({ path: `/blog/${p.slug}`, changefreq: 'yearly', priority: 0.6 })),
	{ path: '/contact', changefreq: 'yearly', priority: 0.7 },
	...projects.map((p) => ({
		path: `/work/${p.slug}`,
		changefreq: 'yearly',
		priority: 0.8
	}))
];

export const GET: RequestHandler = () => {
	const lastmod = new Date().toISOString();
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `	<url>
		<loc>${SITE_URL}${e.path}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${e.changefreq}</changefreq>
		<priority>${e.priority}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
