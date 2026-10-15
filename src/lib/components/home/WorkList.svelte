<script lang="ts">
  // Selected work as a grid of cards (0196, on Timothy's “both the selected works and the work page
  // should use a grid”): the design system's card, two to a row, one on phones. No path bar, no
  // year and scope, no counter row (the eyebrows went with 0196). The cards sit on the page's rain.
  import Arrow from '$lib/components/Arrow.svelte';
  import Card from '$lib/components/Card.svelte';
  import { projects } from '$lib/work';
  import { fitTitles } from '$lib/fit';
</script>

<section class="list" id="work" aria-labelledby="work-title">
  <h2 id="work-title" class="sr-only">Selected work</h2>
  <div class="cards" use:fitTitles>
    {#each projects as p (p.slug)}<Card {p} heading="h3" />{/each}
  </div>
  <a class="all lbl" href="/work/">All work <Arrow /></a>
</section>

<style>
.list{padding-top:var(--s8);padding-bottom:var(--s8);display:flex;flex-direction:column;gap:var(--s4);scroll-margin-top:var(--s4)}
/* over the rain the card's dither mat needs the paper under it */
.list :global(.card){background:var(--surface-card),var(--paper)}
.list :global(.card:focus-visible){background:var(--surface-card-hover),var(--paper)}@media(hover:hover){.list :global(.card:hover){background:var(--surface-card-hover),var(--paper)}}
.all{align-self:flex-start;display:inline-flex;gap:var(--s1);padding:var(--s1);color:var(--fg);text-decoration:none;background:var(--paper)}
.all:focus-visible{background:var(--fg);color:var(--paper)}@media(hover:hover){.all:hover{background:var(--fg);color:var(--paper)}}
@media(max-width:900px){.list{padding-top:var(--s6);padding-bottom:var(--s6)}}
</style>
