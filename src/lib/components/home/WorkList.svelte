<script lang="ts">
  // Selected work as a grid of cards (0196, on Timothy's “both the selected works and the work page
  // should use a grid”): the design system's card, two to a row, one on phones. No path bar, no
  // year and scope, no counter row (the eyebrows went with 0196). The cards sit on the page's rain.
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Card from '$lib/components/Card.svelte';
  import type { Card as CardData } from '$lib/work';
  import { fitTitles } from '$lib/fit';
  let { projects }: { projects: CardData[] } = $props();
</script>

<section class="list" id="work" aria-labelledby="work-title">
  <h2 id="work-title" class="sr-only">Selected work</h2>
  <div class="cards" use:fitTitles>
    {#each projects as p (p.slug)}<Card {p} heading="h3" />{/each}
  </div>
  <QuietLink href="/work/" label="All work" class="all" pad />
</section>

<style>
.list{padding-top:var(--s8);padding-bottom:var(--s8);display:flex;flex-direction:column;gap:var(--s4);scroll-margin-top:var(--s4)}
@media(max-width:900px){.list{padding-top:var(--s6);padding-bottom:var(--s6)}}
</style>
