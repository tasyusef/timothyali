<script lang="ts">
  // 1. Listing: the giant rising behind "software.", then one full-width row per product, read
  // across like `ls -l`: number, name, kind, where it runs, version, links. No rules: the rows are
  // told apart by their ground, and a row lights up yellow under the pointer.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import QuietLink from '$lib/components/QuietLink.svelte';
  import { items, LEAD } from './lab';
</script>
<main id="main" tabindex="-1">
  <Band class="hero" mode="scene" shot="rise" seed={6} avoid=".hero h1 > span" clear=".hero .lead">
    <h1><span class="blackletter display-xl"><Decode text="software." /></span></h1>
    <p class="lead">{LEAD}</p>
  </Band>
  <section class="list">
    <div class="th lbl dim" aria-hidden="true"><span>No.</span><span>Name</span><span>Kind</span><span>Runs on</span><span>Version</span><span></span></div>
    <ul>
      {#each items as p (p.slug)}
        <li>
          <span class="lbl dim">{p.n}</span>
          <a class="display-s name" href={p.href}>{p.name}</a>
          <span class="lbl">{p.kind}</span>
          <span class="lbl">{p.platforms.join(', ') || (p.slug === 'tome' ? 'WoW Forever' : 'Browser')}</span>
          <span class="lbl">{p.version ? `v${p.version}` : 'Live'}</span>
          <span class="links">{#each p.links as l (l.href)}<QuietLink href={l.href} label={l.label} />{/each}</span>
          <p class="body dim line">{p.line}</p>
        </li>
      {/each}
    </ul>
  </section>
</main>
<style>
main :global(.hero){padding:var(--s8) var(--gutter) var(--s8);min-height:560px;display:flex;flex-direction:column;justify-content:flex-end;gap:var(--s3)}
.list{padding-top:var(--s6);padding-bottom:var(--s8)}
.th,li{display:grid;grid-template-columns:64px 3fr 2fr 3fr 1.2fr 3fr;gap:var(--s2);align-items:baseline}
.th{padding:0 var(--s2) var(--s2)}
ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:var(--s1)}
li{padding:var(--s3) var(--s2);background:var(--surface-card)}
@media(hover:hover){li:hover{background:var(--accent);color:var(--on-accent)}li:hover :global(*){color:inherit;opacity:1}}
.name{color:inherit}
.links{display:flex;flex-direction:column;gap:var(--s1)}
.line{grid-column:2/6;margin:0}
@media(max-width:900px){.th{display:none}li{grid-template-columns:48px 1fr;row-gap:var(--s1)}li>:nth-child(n+3){grid-column:2}.line{grid-column:2}}
@media(max-width:700px){main :global(.hero){min-height:420px;padding-top:var(--s6)}}
</style>
