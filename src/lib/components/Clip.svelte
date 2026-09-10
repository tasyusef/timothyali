<script lang="ts">
  // A looping, muted video at its own resolution. It plays only while on screen with
  // motion on and pauses otherwise, so reduced motion gets a still frame. The figure
  // sets an integer height from its width, snapped to 2px, like Picture.
  import { onMount } from 'svelte';
  import { motion } from '$lib/motion.svelte';
  import { CELL_IMAGE } from '$lib/tokens';
  let { src, label, width = 16, height = 9 }: { src: string; label: string; width?: number; height?: number } = $props();
  let host: HTMLElement; let video: HTMLVideoElement;
  let visible = $state(false);
  function size() {
    const r = host.getBoundingClientRect(); if (!r.width) return;
    host.style.height = Math.floor((r.width * (height / width)) / CELL_IMAGE) * CELL_IMAGE + 'px';
  }
  $effect(() => { if (!video) return; if (motion.on && visible) video.play().catch(() => {}); else video.pause(); });
  onMount(() => {
    size();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { visible = e.isIntersecting; }), { rootMargin: '64px' });
    io.observe(host);
    const ro = new ResizeObserver(size); ro.observe(host);
    return () => { io.disconnect(); ro.disconnect(); };
  });
</script>
<figure class="pic clip" bind:this={host} style:aspect-ratio={`${width} / ${height}`}>
  <video bind:this={video} {src} muted loop playsinline preload="auto" aria-label={label}></video>
</figure>
<style>
.pic{position:relative;margin:0;width:100%;overflow:hidden;background:var(--paper)}
video{display:block;width:100%;height:100%;object-fit:cover}
</style>
