<script lang="ts">
	import { HOME_LAYOUTS, HOME_LAYOUT_STORAGE_KEY, type HomeLayout } from './homeLayout';

	let { layout = $bindable() }: { layout: HomeLayout } = $props();

	$effect(() => {
		const saved = localStorage.getItem(HOME_LAYOUT_STORAGE_KEY);
		if (HOME_LAYOUTS.some((l) => l.id === saved)) layout = saved as HomeLayout;
	});

	$effect(() => {
		localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, layout);
	});
</script>

<div
	role="group"
	aria-label="Homepage layout switcher (dev only)"
	class="panel-swiss fixed bottom-6 left-6 z-50 flex items-center gap-1 p-1"
>
	{#each HOME_LAYOUTS as l (l.id)}
		<button
			type="button"
			aria-pressed={layout === l.id}
			onclick={() => (layout = l.id)}
			class="label-swiss hover-swiss cursor-pointer px-3 py-2 {layout === l.id
				? 'text-[var(--color-foreground)]'
				: ''}"
		>
			{l.label}
		</button>
	{/each}
</div>
