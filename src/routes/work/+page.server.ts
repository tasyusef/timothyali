import { projects, index, card } from '$lib/work';
// every study as a card, the selected four first, read from the catalog at prerender (0214)
export const load = () => ({ cards: [...projects, ...index].map(card) });
