import { error } from '@sveltejs/kit';
import { studies } from '$lib/work';
import { tools } from '$lib/toolbox';
import { socialPages } from '$lib/social';
// The share-image compositions, rendered by the real components so they cannot drift
// from the site. Dev-only: `entries` is empty, so nothing is prerendered and the route
// does not ship; `tools/social/generate.mjs` screenshots it from a dev server.
export const prerender = true;
export const entries = () => [];
export function load({ params }) {
  const id = params.id;
  // the Instagram story and the Twitter/X frame are Home's, at other sizes
  if (id === 'story' || id === 'wide') return { id, chromePath: '/' };
  // every other image is a page's (socialPages, 0210): tools are `toolbox-<slug>` and studies
  // `work-<slug>` (0132), so a tool, a study and the Toolbox page never share a file name
  const at = socialPages.find((p) => p.image === id);
  if (!at) error(404);
  const tool = tools.find((t) => at.path === `/toolbox/${t.slug}/`);
  const project = studies.find((p) => at.path === `/work/${p.slug}/`);
  return { id, chromePath: at.path, tool, project };
}
