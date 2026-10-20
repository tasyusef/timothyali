<script lang="ts">
  // The app's bottom bar (0210; written four times): Back, the middle (a count or the steps),
  // and the tool's action, disabled because exporting happens in the app unless `act` is given.
  import type { Snippet } from 'svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  let { label = 'Export', backDisabled = true, onback, act, children }:
    { label?: string; backDisabled?: boolean; onback?: () => void; act?: Snippet; children: Snippet } = $props();
</script>
<div class="toolbar lbl">
  <button type="button" class="btn lbl" disabled={backDisabled} onclick={onback}><Arrow dir="left" />Back</button>
  {@render children()}
  {#if act}{@render act()}{:else}<button type="button" class="demo-act lbl" disabled title="Export happens in the app">{label}<Arrow /></button>{/if}
</div>
