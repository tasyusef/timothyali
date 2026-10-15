<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import { STEP } from '$lib/tokens';
</script>
<svelte:head><title>Not found / Timothy Ali</title><meta name="robots" content="noindex" /><meta name="description" content="There is nothing at this path." /></svelte:head>
<main class="inner-page lost-main" id="main" tabindex="-1">
  <Band class="lost" mode="scene" shot="moon" seed={4} lightAs="dither" feather={12} depth={0.85} clearFeather={3} avoid=".lost h1 > span, .lost p.display">
    <!-- the 404 / SYS.ERR label row was an eyebrow, and “Head back home.” said the button twice (0206) -->
    <h1><span class="blackletter display-xl"><Decode text="lost." step={STEP} /></span></h1>
    <p class="display">This page doesn’t exist.</p>
    <Cta href="/" class="lbl">Back to home <Arrow /></Cta>
  </Band>
</main>
<style>
/* fills what the header and footer leave, so the page is one screen (0173) */
.lost-main{display:flex;flex-direction:column}
main :global(.lost){flex:1;position:relative;isolation:isolate;overflow:hidden;padding-top:var(--s6);padding-bottom:var(--s8)}
h1{margin-bottom:var(--s4)}
.display{margin-bottom:var(--s6);line-height:64px}
/* on a phone the sentence steps down under “lost.”; at 41px it ran five to seven lines and outweighed it */
@media(max-width:700px){.display{font-size:27.5px;line-height:32px;margin-bottom:var(--s4)}}
</style>
