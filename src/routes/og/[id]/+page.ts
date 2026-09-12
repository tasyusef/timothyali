import { error } from '@sveltejs/kit';
import { studies } from '$lib/work';
import { tools } from '$lib/toolbox';
// The share-image compositions, rendered by the real components so they cannot drift
// from the site. Dev-only: `entries` is empty, so nothing is prerendered and the route
// does not ship; `tools/social/generate.mjs` screenshots it from a dev server.
export const prerender = true;
export const entries = () => [];
export function load({ params }) {
  const id = params.id;
  if (id === 'home' || id === 'story' || id === 'wide') return { id, chromePath: '/' };
  if (id === 'work' || id === 'contact' || id === 'toolbox') return { id, chromePath: `/${id}/` };
  if (id === 'toolbox-agents') return { id, chromePath: '/toolbox/agents/' };
  // Tool images are `toolbox-<slug>` so a tool and a study can never share a file name.
  const tool = tools.find((t) => `toolbox-${t.slug}` === id);
  if (tool) return { id, tool, chromePath: `/toolbox/${tool.slug}/` };
  const project = studies.find((p) => p.slug === id);
  if (!project) error(404);
  return { id, project, chromePath: `/work/${project.slug}/` };
}
