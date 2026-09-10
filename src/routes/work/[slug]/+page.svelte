<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Clip from '$lib/components/Clip.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { rowColumns, total, type Row } from '$lib/work';
  import { STEP } from '$lib/tokens';
  import { onMount } from 'svelte';
  let { data } = $props();
  const p = $derived(data.project);
  const next = $derived(data.next);
  // The title is PARC Pixel Bold (0079) and may wrap, but a single word cannot. A hidden
  // probe at the heading's own size measures the longest word; when it would not fit,
  // the title drops one cell down the Bold ladder (110 → 82.5 → 55 → 41.25 → 27.5).
  let h1: HTMLElement; let probe: HTMLElement;
  let small = $state(false);
  const longest = $derived(p.word.split(/\s+/).sort((a, b) => b.length - a.length)[0]);
  function fit() { if (h1 && probe) small = probe.scrollWidth > h1.clientWidth; }
  onMount(() => {
    fit(); document.fonts?.ready.then(fit); document.fonts?.addEventListener('loadingdone', fit);
    const ro = new ResizeObserver(fit); ro.observe(h1);
    return () => { ro.disconnect(); document.fonts?.removeEventListener('loadingdone', fit); };
  });
</script>
<svelte:head><title>{p.title} — Timothy Ali</title><meta name="description" content={p.description} /></svelte:head>

{#snippet gallery(rows: Row[], eager: boolean)}
  {#each rows as row}
    <div class="grow" style:--cols={rowColumns(row)}>
      {#each row as m}
        {#if m.video}<Clip src={m.src} width={m.w} height={m.h} label={m.alt} />{:else}<Picture src={m.src} x2={m.x2} alt={m.alt} width={m.w} height={m.h} {eager} />{/if}
      {/each}
    </div>
  {/each}
{/snippet}

<main class="inner-page study" id="main" tabindex="-1">
  <section class="head">
    <QuietLink href="/work/" label="Work" dir="left" pad class="lbl" />
    <MetaLine project={p} />
    <h1 class="display title" class:small bind:this={h1}><span class="probe" aria-hidden="true" bind:this={probe}>{longest}</span><Decode text={p.word} step={STEP} /></h1>
    <div class="intro">
      <div class="lead-col">{#each p.lead as para}<p class="lead">{para}</p>{/each}</div>
      <dl class="meta">
        <div><dt class="lbl dim">Role</dt><dd class="body">{p.role}</dd></div>
        {#if p.timeline}<div><dt class="lbl dim">Timeline</dt><dd class="body">{p.timeline}</dd></div>{/if}
        <div><dt class="lbl dim">Tools</dt><dd class="body">{p.tools}</dd></div>
        {#if p.live}<div><dt class="lbl dim">Live</dt><dd class="body"><QuietLink href={p.live.href} label={p.live.label} /></dd></div>{/if}
      </dl>
    </div>
  </section>

  <section class="gallery hero-row">{@render gallery([p.hero], true)}</section>

  {#each p.blocks as block}
    {#if block.type === 'text'}
      <section class="text"><h2 class="display-s">{block.title}</h2><div class="paras">{#each block.paras as para}<p class="body">{para}</p>{/each}</div></section>
    {:else if block.type === 'gallery'}
      <section class="gallery">{#if block.note}<span class="lbl dim note">{block.note}</span>{/if}{@render gallery(block.rows, false)}</section>
    {:else}
      <section class="list"><h2 class="display-s">{block.title}</h2><ol>{#each block.items as item, i}<li><span class="lbl">{String(i + 1).padStart(2, '0')}</span><span class="body">{item}</span></li>{/each}</ol></section>
    {/if}
  {/each}

  <section class="next">
    <Cta variant="row" href={`/work/${next.slug}/`} class="lbl"><span>Next / [{next.n}]</span><span>{next.title} <Arrow /></span></Cta>
    <PageFoot note={`[${p.n}] / ${total}`} href="/contact/" label="Tell me what you’re building" />
  </section>
</main>
<style>
.head{display:flex;flex-direction:column;gap:var(--s2);padding-top:var(--s4)}
.title{position:relative;font-size:110px;line-height:112px;margin-top:var(--s2)}
.title .probe{position:absolute;left:0;top:0;width:0;overflow:hidden;visibility:hidden;white-space:pre;pointer-events:none}
/* the step applies to the visible text only; the probe keeps the base size, or it would measure itself small and oscillate */
.title.small :global(.decode){font-size:82.5px;line-height:88px}
.title :global(.decode){display:inline;white-space:normal} /* the title may wrap between words */
.intro{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 2 / 3),8px) 1fr;gap:var(--s4);margin-top:var(--s4);align-items:start}
.lead-col{display:flex;flex-direction:column;gap:var(--s3)}
.meta{display:flex;flex-direction:column;gap:var(--s2);margin:0;padding-top:var(--s1)}
.meta dt{margin-bottom:var(--s1)}.meta dd{margin:0}
.hero-row{padding-top:var(--s8)}
.text,.list,.gallery{padding-top:var(--s8)}
.text,.list{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 2),8px) 1fr;gap:var(--s4);align-items:start}
.paras{display:flex;flex-direction:column;gap:var(--s3)}
.gallery{display:flex;flex-direction:column;gap:var(--s2)}
.gallery .note{margin-bottom:var(--s1)}
.grow{display:grid;grid-template-columns:var(--cols);gap:var(--s2);align-items:start}
.list ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s2)}
.list li{display:grid;grid-template-columns:48px 1fr;gap:var(--s2);align-items:baseline}
.next{padding-top:var(--s8)}
@media(max-width:1100px){.title{font-size:82.5px;line-height:88px}.title.small :global(.decode){font-size:55px;line-height:56px}}
@media(max-width:900px){.title{font-size:55px;line-height:56px}.title.small :global(.decode){font-size:41.25px;line-height:48px}.intro,.text,.list{grid-template-columns:100%}}
@media(max-width:700px){.title{font-size:41.25px;line-height:48px}.title.small :global(.decode){font-size:27.5px;line-height:32px}}
@media(max-width:700px){
  .head{padding-top:var(--s3)}
  .intro{margin-top:var(--s3);gap:var(--s3)}
  .grow{grid-template-columns:100%}
  .hero-row,.text,.list,.gallery,.next{padding-top:var(--s6)}
}
</style>
