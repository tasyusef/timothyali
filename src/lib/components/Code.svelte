<script lang="ts">
  // A block of commands or JSON on the inverted plate. Text is set in the text face
  // (Departure Mono, 0237), because the mono role is uppercase and a command is not. A long line
  // wraps, its continuation indented two characters, so nothing scrolls sideways (0200);
  // each line is its own block, so copying keeps the line breaks. The text is a
  // prop, not children: Svelte collapses a snippet's newlines before they reach a <pre>.
  // A trailing `# comment` on a line is dimmed (0092); on a phone it drops under its
  // command and the spaces that align it are hidden. Short words (flags, values) never
  // break inside, so `--out` stays whole; a long path or JSON array breaks after a / , or :
  // first, and anywhere only past that. A wrapped line hangs under its own indent, so a
  // nested JSON key's continuation sits right of the key, not left of it (0206).
  // Copy (PX-128) takes the commands without their `# comments`; the button floats in the
  // first line's corner, so only the lines beside it give up its width.
  import CopyButton from './CopyButton.svelte';
  let { text, label }: { text: string; label?: string } = $props();
  const plain = $derived(text.split('\n').filter((l) => !/^\s*#\s/.test(l)).map((l) => { const i = l.search(/\s#\s/); return i < 0 ? l : l.slice(0, i).trimEnd(); }).join('\n'));
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
<pre class="code body panel" role={label ? 'figure' : undefined} aria-label={label}><span class="copy-at"><CopyButton text={plain} name={label} /></span>{#each lines as l}<span class="ln" style:--lead={l.lead || undefined}>{#each l.words as w}{#if /^\s+$/.test(w)}{w}{:else if w.length > 24}{#each w.split(/(?<=[/,:])/) as part, k}{#if k}<wbr />{/if}{#if part.length > 24}{part}{:else}<span class="w">{part}</span>{/if}{/each}{:else}<span class="w">{w}</span>{/if}{/each}{#if l.note}<span class="pad">{l.pad}</span><span class="c">{l.note}</span>{/if}</span>{/each}</pre>
