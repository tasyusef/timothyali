<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	let { items, title = 'Results' }: { items: string[]; title?: string } = $props();
</script>

<div use:reveal class="mb-section">
	<div
		class="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] pt-6 md:grid-cols-12 md:gap-0"
	>
		<h2 class="label-swiss md:col-span-3">{title}</h2>
		<ul class="space-y-3 md:col-span-5 md:col-start-7">
			{#each items as item (item)}
				<li class="flex items-start gap-3">
					<span class="bullet-swiss" aria-hidden="true"></span>
					<span>{item}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
