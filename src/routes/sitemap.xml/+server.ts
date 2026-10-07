// Prerendered to build/sitemap.xml. Every public page, in the order the site presents
// them. No lastmod: the build date would be a lie, and the content has no dated edits.
// Each study lists its cover and screens, and each Toolbox tool page its screenshot, as
// image sitemap entries (PX-59, 0145), so the work itself can be found in image search.
import { SITE_URL, socialPages } from '$lib/social';
import { studies } from '$lib/work';
import { tools } from '$lib/toolbox';
export const prerender = true;

function imagesFor(path: string): string[] {
  const p = studies.find((s) => path === `/work/${s.slug}/`);
  if (p) {
    const rows = [p.hero, ...p.blocks.flatMap((b) => (b.type === 'gallery' ? b.rows : []))];
    const shown = rows.flat().map((m) => (m.video ? m.poster : m.src)).filter((s): s is string => !!s);
    return [...new Set([p.cover.src, ...shown])];
  }
  const t = tools.find((t) => path === `/toolbox/${t.slug}/`);
  return t ? [t.shot.src] : [];
}
const esc = (s: string) => s.replaceAll('&', '&amp;');
export function GET() {
  const urls = socialPages
    .map((p) => {
      const images = imagesFor(p.path).map((src) => `\n    <image:image><image:loc>${esc(SITE_URL + src)}</image:loc></image:image>`).join('');
      return `  <url><loc>${SITE_URL}${p.path}</loc>${images}${images ? '\n  ' : ''}</url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
