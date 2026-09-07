<script lang="ts">
	// Port of parcxrpl.com's CollectionCard shell: a notched paper face over a dark
	// slab in one of the four brand colors. What goes on the face is up to the caller;
	// `--card` carries the card's ink color (yellow cards write in yellow-dark, since
	// yellow never sets type on paper). `lift` adds the site's hover rise.
	import type { Snippet } from 'svelte';

	let {
		color = 'green',
		lift = false,
		children
	}: {
		color?: 'green' | 'orange' | 'blue' | 'yellow';
		lift?: boolean;
		children: Snippet;
	} = $props();
</script>

<div class="card {color}" class:lift>
	<div class="face">{@render children()}</div>
</div>

<style>
	.card {
		--n: 10px;
		position: relative;
		z-index: 0;
		height: 100%;
	}
	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		transform: translateY(var(--d));
		background: var(--dark);
		clip-path: var(--pix);
	}
	.face {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--parc-paper);
		clip-path: var(--pix);
		transition: transform 0.07s steps(2, end);
	}
	.lift:hover .face {
		transform: translateY(calc(var(--d) * -0.5));
	}
	.green {
		--card: var(--parc-green);
		--dark: var(--parc-green-dark);
	}
	.orange {
		--card: var(--parc-orange);
		--dark: var(--parc-orange-dark);
	}
	.blue {
		--card: var(--parc-blue);
		--dark: var(--parc-blue-dark);
	}
	.yellow {
		--card: var(--parc-yellow-dark);
		--dark: var(--parc-yellow-dark);
	}
	@media (prefers-reduced-motion: reduce) {
		.face {
			transition: none;
		}
	}
</style>
