<script lang="ts">
  // Selected work as a picker wheel held on the window (PX-54). The cards ride a tight drum but
  // never turn: each one stays square to you, and its place on the drum only sets where it sits,
  // how big it is (its depth, through a fixed perspective) and how far it has gone into the ground
  // (scanlines of the ground colour). The wheel has detents, like a picker: the scroll chooses the
  // nearest card and the drum springs to it (spring.ts). The card in the yellow frame is full size
  // and clean; the copy on the left is level with the frame and decodes to the new name.
  // Motion off, no JavaScript and the prerender show the four projects as a plain list.
  import Ascii from '$lib/components/Ascii.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import { projects } from '$lib/work';
  import { STEP_FAST, TICK_FAST } from '$lib/tokens';
  import { fitTitle } from '$lib/fit';
  import { motion } from '$lib/motion.svelte';
  import { spring } from './spring';
  import { onScroll } from './stage';

  const N = projects.length;
  const LAST = projects[N - 1].n;
  const still = $derived(!motion.on);
  // Scroll per project, and the wheel's arrival and departure: it spins the first card up into
  // the frame as the stage arrives and the last card out over the top as it leaves, from and to a
  // place far enough round the drum to be all ground, so the stages either side meet it on empty
  // ground.
  const STEP_VH = 90, IN_VH = 60, OUT_VH = 60, OFF = 1.4;
  const TOTAL = IN_VH + (N - 1) * STEP_VH + OUT_VH;
  let track: HTMLElement | undefined = $state(); const slides: HTMLElement[] = $state([]);
  let cam = $state(-OFF);
  let live = $state(false); // held on the window; before that it slides in, empty, over the statement

  // the drum: card plus gap, and half the card's width and height, px
  let pitch = $state(0), hw = $state(0), hh = $state(0);
  const ANGLE = 40; // degrees of drum per card
  const PERSP = 260; // short: on a tight wheel the cards still shrink fast as they go round
  const radius = $derived(pitch / (2 * Math.sin((ANGLE * Math.PI) / 360)));
  function onDrum(k: number) {
    const d = k - cam; const phi = (d * ANGLE * Math.PI) / 180;
    if (Math.abs(phi) >= Math.PI / 2) return 'visibility:hidden';
    // size and place snap to the 8px unit, so every frame is a clean one
    const s0 = PERSP / (PERSP + radius * (1 - Math.cos(phi))); const s = hw ? Math.round((hw * 2 * s0) / 8) * 8 / (hw * 2) : s0;
    const y = Math.round((radius * Math.sin(phi) * s0) / 8) * 8;
    // scanlines: lines of ground 0…4px thick in every 4px. The fade follows the distance from the
    // frame, so it starts as soon as a card moves: a third gone a quarter of the way out, 90% gone
    // one card away (half-pixel steps stay on device pixels). All ground is not drawn at all.
    const t = Math.round(Math.min(1, Math.pow(Math.abs(d), 0.8) * 0.92) * 8) / 2;
    if (t >= 4) return 'visibility:hidden';
    return `transform:translate(${-hw}px,${y - hh}px) scale(${s.toFixed(4)});--s:${s.toFixed(4)};--t:${t}px;z-index:${10 - Math.round(Math.abs(d) * 2)}`;
  }
  const current = $derived(Math.min(N - 1, Math.max(0, Math.round(cam))));
  const p = $derived(projects[current]);
  // the copy, the frame and the wash are there while a card is near the frame
  const vis = $derived(Math.min(1, Math.max(0, 1 - Math.max(0, -cam, cam - (N - 1)) / 0.8)));

  // Detents: the scroll picks the nearest stop, and a damped spring a touch under critical carries
  // the drum there, landing with a small give. The cards still snap to the 8px unit, so the settle
  // is drawn a grid step at a time, the way a spring looks in a terminal.
  const OMEGA = 11, ZETA = 0.72;
  let target = -OFF, vel = 0, raf = 0, last = 0, placed = false;
  function read() {
    if (!track) return;
    const r = track.getBoundingClientRect(); const run = r.height - window.innerHeight;
    live = r.top <= 1 && r.bottom >= window.innerHeight - 1;
    const u = Math.min(1, Math.max(0, -r.top / run)) * TOTAL; // how far into the run, in vh
    if (u < IN_VH) target = u < IN_VH / 2 ? -OFF : 0;
    else if (u > TOTAL - OUT_VH) target = u < TOTAL - OUT_VH / 2 ? N - 1 : N - 1 + OFF;
    else target = Math.min(N - 1, Math.max(0, Math.round((u - IN_VH) / STEP_VH)));
    if (!placed) { cam = target; vel = 0; placed = true; return; } // the first read: be there
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
  }
  function step(now: number) {
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
    [cam, vel] = spring(dt, OMEGA, ZETA).update(cam, vel, target);
    if (Math.abs(cam - target) < 0.0005 && Math.abs(vel) < 0.0005) { cam = target; vel = 0; raf = 0; return; }
    raf = requestAnimationFrame(step);
  }
  function measure() { const s = slides[0]; if (s) { pitch = s.offsetHeight * 0.45; hw = Math.round(s.offsetWidth / 2); hh = Math.round(s.offsetHeight / 2); } }
  // the wheel exists only with motion on, which the layout turns on after this mounts
  $effect(() => {
    if (still || !track) return;
    placed = false;
    const ro = new ResizeObserver(() => { measure(); read(); }); if (slides[0]) ro.observe(slides[0]);
    measure();
    const off = onScroll(read);
    return () => { off(); ro.disconnect(); cancelAnimationFrame(raf); raf = 0; };
  });
</script>

{#if still}
  <section class="list" id="work" aria-labelledby="work-title">
    <IndexRow label="Selected work" value={`01–${LAST}`} />
    <h2 id="work-title" class="sr-only">Selected work</h2>
    {#each projects as q, k}
      <div class="row">
        <div class="row-copy">
          <span class="lbl dim">{q.n} / {q.year} / {q.scope}</span>
          <h3 class="display title" use:fitTitle>{q.title.toUpperCase()}</h3>
          <p class="read blurb">{q.description}</p>
          <Cta variant="row" href={`/work/${q.slug}/`} class="lbl">Case study <Arrow /></Cta>
        </div>
        <a class="card" href={`/work/${q.slug}/`} tabindex="-1" aria-hidden="true">
          <span class="bar lbl"><span>~/tim/work/{q.slug}</span><span>[{q.n}/{LAST}]</span></span>
          <Picture src={q.cover.src} alt="" width={1600} height={900} eager={k < 1} sizes="(min-width: 900px) 66vw, 100vw" />
        </a>
      </div>
    {/each}
    <a class="all lbl" href="/work/">All work <Arrow /></a>
  </section>
{:else}
  <section class="wheel" aria-labelledby="work-title" bind:this={track} style:height={`calc(${TOTAL}vh + 100svh)`}>
    <span id="work" class="anchor" style:top={`${IN_VH}vh`}></span><!-- where the first card is in the frame -->
    <div class="stage" class:live>
      <div class="bg" aria-hidden="true" style:opacity={0.28 * vis}><Ascii mode="fall" seed={5} tick={TICK_FAST} density={0.7} shade /></div>
      <div class="cols" style:--hh={`${hh}px`} style:--hw={`${hw}px`}>
        <div class="copy" style:--t={`${Math.round((1 - vis) * 8) / 2}px`}>
          <IndexRow label="Selected work" value={`01–${LAST}`} />
          <div class="active" aria-live="polite">
            <span class="lbl dim">{p.n} / {p.year} / {p.scope}</span>
            {#key p.slug}<h2 id="work-title" class="display title" use:fitTitle><Decode text={p.title.toUpperCase()} step={STEP_FAST} /></h2>{/key}
            <!-- every blurb in one cell, only the current one shown: the block is as tall as the longest, so nothing moves as the wheel turns -->
            <div class="blurbs">{#each projects as q, k}<p class="read blurb" class:cur={k === current} aria-hidden={k !== current}>{q.description}</p>{/each}</div>
            <Cta variant="row" href={`/work/${p.slug}/`} class="lbl">Case study <Arrow /></Cta>
          </div>
          <div class="nav"><a class="all lbl" href="/work/">All work <Arrow /></a></div>
        </div>
        <div class="viewer">
          <div class="drum" class:off={!live}>
            {#each projects as q, k}
              <a class="slide" class:on={k === current} href={`/work/${q.slug}/`} tabindex={k === current ? 0 : -1} aria-hidden={k !== current} bind:this={slides[k]} style={onDrum(k)}>
                <span class="bar lbl"><span>~/tim/work/{q.slug}</span><span>[{q.n}/{LAST}]</span></span>
                <span class="shot"><img src={q.cover.src} alt={q.cover.alt} width={q.cover.w} height={q.cover.h} loading={k < 2 ? 'eager' : 'lazy'} /></span>
              </a>
            {/each}
          </div>
          <div class="frame" aria-hidden="true" style:opacity={vis > 0.5 ? 1 : 0}></div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
/* ---- the wheel ---- */
.wheel{position:relative;padding:0;margin-top:-100vh;margin-top:-100svh} /* the stage before it ends as this one begins */
.anchor{position:absolute;left:0;width:1px;height:1px}
/* The stage fills the window; the chrome (96, 136 on phones) sits over its top. */
.stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;--chrome:96px;pointer-events:none}
.stage.live{pointer-events:auto}
.bg{position:absolute;inset:0} /* the rain, a faint wash behind the wheel */
.cols{position:relative;height:100%;display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);padding:calc(var(--chrome) + var(--s4)) var(--gutter) var(--s4)}
/* left: the index, the project in the frame, All work. The copy starts level with the front
   card's top edge and All work sits level with its bottom edge, so the two read as one row. */
.copy{position:relative;display:flex;flex-direction:column;gap:var(--s3);min-height:0;-webkit-mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px);mask-image:repeating-linear-gradient(to bottom,transparent 0 var(--t,0px),#000 var(--t,0px) 4px)}
.copy>:global(*){background:var(--paper)} /* a plate under each block keeps the rain off the type */
.active{position:absolute;left:0;right:0;top:calc(50% - var(--hh));display:flex;flex-direction:column;gap:var(--s2)}
.nav{position:absolute;left:0;right:0;bottom:calc(50% - var(--hh));display:flex;flex-direction:column;gap:var(--s2)}
.nav>*{background:var(--paper)}
.title{font-size:55px;line-height:56px;margin:0;white-space:nowrap;overflow:hidden}
.title:global([data-fit="41"]){font-size:41.25px;line-height:48px}.title:global([data-fit="27"]){font-size:27.5px;line-height:32px} /* long names step down (fitTitle) */
.blurb{margin:0;max-width:40ch}
.blurbs{display:grid}.blurbs>*{grid-area:1/1;visibility:hidden}.blurbs>.cur{visibility:visible}
.active :global(.cta-row){margin-top:var(--s1)}
.all{align-self:flex-start;display:inline-flex;gap:var(--s1);padding:var(--s1);color:var(--fg);text-decoration:none}
.all:hover{background:var(--fg);color:var(--paper)}
/* right: the drum. Its axis is level with the middle of the viewer; the front card is centred
   on it at full size and the rest are placed round it (onDrum), never turned. */
.viewer{position:relative;min-height:0}
.drum{position:absolute;left:50%;top:50%;width:0;height:0}
.drum.off{visibility:hidden} /* the wheel only turns on its own ground */
.slide{position:absolute;left:0;top:0;display:flex;flex-direction:column;border:2px solid var(--fg);background:var(--paper);color:var(--fg);text-decoration:none;width:min(calc(100vw * 2 / 3 - 96px),calc(((100svh - var(--chrome) - 64px) / 1.75 - 36px) * 16 / 9)); /* sized so the whole wheel fits the stage */transform-origin:50% 50%;will-change:transform}
/* scanlines: the ground itself, drawn over the card as 4px-period lines that thicken as it goes
   round (--t, scaled against the card's own scale so the lines stay 4px on screen), so the card
   fades into the background rather than into stripes */
.slide::after{content:'';position:absolute;inset:-2px;pointer-events:none;background:repeating-linear-gradient(to bottom,var(--paper) 0 calc(var(--t, 0px) / var(--s, 1)),transparent calc(var(--t, 0px) / var(--s, 1)) calc(4px / var(--s, 1)))}
.slide.on .bar{background:var(--fg);color:var(--paper)}
/* the selection frame: yellow corner brackets 8px outside the front card, fixed while the
   cards pass through it, like the band on an iOS picker */
.frame{position:absolute;left:50%;top:50%;width:calc(var(--hw) * 2 + 16px);height:calc(var(--hh) * 2 + 16px);transform:translate(-50%,-50%);pointer-events:none;z-index:20;--c:var(--accent);--l:24px;--w:4px;
  background:linear-gradient(var(--c),var(--c)) 0 0/var(--l) var(--w),linear-gradient(var(--c),var(--c)) 0 0/var(--w) var(--l),linear-gradient(var(--c),var(--c)) 100% 0/var(--l) var(--w),linear-gradient(var(--c),var(--c)) 100% 0/var(--w) var(--l),linear-gradient(var(--c),var(--c)) 0 100%/var(--l) var(--w),linear-gradient(var(--c),var(--c)) 0 100%/var(--w) var(--l),linear-gradient(var(--c),var(--c)) 100% 100%/var(--l) var(--w),linear-gradient(var(--c),var(--c)) 100% 100%/var(--w) var(--l);background-repeat:no-repeat}
/* ---- shared by the wheel's cards and the list's ---- */
.bar{display:flex;justify-content:space-between;gap:var(--s2);padding:var(--s1) var(--s2);border-bottom:2px solid var(--fg);white-space:nowrap}
.shot{position:relative;display:block;aspect-ratio:16/9}
.shot img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover}
/* ---- the list (motion off, no JavaScript, the prerender) ---- */
.list{padding-top:var(--s8);padding-bottom:var(--s8);display:flex;flex-direction:column;gap:var(--s6)}
.row{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start}
.row-copy{display:flex;flex-direction:column;gap:var(--s2);min-width:0}
.row-copy :global(.cta-row){margin-top:var(--s1)}
.card{display:flex;flex-direction:column;box-shadow:0 0 0 2px var(--fg);background:var(--paper);color:var(--fg);text-decoration:none} /* the rule outside the card, so its height stays on the unit */
.card .bar{border-bottom:0;box-shadow:inset 0 -2px var(--fg)}
.list .all{margin-top:calc(-1 * var(--s2))}
@media(max-width:1100px){.title{font-size:41.25px;line-height:48px}}
/* phones: the wheel on top, the copy under it; the list puts each card above its copy */
@media(max-width:900px){
  .stage{--chrome:136px}
  /* the copy takes the height it needs (the longest blurb) and the wheel the rest, its cards sized to it */
  .cols{grid-template-columns:100%;grid-template-rows:minmax(0,1fr) auto;gap:var(--s2);padding-top:calc(var(--chrome) + var(--s2))}
  .viewer{order:-1;container-type:size}
  .slide{width:min(calc(100cqw - 32px),calc((100cqh / 1.75 - 30px) * 16 / 9))}
  .bar>span:last-child{display:none}.bar>span:first-child{overflow:hidden;text-overflow:ellipsis}
  .copy{gap:var(--s2)}
  .active,.nav{position:static}
  .active{gap:var(--s1)}
  .active>.lbl{display:none}
  .title{font-size:27.5px;line-height:32px}
  .blurb{font-size:15px;line-height:24px}
  .copy .all{display:none}
  .list{padding-top:var(--s6);padding-bottom:var(--s6);gap:var(--s4)}
  .row{grid-template-columns:100%;gap:var(--s2)}
  .card{order:-1}
}
</style>
