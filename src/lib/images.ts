/**
 * Build-time image manifest. Every file in src/lib/images is processed by
 * @sveltejs/enhanced-img (AVIF/WebP + responsive srcset, hashed URLs).
 * Data files keep referring to images as "/images/<project>/<file>" strings;
 * this module resolves those keys to the optimized picture data.
 */

export interface EnhancedImage {
	sources: Record<string, string>;
	img: { src: string; w: number; h: number };
}

const modules = import.meta.glob<{ default: EnhancedImage }>(
	'./images/**/*.{png,jpg,jpeg,webp,avif}',
	{ eager: true, query: { enhanced: true } }
);

// Glob keys look like "./images/sonde/hero.png" — strip the leading dot so
// lookups use the same "/images/…" paths the data files always have.
const manifest = new Map<string, EnhancedImage>(
	Object.entries(modules).map(([path, mod]) => [path.slice(1), mod.default])
);

export function getImage(src: string): EnhancedImage {
	const image = manifest.get(src);
	if (!image) throw new Error(`Unknown image: ${src} — is it in src/lib/images?`);
	return image;
}

/** Absolute URL of the optimized fallback image — for JSON-LD and OG tags. */
export function imageUrl(src: string, base: string): string {
	return new URL(getImage(src).img.src, base).href;
}
