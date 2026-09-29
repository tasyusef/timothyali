<script lang="ts">
  // The statement as a stage held on the window, on the inverted panel (PX-54). It arrives
  // empty (the hero ends on this ground) and, once it is held on the window, it plays itself
  // like a terminal: the sentence types behind the cursor, the three words scramble in one by
  // one with their chips, and the companion paragraph prints a line at a time. Overflowing
  // text moves with the scroll, so returning restores the opening. It plays once; leaving finishes
  // it. Scrolling on sends the panel out in lines of the page ground, where Selected work begins.
  import { onMount, tick } from 'svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { STEP, STEP_FAST } from '$lib/tokens';
  import { motion } from '$lib/motion.svelte';
  import { lines, onScroll, pinned, smooth } from './stage';

  const SENTENCE = 'I design the product and build the front end. I care how it';
  const qualities: [string, string, string?][] = [['looks.', 'Interface'], ['moves.', 'Motion'], ['works.', 'Code']];
  const LINE_MS = 45; // one printed line of the paragraph
  let sec: HTMLElement; let stage: HTMLElement; let inner: HTMLElement; let comp: HTMLElement;
  let p = $state(0);
  let live = $state(false); // held on the window; before that it slides in, empty and clear, over the hero
  const still = $derived(!motion.on);
  // the play: what has appeared so far
  let typed = $state(''); // the sentence handed to the typer (empty until the play starts)
  let typing = $state(false);
  let wordsOn = $state(0), chipsOn = $state(0), linesOn = $state(0), lineCount = $state(0), lh = $state(32);
  let instant = $state(false); // finished without playing (motion off, or left before the end)
  let started = false, skipped = false;
  const all = $derived(still || instant);
  const out = $derived(still ? 0 : smooth(p, 0.72, 0.95)); // the panel goes out in the last stretch of the hold
  // Reserve enough travel to read tall content in either direction, before the exit wipe.
  let overflow = $state(0);
  const lift = $derived(still ? 0 : -Math.round(overflow * smooth(p, 0.08, 0.68)));

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
  function finish() { if (instant) return; skipped = true; started = true; instant = true; typing = false; wordsOn = chipsOn = qualities.length; linesOn = lineCount; }
  function measure() {
    if (!comp || !inner || !stage) return;
    lh = parseFloat(getComputedStyle(comp).lineHeight) || 32;
    lineCount = Math.round(comp.offsetHeight / lh);
    if (all) linesOn = lineCount;
    overflow = Math.max(0, inner.scrollHeight - stage.clientHeight);
  }

  onMount(() => {
    const ro = new ResizeObserver(measure); ro.observe(inner); ro.observe(stage);
    const off = onScroll(() => {
      p = still ? 0 : pinned(sec); const r = sec.getBoundingClientRect();
      live = still || (r.top <= 1 && r.bottom >= window.innerHeight - 1);
      if (still) return;
      if (live && p < 0.72) play(); // held: play (once)
      // Scrolling through tall copy should never outrun its typing; leaving finishes it too.
      if ((overflow > 0 && p > 0.08) || p >= 0.72 || r.bottom < 0) finish();
    });
    tick().then(measure);
    return () => { ro.disconnect(); off(); skipped = true; };
  });
</script>

<section class="st-sec" class:still style:--overflow={`${overflow}px`} bind:this={sec} aria-labelledby="statement-title">
  <div class="stage" class:live={still || live} bind:this={stage}>
    <div class="inner" bind:this={inner} style:transform={`translateY(${lift}px)`}>
      <h2 id="statement-title" class="para">
        <!-- the sentence at full length, hidden, holds the lines, so nothing below moves as it types -->
        <span class="display sent"><span class="sizer" aria-hidden="true">{SENTENCE}</span><span class="typed">{#if all}{SENTENCE}{:else}<Decode text={typed} mode="type" step={STEP_FAST} cursor={typing} />{/if}</span></span>
        <span class="words">{#each qualities as [w, label, short], i}<span class="q"><span class="blackletter w">{#if all}{w}{:else if i < wordsOn}<Decode text={w} step={STEP} />{:else}<span class="ghost">{w}</span>{/if}</span><span class="lbl note" class:ghost={!all && i >= chipsOn} aria-hidden="true">{#if short}<span class="note-full">{label}</span><span class="note-short">{short}</span>{:else}{label}{/if}</span></span> {/each}</span>
      </h2>
      <p class="sr-only">Looks: interface. Moves: motion. Works: code.</p>
      <p class="body companion" bind:this={comp} style:clip-path={all || linesOn >= lineCount && lineCount ? 'none' : `inset(0 0 calc(100% - ${linesOn * lh}px) 0)`}>I’ve been freelancing since 2019. More recently, I’ve worked with founders and engineers on small teams. I’ve also shipped three products of my own: Sonde, an XRP Ledger analytics platform I designed, built, and ran solo; Pocketwatch, a personal finance app built with a partner on the backend; and Toolbox, a desktop app for brand deliverables. I also do brand and motion, and it shows in the product work.</p>
    </div>
    <div class="wipe" aria-hidden="true" style:--t={`${lines(1 - out)}px`}></div>
  </div>
</section>

<style>
.st-sec{--chrome:96px;padding:0;height:calc(100svh + 130vh + var(--overflow,0px));margin-top:-100vh;margin-top:-100svh;--accent-text:var(--accent-on-fg)}
.stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;color:var(--paper);pointer-events:none}
.stage.live{background:var(--fg);pointer-events:auto}
.stage:not(.live) .inner{visibility:hidden} /* sliding in or out under the hero: nothing of it shows until it is held */
.stage ::selection{background:var(--paper);color:var(--fg)}
.inner{position:relative;min-height:100%;display:flex;flex-direction:column;justify-content:center;padding:calc(var(--chrome) + var(--s4)) var(--gutter) var(--s8)}
/* lines of the page ground over everything: at 4 the panel is gone */
.wipe{position:absolute;inset:0;z-index:3;pointer-events:none;background:repeating-linear-gradient(to bottom,var(--paper) 0 var(--t,0px),transparent var(--t,0px) 4px)}
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
.para .note{background:var(--ink);color:var(--yellow);display:inline-block;vertical-align:baseline;padding:var(--s1);margin-right:var(--s2)}
.para .note.ghost{visibility:hidden}
.note-short{display:none}
.companion{margin-top:var(--s4);max-width:44ch}
.st-sec.still{height:auto;margin-top:0}
.still .stage{position:relative;height:auto}
.still .wipe{display:none}
.still .inner{padding-top:var(--s8)}
@media(max-width:1100px){.words,.para .w{font-size:86px}}
@media(max-width:700px){
  .st-sec{--chrome:136px}
  .inner{justify-content:flex-start;padding-top:calc(var(--chrome) + var(--s2));padding-bottom:var(--s6)}
  .still .inner{padding-top:var(--s6)}
  .para{font-size:41.25px;line-height:48px}.para .display{font-size:41.25px;line-height:48px}.words,.para .w{font-size:86px;line-height:96px}.para .w{margin-right:var(--s1)}.para .note{padding:var(--s1);margin-right:0}.note-full{display:none}.note-short{display:inline}
}
@media(max-width:420px){.para,.para .display{font-size:27.5px;line-height:32px}.para .w{margin-right:0}.para .note{padding-inline:4px}}
</style>
