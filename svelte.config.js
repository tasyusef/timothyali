import cloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync, renameSync, writeFileSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE_URL } from './src/lib/shared.js';
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
// Cloudflare Workers. wrangler.jsonc's `main` is where the adapter writes SvelteKit's worker; it is
// moved aside to sveltekit.js and `main` becomes a small entry that adds the daily cron (Workers
// run a cron through the entry's `scheduled`, which the adapter's worker doesn't have). The cron
// asks the site for /api/releases-snapshot as Vercel's cron did, with the same secret.
const ENTRY = '.svelte-kit/cloudflare-worker';
const cf = cloudflare();
const adapter = {
  ...cf,
  async adapt(builder) {
    await cf.adapt(builder);
    renameSync(`${ENTRY}/index.js`, `${ENTRY}/sveltekit.js`);
    writeFileSync(`${ENTRY}/index.js`, `import worker from './sveltekit.js';
export default {
  fetch: worker.fetch,
  async scheduled(_controller, env, ctx) {
    const headers = env.CRON_SECRET ? { authorization: \`Bearer \${env.CRON_SECRET}\` } : {};
    const res = await worker.fetch(new Request('${SITE_URL}/api/releases-snapshot', { headers }), env, ctx);
    if (!res.ok) throw new Error(\`releases snapshot: \${res.status}\`);
  }
};
`);
    appendFileSync('.svelte-kit/cloudflare/.assetsignore', '\n.DS_Store\n**/.DS_Store\n');
    // A page asked for without its slash is sent on with a permanent 308, as Vercel did; Workers'
    // own trailing-slash handling answers 307. One rule per prerendered page, from the build.
    const pages = builder.prerendered.paths.filter((p) => p.length > 1 && p.endsWith('/'));
    appendFileSync('.svelte-kit/cloudflare/_redirects', `\n# pages without their slash\n${pages.map((p) => `${p.slice(0, -1)} ${p} 308`).join('\n')}\n`);
  }
};
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter,
    // Every page's stylesheets go into its HTML (0214): five files blocked the first paint, about
    // 430 ms on a phone and 890 ms on Toolbox, and the largest is 26 KB (6 KB compressed).
    // Pages reached by a link still load them as files.
    inlineStyleThreshold: Infinity,
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
