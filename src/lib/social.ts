import { studies } from './work';

// Public origin retained from the previous site's src/lib/site.ts.
export const SITE_URL = 'https://www.timothyali.com';
export const socialPages = [
  { path: '/', image: 'home', title: 'Timothy Ali — Designer & builder', description: 'I’m tim. Designer for teams that don’t have one yet. Brand, product, motion, front end.', alt: 'I’m tim. Designer for teams that don’t have one yet. Pixel typography on a dark background.' },
  { path: '/work/', image: 'work', title: 'Selected work — Timothy Ali', description: 'Selected brand, product, motion, and front-end work by designer Timothy Ali.', alt: 'Selected work by Timothy Ali, with covers for PARC, xrp.cafe, First Ledger and Do Androids Dream.' },
  { path: '/contact/', image: 'contact', title: 'Get in touch — Timothy Ali', description: 'Tell me what you’re building. Connect with designer Timothy Ali about brand, product, motion, and front-end work.', alt: 'Tell me what you’re building. Get in touch — Timothy Ali.' },
  ...studies.map(p => ({ path: `/work/${p.slug}/`, image: p.slug, title: `${p.title} — Timothy Ali`, description: p.description, alt: `${p.title} — ${p.cover.alt} Design by Timothy Ali.` }))
];
export function socialFor(path: string) {
  return socialPages.find(p => p.path === path);
}
