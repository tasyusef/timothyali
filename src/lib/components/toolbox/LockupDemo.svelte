<script lang="ts">
  // Lockup, the Outputs and Review steps of the app's wizard (ui-lockup outputs_step.rs,
  // review_step.rs, wizard_view.rs at 1.2.5): the step tabs over the step; the logo on its plate
  // with the padding, social and plate settings under it and the formats, treatments, sizes and
  // edges rail beside it; then the exact folder tree the export writes. The count and the tree
  // come from the app's planner (`plan.ts`), one variation, no Pantone names, so they are what
  // the app would say for this logo. Upload is the app's (a file picker), so its tab is off.
  import { SvelteSet } from 'svelte/reactivity';
  import Arrow from '$lib/components/Arrow.svelte';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
  import CheckRow from './CheckRow.svelte';
  import EdgeChoice from './EdgeChoice.svelte';
  import Icon from './Icon.svelte';
  import PlateToggle from './PlateToggle.svelte';
  import SwatchDot from './SwatchDot.svelte';
  import PlanRow from './PlanRow.svelte';
  import { allWebFormats, allPrintFormats, allSizes, exportPlanFiles, buildPlanTree, plural, type PlanVersion, type WebFormat, type PrintFormat } from './plan';

  type Step = 'outputs' | 'review';
  let step: Step = $state('outputs');
  const uid = $props.id();
  // the review screen is shorter: after Continue the page could settle with the demo's top
  // above the screen, so it scrolls back to it (0206). Continue and Back each remove the button
  // that was pressed, so focus goes on: to the review's heading, or back to Continue (PX-125).
  let reviewHead: HTMLElement | undefined = $state(), cont: HTMLElement | undefined = $state();
  function review() { step = 'review'; requestAnimationFrame(() => { reviewHead?.focus({ preventScroll: true }); const d = reviewHead?.closest('.demo') as HTMLElement | null; if (d && d.getBoundingClientRect().top < 0) d.scrollIntoView({ block: 'start' }); }); }
  function back() { step = 'outputs'; requestAnimationFrame(() => cont?.focus()); }
  // the tabs are one stop for Tab; the arrows move between the two that open (roving tabindex)
  const STEPS: readonly Step[] = ['outputs', 'review'];
  function tabKey(e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const i = STEPS.indexOf(step);
    step = e.key === 'Home' ? STEPS[0] : e.key === 'End' ? STEPS[STEPS.length - 1] : STEPS[(i + (e.key === 'ArrowRight' ? 1 : STEPS.length - 1)) % STEPS.length];
    (document.getElementById(`${uid}-tab-${step}`) as HTMLElement | null)?.focus();
  }

  let dark = $state(false);
  let webFormats = $state<Record<WebFormat, boolean>>({ JPEG: true, PNG: true, SVG: true });
  let printFormats = $state<Record<PrintFormat, boolean>>({ EPS: true, JPEG: true, PDF: true });
  let treat = $state({ Color: true, Black: true, White: true });
  let sizeOn = $state([true, true, true]);
  let hard = $state(false);
  let name = $state('Acme');
  // the stage's settings (outputs_step.rs): padding is a fraction of the long edge, 12% for the
  // square social copy (DEFAULT_SOCIAL_PADDING); the social copy is a web-only version; padding
  // vectors changes the files, not their count
  let padding = $state(0.1), socialPadding = $state(0.12); // the app opens on 0; 10% here, so the wide logo doesn't fill its plate edge to edge
  let social = $state(false), padVectors = $state(false);
  let target = $state<'primary' | 'social'>('primary');
  const palette = ['#174c43', '#ff683b'];

  const activeWeb = $derived(allWebFormats.filter((f) => webFormats[f]));
  const activePrint = $derived(allPrintFormats.filter((f) => printFormats[f]));
  // a family's row is on while any of its types is; ticking it turns them all on or off (set_web_enabled)
  const includeWeb = $derived(activeWeb.length > 0), includePrint = $derived(activePrint.length > 0);
  const setWeb = (on: boolean) => allWebFormats.forEach((f) => (webFormats[f] = on));
  const setPrint = (on: boolean) => allPrintFormats.forEach((f) => (printFormats[f] = on));
  const rasters = $derived(webFormats.PNG || webFormats.JPEG || printFormats.JPEG); // includes_rasters
  const treatments = $derived((['Color', 'Black', 'White'] as const).filter((t) => treat[t]));
  const sizes = $derived(allSizes.filter((_, i) => sizeOn[i]));
  const prefix = $derived(name.trim() === '' ? 'Logo' : name.trim().replace(/\s+/g, '_'));
  const versions = $derived<PlanVersion[]>([{ name: 'Primary', folder: '01 Primary' }, ...(social ? [{ name: 'PFP-Primary', folder: '02 Socials (PFP)/Primary', webOnly: true }] : [])]);
  const files = $derived(exportPlanFiles({ prefix, versions, includeWeb, includePrint, webFormats: activeWeb, printFormats: activePrint, treatments, sizes }));
  const rootName = $derived(`${name.trim() === '' ? 'Logo' : name.trim()} ${includePrint ? 'Logo Library' : 'Web Logo Kit'}`);
  const root = $derived(buildPlanTree(files, rootName));
  const userExpanded = new SvelteSet<string>();
  const userCollapsed = new SvelteSet<string>();
  const family = (label: string, active: readonly string[]): string | null => (active.length === 0 ? null : active.length === 3 ? label : `${label} (${active.join(', ')})`);
  const formats = $derived([family('Web', activeWeb), family('Print', activePrint)].filter(Boolean).join(' + '));
  const outputs = $derived(`${formats} · ${treatments.join(', ')} · ${sizes.map((s) => s.name).join(', ')}`);

  // the preview (logo_view_box): the artwork's bounds, squared for the social copy, grown by the
  // padding on every side; the plate takes the box's shape. The mark and the wordmark align by
  // ink (0111): "acme." in Jacquard at 86 is all x-height letters, 34 pixels of ink sitting on
  // the baseline, and the anvil is 17 cells of 2px, so the logo's ink is 238 × 34.
  const W = 238, H = 34;
  const square = $derived(social && target === 'social');
  const pad = $derived(square ? socialPadding : padding);
  const box = $derived.by(() => {
    let x = 0, y = 0, w = W, h = H;
    if (square) { const side = Math.max(w, h); x += w / 2 - side / 2; y += h / 2 - side / 2; w = h = side; }
    const p = pad * Math.max(w, h);
    return { viewBox: `${x - p} ${y - p} ${w + 2 * p} ${h + 2 * p}`, aspect: (w + 2 * p) / (h + 2 * p) };
  });
  const setPad = (v: number) => (square ? (socialPadding = v) : (padding = v));
  // the preview shows the colour treatment while it is on, else the ink the plate calls for
  const ink = $derived(treat.Color ? (dark ? '#f2d600' : '#174c43') : dark ? '#fff' : '#111');
  const status = $derived(step === 'outputs' ? `${plural(files.length, 'file')} · Exports run in the desktop app.` : 'Exports run in the desktop app.');
</script>
<DemoReadout route={['Lockup', step === 'outputs' ? 'Outputs' : 'Review']} />
<div class="tabs lbl step-tabs" role="tablist" aria-label="Steps">
  <button type="button" role="tab" aria-selected="false" disabled title="Uploading runs in the desktop app">Upload</button>
  {#each STEPS as s (s)}
    <button type="button" role="tab" id={`${uid}-tab-${s}`} aria-selected={step === s} aria-controls={`${uid}-panel`} tabindex={step === s ? 0 : -1} onclick={() => (step = s)} onkeydown={tabKey}>{s === 'outputs' ? 'Outputs' : 'Review'}</button>
  {/each}
</div>
<div class="split" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${step}`}>
  {#if step === 'outputs'}
    <div class="stage lockup-stage">
      <div class="preview">
        <div class="mat" style:width={`min(100%, ${box.aspect >= 1.25 ? 400 : 320}px)`}><div class="artboard" class:plate-dark={dark} class:plate-light={!dark} style:--aspect={box.aspect} style:color={ink}>
          <!-- the mark is an anvil on the wordmark's own 2px pixel (0111): Acme, the anvil company -->
          <svg class="logo" viewBox={box.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Example logo: Acme"><path transform="scale(2)" shape-rendering="crispEdges" fill="currentColor" d="M9 0h23v1h-23zM5 1h27v1h-27zM2 2h30v1h-30zM0 3h32v1h-32zM0 4h32v1h-32zM3 5h29v1h-29zM8 6h23v1h-23zM11 7h18v1h-18zM12 8h14v1h-14zM12 9h14v1h-14zM12 10h14v1h-14zM10 11h18v1h-18zM8 12h22v1h-22zM5 13h26v1h-26zM5 14h26v1h-26zM5 15h26v1h-26zM5 16h26v1h-26z"/><text x="80" y="34" fill="currentColor">acme.</text></svg>
        </div></div>
      </div>
      {#if social}
        <span class="select target"><select class="field body" aria-label="Previewed variation" bind:value={target}><option value="primary">Primary</option><option value="social">Primary · Social</option></select></span>
      {/if}
      <div class="range-row pad-row">
        <label class="lbl dim" for={`${uid}-padding`}>Padding</label>
        <input id={`${uid}-padding`} type="range" min="0" max="0.25" step="0.005" value={pad} oninput={(e) => setPad(+e.currentTarget.value)} />
        <span class="lbl">{Math.round(pad * 100)}%</span>
      </div>
      <div class="stage-opts">
        <label class="check lbl inline" class:on={social}><input type="checkbox" class="sr-only" checked={social} onchange={(e) => { social = e.currentTarget.checked; target = social ? 'social' : 'primary'; }} /><span class="box" aria-hidden="true"><Icon name="check" /></span><span>Social version (square, web only)</span></label>
        <label class="check lbl inline" class:on={padVectors} title="Also apply padding to SVG, PDF, and EPS files"><input type="checkbox" class="sr-only" bind:checked={padVectors} /><span class="box" aria-hidden="true"><Icon name="check" /></span><span>Pad vectors too</span></label>
        <PlateToggle {dark} onchange={(v) => (dark = v)} />
      </div>
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Formats</span></div>
        <CheckRow name="Web" on={includeWeb} onchange={setWeb}><span>Web</span><span class="grow"></span><span class="chips" role="group" aria-label="Web file types">{#each allWebFormats as f (f)}<button type="button" class="chip" aria-pressed={webFormats[f]} onclick={() => (webFormats[f] = !webFormats[f])}>{f}</button>{/each}</span></CheckRow>
        <CheckRow name="Print" on={includePrint} onchange={setPrint}><span>Print</span><span class="grow"></span><span class="chips" role="group" aria-label="Print file types">{#each allPrintFormats as f (f)}<button type="button" class="chip" aria-pressed={printFormats[f]} onclick={() => (printFormats[f] = !printFormats[f])}>{f}</button>{/each}</span></CheckRow>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Treatments</span></div>
        <CheckRow name="Color" on={treat.Color} onchange={(v) => (treat.Color = v)}><span>Color</span><span class="swatches">{#each palette as hex (hex)}<SwatchDot {hex} size={12} />{/each}</span></CheckRow>
        <CheckRow name="Black" on={treat.Black} onchange={(v) => (treat.Black = v)}><span>Black</span><SwatchDot hex="#000000" size={12} /></CheckRow>
        <CheckRow name="White" on={treat.White} onchange={(v) => (treat.White = v)}><span>White</span><SwatchDot hex="#ffffff" size={12} /></CheckRow>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Sizes</span></div>
        {#each allSizes as size, i (size.name)}<CheckRow name={size.name} on={sizeOn[i]} onchange={(v) => (sizeOn[i] = v)}><span>{size.name}</span><span class="grow"></span><span class="dim">{size.longEdgePx} px</span></CheckRow>{/each}
      </section>
      {#if rasters}<EdgeChoice {hard} onchange={(v) => (hard = v)} note="Applies to PNG and JPEG. SVG, PDF and EPS are unchanged." />{/if}
    </div>
  {:else}
    <div class="stage">
      <div class="rail-head lbl"><span class="dim">Package</span><span>{root.fileCount}</span></div>
      <h4 class="display-s review-title" tabindex="-1" bind:this={reviewHead}>{root.name}</h4>
      <div class="tree">{#each root.children as child (child.id)}<PlanRow node={child} depth={0} {userExpanded} {userCollapsed} {palette} />{/each}</div>
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Summary</span></div>
        <input class="field-plain body" placeholder="Name" aria-label="Package name" bind:value={name} maxlength="24" />
        <p class="lbl note dim summary-first">1 variation · {plural(files.length, 'file')}</p>
        <p class="lbl note dim">{outputs}</p>
      </section>
      <DestinationRow />
    </div>
  {/if}
</div>
<DemoToolbar {status} backDisabled={step === 'outputs'} onback={back}>
  {#snippet act()}{#if step === 'outputs'}<button type="button" class="demo-act lbl" bind:this={cont} onclick={review}>Continue<Arrow /></button>{:else}<button type="button" class="demo-act lbl" disabled>Export…<Arrow /></button>{/if}{/snippet}
</DemoToolbar>
<style>
/* the stage (outputs_step.rs): the plate centred in what's left, then its settings, centred */
.lockup-stage{align-items:center}
.preview{flex:1;display:flex;align-items:center;justify-content:center;width:100%}
/* the plate's height is its logo's, rounded to the 8px unit, so what follows stays on whole pixels;
   the logo keeps its shape inside (meet) */
.mat{display:flex;container-type:inline-size}.artboard{width:100%;height:max(var(--s1),round(nearest,calc(100cqw / var(--aspect)),var(--s1)))}
.logo{display:block;width:100%;height:100%;overflow:visible}
.logo text{font-family:var(--face-blackletter);font-size:86px}
.target{width:100%;max-width:400px}
.pad-row{width:100%;max-width:400px}
.stage-opts{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:var(--s1) var(--s3);width:100%}
.summary-first{padding-top:var(--s1)}
h4{margin:0 0 var(--s2);font-size:27.5px;line-height:32px;overflow-wrap:anywhere} /* the app's two-line title, at the stage's size */
</style>
