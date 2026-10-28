<script lang="ts">
  import { pad } from '$lib/format';
  import DemoReadout from './DemoReadout.svelte';
  import DemoToolbar from './DemoToolbar.svelte';
  import DestinationRow from './DestinationRow.svelte';
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
  // the review screen is shorter: after Continue the page could settle with the demo's top
  // above the screen, so it scrolls back to it (0206). Continue and Back each remove the button
  // that was pressed, so focus goes on: to the review's heading, or back to Continue (PX-125).
  let reviewHead: HTMLElement | undefined = $state(), cont: HTMLElement | undefined = $state();
  function review() { step = 'review'; requestAnimationFrame(() => { reviewHead?.focus({ preventScroll: true }); const d = reviewHead?.closest('.demo') as HTMLElement | null; if (d && d.getBoundingClientRect().top < 0) d.scrollIntoView({ block: 'start' }); }); }
  function back() { step = 'outputs'; requestAnimationFrame(() => cont?.focus()); }
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
<DemoReadout path={`Lockup/${step}`} count={`${files.length} files`} />
<div class="split">
  {#if step === 'outputs'}
    <div class="stage center">
      <div class="mat"><div class="artboard plate" class:plate-dark={dark} class:plate-light={!dark} style:color={ink}>
        <!-- the mark is an anvil on the wordmark's own 2px pixel (0111): Acme, the anvil company --><div class="logo" role="img" aria-label="Example logo: Acme"><svg viewBox="0 0 32 17" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M9 0h23v1h-23zM5 1h27v1h-27zM2 2h30v1h-30zM0 3h32v1h-32zM0 4h32v1h-32zM3 5h29v1h-29zM8 6h23v1h-23zM11 7h18v1h-18zM12 8h14v1h-14zM12 9h14v1h-14zM12 10h14v1h-14zM10 11h18v1h-18zM8 12h22v1h-22zM5 13h26v1h-26zM5 14h26v1h-26zM5 15h26v1h-26zM5 16h26v1h-26z"/></svg><span>acme.</span></div>
      </div></div>
      <PlateToggle {dark} onchange={(v) => (dark = v)} />
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Formats</span></div>
        <AppToggle name="Web" on={includeWeb} onchange={(v) => (includeWeb = v)}><span>Web</span><span class="grow"></span><span class="chips" role="group" aria-label="Web file types">{#each allWebFormats as f (f)}<button type="button" class="chip" aria-pressed={webFormats[f]} onclick={(e) => { e.preventDefault(); webFormats[f] = !webFormats[f]; }}>{f}</button>{/each}</span></AppToggle>
        <AppToggle name="Print" on={includePrint} onchange={(v) => (includePrint = v)}><span>Print</span><span class="grow"></span><span class="chips" role="group" aria-label="Print file types">{#each allPrintFormats as f (f)}<button type="button" class="chip" aria-pressed={printFormats[f]} onclick={(e) => { e.preventDefault(); printFormats[f] = !printFormats[f]; }}>{f}</button>{/each}</span></AppToggle>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Treatments</span></div>
        <AppToggle name="Color" on={treat.Color} onchange={(v) => (treat.Color = v)}><span>Color</span><span class="swatches">{#each palette as hex (hex)}<SwatchDot {hex} size={16} />{/each}</span></AppToggle>
        <AppToggle name="Black" on={treat.Black} onchange={(v) => (treat.Black = v)}><span>Black</span><SwatchDot hex="#000000" size={16} /></AppToggle>
        <AppToggle name="White" on={treat.White} onchange={(v) => (treat.White = v)}><span>White</span><SwatchDot hex="#ffffff" size={16} /></AppToggle>
      </section>
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Sizes</span></div>
        {#each allSizes as size, i (size.name)}<AppToggle name={size.name} on={sizeOn[i]} onchange={(v) => (sizeOn[i] = v)}><span>{size.name}</span><span class="grow"></span><span class="dim">{size.longEdgePx} px</span></AppToggle>{/each}
      </section>
    </div>
  {:else}
    <div class="stage">
      <div class="rail-head lbl"><span class="dim">Package</span><span>{pad(root.fileCount, 3)}</span></div>
      <h4 class="display-s" tabindex="-1" bind:this={reviewHead}>{root.name}</h4>
      <div class="tree">{#each root.children as child (child.id)}<PlanRow node={child} depth={0} {userExpanded} {userCollapsed} {palette} />{/each}</div>
    </div>
    <div class="rail">
      <section class="rail-section">
        <div class="rail-head lbl dim"><span>Summary</span></div>
        <input class="field-plain body" placeholder="Name" aria-label="Package name" bind:value={name} maxlength="24" />
        <p class="lbl dim">1 variation / {files.length} {files.length === 1 ? 'file' : 'files'}</p>
        <p class="lbl dim">{formats} / {treatments.join(', ') || 'no treatment'} / {sizes.map((s) => s.name).join(', ') || 'no size'}</p>
      </section>
      <DestinationRow />
    </div>
  {/if}
</div>
<DemoToolbar backDisabled={step === 'outputs'} onback={back}>
  <div class="steps" role="group" aria-label="Steps">
    <button type="button" disabled><b>01</b><span>Upload</span></button>
    <button type="button" aria-current={step === 'outputs' ? 'step' : undefined} onclick={() => (step = 'outputs')}><b>02</b><span>Outputs</span></button>
    <button type="button" aria-current={step === 'review' ? 'step' : undefined} onclick={() => (step = 'review')}><b>03</b><span>Review</span></button>
  </div>
  {#snippet act()}{#if step === 'outputs'}<button type="button" class="demo-act lbl" bind:this={cont} onclick={review}>Continue<Arrow /></button>{:else}<button type="button" class="demo-act lbl" disabled title="Export happens in the app">Export<Arrow /></button>{/if}{/snippet}
</DemoToolbar>
<style>
/* the logo sits 96 down in the 288 plate (centred would be 100, off the unit) */
.plate{width:288px;height:288px;display:flex;align-items:flex-start;justify-content:center;padding-top:var(--s12)}
/* the mark is 32 cells at 2px beside Jacquard at 86 (43 cells/em): 64 + 16 + 158 = 238 */
/* The mark and the wordmark align by ink, not by box (0111): "acme." in Jacquard at 86 is all
   x-height letters, ink rows 35–68 of the 88px line, so the anvil is 17 pixels tall (34px, the
   x-height), sits on the baseline and meets the x-height at the top. */
.logo{display:flex;align-items:flex-start;gap:var(--s2);width:238px}.logo svg{width:64px;height:34px;flex:none;margin-top:35px}.logo span{font:86px/88px var(--face-blackletter)}
.stage :global(.swatch-chip){width:32px;height:32px}
h4{margin:0;padding-bottom:var(--s1);font-size:27.5px;line-height:32px} /* the stage is narrower than the app's */
/* the rail beside the stage is widest from 901 to 1100, so the plate steps down there only, and on the smallest phones */
@media(min-width:901px) and (max-width:1100px){.plate{width:240px;height:240px;padding-top:72px}}
@media(max-width:420px){.plate{width:240px;height:240px;padding-top:72px}.logo{gap:var(--s1);width:auto}.logo svg{width:48px;height:26px;margin-top:39px}} /* 238px of logo touched a 240px plate (0206) */
</style>
