// Structured data for the prerendered pages. One graph per page, emitted by SocialMeta.
// Person and WebSite on Home; every page is a WebPage (Work a CollectionPage, Contact a
// ContactPage) that is part of the WebSite, with its share image and a breadcrumb trail on
// the inner pages; each study is a CreativeWork by that Person and the page's main entity;
// Toolbox is a SoftwareApplication. Facts here are the site's own copy plus the two public
// profiles the old site already listed. Extended in PX-59 (0145).
import { SITE_URL, socialFor, type SocialPage } from './social';
import { studies, type Project } from './work';
import { tools, APP, home as toolboxHome } from './toolbox';

export const PROFILES = ['https://linkedin.com/in/timothyali', 'https://github.com/tasyusef'];
export const EMAIL = 'studio@timothyali.com';
const RELEASES = 'https://github.com/tasyusef/toolbox/releases';

const id = (path: string, hash: string) => `${SITE_URL}${path}#${hash}`;
const person = {
  '@type': 'Person',
  '@id': id('/', 'person'),
  name: 'Timothy Ali',
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  jobTitle: 'Product designer',
  description: 'Product designer in Denver who ships in code: interfaces, design systems, and front ends in TypeScript. Open to full-time and contract work.',
  knowsAbout: ['Product design', 'Interface design', 'Front-end development', 'Design systems', 'Brand identity', 'Motion design', 'Typography'],
  address: { '@type': 'PostalAddress', addressLocality: 'Denver', addressRegion: 'CO', addressCountry: 'US' },
  sameAs: PROFILES
};
const website = { '@type': 'WebSite', '@id': id('/', 'website'), name: 'Timothy Ali', url: SITE_URL, inLanguage: 'en-US', publisher: { '@id': person['@id'] }, author: { '@id': person['@id'] } };
const image = (src: string, width: number, height: number) => ({ '@type': 'ImageObject', url: `${SITE_URL}${src}`, width, height });
const crumbs = (path: string, items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  '@id': id(path, 'breadcrumb'),
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${p}` }))
});
/** The page itself: its title and description as the tags carry them, its share image, and its place in the site. */
const webpage = (meta: SocialPage, type = 'WebPage', extra: object = {}) => ({
  '@type': type,
  '@id': id(meta.path, 'webpage'),
  url: `${SITE_URL}${meta.path}`,
  name: meta.title,
  description: meta.description,
  inLanguage: 'en-US',
  isPartOf: { '@id': website['@id'] },
  primaryImageOfPage: image(`/og/${meta.image}.png`, 1200, 630),
  ...(meta.path === '/' ? {} : { breadcrumb: { '@id': id(meta.path, 'breadcrumb') } }),
  ...extra
});
const work = (p: Project) => ({
  '@type': 'CreativeWork',
  '@id': id(`/work/${p.slug}/`, 'work'),
  name: p.title,
  headline: p.title,
  description: p.description,
  url: `${SITE_URL}/work/${p.slug}/`,
  mainEntityOfPage: { '@id': id(`/work/${p.slug}/`, 'webpage') },
  image: image(p.cover.src, p.cover.w, p.cover.h),
  thumbnailUrl: `${SITE_URL}${p.cover.src}`,
  dateCreated: p.year.slice(0, 4),
  genre: p.scope,
  keywords: p.tools,
  inLanguage: 'en-US',
  isPartOf: { '@id': id('/work/', 'webpage') },
  author: { '@id': person['@id'] },
  creator: { '@id': person['@id'] },
  ...(p.live ? { sameAs: p.live.href } : {})
});

const software = {
  '@type': 'SoftwareApplication',
  '@id': id('/toolbox/', 'app'),
  name: APP.name,
  url: `${SITE_URL}/toolbox/`,
  description: APP.description,
  applicationCategory: 'DesignApplication',
  operatingSystem: APP.platforms.join(', '),
  softwareVersion: APP.version,
  // The builds are public GitHub releases with no purchase anywhere, so the offer is free.
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  downloadUrl: RELEASES,
  screenshot: image(toolboxHome.src, toolboxHome.w, toolboxHome.h),
  softwareHelp: { '@type': 'CreativeWork', url: `${SITE_URL}/toolbox/agents/` },
  author: { '@id': person['@id'] },
  featureList: tools.map((t) => `${t.name}: ${t.summary}`)
};

export function graphFor(path: string): object[] | undefined {
  const meta = socialFor(path);
  if (!meta) return;
  const home: [string, string] = ['Timothy Ali', '/'];
  if (path === '/') return [person, website, webpage(meta, 'WebPage', { about: { '@id': person['@id'] }, mainEntity: { '@id': person['@id'] } })];
  if (path === '/work/') return [crumbs(path, [home, ['Work', '/work/']]), webpage(meta, 'CollectionPage', { hasPart: studies.map((p) => ({ '@id': id(`/work/${p.slug}/`, 'work') })) })];
  if (path === '/contact/') return [crumbs(path, [home, ['Contact', '/contact/']]), webpage(meta, 'ContactPage', { mainEntity: { '@id': person['@id'] } })];
  if (path === '/toolbox/') return [crumbs(path, [home, ['Toolbox', '/toolbox/']]), webpage(meta, 'WebPage', { mainEntity: { '@id': software['@id'] } }), software];
  if (path === '/toolbox/agents/') return [crumbs(path, [home, ['Toolbox', '/toolbox/'], ['CLI & MCP', '/toolbox/agents/']]), webpage(meta, 'WebPage', { about: { '@id': software['@id'] } })];
  const t = tools.find((t) => path === `/toolbox/${t.slug}/`);
  if (t) return [crumbs(path, [home, ['Toolbox', '/toolbox/'], [t.name, path]]), webpage(meta, 'WebPage', { about: { '@id': software['@id'] }, primaryImageOfPage: image(t.shot.src, t.shot.w, t.shot.h) })];
  const p = studies.find((s) => path === `/work/${s.slug}/`);
  if (p) return [crumbs(path, [home, ['Work', '/work/'], [p.title, path]]), webpage(meta, 'WebPage', { mainEntity: { '@id': id(path, 'work') } }), work(p)];
}

/** The <script type="application/ld+json"> for a page, with `</` escaped so the JSON cannot close the tag. */
export function jsonLdFor(path: string): string {
  const graph = graphFor(path);
  if (!graph) return '';
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('</', '<\\/');
  return `<script type="application/ld+json">${json}</script>`;
}
