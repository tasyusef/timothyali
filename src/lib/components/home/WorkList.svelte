<script lang="ts">
  // Selected work as rows on the rain (PX-61): the copy on the left, the card with its path bar
  // on the right, one row per project; the four cards from the wheel (PX-54) without the drum.
  // The section's rain is the Band this list and the invitation share on the page.
  import Arrow from '$lib/components/Arrow.svelte';
  import Cta from '$lib/components/Cta.svelte';
  import IndexRow from '$lib/components/IndexRow.svelte';
  import Picture from '$lib/components/Picture.svelte';
  import { projects } from '$lib/work';
  import { fitTitle } from '$lib/fit';
  const LAST = projects[projects.length - 1].n;
</script>

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
        <Picture src={q.cover.src} alt="" width={1600} height={900} eager={k < 1} sizes="(min-width: 1440px) 912px, (min-width: 901px) calc((100vw - 96px) * 2 / 3), calc(100vw - 32px)" />
      </a>
    </div>
  {/each}
  <a class="all lbl" href="/work/">All work <Arrow /></a>
</section>

<style>
.list{padding-top:var(--s8);padding-bottom:var(--s8);display:flex;flex-direction:column;gap:var(--s6);scroll-margin-top:var(--s4)}
.row{display:grid;grid-template-columns:round(down,calc((100% - 32px) / 3),8px) 1fr;gap:var(--s4);align-items:start}
.row-copy{display:flex;flex-direction:column;gap:var(--s2);min-width:0}
.row-copy>*{background:var(--paper)} /* a plate under each block keeps the rain off the type; blocks fill the column so fitTitle measures a real width */
.row-copy :global(.cta-row){margin-top:var(--s1)}
.title{font-size:55px;line-height:56px;margin:0;white-space:nowrap;overflow:hidden}
.title:global([data-fit="41"]){font-size:41.25px;line-height:48px}.title:global([data-fit="27"]){font-size:27.5px;line-height:32px} /* long names step down (fitTitle) */
.blurb{margin:0;max-width:40ch}
.card{display:flex;flex-direction:column;box-shadow:0 0 0 2px var(--fg);background:var(--paper);color:var(--fg);text-decoration:none} /* the rule outside the card, so its height stays on the unit */
.bar{display:flex;justify-content:space-between;gap:var(--s2);padding:var(--s1) var(--s2);box-shadow:inset 0 -2px var(--fg);white-space:nowrap}
.all{align-self:flex-start;display:inline-flex;gap:var(--s1);padding:var(--s1);color:var(--fg);text-decoration:none;background:var(--paper);margin-top:calc(-1 * var(--s2))}
.all:hover,.all:focus-visible{background:var(--fg);color:var(--paper)}
@media(max-width:1100px){.title{font-size:41.25px;line-height:48px}}
@media(max-width:900px){
  .list{padding-top:var(--s6);padding-bottom:var(--s6);gap:var(--s4)}
  .row{grid-template-columns:100%;gap:var(--s2)}
  .card{order:-1}
  .bar>span:last-child{display:none}.bar>span:first-child{overflow:hidden;text-overflow:ellipsis}
  .title{font-size:27.5px;line-height:32px}
  .blurb{font-size:15px;line-height:24px}
}
</style>
