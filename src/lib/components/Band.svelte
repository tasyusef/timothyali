<script lang="ts">
  // A section with a full-bleed programmatic ASCII field behind it. The field is
  // the band's own background layer, and the band is the pointer-event and
  // knockout root: `avoid` selectors are resolved inside it. `pad` and `feather`
  // shape the knockout around that text, in cells; `flip` mirrors the field; `shade`
  // colours the field by weight (0091); `skySpan`/`skyRepeat` shape a page-tall sky (PX-63).
  // Everything is forwarded as given, so Ascii's defaults are the defaults, with one set of
  // exceptions: a scene (0171) is drawn in cells of 1px glyph pixels, 6px in dark and 4px in light (0243; 8px before), its knockouts hug the
  // ink, and they start at the text's edge, as every scene band asked for (0207); and it is
  // dithered in light mode, with the pages' knockout (0190, 0191): big type thins the field in a
  // wide fade (96px, depth 0.85), cleared small type fades over 24px (0210; 12 and 3 of the old 8px cells).
  import type { Snippet } from 'svelte';
  import Ascii from './Ascii.svelte';
  import type { Palette, Shot, Depth, Pan } from '$lib/scene';
  import { sceneGrain } from '$lib/tokens';
  import { theme } from '$lib/motion.svelte';
  type Mode = 'noise' | 'fall' | 'scan' | 'sparse' | 'sky' | 'bands' | 'scene';
  let { as = 'section', class: klass = '', mode, seed, tick, density, avoid, pad, feather, flip, shade, skySpan, skyRepeat, palette, cell, px, lightAs, mountains, shot, hug, depth, clear, clearFeather, sceneSpan, study, interactive, reach, parallax, pan, soft, softDepth, children, ...rest }:
    { as?: string; class?: string; mode?: Mode; seed?: number; tick?: number; density?: number; avoid?: string; pad?: number; feather?: number; flip?: boolean; shade?: boolean; skySpan?: 'box' | 'screen'; skyRepeat?: boolean; palette?: Palette; cell?: number; px?: number; lightAs?: 'same' | 'dither'; mountains?: '' | 'a' | 'b'; shot?: Shot; hug?: boolean; depth?: number; clear?: string; clearFeather?: number; sceneSpan?: 'screen' | 'box'; study?: string; interactive?: boolean; reach?: number; parallax?: Depth | null; pan?: Pan | null; soft?: string; softDepth?: number; children?: Snippet; [key: string]: unknown } = $props();
  const cls = $derived(['band', klass].filter(Boolean).join(' '));
  const scene = $derived(mode === 'scene');
  const c = $derived(cell ?? (scene ? sceneGrain(theme.light) : undefined));
</script>
<svelte:element this={as} class={cls} {...rest}>
  <div class="band-bg"><Ascii {mode} {seed} {tick} {density} {avoid} pad={pad ?? (scene ? 0 : undefined)} feather={feather ?? (scene && c ? 96 / c : undefined)} {flip} {shade} {skySpan} {skyRepeat} {palette} cell={c} px={px ?? (scene ? 1 : undefined)} lightAs={lightAs ?? (scene ? 'dither' : undefined)} {mountains} {shot} hug={hug ?? (scene ? true : undefined)} depth={depth ?? (scene ? 0.85 : undefined)} {clear} clearFeather={clearFeather ?? (scene && c ? 24 / c : undefined)} {sceneSpan} {study} {interactive} {reach} {parallax} {pan} {soft} {softDepth} /></div>
  {@render children?.()}
</svelte:element>
