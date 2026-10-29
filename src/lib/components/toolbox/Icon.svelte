<script lang="ts" module>
  // The app's drawn marks (ui-kit `icon.rs`, design batch C): a 6×6 picture of 2px cells, 12px
  // centred in the 16px slot the typed letter took. Arrows stay type (Arrow.svelte).
  const ROWS = {
    chevronDown: ['......', 'X....X', 'XX..XX', '.XXXX.', '..XX..', '......'],
    chevronUp: ['......', '..XX..', '.XXXX.', 'XX..XX', 'X....X', '......'],
    caretRight: ['.X....', '.XX...', '..XX..', '..XX..', '.XX...', '.X....'],
    xmark: ['X....X', 'XX..XX', '.XXXX.', '.XXXX.', 'XX..XX', 'X....X'],
    plus: ['..XX..', '..XX..', 'XXXXXX', 'XXXXXX', '..XX..', '..XX..'],
    check: ['......', '.....X', '....XX', 'X..XX.', 'XXXX..', '.XX...']
  } as const;
  export type IconName = keyof typeof ROWS;
  const PATHS = Object.fromEntries(Object.entries(ROWS).map(([k, rows]) => [k, rows.flatMap((r, y) => [...r].map((c, x) => (c === 'X' ? `M${x} ${y}h1v1h-1z` : ''))).join('')])) as Record<IconName, string>;
</script>
<script lang="ts">
  let { name }: { name: IconName } = $props();
</script>
<span class="glyph drawn" aria-hidden="true"><svg class="tool-icon" viewBox="0 0 6 6" width="12" height="12" shape-rendering="crispEdges"><path fill="currentColor" d={PATHS[name]} /></svg></span>
