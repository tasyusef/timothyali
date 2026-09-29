import { machineParams } from './toolbox-options.ts';

// Toolbox website copy. Commands, flags, choices, and defaults follow the app’s
// src/shared/toolCatalog.ts; explanations are edited for this site (PX-39).
// Check src/renderer/src/agent/runJob.ts for CLI/MCP limits before changing claims.
// App source: /Users/twocakes/Desktop/GRAPHIC DESIGN/01_WORK/TOOLBOX/app

export interface Shot { src: string; w: number; h: number; alt: string }

/** One command-line option, copied from the app's catalog (src/shared/toolCatalog.ts). */
export interface Param {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'string[]' | 'json';
  min?: number;
  max?: number;
  description: string;
  required?: boolean;
  choices?: string[];
  default?: string | number | boolean | string[];
  /** takes bare arguments on the command line */
  primary?: boolean;
}


/** The flag as the app's --help prints it. */
export function signature(p: Param): string {
  if (p.type === 'json') return `--${p.name} <json>`;
  if (p.type === 'boolean') return `--${p.name}`;
  if (p.type === 'number') return `--${p.name} <number>`;
  if (p.choices) return `--${p.name} <${p.choices.join('|')}>`;
  return p.type === 'string[]' ? `--${p.name} <values…>` : `--${p.name} <value>`;
}

export interface Tool {
  n: string;
  slug: string;
  name: string;
  /** the line under the name on the index; shorter than the summary */
  blurb: string;
  summary: string;
  whenToUse: string;
  produces: string;
  /** what goes in, in words */
  input: string;
  /** what lands on disk */
  outputs: string[];
  /** a real invocation, the flags the CLI takes */
  command: string;
  /** every option, in the app's order */
  params: Param[];
  shot: Shot;
}

const shot = (name: string, alt: string): Shot => ({ src: `/toolbox/${name}.png`, w: 2880, h: 1744, alt });

export const APP = {
  name: 'Toolbox',
  version: '1.1.1',
  platforms: ['macOS', 'Linux'],
  interfaces: ['App', 'CLI', 'MCP'],
  status: 'Released',
  description: 'Package logos, export color palettes, make type specimens, and convert images. Toolbox runs on macOS and Linux, with command-line and MCP access.'
};

export const home: Shot = shot('home', 'Toolbox on launch: the four tools, Lockup, Palette, Specimen and Convert, listed as a numbered index over a pixel sky.');

export const tools: Tool[] = [
  {
    n: '01', slug: 'lockup', name: 'Lockup',
    blurb: 'Package logos for print and web',
    summary: 'Export your logo variations as an organized set of print and web files.',
    whenToUse: 'Use Lockup to prepare a set of logo files for a client, developer, or printer. Add an SVG for each logo variation, then choose the formats, colors, and sizes you need. You can assign CMYK and Pantone print colors in the app, CLI, or MCP. To convert individual images, use Convert.',
    produces: 'Your export contains WEB and PRINT folders, organized by logo variation, color treatment, and size. A README explains what’s included. Web formats are PNG, JPEG, and SVG; print formats are JPEG, PDF, and EPS.',
    input: 'Vector SVGs',
    outputs: ['PNG', 'JPEG', 'SVG', 'PDF', 'EPS', 'README'],
    command: 'toolbox lockup logo.svg --print none --padding 0.1 --out .',
    params: machineParams.lockup,
    shot: shot('lockup', 'Toolbox in the Lockup tool: a logo on a white plate, with format, treatment and size switches in the right rail and a count of 73 files.')
  },
  {
    n: '02', slug: 'palette', name: 'Palette',
    blurb: 'Export palettes as code and swatches',
    summary: 'Export a color palette as code, Adobe swatches, or a reference sheet.',
    whenToUse: 'Use Palette to prepare colors for a website, an Adobe project, or a brand guide. Enter hex values or import artwork. Toolbox reads fill colors from SVGs and extracts dominant colors from raster images.',
    produces: 'Choose CSS and SCSS variables, design tokens in JSON, Adobe swatches in ASE, or a palette sheet in PDF and PNG. Each export goes into a new folder.',
    input: 'Hex values, or artwork',
    outputs: ['CSS', 'SCSS', 'JSON', 'ASE', 'PDF', 'PNG'],
    command: "toolbox palette '#D32F05' '#003A5D' --name Acme --out .",
    params: machineParams.palette,
    shot: shot('palette', 'Toolbox in the Palette tool: a poster filling the canvas, its colors sampled into a row of swatches, with the output files listed in the right rail.')
  },
  {
    n: '03', slug: 'specimen', name: 'Specimen',
    blurb: 'Make type specimen sheets',
    summary: 'Make a type specimen sheet from fonts installed on your computer.',
    whenToUse: 'Use Specimen to show a typeface at different sizes or compare fonts for a brand guide. Install the fonts first, then choose a family, style, and size for each role, such as heading, body, or caption. The same settings are available in the app, CLI, and MCP.',
    produces: 'A PDF and a PNG of the specimen sheet.',
    input: 'Installed fonts',
    outputs: ['PDF', 'PNG'],
    command: 'toolbox specimen --template classic --family Helvetica --out .',
    params: machineParams.specimen,
    shot: shot('specimen', 'Toolbox in the Specimen tool: a live type sheet preview beside the display, heading and body styles.')
  },
  {
    n: '04', slug: 'convert', name: 'Convert',
    blurb: 'Convert and resize images',
    summary: 'Change image formats, resize images, and adjust compression.',
    whenToUse: 'Use Convert to change image formats, resize files, or adjust compression. Both platforms can read PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, and SVG. HEIC, TIFF, and PSD input requires macOS. For a full package of logo variations, use Lockup.',
    produces: 'Each source image is exported in every format you select. If you select more than one format, the files are grouped into folders such as PNG and WebP.',
    input: 'PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, SVG; HEIC, TIFF, PSD on macOS',
    outputs: ['PNG', 'JPEG', 'WebP', 'TIFF', 'PDF'],
    command: 'toolbox convert a.heic b.png --formats webp --compression 40 --out ~/Desktop',
    params: machineParams.convert,
    shot: shot('convert', 'Toolbox in the Convert tool: two posters listed with their measured output sizes per format, and format, compression and edge controls in the right rail.')
  }
];

export const last = tools[tools.length - 1].n;
export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

/** Where the installed binary is, per platform (docs/AGENTS.md). */
export const binaries = [
  { os: 'macOS', path: '/Applications/Toolbox.app/Contents/MacOS/Toolbox' },
  { os: 'Linux', path: 'toolbox' }
];

/** The release builds live in the public releases repo; every file is checksummed there. */
export const RELEASES = 'https://github.com/tasyusef/toolbox/releases';
const file = (name: string) => `${RELEASES}/download/v${APP.version}/${name}`;
export const builds = [
  { os: 'macOS', note: 'Signed and notarized', files: [{ label: 'Apple silicon', href: file(`Toolbox-${APP.version}-arm64.dmg`) }, { label: 'Intel', href: file(`Toolbox-${APP.version}.dmg`) }] },
  { os: 'Linux', note: 'Make the AppImage executable before opening it, or use the deb package on Debian or Ubuntu.', files: [{ label: 'AppImage x86_64', href: file(`toolbox-${APP.version}-x86_64.AppImage`) }, { label: 'AppImage arm64', href: file(`toolbox-${APP.version}-arm64.AppImage`) }, { label: 'deb amd64', href: file(`toolbox_${APP.version}_amd64.deb`) }, { label: 'deb arm64', href: file(`toolbox_${APP.version}_arm64.deb`) }] }
];
