<script lang="ts">
  // 5. Boxes: each product as a boxed release on a shelf. The box front is its own generated field
  // with its name knocked out, a yellow version sticker on the corner; what it does and its links
  // are on the "back", under the box.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, LEAD } from './lab';
  const modes = ['bands', 'fall', 'scan', 'sparse'] as const;
</script>
<main id="main" tabindex="-1">
  <Band class="hero" mode="scene" shot="rise" seed={4} avoid=".hero h1 > span" clear=".hero .lead">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
    <p class="lead">{LEAD}</p>
  </Band>
  <section class="shelf">
    {#each items as p, i (p.slug)}
      <article class="box">
        <a class="front" href={p.href}>
          <Band as="div" class="art" mode={modes[i]} seed={20 + i} density={0.8} shade avoid=".art .title">
            <span class="title blackletter">{p.slug}.</span>
            <span class="sticker lbl">{p.version ? `v${p.version}` : 'Live'}</span>
            <span class="kind lbl">{p.kind}</span>
          </Band>
        </a>
        <div class="back"><p class="body">{p.line}</p><div class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</div></div>
      </article>
    {/each}
  </section>
</main>
<style>
main :global(.hero){padding:var(--s8) var(--gutter);min-height:440px;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--s3)}
.shelf{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--s4);padding-top:var(--s6);padding-bottom:var(--s8)}
.box{display:flex;flex-direction:column;gap:var(--s3)}
.front{display:block;color:inherit}
.front :global(.art){aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:space-between;padding:var(--s2);background:var(--surface-card)}
.title{font-size:86px;line-height:88px;margin-top:auto;order:2}
.sticker{position:absolute;top:var(--s2);right:var(--s2);background:var(--accent);color:var(--on-accent);padding:var(--pad-s)}
.kind{order:1}
@media(hover:hover){.front:hover .title{color:var(--accent-text)}}
.back{display:flex;flex-direction:column;gap:var(--s2)}.back p{margin:0}
.links{display:flex;flex-direction:column;gap:var(--s1)}
@media(max-width:1100px){.shelf{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.title{font-size:43px;line-height:48px}.front :global(.art){aspect-ratio:4/3}}
@media(max-width:420px){.shelf{grid-template-columns:1fr}}
</style>
