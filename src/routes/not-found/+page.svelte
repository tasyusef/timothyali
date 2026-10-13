<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import { STEP, TICK_SLOW } from '$lib/tokens';
</script>
<svelte:head><title>Not found / Timothy Ali</title><meta name="robots" content="noindex" /><meta name="description" content="There is nothing at this path." /></svelte:head>
<main class="inner-page lost-main" id="main" tabindex="-1">
  <Band class="lost" mode="scene" shot="moon" seed={4} tick={TICK_SLOW} palette="scene" cell={8} px={1} lightAs="dither" hug pad={0} feather={3} depth={0.6} avoid=".lost h1 > span, .lost p.display" clear=".status > span:last-child">
    <p class="lbl status"><span>404</span><span>SYS.ERR / No such path</span></p>
    <h1><span class="blackletter display-xl"><Decode text="lost." step={STEP} /></span></h1>
    <p class="display">This page doesn’t exist.<br />Head back home.</p>
    <Cta href="/" class="lbl">Back to home <Arrow /></Cta>
  </Band>
</main>
<style>
/* fills what the header and footer leave, so the page is one screen (0173) */
.lost-main{display:flex;flex-direction:column}
main :global(.lost){flex:1;position:relative;isolation:isolate;overflow:hidden;padding-top:var(--s6);padding-bottom:var(--s8)}
.status{display:flex;gap:var(--s2);margin-bottom:var(--s6)}
.status>span{padding:var(--s1)}
.status>span:first-child{background:var(--accent);color:var(--on-accent)}
h1{margin-bottom:var(--s4)}
.display{margin-bottom:var(--s6);line-height:64px}
</style>
