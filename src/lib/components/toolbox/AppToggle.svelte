<script lang="ts">
  import type { Snippet } from 'svelte'

  /** A settings row: the row's content, then its state in brackets — `[on]`. */
  let {
    on,
    onchange,
    children,
    title,
  }: {
    on: boolean
    onchange: (v: boolean) => void
    children?: Snippet
    title?: string
  } = $props()
</script>

<!-- The input comes FIRST: a label activates its first labelable descendant,
     and rows can carry buttons (format chips) in their children — with the
     input last, clicking the row would forward to the first chip instead. -->
<label class="switch lbl" class:on {title}>
  <input type="checkbox" role="switch" class="sr-only" checked={on} onchange={() => onchange(!on)} />
  <span class="row">{@render children?.()}</span>
  <span class="state" aria-hidden="true">[{on ? 'on' : 'off'}]</span>
</label>
