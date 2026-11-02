// The Software layouts lab (PX-141): ten takes on /software/ for Timothy to compare. Dev only.
// The products are the live list; the screens are each product's own, where it has one.
import { products, type Product, type Shot } from '$lib/software';

export type { Shot };
export type Item = Product & { n: string };
export const items: Item[] = products.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0') }));
export const meta = (p: Product) => [p.kind, p.platforms.join(', '), p.version && `v${p.version}`].filter(Boolean).join(' / ');
export const LEAD = 'Apps and tools I make and ship.';
