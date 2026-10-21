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
  import PixelIcon from '$lib/components/PixelIcon.svelte';
  import { RESUME_URL } from '$lib/site';
  import { STEP_SLOW, STEP } from '$lib/tokens';
  import { motion } from '$lib/motion.svelte';

  const LINES = ['Product designer.', 'I design interfaces and design systems, and build the front end.', 'Based in Denver and open to remote work, full-time or contract.'];
  const STATIC_LINE = LINES.join(' ');
  const HOLD = { hi: 900, name: 700, line: 1600, last: 2600, clear: 600 };
  const erased = (t: string) => [...t].length * STEP_SLOW;
  let slotName = $state('hi.');
  let slotLine = $state('');
  let inView = true;
  // The loop waits wherever it is while the hero is off screen or the tab is hidden, and picks up
  // from there (0214); it used to run its line out and then ask every 300 ms whether to go on.
  let waiting: (() => void)[] = [];
  const seen = () => inView && !document.hidden;
  const shown = () => new Promise<void>((r) => { if (seen()) r(); else waiting.push(r); });
  const release = () => { if (seen()) { const w = waiting; waiting = []; w.forEach((r) => r()); } };
  // The prerender shows the name and the copy; with motion on the loop takes over after one
  // hold, so the page does not blank and retype what it already showed as JavaScript arrives (0206).
  let started = $state(false);
  let sec: HTMLElement;
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const typed = (t: string, step: number, delay = 0) => delay + [...t].length * step + 120;

  // The field steps around the words before they are typed, not after (0208): the knockout is
  // measured on hidden copies of the whole name and the whole current line (`.ghost`), so the
  // plate is in place when the first letter lands and does not grow behind the cursor. Each
  // change asks the field to measure now rather than at its next tick.
  $effect(() => { void slotLine; void started; sec?.dispatchEvent(new CustomEvent('field-measure', { bubbles: true })); });
  onMount(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { inView = e.isIntersecting; release(); }), { threshold: 0.2 });
    io.observe(sec); document.addEventListener('visibilitychange', release);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', release); };
  });
  $effect(() => {
    if (!motion.on) return;
    let stopped = false;
    (async () => {
      // each change waits for the hero to be seen; one already typing finishes, under three seconds.
      // Both say whether the loop has been stopped meanwhile.
      const wait = async () => { await shown(); return stopped; };
      const hold = async (ms: number) => { await sleep(ms); return stopped; };
      if (!started) { if (await hold(HOLD.last) || await wait()) return; started = true; }
      while (true) {
        if (await wait()) break; slotName = 'hi.'; slotLine = '';
        if (await hold(typed('hi.', STEP_SLOW, 200) + HOLD.hi)) break;
        if (await wait()) break; slotName = 'i’m tim.';
        if (await hold(erased('hi.') + typed('i’m tim.', STEP_SLOW, 200) + HOLD.name)) break;
        let out = false;
        for (const l of LINES) { if ((out = await wait())) break; slotLine = l; if ((out = await hold(typed(l, STEP) + (l === LINES[LINES.length - 1] ? HOLD.last : HOLD.line)))) break; }
        if (out || await wait()) break;
        slotLine = ''; slotName = '';
        if (await hold(erased('i’m tim.') + HOLD.clear)) break;
      }
    })();
    return () => { stopped = true; const w = waiting; waiting = []; w.forEach((r) => r()); slotName = 'hi.'; slotLine = ''; };
  });
</script>

<section class="hero-sec" bind:this={sec} aria-labelledby="intro">
  <div class="hero">
    {#if motion.on && started}
      <h1 id="intro" class="blackletter hero-name" data-ink="i’m tim."><span class="sr-only">i’m tim. Timothy Ali</span><span class="slot" aria-hidden="true"><span class="ghost">i’m tim.</span><Decode text={slotName} mode="type" step={STEP_SLOW} delay={200} cursor={!slotLine} erase /></span></h1>
      <p class="sr-only">{STATIC_LINE}</p>
      <p class="hero-role body" aria-hidden="true">{#each LINES as l}<span class="sizer">{l}</span>{/each}<span class="sizer ghost">{slotLine}</span><Decode text={slotLine} mode="type" step={STEP} cursor={!!slotLine} cursorSize="cell" /></p>
    {:else}
      <!-- the heading carries the full name for screen readers and search (0207, Timothy’s pick); the page shows “i’m tim.” -->
      <h1 id="intro" class="blackletter hero-name" data-ink="i’m tim."><span>i’m tim.</span><span class="sr-only"> Timothy Ali</span></h1>
      <p class="hero-role body">{STATIC_LINE}</p>
    {/if}
    <!-- PARC Pixel has no É, so the résumé label reads “Resume” -->
    <div class="hero-actions"><Cta variant="hint" class="hero-hint" href="#work">Selected work<PixelIcon name="down" class="arrow" /></Cta><QuietLink href={RESUME_URL} label="Resume" /></div>
  </div>
</section>

<style>
/* The page's field starts under the chrome (+page.svelte), so the rain runs up behind the
   header; the hero is the first window, its name and copy at the bottom. */
.hero-sec{padding:0}
.hero-sec :global(.hero){position:relative;min-height:round(down,100vh,8px);min-height:round(down,100svh,8px);display:flex;flex-direction:column;justify-content:flex-end;padding:calc(var(--chrome-height) + var(--s8)) var(--gutter) var(--s8);overflow:hidden}
.hero-name{font-size:344px;line-height:344px}
/* The name's glyph pixels match the dither's grid (0208): light mode dithers in 4px squares, so
   the name is set where a glyph pixel is a whole number of squares or a whole fraction of one:
   344 (8px pixels) on desktop, 172 (4px) on tablets, 86 (2px) on phones. 129 and 258 (3px, 6px)
   could never line up. Jacquard's baseline sits 34/43 of the size below the top of its em, so
   with the line height equal to the size it lands on the 4px grid (272, 136, 68); the padding
   makes up the box to the next 8px unit. */
/* The typed line: one grid cell holding every copy line, hidden, under the typed one, so the
   box is as tall as the tallest line at this width and the field's knockout measures one
   stable box, not the changing words (0132). */
.hero-role{display:grid;max-width:46ch;min-height:64px;margin-top:var(--s2);text-wrap:pretty}
.hero-role>:global(*){grid-area:1/1}
.sizer,.ghost{visibility:hidden}
.slot{display:inline-grid}.slot>:global(*){grid-area:1/1}
.hero-role :global(.decode),.hero-role .ghost{white-space:pre-wrap}
/* The actions, the work chip and the résumé link (0127): bottom right on desktop with the chip
   outermost; on phones a row under the copy. */
.hero-actions{position:absolute;right:var(--gutter);bottom:var(--s8);display:flex;flex-direction:row-reverse;align-items:center;gap:var(--s3)}
:global(.hero-hint) :global(.arrow){display:block;transform:translateY(0);position:relative;top:-1px}
:global(.motion .hero-hint) :global(.arrow){animation:nudge var(--tick-cursor) steps(2,jump-none) infinite}
@keyframes nudge{from{transform:translateY(0)}to{transform:translateY(2px)}}
@media(max-width:1100px){.hero-name{font-size:172px;line-height:172px;padding-bottom:4px}}
/* below 900 the copy reaches the actions' column, so they join the flow under it (0202) */
@media(max-width:900px){.hero-actions{position:static;flex-direction:row;flex-wrap:wrap;margin-top:var(--s2);align-self:flex-start}.hero-sec :global(.hero-hint){white-space:nowrap}}
@media(max-width:700px){
  .hero-sec :global(.hero){padding-bottom:var(--s6)}
  .hero-name{font-size:86px;line-height:86px;padding-bottom:2px}
  .hero-role{max-width:none}
}
</style>
