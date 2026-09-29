<script lang="ts">
  // The invitation as the last stage held on the window (PX-54), the hero in reverse: the
  // hero's name sinks into its field; here the word comes out of the rain. The rain comes up
  // from the faint wash behind the work to full strength, “Tell me what you’re” comes in
  // through scanlines, the drops land and stack into “building.” in the field's glyphs, and
  // the drawn word resolves over them. Then the link.
  import { onMount } from 'svelte';
  import Band from '$lib/components/Band.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import { TICK_FAST } from '$lib/tokens';
  import { motion, theme } from '$lib/motion.svelte';
  import { hash, lines, onScroll, pinned, revealOnFocus, ramp, resolve, smooth, span, sprites, textMask, RAMP } from './stage';
  import { follower } from './spring';

  let sec: HTMLElement; let stage: HTMLElement; let cv: HTMLCanvasElement; let wordEl: HTMLElement;
  let p = $state(0);
  const still = $derived(!motion.on);
  const rain = $derived(still ? 1 : smooth(p, 0, 0.3)); // the rain comes up on the empty ground the work leaves
  let live = $state(false); // held on the window; before that it slides in, empty, over the work
  const lead1 = $derived(still ? 1 : span(p, 0.08, 0.16));
  const lead2 = $derived(still ? 1 : span(p, 0.14, 0.22));
  const land = $derived(still ? 1 : span(p, 0.22, 0.58)); // the drops land and stack into the word
  const crisp = $derived(still ? 1 : smooth(p, 0.56, 0.74)); // the drawn word resolves over them
  const fade = $derived(still ? 1 : span(p, 0.62, 0.8)); // and the glyphs go
  const cta = $derived(still ? 1 : span(p, 0.74, 0.84));
  // the rain parts round each line once it has arrived
  const avoid = $derived([lead1 > 0.5 && '.inv-lead1', lead2 > 0.5 && '.inv-lead2', crisp > 0.5 && '.inv-word', cta > 0.5 && '.cta-row'].filter(Boolean).join(', '));

  // The stage glides after the scroll on a damped spring (spring.ts), critically damped so the
  // word never unforms; before and after its hold it jumps, so it arrives empty and leaves whole.
  const glide = follower((v) => { p = v; }, 9, 1);
  onMount(() => {
    const off = onScroll(() => {
      const r = sec.getBoundingClientRect(); live = still || r.top <= 1;
      if (still) { glide.to(1, true); return; }
      glide.to(pinned(sec), !(r.top <= 0 && r.bottom >= window.innerHeight));
    });
    return () => { off(); glide.stop(); };
  });

  function reveal() {
    if (still) return;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (sec.offsetHeight - window.innerHeight) * 0.9, behavior: 'instant' });
    glide.to(0.9, true); live = true;
  }

  let colors: { steps: string[]; paper: string; accent: string } | null = null;
  $effect(() => { void theme.light; colors = null; draw(); });
  $effect(() => { void land; void fade; draw(); });
  function draw() {
    if (!cv || !stage) return;
    const dpr = Math.max(1, Math.min(3, Math.round(window.devicePixelRatio || 1)));
    const w = stage.clientWidth, h = stage.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.height = h + 'px'; }
    const g = cv.getContext('2d'); if (!g) return; g.clearRect(0, 0, cv.width, cv.height);
    if (land <= 0 || fade >= 1 || still) return;
    const m = textMask(wordEl, stage); if (!m) return;
    colors ??= { steps: ramp(resolve(stage, 'var(--fg)'), resolve(stage, 'var(--paper)')), paper: resolve(stage, 'var(--paper)'), accent: resolve(stage, 'var(--accent)') };
    const sets = colors.steps.map((c) => sprites(c, dpr)); const hot = sprites(colors.accent, dpr);
    const s = 16 * dpr; g.fillStyle = colors.paper;
    for (let y = 0; y < m.rows; y++) for (let x = 0; x < m.cols; x++) {
      const cov = m.cov[y * m.cols + x]; if (cov < 0.08) continue;
      const X = x + m.x0, Y = y + m.y0; const r = hash(X, Y, 5);
      const at = (1 - (y + 0.5) / m.rows) * 0.72 + r * 0.24; // the bottom row lands first; each cell a little early or late
      if (land < at) continue;
      const k = Math.min(1, Math.max(0, (fade - r * 0.5) / 0.5));
      const lvl = Math.round(Math.min(RAMP.length - 1, cov * (RAMP.length - 1) * 1.35) * (1 - k)); if (lvl <= 0) continue;
      const head = land - at < 0.035; // just landed: the rain's own bright drop, then it settles
      const sp = head ? hot.get('0') : sets[lvl].get(RAMP[lvl]); if (!sp) continue;
      g.fillRect(X * s, Y * s, s, s); g.drawImage(sp, X * s, Y * s);
    }
  }
</script>

<section class="inv-sec" use:revealOnFocus={reveal} class:still bind:this={sec} aria-labelledby="invite">
  <div class="stage" class:live={still || live} bind:this={stage} style:--rain={rain}>
    <Band as="div" class="inv" mode="fall" seed={5} tick={TICK_FAST} density={0.7} shade {avoid}>
      <div class="invitation">
        <h2 id="invite"><span class="display lead"><span class="inv-lead1" style:--t={`${lines(lead1)}px`}>Tell me what</span><br /><span class="inv-lead2" style:--t={`${lines(lead2)}px`}>you’re</span></span><span class="blackletter display-xl inv-word" bind:this={wordEl} style:--t={`${lines(crisp)}px`}>building.</span></h2>
        <div class="cta-wrap" style:--t={`${lines(cta)}px`}><Cta variant="row" href="/contact/" class="lbl">Get in touch <Arrow /></Cta></div>
      </div>
    </Band>
    <canvas class="glyphs" bind:this={cv} aria-hidden="true"></canvas>
  </div>
</section>

<style>
.inv-sec{--chrome:96px;padding:0;height:calc(100svh + 110vh);margin-top:-100vh;margin-top:-100svh}
.stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;pointer-events:none}
.stage.live{pointer-events:auto}
.stage :global(.inv){position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:var(--chrome) var(--gutter) var(--s8)}
.stage :global(.inv>.band-bg){opacity:var(--rain)}
/* under the type, over the rain (the band's content sits a layer up) */
.glyphs{position:absolute;left:0;top:0;z-index:0;pointer-events:none;image-rendering:pixelated}
.inv-lead1,.inv-lead2,.inv-word,.cta-wrap{-webkit-mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px);mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px)}
.inv-lead1,.inv-lead2{display:inline-block}
.invitation h2{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:var(--s4);padding-bottom:var(--s6);margin:0}
.cta-wrap{display:flex;justify-content:flex-end}
.cta-wrap :global(.cta-row){width:round(down,calc(50% - var(--s2)),8px)}
.inv-sec.still{height:auto;margin-top:0}
.still .stage{position:relative;height:auto}
.still .glyphs{display:none}
.still .stage :global(.inv){padding-top:var(--s8)}
@media(max-width:1100px){.invitation h2{flex-direction:column;align-items:flex-start;gap:var(--s2)}}
@media(max-width:700px){
  .inv-sec{--chrome:136px}
  .stage :global(.inv){padding-bottom:var(--s6)}
  .still .stage :global(.inv){padding-top:var(--s6)}
  .invitation h2{padding-bottom:var(--s4)}
  .cta-wrap :global(.cta-row){width:100%}
}
</style>
