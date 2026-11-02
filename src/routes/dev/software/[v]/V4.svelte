<script lang="ts">
  // 4. Datasheets: each product printed as a spec sheet. The name and number big on the left, a
  // table of facts in the middle, its screen on the right like the figure on a component's datasheet.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import { items, LEAD } from './lab';
</script>
<main id="main" tabindex="-1">
  <Band class="hero" mode="scene" shot="moon" seed={9} avoid=".hero h1 > span" clear=".hero .lead">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
    <p class="lead">{LEAD}</p>
  </Band>
  {#each items as p (p.slug)}
    <section class="sheet">
      <div class="id"><span class="mono dim">{p.n}</span><h2 class="display"><a href={p.href}>{p.name}</a></h2></div>
      <dl class="spec">
        <div><dt class="lbl dim">Kind</dt><dd class="body">{p.kind}</dd></div>
        <div><dt class="lbl dim">Runs on</dt><dd class="body">{p.platforms.join(', ') || (p.slug === 'sonde' ? 'Any browser' : 'The game')}</dd></div>
        <div><dt class="lbl dim">Version</dt><dd class="body">{p.version ? `v${p.version}` : 'Live'}</dd></div>
        <div><dt class="lbl dim">Does</dt><dd class="body">{p.line}</dd></div>
        <div><dt class="lbl dim">Get it</dt><dd class="body get">{#each p.links as l (l.href)}<a href={l.href}>{l.label}</a>{/each}</dd></div>
      </dl>
      <div class="fig">{#if p.shot}<Picture src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} sizes="33vw" />{:else}<div class="blank panel"><span class="blackletter">{p.slug}.</span></div>{/if}</div>
    </section>
  {/each}
</main>
<style>
main :global(.hero){padding:var(--s8) var(--gutter);min-height:480px;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--s3)}
.sheet{display:grid;grid-template-columns:2fr 3fr 3fr;gap:var(--s4);padding-top:var(--s6);padding-bottom:var(--s6);align-items:start}
.sheet:nth-of-type(even){background:var(--surface-card)}
.id{display:flex;flex-direction:column;gap:var(--s2)}.id a{color:inherit}
.spec{margin:0;display:flex;flex-direction:column;gap:var(--s2)}
.spec>div{display:grid;grid-template-columns:96px 1fr;gap:var(--s2);align-items:baseline}
.spec dd{margin:0}
.get{display:flex;flex-direction:column}.get a{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}
.fig{padding:var(--s1);background:var(--surface-card)}
.blank{aspect-ratio:3/2;display:grid;place-items:center}.blank span{font-size:86px;line-height:88px}
@media(max-width:1100px){.sheet{grid-template-columns:1fr 1fr}.fig{grid-column:1/-1}}
@media(max-width:700px){.sheet{grid-template-columns:1fr}}
</style>
