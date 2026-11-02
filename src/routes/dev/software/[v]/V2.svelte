<script lang="ts">
  // 2. Terminal: the page is one session in a window over the field. `ls` lists the products,
  // then each one is `cat`ed: its line, its facts, its links as commands. The cursor waits at the end.
  import Band from '$lib/components/Band.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import { items } from './lab';
</script>
<main id="main" tabindex="-1">
  <Band class="stage" mode="scene" shot="hero" mountains="a" seed={8} avoid=".term">
    <div class="term panel">
      <div class="bar lbl"><span>~/software</span><span class="dim">tim@timothyali.com</span></div>
      <div class="screen body">
        <p><span class="dim">$</span> ls ~/software</p>
        <p class="ls">{#each items as p (p.slug)}<a href={`#${p.slug}`}>{p.slug}/</a>{/each}</p>
        {#each items as p (p.slug)}
          <div class="entry" id={p.slug}>
            <p><span class="dim">$</span> cat {p.slug}/README</p>
            <p class="blackletter name"><a href={p.href}>{p.slug}.</a></p>
            <p>{p.line}</p>
            <p class="dim">{[p.kind, p.platforms.join(', ')].filter(Boolean).join(' · ').toLowerCase()}{p.version ? ` · v${p.version}` : ''}</p>
            <p class="cmds">{#each p.links as l (l.href)}<a href={l.href}>[{l.label.toLowerCase()}]</a>{/each}</p>
          </div>
        {/each}
        <p><span class="dim">$</span> <Cursor size="line" /></p>
      </div>
    </div>
  </Band>
</main>
<style>
main :global(.stage){padding:var(--s8) var(--gutter)}
.term{max-width:1040px;margin:0 auto}
.bar{display:flex;justify-content:space-between;padding:var(--s1) var(--s2);background:var(--accent);color:var(--on-accent)}
.screen{padding:var(--s3) var(--s4) var(--s4);display:flex;flex-direction:column;gap:var(--s1)}
.screen p{margin:0}
.ls{display:flex;gap:var(--s4);flex-wrap:wrap}
.ls a,.cmds a{color:inherit;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:2px}
@media(hover:hover){.screen a:hover{color:var(--accent-text)}}
.entry{display:flex;flex-direction:column;gap:var(--s1);margin-top:var(--s4)}
.name{font-size:86px;line-height:88px;margin:var(--s1) 0}.name a{color:inherit}
.cmds{display:flex;gap:var(--s3);flex-wrap:wrap}
@media(max-width:700px){main :global(.stage){padding:var(--s4) var(--s2)}.screen{padding:var(--s2)}.name{font-size:43px;line-height:48px}}
</style>
