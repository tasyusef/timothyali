<script lang="ts">
  import { below } from '$lib/tokens';
  // One tool's command-line options, flag left and what it does right: the same rows
  // the app's `toolbox <tool> --help` prints, from the params copied into $lib/toolbox.
  import { signature, type Tool } from '$lib/toolbox';
  let { tool }: { tool: Tool } = $props();
  // On a phone the table folds behind its count (0206): it was most of each tool page there,
  // flag reference few phone readers need. Open in the prerender and without JavaScript.
  let open = $state(true);
  $effect(() => { if (matchMedia(below('phone')).matches) open = false; });
</script>
<div class="tool-options">
  <details bind:open class="collapse"><summary class="lbl">All {tool.params.length} options</summary>
  <dl>
    {#each tool.params as p (p.name)}
      <div><dt class="body long">{#each signature(p).split('|') as part, i}{#if i}|<wbr />{/if}<span class="opt">{part}</span>{/each}</dt><dd class="body long dim">{p.description}{#if p.primary}{' '}You can supply these values without --{p.name}.{/if}{#if p.required}{' '}{p.name === 'out' ? 'Required for export and preview.' : 'Required unless you’re reopening saved work or querying the library.'}{:else if p.default !== undefined}{' '}Default: {Array.isArray(p.default) ? p.default.join(', ') : String(p.default)}.{/if}</dd></div>
    {/each}
  </dl>
  </details>
</div>
<style>
summary{display:none}
details:not([open])>summary{display:flex;align-items:center;gap:var(--s1);min-height:44px;cursor:pointer}
@media(max-width:700px){.collapse summary{display:flex;align-items:center;gap:var(--s1);min-height:44px;cursor:pointer;list-style:none}.collapse summary::-webkit-details-marker{display:none}.collapse summary::before{content:'+';font-family:var(--face-mono);font-size:16px;line-height:16px;color:var(--accent-text)}.collapse[open] summary::before{content:'-'}.collapse[open] summary{margin-bottom:var(--s2)}}
.tool-options{display:flex;flex-direction:column;gap:var(--s2)}
dl{margin:0;display:flex;flex-direction:column;gap:var(--s2)}
/* flag left, what it does right: the two read as one table without rules */
dl>div{display:grid;grid-template-columns:320px minmax(0,1fr);gap:var(--s1) var(--s4);align-items:start}
dt{overflow-wrap:break-word}.opt{display:inline-block;max-width:100%} /* a choice list breaks after a “|”, not inside a choice such as library-remove (0205), unless the choice is longer than the line: “--socialPadding <number>” in Departure Mono at 320 (0237) */dd{margin:0;max-width:38ch;overflow-wrap:anywhere}
@media(max-width:700px){dl>div{grid-template-columns:100%}}
</style>
