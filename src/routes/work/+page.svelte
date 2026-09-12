<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import { projects, index, total, last } from '$lib/work';
  import { STEP } from '$lib/tokens';
</script>
<svelte:head><title>Selected work — Timothy Ali</title><meta name="description" content="Selected brand, product, motion, and front-end work by designer Timothy Ali." /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <section>
    <header class="work-header">
      <h1 class="page-head"><span class="blackletter display-xl"><Decode text="work." step={STEP} /></span></h1>
      <IndexRow label="Project index" value={`01–${last}`} layout="column" accent />
    </header>
    <div class="rows">
      {#each projects as p, i}
        <a id={p.slug} class="row" href={`/work/${p.slug}/`}>
          <div class="frame"><Picture src={p.cover.src} alt={p.cover.alt} eager={i < 2} /></div>
          <div class="row-body">
            <MetaLine project={p} />
            <h2 class="display">{p.title}</h2>
            <p class="body">{p.description}</p>
            <Cta variant="quiet" class="lbl">View case study <Arrow /></Cta>
          </div>
        </a>
      {/each}
    </div>
    {#if index.length}
      <div class="index">
        <IndexRow label="Index" value={`${index[0].n}–${last}`} />
        <ol class="entries">
          {#each index as e}
            <li id={e.slug}>
              <a class="entry" href={`/work/${e.slug}/`}>
                <span class="lbl dim">[{e.n}]</span>
                <span class="entry-main">
                  <span class="display-s">{e.title}</span>
                  <span class="body">{e.description}</span>
                  <Cta variant="quiet" class="lbl">View case study <Arrow /></Cta>
                </span>
                <span class="lbl dim entry-year">{e.year}</span>
                <span class="lbl entry-scope">{e.scope}</span>
              </a>
            </li>
          {/each}
        </ol>
      </div>
    {/if}
    <PageFoot note={`End of index / ${total}`} href="/contact/" label="Tell me what you’re building" />
  </section>
</main>
<style>
.work-header{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--s4);padding:var(--s2) 0 var(--s6)}
.page-head{display:flex;flex-direction:column;gap:var(--s2);min-width:0}
/* The index tier (0077): one typographic row per project, no cover, the whole row a link
   to its study. The quiet CTA is the same block as the rows above — reserved padding,
   pulled 16px left so its text aligns with the title, filling yellow on hover (0065). */
.index{padding-top:var(--s8)}
.entries{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s4)}
.entries li{scroll-margin-top:var(--s2)}
.entry{display:grid;grid-template-columns:48px minmax(0,1fr) auto auto;gap:var(--s2) var(--s4);align-items:start;color:var(--fg)}
.entry-main{display:flex;flex-direction:column;gap:var(--s1);min-width:0}
.entry-main .body{max-width:64ch}
.entry-main :global(.cta-quiet){align-self:flex-start;margin-left:calc(-1 * var(--s2))}
.entry:hover :global(.cta-quiet),.entry:focus-visible :global(.cta-quiet){background:var(--accent);color:var(--on-accent)}
.entry:hover :global(.cta-quiet .mono),.entry:focus-visible :global(.cta-quiet .mono){color:var(--on-accent)}
.entry:active :global(.cta-quiet){background:var(--accent);color:var(--on-accent)} /* press (0099) */
.entry-year,.entry-scope{padding-top:var(--s2);white-space:nowrap}
@media(max-width:900px){
  .entry{grid-template-columns:48px minmax(0,1fr)}
  .entry-year,.entry-scope{grid-column:2;padding-top:0;white-space:normal}
  .entry-year{margin-top:calc(-1 * var(--s1))}
}
@media(max-width:700px){
  .work-header{flex-direction:column;align-items:stretch;gap:var(--s2);padding:var(--s1) 0 var(--s4)}
  .index{padding-top:var(--s6)}
  .entries{gap:var(--s3)}
  .entry{grid-template-columns:100%;gap:var(--s1)}
  .entry-year,.entry-scope{grid-column:1}
}
</style>
