<script lang="ts">
  // The hero's motion lab (PX-139): Home itself, with a panel that turns the parallax and the
  // slow pan off and on and tunes them; leaving puts the live values back. Scroll to see the parallax; motion must be on.
  import Home from '../../+page.svelte';
  import { heroLab, resetHeroLab } from '$lib/heroLab.svelte';
  import { onMount } from 'svelte';
  import { projects, card } from '$lib/work';
  // no load file: a tiny route module gets merged into a shared chunk by the build
  // (experimentalMinChunkSize) and its exports renamed, which SvelteKit refuses. Dev only
  // (svelte.config.js DEV_ONLY; hooks.server.ts answers 404 outside dev), so the catalog here costs nothing live.
  let { data } = $props();
  const home = $derived({ ...data, cards: projects.map(card) });
  onMount(() => resetHeroLab);
  const sliders = [['far', 'Far range'], ['mid', 'Massifs'], ['planet', 'Planet'], ['stars', 'Stars']] as const;
</script>
{#key heroLab.cell}<Home data={home} />{/key}
<aside class="lab">
  <div class="row"><span>Grain</span><span class="seg">{#each [0, 8, 6, 4] as c (c)}<button type="button" aria-pressed={heroLab.cell === c} onclick={() => (heroLab.cell = c)}>{c ? `${c}px` : 'Auto'}</button>{/each}</span></div>
  <label><input type="checkbox" bind:checked={heroLab.parallax} /> Parallax</label>
  {#each sliders as [k, name] (k)}
    <label class="row"><span>{name}</span><input type="range" min="0" max="1" step="0.05" bind:value={heroLab[k]} disabled={!heroLab.parallax} /><output>{heroLab[k].toFixed(2)}</output></label>
  {/each}
  <label><input type="checkbox" bind:checked={heroLab.pan} /> Pan</label>
  <label class="row"><span>Swing</span><input type="range" min="0.005" max="0.08" step="0.005" bind:value={heroLab.amount} disabled={!heroLab.pan} /><output>{heroLab.amount.toFixed(3)}</output></label>
  <div class="row"><span>Steps</span><span class="seg">{#each [['together', 'Together'], ['layer', 'Each layer'], ['smooth', 'Smooth']] as const as [v, l] (v)}<button type="button" aria-pressed={heroLab.steps === v} onclick={() => (heroLab.steps = v)} disabled={!heroLab.pan}>{l}</button>{/each}</span></div>
  <label class="row"><span>Loop (s)</span><input type="range" min="10" max="120" step="5" bind:value={heroLab.period} disabled={!heroLab.pan} /><output>{heroLab.period}</output></label>
</aside>
<style>
.lab{position:fixed;left:16px;bottom:16px;z-index:100;display:grid;gap:8px;padding:16px;background:var(--paper);color:var(--fg);font:12px/16px ui-monospace,monospace;outline:1px solid currentColor}
.seg{display:flex;gap:4px}.seg button{font:inherit;color:inherit;background:none;border:0;padding:2px 6px;outline:1px solid currentColor;cursor:pointer}.seg button[aria-pressed=true]{background:var(--fg);color:var(--paper)}
.row{display:grid;grid-template-columns:72px 120px 32px;align-items:center;gap:8px}
</style>
