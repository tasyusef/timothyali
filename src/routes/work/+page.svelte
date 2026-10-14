<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import { projects, index } from '$lib/work';
  import { STEP } from '$lib/tokens';
  import { fitTitle } from '$lib/fit';
  import { WORK_DESCRIPTION } from '$lib/social';
</script>
<svelte:head><title>Work / Timothy Ali</title><meta name="description" content={WORK_DESCRIPTION} /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <section>
    <header class="work-header">
      <h1 class="page-head"><span class="blackletter display-xl"><Decode text="work." step={STEP} /></span></h1>
    </header>
    <!-- every study as a card (0196, Timothy: “every case study should have a card”): the selected
         four first, then the rest, in one grid; no counters, no year and scope -->
    <div class="cards">
      {#each [...projects, ...index] as p, i}
        <a id={p.slug} class="card" href={`/work/${p.slug}/`}>
          <Picture src={p.cover.src} alt={p.cover.alt} eager={i < 2} sizes="(min-width: 1440px) 680px, (min-width: 701px) calc((100vw - 96px) / 2), calc(100vw - 32px)" />
          <div class="card-body"><h2 class="display-s" use:fitTitle>{p.title}</h2><Arrow /><p class="body desc">{p.description}</p></div>
        </a>
      {/each}
    </div>
    <PageFoot note="" href="/contact/" label="Tell me what you’re building" />
  </section>
</main>
<style>
.work-header{padding:var(--s2) 0 var(--s6)}
.page-head{min-width:0}
.cards :global(.card){scroll-margin-top:var(--s2)}
@media(max-width:700px){.work-header{padding:var(--s1) 0 var(--s4)}}
</style>
