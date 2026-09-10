// Prerendered to build/sitemap.xml. Every public page, in the order the site presents
// them. No lastmod: the build date would be a lie, and the content has no dated edits.
import { SITE_URL, socialPages } from '$lib/social';
export const prerender = true;
export function GET() {
  const urls = socialPages.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
