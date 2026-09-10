<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import { TICK_FAST, STEP_FAST } from '$lib/tokens';
</script>
<svelte:head><title>Get in touch — Timothy Ali</title><meta name="description" content="Tell me what you’re building. Connect with designer Timothy Ali about brand, product, motion, and front-end work." /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <Band class="contact" mode="fall" seed={3} density={0.55} tick={TICK_FAST} avoid=".contact h1 > span">
    <h1 class="page-head"><span class="display">Tell me what<br />you’re</span><span class="blackletter display-xl"><Decode text="building." step={STEP_FAST} /></span></h1>
  </Band>
  <section class="detail">
    <p class="body">Got an idea, an early team, or something that needs a designer?<br /><br />I’d like to hear about it.</p>
    <Cta href="https://linkedin.com/in/timothyali" class="lbl">Message me on LinkedIn <Arrow /></Cta>
    <PageFoot note="Brand / product / motion / front end" href="/work/" label="See my work" />
  </section>
</main>
<style>
/* `.contact` is rendered by Band; reached with :global() from this page's <main>. */
main :global(.contact){padding-bottom:var(--s8);overflow:hidden}
:global(.contact) h1{display:flex;flex-direction:column;gap:var(--s2)}
.detail{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);padding-top:var(--s8);align-items:end}
.detail .body{max-width:40ch}
.detail :global(.cta){justify-self:start}
.detail :global(.page-foot){grid-column:1/-1}
@media(max-width:700px){
  main :global(.contact){padding-bottom:var(--s6)}
  .detail{grid-template-columns:1fr;gap:var(--s3);padding-top:var(--s6)}
}
</style>
