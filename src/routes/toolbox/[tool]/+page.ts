import { error } from '@sveltejs/kit';
import { tools } from '$lib/toolbox';
import { withNext } from '$lib/chain';
import type { PageLoad, EntryGenerator } from './$types';

// One page per tool; the Next chain runs 01 → 04 → 01.
export const entries: EntryGenerator = () => tools.map((t) => ({ tool: t.slug }));

export const load: PageLoad = ({ params }) => {
  const at = withNext(tools, params.tool);
  if (!at) error(404, 'No such tool');
  return { tool: at.item, next: at.next };
};
