<script lang="ts">
	// The PARC world as paper cards on the sky, the way parcxrpl.com shows its
	// collections: the four cycles, then Rowboat Racer's island drawn live from the
	// game's sprite sheet. The cycles are animated WebPs served from static/parc as
	// plain <img>, because the enhanced-img pipeline would flatten them to one frame.
	import { reveal } from '$lib/actions/reveal';
	import IslandScene from './IslandScene.svelte';
	import PxCard from './PxCard.svelte';

	const collections = [
		{ src: '/parc/parc.webp', title: 'PARC', note: '10,000 · Nov 2021', color: 'green' },
		{
			src: '/parc/phunks.webp',
			title: 'Monkey Phunks',
			note: '4,618 · facing the other way',
			color: 'orange'
		},
		{ src: '/parc/customs.webp', title: 'Customs', note: '27 one-of-ones', color: 'blue' },
		{
			src: '/parc/banana.png',
			title: 'Mysterious Bananas',
			note: '4,540 · nobody knows',
			color: 'yellow'
		}
	] as const;
</script>

<div use:reveal class="mb-section">
	<ul class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
		{#each collections as c (c.title)}
			<li>
				<PxCard color={c.color} lift>
					<img
						src={c.src}
						alt="Animated cycle of {c.title} apes"
						class="pixel aspect-square w-full"
						loading="lazy"
						decoding="async"
					/>
					<div class="p-4">
						<p class="title heading-swiss">{c.title}</p>
						<p class="label-swiss data-swiss mt-1 normal-case">{c.note}</p>
					</div>
				</PxCard>
			</li>
		{/each}
	</ul>
	<div class="mt-4 md:mt-6">
		<PxCard color="blue">
			<IslandScene />
			<p class="label-swiss p-4">
				Rowboat Racer&rsquo;s island, drawn live from the game&rsquo;s sprite sheet. The game keeps
				its own colors on purpose.
			</p>
		</PxCard>
	</div>
</div>

<style>
	.pixel {
		image-rendering: pixelated;
		object-fit: cover;
	}
	.title {
		color: var(--card);
		font-size: 0.9375rem;
	}
</style>
