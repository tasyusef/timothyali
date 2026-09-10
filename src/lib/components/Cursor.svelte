<script lang="ts">
  // The one block cursor. `cell` is the 8×16 status-strip block on the page grid;
  // `em` scales with its type, which is what Decode needs behind a 344px name.
  // Blinking is driven by `.motion` on the site root, not by a prop.
  let { size = 'cell', color = 'accent' }: { size?: 'cell' | 'em'; color?: 'accent' | 'currentColor' } = $props();
</script>
<span class={`cursor${size === 'em' ? ' em' : ''}${color === 'currentColor' ? ' on-fg' : ''}`} aria-hidden="true"></span>
