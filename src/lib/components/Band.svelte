<script lang="ts">
  // A section with a full-bleed programmatic ASCII field behind it. The field is
  // the band's own background layer, and the band is the pointer-event and
  // knockout root: `avoid` selectors are resolved inside it. `pad` and `feather`
  // shape the knockout around that text, in cells; `flip` mirrors the field; `shade`
  // colours the field by weight (0091). All four are forwarded as given, so Ascii's
  // defaults are the only defaults.
  import type { Snippet } from 'svelte';
  import Ascii from './Ascii.svelte';
  import { TICK_SLOW } from '$lib/tokens';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands';
  let { as = 'section', class: klass = '', mode = 'noise', seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad, feather, flip, shade, children, ...rest }:
    { as?: string; class?: string; mode?: Mode; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; flip?: boolean; shade?: boolean; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived(['band', klass].filter(Boolean).join(' '));
</script>
<svelte:element this={as} class={cls} {...rest}>
  <div class="band-bg"><Ascii {mode} {seed} {tick} {density} {avoid} {pad} {feather} {flip} {shade} /></div>
  {@render children()}
</svelte:element>
