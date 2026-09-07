<script lang="ts">
	// Full-bleed color band in the PARC site's rhythm. Lives inside the case study's
	// padded body, so it pulls itself out to the viewport edge and pads back in.
	// `sky` carries the site's two drifting cloud layers; `green` flips the text
	// tokens to white (see parc-theme.css). `flush` drops the bottom margin so the
	// last band runs straight into the next-project row and the footer.
	import type { Snippet } from 'svelte';

	let {
		tone,
		flush = false,
		children
	}: { tone: 'sky' | 'green'; flush?: boolean; children: Snippet } = $props();
</script>

<section class="parc-band {tone}" class:flush>
	{#if tone === 'sky'}
		<div class="clouds ca" aria-hidden="true"></div>
		<div class="clouds cb" aria-hidden="true"></div>
	{/if}
	<div class="inner">
		{@render children()}
	</div>
</section>

<style>
	.parc-band {
		position: relative;
		overflow: hidden;
		margin-inline: calc(-1 * var(--spacing-section));
		margin-bottom: 8vh;
		padding: calc(var(--parc-cell) * 8) var(--spacing-section);
	}
	@media (min-width: 768px) {
		.parc-band {
			margin-bottom: 12vh;
		}
	}
	.parc-band.flush {
		margin-bottom: 0;
	}
	.sky {
		background: var(--parc-sky);
	}
	.green {
		background: var(--parc-green);
	}
	.inner {
		position: relative;
		z-index: 1;
	}
	/* inner blocks keep their own bottom margins; the band pads the end itself */
	.inner > :global(:last-child) {
		margin-bottom: 0;
	}
	.clouds {
		position: absolute;
		inset: 0;
		z-index: 0;
		background: url('/parc/clouds-tile.png');
		pointer-events: none;
	}
	.clouds.ca {
		background-size: 576px 384px;
		animation: drift-a 90s steps(96, end) infinite;
	}
	.clouds.cb {
		background-size: 864px 576px;
		background-position: 300px 180px;
		opacity: 0.6;
		animation: drift-b 150s steps(96, end) infinite;
	}
	@keyframes drift-a {
		to {
			background-position: 576px 0;
		}
	}
	@keyframes drift-b {
		to {
			background-position: 1164px 180px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.clouds {
			animation: none;
		}
	}
</style>
