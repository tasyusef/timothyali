<script lang="ts">
  // The end-of-page rule-less footer: a dim note on the left, one link on the right. The note
  // dims, not the footer: the link is the page's last action, at full strength with the quiet
  // link's hover and press (PX-125).
  import Arrow from './Arrow.svelte';
  let { note, href, label, class: klass = '' }:
    { note: string; href: string; label: string; class?: string } = $props();
  const cls = $derived(['page-foot', 'lbl', klass].filter(Boolean).join(' '));
</script>
<footer class={cls}><span class="dim">{note}</span><a {href}>{label} <Arrow /></a></footer>
