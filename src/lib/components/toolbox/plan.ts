// The parts of the app's engine the landing-page examples need, ported from GRIDFORM
// Studio (`src/engine/exportPlan.ts`, `paletteExport.ts`, `oklch.ts`, and the renderer's
// `lockup/planTree.ts`) so the file counts, folder trees and generated text on the site
// are the app's own naming rules, not a sketch of them. One logo version, no Pantone.

export type WebFormat = 'JPEG' | 'PNG' | 'SVG';
export type PrintFormat = 'EPS' | 'JPEG' | 'PDF';
export const allWebFormats: readonly WebFormat[] = ['JPEG', 'PNG', 'SVG'];
export const allPrintFormats: readonly PrintFormat[] = ['EPS', 'JPEG', 'PDF'];
export const allSizes = [
  { name: 'Large', longEdgePx: 3000 },
  { name: 'Medium', longEdgePx: 1500 },
  { name: 'Small', longEdgePx: 600 }
] as const;

export interface LockupChoice {
  prefix: string;
  version: { name: string; folder: string };
  includeWeb: boolean;
  includePrint: boolean;
  webFormats: readonly WebFormat[];
  printFormats: readonly PrintFormat[];
  treatments: readonly string[];
  sizes: readonly { name: string }[];
}

/** The relative paths an export writes, in write order (port of ExportPlan.swift). */
export function exportPlanFiles(c: LockupChoice): string[] {
  const web = new Set(c.webFormats), print = new Set(c.printFormats);
  const wantWeb = c.includeWeb && web.size > 0, wantPrint = c.includePrint && print.size > 0;
  const { prefix, sizes, treatments, version } = c;
  const webModes = ['Black', 'Color', 'White'].filter((m) => treatments.includes(m));
  const folderForMode: Record<string, string> = { Black: 'Black', Color: 'RGB (Color)', White: 'White' };
  const out: string[] = [];
  const v = version.name;
  if (wantPrint) {
    const base = `${version.folder}/PRINT`;
    if (treatments.includes('Black')) {
      if (print.has('EPS')) out.push(`${base}/Black/EPS/${prefix}_${v}_Black.eps`);
      if (print.has('JPEG')) for (const s of sizes) out.push(`${base}/Black/JPEG/${prefix}_${v}_Black_${s.name}.jpg`);
      if (print.has('PDF')) out.push(`${base}/Black/PDF/${prefix}_${v}_Black.pdf`);
    }
    if (treatments.includes('Color')) {
      if (print.has('EPS')) out.push(`${base}/CMYK (Color)/EPS/${prefix}_${v}_Color.eps`);
      if (print.has('JPEG')) for (const s of sizes) out.push(`${base}/CMYK (Color)/JPEG/${prefix}_${v}_Color_${s.name}.jpg`);
      if (print.has('PDF')) out.push(`${base}/CMYK (Color)/PDF/${prefix}_${v}_Color.pdf`);
    }
    if (treatments.includes('White')) {
      if (print.has('EPS')) out.push(`${base}/White/${prefix}_${v}_White.eps`);
      if (print.has('PDF')) out.push(`${base}/White/${prefix}_${v}_White.pdf`);
    }
  }
  if (wantWeb) {
    const webBase = `${version.folder}/WEB`;
    for (const mode of webModes) {
      const folder = folderForMode[mode];
      for (const s of sizes) {
        const name = `${prefix}_${v}_${mode}_${s.name}`;
        if (mode !== 'White' && web.has('JPEG')) out.push(`${webBase}/${folder}/JPEG/${name}.jpg`);
        if (web.has('PNG')) out.push(`${webBase}/${folder}/PNG/${name}.png`);
        if (web.has('SVG')) out.push(`${webBase}/${folder}/SVG/${name}.svg`);
      }
    }
  }
  if (wantPrint) out.push('README.txt');
  return out;
}

/** One node of the export tree, built from the plan's paths in their exact order. */
export interface PlanNode { id: string; name: string; children: PlanNode[]; fileCount: number }
export const isFile = (n: PlanNode): boolean => n.children.length === 0 && n.fileCount === 1;

export function buildPlanTree(paths: string[], rootName: string): PlanNode {
  interface Builder { name: string; order: string[]; children: Map<string, Builder> }
  const mk = (name: string): Builder => ({ name, order: [], children: new Map() });
  const root = mk(rootName);
  for (const path of paths) {
    let node = root;
    for (const part of path.split('/')) {
      if (!node.children.has(part)) { node.children.set(part, mk(part)); node.order.push(part); }
      node = node.children.get(part)!;
    }
  }
  const lower = (b: Builder, id: string): PlanNode => {
    if (b.order.length === 0) return { id, name: b.name, children: [], fileCount: 1 };
    const children = b.order.map((name) => lower(b.children.get(name)!, `${id}/${name}`));
    return { id, name: b.name, children, fileCount: children.reduce((sum, c) => sum + c.fileCount, 0) };
  };
  return lower(root, rootName);
}

// ------------------------------------------------------------------ colour

export interface PaletteEntry { name: string; hex: string }

export function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** `#rrggbb` from anything a person types; null when it does not parse. */
export function normalizedHex(s: string): string | null {
  const m = s.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{6}$/.test(m)) return '#' + m;
  if (/^[0-9a-f]{3}$/.test(m)) return '#' + [...m].map((c) => c + c).join('');
  return null;
}

/** sRGB → OKLCH, the notation the app writes beside every hex. */
export function hexToOklchString(hex: string): string {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb(hex).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${C < 0.005 ? 0 : H.toFixed(1)})`;
}

/** Naive process separation for the swatch sheet's CMYK line. */
export function cmyk(hex: string): number[] {
  const [r, g, b] = rgb(hex);
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return [0, 0, 0, 1];
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k];
}

export function slug(name: string): string {
  let out = '', pendingDash = false;
  for (const ch of name.toLowerCase()) {
    if (/\p{L}|\p{N}/u.test(ch)) { if (pendingDash && out !== '') out += '-'; pendingDash = false; out += ch; }
    else pendingDash = true;
  }
  return out === '' ? 'color' : out;
}
export function slugs(colors: PaletteEntry[]): string[] {
  const used = new Set<string>();
  return colors.map((c) => {
    const base = slug(c.name); let s = base, n = 2;
    while (used.has(s)) s = `${base}-${n++}`;
    used.add(s); return s;
  });
}
export function css(colors: PaletteEntry[]): string {
  const names = slugs(colors), lines = [':root {'];
  names.forEach((s, i) => lines.push(`  --${s}: ${colors[i].hex.toLowerCase()};`));
  names.forEach((s, i) => lines.push(`  --${s}-oklch: ${hexToOklchString(colors[i].hex)};`));
  lines.push('}');
  return lines.join('\n') + '\n';
}
export function scss(colors: PaletteEntry[]): string {
  const names = slugs(colors);
  return [...names.map((s, i) => `$${s}: ${colors[i].hex.toLowerCase()};`), ...names.map((s, i) => `$${s}-oklch: ${hexToOklchString(colors[i].hex)};`)].join('\n') + '\n';
}
export function tokensJSON(colors: PaletteEntry[]): string {
  const lines = ['{', '  "colors": {'];
  slugs(colors).forEach((s, i) => {
    lines.push(`    "${s}": {`, '      "$type": "color",', `      "$value": "${colors[i].hex.toLowerCase()}",`, '      "$extensions": {', `        "design.toolbox.oklch": "${hexToOklchString(colors[i].hex)}"`, '      }', `    }${i === colors.length - 1 ? '' : ','}`);
  });
  lines.push('  }', '}');
  return lines.join('\n') + '\n';
}
/** ASE size in bytes, the way the app's writer lays it out (header 12 + per swatch block). */
export function aseBytes(colors: PaletteEntry[]): number {
  return 12 + colors.reduce((n, c) => n + 6 + 2 + (c.name.length + 1) * 2 + 4 + 12 + 2, 0);
}

export const fileSize = (bytes: number): string => (bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} kB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);
/** Change against the source: a percentage until a doubling, then a multiplier. */
export const delta = (from: number, to: number): string => {
  if (from <= 0) return '';
  const ratio = to / from;
  if (ratio >= 2) return `×${Math.floor(ratio * 10) / 10}`;
  const pct = Math.trunc((ratio - 1) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}%`;
};
export const pad2 = (n: number): string => String(n).padStart(2, '0');
