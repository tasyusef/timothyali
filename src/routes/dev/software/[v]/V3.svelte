<script lang="ts">
  // 3. Marquee names: no hero of its own. Each product's name is the page's display type, one per
  // row, the field running behind all of them; its facts sit to the right, and its screen follows
  // the row you're on (the first is shown open).
  import Band from '$lib/components/Band.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, meta } from './lab';
  let on = $state('toolbox');
</script>
<main id="main" tabindex="-1">
  <Band class="names" mode="scene" shot="rise" seed={2} avoid=".names .nm > span" clear=".names .facts">
    <h1 class="sr-only">Software</h1>
    {#each items as p (p.slug)}
      <div class="row" class:on={on === p.slug} onpointerenter={() => (on = p.slug)} role="presentation">
        <a class="nm" href={p.href}><span class="blackletter">{p.slug}.</span></a>
        <div class="facts"><p class="lbl dim">{meta(p)}</p><p class="body">{p.line}</p><div class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div></div>
        {#if p.shot && on === p.slug}<div class="peek"><Picture src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} eager sizes="480px" /></div>{/if}
      </div>
    {/each}
  </Band>
</main>
<style>
main :global(.names){padding:var(--s6) var(--gutter) var(--s8);display:flex;flex-direction:column;gap:var(--s4)}
.row{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:var(--s4);align-items:center}
.nm{color:inherit;width:fit-content}.nm span{font-size:172px;line-height:176px}
@media(hover:hover){.nm:hover{color:var(--accent-text)}}
.row:not(.on) .nm{opacity:.35}
.facts{display:flex;flex-direction:column;gap:var(--s1)}.facts p{margin:0}
.links{display:flex;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s1)}
.peek{position:absolute;right:432px;top:50%;transform:translateY(-50%);width:400px;padding:var(--s1);background:var(--surface-card),var(--paper);pointer-events:none}
@media(max-width:1100px){.nm span{font-size:129px;line-height:136px}.peek{display:none}}
@media(max-width:900px){.row{grid-template-columns:1fr}.row:not(.on) .nm{opacity:1}}
@media(max-width:700px){.nm span{font-size:86px;line-height:88px}}
</style>
