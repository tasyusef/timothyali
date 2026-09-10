<script lang="ts">
  // Kinetic type. `type`: characters appear one cell at a time behind a block cursor.
  // `scramble`: every character cycles through a glyph pool and settles left to right.
  // Both run once when the element enters the viewport and only while motion is on.
  // The real text is always present for assistive technology and for no-JavaScript.
  import { onMount, untrack } from 'svelte';
  import { motion } from '$lib/motion.svelte';
  import { mulberry32 } from '$lib/prng';
  import { STEP } from '$lib/tokens';
  import Cursor from './Cursor.svelte';
  const POOL = '#%@*+=-:/\\|<>01';
  let { text, mode = 'scramble' as 'type' | 'scramble', step = STEP, delay = 0, cursor = false }: { text: string; mode?: 'type' | 'scramble'; step?: number; delay?: number; cursor?: boolean } = $props();
  let el: HTMLElement;
  let shown = $state(untrack(() => text));
  let live = $state(false);
  let done = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let visible = $state(false);
  function run() {
    if (timer) clearInterval(timer);
    const rnd = mulberry32(text.length * 7919 + 13);
    const chars = [...text];
    let i = 0;
    live = true;
    const start = () => {
      timer = setInterval(() => {
        i++;
        if (mode === 'type') shown = chars.slice(0, i).join('');
        else shown = chars.map((c, k) => (k < i || c === ' ' ? c : POOL[Math.floor(rnd() * POOL.length)])).join('');
        if (i >= chars.length) { clearInterval(timer); timer = undefined; shown = text; live = false; done = true; }
      }, step);
    };
    if (mode === 'type') shown = '';
    setTimeout(start, delay);
  }
  onMount(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { visible = e.isIntersecting; }), { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  });
  $effect(() => {
    if (motion.on && visible && !done) run();
    if (!motion.on) { if (timer) clearInterval(timer); timer = undefined; shown = text; live = false; }
  });
</script>
<span class="decode" bind:this={el} class:live><span class="sr-only">{text}</span><span aria-hidden="true">{shown}</span>{#if cursor}<Cursor size="em" color="currentColor" />{/if}</span>
<style>
.decode{display:inline-block;white-space:pre}
</style>
