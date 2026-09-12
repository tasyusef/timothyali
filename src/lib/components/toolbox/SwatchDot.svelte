<script lang="ts">
  /** Square swatch chip — sharp corners, an edge outside the box. */
  let { hex, size = 16 }: { hex: string; size?: number } = $props()
</script>

<span class="swatch" style="width: {size}px; height: {size}px; background: {hex}"></span>
