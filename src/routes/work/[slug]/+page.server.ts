import { error } from '@sveltejs/kit';
import { studies, card, total } from '$lib/work';
import { withNext } from '$lib/chain';
import type { PageServerLoad, EntryGenerator } from './$types';

// Every visible project has a study (0077); the Next chain runs 01 → 08 → 01. Loaded on the server
// (at prerender), so a study's page ships its own copy and not the whole catalog (0214).
export const entries: EntryGenerator = () => studies.map((p) => ({ slug: p.slug }));

export const load: PageServerLoad = ({ params }) => {
  const at = withNext(studies, params.slug);
  if (!at) error(404, 'No such project');
  return { project: at.item, next: card(at.next), total };
};
