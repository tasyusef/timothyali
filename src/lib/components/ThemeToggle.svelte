<script lang="ts">
	import { theme } from '$lib/theme.svelte';
</script>

<div class="panel-swiss flex p-0.5" role="group" aria-label="Theme">
	<button
		type="button"
		onclick={() => theme.set('dark')}
		aria-pressed={theme.current === 'dark'}
		aria-label="Dark mode"
		class="segment {theme.current === 'dark' ? 'segment-active' : ''}"
	>
		<svg
			width="14"
			height="14"
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M14 9.5A6.5 6.5 0 0 1 6.5 2 5.5 5.5 0 1 0 14 9.5Z" />
		</svg>
	</button>
	<button
		type="button"
		onclick={() => theme.set('light')}
		aria-pressed={theme.current === 'light'}
		aria-label="Light mode"
		class="segment {theme.current === 'light' ? 'segment-active' : ''}"
	>
		<svg
			width="14"
			height="14"
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
	</button>
</div>

<style>
	.segment {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.45rem;
		border-radius: calc(var(--radius-panel) - 2px);
		color: var(--color-muted);
		transition:
			color var(--duration-fast) var(--ease-swiss),
			background-color var(--duration-fast) var(--ease-swiss);
	}

	.segment-active {
		background: var(--color-border);
		color: var(--color-foreground);
	}
</style>
