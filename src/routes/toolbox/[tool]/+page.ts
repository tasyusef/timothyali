import { error } from '@sveltejs/kit';
import { tools } from '$lib/toolbox';
import type { PageLoad, EntryGenerator } from './$types';

// One page per tool; the Next chain runs 01 → 04 → 01.
export const entries: EntryGenerator = () => tools.map((t) => ({ tool: t.slug }));

export const load: PageLoad = ({ params }) => {
  const i = tools.findIndex((t) => t.slug === params.tool);
  if (i < 0) error(404, 'No such tool');
  return { tool: tools[i], next: tools[(i + 1) % tools.length] };
};
