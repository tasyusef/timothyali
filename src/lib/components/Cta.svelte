<script lang="ts">
  // The action blocks. `block` and `row` are primary: accent ground, hover fills
  // to the foreground colour. `hint` is the small accent chip in the hero. `quiet`
  // is a plain label with reserved padding (decision 0065); only the share images' tool
  // row uses it now, and its rules live in that route (0207). With `type` it is a <button>
  // (0210): the contact form's send, the Toolbox send-on, the admin's actions. Every action is
  // set in the label role, so the component adds `lbl` itself (0210; each caller did).
  import type { Snippet } from 'svelte';
  let { variant = 'block', href = undefined, type = undefined, class: klass = '', children, ...rest }:
    { variant?: 'block' | 'row' | 'hint' | 'quiet'; href?: string; type?: 'button' | 'submit'; class?: string; children: Snippet; [key: string]: unknown } = $props();
  const cls = $derived([variant === 'block' ? 'cta' : `cta-${variant}`, 'lbl', klass].filter(Boolean).join(' '));
</script>
{#if href}<a class={cls} {href} {...rest}>{@render children()}</a>{:else if type}<button class={cls} {type} {...rest}>{@render children()}</button>{:else}<span class={cls} {...rest}>{@render children()}</span>{/if}
