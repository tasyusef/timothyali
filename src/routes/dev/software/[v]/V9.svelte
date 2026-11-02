<script lang="ts">
  // 9. Tree: the section as its folder. `software/` at the top in blackletter, every product a
  // branch with its facts beside it, and its links as the files inside it. One field behind it all.
  import Band from '$lib/components/Band.svelte';
  import Decode from '$lib/components/Decode.svelte';
  import { items } from './lab';
</script>
<main id="main" tabindex="-1">
  <Band class="tree" mode="scene" shot="hero" mountains="a" seed={14} avoid=".tree h1 > span, .tree .branch, .tree .leaf">
    <h1><span class="blackletter display-xl"><Decode text="software/" /></span></h1>
    <ul class="body">
      {#each items as p, i (p.slug)}
        {@const last = i === items.length - 1}
        <li>
          <div class="branch"><span class="dim" aria-hidden="true">{last ? '└──' : '├──'}</span><a class="display-s" href={p.href}>{p.slug}/</a><span class="lbl dim">{p.kind}{p.version ? ` · v${p.version}` : ''}</span></div>
          <div class="leaf note"><span class="dim" aria-hidden="true">{last ? '    ' : '│   '}</span><span class="dim">{p.line}</span></div>
          {#each p.links as l, j (l.href)}
            <div class="leaf"><span class="dim" aria-hidden="true">{last ? '    ' : '│   '}{j === p.links.length - 1 ? '└──' : '├──'}</span><a href={l.href}>{l.label.toLowerCase().replaceAll(' ', '-')}</a></div>
          {/each}
          {#if !last}<div class="leaf" aria-hidden="true"><span class="dim">│</span></div>{/if}
        </li>
      {/each}
    </ul>
  </Band>
</main>
<style>
main :global(.tree){padding:var(--s6) var(--gutter) var(--s8);min-height:calc(100vh - 64px)}
ul{list-style:none;margin:var(--s4) 0 0;padding:0 0 0 var(--s1)}
.branch,.leaf{display:flex;gap:var(--s2);align-items:baseline;white-space:pre;width:fit-content;background:var(--paper)}
.branch a{color:inherit}.leaf a{color:inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}
@media(hover:hover){ul a:hover{color:var(--accent-text)}}
.note span:last-child{white-space:normal;max-width:52ch}
@media(max-width:700px){.branch{flex-wrap:wrap;white-space:normal}}
</style>
