<script lang="ts">
  // 1200×630 share images. The chrome above is the real header and status strip
  // (the layout reflects `chromePath`); the 534px below is one Band per page,
  // composed from the same blocks the pages use, at the desktop cell sizes.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import { projects, last } from '$lib/work';
  import { STEP, STEP_SLOW } from '$lib/tokens';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  let { data } = $props();
  // Story field: /og/story?mode=bands&seed=7&density=.7&flip=1 are the defaults (bands, mirrored so the
  // heavy side is on the right, opposite the words); any of them can be overridden for review.
  const q = $derived(page.url.searchParams);
  const storyMode = $derived((q.get('mode') ?? 'bands') as 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands');
  const storySeed = $derived(Number(q.get('seed') ?? 7));
  const storyFlip = $derived((q.get('flip') ?? '1') !== '0');
  const storyDensity = $derived(Number(q.get('density') ?? 0.7));
  // Same rule as the study page: a title may wrap, a word may not. When the longest
  // word will not fit the column at 55px, the title drops one cell to 41.25/48.
  let h1: HTMLElement | undefined = $state(); let probe: HTMLElement | undefined = $state();
  let small = $state(false);
  const longest = $derived(data.project?.title.split(/\s+/).sort((a, b) => b.length - a.length)[0] ?? '');
  // The study row is centred in the 534px frame by hand: (frame − row) / 2 rounded down to
  // the unit, so the row's top stays on the 8px grid whatever the cover's height.
  let row: HTMLElement | undefined = $state(); let rowTop = $state(0);
  function fit() {
    if (h1 && probe) small = probe.scrollWidth > h1.clientWidth;
    if (row) { const r = [...row.children].map((k) => k.getBoundingClientRect()); const h = Math.max(...r.map((b) => b.bottom)) - Math.min(...r.map((b) => b.top)); rowTop = Math.floor((row.clientHeight - h) / 2 / 8) * 8; }
  }
  onMount(() => { fit(); document.fonts?.ready.then(fit); });
</script>
<svelte:head><title>og/{data.id}</title><meta name="robots" content="noindex" /></svelte:head>
<main class="og" class:story={data.id === 'story'} class:wide={data.id === 'wide'} id="main" tabindex="-1">
  {#if data.id === 'home'}
    <Band class="og-home" mode="sky" seed={3} density={0.9} avoid=".og-line, .og-name">
      <p class="display og-line">Designer for teams<br />that don’t have one yet.</p>
      <h1 class="blackletter og-name"><Decode text="i’m tim." /><Cursor size="em" /></h1>
    </Band>
  {:else if data.id === 'story' || data.id === 'wide'}
    <!-- /og/wide is the same composition at 1920×1080 for Twitter/X: same field, same
         type, the name held to the foot of the frame with more air to its right. -->
    <!-- Instagram story, 1080×1920, viewed at about a third of that: the small roles step
         up their own ladder (label 12.5 → 25, arrow 16 → 24) and everything sits inside the
         story safe zone (y 270–1540). The generator hides the chrome for this one. -->
    <Band class="og-story" mode={storyMode} seed={storySeed} density={storyDensity} flip={storyFlip}>
      <h1 class="blackletter story-name"><Decode text="i’m tim." mode="type" step={STEP_SLOW} delay={500} cursor /></h1>
      <Cta href="https://www.timothyali.com" class="lbl story-cta">timothyali.com <Arrow /></Cta>
    </Band>
  {:else if data.id === 'work'}
    <Band class="og-work" mode="fall" seed={5} density={0.7} avoid=".og-head > *, .og-covers">
      <div class="og-head">
        <h1 class="blackletter display-xl">work.</h1>
        <IndexRow label="Project index" value={`01–${last}`} layout="column" accent />
      </div>
      <div class="og-covers">
        {#each projects as p}<div class="card og-card"><Picture src={p.cover.src} alt="" width={p.cover.w} height={p.cover.h} eager /><span class="lbl">{p.title}</span></div>{/each}
      </div>
    </Band>
  {:else if data.id === 'contact'}
    <Band class="og-contact" mode="fall" seed={3} density={0.55} avoid=".og-top > span, .og-contact h1 > span">
      <div class="og-top lbl"><span>Let’s talk</span><span>Timothy Ali / Denver, CO</span></div>
      <h1><span class="display">Tell me what<br />you’re</span><span class="blackletter display-xl">building.</span></h1>
    </Band>
  {:else if data.project}
    {@const p = data.project}
    <Band class="og-study" mode="fall" seed={5} density={0.7} avoid=".og-row > *">
      <div class="row og-row" bind:this={row} style:padding-top="{rowTop}px">
        <div class="frame"><Picture src={p.cover.src} alt="" width={p.cover.w} height={p.cover.h} eager /></div>
        <div class="row-body">
          <MetaLine project={p} />
          <h1 class="display" class:small bind:this={h1}><span class="probe" aria-hidden="true" bind:this={probe}>{longest}</span>{p.title}</h1>
          <p class="body">{p.description}</p>
          <Cta variant="quiet" class="lbl">View case study <Arrow /></Cta>
        </div>
      </div>
    </Band>
  {/if}
</main>
<style>
/* the frame: 1200 − 96 of chrome = 534, with the page gutters */
/* 534 = 630 − 96 of chrome: the one height here off the unit, forced by the 1200×630 spec.
   Nothing is anchored to its bottom edge: the name is placed from the top and the study
   row's centring is rounded to the unit in `fit()` (0089). */
.og{height:534px;overflow:hidden}
.og :global(.band){position:relative;isolation:isolate;overflow:hidden;height:534px;padding:var(--s4) var(--gutter)}

/* Story — full frame, no chrome (the generator hides it), content in the safe zone */
.og.story{height:1920px}
/* 50 units under the text clears Instagram's reply bar; the wide frame has no overlay and
   keeps 20. The name's line box is 280 so its em box (344) overhangs by whole cells (32). */
.og.story :global(.band){height:1920px;padding:0 var(--gutter) calc(50 * var(--u));display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:var(--s6)}
.story-name{font-size:344px;line-height:280px}
.og :global(.story-cta){font-size:25px;line-height:32px}
.og :global(.story-cta .mono){font-size:24px;line-height:32px}

/* Wide — the story turned on its side for Twitter/X, 1920×1080, same roles, same seed */
.og.wide{height:1080px}
.og.wide :global(.band){height:1080px;padding:0 var(--gutter) calc(20 * var(--u));display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:var(--s6)}

/* Home — the hero at share size: the sentence up top, the name at the foot */
.og-line{font-size:41.25px;line-height:48px}
.og-name{position:absolute;left:var(--gutter);top:calc(20 * var(--u));font-size:344px;line-height:344px;white-space:nowrap}

/* Work — the page head, then the selected four as cards */
.og-head{display:flex;justify-content:space-between;align-items:flex-start}
.og-covers{display:grid;grid-template-columns:repeat(4,calc((100% - 3 * var(--s2)) / 4));gap:var(--s2);margin-top:var(--s2)}
.og-card{gap:var(--s1)}
.og-card .lbl{display:block;background:var(--paper);margin:0 calc(-1 * var(--s1)) calc(-1 * var(--s1));padding:var(--s1)}

/* Contact — the page's own head */
.og-top{display:flex;justify-content:space-between;margin-bottom:var(--s3)}
.og-top>span{background:var(--paper);padding:var(--s1)}
.og-top>span:first-child{background:var(--accent);color:var(--on-accent)}
.og :global(.og-contact h1){display:flex;flex-direction:column;gap:var(--s2)}
.og :global(.og-contact .display){line-height:64px}

/* Study — the Work row, centred in the frame */
.og-row{height:100%;align-content:start}
.og-row .frame{background:var(--surface-card)}
.og-row h1{position:relative}
.og-row h1.small{font-size:41.25px;line-height:48px}
.og-row .probe{position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none}
</style>
