<script lang="ts">
	import type { ProjectStat } from '$lib/projects';

	let { stats }: { stats: ProjectStat[] } = $props();
</script>

<div class="flex h-full shrink-0 items-stretch" role="group" aria-label="Key metrics">
	<div
		class="flex aspect-[3/4] h-full flex-col justify-between border border-[var(--color-border)] px-6 py-5 md:px-8 md:py-6"
	>
		<p class="label-swiss">Key Metrics</p>
		<dl class="flex flex-col gap-4">
			{#each stats as stat (stat.label)}
				<div>
					<dt class="label-swiss">{stat.label}</dt>
					<dd class="heading-swiss">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</div>
</div>
