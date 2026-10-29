<script lang="ts">
  // One tool's screen, in miniature: the readout strip, the stage beside the rail, the
  // bottom bar. Each example is the app's own layout for that tool with its real
  // settings, and the numbers it shows (file counts, folder trees, generated text,
  // encoded sizes) come from the same rules the app runs (0095). Nothing exports.
  // Lockup shows first and comes with the page; the other three load in idle time after it, or
  // when picked, whichever is first, and the last example stays until the next one is in (0214).
  import './demo.css';
  import { onMount, type Component } from 'svelte';
  import LockupDemo from './LockupDemo.svelte';
  let { tool = 'lockup' }: { tool: string } = $props();
  const LATER: Record<string, () => Promise<{ default: Component }>> = { palette: () => import('./PaletteDemo.svelte'), specimen: () => import('./SpecimenDemo.svelte'), convert: () => import('./ConvertDemo.svelte') };
  const ready: Record<string, Component> = { lockup: LockupDemo };
  let Shown = $state<Component>(LockupDemo);
  const load = (t: string) => (ready[t] ? Promise.resolve(ready[t]) : (LATER[t]?.() ?? Promise.reject(t)).then((m) => (ready[t] = m.default)));
  $effect(() => { const t = tool; load(t).then((c) => { if (tool === t) Shown = c; }).catch(() => {}); });
  onMount(() => {
    const all = () => Object.keys(LATER).forEach((t) => load(t).catch(() => {}));
    if (typeof requestIdleCallback === 'function') { const id = requestIdleCallback(all, { timeout: 4000 }); return () => cancelIdleCallback(id); }
    const id = setTimeout(all, 2000); return () => clearTimeout(id);
  });
</script>
<!-- the bottom bar's status line says exports run in the app, on every screen (the touch-only
     note under the frame went with it, 0206) -->
<div class="demo">
  <Shown />
</div>
