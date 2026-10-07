<script lang="ts">
  // The invitation at the end of the page: the lead and the blackletter word, which scrambles
  // in with motion on, and the link. It scrolls with the page (PX-61): the pinned stage and the
  // drops landing into the word (PX-54) are gone.
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { STEP_FAST } from '$lib/tokens';
</script>

<section class="invitation" aria-labelledby="invite">
  <h2 id="invite"><span class="display lead">Tell me what<br />you’re</span><span class="blackletter display-xl inv-word"><Decode text="building." step={STEP_FAST} /></span></h2>
  <div class="cta-wrap"><Cta variant="row" href="/contact/" class="lbl">Get in touch <Arrow /></Cta></div>
</section>

<style>
.invitation{padding-top:var(--s8);padding-bottom:var(--s8);overflow:hidden}
.invitation h2{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:var(--s4);padding-bottom:var(--s6);margin:0}
.cta-wrap{display:flex;justify-content:flex-end}
.cta-wrap :global(.cta-row){width:round(down,calc(50% - var(--s2)),8px)}
@media(max-width:1100px){.invitation h2{flex-direction:column;align-items:flex-start;gap:var(--s2)}}
@media(max-width:700px){
  .invitation{padding-top:var(--s6);padding-bottom:var(--s6)}
  .invitation h2{padding-bottom:var(--s4)}
  .cta-wrap :global(.cta-row){width:100%}
}
</style>
