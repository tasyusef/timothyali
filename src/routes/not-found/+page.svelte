<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import { STEP } from '$lib/tokens';
</script>
<svelte:head><title>Not found — Timothy Ali</title><meta name="robots" content="noindex" /><meta name="description" content="There is nothing at this path." /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <Band class="lost" mode="sparse" seed={4} avoid=".lost h1 > span, .lost p, .lost .cta">
    <p class="lbl status"><span>404</span><span>SYS.ERR / No such path</span></p>
    <h1><span class="blackletter display-xl"><Decode text="lost." step={STEP} /></span></h1>
    <p class="display">Nothing lives at this path.<br />The index does.</p>
    <Cta href="/" class="lbl">Back to index <Arrow /></Cta>
  </Band>
</main>
<style>
main :global(.lost){position:relative;isolation:isolate;overflow:hidden;min-height:calc(100vh - 96px);min-height:round(down,calc(100vh - 96px),8px);padding-top:var(--s6);padding-bottom:var(--s8)}
.status{display:flex;gap:var(--s2);margin-bottom:var(--s6)}
.status>span{background:var(--paper);padding:var(--s1)}
.status>span:first-child{background:var(--accent);color:var(--on-accent)}
h1{margin-bottom:var(--s4)}
.display{margin-bottom:var(--s6);line-height:64px}
</style>
