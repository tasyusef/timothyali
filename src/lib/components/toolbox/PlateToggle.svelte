<script lang="ts">
  /**
   * Preview plate picker: light or dark ground behind the artwork previews —
   * reversed (white/off-white) logos are invisible on the light plate.
   */
  let { dark, onchange }: { dark: boolean; onchange: (v: boolean) => void } = $props()
</script>

<div role="group" aria-label="Preview background" style="display: inline-flex; gap: var(--s1); align-items: center">
  <span class="lbl dim" style="margin-inline-end: var(--s1)">Plate</span>
  <button
    type="button"
    class="swatch-chip plate-light"
    class:on={!dark}
    aria-pressed={!dark}
    aria-label="Light preview background"
    title="Light plate"
    onclick={() => onchange(false)}
  ></button>
  <button
    type="button"
    class="swatch-chip plate-dark"
    class:on={dark}
    aria-pressed={dark}
    aria-label="Dark preview background"
    title="Dark plate (for reversed logos)"
    onclick={() => onchange(true)}
  ></button>
</div>
