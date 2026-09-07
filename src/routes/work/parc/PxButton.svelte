<script lang="ts">
	// Port of parcxrpl.com's PxButton: a floating notched face over a dark slab.
	// Rest: face sits --d above the base. Hover: face rises. Press: face drops flush.
	// Motion in hard steps. Colors come from the PARC theme's --parc-* variables.
	import type { Snippet } from 'svelte';

	let {
		href,
		color = 'green',
		external = false,
		children
	}: {
		href: string;
		color?: 'green' | 'orange' | 'blue' | 'yellow';
		external?: boolean;
		children: Snippet;
	} = $props();
</script>

<a
	{href}
	class="pxbtn {color}"
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
>
	<span class="base" aria-hidden="true"></span>
	<span class="face"><span class="in">{@render children()}</span></span>
</a>

<style>
	.pxbtn {
		--d: 4px;
		--n: 6px;
		position: relative;
		display: inline-block;
		margin-top: 7px;
		padding: 0;
		border: 0;
		background: none;
		color: var(--label, #ffffff);
		font-family: var(--font-sans);
		font-weight: 400;
		font-size: 0.875rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
	}
	.base {
		position: absolute;
		inset: 0;
		background: var(--dark);
		clip-path: var(--pix);
	}
	.face {
		position: relative;
		display: block;
		background: var(--facebg);
		clip-path: var(--pix);
		transform: translateY(calc(-1 * var(--d)));
		transition: transform 0.07s steps(2, end);
	}
	.in {
		position: relative;
		z-index: 1;
		display: block;
		padding: calc(var(--parc-cell) * 1.5) calc(var(--parc-cell) * 3);
	}
	.pxbtn:hover {
		--d: 7px;
	}
	.face::before,
	.face::after {
		content: '';
		position: absolute;
		display: none;
		pointer-events: none;
	}
	/* hover ring: a one-cell notched frame at the face edge in the light shade */
	.pxbtn:hover .face::before {
		display: block;
		inset: 0;
		background: var(--hi);
		clip-path: var(--pix);
	}
	.pxbtn:hover .face::after {
		display: block;
		inset: var(--n);
		background: var(--facebg);
		clip-path: var(--pix);
	}
	.pxbtn:active {
		--d: 0px;
	}

	.green {
		--facebg: var(--parc-green);
		--dark: var(--parc-green-dark);
		--hi: var(--parc-green-hi);
	}
	.orange {
		--facebg: var(--parc-orange);
		--dark: var(--parc-orange-dark);
		--hi: var(--parc-orange-hi);
	}
	.blue {
		--facebg: var(--parc-blue);
		--dark: var(--parc-blue-dark);
		--hi: var(--parc-blue-hi);
	}
	.yellow {
		--facebg: var(--parc-yellow);
		--dark: var(--parc-yellow-dark);
		--hi: var(--parc-yellow-hi);
		--label: var(--parc-green);
	}

	@media (prefers-reduced-motion: reduce) {
		.face {
			transition: none;
		}
	}
</style>
