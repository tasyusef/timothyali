<script lang="ts">
  // The Software layouts lab (PX-141): /dev/software/1 … /10. Dev only (svelte.config.js DEV_ONLY).
  import { page } from '$app/state';
  import V1 from './V1.svelte'; import V2 from './V2.svelte'; import V3 from './V3.svelte'; import V4 from './V4.svelte'; import V5 from './V5.svelte';
  import V6 from './V6.svelte'; import V7 from './V7.svelte'; import V8 from './V8.svelte'; import V9 from './V9.svelte'; import V10 from './V10.svelte';
  const all = [V1, V2, V3, V4, V5, V6, V7, V8, V9, V10];
  const names = ['Listing', 'Terminal', 'Marquee names', 'Datasheets', 'Boxes', 'Desktop', 'Index and screens', 'Strips', 'Tree', 'Bento'];
  const n = $derived(Math.min(10, Math.max(1, Number(page.params.v) || 1)));
  const View = $derived(all[n - 1]);
</script>
<View />
<nav class="switch lbl" aria-label="Layouts">{#each names as name, i (name)}<a href={`/dev/software/${i + 1}/`} aria-current={n === i + 1 ? 'page' : undefined}>{i + 1} {name}</a>{/each}</nav>
<style>
.switch{position:fixed;left:8px;bottom:8px;z-index:50;display:flex;flex-wrap:wrap;gap:4px;max-width:calc(100vw - 16px);background:var(--fg);color:var(--paper);padding:4px}
.switch a{padding:4px 8px;color:inherit}.switch a[aria-current]{background:var(--accent);color:var(--on-accent)}
:global(html.shoot) .switch{display:none}
</style>
