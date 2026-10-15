<script lang="ts">
  // One tool's command-line options, flag left and what it does right: the same rows
  // the app's `toolbox <tool> --help` prints, from the params copied into $lib/toolbox.
  import { signature, type Tool } from '$lib/toolbox';
  let { tool, heading = true, collapse = false }: { tool: Tool; heading?: boolean; collapse?: boolean } = $props();
  // On a phone the table folds behind its count (0206): it was most of each tool page there,
  // flag reference few phone readers need. Open in the prerender and without JavaScript.
  let open = $state(true);
  $effect(() => { if (collapse && matchMedia('(max-width: 700px)').matches) open = false; });
</script>
<div class="tool-options">
  {#if heading}<h3 class="lbl">toolbox {tool.slug}</h3>{/if}
  <details bind:open class:collapse><summary class="lbl">All {tool.params.length} options</summary>
  <dl>
    {#each tool.params as p (p.name)}
      <div><dt class="body">{#each signature(p).split('|') as part, i}{#if i}|<wbr />{/if}<span class="opt">{part}</span>{/each}</dt><dd class="body dim">{p.description}{#if p.primary}{' '}You can supply these values without --{p.name}.{/if}{#if p.required}{' '}{p.name === 'out' ? 'Required for export and preview.' : 'Required unless reopening saved work or querying the library.'}{:else if p.default !== undefined}{' '}Default: {Array.isArray(p.default) ? p.default.join(', ') : String(p.default)}.{/if}</dd></div>
    {/each}
  </dl>
  </details>
</div>
<style>
summary{display:none}
details:not([open])>summary{display:flex;align-items:center;gap:var(--s1);min-height:44px;cursor:pointer}
@media(max-width:700px){.collapse summary{display:flex;align-items:center;gap:var(--s1);min-height:44px;cursor:pointer;list-style:none}.collapse summary::-webkit-details-marker{display:none}.collapse summary::before{content:'+';font-family:var(--face-mono);color:var(--accent-text)}.collapse[open] summary::before{content:'-'}.collapse[open] summary{margin-bottom:var(--s2)}}
.tool-options{display:flex;flex-direction:column;gap:var(--s2)}
h3{margin:0}
dl{margin:0;display:flex;flex-direction:column;gap:var(--s2)}
/* flag left, what it does right: the two read as one table without rules */
dl>div{display:grid;grid-template-columns:320px minmax(0,1fr);gap:var(--s1) var(--s4);align-items:start}
dt{overflow-wrap:break-word}.opt{white-space:nowrap} /* a choice list breaks after a “|”, not inside a choice such as library-remove (0205) */dd{margin:0;max-width:48ch;overflow-wrap:anywhere}
@media(max-width:700px){dl>div{grid-template-columns:100%}}
</style>
