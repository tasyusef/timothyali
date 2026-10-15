<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import { projects, index } from '$lib/work';
  import { STEP } from '$lib/tokens';
  import { fitTitles } from '$lib/fit';
</script>
<main class="inner-page" id="main" tabindex="-1">
  <section>
    <header class="work-header">
      <h1 class="page-head"><span class="blackletter display-xl"><Decode text="work." step={STEP} /></span></h1>
    </header>
    <!-- every study as a card (0196, Timothy: “every case study should have a card”): the selected
         four first, then the rest, in one grid; no counters, no year and scope -->
    <div class="cards" use:fitTitles>
      {#each [...projects, ...index] as p, i (p.slug)}<Card {p} id={p.slug} eager={i < 2} />{/each}
    </div>
    <!-- the longest page ended on a 16px dim link; it ends on the action row Home ends on (0206) -->
    <div class="end"><Cta variant="row" href="/contact/" class="lbl"><span>Tell me what you’re building</span><span>Get in touch <Arrow /></span></Cta></div>
  </section>
</main>
<style>
.work-header{padding:var(--s2) 0 var(--s6)}
.page-head{min-width:0}
.cards :global(.card){scroll-margin-top:var(--s2)}
.end{margin:var(--s8) 0 var(--s4)}
@media(max-width:700px){.end{margin-top:var(--s6)}}
@media(max-width:700px){.work-header{padding:var(--s1) 0 var(--s4)}}
</style>
