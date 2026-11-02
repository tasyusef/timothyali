<script lang="ts">
  // 6. Desktop: the field is a desktop. The products are icons down the left; one is open in a
  // window (title bar, its screen, its facts and links); pick another icon and its window comes up.
  import Band from '$lib/components/Band.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, meta } from './lab';
  let open = $state('toolbox');
  const cur = $derived(items.find((p) => p.slug === open)!);
</script>
<main id="main" tabindex="-1">
  <h1 class="sr-only">Software</h1>
  <Band class="desk" mode="scene" shot="hero" mountains="a" seed={10} avoid=".desk .icons button, .desk .win">
    <div class="icons">
      {#each items as p (p.slug)}
        <button type="button" aria-pressed={open === p.slug} onclick={() => (open = p.slug)}><span class="glyph blackletter">{p.name[0].toLowerCase()}</span><span class="lbl">{p.slug}</span></button>
      {/each}
    </div>
    <div class="stack">
      {#each items.filter((p) => p.slug !== open).slice(0, 2) as p, i (p.slug)}<div class="ghost panel" style:--i={i + 1}><div class="title lbl"><span>{p.name}</span></div></div>{/each}
      <article class="win panel">
        <div class="title lbl"><span>{cur.name}</span><span>{cur.version ? `v${cur.version}` : 'live'}</span></div>
        {#if cur.shot}<div class="shot"><Picture src={cur.shot.src} alt={cur.shot.alt} width={cur.shot.w} height={cur.shot.h} eager sizes="760px" /></div>{/if}
        <div class="info"><p class="lbl dim">{meta(cur)}</p><p class="body">{cur.line}</p><div class="links">{#each cur.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div></div>
      </article>
    </div>
  </Band>
</main>
<style>
main :global(.desk){min-height:calc(100vh - 64px);padding:var(--s4) var(--gutter);display:grid;grid-template-columns:120px minmax(0,1fr);gap:var(--s4)}
.icons{display:flex;flex-direction:column;gap:var(--s3)}
.icons button{all:unset;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:var(--s1);padding:var(--s1)}
.glyph{width:72px;height:72px;display:grid;place-items:center;font-size:86px;line-height:72px;background:var(--fg);color:var(--paper)}
.icons button[aria-pressed=true] .glyph{background:var(--accent);color:var(--on-accent)}
.icons button[aria-pressed=true] .lbl{background:var(--accent);color:var(--on-accent);padding:0 var(--s1)}
.icons button:focus-visible{outline:var(--focus-ring)}
.stack{position:relative;max-width:880px;margin:var(--s4) auto 0;width:100%}
.ghost{position:absolute;inset:0;transform:translate(calc(var(--i) * 32px),calc(var(--i) * -32px));opacity:calc(1 - var(--i) * .3);z-index:calc(3 - var(--i))}
.win{position:relative;z-index:5}
.title{display:flex;justify-content:space-between;padding:var(--s1) var(--s2);background:var(--accent);color:var(--on-accent)}
.ghost .title{background:var(--paper);color:var(--fg)}
.shot{padding:var(--s1) var(--s1) 0}
.info{padding:var(--s3);display:flex;flex-direction:column;gap:var(--s1)}.info p{margin:0}
.links{display:flex;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s1)}
@media(max-width:700px){main :global(.desk){grid-template-columns:minmax(0,1fr)}.icons{flex-direction:row;justify-content:space-between}.ghost{display:none}.glyph{width:56px;height:56px;font-size:43px;line-height:48px}}
</style>
