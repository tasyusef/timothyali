import { studies, projects } from './work';
import { tools, APP } from './toolbox';

// Public origin retained from the previous site's src/lib/site.ts.
export const SITE_URL = 'https://www.timothyali.com';
// The hosted résumé (PX-43; the product track since PX-50): no phone number, built outside this repo
// by the résumé source in Timothy's RESUME folder and copied into static/resume/.
export const RESUME_URL = '/resume/Timothy-Ali-Resume.pdf';
export const socialPages = [
  { path: '/', image: 'home', title: 'Timothy Ali / Product designer who ships in code', description: 'Timothy Ali, product designer in Denver who ships in code. Interfaces, design systems, and front ends in TypeScript. Open to full-time and contract work.', alt: 'I’m tim. Product designer who ships in code. Pixel typography on a dark background.' },
  { path: '/work/', image: 'work', title: 'Work / Timothy Ali', description: 'Product, front-end, and brand work by Timothy Ali.', alt: `Work by Timothy Ali, with covers for ${projects.slice(0, -1).map((p) => p.title).join(', ')} and ${projects[projects.length - 1].title}.` },
  { path: '/contact/', image: 'contact', title: 'Get in touch / Timothy Ali', description: 'Tell me what you’re building. Timothy Ali is open to full-time roles, remote or in Denver, and to contract product, front-end, and brand work.', alt: 'Tell me what you’re building. Get in touch with Timothy Ali.' },
  // Toolbox images are rendered by /og/[id] like the rest (0110): the hero, the agents head, a row per tool.
  { path: '/toolbox/', image: 'toolbox', title: 'Toolbox / Timothy Ali', description: APP.description, alt: 'Toolbox by Timothy Ali: four design tools in one app.' },
  { path: '/toolbox/agents/', image: 'toolbox-agents', title: 'CLI & MCP / Toolbox / Timothy Ali', description: 'Run Toolbox from a terminal, send jobs as JSON, or connect an AI assistant through MCP. Setup, commands, and options for all four tools.', alt: 'Toolbox from the command line and over MCP.' },
  ...tools.map(t => ({ path: `/toolbox/${t.slug}/`, image: `toolbox-${t.slug}`, title: `${t.name} / Toolbox / Timothy Ali`, description: t.summary, alt: `${t.name}: ${t.blurb}. A Toolbox tool by Timothy Ali.` })),
    // Study images are `work-<slug>` (0132): the Toolbox study and the Toolbox page would both be `toolbox`.
  ...studies.map(p => ({ path: `/work/${p.slug}/`, image: `work-${p.slug}`, title: `${p.title} / Timothy Ali`, description: p.description, alt: `${p.title}: ${p.cover.alt} Design by Timothy Ali.` }))
];
export function socialFor(path: string) {
  return socialPages.find(p => p.path === path);
}
