// The Software section (0245): everything Timothy ships, one row each, with its own page where it
// has one. Nav item 04 points here instead of at Toolbox. Facts come from each product's own
// module (version, platforms, links); the one-line descriptions and the order are the assistant's.
// Add a product by adding a row: the page, its share text and its structured data all read this list.
import { APP as TOOLBOX } from './toolbox.ts';
import { APP as GRYPHON, REPO as GRYPHON_REPO, TOME } from './gryphon.ts';
import { index } from './work.ts';

export interface Link { label: string; href: string }
export interface Shot { src: string; w: number; h: number; alt: string }
export interface Product {
  slug: string;
  name: string;
  /** what kind of thing it is, in a few words */
  kind: string;
  line: string;
  /** where its name goes: its page here, or its own site */
  href: string;
  /** where it runs, when its kind doesn't already say */
  platforms: string[];
  version?: string;
  links: Link[];
  /** its own screen, where it has one */
  shot?: Shot;
  /** its icon on the Software desktop: a blackletter letter, or its own mark */
  icon: { letter: string } | { mark: string };
  /** its own colours on its icon and window, where it has them (a class in tokens.css) */
  palette?: 'illuminated';
}

/** Sonde's mark, from its logo library (03 Mark): 21 cells of 2 units on a 42-unit square */
const SONDE_MARK = 'M4 0h34v2h-34zM2 2h38v2h-38zM0 4h42v2h-42zM0 6h8v2h-8zM34 6h8v2h-8zM0 8h6v2h-6zM36 8h6v2h-6zM0 10h6v2h-6zM14 10h14v2h-14zM36 10h6v2h-6zM0 12h6v2h-6zM12 12h18v2h-18zM36 12h6v2h-6zM0 14h6v2h-6zM10 14h22v2h-22zM36 14h6v2h-6zM0 16h6v2h-6zM10 16h8v2h-8zM24 16h8v2h-8zM36 16h6v2h-6zM0 18h6v2h-6zM10 18h6v2h-6zM26 18h6v2h-6zM36 18h6v2h-6zM0 20h6v2h-6zM10 20h6v2h-6zM26 20h6v2h-6zM36 20h6v2h-6zM0 22h6v2h-6zM10 22h6v2h-6zM26 22h6v2h-6zM36 22h6v2h-6zM0 24h6v2h-6zM10 24h8v2h-8zM24 24h8v2h-8zM36 24h6v2h-6zM0 26h6v2h-6zM10 26h22v2h-22zM36 26h6v2h-6zM0 28h6v2h-6zM12 28h18v2h-18zM36 28h6v2h-6zM0 30h6v2h-6zM14 30h14v2h-14zM36 30h6v2h-6zM0 32h6v2h-6zM18 32h6v2h-6zM36 32h6v2h-6zM0 34h8v2h-8zM18 34h6v2h-6zM34 34h8v2h-8zM0 36h42v2h-42zM2 38h38v2h-38zM4 40h34v2h-34z';

const sonde = index.find((p) => p.slug === 'sonde');

export const products: Product[] = [
  {
    slug: 'toolbox', name: TOOLBOX.name, kind: 'Desktop app', href: '/toolbox/', platforms: TOOLBOX.platforms, version: TOOLBOX.version,
    line: 'Packages logos, exports palettes, makes type sheets, and converts images. From the app, a terminal, or an AI assistant.',
    links: [{ label: 'Downloads and guides', href: '/toolbox/' }, { label: 'Case study', href: '/work/toolbox/' }],
    icon: { letter: 'T' },
    shot: { src: '/toolbox/home.png', w: 2880, h: 1744, alt: 'Toolbox’s projects home' }
  },
  {
    slug: 'sonde', name: 'Sonde', kind: 'Web app', href: sonde?.live?.href ?? 'https://sondelab.com/', platforms: [],
    line: 'A free explorer for the XRP Ledger. Look up any account, transaction, ledger, token, or NFT.',
    links: [
      { label: sonde?.live?.label ?? 'sondelab.com', href: sonde?.live?.href ?? 'https://sondelab.com/' },
      { label: 'Case study', href: '/work/sonde/' },
      ...(sonde?.source ? [{ label: 'Source', href: sonde.source.href }] : [])
    ],
    icon: { mark: SONDE_MARK },
    shot: { src: '/work/sonde/screens/home.png', w: 2880, h: 1800, alt: 'Sonde’s home page: one search box over a pixel globe' }
  },
  {
    slug: 'gryphon', name: GRYPHON.name, kind: 'Desktop app', href: '/gryphon/', platforms: GRYPHON.platforms, version: GRYPHON.version,
    line: 'Installs and updates WoW Forever addons straight from their GitHub releases. No account, no ads.',
    links: [{ label: 'Download', href: '/gryphon/#download' }, { label: 'Source', href: GRYPHON_REPO }],
    icon: { letter: 'G' }, palette: 'illuminated',
    shot: { src: '/gryphon/picks.png', w: 2160, h: 1440, alt: 'Gryphon’s Picks screen' }
  },
  {
    slug: 'tome', name: TOME.name, kind: 'WoW Forever addon', href: '/gryphon/#tome', platforms: [], version: TOME.version,
    line: 'One set of tabs on the character, spellbook, talents, guild, collections, and group finder windows, plus bags.',
    links: [{ label: 'Install with Gryphon', href: '/gryphon/#tome' }, { label: 'Source', href: TOME.source }],
    icon: { letter: 't' }
  }
];

export const SOFTWARE_DESCRIPTION = `Apps and tools by Timothy Ali: ${products.map((p) => p.name).join(', ')}. Free to download or use.`;
