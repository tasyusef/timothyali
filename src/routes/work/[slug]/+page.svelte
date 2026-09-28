<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Clip from '$lib/components/Clip.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import PageFoot from '$lib/components/PageFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { rowColumns, rowTiles, total, type Row } from '$lib/work';
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

  // Layout B (PX-52, 0136): the study is a run of points. A text block opens a point and the
  // galleries after it are its screens, each gallery's note the caption under them. On desktop
  // the point's text stays in view in the left third while its screens scroll past on the right.
  type Group = { rows: Row[]; note?: string };
  type Part = { kind: 'point'; title: string; paras: string[]; groups: Group[] } | { kind: 'list'; title: string; items: string[] };
  const parts = $derived.by(() => {
    const out: Part[] = [];
    for (const b of p.blocks) {
      if (b.type === 'text') out.push({ kind: 'point', title: b.title, paras: b.paras, groups: [] });
      else if (b.type === 'list') out.push({ kind: 'list', title: b.title, items: b.items });
      else {
        const last = out[out.length - 1];
        if (last?.kind === 'point') last.groups.push({ rows: b.rows, note: b.note });
        else out.push({ kind: 'point', title: '', paras: [], groups: [{ rows: b.rows, note: b.note }] });
      }
    }
    return out;
  });
  const points = $derived(parts.filter((x) => x.kind === 'point' && x.title).length);
  const pad = (i: number) => String(i).padStart(2, '0');
  // A point's text is held in view only while it fits under the chrome; taller text scrolls
  // with the page, or its last lines would stay hidden until the point's screens ran out.
  const CHROME = 96 + 32 + 32; // header and strip, the gap above, and as much below
  function hold(node: HTMLElement) {
    const check = () => node.classList.toggle('hold', node.offsetHeight <= window.innerHeight - CHROME);
    check(); document.fonts?.ready.then(check);
    const ro = new ResizeObserver(check); ro.observe(node); window.addEventListener('resize', check);
    return { destroy: () => { ro.disconnect(); window.removeEventListener('resize', check); } };
  }
</script>
<svelte:head><title>{p.title} / Timothy Ali</title><meta name="description" content={p.description} /></svelte:head>

{#snippet gallery(rows: Row[], eager: boolean)}
  {#each rows as row}
    {@const share = { total: row.reduce((a, m) => a + m.w / m.h, 0), n: row.length }}
    <div class="grow" class:tiles={rowTiles(row)} style:--cols={rowColumns(row)}>
      {#each row as m}
        {#if m.video}<Clip src={m.src} width={m.w} height={m.h} label={m.alt} poster={m.poster} row={share} />{:else}<Picture src={m.src} x2={m.x2} alt={m.alt} width={m.w} height={m.h} {eager} row={share} />{/if}
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
      <div class="lead-col">{#each p.lead as para}<p class="read">{para}</p>{/each}</div>
      <dl class="meta">
        <div><dt class="lbl dim">Role</dt><dd class="read">{p.role}</dd></div>
        {#if p.team}<div><dt class="lbl dim">Team</dt><dd class="read">{p.team}</dd></div>{/if}
        {#if p.timeline}<div><dt class="lbl dim">Timeline</dt><dd class="read">{p.timeline}</dd></div>{/if}
        <div><dt class="lbl dim">Tools</dt><dd class="read">{p.tools}</dd></div>
        {#if p.live}<div><dt class="lbl dim">Live</dt><dd class="read"><QuietLink href={p.live.href} label={p.live.label} /></dd></div>{/if}
        {#if p.source}<div><dt class="lbl dim">Source</dt><dd class="read"><QuietLink href={p.source.href} label={p.source.label} /></dd></div>{/if}
      </dl>
    </div>
  </section>

  <section class="gallery hero-row">{@render gallery([p.hero], true)}</section>

  {#each parts as part, i}
    {#if part.kind === 'list'}
      <section class="list"><h2 class="display-s">{part.title}</h2><ol>{#each part.items as item, j}<li><span class="lbl">{pad(j + 1)}</span><span class="read">{item}</span></li>{/each}</ol></section>
    {:else}
      {@const n = parts.slice(0, i + 1).filter((x) => x.kind === 'point' && x.title).length}
      <section class="point" class:solo={!part.groups.length}>
        {#if part.title || part.paras.length}
          <div class="point-text" use:hold>
            {#if part.title}<span class="lbl dim">{pad(n)} / {pad(points)}</span><h2 class="display-s">{part.title}</h2>{/if}
            {#if part.paras.length}<div class="paras">{#each part.paras as para}<p class="read">{para}</p>{/each}</div>{/if}
          </div>
        {/if}
        {#if part.groups.length}
          <div class="point-figs">
            {#each part.groups as g}<div class="group">{@render gallery(g.rows, false)}{#if g.note}<p class="lbl dim cap">{g.note}</p>{/if}</div>{/each}
          </div>
        {/if}
      </section>
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
/* a block, so its own line height sets the lines; inline, the heading's larger strut held
   every line of a small two-line title at the base pitch (48px lines under 27.5px caps, PX-49) */
.title.small :global(.decode){display:block;font-size:82.5px;line-height:88px}
.title :global(.decode){display:inline;white-space:normal} /* the title may wrap between words */
.intro{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 2 / 3),8px) 1fr;gap:var(--s4);margin-top:var(--s4);align-items:start}
/* Reading text (0136): the lead, the meta values and every paragraph in the reading face,
   20/32; the lead and paragraphs in a 64ch column. 20/32 also keeps a link's 16px arrow,
   centred in its line, on the unit (a 24px line put it 4px off). */
.lead-col{display:flex;flex-direction:column;gap:var(--s3);max-width:64ch}
.meta{display:flex;flex-direction:column;gap:var(--s2);margin:0;padding-top:var(--s1)}
.meta dt{margin-bottom:var(--s1)}.meta dd{margin:0}
.hero-row{padding-top:var(--s8)}
.gallery{display:flex;flex-direction:column;gap:var(--s2)}
.grow{display:grid;grid-template-columns:var(--cols);gap:var(--s2);align-items:start}

/* Points (PX-52): the text in the left third, the screens in the rest. A point without
   screens is one column, its text at the reading measure. */
.point{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start;padding-top:var(--s12)}
.point.solo{grid-template-columns:100%}
.point-text{display:flex;flex-direction:column;gap:var(--s2)}
.point-text h2{margin-bottom:var(--s1)}
.paras{display:flex;flex-direction:column;gap:var(--s3);max-width:64ch}
.point-figs{display:flex;flex-direction:column;gap:var(--s6)}
.group{display:flex;flex-direction:column;gap:var(--s2)}
.cap{max-width:64ch}
.list{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start;padding-top:var(--s12)}
.list ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s3);max-width:64ch}
.list li{display:grid;grid-template-columns:48px 1fr;gap:var(--s2);align-items:start}
.list li>.lbl{padding-top:var(--s1)} /* one unit down, not baseline-aligned: that put the numeral on an odd pixel (0089) */
.next{padding-top:var(--s12)}
@media(min-width:901px){
  /* a third of the page holds about sixteen caps at 41.25, so the point heading steps down one cell */
  .point-text h2,.list h2{font-size:27.5px;line-height:32px}
  .point-text:global(.hold){position:sticky;top:calc(96px + var(--s4))}
}
@media(max-width:1100px){.title{font-size:82.5px;line-height:88px}.title.small :global(.decode){font-size:55px;line-height:56px}}
@media(max-width:900px){.title{font-size:55px;line-height:56px}.title.small :global(.decode){font-size:41.25px;line-height:48px}.intro,.point,.list{grid-template-columns:100%}}
@media(max-width:700px){.title{font-size:41.25px;line-height:48px}.title.small :global(.decode){font-size:27.5px;line-height:32px}}
@media(max-width:700px){
  .head{padding-top:var(--s3)}
  .intro{margin-top:var(--s3);gap:var(--s3)}
  .grow{grid-template-columns:100%}
  /* phone screenshots and squares two to a line, not one per screen (PX-49) */
  .grow.tiles{grid-template-columns:repeat(2,round(down,calc((100% - 16px) / 2),2px))} /* equal columns, so a line's figures floor to one height */
  .hero-row,.point,.list,.next{padding-top:var(--s6)}
}
</style>
