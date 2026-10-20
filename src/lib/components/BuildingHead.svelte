<script lang="ts">
  // “Tell me what you’re building.” (0210): Home's invitation (an h2), Contact's heading and its
  // share image (h1s). The lead line steps to 41.25 below 1300; the word wears .display-xl's
  // ladder. `tight` is Contact's: beside the form's column the word steps to 172 below 1300 too.
  import Decode from './Decode.svelte';
  import { STEP_FAST } from '$lib/tokens';
  let { level = 'h2', id, tight = false }: { level?: 'h1' | 'h2'; id?: string; tight?: boolean } = $props();
</script>
<svelte:element this={level} {id} class="building-head" class:tight><span class="display building-lead">Tell me what<br />you’re</span><span class="blackletter display-xl building-word"><Decode text="building." step={STEP_FAST} /></span></svelte:element>
