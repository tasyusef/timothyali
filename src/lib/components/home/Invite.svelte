<script lang="ts">
  // The invitation at the end of the page: the lead and the blackletter word, which scrambles
  // in with motion on, and the link. It scrolls with the page (PX-61): the pinned stage and the
  // drops landing into the word (PX-54) are gone. Laid out as one block like Contact's head (0197).
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { STEP_FAST } from '$lib/tokens';
</script>

<section class="invitation" aria-labelledby="invite">
  <h2 id="invite"><span class="display intro">Tell me what<br />you’re</span><span class="blackletter display-xl inv-word"><Decode text="building." step={STEP_FAST} /></span></h2>
  <div class="cta-wrap"><Cta variant="row" href="/contact/" class="lbl">Get in touch <Arrow /></Cta></div>
</section>

<style>
/* one block, as Contact's head (0197): the lead over the word, the link under them, all from the
   left; split across the page, the sentence read as two pieces and the link as a third */
.invitation{padding-top:var(--s8);padding-bottom:var(--s8);overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:var(--s4)}
.invitation h2{display:flex;flex-direction:column;align-items:flex-start;gap:var(--s2);margin:0}
.invitation .intro{line-height:64px}
.cta-wrap{width:448px;max-width:100%}
.cta-wrap :global(.cta-row){width:100%}
@media(max-width:1300px){.invitation .intro{font-size:41.25px;line-height:48px}}
@media(max-width:700px){
  .invitation{padding-top:var(--s6);padding-bottom:var(--s6);gap:var(--s3)}
  .cta-wrap{width:100%}
}
</style>
