<script lang="ts">
  // One tool's command-line options, flag left and what it does right: the same rows
  // the app's `toolbox <tool> --help` prints, from the params copied into $lib/toolbox.
  import { signature, type Tool } from '$lib/toolbox';
  let { tool, heading = true }: { tool: Tool; heading?: boolean } = $props();
</script>
<div class="tool-options">
  {#if heading}<h3 class="lbl">toolbox {tool.slug}</h3>{/if}
  <dl>
    {#each tool.params as p (p.name)}
      <div><dt class="body">{signature(p)}</dt><dd class="body dim">{p.description}{#if p.primary}{' '}You can supply these values without --{p.name}.{/if}{#if p.required}{' '}{p.name === 'out' ? 'Required for export and preview.' : 'Required unless reopening saved work or querying the library.'}{:else if p.default !== undefined}{' '}Default: {Array.isArray(p.default) ? p.default.join(', ') : String(p.default)}.{/if}</dd></div>
    {/each}
  </dl>
</div>
<style>
.tool-options{display:flex;flex-direction:column;gap:var(--s2)}
h3{margin:0}
dl{margin:0;display:flex;flex-direction:column;gap:var(--s2)}
/* flag left, what it does right: the two read as one table without rules */
dl>div{display:grid;grid-template-columns:320px minmax(0,1fr);gap:var(--s1) var(--s4);align-items:start}
dt{overflow-wrap:anywhere}dd{margin:0;max-width:48ch;overflow-wrap:anywhere}
@media(max-width:700px){dl>div{grid-template-columns:100%}}
</style>
