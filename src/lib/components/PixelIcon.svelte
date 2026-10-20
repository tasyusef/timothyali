<script lang="ts">
  // The site's pixel icons, each drawn on one 8×8 grid and scaled by whole multiples (16 = 2px
  // pixels, 24 = 3px), in the colour of their text (0210). Always decorative: the control
  // around an icon carries its name.
  const PATHS = {
    down: 'M3 0h1v8h-1zM0 4h1v1h-1zM1 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 5h1v1h-1zM6 4h1v1h-1z',
    cog: 'M3 0h2v1H3zM1 1h6v1H1zM1 2h2v1H1zM5 2h2v1H5zM0 3h3v2H0zM5 3h3v2H5zM1 5h2v1H1zM5 5h2v1H5zM1 6h6v1H1zM3 7h2v1H3z',
    play: 'M2 1h1v6H2zM3 2h1v4H3zM4 3h1v2H4zM5 3.5h1v1H5z',
    pause: 'M2 1h1v6H2zM5 1h1v6H5z'
  };
  let { name, size = 16, class: klass = '' }: { name: keyof typeof PATHS; size?: 16 | 24; class?: string } = $props();
</script>
<svg class={klass || undefined} viewBox="0 0 8 8" width={size} height={size} aria-hidden="true" shape-rendering="crispEdges"><path d={PATHS[name]} fill="currentColor" /></svg>
