<script lang="ts">
	import { NAV_LINKS, NAV_LINK_COLUMNS } from '$lib/nav';
	import StatusBar from './StatusBar.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="px-swiss pb-8">
	<StatusBar />
	<div class="border-t border-[var(--color-border)] py-8">
		<!-- Desktop -->
		<div class="hidden items-center md:grid md:grid-cols-12">
			<div class="md:col-span-3">
				<p class="label-swiss text-[var(--color-foreground)]">Timothy Ali</p>
			</div>
			{#each NAV_LINKS as link, i (link.href)}
				<a href={link.href} class="label-swiss hover-swiss {NAV_LINK_COLUMNS[i]} md:col-span-1">
					{link.label}
				</a>
			{/each}
			<div class="flex justify-end md:col-span-1 md:col-start-12">
				<span class="label-swiss data-swiss">&copy; {year}</span>
			</div>
		</div>

		<!-- Mobile -->
		<div class="flex flex-col gap-4 md:hidden">
			<div class="flex items-center justify-between">
				<p class="label-swiss text-[var(--color-foreground)]">Timothy Ali</p>
				<div class="flex flex-wrap items-center gap-4">
					{#each NAV_LINKS as link (link.href)}
						<a href={link.href} class="label-swiss hover-swiss">{link.label}</a>
					{/each}
				</div>
			</div>
			<div class="flex justify-end">
				<span class="label-swiss data-swiss">&copy; {year}</span>
			</div>
		</div>
	</div>
</footer>
