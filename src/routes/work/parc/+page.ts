// Declares this route's brand theme. The root layout stamps it as data-brand on the
// page wrapper and parc-theme.css (imported by +page.svelte) restyles under it.
export const load = () => ({ brand: 'parc' as const });
