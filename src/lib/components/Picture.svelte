<script lang="ts">
  // A photograph at its own resolution (decision 0054: images are not resampled to the
  // grid). The figure sets an integer height from its width, floored to the 8px unit, on
  // mount and on resize, so the layout below it stays on the grid while a lazy image loads
  // (`row` shares one height across a multi-image gallery row; see figure.ts, 0089).
  // `x2` is an optional higher-resolution file (1.75× the base, 2800px on the long side).
  import { onMount } from 'svelte';
  import { figureHeight, type RowShare } from '$lib/figure';
  let { src, x2, alt, width = 1600, height = 900, eager = false, sizes = '(min-width: 1440px) 1376px, calc(100vw - 64px)', row }: { src: string; x2?: string; alt: string; width?: number; height?: number; eager?: boolean; sizes?: string; row?: RowShare } = $props();
  let host: HTMLElement; let img: HTMLImageElement;
  // An image that loads after the page is up arrives through the dither (0101); one that
  // is already complete at mount (cached, or decoded before hydration) is simply there.
  let arrive = $state(false);
  function size() {
    if (!host.getBoundingClientRect().width) return;
    host.style.height = figureHeight(host, height / width, row) + 'px';
  }
  onMount(() => {
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    if (!img.complete) img.addEventListener('load', () => { arrive = true; }, { once: true });
    return () => ro.disconnect();
  });
</script>
<figure class="pic" bind:this={host} style:aspect-ratio={`${width} / ${height}`}>
  <img bind:this={img} class:arrive {src} srcset={x2 ? `${src} ${width}w, ${x2} ${Math.round(width * 1.75)}w` : undefined} sizes={x2 ? sizes : undefined} {alt} {width} {height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
</figure>
<style>
.pic{position:relative;margin:0;width:100%;overflow:hidden;background:var(--paper)}
img{display:block;width:100%;height:100%;object-fit:cover}
:global(.motion) img.arrive{animation:dither-in calc(3 * var(--step)) steps(3) both}
</style>
