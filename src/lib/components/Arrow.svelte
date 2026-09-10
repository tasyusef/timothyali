<script lang="ts">
  // Every arrow on the site, in Press Start, always decorative.
  let { dir = 'right' }: { dir?: 'right' | 'left' } = $props();
</script>
<span class="mono" aria-hidden="true">{dir === 'left' ? '<-' : '->'}</span>
