<script lang="ts">
  // A photograph at its own resolution (decision 0054: images are not resampled to the
  // grid). The figure sets an integer height from its width, snapped to 2px, on mount and
  // on resize, so the layout below it stays on the pixel grid while a lazy image loads.
  // `x2` is an optional higher-resolution file (1.75× the base, 2800px on the long side).
  import { onMount } from 'svelte';
  import { CELL_IMAGE } from '$lib/tokens';
  let { src, x2, alt, width = 1600, height = 900, eager = false, sizes = '(min-width: 1440px) 1376px, calc(100vw - 64px)' }: { src: string; x2?: string; alt: string; width?: number; height?: number; eager?: boolean; sizes?: string } = $props();
  let host: HTMLElement;
  function size() {
    const r = host.getBoundingClientRect(); if (!r.width) return;
    host.style.height = Math.floor((r.width * (height / width)) / CELL_IMAGE) * CELL_IMAGE + 'px';
  }
  onMount(() => { size(); const ro = new ResizeObserver(size); ro.observe(host); return () => ro.disconnect(); });
</script>
<figure class="pic" bind:this={host} style:aspect-ratio={`${width} / ${height}`}>
  <img {src} srcset={x2 ? `${src} ${width}w, ${x2} ${Math.round(width * 1.75)}w` : undefined} sizes={x2 ? sizes : undefined} {alt} {width} {height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
</figure>
<style>
.pic{position:relative;margin:0;width:100%;overflow:hidden;background:var(--paper)}
img{display:block;width:100%;height:100%;object-fit:cover}
</style>
