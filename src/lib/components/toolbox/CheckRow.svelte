<script lang="ts">
  // A settings row (the app's Toggle after design batch C): a drawn box before the row's words,
  // filled and ticked when on; an unticked row's name steps back. A checkbox, not a switch.
  // A div, not a label (0207): rows carry chips, which a label may not hold, and a label named
  // the box with every chip's text. A click on the row ticks it as a label would; a click on a
  // chip is the chip's. The keyboard has the box.
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';
  let { on, onchange, name, children, title }:
    { on: boolean; onchange: (v: boolean) => void; /** the box's name: the row's own words, without chips or swatches */ name: string; children?: Snippet; title?: string } = $props();
  const click = (e: MouseEvent) => { if (!(e.target as Element).closest('button, input')) onchange(!on); };
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="check lbl" class:on {title} onclick={click}>
  <input type="checkbox" class="sr-only" checked={on} aria-label={name} onchange={() => onchange(!on)} />
  <span class="box" aria-hidden="true"><Icon name="check" /></span>
  <span class="row">{@render children?.()}</span>
</div>
