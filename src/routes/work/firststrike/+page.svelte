<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Brand identity for FirstStrike Research, a veteran-owned financial research company — wordmark, color system, typography, and guidelines built from a rough mood board.';
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
	category="Brand Identity"
	year="2025"
	role="Brand Designer (sole designer)"
	timeline="~1 month"
	tools="Illustrator, Figma"
	heroImage="/images/firststrike/hero.png"
	heroAlt="FirstStrike Research brand identity"
	nextProject={getNextProject('firststrike')}
>
	{#snippet overview()}
		<p class="mb-4">
			FirstStrike Research is a veteran-owned financial research company covering American markets.
			A one-month brand commission — logo, color, typography, and guidelines built from a rough mood
			board into a system credible enough for finance.
		</p>
		<ul class="space-y-2">
			<li>— Full identity: wordmark, lockups, color system, type, guidelines</li>
			<li>— Signature gradient-plus-grain treatment for digital surfaces</li>
			<li>— Collateral from business cards to billboards</li>
		</ul>
	{/snippet}

	<TextSection title="The Brief">
		<p>
			In financial media, trust is the product. The brand had to hold its own next to legacy
			research outlets while signaling everything they aren&rsquo;t: independent, direct, and fast.
			The client&rsquo;s military background set the tone — first strike, first mover — and a rough
			mood board pointed at retro print media. My job was to turn that instinct into a system
			credible enough for finance.
		</p>
	</TextSection>

	<TextSection title="Logo & Wordmark">
		<p>
			The wordmark is set in heavy italic type. The forward lean gives it momentum — the urgency of
			a market that doesn&rsquo;t wait — while the weight keeps it planted and serious. The defining
			element is the halftone dot-matrix pattern trailing off the &ldquo;F&rdquo;: a nod to
			newsprint and retro media that reads as impact radiating outward from the name.
		</p>
		<p>
			The system ships in three configurations — horizontal for headers, stacked for tight spaces,
			and a standalone icon for favicons and avatars — each specified for both light and dark
			backgrounds, so the mark never has to be improvised in context.
		</p>
	</TextSection>

	<TextSection title="Color & Type">
		<p>
			Electric Blue (#003DFF) anchors the entire brand — bold enough to stand out in financial
			media, serious enough to carry authority. It&rsquo;s paired with Midnight Black for text and
			Ice White for secondary surfaces, and backed by three accents — Soft Mint, Signal Coral, and
			Amber Pulse — tuned for data visualization and digital surfaces. Typography is Helvetica in
			two weights — Heavy for headlines that hit, Medium for everything that has to be read.
		</p>
	</TextSection>

	<TextSection title="The Signature Look">
		<p>
			The brand&rsquo;s most recognizable treatment is gradient-plus-grain: a deep blue-to-cyan
			gradient overlaid with subtle noise. It gives digital surfaces a tactile, almost printed
			quality — the retro personality made literal — without tipping into pastiche. One treatment,
			endlessly reusable: social cards, billboards, editorial layouts.
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
				alt: 'Mission statement — veteran-owned financial research company'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-03.png',
				alt: 'Billboard mockup — Real News. Real Research. Real Insights.'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-04.png',
				alt: 'Brand pillars — Retro. Strong. Versatile.'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-05.png',
				alt: 'FirstStrike Research primary logo lockup — horizontal wordmark'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-06.png',
				alt: 'FirstStrike Research secondary logo lockup — stacked wordmark'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-07.png',
				alt: 'FirstStrike Research logo construction on blue grid'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-08.png',
				alt: 'Color system — Electric Blue, Soft Mint, Signal Coral, Amber Pulse'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-09.png',
				alt: 'FirstStrike Research business card mockup on concrete'
			},
			{
				type: 'image',
				src: '/images/firststrike/firststrike_pres-10.png',
				alt: 'FirstStrike Research typography system — Helvetica Heavy and Medium'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			FirstStrike launched with one coherent system across every touchpoint the company shows the
			world — wordmark, color, type, the gradient-plus-grain signature, and guidelines complete
			enough that the brand never has to be improvised in context. A rough mood board became an
			identity that holds its own next to legacy research outlets while looking like none of them.
		</p>
	</TextSection>
</CaseStudy>
