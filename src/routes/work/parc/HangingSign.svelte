<script lang="ts">
	// Port of parcxrpl.com's HangingSign: a wooden plank on two ropes carrying the
	// page title. Here it is the case study's h1. Wood and rope colors are the
	// site's own (product values, not site tokens).
	let { title, hint = '' }: { title: string; hint?: string } = $props();
</script>

<div class="titlehang">
	<div class="titlesign">
		<h1 class="heading-swiss">{title}</h1>
		{#if hint}
			<p class="hint">{hint}</p>
		{/if}
	</div>
</div>

<style>
	.titlehang {
		--sign-drop: 60px;
		position: relative;
		display: inline-block;
		margin-top: var(--sign-drop);
	}
	/* ropes live on the unclipped wrapper so the sign's clip-path can't eat them */
	.titlehang::before,
	.titlehang::after {
		content: '';
		position: absolute;
		top: calc(-1 * var(--sign-drop));
		height: calc(var(--sign-drop) + 6px);
		width: 6px;
		background: repeating-linear-gradient(#a9835a 0 6px, #8a6a45 6px 12px);
	}
	.titlehang::before {
		left: 18%;
	}
	.titlehang::after {
		right: 18%;
	}
	.titlesign {
		--n: 6px;
		position: relative;
		z-index: 0;
		padding: calc(var(--parc-cell) * 2) calc(var(--parc-cell) * 3.5) calc(var(--parc-cell) * 1.5);
	}
	/* plank face and its hard shadow, both notched, both behind the text */
	.titlesign::before,
	.titlesign::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		clip-path: var(--pix);
	}
	.titlesign::before {
		transform: translate(5px, 6px);
		background: rgb(0 0 0 / 0.25);
	}
	.titlesign::after {
		background: linear-gradient(#8a6f4e 0 6px, #64503a 6px 100%);
	}
	h1 {
		margin: 0;
		color: var(--parc-yellow);
		font-size: clamp(1.75rem, 3.5vw, 2.5rem);
		line-height: 1.15;
	}
	.hint {
		margin: calc(var(--parc-cell) * 1.25) 0 0;
		color: #e8e2d2;
		font-family: var(--font-sans);
		font-size: 0.8125rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		max-width: 44ch;
	}
</style>
