<script lang="ts">
  // A link that is not an action block: no ground, an arrow, accent on hover.
  // Merges the study page's back link and its inline "Live" link.
  import Arrow from './Arrow.svelte';
  let { href, label, dir = 'right', pad = false, class: klass = '' }:
    { href: string; label: string; dir?: 'right' | 'left'; pad?: boolean; class?: string } = $props();
  const cls = $derived(['quiet-link', pad ? 'pad' : '', klass].filter(Boolean).join(' '));
</script>
<a class={cls} {href}>{#if dir === 'left'}<Arrow dir="left" /> {label}{:else}{label} <Arrow />{/if}</a>
