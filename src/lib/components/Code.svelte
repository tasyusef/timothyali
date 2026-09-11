<script lang="ts">
  // A block of commands or JSON on the inverted plate. Text is set in Jersey, the site's
  // reading face, because the mono role is uppercase and a command is not. Lines run
  // as written; a long one scrolls inside the block rather than wrapping. The text is a
  // prop, not children: Svelte collapses a snippet's newlines before they reach a <pre>.
  // A trailing `# comment` on a line is dimmed (0092).
  let { text, label }: { text: string; label?: string } = $props();
  const lines = $derived(text.split('\n').map((line) => {
    const i = line.search(/\s#\s/);
    return i < 0 ? { code: line, note: '' } : { code: line.slice(0, i + 1), note: line.slice(i + 1) };
  }));
</script>
<pre class="code" aria-label={label}>{#each lines as l, i}{#if i}{'\n'}{/if}{l.code}{#if l.note}<span class="c">{l.note}</span>{/if}{/each}</pre>
