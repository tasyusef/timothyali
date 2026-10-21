<script lang="ts">
  // A project's card (0196): its cover, its title and arrow, its one-line description. Home's
  // selected four and Work's nine are the same card (0207); Home's sit under the hero, below the
  // fold, so only Work's first two load eagerly.
  import Arrow from './Arrow.svelte';
  import Picture from './Picture.svelte';
  import type { Card } from '$lib/work';
  let { p, heading = 'h2', eager = false, id }: { p: Card; heading?: 'h2' | 'h3'; eager?: boolean; id?: string } = $props();
  // the cover's rendered width, measured (0207): the card's padding takes 32px a side of the column
  const SIZES = '(min-width: 701px) calc((100vw - 160px) / 2), calc(100vw - 64px)';
</script>
<a {id} class="card" href={`/work/${p.slug}/`}>
  <Picture src={p.cover.src} alt={p.cover.alt} phone={p.cover.phone} {eager} sizes={SIZES} />
  <div class="card-body"><svelte:element this={heading} class="display-s">{p.title}</svelte:element><Arrow /><p class="body desc">{p.description}</p></div>
</a>
