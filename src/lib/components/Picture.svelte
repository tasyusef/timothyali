<script lang="ts">
  // A photograph at its own resolution (decision 0054: images are not resampled to the
  // grid). The figure sets an integer height from its width, floored to the 8px unit, on
  // mount and on resize, so the layout below it stays on the grid while a lazy image loads
  // (`row` shares one height across a multi-image gallery row; see figure.ts, 0089).
  // `x2` is an optional higher-resolution file (1.75× the base, 2800px on the long side).
  // `phone` is a tighter crop of the same screen for phones (PX-53): a `<picture>` source at
  // ≤700px, so a phone downloads only its crop and the figure takes that crop's aspect.
  import { onMount } from 'svelte';
  import { figureHeight, type RowShare } from '$lib/figure';
  let { src, x2, alt, width = 1600, height = 900, eager = false, sizes = '(min-width: 1440px) 1376px, calc(100vw - 64px)', row, phone }: { src: string; x2?: string; alt: string; width?: number; height?: number; eager?: boolean; sizes?: string; row?: RowShare; phone?: { src: string; w: number; h: number } } = $props();
  const PHONE = '(max-width: 700px)';
  let host: HTMLElement; let img: HTMLImageElement;
  // An image that loads after the page is up arrives through the dither (0101); one that
  // is already complete at mount (cached, or decoded before hydration) is simply there.
  let arrive = $state(false);
  function size() {
    if (!host.getBoundingClientRect().width) return;
    const ratio = phone && matchMedia(PHONE).matches ? phone.h / phone.w : height / width;
    host.style.height = figureHeight(host, ratio, row) + 'px';
  }
  onMount(() => {
    size(); const ro = new ResizeObserver(size); ro.observe(host);
    if (!img.complete) img.addEventListener('load', () => { arrive = true; }, { once: true });
    return () => ro.disconnect();
  });
</script>
<figure class="pic" class:art={!!phone} bind:this={host} style:--ar={`${width} / ${height}`} style:--ar-phone={phone ? `${phone.w} / ${phone.h}` : undefined}>
  <picture>{#if phone}<source media={PHONE} srcset={phone.src} width={phone.w} height={phone.h} />{/if}<img bind:this={img} class:arrive {src} srcset={x2 ? `${src} ${width}w, ${x2} ${Math.round(width * 1.75)}w` : undefined} sizes={x2 ? sizes : undefined} {alt} {width} {height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></picture>
</figure>
<style>
.pic{position:relative;margin:0;width:100%;overflow:hidden;background:var(--paper);aspect-ratio:var(--ar)}
@media(max-width:700px){.pic.art{aspect-ratio:var(--ar-phone)}}
picture{display:contents}
img{display:block;width:100%;height:100%;object-fit:cover}
:global(.motion) img.arrive{animation:dither-in calc(3 * var(--step)) steps(3) both}
</style>
