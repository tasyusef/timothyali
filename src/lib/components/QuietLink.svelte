<script lang="ts">
  // A link that is not an action block: no ground, an arrow, accent on hover.
  // Merges the study page's back link and its inline "Live" link. `text` is its type role:
  // a label by default, the body face, or the surrounding text's (a study's meta values).
  import Arrow from './Arrow.svelte';
  let { href, label, dir = 'right', pad = false, text = 'lbl', class: klass = '' }:
    { href: string; label: string; dir?: 'right' | 'left'; pad?: boolean; text?: 'lbl' | 'body' | 'inherit'; class?: string } = $props();
  const cls = $derived(['quiet-link', text !== 'inherit' && text, pad && 'pad', klass].filter(Boolean).join(' '));
</script>
<a class={cls} {href}>{#if dir === 'left'}<Arrow dir="left" /> {label}{:else}{label} <Arrow />{/if}</a>
