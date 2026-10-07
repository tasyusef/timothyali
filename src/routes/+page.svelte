<script lang="ts">
  // Home as a page that scrolls (PX-61, on Timothy's direction after the pinned stages of
  // PX-54): the terminal hero, the statement on its inverted panel, the four selected
  // projects as rows and the invitation on one continuous rain (0059), then the footer.
  import Band from '$lib/components/Band.svelte';
  import Hero from '$lib/components/home/Hero.svelte';
  import Statement from '$lib/components/home/Statement.svelte';
  import WorkList from '$lib/components/home/WorkList.svelte';
  import Invite from '$lib/components/home/Invite.svelte';
  import { TICK_FAST } from '$lib/tokens';
</script>
<svelte:head><title>Timothy Ali / Product designer who ships in code</title><meta name="description" content="Timothy Ali, product designer in Denver who ships in code. Interfaces, design systems, and front ends in TypeScript. Open to full-time and contract work." /></svelte:head>
<main id="main" tabindex="-1">
  <Hero />
  <Statement />
  <Band as="div" class="work-rain" mode="fall" seed={5} tick={TICK_FAST} density={0.7} shade avoid=".index-row > span, .row-copy > *, .list .all, .invitation h2 > span, .invitation .cta-row">
    <WorkList />
    <Invite />
  </Band>
</main>
<style>
main :global(.work-rain){position:relative;isolation:isolate;overflow:hidden}
</style>
