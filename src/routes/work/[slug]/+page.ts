import { error } from '@sveltejs/kit';
import { studies } from '$lib/work';
import type { PageLoad, EntryGenerator } from './$types';

// Every visible project has a study (0077); the Next chain runs 01 → 08 → 01.
export const entries: EntryGenerator = () => studies.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
  const i = studies.findIndex((p) => p.slug === params.slug);
  if (i < 0) error(404, 'No such project');
  return { project: studies[i], next: studies[(i + 1) % studies.length] };
};
