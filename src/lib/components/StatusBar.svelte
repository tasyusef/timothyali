<script lang="ts">
	import LocalTime from './LocalTime.svelte';
	import CommandKey from './CommandKey.svelte';
</script>

<!-- The footer's availability + status row — the single sitewide contact
     touchpoint (case studies deliberately have no separate contact CTA). -->
<div
	class="py-row grid grid-cols-1 gap-4 border-t border-[var(--color-border)] md:grid-cols-12 md:items-center md:gap-0"
>
	<p class="label-swiss flex items-center gap-2 md:col-span-3">
		<span class="status-dot" aria-hidden="true"></span>
		Open to work
	</p>
	<a
		href="/contact"
		class="label-swiss duration-fast ease-swiss underline underline-offset-4 transition-colors hover:text-[var(--color-foreground)] md:col-span-3 md:col-start-7"
	>
		Get in touch
	</a>
	<div
		class="label-swiss data-swiss flex items-center gap-3 md:col-span-3 md:col-start-10 md:justify-end"
	>
		<span>Denver, CO &middot; <LocalTime seconds={false} /></span>
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
