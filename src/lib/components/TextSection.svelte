<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div use:reveal class="mb-section">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-0">
		{#if title}
			<h2 class="label-swiss md:col-span-3">{title}</h2>
		{/if}
		<div class="leading-body space-y-4 md:col-span-5 md:col-start-7">
			{@render children()}
		</div>
	</div>
</div>
