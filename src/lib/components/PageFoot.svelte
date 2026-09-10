<script lang="ts">
  // The end-of-page rule-less footer: a dim note on the left, one link on the right.
  import Arrow from './Arrow.svelte';
  let { note, href, label, class: klass = '' }:
    { note: string; href: string; label: string; class?: string } = $props();
  const cls = $derived(['page-foot', 'lbl', 'dim', klass].filter(Boolean).join(' '));
</script>
<footer class={cls}><span>{note}</span><a {href}>{label} <Arrow /></a></footer>
