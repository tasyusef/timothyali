<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A bold, two-color title sequence for Philip K. Dick’s “Do Androids Dream of Electric Sheep?”: Saul Bass instead of Blade Runner.';
</script>

<Seo
	title="Do Androids Dream? — Motion Design"
	{description}
	ogKey="do-androids-dream"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Do Androids Dream? — Motion Design',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2023-01-01',
		url: `${SITE_URL}/work/do-androids-dream`,
		image: imageUrl('/images/do-androids-dream/hero.jpg', SITE_URL)
	}}
/>

<CaseStudy
	title="Do Androids Dream?"
	category="Motion & Art Direction"
	year="2023"
	role="Director, Designer, Animator"
	tools="After Effects, Illustrator"
	nextProject={getNextProject('do-androids-dream')}
>
	{#snippet overview()}
		<p>
			A title sequence for Philip K. Dick&rsquo;s <em>Do Androids Dream of Electric Sheep?</em>, the
			novel that inspired Blade Runner. Everyone expects the dark, rain-soaked look. I went the
			other way: a stark, high-contrast yellow-and-black graphic style closer to Saul Bass than
			Ridley Scott.
		</p>
	{/snippet}

	<TextSection title="The Concept">
		<p>
			What does this story look like with the atmosphere stripped away, cut down to its plainest
			graphic elements? That question drove every decision in the sequence.
		</p>
		<p>
			The answer was a two-color world: bright yellow and deep black, nothing else. The yellow is
			the artificial, the synthetic, the electric; the black is the void. Together they make a world
			at once stark and overwhelming, and the narrow palette forces the eye onto what&rsquo;s left:
			shape, movement, composition.
		</p>
	</TextSection>

	<TextSection title="Visual Language">
		<p>
			The sequence centers on a dystopian skyline: a jagged silhouette of towers and industrial
			structures drawn as flat black vector shapes against the yellow sky. Against that mass stands
			a lone silhouetted figure, the emotional core of the piece: one person dwarfed by the built
			environment.
		</p>
		<p>
			Subtle chromatic aberration flickers at the edges of the vector shapes throughout: a hint of
			electronic interference that leaves the world slightly misaligned, as if seen through a
			synthetic lens. It&rsquo;s the only effect in the piece, which is why it registers.
		</p>
	</TextSection>

	<TextSection title="Motion & Pacing">
		<p>
			Three acts in forty-five seconds. Act one: the title builds word by word on a flat yellow
			field. Act two: the cityscape enters and the credits play against it. Act three: the
			perspective breaks, and the camera pulls into the city along a converging road as the sun
			rises and beams radiate outward.
		</p>
		<p>
			The anti–Blade Runner look is itself the statement: source material this rich deserves more
			than one visual reading.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'video',
				src: '/videos/DO_ANDROIDS_DREAM_-_Title_Sequence.mp4',
				alt: 'Do Androids Dream title sequence'
			}
		]}
	/>
</CaseStudy>
