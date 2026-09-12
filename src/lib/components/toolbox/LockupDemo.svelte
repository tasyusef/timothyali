<script lang="ts">
  // Lockup, steps 02 and 03 of the app's wizard: the logo on its plate with the
  // formats, treatments and sizes rail, then the exact folder tree the export writes.
  // The count and the tree come from the app's planner (`plan.ts`), one version, no
  // Pantone names, so they are what the app would say for this logo.
  import { SvelteSet } from 'svelte/reactivity';
  import Arrow from '$lib/components/Arrow.svelte';
  import AppToggle from './AppToggle.svelte';
  import PlateToggle from './PlateToggle.svelte';
  import SwatchDot from './SwatchDot.svelte';
  import PlanRow from './PlanRow.svelte';
  import { allWebFormats, allPrintFormats, allSizes, exportPlanFiles, buildPlanTree, type WebFormat, type PrintFormat } from './plan';

  let step: 'outputs' | 'review' = $state('outputs');
  let dark = $state(false);
  let includeWeb = $state(true), includePrint = $state(true);
  let webFormats = $state<Record<WebFormat, boolean>>({ JPEG: true, PNG: true, SVG: true });
  let printFormats = $state<Record<PrintFormat, boolean>>({ EPS: true, JPEG: true, PDF: true });
  let treat = $state({ Color: true, Black: true, White: true });
  let sizeOn = $state([true, true, true]);
  let name = $state('Acme');
  const palette = ['#174c43', '#ff683b'];

  const activeWeb = $derived(allWebFormats.filter((f) => webFormats[f]));
  const activePrint = $derived(allPrintFormats.filter((f) => printFormats[f]));
  const treatments = $derived((['Color', 'Black', 'White'] as const).filter((t) => treat[t]));
  const sizes = $derived(allSizes.filter((_, i) => sizeOn[i]));
  const prefix = $derived(name.trim() === '' ? 'Logo' : name.trim().replace(/\s+/g, '_'));
  const files = $derived(exportPlanFiles({ prefix, version: { name: 'Primary', folder: '01 Primary' }, includeWeb, includePrint, webFormats: activeWeb, printFormats: activePrint, treatments, sizes }));
  const rootName = $derived(`${name.trim() === '' ? 'Logo' : name.trim()} ${includePrint && activePrint.length ? 'Logo Library' : 'Web Logo Kit'}`);
  const root = $derived(buildPlanTree(files, rootName));
  const userExpanded = new SvelteSet<string>();
  const userCollapsed = new SvelteSet<string>();
  const family = (label: string, active: readonly string[]): string | null => (active.length === 0 ? null : active.length === 3 ? label : `${label} (${active.join(', ')})`);
  const formats = $derived([includeWeb ? family('Web', activeWeb) : null, includePrint ? family('Print', activePrint) : null].filter(Boolean).join(' + ') || 'Nothing');
  // the preview shows the colour treatment while it is on, else the ink the plate calls for
  const ink = $derived(treat.Color ? (dark ? '#f2d600' : '#174c43') : dark ? '#fff' : '#111');
</script>
<div class="readout lbl"><span class="path">~/Toolbox/Lockup/{step}</span><span>{files.length} files</span></div>
<div class="split">
  {#if step === 'outputs'}
    <div class="stage center">
      <div class="mat"><div class="artboard plate" class:plate-dark={dark} class:plate-light={!dark} style:color={ink}>
        <div class="logo" role="img" aria-label="Example logo: Acme"><svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M4 32V12H8V8H12V4H20V8H24V12H28V32H20V24H12V32ZM12 18H20V10H12Z"/></svg><span>acme.</span></div>
      </div></div>
      <PlateToggle {dark} onchange={(v) => (dark = v)} />
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Formats</span></div>
        <AppToggle on={includeWeb} onchange={(v) => (includeWeb = v)}><span>Web</span><span class="grow"></span><span class="chips" role="group" aria-label="Web file types">{#each allWebFormats as f (f)}<button type="button" class="chip" aria-pressed={webFormats[f]} onclick={(e) => { e.preventDefault(); webFormats[f] = !webFormats[f]; }}>{f}</button>{/each}</span></AppToggle>
        <AppToggle on={includePrint} onchange={(v) => (includePrint = v)}><span>Print</span><span class="grow"></span><span class="chips" role="group" aria-label="Print file types">{#each allPrintFormats as f (f)}<button type="button" class="chip" aria-pressed={printFormats[f]} onclick={(e) => { e.preventDefault(); printFormats[f] = !printFormats[f]; }}>{f}</button>{/each}</span></AppToggle>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Treatments</span></div>
        <AppToggle on={treat.Color} onchange={(v) => (treat.Color = v)}><span>Color</span><span style="display:inline-flex;gap:4px">{#each palette as hex (hex)}<SwatchDot {hex} size={16} />{/each}</span></AppToggle>
        <AppToggle on={treat.Black} onchange={(v) => (treat.Black = v)}><span>Black</span><SwatchDot hex="#000000" size={16} /></AppToggle>
        <AppToggle on={treat.White} onchange={(v) => (treat.White = v)}><span>White</span><SwatchDot hex="#ffffff" size={16} /></AppToggle>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Sizes</span></div>
        {#each allSizes as size, i (size.name)}<AppToggle on={sizeOn[i]} onchange={(v) => (sizeOn[i] = v)}><span>{size.name}</span><span class="grow"></span><span class="dim">{size.longEdgePx} px</span></AppToggle>{/each}
      </section>
    </div>
  {:else}
    <div class="stage">
      <div class="rail-head lbl"><span class="dim">Package</span><span>{String(root.fileCount).padStart(3, '0')}</span></div>
      <h4 class="display-s">{root.name}</h4>
      <div class="tree">{#each root.children as child (child.id)}<PlanRow node={child} depth={0} {userExpanded} {userCollapsed} {palette} />{/each}</div>
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Summary</span></div>
        <input class="field-plain body" placeholder="Name" aria-label="Package name" bind:value={name} maxlength="24" />
        <p class="lbl dim">1 variation / {files.length} {files.length === 1 ? 'file' : 'files'}</p>
        <p class="lbl dim">{formats} / {treatments.join(', ') || 'no treatment'} / {sizes.map((s) => s.name).join(', ') || 'no size'}</p>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Destination</span></div>
        <button type="button" class="btn body" style="width:100%;justify-content:space-between" disabled><span class="nowrap">Choose where to save…</span><Arrow /></button>
      </section>
    </div>
  {/if}
</div>
<div class="toolbar lbl">
  <button type="button" class="btn lbl" disabled={step === 'outputs'} onclick={() => (step = 'outputs')}><Arrow dir="left" />Back</button>
  <div class="steps" role="group" aria-label="Steps">
    <button type="button" disabled><b>01</b><span>Upload</span></button>
    <button type="button" aria-current={step === 'outputs' ? 'step' : undefined} onclick={() => (step = 'outputs')}><b>02</b><span>Outputs</span></button>
    <button type="button" aria-current={step === 'review' ? 'step' : undefined} onclick={() => (step = 'review')}><b>03</b><span>Review</span></button>
  </div>
  {#if step === 'outputs'}<button type="button" class="cta lbl" onclick={() => (step = 'review')}>Continue<Arrow /></button>{:else}<button type="button" class="cta lbl" disabled title="Export happens in the app">Export<Arrow /></button>{/if}
</div>
<style>
/* the logo sits 96 down in the 288 plate (centred would be 100, off the unit) */
.plate{width:288px;height:288px;display:flex;align-items:flex-start;justify-content:center;padding-top:96px}
/* the mark is 32 cells at 2px beside Jacquard at 86 (43 cells/em): 64 + 16 + 158 = 238 */
.logo{display:flex;align-items:flex-start;gap:var(--s2);width:238px}.logo svg{width:64px;height:64px;flex:none;margin-top:var(--s1)}.logo span{font:86px/88px var(--face-blackletter)}
.stage :global(.swatch-chip){width:32px;height:32px}
h4{margin:0;padding-bottom:var(--s1);font-size:27.5px;line-height:32px} /* the stage is narrower than the app's */
@media(max-width:1100px){.plate{width:240px;height:240px;padding-top:72px}}
@media(max-width:900px){.plate{width:288px;height:288px;padding-top:96px}}
@media(max-width:420px){.plate{width:240px;height:240px;padding-top:72px}}
</style>
