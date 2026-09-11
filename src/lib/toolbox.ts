// Toolbox: the four tools, in the order the app lists them, plus the facts the pages
// share. `summary`, `whenToUse` and `produces` are copied from the app's own catalog
// (gridform/src/shared/toolCatalog.ts), the same strings the CLI prints and the MCP
// server hands an agent, so the site cannot describe a tool differently from the thing
// itself. The only edit is punctuation: no em dashes. When a summary changes there,
// change it here. Commands are copied from the app's docs/AGENTS.md for the same reason.

export interface Shot { src: string; w: number; h: number; alt: string }

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
  shot: Shot;
}

const shot = (name: string, alt: string): Shot => ({ src: `/toolbox/${name}.png`, w: 2880, h: 1744, alt });

export const APP = {
  name: 'Toolbox',
  version: '1.0.0',
  platforms: ['macOS', 'Windows', 'Linux'],
  interfaces: ['App', 'CLI', 'MCP'],
  status: 'Waiting on signing',
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

export const builds = [
  { os: 'macOS', note: 'Apple silicon and Intel', formats: 'dmg, zip' },
  { os: 'Windows', note: 'x64 and arm64 installer', formats: 'exe' },
  { os: 'Linux', note: 'x64 and arm64', formats: 'AppImage, deb' }
];
