import { error } from '@sveltejs/kit';
import { studies } from '$lib/work';
import { withNext } from '$lib/chain';
import type { PageLoad, EntryGenerator } from './$types';

// Every visible project has a study (0077); the Next chain runs 01 → 08 → 01.
export const entries: EntryGenerator = () => studies.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
  const at = withNext(studies, params.slug);
  if (!at) error(404, 'No such project');
  return { project: at.item, next: at.next };
};
