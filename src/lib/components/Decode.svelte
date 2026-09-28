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
  let { text, mode = 'scramble' as 'type' | 'scramble', step = STEP, delay = 0, cursor = false, cursorSize = 'em' as 'em' | 'cell', erase = false }: { text: string; mode?: 'type' | 'scramble'; step?: number; delay?: number; cursor?: boolean; cursorSize?: 'em' | 'cell'; erase?: boolean } = $props();
  let el: HTMLElement;
  let shown = $state(untrack(() => text));
  let live = $state(false);
  let done = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let pending: ReturnType<typeof setTimeout> | undefined;
  let visible = $state(false);
  // One run at a time (0128): a new run cancels the pending start and the interval of the
  // last one, and an interval only ever clears itself, so a finished run cannot cancel a
  // newer one or keep writing over it.
  function stop() { if (timer) clearInterval(timer); timer = undefined; if (pending) clearTimeout(pending); pending = undefined; }
  // `erase` (0128): when the text changes, the old one backspaces a character per step before
  // the new one types, the way a terminal line is corrected. The first reveal never erases.
  function run(fromChange = false) {
    stop();
    const rnd = mulberry32(text.length * 7919 + 13);
    const chars = [...text];
    let i = 0;
    live = true;
    const start = () => {
      pending = undefined;
      const id = setInterval(() => {
        i++;
        if (mode === 'type') shown = chars.slice(0, i).join('');
        else shown = chars.map((c, k) => (k < i || c === ' ' ? c : POOL[Math.floor(rnd() * POOL.length)])).join('');
        if (i >= chars.length) { clearInterval(id); if (timer === id) timer = undefined; shown = chars.join(''); live = false; done = true; }
      }, step);
      timer = id;
    };
    const begin = () => { if (mode === 'type') shown = ''; pending = setTimeout(start, delay); };
    if (mode === 'type' && erase && fromChange && shown.length) {
      const id = setInterval(() => {
        shown = [...shown].slice(0, -1).join('');
        if (!shown.length) { clearInterval(id); if (timer === id) timer = undefined; begin(); }
      }, step);
      timer = id;
    } else begin();
  }
  onMount(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { visible = e.isIntersecting; }), { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); stop(); };
  });
  // Tracks motion and visibility only; `run` reads the props inside untrack, or a text change
  // would start a second run here beside the one below.
  $effect(() => {
    const on = motion.on, vis = visible;
    untrack(() => {
      if (on && vis && !done) run();
      if (!on) { stop(); shown = text; live = false; }
    });
  });
  // A new text decodes again (the readout's path on a route change, a study's title on
  // Next); with motion off, or off screen, it is simply shown (0102).
  let last = untrack(() => text);
  $effect(() => {
    const t = text;
    untrack(() => { if (t === last) return; last = t; done = false; if (motion.on && visible) run(true); else shown = t; });
  });
</script>
<span class="decode" bind:this={el} class:live><span class="sr-only">{text}</span><span aria-hidden="true">{shown}</span>{#if cursor}<Cursor size={cursorSize} color={cursorSize === 'em' ? 'currentColor' : 'accent'} />{/if}</span>
<style>
.decode{display:inline-block;white-space:pre}
</style>
