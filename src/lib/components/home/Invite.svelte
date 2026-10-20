<script lang="ts">
  // The invitation at the end of the page: the lead and the blackletter word, which scrambles
  // in with motion on, and the link. It scrolls with the page (PX-61): the pinned stage and the
  // drops landing into the word (PX-54) are gone. Laid out as one block like Contact's head (0197).
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import BuildingHead from '$lib/components/BuildingHead.svelte';
</script>

<section class="invitation" aria-labelledby="invite">
  <BuildingHead id="invite" />
  <div class="cta-wrap"><Cta variant="row" href="/contact/">Get in touch <Arrow /></Cta></div>
</section>

<style>
/* one block, as Contact's head (0197): the lead over the word, the link under them, all from the
   left; split across the page, the sentence read as two pieces and the link as a third */
.invitation{padding-top:var(--s8);padding-bottom:var(--s8);overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:var(--s4)}
.cta-wrap{width:var(--col-side);max-width:100%}
.cta-wrap :global(.cta-row){width:100%}
@media(max-width:700px){
  .invitation{padding-top:var(--s6);padding-bottom:var(--s6);gap:var(--s3)}
  .cta-wrap{width:100%}
}
</style>
