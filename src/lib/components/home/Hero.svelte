<script lang="ts">
  // The hero is the terminal (0128): with motion on, the name slot types “hi.” then “i’m tim.”,
  // the line under it types the copy one line at a time behind the cell cursor, holds, clears
  // and loops while the hero is on screen. Motion off, no JavaScript and the prerender show the
  // name and the copy in full. It scrolls with the page (PX-61): the pinned stage and its
  // dissolve (PX-54) are gone. It has no field of its own: Home's one rain runs behind the
  // whole page (PX-63), starting under the chrome.
  import { onMount } from 'svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { RESUME_URL } from '$lib/site';
  import { STEP_SLOW, STEP } from '$lib/tokens';
  import { motion } from '$lib/motion.svelte';

  const LINES = ['Product designer.', 'Interface design, design systems, and front-end development.', 'Denver / remote. Open to full-time and contract.'];
  const STATIC_LINE = LINES.join(' ');
  const HOLD = { hi: 900, name: 700, line: 1600, last: 2600, clear: 600 };
  const erased = (t: string) => [...t].length * STEP_SLOW;
  let slotName = $state('hi.');
  let slotLine = $state('');
  let inView = $state(true);
  // The prerender shows the name and the copy; with motion on the loop takes over after one
  // hold, so the page does not blank and retype what it already showed as JavaScript arrives (0206).
  let started = $state(false);
  let sec: HTMLElement;
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const typed = (t: string, step: number, delay = 0) => delay + [...t].length * step + 120;

  onMount(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { inView = e.isIntersecting; }), { threshold: 0.2 });
    io.observe(sec);
    return () => io.disconnect();
  });
  $effect(() => {
    if (!motion.on) return;
    let stopped = false;
    (async () => {
      if (!started) { await sleep(HOLD.last); while (!inView && !stopped) await sleep(300); if (stopped) return; started = true; }
      while (!stopped) {
        while (!inView && !stopped) await sleep(300);
        slotName = 'hi.'; slotLine = '';
        await sleep(typed('hi.', STEP_SLOW, 200) + HOLD.hi); if (stopped) break;
        slotName = 'i’m tim.';
        await sleep(erased('hi.') + typed('i’m tim.', STEP_SLOW, 200) + HOLD.name); if (stopped) break;
        for (const l of LINES) { slotLine = l; await sleep(typed(l, STEP) + (l === LINES[LINES.length - 1] ? HOLD.last : HOLD.line)); if (stopped) break; }
        if (stopped) break;
        slotLine = ''; slotName = '';
        await sleep(erased('i’m tim.') + HOLD.clear);
      }
    })();
    return () => { stopped = true; slotName = 'hi.'; slotLine = ''; };
  });
</script>

<section class="hero-sec" bind:this={sec} aria-labelledby="intro">
  <div class="hero">
    {#if motion.on && started}
      <h1 id="intro" class="blackletter hero-name" data-ink="i’m tim."><span class="sr-only">i’m tim. Timothy Ali</span><span aria-hidden="true"><Decode text={slotName} mode="type" step={STEP_SLOW} delay={200} cursor={!slotLine} erase /></span></h1>
      <p class="sr-only">{STATIC_LINE}</p>
      <p class="hero-role body" aria-hidden="true">{#each LINES as l}<span class="sizer">{l}</span>{/each}<Decode text={slotLine} mode="type" step={STEP} cursor={!!slotLine} cursorSize="cell" /></p>
    {:else}
      <!-- the heading carries the full name for screen readers and search (0207, Timothy’s pick); the page shows “i’m tim.” -->
      <h1 id="intro" class="blackletter hero-name" data-ink="i’m tim."><span>i’m tim.</span><span class="sr-only"> Timothy Ali</span></h1>
      <p class="hero-role body">{STATIC_LINE}</p>
    {/if}
    <!-- PARC Pixel has no É, so the résumé label reads “Resume” -->
    <div class="hero-actions"><Cta variant="hint" class="hero-hint lbl" href="#work">Selected work<svg class="arrow" width="16" height="16" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M3 0h1v1h-1zM3 1h1v1h-1zM3 2h1v1h-1zM3 3h1v1h-1zM3 4h1v1h-1zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1zM0 4h1v1h-1zM1 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 5h1v1h-1zM6 4h1v1h-1z"/></svg></Cta><QuietLink href={RESUME_URL} label="Resume" class="lbl" /></div>
  </div>
</section>

<style>
/* The page's field starts under the chrome (+page.svelte), so the rain runs up behind the
   header; the hero is the first window, its name and copy at the bottom. */
.hero-sec{--chrome:96px;padding:0}
.hero-sec :global(.hero){position:relative;min-height:round(down,100vh,8px);min-height:round(down,100svh,8px);display:flex;flex-direction:column;justify-content:flex-end;padding:calc(var(--chrome) + var(--s8)) var(--gutter) var(--s8);overflow:hidden}
.hero-name{font-size:344px;line-height:344px}
/* The typed line: one grid cell holding every copy line, hidden, under the typed one, so the
   box is as tall as the tallest line at this width and the field's knockout measures one
   stable box, not the changing words (0132). */
.hero-role{display:grid;max-width:46ch;min-height:64px;margin-top:var(--s2);text-wrap:pretty}
.hero-role>:global(*){grid-area:1/1}
.sizer{visibility:hidden}
.hero-role :global(.decode){white-space:pre-wrap}
/* The actions, the work chip and the résumé link (0127): bottom right on desktop with the chip
   outermost; on phones a row under the copy. */
.hero-actions{position:absolute;right:var(--gutter);bottom:var(--s8);display:flex;flex-direction:row-reverse;align-items:center;gap:var(--s3)}
.hero-sec :global(.hero-hint:focus-visible){background:var(--fg);color:var(--paper)}@media(hover:hover){.hero-sec :global(.hero-hint:hover){background:var(--fg);color:var(--paper)}}
:global(.hero-hint) .arrow{display:block;transform:translateY(0);position:relative;top:-1px}
:global(.motion .hero-hint) .arrow{animation:nudge var(--tick-cursor) steps(2,jump-none) infinite}
@keyframes nudge{from{transform:translateY(0)}to{transform:translateY(2px)}}
@media(max-width:1100px){.hero-name{font-size:258px;line-height:264px}}
/* below 900 the copy reaches the actions' column, so they join the flow under it (0202) */
@media(max-width:900px){.hero-actions{position:static;flex-direction:row;flex-wrap:wrap;margin-top:var(--s2);align-self:flex-start}.hero-sec :global(.hero-hint){white-space:nowrap}}
@media(max-width:700px){
  .hero-sec{--chrome:104px}
  .hero-sec :global(.hero){padding-bottom:var(--s6)}
  .hero-name{font-size:129px;line-height:136px}
  .hero-role{max-width:none}
}
/* the typed name cannot wrap: at 129px “i’m tim.” is 321px, wider than the column under 353px (0206) */
@media(max-width:352px){.hero-name{font-size:86px;line-height:88px}}
</style>
