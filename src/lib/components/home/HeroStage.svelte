<script lang="ts">
  // The hero as a stage held on the window (PX-54). At rest it is the terminal hero (0128):
  // the name slot types “hi.” then “i’m tim.” and the copy types under it. Scrolling doesn't
  // move it: the lines under the name go out through scanlines, the name is redrawn in the
  // sky's own glyphs and sinks into the field a cell at a time, and then the screen fills
  // with lines of the panel colour until it is the statement's ground.
  import { onMount } from 'svelte';
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { RESUME_URL } from '$lib/social';
  import { TICK_SLOW, STEP_SLOW, STEP } from '$lib/tokens';
  import { motion, theme } from '$lib/motion.svelte';
  import { hash, lines, onScroll, pinned, revealOnFocus, ramp, resolve, smooth, span, sprites, textMask, RAMP } from './stage';
  import { follower } from './spring';

  const LINES = ['Product designer who ships in code.', 'Interface design, design systems, and front-end development.', 'Denver / remote. Open to full-time and contract.'];
  const STATIC_LINE = LINES.join(' ');
  const HOLD = { hi: 900, name: 700, line: 1600, last: 2600, clear: 600 };
  const erased = (t: string) => [...t].length * STEP_SLOW;
  let slotName = $state('hi.');
  let slotLine = $state('');
  let inView = $state(true);
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const typed = (t: string, step: number, delay = 0) => delay + [...t].length * step + 120;

  let sec: HTMLElement; let stage: HTMLElement; let cv: HTMLCanvasElement;
  let p = $state(0);
  const still = $derived(!motion.on);
  const left = $derived(p > 0.015); // once the stage starts to go, the loop stops on the name
  // the phases, as shares of the scroll through the section
  const lineVis = $derived(1 - smooth(p, 0.03, 0.18)); // the copy and the links go out first
  const crisp = $derived(1 - smooth(p, 0.06, 0.26)); // the drawn name goes to lines…
  const glyphIn = $derived(span(p, 0.05, 0.22)); // …while its glyph copy fills in under them
  const sink = $derived(span(p, 0.22, 0.5)); // the glyphs sink into the field, cell by cell
  const wipe = $derived(smooth(p, 0.56, 0.86)); // the panel colour fills the screen in lines
  // the sky parts round the copy while it is there, and closes over its place once it has gone
  const avoid = $derived(lineVis > 0.5 ? '.hero-actions, .hero-role' : '');

  function reveal() {
    if (still) return;
    window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    glide.to(0, true);
  }
  // The stage glides after the scroll on a damped spring (spring.ts) rather than tracking it
  // exactly; critically damped, so a dissolve never runs backwards. Off the window it jumps, so
  // the stage always leaves complete.
  const glide = follower((v) => { p = v; }, 9, 1);

  onMount(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { inView = e.isIntersecting; }), { threshold: 0.2 });
    io.observe(sec);
    const off = onScroll(() => {
      if (still) { glide.to(0, true); return; }
      const r = sec.getBoundingClientRect();
      glide.to(pinned(sec), !(r.top <= 0 && r.bottom >= window.innerHeight));
    });
    return () => { io.disconnect(); off(); glide.stop(); };
  });
  $effect(() => {
    if (!motion.on) return;
    if (left) { slotName = 'i’m tim.'; return; }
    let stopped = false;
    (async () => {
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
    return () => { stopped = true; };
  });

  // ---- the name in glyphs ------------------------------------------------------------
  let colors: { steps: string[]; paper: string; accent: string } | null = null;
  $effect(() => { void theme.light; colors = null; draw(); });
  $effect(() => { void glyphIn; void sink; draw(); });
  function draw() {
    if (!cv || !stage) return;
    const dpr = Math.max(1, Math.min(3, Math.round(window.devicePixelRatio || 1)));
    const w = stage.clientWidth, h = stage.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
    const g = cv.getContext('2d'); if (!g) return; g.clearRect(0, 0, cv.width, cv.height);
    if (glyphIn <= 0) return;
    const src = stage.querySelector('.hero-name [aria-hidden="true"]') ?? stage.querySelector('.hero-name'); if (!src) return;
    const m = textMask(src, stage); if (!m) return;
    colors ??= { steps: ramp(resolve(stage, 'var(--fg)'), resolve(stage, 'var(--paper)')), paper: resolve(stage, 'var(--paper)'), accent: resolve(stage, 'var(--accent)') };
    const sets = colors.steps.map((c) => sprites(c, dpr)); const hot = sprites(colors.accent, dpr);
    const s = 16 * dpr; g.fillStyle = colors.paper;
    for (let y = 0; y < m.rows; y++) for (let x = 0; x < m.cols; x++) {
      const cov = m.cov[y * m.cols + x]; if (cov < 0.08) continue;
      const X = x + m.x0, Y = y + m.y0; const r = hash(X, Y, 3);
      if (glyphIn < r * 0.9 + 0.1) continue; // not filled in yet
      const k = Math.min(1, Math.max(0, (sink - r * 0.55) / 0.45)); // this cell's own sinking, staggered
      const lvl = Math.round(Math.min(RAMP.length - 1, cov * (RAMP.length - 1) * 1.35) * (1 - k)); if (lvl <= 0) continue;
      const spark = k > 0.12 && k < 0.45 && hash(X, Y, 9) > 0.82; // a few cells flare in the accent on the way down, as the sky's do
      const sp = (spark ? hot : sets[lvl]).get(RAMP[lvl]); if (!sp) continue;
      g.fillRect(X * s, Y * s, s, s); g.drawImage(sp, X * s, Y * s);
    }
  }
</script>

<section class="hero-sec" use:revealOnFocus={reveal} class:still bind:this={sec} aria-labelledby="intro">
  <div class="stage" bind:this={stage}>
    <Band as="div" class="hero" mode="sky" seed={3} tick={TICK_SLOW} density={1.3} shade {avoid}>
      {#if motion.on}
        <h1 id="intro" class="blackletter hero-name" style:--t={`${lines(crisp)}px`}><span class="sr-only">i’m tim.</span><span aria-hidden="true"><Decode text={slotName} mode="type" step={STEP_SLOW} delay={200} cursor={!slotLine && !left} erase /></span></h1>
        <p class="sr-only">{STATIC_LINE}</p>
        <p class="hero-role body" aria-hidden="true" style:--t={`${lines(lineVis)}px`}>{#each LINES as l}<span class="sizer">{l}</span>{/each}<Decode text={slotLine} mode="type" step={STEP} cursor={!!slotLine} cursorSize="cell" /></p>
      {:else}
        <h1 id="intro" class="blackletter hero-name">i’m tim.</h1>
        <p class="hero-role body">{STATIC_LINE}</p>
      {/if}
      <div class="hero-actions" style:--t={`${lines(lineVis)}px`}><Cta variant="hint" class="hero-hint lbl" href="#work">Selected work<svg class="arrow" width="16" height="16" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M3 0h1v1h-1zM3 1h1v1h-1zM3 2h1v1h-1zM3 3h1v1h-1zM3 4h1v1h-1zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1zM0 4h1v1h-1zM6 4h1v1h-1zM1 5h1v1h-1zM5 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1z" fill="currentColor" /></svg></Cta><QuietLink href={RESUME_URL} label="Resume" class="hero-resume lbl" /></div>
    </Band>
    <canvas class="glyphs" bind:this={cv} aria-hidden="true"></canvas>
    <div class="wipe" aria-hidden="true" style:--t={`${lines(1 - wipe)}px`}></div>
  </div>
</section>

<style>
/* The section is the scroll; the stage is the window it holds still. The section starts under
   the chrome, so the stage is the whole window and the sky runs up behind the header. */
.hero-sec{--chrome:96px;padding:0;margin-top:calc(-1 * var(--chrome));height:calc(100svh + 100vh)}
.stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
.stage :global(.hero){position:relative;height:100%;height:round(down,100%,8px);display:flex;flex-direction:column;justify-content:flex-end;padding:var(--chrome) var(--gutter) var(--s8);overflow:hidden}
.glyphs{position:absolute;left:0;top:0;z-index:2;pointer-events:none;image-rendering:pixelated}
/* lines of the panel colour, 0…4px in every 4, over everything: at 4 the window is the panel */
.wipe{position:absolute;inset:0;z-index:3;pointer-events:none;background:repeating-linear-gradient(to bottom,var(--fg) 0 var(--t,0px),transparent var(--t,0px) 4px)}
/* scanlines on type: the element itself is cut away in lines (a mask, so the field behind shows) */
.hero-name,.hero-role,.hero-actions{-webkit-mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px);mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px)}
.hero-name{font-size:344px;line-height:344px}
.hero-role{display:grid;max-width:46ch;min-height:64px;margin-top:var(--s2);text-wrap:pretty}
.hero-role>:global(*){grid-area:1/1}
.sizer{visibility:hidden}
.hero-role :global(.decode){white-space:pre-wrap}
.hero-actions{position:absolute;right:var(--gutter);bottom:var(--s8);display:flex;flex-direction:row-reverse;align-items:center;gap:var(--s3)}
.stage :global(.hero-hint:hover),.stage :global(.hero-hint:focus-visible){background:var(--fg);color:var(--paper)}
:global(.hero-hint) .arrow{display:block;transform:translateY(0);position:relative;top:-1px}
:global(.motion .hero-hint) .arrow{animation:nudge var(--tick-cursor) steps(2,jump-none) infinite}
@keyframes nudge{from{transform:translateY(0)}to{transform:translateY(2px)}}
/* motion off: the hero as it is today, no stage */
.hero-sec.still{height:auto}
.still .stage{position:relative;height:auto}
.still .stage :global(.hero){height:auto;min-height:round(down,100vh,8px);min-height:round(down,100svh,8px);padding-top:calc(var(--chrome) + var(--s8))}
.still .glyphs,.still .wipe{display:none}
@media(max-width:1100px){.hero-name{font-size:258px;line-height:264px}}
@media(max-width:700px){
  .hero-sec{--chrome:136px}
  .stage :global(.hero){padding-bottom:var(--s6)}
  .hero-name{font-size:129px;line-height:136px}
  .hero-actions{position:static;flex-direction:row;margin-top:var(--s2);align-self:flex-start}
  .hero-role{max-width:none}
}
</style>
