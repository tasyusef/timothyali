<script lang="ts">
	// One row of the PARC brand system: number + title (set in PARC Pixel, in a brand
	// color) on the left, the rule and its live demo on the right.
	import type { Snippet } from 'svelte';

	interface Props {
		n: string;
		title: string;
		color: string;
		children: Snippet;
	}

	let { n, title, color, children }: Props = $props();
</script>

<div
	class="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] py-8 md:grid-cols-12 md:gap-0 md:py-10"
>
	<div class="md:col-span-3">
		<p class="label-swiss data-swiss">Rule {n}</p>
		<h3 class="px-title mt-2" style:color>{title}</h3>
	</div>
	<div class="space-y-5 md:col-span-9 md:col-start-4 lg:col-span-8">
		{@render children()}
	</div>
</div>

<style>
	.px-title {
		font-family: 'PARC Pixel', ui-monospace, monospace;
		font-weight: 700;
		font-size: 1.25rem;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}
</style>
