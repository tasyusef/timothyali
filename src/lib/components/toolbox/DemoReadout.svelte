<script lang="ts">
  // The readout strip over each example (0210; the app's header after design batch C): the
  // route's words, where you are at full strength, then the cursor. No folder, no count.
  import Cursor from '$lib/components/Cursor.svelte';
  let { route }: { route: string[] } = $props();
</script>
<div class="demo-readout lbl"><span class="path">{#each route as word, i (i)}{#if i}<span class="sep" aria-hidden="true">/</span>{/if}<span class:dim={i < route.length - 1}>{word}</span>{/each}<Cursor /></span></div>
