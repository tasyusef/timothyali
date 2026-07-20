<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Optional URL text shown in the chrome bar. */
		url?: string;
		children: Snippet;
	}

	let { url, children }: Props = $props();
</script>

<!-- Minimal browser chrome for product screenshots. Corner clipping lives
     here — enhanced:img's <picture> is display: contents, so the img behaves
     as a direct child and must be clipped by this wrapper. -->
<div class="panel-swiss overflow-hidden">
	<div class="flex items-center gap-1.5 border-b border-[var(--color-border)] px-3 py-2">
		<span class="frame-dot" aria-hidden="true"></span>
		<span class="frame-dot" aria-hidden="true"></span>
		<span class="frame-dot" aria-hidden="true"></span>
		{#if url}
			<span class="data-swiss text-caption-size ml-2 text-[var(--color-muted)]">{url}</span>
		{/if}
	</div>
	{@render children()}
</div>

<style>
	.frame-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: var(--color-border);
		flex-shrink: 0;
	}
</style>
