<script lang="ts">
  // A section with a full-bleed programmatic ASCII field behind it. The field is
  // the band's own background layer, and the band is the pointer-event and
  // knockout root: `avoid` selectors are resolved inside it. `pad` and `feather`
  // shape the knockout around that text, in cells; `flip` mirrors the field; `shade`
  // colours the field by weight (0091); `skySpan`/`skyRepeat` shape a page-tall sky (PX-63). All of them are forwarded as given, so Ascii's
  // defaults are the only defaults.
  import type { Snippet } from 'svelte';
  import Ascii from './Ascii.svelte';
  import { TICK_SLOW } from '$lib/tokens';
  import type { Palette, Shot } from '$lib/scene';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands' | 'scene';
  let { as = 'section', class: klass = '', mode = 'noise', seed = 7, tick = TICK_SLOW, density = 1, avoid = '', pad, feather, flip, shade, skySpan, skyRepeat, palette, cell, px, lightAs, mountains, shot, hug, depth, clear, clearFeather, sceneSpan, study, children, ...rest }:
    { as?: string; class?: string; mode?: Mode; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; cell?: number; px?: number; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; clearFeather?: number; sceneSpan?: 'screen' | 'box'; study?: string; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived(['band', klass].filter(Boolean).join(' '));
</script>
<svelte:element this={as} class={cls} {...rest}>
  <div class="band-bg"><Ascii {mode} {seed} {tick} {density} {avoid} {pad} {feather} {flip} {shade} {skySpan} {skyRepeat} {palette} {cell} {px} {lightAs} {mountains} {shot} {hug} {depth} {clear} {clearFeather} {sceneSpan} {study} /></div>
  {@render children()}
</svelte:element>
