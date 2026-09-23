<script lang="ts">
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import MetaLine from '$lib/components/MetaLine.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { projects } from '$lib/work';
  import { RESUME_URL } from '$lib/social';
  import { TICK_SLOW, TICK_FAST, STEP_SLOW, STEP, STEP_FAST } from '$lib/tokens';
  import { motion } from '$lib/motion.svelte';
  import { onMount } from 'svelte';
  // The hero is the terminal (0128): with motion on, the name slot types “hi.” then “i’m tim.”,
  // the line under it types the copy one line at a time behind the cell cursor, holds, clears
  // and loops. Motion off, no JavaScript and the prerender show the name and the copy in full.
  const LINES = ['Brand and web designer.', 'Identities, motion, and websites built in code.', 'Denver / remote. Open to full-time and freelance.'];
  const STATIC_LINE = LINES.join(' ');
  const HOLD = { hi: 900, name: 700, line: 1600, last: 2600, clear: 600 };
  let slotName = $state('hi.');
  let slotLine = $state('');
  let heroVisible = $state(true);
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const typed = (t: string, step: number, delay = 0) => delay + [...t].length * step + 120;
  onMount(() => {
    const hero = document.querySelector('.hero'); if (!hero) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { heroVisible = e.isIntersecting; }), { threshold: 0.2 });
    io.observe(hero); return () => io.disconnect();
  });
  $effect(() => {
    if (!motion.on) return;
    let stopped = false;
    (async () => {
      while (!stopped) {
        while (!heroVisible && !stopped) await sleep(300);
        slotName = 'hi.'; slotLine = '';
        await sleep(typed('hi.', STEP_SLOW, 200) + HOLD.hi); if (stopped) break;
        slotName = 'i’m tim.';
        await sleep(typed('i’m tim.', STEP_SLOW, 200) + HOLD.name); if (stopped) break;
        for (const l of LINES) { slotLine = l; await sleep(typed(l, STEP) + (l === LINES[LINES.length - 1] ? HOLD.last : HOLD.line)); if (stopped) break; }
        if (stopped) break;
        slotLine = ''; slotName = '';
        await sleep(HOLD.clear);
      }
    })();
    return () => { stopped = true; slotName = 'hi.'; slotLine = ''; };
  });
  // Brand, motion, web (PX-43): the third chip reads “Web” so looks/moves/works maps to the two
  // tracks. A chip may still carry a shorter phone form as the third element (0076).
  const qualities: [string, string, string?][] = [['looks.', 'Brand'], ['moves.', 'Motion'], ['works.', 'Web']];
</script>
<svelte:head><title>Timothy Ali / Brand and web designer</title><meta name="description" content="Timothy Ali, brand and web designer in Denver. Identities, motion, and websites built in code. Open to full-time and freelance work." /></svelte:head>
<main id="main" tabindex="-1">
  <Band class="hero" aria-labelledby="intro" mode="sky" seed={3} tick={TICK_SLOW} density={1.3} shade avoid=".hero-actions, .hero-role">
    {#if motion.on}
      <h1 id="intro" class="blackletter hero-name"><span class="sr-only">i’m tim.</span><span aria-hidden="true"><Decode text={slotName} mode="type" step={STEP_SLOW} delay={200} cursor={!slotLine} /></span></h1>
      <p class="sr-only">{STATIC_LINE}</p>
      <p class="hero-role body" aria-hidden="true"><Decode text={slotLine} mode="type" step={STEP} cursor={!!slotLine} cursorSize="cell" /></p>
    {:else}
      <h1 id="intro" class="blackletter hero-name">i’m tim.</h1>
      <p class="hero-role body">{STATIC_LINE}</p>
    {/if}
    <!-- PARC Pixel has no É, so the résumé label reads “Resume” -->
    <div class="hero-actions"><Cta variant="hint" class="hero-hint lbl" href="#work">Selected work<svg class="arrow" width="16" height="16" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><path d="M3 0h1v1h-1zM3 1h1v1h-1zM3 2h1v1h-1zM3 3h1v1h-1zM3 4h1v1h-1zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1zM0 4h1v1h-1zM6 4h1v1h-1zM1 5h1v1h-1zM5 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1z" fill="currentColor" /></svg></Cta><QuietLink href={RESUME_URL} label="Resume" class="hero-resume lbl" /></div>
  </Band>

  <section class="who" aria-labelledby="statement-title">
    <h2 id="statement-title" class="para">
      <span class="display">Designer for teams that don’t have one yet. I care how it</span>
      <span class="words">{#each qualities as [word, label, short], i}<span class="q"><span class="blackletter w"><Decode text={word} step={STEP} delay={i * 150} /></span><span class="lbl note" aria-hidden="true">{#if short}<span class="note-full">{label}</span><span class="note-short">{short}</span>{:else}{label}{/if}</span></span> {/each}</span>
    </h2>
    <p class="sr-only">Looks: brand. Moves: motion. Works: web.</p>
    <p class="body companion">Since 2019, I’ve worked with founders, engineers, and artists on identities, motion, and websites. I’m open to joining an existing design team, too.</p>
  </section>

  <Band as="div" class="work-rain" mode="fall" seed={5} tick={TICK_FAST} density={0.7} shade avoid=".index-row > span, .work-statement, .work-foot a, .invitation h2 > span, .invitation .cta-row">
  <section class="work-index" id="work" aria-labelledby="work-title">
    <IndexRow label="Selected work" value={`01–${projects[projects.length - 1].n}`} />
    <h2 id="work-title" class="work-statement display">Brand identities, websites, and motion.<br />Here’s some of <span class="blackletter">my work.</span></h2>
    <div class="cards">
      {#each projects as p, i}
        <a class="card" href={`/work/${p.slug}/`}>
          <Picture src={p.cover.src} alt={p.cover.alt} eager={i < 3} />
          <div class="card-body"><MetaLine project={p} short /><h3 class="display-s">{p.title}</h3><Arrow /></div>
        </a>
      {/each}
    </div>
    <div class="work-foot"><Cta variant="quiet" class="lbl" href="/work/">All work <Arrow /></Cta></div>
  </section>

  <section class="invitation" aria-labelledby="invite">
    <h2 id="invite"><span class="display">Tell me what<br />you’re</span><span class="blackletter display-xl"><Decode text="building." step={STEP_FAST} /></span></h2>
    <Cta variant="row" href="/contact/" class="lbl">Get in touch <Arrow /></Cta>
  </section>
  </Band>
</main>
<style>
/* `.hero` and `.work-rain` are rendered by Band, so this page reaches them with
   :global() anchored on its own <main>. Everything else is in its own markup. */
main :global(.hero){min-height:calc(100vh - 96px);min-height:round(down,calc(100vh - 96px),8px);display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:var(--s8);overflow:hidden}
.hero-name{font-size:344px;line-height:344px}
/* The role and status lines under the name (PX-43): body and label, knocked out of the sky
   like the hint; the hint is now the link to the work. */
/* The typed line: a flex box so the field's knockout measures one stable box (its element
   box, not the changing words) two lines tall; the typed text wraps like prose. */
.hero-role{display:flex;max-width:46ch;min-height:64px;margin-top:var(--s2)}
.hero-role :global(.decode){display:inline;white-space:pre-wrap}
/* The actions, the work chip and the résumé link (0127): bottom right on desktop with the chip
   outermost; on phones a row under the status. */
.hero-actions{position:absolute;right:var(--gutter);bottom:var(--s8);display:flex;flex-direction:row-reverse;align-items:center;gap:var(--s3)}
main :global(.hero-hint:hover),main :global(.hero-hint:focus-visible){background:var(--fg);color:var(--paper)}
:global(.hero-hint) .arrow{display:block;transform:translateY(0);position:relative;top:-1px} /* a 16px block in a line moved 1 down for the type (0097) */
:global(.motion .hero-hint) .arrow{animation:nudge var(--tick-cursor) steps(2,jump-none) infinite}
@keyframes nudge{from{transform:translateY(0)}to{transform:translateY(2px)}}
.who{--accent-text:var(--accent-on-fg);padding-top:var(--s8);padding-bottom:var(--s8);background:var(--fg);color:var(--paper)}
.who ::selection{background:var(--paper);color:var(--fg)}
/* The sentence is inline in a 64px line; the span sits on the line top, not the baseline,
   or Chrome's half-leading rounding makes each line 65 (0089). */
.para{font-size:55px;line-height:64px}
.para .display{display:inline;font-size:55px;line-height:64px;vertical-align:top}
/* line-height 0 on the block: the words and chips are inline boxes with their own line
   boxes (128 / 16), and a 129px strut would push each line 2px past the unit; the word
   sits on the line top for the same reason as the sentence. `.q` keeps a word and its
   chip on one line — Chrome will otherwise break before the inline-block chip (0089). */
.words{display:block;font-size:129px;line-height:0}
.q{white-space:nowrap}
.para .w{font-size:129px;line-height:128px;display:inline;vertical-align:top;margin-right:var(--s3)}
/* the one deliberate use of primitives outside tokens.css: this plate must not
   invert with the theme, or yellow lands on the white panel again (0067) */
.para .note{background:var(--ink);color:var(--yellow);display:inline-block;vertical-align:baseline;padding:var(--s1);margin-right:var(--s2)}
.note-short{display:none}
.companion{margin-top:var(--s4);max-width:44ch} /* the companion to the statement (PX-43) */
.work-statement{padding-bottom:var(--s6)}
.work-statement{line-height:88px} /* room for the 86px blackletter words inline with 55px caps */
/* line-height 0 on the inline words: baseline-aligned, their 88px box sits 9px below the
   caps' and stretched each line to 97; a zero box leaves the line to the caps' strut (0089). */
.work-statement .blackletter{font-size:86px;line-height:0;text-transform:none}
.work-foot{display:flex;justify-content:flex-end;padding-top:var(--s4)}
.work-foot :global(.cta-quiet){display:flex;justify-content:space-between;width:calc(50% - var(--s2));background:var(--paper);padding:17px 16px 15px}
.work-foot :global(.cta-quiet:hover),.work-foot :global(.cta-quiet:focus-visible){background:var(--fg);color:var(--paper)}
.work-foot :global(.cta-quiet:hover .mono),.work-foot :global(.cta-quiet:focus-visible .mono){color:inherit}
.work-foot :global(.cta-quiet:active){background:var(--accent);color:var(--on-accent)} /* press (0099) */
main :global(.work-rain){position:relative;isolation:isolate;overflow:hidden}
:global(.work-rain) .card{background-color:var(--paper)}:global(.work-rain) .card:active{background-color:var(--accent)}
.work-index{padding-top:var(--s8);padding-bottom:var(--s8);scroll-margin-top:var(--s4)}
.invitation{padding-top:var(--s8);padding-bottom:var(--s8);overflow:hidden}
.invitation h2{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:flex-end;gap:var(--s4);padding-bottom:var(--s6)}
.invitation :global(.cta-row){width:round(down,calc(50% - var(--s2)),8px);margin-left:auto}
@media(max-width:1100px){.invitation h2{flex-direction:column;align-items:flex-start;gap:var(--s2)}}
@media(max-width:1100px){.hero-name{font-size:258px;line-height:264px}.words,.para .w{font-size:86px}}
@media(max-width:700px){
  /* The first screen on a phone (0127): the hero is the small viewport less the 136px chrome,
     so the name, the lines and the actions end at the fold; 80vh stays as the fallback. */
  main :global(.hero){min-height:round(down,80vh,8px);min-height:round(down,calc(100svh - 136px),8px);padding-bottom:var(--s6)}
  .hero-name{font-size:129px;line-height:136px}
  .hero-actions{position:static;flex-direction:row;margin-top:var(--s2);align-self:flex-start}
  .hero-role{max-width:none}
  .who{padding-top:var(--s6);padding-bottom:var(--s6)}
  .para{font-size:41.25px;line-height:48px}.para .display{font-size:41.25px;line-height:48px}.words,.para .w{font-size:86px;line-height:96px}.para .w{margin-right:var(--s1)}.para .note{padding:var(--s1);margin-right:0}.note-full{display:none}.note-short{display:inline}
  .work-statement{padding-bottom:var(--s4)}
  .work-statement{font-size:27.5px;line-height:40px}.work-statement .blackletter{font-size:43px}
  .work-foot :global(.cta-quiet),.invitation :global(.cta-row){width:100%}
  .invitation{padding-top:var(--s6);padding-bottom:var(--s6)}
  .invitation h2{padding-bottom:var(--s4)}
  .work-index{padding-top:var(--s6);padding-bottom:var(--s6)}
}
@media(max-width:420px){.para,.para .display{font-size:27.5px;line-height:32px}.para .w{margin-right:0}.para .note{padding-inline:4px}} /* “moves.” + its chip is exactly the 320 box; the chip’s own padding keeps the gap */
</style>
