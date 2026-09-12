// Toolbox: the four tools, in the order the app lists them, plus the facts the pages
// share. `summary`, `whenToUse` and `produces` are copied from the app's own catalog
// (gridform/src/shared/toolCatalog.ts), the same strings the CLI prints and the MCP
// server hands an agent, so the site cannot describe a tool differently from the thing
// itself. The only edit is punctuation: no em dashes. When a summary changes there,
// change it here. Commands are copied from the app's docs/AGENTS.md for the same reason.

export interface Shot { src: string; w: number; h: number; alt: string }

/** One command-line option, copied from the app's catalog (gridform/src/shared/toolCatalog.ts). */
export interface Param {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'string[]';
  description: string;
  required?: boolean;
  choices?: string[];
  default?: string | number | boolean | string[];
  /** takes bare arguments on the command line */
  primary?: boolean;
}

const outParam: Param = { name: 'out', type: 'string', description: 'Folder to write into. A fresh subfolder is created inside it, so nothing is overwritten.', required: true };

/** The flag as the app's --help prints it. */
export function signature(p: Param): string {
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
  version: '1.0.0',
  platforms: ['macOS', 'Windows', 'Linux'],
  interfaces: ['App', 'CLI', 'MCP'],
  status: 'Released',
  description: 'Four design tools in one app: logo packages, colour systems, type specimens and image conversion. Runs on macOS, Windows and Linux, and every tool also runs from a terminal and over MCP.'
};

export const home: Shot = shot('home', 'Toolbox on launch: the four tools, Lockup, Palette, Specimen and Convert, listed as a numbered index over a pixel sky.');

export const tools: Tool[] = [
  {
    n: '01', slug: 'lockup', name: 'Lockup',
    blurb: 'Logo files in, deliverable package out',
    summary: 'Turn logo SVGs into a complete, correctly named deliverable package.',
    whenToUse: 'Use when handing a logo to a client or a printer: it builds every variation, colourway and size at once, with real Pantone separations in the print files. Takes vector SVGs only. For a one-off format change on a single image, use Convert instead.',
    produces: 'A folder tree of WEB (PNG, JPEG, SVG) and PRINT (PDF, EPS) files per variation, treatment and size, plus a README describing the package.',
    input: 'Vector SVGs',
    outputs: ['PNG', 'JPEG', 'SVG', 'PDF', 'EPS', 'README'],
    command: 'toolbox lockup logo.svg --print none --padding 0.1 --out .',
    params: [
      { name: 'input', type: 'string[]', description: 'Paths of the logo SVGs, one per variation (horizontal, stacked, mark).', required: true, primary: true },
      { name: 'web', type: 'string[]', description: 'Web file types to include. Pass none to skip web output.', choices: ['jpeg', 'png', 'svg'], default: ['jpeg', 'png', 'svg'] },
      { name: 'print', type: 'string[]', description: 'Print file types to include. Pass none to skip print output.', choices: ['eps', 'jpeg', 'pdf'], default: ['eps', 'jpeg', 'pdf'] },
      { name: 'treatments', type: 'string[]', description: 'Colourways to build.', choices: ['color', 'black', 'white'], default: ['color', 'black', 'white'] },
      { name: 'sizes', type: 'string[]', description: 'Raster sizes: large is 3000px, medium 1500px, small 600px on the long edge.', choices: ['large', 'medium', 'small'], default: ['large', 'medium', 'small'] },
      { name: 'padding', type: 'number', description: 'Clear space around the mark, as a fraction of the long edge (0 to 0.25).', default: 0 },
      { name: 'social', type: 'boolean', description: 'Also emit a square profile-picture version of each variation (web only).', default: false },
      outParam
    ],
    shot: shot('lockup', 'Toolbox in the Lockup tool: a logo on a white plate, with format, treatment and size switches in the right rail and a count of 73 files.')
  },
  {
    n: '02', slug: 'palette', name: 'Palette',
    blurb: 'Colours in, tokens and swatches out',
    summary: 'Turn colours, or the colours found in artwork, into developer and print swatch files.',
    whenToUse: 'Use to hand a colour system to developers (CSS, SCSS, design tokens), to Adobe apps (ASE), or to a client as a presentable sheet. Give it hex values directly, or point it at artwork and it pulls the colours out.',
    produces: 'CSS and SCSS variables, a design-tokens JSON, an Adobe .ase swatch file, and a swatch sheet as PDF and PNG, whichever outputs are requested.',
    input: 'Hex values, or artwork',
    outputs: ['CSS', 'SCSS', 'JSON', 'ASE', 'PDF', 'PNG'],
    command: "toolbox palette '#D32F05' '#003A5D' --name Acme --out .",
    params: [
      { name: 'colors', type: 'string[]', description: "Hex colours to include, for example '#D32F05' '#003A5D'.", primary: true },
      { name: 'input', type: 'string[]', description: 'Paths of artwork to pull colours from. SVGs contribute their exact fills; images contribute their dominant colours. Combines with colors.' },
      { name: 'name', type: 'string', description: 'Palette name, used for the file names and the sheet heading.', default: 'Palette' },
      { name: 'outputs', type: 'string[]', description: 'Which files to write.', choices: ['css', 'tokens', 'ase', 'sheet'], default: ['css', 'tokens', 'ase', 'sheet'] },
      outParam
    ],
    shot: shot('palette', 'Toolbox in the Palette tool: a poster filling the canvas, its colours sampled into a row of swatches, with the output files listed in the right rail.')
  },
  {
    n: '03', slug: 'specimen', name: 'Specimen',
    blurb: 'Fonts in, type sheets out',
    summary: 'Produce a type specimen sheet from fonts installed on this machine.',
    whenToUse: 'Use to show a typeface in a brand document or to compare faces on a page. Fonts must already be installed locally; this cannot use a font file that has not been installed.',
    produces: 'The specimen sheet as a PDF and a PNG.',
    input: 'Installed fonts',
    outputs: ['PDF', 'PNG'],
    command: 'toolbox specimen --template classic --family Helvetica --out .',
    params: [
      { name: 'template', type: 'string', description: "'brand' lays out named roles (heading, body, caption); 'classic' shows one family at a range of sizes.", choices: ['brand', 'classic'], default: 'brand' },
      { name: 'title', type: 'string', description: 'Heading printed on the sheet.', default: 'Typography' },
      { name: 'sample', type: 'string', description: 'The sentence set in each face.', default: 'The quick brown fox jumps over the lazy dog' },
      { name: 'family', type: 'string', description: "Font family for the 'classic' template, for example 'Helvetica'. Ignored by 'brand'." },
      outParam
    ],
    shot: shot('specimen', 'Toolbox in the Specimen tool: a live type sheet preview beside the display, heading and body styles.')
  },
  {
    n: '04', slug: 'convert', name: 'Convert',
    blurb: 'Images in, new formats and smaller files out',
    summary: 'Convert images between formats, resize them, and shrink their file size.',
    whenToUse: 'Use for any image file-format change (HEIC or TIFF to PNG, PNG to WebP, anything to PDF), to make images smaller for the web, or to cap their dimensions. Reads PNG, JPEG, WebP, GIF, BMP, ICO, AVIF and SVG everywhere, plus HEIC, TIFF and PSD on macOS. Not for logo deliverable packages; use Lockup for those.',
    produces: 'One converted file per source per format. With several formats, each gets its own subfolder (PNG/, WebP/, and so on).',
    input: 'PNG, JPEG, WebP, HEIC, TIFF, PSD, SVG',
    outputs: ['PNG', 'JPEG', 'WebP', 'TIFF', 'PDF'],
    command: 'toolbox convert a.heic b.png --formats webp --compression 40 --out ~/Desktop',
    params: [
      { name: 'input', type: 'string[]', description: 'Paths of the image files to convert.', required: true, primary: true },
      { name: 'formats', type: 'string[]', description: 'Output formats. Every input is written in each one.', choices: ['png', 'jpeg', 'webp', 'tiff', 'pdf'], default: ['png'] },
      { name: 'compression', type: 'number', description: 'How hard to compress, 0 to 100. 0 leaves the image untouched; 100 is the smallest this tool will go. Applies to JPEG, WebP and PDF; PNG and TIFF are lossless and ignore it.', default: 10 },
      { name: 'longestEdge', type: 'number', description: 'Cap the longest side, in pixels, keeping the aspect ratio. Omit to keep each image at its own size. Images already smaller are left alone.' },
      { name: 'background', type: 'string', description: "Fill behind transparency: 'none' keeps it wherever the format allows, or give a hex colour like '#ffffff'. JPEG and PDF have no transparency and fill with white when this is 'none'.", default: 'none' },
      outParam
    ],
    shot: shot('convert', 'Toolbox in the Convert tool: two posters listed with their measured output sizes per format, and format, compression and edge controls in the right rail.')
  }
];

export const last = tools[tools.length - 1].n;
export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

/** Where the installed binary is, per platform (docs/AGENTS.md). */
export const binaries = [
  { os: 'macOS', path: '/Applications/Toolbox.app/Contents/MacOS/Toolbox' },
  { os: 'Windows', path: '%LOCALAPPDATA%\\Programs\\toolbox\\Toolbox.exe' },
  { os: 'Linux', path: 'toolbox' }
];

/** The release builds live in the public releases repo; every file is checksummed there. */
export const RELEASES = 'https://github.com/tasyusef/toolbox/releases';
const file = (name: string) => `${RELEASES}/download/v${APP.version}/${name}`;
export const builds = [
  { os: 'macOS', note: 'Signed and notarized', files: [{ label: 'Apple silicon', href: file('Toolbox-1.0.0-arm64.dmg') }, { label: 'Intel', href: file('Toolbox-1.0.0.dmg') }] },
  { os: 'Windows', note: 'Not code-signed. SmartScreen asks once: More info, then Run anyway.', files: [{ label: 'Installer, x64 and arm64', href: file('Toolbox-Setup-1.0.0.exe') }] },
  { os: 'Linux', note: 'AppImage. Make it executable once.', files: [{ label: 'x86_64', href: file('toolbox-1.0.0-x86_64.AppImage') }, { label: 'arm64', href: file('toolbox-1.0.0-arm64.AppImage') }] }
];
