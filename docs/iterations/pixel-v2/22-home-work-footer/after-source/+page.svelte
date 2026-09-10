<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import { projects } from '$lib/work';
  import { TICK_SLOW, TICK_FAST, STEP_SLOW, STEP, STEP_FAST } from '$lib/tokens';
  // The third label shortens to “Product” on phones so it does not wrap under its word (0076).
  const qualities: [string, string, string?][] = [['looks.', 'Brand'], ['moves.', 'Motion'], ['works.', 'Product / front end', 'Product']];
</script>
<svelte:head><title>Timothy Ali — Designer & builder</title><meta name="description" content="I’m tim. Designer for teams that don’t have one yet. Brand, product, motion, front end." /></svelte:head>
<main id="main" tabindex="-1">
  <Band class="hero" aria-labelledby="intro" mode="sky" seed={3} tick={TICK_SLOW} density={0.9} avoid=".hero-hint">
    <h1 id="intro" class="blackletter hero-name"><Decode text="i’m tim." mode="type" step={STEP_SLOW} delay={500} cursor /></h1>
    <Cta variant="hint" class="hero-hint lbl" aria-hidden="true">Scroll<svg class="arrow" width="16" height="16" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M3 0h1v1h-1zM3 1h1v1h-1zM3 2h1v1h-1zM3 3h1v1h-1zM3 4h1v1h-1zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1zM0 4h1v1h-1zM6 4h1v1h-1zM1 5h1v1h-1zM5 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1z" fill="currentColor" /></svg></Cta>
  </Band>

  <section class="who" aria-labelledby="statement-title">
    <h2 id="statement-title" class="para">
      <span class="display">Designer for teams that don’t have one yet. Whatever you’re building, I care how it</span>
      <span class="words">{#each qualities as [word, label, short], i}<span class="blackletter w"><Decode text={word} step={STEP} delay={i * 150} /></span><span class="lbl note" aria-hidden="true">{#if short}<span class="note-full">{label}</span><span class="note-short">{short}</span>{:else}{label}{/if}</span>{/each}</span>
    </h2>
    <p class="sr-only">Looks: brand. Moves: motion. Works: product and front end.</p>
  </section>

  <Band as="div" class="work-rain" mode="fall" seed={5} tick={TICK_FAST} density={0.7} avoid=".index-row > span, .work-statement, .work-foot a, .invitation h2 > span, .invitation .cta-row">
  <section class="work-index" aria-labelledby="work-title">
    <IndexRow label="Selected work" value={`01–${projects[projects.length - 1].n}`} />
    <h2 id="work-title" class="work-statement display">I’ve built products <span class="blackletter">of my own,</span><br />and helped teams ship <span class="blackletter">theirs.</span></h2>
    <div class="cards">
      {#each projects as p, i}
        <a class="card" href={`/work/${p.slug}/`}>
          <Picture src={p.cover.src} alt={p.cover.alt} eager={i < 3} />
          <div class="card-body"><MetaLine project={p} short /><h3 class="display-s">{p.title}</h3><Arrow /></div>
        </a>
      {/each}
    </div>
    <div class="work-foot"><Cta variant="quiet" class="lbl" href="/work/">All work <Arrow /></Cta></div>
  </section>

  <section class="invitation" aria-labelledby="invite">
    <h2 id="invite"><span class="display">Tell me what<br />you’re</span><span class="blackletter display-xl"><Decode text="building." step={STEP_FAST} /></span></h2>
    <Cta variant="row" href="/contact/" class="lbl">Get in touch <Arrow /></Cta>
  </section>
  </Band>
</main>
<style>
/* `.hero` and `.work-rain` are rendered by Band, so this page reaches them with
   :global() anchored on its own <main>. Everything else is in its own markup. */
main :global(.hero){min-height:calc(100vh - 96px);min-height:round(down,calc(100vh - 96px),8px);display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:var(--s8);overflow:hidden}
.hero-name{font-size:344px;line-height:344px}
main :global(.hero-hint){position:absolute;right:var(--gutter);bottom:var(--s8)}
:global(.hero-hint) .arrow{display:block;transform:translateY(0)}
:global(.motion .hero-hint) .arrow{animation:nudge var(--tick-cursor) steps(2,jump-none) infinite}
@keyframes nudge{from{transform:translateY(0)}to{transform:translateY(2px)}}
.who{padding-top:var(--s8);padding-bottom:var(--s8);background:var(--fg);color:var(--paper)}
.who ::selection{background:var(--paper);color:var(--fg)}
.para{font-size:55px;line-height:64px}
.para .display{display:inline;font-size:55px;line-height:64px}
.words{display:block;font-size:129px;line-height:128px}
.para .w{font-size:129px;line-height:128px;display:inline;margin-right:var(--s3)}
/* the one deliberate use of primitives outside tokens.css: this plate must not
   invert with the theme, or yellow lands on the white panel again (0067) */
.para .note{background:var(--ink);color:var(--yellow);display:inline-block;vertical-align:baseline;padding:var(--s1);margin-right:var(--s2)}
.note-short{display:none}
.work-statement{padding-bottom:var(--s6)}
.work-statement{line-height:88px} /* room for the 86px blackletter words inline with 55px caps */
.work-statement .blackletter{font-size:86px;line-height:inherit;text-transform:none}
.work-foot{display:flex;justify-content:flex-end;padding-top:var(--s4)}
.work-foot :global(.cta-quiet){display:flex;justify-content:space-between;width:calc(50% - var(--s2));background:var(--paper);padding:var(--s2)}
.work-foot :global(.cta-quiet:hover),.work-foot :global(.cta-quiet:focus-visible){background:var(--fg);color:var(--paper)}
.work-foot :global(.cta-quiet:hover .mono),.work-foot :global(.cta-quiet:focus-visible .mono){color:inherit}
main :global(.work-rain){position:relative;isolation:isolate;overflow:hidden}
:global(.work-rain) .card{background-color:var(--paper)}
.work-index{padding-top:var(--s8);padding-bottom:var(--s8)}
.invitation{padding-top:var(--s8);padding-bottom:var(--s8);overflow:hidden}
.invitation h2{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:var(--s4);padding-bottom:var(--s6)}
.invitation :global(.cta-row){width:calc(50% - var(--s2));margin-left:auto}
@media(max-width:1100px){.invitation h2{flex-direction:column;align-items:flex-start;gap:var(--s2)}}
@media(max-width:1100px){.hero-name{font-size:258px;line-height:258px}.words,.para .w{font-size:86px}}
@media(max-width:700px){
  main :global(.hero){min-height:80vh;min-height:round(down,80vh,8px);padding-bottom:var(--s6)}
  .hero-name{font-size:129px;line-height:129px}
  main :global(.hero-hint){position:static;margin-top:var(--s2);align-self:flex-start}
  .who{padding-top:var(--s6);padding-bottom:var(--s6)}
  .para{font-size:41.25px;line-height:48px}.para .display{font-size:41.25px;line-height:48px}.words,.para .w{font-size:86px;line-height:96px}.para .w{margin-right:var(--s1)}.para .note{padding:var(--s1);margin-right:0}.note-full{display:none}.note-short{display:inline}
  .work-statement{padding-bottom:var(--s4)}
  .work-statement{font-size:27.5px;line-height:40px}.work-statement .blackletter{font-size:43px}
  .work-foot :global(.cta-quiet),.invitation :global(.cta-row){width:100%}
  .invitation{padding-top:var(--s6);padding-bottom:var(--s6)}
  .invitation h2{padding-bottom:var(--s4)}
  .work-index{padding-top:var(--s6);padding-bottom:var(--s6)}
}
@media(max-width:420px){.para .w{margin-right:0}} /* “moves.” + its chip is exactly the 320 box; the chip’s own padding keeps the gap */
</style>
