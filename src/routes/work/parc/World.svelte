<script lang="ts">
	// The PARC world: the four collections as the site shows them, then Rowboat Racer's
	// island drawn live from the game's sprite sheet. The collection cycles are animated
	// WebPs served from static/parc as plain <img>, because the enhanced-img pipeline
	// would flatten them to one frame.
	import { reveal } from '$lib/actions/reveal';
	import IslandScene from './IslandScene.svelte';

	const collections = [
		{ src: '/parc/parc.webp', title: 'PARC', note: '10,000 · Nov 2021' },
		{ src: '/parc/phunks.webp', title: 'Monkey Phunks', note: '4,618 · facing the other way' },
		{ src: '/parc/customs.webp', title: 'Customs', note: '27 one-of-ones' },
		{ src: '/parc/banana.png', title: 'Mysterious Bananas', note: '4,540 · nobody knows' }
	];
</script>

<div use:reveal class="mb-section space-y-1">
	<ul class="gap-gallery grid grid-cols-2 md:grid-cols-4">
		{#each collections as c (c.title)}
			<li>
				<img
					src={c.src}
					alt="Animated cycle of {c.title} apes"
					class="pixel aspect-square w-full"
					loading="lazy"
					decoding="async"
				/>
				<p class="label-swiss mt-3">{c.title}</p>
				<p class="label-swiss data-swiss mt-1 normal-case">{c.note}</p>
			</li>
		{/each}
	</ul>
	<div class="mt-8">
		<IslandScene />
		<p class="label-swiss mt-3">
			Rowboat Racer&rsquo;s island, drawn live from the game&rsquo;s sprite sheet. The game keeps
			its own colors on purpose.
		</p>
	</div>
</div>

<style>
	.pixel {
		image-rendering: pixelated;
		object-fit: cover;
	}
</style>
