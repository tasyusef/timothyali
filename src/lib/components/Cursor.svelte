<script lang="ts">
  // The one block cursor. `cell` is the 8×16 status-strip block on the page grid;
  // `em` scales with its type, which is what Decode needs behind a 344px name;
  // `line` is 24 tall at the top of a 32px body line (the command plates, 0210).
  // Blinking is driven by `.motion` on the site root, not by a prop.
  let { size = 'cell', color = 'accent', class: klass = '' }:
    { size?: 'cell' | 'em' | 'line'; color?: 'accent' | 'currentColor'; class?: string } = $props();
  const cls = $derived(['cursor', size !== 'cell' && size, color === 'currentColor' && 'on-fg', klass].filter(Boolean).join(' '));
</script>
<span class={cls} aria-hidden="true"></span>
