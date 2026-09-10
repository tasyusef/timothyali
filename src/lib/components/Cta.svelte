<script lang="ts">
  // The action blocks. `block` and `row` are primary: accent ground, hover fills
  // to the foreground colour. `hint` is the small accent chip in the hero. `quiet`
  // is a plain label with reserved padding that lights up to the accent when its
  // parent row is hovered or focused (decision 0065) — the opposite direction, kept.
  import type { Snippet } from 'svelte';
  let { variant = 'block', href = undefined, class: klass = '', children, ...rest }:
    { variant?: 'block' | 'row' | 'hint' | 'quiet'; href?: string; class?: string; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived([variant === 'block' ? 'cta' : `cta-${variant}`, klass].filter(Boolean).join(' '));
</script>
{#if href}<a class={cls} {href} {...rest}>{@render children()}</a>{:else}<span class={cls} {...rest}>{@render children()}</span>{/if}
