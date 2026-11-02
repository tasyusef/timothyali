<script lang="ts">
  // 7. Index and screens: a field strip on top, then the list of names pinned on the left while
  // each product's screen and facts scroll by on the right; the name you're reading lights up.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, meta } from './lab';
  import { onMount } from 'svelte';
  import { TOME } from '$lib/gryphon';
  let on = $state('toolbox');
  onMount(() => {
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) on = (e.target as HTMLElement).dataset.slug!; }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll<HTMLElement>('.entry').forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
</script>
<main id="main" tabindex="-1">
  <Band class="strip" mode="scene" shot="strip" sceneSpan="box" mountains="a" seed={12} avoid=".strip h1 > span">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
  </Band>
  <section class="split">
    <ol class="index">{#each items as p (p.slug)}<li class:on={on === p.slug}><a href={`#${p.slug}`}><span class="mono">{p.n}</span><span class="display-s">{p.name}</span></a></li>{/each}</ol>
    <div class="entries">
      {#each items as p (p.slug)}
        <article class="entry" id={p.slug} data-slug={p.slug}>
          {#if p.shot}<div class="shot"><Picture src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} sizes="60vw" /></div>{:else}<div class="none panel"><ul class="tabs lbl">{#each TOME.tabs as tab (tab)}<li>{tab}</li>{/each}</ul></div>{/if}
          <div class="info"><p class="lbl dim">{meta(p)}</p><p class="body">{p.line}</p><div class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div></div>
        </article>
      {/each}
    </div>
  </section>
</main>
<style>
main :global(.strip){padding:var(--s8) var(--gutter) var(--s6)}
.split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:var(--s6);padding-top:var(--s6);padding-bottom:var(--s8)}
.index{list-style:none;margin:0;padding:0;position:sticky;top:var(--s12,96px);align-self:start;display:flex;flex-direction:column;gap:var(--s2)}
.index a{display:flex;gap:var(--s2);align-items:baseline;color:inherit;opacity:.35}
.index li.on a{opacity:1}.index li.on .display-s{background:var(--accent);color:var(--on-accent);padding:0 var(--s1)}
.entries{display:flex;flex-direction:column;gap:var(--s8)}
.entry{display:flex;flex-direction:column;gap:var(--s3);scroll-margin-top:var(--s8)}
.shot{padding:var(--s1);background:var(--surface-card)}
.none{aspect-ratio:16/10;display:grid;place-items:center;padding:var(--s6)}
.tabs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:var(--s1);max-width:480px}
.tabs li{padding:var(--pad-s);background:var(--paper);color:var(--fg)}.tabs li:first-child{background:var(--accent);color:var(--on-accent)}
.info{display:flex;flex-direction:column;gap:var(--s1)}.info p{margin:0}
.links{display:flex;gap:var(--s3);flex-wrap:wrap;margin-top:var(--s1)}
@media(max-width:900px){.split{grid-template-columns:1fr}.index{position:static;flex-direction:row;flex-wrap:wrap}.index a{opacity:1}}
</style>
