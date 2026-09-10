<script lang="ts">
  // A section with a full-bleed programmatic ASCII field behind it. The field is
  // the band's own background layer, and the band is the pointer-event and
  // knockout root: `avoid` selectors are resolved inside it.
  import type { Snippet } from 'svelte';
  import Ascii from './Ascii.svelte';
  import { TICK_SLOW } from '$lib/tokens';
  let { as = 'section', class: klass = '', mode = 'noise', seed = 7, tick = TICK_SLOW, density = 1, avoid = '', children, ...rest }:
    { as?: string; class?: string; mode?: 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands'; seed?: number; tick?: number; density?: number; avoid?: string; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived(['band', klass].filter(Boolean).join(' '));
</script>
<svelte:element this={as} class={cls} {...rest}>
  <div class="band-bg"><Ascii {mode} {seed} {tick} {density} {avoid} /></div>
  {@render children()}
</svelte:element>
