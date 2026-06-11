<script lang="ts">
	import { theme } from '$lib/theme.svelte';
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	aria-label={theme.current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	class="label-swiss hover-swiss p-2"
>
	{#if theme.current === 'dark'}
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="8" cy="8" r="3.5" />
			<line x1="8" y1="1" x2="8" y2="2.5" />
			<line x1="8" y1="13.5" x2="8" y2="15" />
			<line x1="1" y1="8" x2="2.5" y2="8" />
			<line x1="13.5" y1="8" x2="15" y2="8" />
			<line x1="3.05" y1="3.05" x2="4.1" y2="4.1" />
			<line x1="11.9" y1="11.9" x2="12.95" y2="12.95" />
			<line x1="3.05" y1="12.95" x2="4.1" y2="11.9" />
			<line x1="11.9" y1="4.1" x2="12.95" y2="3.05" />
		</svg>
	{:else}
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M14 9.5A6.5 6.5 0 0 1 6.5 2 5.5 5.5 0 1 0 14 9.5Z" />
		</svg>
	{/if}
</button>
