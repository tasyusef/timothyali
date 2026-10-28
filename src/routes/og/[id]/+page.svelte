<script lang="ts">
  // 1200×630 share images. The chrome above is the real header and status strip
  // (the layout reflects `chromePath`); the 534px below is one Band per page,
  // composed from the same blocks the pages use, at the desktop cell sizes.
  import BuildingHead from '$lib/components/BuildingHead.svelte';
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import { projects, index } from '$lib/work';
  import { hasStudyScene } from '$lib/studyScenes';
  import { STEP_SLOW } from '$lib/tokens';
  import { fitWord } from '$lib/fit';
  import { SITE_URL } from '$lib/site';
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
  // Same rule as the study page (fitWord): a title may wrap, a word may not.
  // The study row is centred in the 534px frame by hand: (frame − row) / 2 rounded down to
  // the unit, so the row's top stays on the 8px grid whatever the cover's height.
  let row: HTMLElement | undefined = $state(); let rowTop = $state(0);
  function fit() {
    if (row) { const r = [...row.children].map((k) => k.getBoundingClientRect()); const h = Math.max(...r.map((b) => b.bottom)) - Math.min(...r.map((b) => b.top)); rowTop = Math.floor((row.clientHeight - h) / 2 / 8) * 8; }
  }
  onMount(() => { fit(); document.fonts?.ready.then(fit); });
  $effect(() => { if (!row) return; const ro = new ResizeObserver(fit); for (const k of row.children) ro.observe(k); return () => ro.disconnect(); });
</script>
<svelte:head><title>og/{data.id}</title><meta name="robots" content="noindex" /></svelte:head>
<main class="og" class:story={data.id === 'story'} class:wide={data.id === 'wide'} class:stage={data.id === 'stage'} class:no-cursor={q.get('cursor') === 'none'} id="main" tabindex="-1">
  {#if data.id === 'stage'}
    <!-- /og/stage (PX-110): Home's sky, mountains and planet filling the window with nothing
         over them (no chrome, no name, no buttons), to click about in and record. Motion and
         theme are whatever the site last saved; ?cursor=none hides the pointer. -->
    <Band as="div" class="og-stage" mode="scene" seed={3} mountains="a" />
  {:else if data.id === 'home'}
    <Band class="og-home" mode="scene" shot="hero" sceneSpan="box" mountains="a" seed={3} feather={3} depth={0.6} avoid=".og-line, .og-name > :first-child">
      <p class="display og-line">Designer.</p>
      <h1 class="blackletter og-name"><Decode text="i’m tim." /><Cursor size="em" /></h1>
    </Band>
  {:else if data.id === 'story' || data.id === 'wide'}
    <!-- /og/wide is the same composition at 1920×1080 for Twitter/X: same field, same
         type, the name held to the foot of the frame with more air to its right. -->
    <!-- Instagram story, 1080×1920, viewed at about a third of that: the small roles step
         up their own ladder (label 12.5 → 25, arrow 16 → 24) and everything sits inside the
         story safe zone (y 270–1540). The generator hides the chrome for this one. -->
    <Band class="og-story" mode={storyMode} seed={storySeed} density={storyDensity} flip={storyFlip} shade={storyMode !== 'scan'}>
      <h1 class="blackletter story-name"><Decode text="i’m tim." mode="type" step={STEP_SLOW} delay={500} cursor /></h1>
      <Cta href={SITE_URL} class="story-cta">timothyali.com <Arrow /></Cta>
    </Band>
  {:else if data.id === 'work'}
    <!-- the Work page at share size (0198): “work.” and a card for every study, the covers on the
         card mat, no counters -->
    <Band class="og-work" mode="scene" shot="strip" sceneSpan="box" mountains="a" seed={5} feather={3} depth={0.6} avoid=".og-work h1">
      <h1 class="blackletter og-work-title">work.</h1>
      <div class="og-grid">
        {#each [...projects, ...index] as p}<div class="card og-card"><Picture src={p.cover.src} alt="" width={p.cover.w} height={p.cover.h} eager /></div>{/each}
      </div>
    </Band>
  {:else if data.id === 'contact'}
    <Band class="og-contact" mode="scene" shot="rise" sceneSpan="box" seed={3} feather={3} depth={0.6} avoid=".og-contact h1 > span">
      <BuildingHead level="h1" />
    </Band>
  {:else if data.id === 'toolbox'}
    <!-- The Toolbox hero at share size: the same field, the name, the lead, the actions. -->
    <Band class="og-toolbox" mode="bands" seed={7} density={0.7} flip shade hug pad={0} feather={12} depth={0.85} clearFeather={3} avoid=".og-toolbox h1 .decode > [aria-hidden]:not(.cursor)" clear=".og-toolbox .lead, .og-actions > *">
      <h1 class="blackletter display-xl" data-ink="toolbox."><Decode text="toolbox." /></h1>
      <p class="lead">Prepare your files<br />for handoff.</p>
      <div class="og-actions"><Cta href="/toolbox/#tools">Explore the tools <Arrow /></Cta></div>
    </Band>
  {:else if data.id === 'toolbox-agents'}
    <!-- The agents page's head, then the landing's command plate: the one line that says it. -->
    <Band class="og-agents" mode="fall" seed={3} density={0.55} shade avoid=".og-agents h1, .og-agents .lead, .og-command">
      <h1 class="display">CLI & MCP</h1>
      <p class="lead">Use Toolbox from a terminal or an AI assistant.</p>
      <div class="og-command command-plate panel"><code class="body">toolbox --mcp<Cursor size="line" /></code></div>
    </Band>
  {:else if data.tool}
    {@const t = data.tool}
    <!-- A tool page as a Work row: the app's own screen in the frame, the head beside it. -->
    <Band class="og-study og-tool" mode="fall" seed={5} density={0.7} shade avoid=".og-row > *">
      <div class="row og-row" bind:this={row} style:padding-top="{rowTop}px">
        <div class="frame"><Picture src={t.shot.src} alt="" width={t.shot.w} height={t.shot.h} eager /></div>
        <div class="row-body">
          <span class="lbl og-tool-n">[{t.n}] / {t.blurb}</span>
          <h1 class="display" use:fitWord={t.name}><span>{t.name}</span></h1>
          <p class="body">{t.summary}</p>
          <Cta variant="quiet">{t.name} guide <Arrow /></Cta>
        </div>
      </div>
    </Band>
  {:else if data.project}
    {@const p = data.project}
    <!-- The study page's head at share size (0183): its own scene across the frame, the meta
         line, the title, the one-line description. -->
    <Band class="og-sh" mode="scene" shot="strip" sceneSpan="box" mountains={hasStudyScene(p.slug) ? '' : 'a'} study={hasStudyScene(p.slug) ? p.slug : ''} seed={Number(p.n) || 3} feather={3} depth={0.6} avoid=".og-sh h1 .t" clear=".og-sh .og-meta, .og-sh .og-desc">
      <MetaLine project={p} class="og-meta" />
      <h1 class="display og-sh-title" use:fitWord={p.title}><span class="t">{p.title}</span></h1>
      <p class="body og-desc">{p.description}</p>
    </Band>
  {/if}
</main>
<style>
/* the frame: 1200 − 96 of chrome = 534, with the page gutters */
/* 534 = 630 − 96 of chrome: the one height here off the unit, forced by the 1200×630 spec.
   Nothing is anchored to its bottom edge: the name is placed from the top and the study
   row's centring is rounded to the unit in `fit()` (0089). */
.og{height:534px;overflow:hidden}
.og :global(.band){height:534px;padding:var(--s4) var(--gutter)}

/* Stage — the window, nothing else: the layout's chrome, skip link and footer are hidden */
:global(.site:has(.og.stage)) :global(:is(.nav-chrome,.global-footer,.skip-link)){display:none}
:global(html:has(.og.stage)){overflow:hidden}
.og.stage{height:100vh;height:100dvh}
.og.stage :global(.band){height:100vh;height:100dvh;padding:0} /* not 100%: main is a flex item, and a percentage of it resolves to nothing */
.og.no-cursor,.og.no-cursor :global(*){cursor:none !important}

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
.og :global(.og-work){display:grid;grid-template-columns:minmax(0,1fr) 688px;gap:var(--s4);align-items:center}
.og-work-title{font-size:172px;line-height:176px;margin:0}
.og-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--s1)}
.og-card{padding:var(--s1);gap:0}

/* Contact — the page's own head, its lead at the desktop size the 1200px frame would step down */
.og :global(.og-contact .building-lead){font-size:55px;line-height:64px}

/* Contact — the page's own head */

/* Toolbox — the landing's hero at share size: top row, the name, the lead, the actions */
.og :global(.og-toolbox){display:flex;flex-direction:column;align-items:flex-start}
.og :global(.og-toolbox .lead){font-size:27px;line-height:32px;margin-top:var(--s2)}
.og-actions{display:flex;align-items:center;gap:var(--s4);margin-top:var(--s4)}

/* Agents — the page head and the command plate */
.og :global(.og-agents){display:flex;flex-direction:column;align-items:flex-start;gap:var(--s2)}
.og :global(.og-agents .lead){margin-top:var(--s2)}
.og-command{margin-top:var(--s3);min-width:calc(48 * var(--u))}

/* Tool — the study row with the tool's own head */
.og-tool-n{color:var(--accent-text);text-wrap:balance}

/* Study — the study page's head: meta, title at the page's desktop size, description */
.og :global(.og-sh){display:flex;flex-direction:column;align-items:flex-start;gap:var(--s2);padding-top:var(--s4)}
.og-sh-title{align-self:stretch;font-size:110px;line-height:112px;margin-top:var(--s2)}
.og-sh-title:global(.small){font-size:82.5px;line-height:88px}
.og-desc{max-width:40ch}

/* Study — the Work row, centred in the frame (tool images). The Work page's rows became cards
   (0196); their rules live here now, the only place a row is drawn (0207). */
.row{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 3 / 5),8px) 1fr;gap:var(--s4);align-items:start;color:var(--fg)}
.row .frame{margin:calc(-1 * var(--s2));padding:var(--s2);min-width:0}
.row-body{display:flex;flex-direction:column;gap:var(--s2);min-width:0}
.row-body :global(.cta-quiet){display:inline-flex;align-items:center;gap:var(--s2);padding:var(--pad-m);align-self:flex-start;margin-left:calc(-1 * var(--s2))}
.row-body :global(.cta-quiet .mono){color:var(--accent-text)}
.og-row{height:100%;align-content:start}
.og-row .frame{background:var(--surface-card)}
.og-row h1:global(.small){font-size:41.25px;line-height:48px}
</style>
