<script lang="ts">
  // The statement on the inverted panel. With motion on it plays itself like a terminal the
  // first time it comes into view: the sentence types behind the cursor, the three words
  // scramble in one by one with their chips, and the companion paragraph prints a line at a
  // time. It plays once. Motion off, no JavaScript and the prerender show it complete. It
  // scrolls with the page (PX-61): the pinned stage (PX-54) is gone.
  import { onMount, tick } from 'svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { STEP, STEP_FAST } from '$lib/tokens';
  import { motion } from '$lib/motion.svelte';

  const SENTENCE = 'I design the product and the brand, then build the front end. I care how it';
  const qualities: [string, string, string?][] = [['looks.', 'Interface'], ['moves.', 'Motion'], ['works.', 'Code']];
  const LINE_MS = 45; // one printed line of the paragraph
  let sec: HTMLElement; let comp: HTMLElement;
  const still = $derived(!motion.on);
  let typed = $state(''); // the sentence handed to the typer (empty until the play starts)
  let typing = $state(false);
  let wordsOn = $state(0), chipsOn = $state(0), linesOn = $state(0), lineCount = $state(0), lh = $state(32);
  let instant = $state(false); // finished without playing
  let started = false, skipped = false;
  const all = $derived(still || instant);

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  async function play() {
    if (started) return; started = true;
    await sleep(250); if (skipped) return;
    typed = SENTENCE; typing = true;
    await sleep([...SENTENCE].length * STEP_FAST + 250); if (skipped) return;
    typing = false;
    for (let i = 0; i < qualities.length; i++) {
      wordsOn = i + 1; await sleep([...qualities[i][0]].length * STEP + 80); if (skipped) return;
      chipsOn = i + 1; await sleep(140); if (skipped) return;
    }
    await sleep(260); if (skipped) return;
    for (let k = 1; k <= lineCount; k++) { linesOn = k; await sleep(LINE_MS); if (skipped) return; }
  }
  function measure() {
    if (!comp) return;
    lh = parseFloat(getComputedStyle(comp).lineHeight) || 32;
    lineCount = Math.round(comp.offsetHeight / lh);
    if (all) linesOn = lineCount;
  }
  onMount(() => {
    const ro = new ResizeObserver(measure); ro.observe(comp);
    // the play starts when a third of the panel is on screen; scrolling past it before the end
    // finishes it, so nothing is left half-typed off screen
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (still) return;
      if (e.isIntersecting) play();
      else if (started && !instant && e.boundingClientRect.bottom < 0) { skipped = true; instant = true; typing = false; wordsOn = chipsOn = qualities.length; linesOn = lineCount; }
    }), { threshold: [0, 0.3] });
    io.observe(sec);
    tick().then(measure);
    return () => { ro.disconnect(); io.disconnect(); skipped = true; };
  });
</script>

<section class="who" bind:this={sec} aria-labelledby="statement-title">
  <h2 id="statement-title" class="para">
    <!-- the sentence at full length, hidden, holds the lines, so nothing below moves as it types -->
    <span class="display sent"><span class="sizer" aria-hidden="true">{SENTENCE}</span><span class="typed">{#if all}{SENTENCE}{:else}<Decode text={typed} mode="type" step={STEP_FAST} cursor={typing} />{/if}</span></span>
    <span class="words">{#each qualities as [w, label, short], i}<span class="q"><span class="blackletter w">{#if all}{w}{:else if i < wordsOn}<Decode text={w} step={STEP} />{:else}<span class="ghost">{w}</span>{/if}</span><span class="lbl note" class:ghost={!all && i >= chipsOn} aria-hidden="true">{#if short}<span class="note-full">{label}</span><span class="note-short">{short}</span>{:else}{label}{/if}</span></span> {/each}</span>
  </h2>
  <p class="sr-only">Looks: interface. Moves: motion. Works: code.</p>
  <p class="body companion" bind:this={comp} style:clip-path={all || linesOn >= lineCount && lineCount ? 'none' : `inset(0 0 calc(100% - ${linesOn * lh}px) 0)`}>Freelance since 2019, more recently alongside founders and engineers on small teams. Three of the four projects below are products I designed, built, and shipped.</p>
</section>

<style>
.who{--accent-text:var(--accent-on-fg);padding-top:var(--s8);padding-bottom:var(--s8);background:var(--fg);color:var(--paper)}
.who ::selection{background:var(--paper);color:var(--fg)}
.ghost{visibility:hidden}
.para{font-size:55px;line-height:64px;margin:0}
.para .display{font-size:55px;line-height:64px}
.sent{display:grid}
.sent>*{grid-area:1/1}
.sizer{visibility:hidden}
.typed :global(.decode){white-space:pre-wrap}
.words{display:block;font-size:129px;line-height:0}
.q{white-space:nowrap}
.para .w{font-size:129px;line-height:128px;display:inline-block;vertical-align:top;margin-right:var(--s3)}
/* the one deliberate use of primitives outside tokens.css: this plate must not invert with
   the theme, or yellow lands on the white panel again (0067) */
.para .note{background:var(--ink);color:var(--yellow);display:inline-block;vertical-align:baseline;padding:var(--s1);margin-right:var(--s2)}
.para .note.ghost{visibility:hidden}
.note-short{display:none}
.companion{margin-top:var(--s4);max-width:44ch}
@media(max-width:1100px){.words,.para .w{font-size:86px}}
@media(max-width:700px){
  .who{padding-top:var(--s6);padding-bottom:var(--s6)}
  .para{font-size:41.25px;line-height:48px}.para .display{font-size:41.25px;line-height:48px}.words,.para .w{font-size:86px;line-height:96px}.para .w{margin-right:var(--s1)}.para .note{padding:var(--s1);margin-right:0}.note-full{display:none}.note-short{display:inline}
}
@media(max-width:420px){.para,.para .display{font-size:27.5px;line-height:32px}.para .w{margin-right:0}.para .note{padding-inline:4px}}
</style>
