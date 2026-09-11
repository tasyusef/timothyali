import { studies } from './work';
import { tools, APP } from './toolbox';

// Public origin retained from the previous site's src/lib/site.ts.
export const SITE_URL = 'https://www.timothyali.com';
export const socialPages = [
  { path: '/', image: 'home', title: 'Timothy Ali — Designer & builder', description: 'I’m tim. Designer for teams that don’t have one yet. Brand, product, motion, front end.', alt: 'I’m tim. Designer for teams that don’t have one yet. Pixel typography on a dark background.' },
  { path: '/work/', image: 'work', title: 'Selected work — Timothy Ali', description: 'Selected brand, product, motion, and front-end work by designer Timothy Ali.', alt: 'Selected work by Timothy Ali, with covers for PARC, xrp.cafe, First Ledger and Do Androids Dream.' },
  { path: '/contact/', image: 'contact', title: 'Get in touch — Timothy Ali', description: 'Tell me what you’re building. Connect with designer Timothy Ali about brand, product, motion, and front-end work.', alt: 'Tell me what you’re building. Get in touch — Timothy Ali.' },
  // Toolbox shares Home's image until it has a composition of its own (0092).
  { path: '/toolbox/', image: 'home', title: 'Toolbox — Timothy Ali', description: APP.description, alt: 'Toolbox by Timothy Ali: four design tools in one app.' },
  { path: '/toolbox/agents/', image: 'home', title: 'Without the window — Toolbox — Timothy Ali', description: 'Toolbox is also its own command-line tool and MCP server. The same binary describes its tools, runs one, or serves them to an agent.', alt: 'Toolbox from the command line and over MCP.' },
  ...tools.map(t => ({ path: `/toolbox/${t.slug}/`, image: 'home', title: `${t.name} — Toolbox — Timothy Ali`, description: t.summary, alt: `${t.name}: ${t.blurb}. A Toolbox tool by Timothy Ali.` })),
  ...studies.map(p => ({ path: `/work/${p.slug}/`, image: p.slug, title: `${p.title} — Timothy Ali`, description: p.description, alt: `${p.title} — ${p.cover.alt} Design by Timothy Ali.` }))
];
export function socialFor(path: string) {
  return socialPages.find(p => p.path === path);
}
