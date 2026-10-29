<script lang="ts">
  // The app's bottom bar (0210; design batch B): Back, one line on what the primary does, and
  // the primary, the only yellow. Here the primary is disabled, since exports run in the app,
  // and the line says so (it replaced the touch-only note under the frame, 0206); `act` gives
  // a step its own primary.
  import type { Snippet } from 'svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  let { status, label = 'Export…', backDisabled = true, onback, act }:
    { status: string; label?: string; backDisabled?: boolean; onback?: () => void; act?: Snippet } = $props();
</script>
<div class="toolbar">
  <button type="button" class="btn lbl back" disabled={backDisabled} onclick={onback}><Arrow dir="left" />Back</button>
  <div class="status body" role="status"><span class="msg dim">{status}</span></div>
  {#if act}{@render act()}{:else}<button type="button" class="demo-act lbl" disabled>{label}<Arrow /></button>{/if}
</div>
