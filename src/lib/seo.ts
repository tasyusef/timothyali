// Structured data for the prerendered pages. One graph per page, emitted by SocialMeta.
// Person and WebSite on Home; a breadcrumb trail on every inner page; each study is a
// CreativeWork by that Person. Facts here are the site's own copy plus the two public
// profiles the old site already listed.
import { SITE_URL } from './social';
import { studies, type Project } from './work';
import { tools, APP } from './toolbox';

export const PROFILES = ['https://linkedin.com/in/timothyali', 'https://github.com/tasyusef'];

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Timothy Ali',
  url: SITE_URL,
  jobTitle: 'Designer & builder',
  description: 'Designer for teams that don’t have one yet: brand, product, motion, front end.',
  knowsAbout: ['Brand identity', 'Product design', 'Motion design', 'Front-end development', 'Design systems', 'Typography'],
  address: { '@type': 'PostalAddress', addressLocality: 'Denver', addressRegion: 'CO', addressCountry: 'US' },
  sameAs: PROFILES
};
const website = { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Timothy Ali', url: SITE_URL, publisher: { '@id': person['@id'] } };
const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE_URL}${path}` }))
});
const work = (p: Project) => ({
  '@type': 'CreativeWork',
  '@id': `${SITE_URL}/work/${p.slug}/#work`,
  name: p.title,
  headline: p.title,
  description: p.description,
  url: `${SITE_URL}/work/${p.slug}/`,
  image: `${SITE_URL}${p.cover.src}`,
  dateCreated: p.year.slice(0, 4),
  genre: p.scope,
  author: { '@id': person['@id'] },
  creator: { '@id': person['@id'] },
  ...(p.live ? { sameAs: p.live.href } : {})
});

const software = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/toolbox/#app`,
  name: APP.name,
  url: `${SITE_URL}/toolbox/`,
  description: APP.description,
  applicationCategory: 'DesignApplication',
  operatingSystem: APP.platforms.join(', '),
  softwareVersion: APP.version,
  author: { '@id': person['@id'] },
  featureList: tools.map((t) => `${t.name}: ${t.summary}`)
};

export function graphFor(path: string): object[] | undefined {
  if (path === '/') return [person, website];
  if (path === '/work/') return [crumbs([['Timothy Ali', '/'], ['Work', '/work/']]), { '@type': 'CollectionPage', name: 'Selected work', url: `${SITE_URL}/work/`, hasPart: studies.map((p) => ({ '@id': `${SITE_URL}/work/${p.slug}/#work` })) }];
  if (path === '/contact/') return [crumbs([['Timothy Ali', '/'], ['Contact', '/contact/']])];
  if (path === '/toolbox/') return [crumbs([['Timothy Ali', '/'], ['Toolbox', '/toolbox/']]), software];
  if (path === '/toolbox/agents/') return [crumbs([['Timothy Ali', '/'], ['Toolbox', '/toolbox/'], ['Without the window', '/toolbox/agents/']])];
  const t = tools.find((t) => path === `/toolbox/${t.slug}/`);
  if (t) return [crumbs([['Timothy Ali', '/'], ['Toolbox', '/toolbox/'], [t.name, `/toolbox/${t.slug}/`]])];
  const p = studies.find((s) => path === `/work/${s.slug}/`);
  if (p) return [crumbs([['Timothy Ali', '/'], ['Work', '/work/'], [p.title, `/work/${p.slug}/`]]), work(p)];
}

/** The <script type="application/ld+json"> for a page, with `</` escaped so the JSON cannot close the tag. */
export function jsonLdFor(path: string): string {
  const graph = graphFor(path);
  if (!graph) return '';
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('</', '<\\/');
  return `<script type="application/ld+json">${json}</script>`;
}
