<script lang="ts">
  // The foot of a study or a tool page (0210): the next one in its chain, then the page foot.
  // Written twice before; the page keeps the section around it and its spacing.
  import Arrow from './Arrow.svelte';
  import Cta from './Cta.svelte';
  import PageFoot from './PageFoot.svelte';
  let { href, n, title, note = '', back, backLabel }:
    { href: string; n: string; title: string; note?: string; back: string; backLabel: string } = $props();
</script>
<Cta variant="row" {href}><span>Next / [{n}]</span><span>{title} <Arrow /></span></Cta>
<PageFoot {note} href={back} label={backLabel} />
