import { error } from '@sveltejs/kit';
import { studies } from '$lib/work';
// The share-image compositions, rendered by the real components so they cannot drift
// from the site. Dev-only: `entries` is empty, so nothing is prerendered and the route
// does not ship; `tools/social/generate.mjs` screenshots it from a dev server.
export const prerender = true;
export const entries = () => [];
export function load({ params }) {
  const id = params.id;
  if (id === 'home') return { id, chromePath: '/' };
  if (id === 'work' || id === 'contact') return { id, chromePath: `/${id}/` };
  const project = studies.find((p) => p.slug === id);
  if (!project) error(404);
  return { id, project, chromePath: `/work/${project.slug}/` };
}
