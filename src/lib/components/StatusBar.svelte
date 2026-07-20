<script lang="ts">
	import LocalTime from './LocalTime.svelte';
	import CommandKey from './CommandKey.svelte';
</script>

<div
	class="py-row grid grid-cols-1 gap-4 border-t border-[var(--color-border)] md:grid-cols-12 md:items-center md:gap-0"
>
	<p class="label-swiss flex items-center gap-2 md:col-span-3">
		<span class="status-dot" aria-hidden="true"></span>
		Open to work
	</p>
	<p class="label-swiss data-swiss md:col-span-3 md:col-start-7">
		Denver, CO &middot; <LocalTime />
	</p>
	<div class="flex md:col-span-1 md:col-start-12 md:justify-end">
		<CommandKey />
	</div>
</div>

<style>
	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: var(--color-foreground);
		animation: status-pulse 2.4s var(--ease-swiss) infinite;
	}

	@keyframes status-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.status-dot {
			animation: none;
		}
	}
</style>
