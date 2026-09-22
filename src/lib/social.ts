import { studies } from './work';
import { tools, APP } from './toolbox';

// Public origin retained from the previous site's src/lib/site.ts.
export const SITE_URL = 'https://www.timothyali.com';
// The hosted résumé (PX-43): the brand track without the phone number, built outside this repo
// by the résumé source in Timothy's RESUME folder and copied into static/resume/.
export const RESUME_URL = '/resume/Timothy-Ali-Resume.pdf';
export const socialPages = [
  { path: '/', image: 'home', title: 'Timothy Ali / Brand and web designer', description: 'Timothy Ali, brand and web designer in Denver. Identities, motion, and websites built in code. Open to full-time and freelance work.', alt: 'I’m tim. Designer for teams that don’t have one yet. Pixel typography on a dark background.' },
  { path: '/work/', image: 'work', title: 'Selected work / Timothy Ali', description: 'Selected brand, motion, and web work by designer Timothy Ali.', alt: 'Selected work by Timothy Ali, with covers for PARC, Jade Aesthetics, xrp.cafe and Do Androids Dream.' },
  { path: '/contact/', image: 'contact', title: 'Get in touch / Timothy Ali', description: 'Tell me what you’re building. Timothy Ali is open to full-time roles, remote or in Denver, and to freelance brand, motion, and web projects.', alt: 'Tell me what you’re building. Get in touch with Timothy Ali.' },
  // Toolbox images are rendered by /og/[id] like the rest (0110): the hero, the agents head, a row per tool.
  { path: '/toolbox/', image: 'toolbox', title: 'Toolbox / Timothy Ali', description: APP.description, alt: 'Toolbox by Timothy Ali: four design tools in one app.' },
  { path: '/toolbox/agents/', image: 'toolbox-agents', title: 'CLI & MCP / Toolbox / Timothy Ali', description: 'Run Toolbox from a terminal, send jobs as JSON, or connect an AI assistant through MCP. Setup, commands, and options for all four tools.', alt: 'Toolbox from the command line and over MCP.' },
  ...tools.map(t => ({ path: `/toolbox/${t.slug}/`, image: `toolbox-${t.slug}`, title: `${t.name} / Toolbox / Timothy Ali`, description: t.summary, alt: `${t.name}: ${t.blurb}. A Toolbox tool by Timothy Ali.` })),
  ...studies.map(p => ({ path: `/work/${p.slug}/`, image: p.slug, title: `${p.title} / Timothy Ali`, description: p.description, alt: `${p.title}: ${p.cover.alt} Design by Timothy Ali.` }))
];
export function socialFor(path: string) {
  return socialPages.find(p => p.path === path);
}
