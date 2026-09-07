<script lang="ts">
	// Full-bleed green band in the PARC site's rhythm, for the sections that leave the
	// sky. Lives inside the case study's padded body, so it pulls itself out to the
	// viewport edge and pads back in. Text tokens flip to white in parc-theme.css.
	// `flush` drops the bottom margin so the closing band runs straight into the
	// next-project row and the footer.
	import type { Snippet } from 'svelte';

	let { flush = false, children }: { flush?: boolean; children: Snippet } = $props();
</script>

<section class="parc-band green" class:flush>
	<div class="inner">
		{@render children()}
	</div>
</section>

<style>
	.parc-band {
		position: relative;
		margin-inline: calc(-1 * var(--spacing-section));
		margin-bottom: 8vh;
		padding: calc(var(--parc-cell) * 8) var(--spacing-section);
		background: var(--parc-green);
	}
	@media (min-width: 768px) {
		.parc-band {
			margin-bottom: 12vh;
		}
	}
	.parc-band.flush {
		margin-bottom: 0;
	}
	/* inner blocks keep their own bottom margins; the band pads the end itself */
	.inner > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
