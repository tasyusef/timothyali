<script lang="ts">
  // One tool, in miniature: what the app makes, as a diagram (PX-131). What goes in on the left,
  // what Toolbox wrote for it on the right, every count, colour, size and picture from a real run
  // of the app (tools/toolbox/samples.mjs), and the files themselves to download. The four are
  // small, so they all come with the page and a pick swaps them at once.
  import './demo.css';
  import type { Component } from 'svelte';
  import LockupFlow from './LockupFlow.svelte';
  import PaletteFlow from './PaletteFlow.svelte';
  import SpecimenFlow from './SpecimenFlow.svelte';
  import ConvertFlow from './ConvertFlow.svelte';
  let { tool = 'lockup' }: { tool: string } = $props();
  const FLOWS: Record<string, Component> = { lockup: LockupFlow, palette: PaletteFlow, specimen: SpecimenFlow, convert: ConvertFlow };
  const Shown = $derived(FLOWS[tool] ?? LockupFlow);
</script>
<div class="demo">
  <Shown />
</div>
