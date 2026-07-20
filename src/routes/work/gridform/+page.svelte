<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A complete brand system, poster series, and 28-page design philosophy book built around one idea: less noise.';
</script>

<Seo
	title="Studio Gridform — “Less Noise.”"
	{description}
	ogKey="gridform"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Studio Gridform — “Less Noise.”',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2023-01-01',
		url: `${SITE_URL}/work/gridform`,
		image: imageUrl('/images/gridform/Poster_Frame_Mockup_2.png', SITE_URL)
	}}
/>

<CaseStudy
	title="Studio Gridform — “Less Noise.”"
	category="Brand & Art Direction"
	year="2023–2024"
	role="Sole Creator & Designer"
	tools="Illustrator"
	heroImage="/images/gridform/Poster_Frame_Mockup_2.png"
	heroAlt="Studio Gridform Less Noise poster series displayed on outdoor wall"
	nextProject={getNextProject('gridform')}
>
	{#snippet overview()}
		<p>
			Studio Gridform is my design practice, and &ldquo;less noise.&rdquo; is its manifesto. I built
			the entire brand system from scratch — identity, guidelines, stationery, a poster series, and
			a 28-page book explaining the thinking behind it all. Every piece is a demonstration of the
			principles it argues for.
		</p>
	{/snippet}

	<TextSection title="Logo & Icon Mark">
		<p>
			I began with the most essential forms, searching for a relationship between proportion and
			negative space. The &ldquo;G&rdquo; developed a geometric precision, and a grid element in its
			top-right corner completes the lettermark — merging the initial with the structural motif the
			studio is named for.
		</p>
		<p>
			It felt Swiss — clarity, structure, purpose. Gibson SemiBold proved the typographic match: a
			clean geometric sans whose construction mirrors the mark&rsquo;s own.
		</p>
	</TextSection>

	<TextSection title="The Poster Series">
		<p>
			Each poster explores a single geometric primitive — rectangles, circles, triangles — in a
			four-color modernist palette: teal, vermillion, yellow, and forest green on white.
			They&rsquo;re exercises in restraint: how much visual energy can a few flat shapes generate?
		</p>
		<p>
			Every poster carries the same quiet footer — &ldquo;less noise.&rdquo; on the left, the
			Gridform wordmark on the right. The work speaks; the branding stays out of the way.
		</p>
	</TextSection>

	<TextSection title="The Book">
		<p>
			<em>Less Noise.</em> is a 28-page design philosophy book — part manifesto, part process documentation
			— organized around four principles: Design is Problem Solving, Finding a Brand&rsquo;s Voice, Timeless
			Over Trendy, and Inside Out Design.
		</p>
		<p>
			Each principle gets its own spread: the argument set in a strict typographic hierarchy on one
			page, real work shown as evidence on the facing page — the same grid discipline the text is
			arguing for, applied to the page you&rsquo;re reading it on.
		</p>
	</TextSection>

	<TextSection title="Stationery & Print">
		<p>
			The identity extends into a full stationery system. Dark business cards pair the wordmark with
			clean contact information and a QR code. The exterior signboard takes the brand to its most
			minimal expression — just the G mark on a dark square, confident enough to stand alone.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/gridform/Poster_Frame_Mockup_2.png',
				alt: 'Studio Gridform Less Noise poster series displayed on outdoor wall'
			},
			{
				type: 'image',
				src: '/images/gridform/GRIDFORM_BOOK_3.png',
				alt: 'Studio Gridform Less Noise book stack'
			},
			{
				type: 'image',
				src: '/images/gridform/GRIDFORM_BOOK_1.png',
				alt: 'Studio Gridform book — Design is Problem Solving spread'
			},
			{
				type: 'image',
				src: '/images/gridform/GRIDFORM_BOOK_4.png',
				alt: 'Studio Gridform book — Timeless Over Trendy spread featuring First Ledger'
			},
			{
				type: 'image',
				src: '/images/gridform/GRIDFORM_SIGNBOARD.png',
				alt: 'Studio Gridform signboard mockup'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			The manifesto outlived the project. &ldquo;Less noise.&rdquo; codified the design philosophy
			the rest of my practice runs on — the language of this site descends directly from it. Every
			brand system I&rsquo;ve built since has been held to the standard the book set.
		</p>
	</TextSection>
</CaseStudy>
