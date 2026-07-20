<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Brand identity for FirstStrike Research, a veteran-owned financial research company: wordmark, color system, typography, and full brand guidelines.';
</script>

<Seo
	title="FirstStrike Research — Brand Identity"
	{description}
	ogKey="firststrike"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'FirstStrike Research — Brand Identity',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2025-01-01',
		url: `${SITE_URL}/work/firststrike`,
		image: imageUrl('/images/firststrike/hero.png', SITE_URL)
	}}
/>

<CaseStudy
	title="FirstStrike Research"
	category="Brand & Art Direction"
	year="2025"
	role="Sole Brand Designer"
	timeline="~1 month"
	tools="Illustrator, Figma"
	heroImage="/images/firststrike/hero.png"
	heroAlt="FirstStrike Research brand identity"
	nextProject={getNextProject('firststrike')}
>
	{#snippet overview()}
		<p class="mb-4">
			FirstStrike Research is a veteran-owned financial research company covering American markets.
			A one-month brand commission: logo, color, typography, and guidelines, delivered as one
			documented system.
		</p>
		<ul class="space-y-2">
			<li>— Full identity: wordmark, lockups, color system, type, guidelines</li>
			<li>— Signature gradient-plus-grain treatment for digital surfaces</li>
			<li>— Collateral from business cards to billboards</li>
		</ul>
	{/snippet}

	<TextSection title="The Brief">
		<p>
			In financial media, trust is the product. The brand had to stand next to legacy research
			outlets while signaling everything they aren&rsquo;t: independent, direct, and fast. The
			client&rsquo;s military background set the tone: first strike, first mover. A rough mood board
			pointed at retro print media. My job was to turn that instinct into a system serious enough
			for finance.
		</p>
	</TextSection>

	<TextSection title="Logo & Wordmark">
		<p>
			I set the wordmark in heavy italic type. The forward lean gives it motion; the weight keeps it
			serious. The defining element is the halftone dot-matrix pattern trailing off the
			&ldquo;F&rdquo;. It recalls newsprint and reads as impact spreading from the name.
		</p>
		<p>
			The logo comes in three forms: horizontal for headers, stacked for tight spaces, and a
			standalone icon for favicons and avatars. I specified each for light and dark backgrounds, so
			placement is a lookup, not a judgment call.
		</p>
	</TextSection>

	<TextSection title="Color & Type">
		<p>
			Electric Blue (#003DFF) anchors the brand: bold enough to stand out in financial media, heavy
			enough to carry authority. Midnight Black handles text, Ice White the secondary surfaces.
			Three accents, Soft Mint, Signal Coral, and Amber Pulse, cover data visualization and digital
			surfaces. Typography is Helvetica in two weights: Heavy for headlines, Medium for everything
			meant to be read.
		</p>
	</TextSection>

	<TextSection title="The Signature Look">
		<p>
			The brand&rsquo;s most recognizable treatment is gradient-plus-grain: a deep blue-to-cyan
			gradient overlaid with subtle noise. It gives digital surfaces a printed, tactile quality
			without slipping into pastiche. One treatment, three surfaces on day one: social cards,
			billboards, editorial layouts.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/firststrike/hero.png',
				alt: 'FirstStrike Research brand identity'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-02.png',
				alt: 'FirstStrike Research mission statement: veteran-owned financial research company'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-03.png',
				alt: 'FirstStrike Research billboard mockup: Real News. Real Research. Real Insights.'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-04.png',
				alt: 'FirstStrike Research brand pillars: Retro. Strong. Versatile.'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-05.png',
				alt: 'FirstStrike Research primary logo lockup, horizontal wordmark'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-06.png',
				alt: 'FirstStrike Research secondary logo lockup, stacked wordmark'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-07.png',
				alt: 'FirstStrike Research logo construction on blue grid'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-08.png',
				alt: 'Color system: Electric Blue, Soft Mint, Signal Coral, Amber Pulse'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-09.png',
				alt: 'FirstStrike Research business card mockup on concrete'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-10.png',
				alt: 'FirstStrike Research typography system: Helvetica Heavy and Medium'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			FirstStrike launched with the full system in hand: wordmark, color, type, the
			gradient-plus-grain signature, and guidelines detailed enough that no one has to improvise the
			brand. The rules run from business card to billboard: every surface the company touches draws
			from the same set.
		</p>
	</TextSection>
</CaseStudy>
