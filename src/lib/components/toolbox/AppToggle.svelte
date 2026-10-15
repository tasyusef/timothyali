<script lang="ts">
  import type { Snippet } from 'svelte'

  /** A settings row: the row's content, then its state in brackets — `[on]`. */
  let {
    on,
    onchange,
    name,
    children,
    title,
  }: {
    on: boolean
    onchange: (v: boolean) => void
    /** the switch's accessible name: the row's own words, without its chips or swatches */
    name: string
    children?: Snippet
    title?: string
  } = $props()
  // A row is a div, not a label (0207): rows carry buttons (format chips), which a label may not
  // hold, and a label named the switch with every chip's text ("Web JPEG PNG SVG"). A click on the
  // row toggles it as a label would; a click on a chip is the chip's. The keyboard has the switch.
  function click(e: MouseEvent) {
    if (!(e.target as Element).closest('button, input')) onchange(!on)
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="switch lbl" class:on {title} onclick={click}>
  <input type="checkbox" role="switch" class="sr-only" checked={on} aria-label={name} onchange={() => onchange(!on)} />
  <span class="row">{@render children?.()}</span>
  <span class="state" aria-hidden="true">[{on ? 'on' : 'off'}]</span>
</div>
