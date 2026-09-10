import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// /og/[id] is the dev-only share-image route (tools/social/generate.mjs screenshots it);
// it declares no entries, so it is never crawled and must not ship. Any other unseen
// prerenderable route is still a build failure.
const DEV_ONLY = new Set(['/og/[id]']);
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    prerender: {
      handleUnseenRoutes: ({ routes }) => {
        const unexpected = routes.filter((r) => !DEV_ONLY.has(r));
        if (unexpected.length) throw new Error(`Prerenderable routes were not crawled: ${unexpected.join(', ')}`);
      }
    }
  }
};
