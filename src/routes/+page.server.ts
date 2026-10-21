import { projects, card } from '$lib/work';
// Home's four cards, read from the catalog at prerender (0214)
export const load = () => ({ cards: projects.map(card) });
