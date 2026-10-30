<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Clip from '$lib/components/Clip.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import NextFoot from '$lib/components/NextFoot.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import Band from '$lib/components/Band.svelte';
  import { rowColumns, rowTiles } from '$lib/rows';
  import type { Row } from '$lib/work';
  import { STEP, TICK_FAST, U } from '$lib/tokens';
  import { fitWord } from '$lib/fit';
  import { FRAME } from '$lib/figure';
  import { pad } from '$lib/format';
  import { hasStudyScene } from '$lib/studyScenes';
  let { data } = $props();
  const p = $derived(data.project);
  const next = $derived(data.next);
  // The title may wrap but a word may not (fitWord, 0079): a word wider than the page steps it a rung down.

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
  // What a screen's slot measures (for srcset): the right two thirds of the frame above 900px,
  // shared by the row; the full frame below, where a row of same-shape portraits is two to a line.
  // what each figure is told it will be, so the browser picks a file that fills it: on phones a
  // row stacks one figure per line unless it tiles two to a line (it said half width for any row
  // of two or more, and 66 stacked screens loaded at about 0.6× (0206))
  // (no clause for wide screens: the page has no maximum width; 0210)
  const phoneSize = (tiles: boolean) => (tiles ? `calc((${FRAME.phone} - 16px) / 2)` : FRAME.phone);
  // A figure's share of its row is its aspect over the row's (0214): PARC's pair is a quarter and three
  // quarters of the line, and the even split asked for files half the size of the wide one.
  const gallerySizes = (share: number, tiles: boolean) => `(min-width: 901px) calc((${FRAME.desk} - 32px) * 2 / 3 * ${share}), (min-width: 701px) calc(${FRAME.desk} * ${share}), ${phoneSize(tiles)}`;
  const heroSizes = (share: number, tiles: boolean) => `(min-width: 701px) calc(${FRAME.desk} * ${share}), ${phoneSize(tiles)}`;
  // A point's text is held in view only while it fits under the chrome; taller text scrolls
  // with the page, or its last lines would stay hidden until the point's screens ran out.
  // (the chrome is --chrome-height; the gap above it is --s4, and as much is kept below)
  function hold(node: HTMLElement) {
    const check = () => {
      const chrome = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome-height')) || 64;
      node.classList.toggle('hold', node.offsetHeight <= window.innerHeight - chrome - 2 * 4 * U);
    };
    check(); document.fonts?.ready.then(check);
    const ro = new ResizeObserver(check); ro.observe(node); window.addEventListener('resize', check);
    return { destroy: () => { ro.disconnect(); window.removeEventListener('resize', check); } };
  }
</script>

{#snippet gallery(rows: Row[], eager: boolean)}
  {#each rows as row}
    {@const share = { total: row.reduce((a, m) => a + m.w / m.h, 0), n: row.length }}
    <div class="grow" class:tiles={rowTiles(row)} class:desk={row.every((m) => m.desk)} style:--cols={rowColumns(row)}>
      {#each row as m}
        {#if m.video}<Clip src={m.src} small={m.small} tap={m.tap} width={m.w} height={m.h} label={m.alt} poster={m.poster} row={share} />{:else}<Picture class={m.desk ? 'desk' : ''} src={m.src} x2={m.x2} alt={m.alt} width={m.w} height={m.h} {eager} row={share} phone={m.phone} sizes={(eager ? heroSizes : gallerySizes)(+(m.w / m.h / share.total).toFixed(4), rowTiles(row))} />{/if}
      {/each}
    </div>
  {/each}
{/snippet}

{#snippet facts()}
  <dl class="meta">
    <div><dt class="lbl dim">Role</dt><dd class="read">{p.role}</dd></div>
    {#if p.team}<div><dt class="lbl dim">Team</dt><dd class="read">{p.team}</dd></div>{/if}
    {#if p.timeline}<div><dt class="lbl dim">Timeline</dt><dd class="read">{p.timeline}</dd></div>{/if}
    <div><dt class="lbl dim">Tools</dt><dd class="read">{p.tools}</dd></div>
    {#if p.live}<div><dt class="lbl dim">Live</dt><dd class="read"><QuietLink text="inherit" href={p.live.href} label={p.live.label} /></dd></div>{/if}
    {#if p.source}<div><dt class="lbl dim">Source</dt><dd class="read"><QuietLink text="inherit" href={p.source.href} label={p.source.label} /></dd></div>{/if}
    {#if p.watch}<div class:by-clip={p.hero.some((m) => m.video)}><dt class="lbl dim">With sound</dt><dd class="read"><QuietLink text="inherit" href={p.watch.href} label={p.watch.label} /></dd></div>{/if}
  </dl>
{/snippet}

<main class="inner-page study" id="main" tabindex="-1">
  <!-- the head is a strip of the landing's world (0178), a scene of its own for each study (0179);
       the reading below stays on the plain ground; the head is the title alone (0187) -->
  <Band class="head" mode="scene" shot="strip" sceneSpan="box" mountains={hasStudyScene(p.slug) ? '' : 'a'} study={hasStudyScene(p.slug) ? p.slug : ''} seed={Number(p.n) || 3} tick={TICK_FAST} feather={1} avoid=".head .title .decode">
    <h1 class="display-title title" use:fitWord={p.word}><Decode text={p.word} step={STEP} /></h1>
  </Band>
  <section class="head-intro">
    <div class="intro">
      <div class="lead-col">{#each p.lead as para}<p class="read">{para}</p>{/each}</div>
      {@render facts()}
    </div>
  </section>

  <section class="gallery hero-row">
    {@render gallery([p.hero], true)}
    <!-- the clip here is silent; the cut with its soundtrack is on YouTube (0139, 0216) -->
    {#if p.watch && p.hero.some((m) => m.video)}<p class="read"><QuietLink text="inherit" href={p.watch.href} label="Watch it with sound on YouTube" /></p>{/if}
  </section>
  <!-- on phones the details follow the hero (0206); a second copy here, not a CSS reorder, keeps Tab
       in the order shown (PX-128). Only one copy is ever displayed, so only one is in the tab order. -->
  <section class="phone-facts"><div class="intro">{@render facts()}</div></section>

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
            {#each part.groups as g}<div class="group">{@render gallery(g.rows, false)}{#if g.note}<p class="read-s dim cap">{g.note}</p>{/if}</div>{/each}
          </div>
        {/if}
      </section>
    {/if}
  {/each}

  <section class="next">
    <NextFoot href={`/work/${next.slug}/`} n={next.n} title={next.title} note={`[${p.n}] / ${data.total}`} back="/contact/" backLabel="Tell me what you’re building" />
  </section>
</main>
<style>
main :global(.head){display:flex;flex-direction:column;align-items:flex-start;gap:var(--s2);padding-top:var(--s4);padding-bottom:var(--s12);min-height:384px}
.title{align-self:stretch;margin-top:var(--s2)} /* full width, so the fit probe measures the real line */
/* Reading text (0136, 0237): the lead, the meta values and every paragraph in Departure Mono
   (22/32); the lead and paragraphs in a 50ch column (700px, as before 0237). A 32px line also keeps a link's 16px
   arrow, centred in its line, on the unit (a 24px line put it 4px off). */
.lead-col{display:flex;flex-direction:column;gap:var(--s3);max-width:50ch}
.hero-row{padding-top:var(--s8)}
.phone-facts{display:none}
.gallery{display:flex;flex-direction:column;gap:var(--s2)}
.grow{display:grid;grid-template-columns:var(--cols);gap:var(--s2);align-items:start}

/* Points (PX-52): the text in the left third, the screens in the rest. A point without
   screens is one column, its text at the reading measure. */
.point{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start;padding-top:var(--s12)}
.point.solo{grid-template-columns:100%}
.point-text{display:flex;flex-direction:column;gap:var(--s2)}
.point-text h2{margin-bottom:var(--s1)}
.paras{max-width:50ch}
.point-figs{display:flex;flex-direction:column;gap:var(--s6)}
.group{display:flex;flex-direction:column;gap:var(--s2)}
.cap{max-width:50ch}
.list{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start;padding-top:var(--s12)}
.list ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s3);max-width:50ch}
.list li{display:grid;grid-template-columns:48px 1fr;gap:var(--s2);align-items:start}
.list li>.lbl{padding-top:var(--s1)} /* one unit down, not baseline-aligned: that put the numeral on an odd pixel (0089) */
.next{padding-top:var(--s12)}
.meta dt{font-family:var(--face-display);font-size:13.75px;line-height:16px} /* the fact labels in PARC Pixel Bold at cell 1, on his word (0237) */
@media(min-width:901px){
  /* a third of the page holds about sixteen caps at 41.25, so the point heading steps down one cell */
  .point-text h2,.list h2{font-size:27.5px;line-height:32px}
  .point-text:global(.hold){position:sticky;top:calc(var(--chrome-height) + var(--s4))}
}
@media(max-width:900px){.point,.list{grid-template-columns:100%}}
@media(max-width:700px){
  /* on phones the head is 240px at least, its title at the foot (0185) */
  main :global(.head){padding-top:var(--s3);padding-bottom:var(--s8);min-height:240px;justify-content:flex-end}
  .grow{grid-template-columns:100%}
  /* phone screenshots and squares two to a line, not one per screen (PX-49) */
  .grow.tiles{grid-template-columns:repeat(2,round(down,calc((100% - 16px) / 2),2px))} /* equal columns, so a line's figures floor to one height */
  .hero-row,.point,.list,.next{padding-top:var(--s6)}
  /* Mobile audit (0206): the first screen shows the work. The lead, then the hero, then the
     details; before, a 280–512px details list pushed the first image below the fold. */
  main.study{display:flex;flex-direction:column}
  .head-intro,.head-intro .intro{display:contents}
  .lead-col{margin-top:var(--s3);padding:0 var(--gutter)} /* out of their section, so they take its gutter */
  .intro>:global(.meta){display:none}
  .phone-facts{display:block}
  .phone-facts .intro{margin-top:var(--s4)}
  .phone-facts .intro>:global(.meta){display:flex}
  /* a desktop screen that a phone screen of the same pages replaces, or that repeats one */
  .grow.desk,.grow :global(.pic.desk){display:none}
  /* a caption in the reading face, sentence case, above the screens it names: in pixel
     capitals under a stack of four it read as a fifth label, far from the first image */
  .cap{order:-1}
  /* the sound link sits under the clip, just above the details here; one is enough (0216) */
  .meta .by-clip{display:none}
}
</style>
