<script lang="ts">
  // A section with a full-bleed programmatic ASCII field behind it. The field is
  // the band's own background layer, and the band is the pointer-event and
  // knockout root: `avoid` selectors are resolved inside it. `pad` and `feather`
  // shape the knockout around that text, in cells; `flip` mirrors the field; `shade`
  // colours the field by weight (0091); `skySpan`/`skyRepeat` shape a page-tall sky (PX-63).
  // Everything is forwarded as given, so Ascii's defaults are the defaults, with one set of
  // exceptions: a scene (0171) is drawn in 8px cells of 1px glyph pixels, its knockouts hug the
  // ink, and they start at the text's edge, as every scene band asked for (0207).
  import type { Snippet } from 'svelte';
  import Ascii from './Ascii.svelte';
  import type { Palette, Shot } from '$lib/scene';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands' | 'scene';
  let { as = 'section', class: klass = '', mode, seed, tick, density, avoid, pad, feather, flip, shade, skySpan, skyRepeat, palette, cell, px, lightAs, mountains, shot, hug, depth, clear, clearFeather, sceneSpan, study, children, ...rest }:
    { as?: string; class?: string; mode?: Mode; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; cell?: number; px?: number; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; clearFeather?: number; sceneSpan?: 'screen' | 'box'; study?: string; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived(['band', klass].filter(Boolean).join(' '));
  const scene = $derived(mode === 'scene');
</script>
<svelte:element this={as} class={cls} {...rest}>
  <div class="band-bg"><Ascii {mode} {seed} {tick} {density} {avoid} pad={pad ?? (scene ? 0 : undefined)} {feather} {flip} {shade} {skySpan} {skyRepeat} {palette} cell={cell ?? (scene ? 8 : undefined)} px={px ?? (scene ? 1 : undefined)} {lightAs} {mountains} {shot} hug={hug ?? (scene ? true : undefined)} {depth} {clear} {clearFeather} {sceneSpan} {study} /></div>
  {@render children()}
</svelte:element>
