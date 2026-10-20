import { studies, projects } from './work.ts';
import { tools, APP } from './toolbox.ts';
export { SITE_URL, RESUME_URL } from './site.ts';
// Descriptions the page and its share tags both carry (PX-59): Work names the selected
// four, and a tool page says what the tool is part of, so neither stops at one short line.
export const WORK_DESCRIPTION = `Case studies by Timothy Ali, a product designer in Denver: ${studies.filter((p) => p.tier === 'selected').map((p) => p.title).join(', ')}, and more product, front-end, and brand work.`;
export const toolDescription = (t: { summary: string }) => `${t.summary} Part of Toolbox, Timothy Ali’s free desktop app for macOS and Linux.`;
// What each study is, in a few words, so its title says more than the project's name (0207;
// the Toolbox study also needs a title of its own beside the Toolbox page's)
const TAGLINE: Record<string, string> = {
  sonde: 'XRP Ledger explorer', pocketwatch: 'personal finance app', toolbox: 'desktop app for brand files',
  parc: 'NFT club identity and website', firstledger: 'brand for a trading platform', xrpcafe: 'NFT marketplace identity and motion',
  'jade-aesthetics': 'medical spa websites', firststrike: 'brand identity', 'do-androids-dream': 'a title sequence'
};
const studyTitle = (p: { slug: string; title: string }) => {
  const tag = TAGLINE[p.slug]; if (!tag) return `${p.title} / Timothy Ali`;
  return p.title.endsWith('?') ? `${p.title} ${tag[0].toUpperCase()}${tag.slice(1)} / Timothy Ali` : `${p.title}: ${tag} / Timothy Ali`;
};
// a sentence of its own: the cover alts carry no closing stop
const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);
export interface SocialPage { path: string; image: string; title: string; description: string; alt: string }
export const socialPages: SocialPage[] = [
  { path: '/', image: 'home', title: 'Timothy Ali / Product designer', description: 'Timothy Ali, product designer in Denver. Interfaces, design systems, and front ends in TypeScript. Open to full-time and contract work.', alt: 'I’m tim. Product designer. Pixel typography on a dark background.' },
  { path: '/work/', image: 'work', title: 'Work / Timothy Ali', description: WORK_DESCRIPTION, alt: `Work by Timothy Ali, with covers for ${projects.slice(0, -1).map((p) => p.title).join(', ')} and ${projects[projects.length - 1].title}.` },
  { path: '/contact/', image: 'contact', title: 'Get in touch / Timothy Ali', description: 'Tell me what you’re building. Timothy Ali is open to full-time roles, remote or in Denver, and to contract product, front-end, and brand work.', alt: 'Tell me what you’re building. Get in touch with Timothy Ali.' },
  // Toolbox images are rendered by /og/[id] like the rest (0110): the hero, the agents head, a row per tool.
  { path: '/toolbox/', image: 'toolbox', title: 'Toolbox / Timothy Ali', description: APP.description, alt: 'Toolbox by Timothy Ali: four design tools in one app.' },
  { path: '/toolbox/agents/', image: 'toolbox-agents', title: 'CLI & MCP / Toolbox / Timothy Ali', description: 'Run Toolbox from a terminal, send jobs as JSON, or connect an AI assistant through MCP. Setup, commands, and options for all four tools.', alt: 'Toolbox from the command line and over MCP.' },
  ...tools.map(t => ({ path: `/toolbox/${t.slug}/`, image: `toolbox-${t.slug}`, title: `${t.name} / Toolbox / Timothy Ali`, description: toolDescription(t), alt: `${t.name}: ${t.blurb}. A Toolbox tool by Timothy Ali.` })),
    // Study images are `work-<slug>` (0132): the Toolbox study and the Toolbox page would both be `toolbox`.
  ...studies.map(p => ({ path: `/work/${p.slug}/`, image: `work-${p.slug}`, title: studyTitle(p), description: p.description, alt: `${p.title}: ${sentence(p.cover.alt)} Design by Timothy Ali.` }))
];
export function socialFor(path: string) {
  return socialPages.find(p => p.path === path);
}
