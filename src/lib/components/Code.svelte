<script lang="ts">
  // A block of commands or JSON on the inverted plate. Text is set in Jersey, the site's
  // reading face, because the mono role is uppercase and a command is not. A long line
  // wraps, its continuation indented two characters, so nothing scrolls sideways (0200);
  // each line is its own block, so copying keeps the line breaks. The text is a
  // prop, not children: Svelte collapses a snippet's newlines before they reach a <pre>.
  // A trailing `# comment` on a line is dimmed (0092); on a phone it drops under its
  // command and the spaces that align it are hidden. Short words (flags, values) never
  // break inside, so `--out` stays whole; a long path or JSON array breaks after a / , or :
  // first, and anywhere only past that. A wrapped line hangs under its own indent, so a
  // nested JSON key's continuation sits right of the key, not left of it (0206).
  let { text, label }: { text: string; label?: string } = $props();
  const lines = $derived(text.split('\n').map((line) => {
    const i = line.search(/\s#\s/);
    const code = i < 0 ? line : line.slice(0, i).trimEnd();
    // a lone `.` or other one-character word stays on the line with the word before it
    const words: string[] = [];
    for (const w of code.split(/(\s+)/).filter(Boolean)) {
      if (w.length === 1 && !/\s/.test(w) && words.length > 1 && /^\s+$/.test(words.at(-1)!)) { const sp = words.pop()!; words.push(words.pop()! + sp + w); }
      else words.push(w);
    }
    const lead = line.length - line.trimStart().length;
    return { words, lead, pad: i < 0 ? '' : line.slice(code.length, i + 1), note: i < 0 ? '' : line.slice(i + 1) };
  }));
</script>
<pre class="code" role={label ? 'figure' : undefined} aria-label={label}>{#each lines as l}<span class="ln" style:--lead={l.lead || undefined}>{#each l.words as w}{#if /^\s+$/.test(w)}{w}{:else if w.length > 24}{#each w.split(/(?<=[/,:])/) as part, k}{#if k}<wbr />{/if}{#if part.length > 24}{part}{:else}<span class="w">{part}</span>{/if}{/each}{:else}<span class="w">{w}</span>{/if}{/each}{#if l.note}<span class="pad">{l.pad}</span><span class="c">{l.note}</span>{/if}</span>{/each}</pre>
