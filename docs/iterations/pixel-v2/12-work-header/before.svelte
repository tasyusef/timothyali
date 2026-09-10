<script lang="ts">
  import Picture from '$lib/components/Picture.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { projects, count } from '$lib/work';
</script>
<svelte:head><title>Selected work — Timothy Ali</title><meta name="description" content="Selected brand, product, motion, and front-end work by designer Timothy Ali." /></svelte:head>
<main class="inner-page" id="main" tabindex="-1">
  <section>
    <h1 class="page-head"><span class="display-l">Selected</span><span class="blackletter xl"><Decode text="work." step={70} /></span></h1>
    <div class="rows">
      {#each projects as p, i}
        <a id={p.slug} class="card row" href={`/work/${p.slug}/`}>
          <Picture src={p.cover.src} alt={p.cover.alt} eager={i < 2} />
          <div class="row-body">
            <span class="lbl">[{p.n}] / {p.year} / {p.scope}</span>
            <h2 class="display">{p.title}</h2>
            <p class="body">{p.description}</p>
            <span class="lbl more">View case study <span class="mono" aria-hidden="true">-&gt;</span></span>
          </div>
        </a>
      {/each}
    </div>
    <footer class="page-foot lbl dim"><span>End of index / {count}</span><a href="/contact/">Tell me what you’re building -&gt;</a></footer>
  </section>
</main>
<style>
.page-head{display:flex;flex-direction:column;gap:16px;padding-bottom:64px}
.xl{font-size:258px;line-height:258px;display:block}
.rows{display:flex;flex-direction:column;gap:16px}
.row{display:grid;grid-template-columns:round(down,calc((100% - 32px) * 3 / 5),8px) 1fr;gap:32px;align-items:stretch;scroll-margin-top:16px}
.row-body{display:flex;flex-direction:column;gap:16px;min-width:0}
.row-body .body{flex:1}
.row-body .more{display:inline-flex;align-items:center;gap:16px}
@media(max-width:1300px){.row-body h2{font-size:41px;line-height:41px}}
@media(max-width:1100px){.xl{font-size:172px;line-height:172px}}
@media(max-width:900px){.row{grid-template-columns:100%;gap:16px}}
@media(max-width:700px){.page-head{padding-bottom:32px}.xl{font-size:86px;line-height:86px}}
</style>
