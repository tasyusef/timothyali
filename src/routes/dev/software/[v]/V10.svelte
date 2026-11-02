<script lang="ts">
  // 10. Bento: one grid of unequal tiles. Toolbox the big one with its screen, Sonde wide with its
  // globe, Gryphon tall with its picks, Tome as its tabs in words; a tile for the framework to come
  // holds its place as a field with nothing but a cursor.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import { items, meta, LEAD } from './lab';
  import { TOME } from '$lib/gryphon';
  const by = (s: string) => items.find((p) => p.slug === s)!;
  const t = by('toolbox'), s = by('sonde'), g = by('gryphon'), m = by('tome');
</script>
<main id="main" tabindex="-1">
  <Band class="hero" mode="scene" shot="rise" seed={7} avoid=".hero h1 > span" clear=".hero .lead">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
    <p class="lead">{LEAD}</p>
  </Band>
  <section class="bento">
    {#each [[t, 'a'], [s, 'b'], [g, 'c']] as [p, area] (area)}
      {@const it = p as typeof t}
      <a class="tile shot-tile" style:grid-area={area as string} href={it.href}>
        {#if it.shot}<Picture src={it.shot.src} alt={it.shot.alt} width={it.shot.w} height={it.shot.h} sizes="50vw" />{/if}
        <div class="cap"><span class="display-s">{it.name}</span><span class="lbl dim">{meta(it)}</span><p class="body">{it.line}</p></div>
      </a>
    {/each}
    <a class="tile panel tome" style:grid-area="d" href={m.href}>
      <span class="display-s">{m.name}</span><span class="lbl dim">{meta(m)}</span>
      <ul class="tabs lbl">{#each TOME.tabs as tab (tab)}<li>{tab}</li>{/each}</ul>
    </a>
    <Band as="div" class="tile soon" style="grid-area:e" mode="sparse" seed={40} density={0.6} avoid=".soon .lbl"><span class="lbl">Next<Cursor size="line" /></span></Band>
  </section>
</main>
<style>
main :global(.hero){padding:var(--s8) var(--gutter);min-height:440px;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--s3)}
.bento{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-areas:"a a c c" "a a c c" "b b b d" "b b b e";gap:var(--s2);padding-top:var(--s6);padding-bottom:var(--s8)}
.tile{display:flex;flex-direction:column;min-width:0}
.shot-tile{color:inherit;background:var(--surface-card);padding:var(--s1)}
@media(hover:hover){.shot-tile:hover{background:var(--surface-card-hover)}.shot-tile:hover .display-s{color:var(--accent-text)}}
.cap{display:flex;flex-direction:column;gap:var(--s1);padding:var(--s2) var(--s1) var(--s1);background:var(--paper)}.cap p{margin:0}
.tome{padding:var(--s3);gap:var(--s1)}
.tabs{list-style:none;margin:var(--s2) 0 0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s1)}
.tabs li{padding:var(--pad-s);background:var(--paper);color:var(--fg)}.tabs li:first-child{background:var(--accent);color:var(--on-accent)}
.bento :global(.soon){min-height:160px;display:flex;align-items:flex-end;padding:var(--s3);background:var(--surface-card)}
@media(max-width:900px){.bento{grid-template-columns:1fr 1fr;grid-template-areas:"a a" "c c" "b b" "d e"}}
@media(max-width:700px){.bento{grid-template-columns:1fr;grid-template-areas:"a" "c" "b" "d" "e"}}
</style>
