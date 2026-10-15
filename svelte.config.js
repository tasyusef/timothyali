import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// /og/[id] is the dev-only share-image route (tools/social/generate.mjs screenshots it);
// it declares no entries, so it is never crawled and must not ship. Any other unseen
// prerenderable route is still a build failure.
const DEV_ONLY = new Set(['/og/[id]']);
// Content-Security-Policy (0207). SvelteKit hashes its own inline scripts and writes the policy
// into each prerendered page; the one inline script it does not know is app.html's theme
// script, hashed here from the file so the two cannot drift. Styles stay 'unsafe-inline' (Svelte
// writes style attributes); fonts and images allow data: for the inlined PARC Pixel and the
// Toolbox demos' canvases; nothing is loaded from another origin.
const appHtml = readFileSync(new URL('./src/app.html', import.meta.url), 'utf8');
const themeScript = `sha256-${createHash('sha256').update(appHtml.match(/<script>([\s\S]*?)<\/script>/)[1]).digest('base64')}`;
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ regions: ['iad1'], runtime: 'nodejs24.x' }),
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'script-src': ['self', themeScript],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:', 'blob:'],
        'font-src': ['self', 'data:'],
        'media-src': ['self', 'blob:'],
        'connect-src': ['self'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'form-action': ['self']
      }
    },
    prerender: {
      handleUnseenRoutes: ({ routes }) => {
        const unexpected = routes.filter((r) => !DEV_ONLY.has(r));
        if (unexpected.length) throw new Error(`Prerenderable routes were not crawled: ${unexpected.join(', ')}`);
      }
    }
  }
};
