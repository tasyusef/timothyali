<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A cross-platform desktop app for brand handoff: logo packages, color tokens, and type specimens. Designed and built solo.';
</script>

<Seo
	title="GRIDFORM Studio — Product & Code"
	{description}
	ogKey="gridform-studio"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'GRIDFORM Studio — Product & Code',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-01-01',
		url: `${SITE_URL}/work/gridform-studio`,
		image: imageUrl('/images/gridform-studio/lockup-outputs.png', SITE_URL)
	}}
/>

<CaseStudy
	title="GRIDFORM Studio"
	category="Product, Code & Tooling"
	year="2026"
	role="Designer & Developer (sole creator)"
	tools="Electron, Svelte 5, TypeScript, Vite, Swift (parity reference)"
	heroImage="/images/gridform-studio/lockup-outputs.png"
	heroAlt="GRIDFORM Studio Lockup tool: a logo loaded with web, print, color, and size output toggles"
	nextProject={getNextProject('gridform-studio')}
>
	{#snippet overview()}
		<p class="mb-4">
			A desktop app for the last step of brand work: turning finished design into the files a client
			can actually use. Three tools behind one quiet shell, built under the GRIDFORM banner.
		</p>
		<ul class="space-y-2">
			<li>— Lockup: logo SVGs in, a complete organized print + web package out</li>
			<li>— Palette: colors in, CSS/SCSS variables, design tokens, and swatches out</li>
			<li>— Specimen: fonts in, brand type sheets and classic specimens out</li>
			<li>— Fully offline: no account, no cloud, no tracking</li>
		</ul>
	{/snippet}

	<TextSection title="Why It Exists">
		<p>
			Every identity project ends the same way: hand-assembling a logo package. Export each
			variation in color, black, and white; in three sizes; for web and for print; name every file
			so the client can find things; write a README nobody budgets time for. It is an afternoon of
			error-prone busywork at the exact moment the creative work is done, and every studio does it
			slightly differently every time.
		</p>
		<p>
			GRIDFORM Studio turns that afternoon into a minute. Drop one SVG per logo variation, toggle
			the outputs you want, and review the exact folder tree — down to every filename — before a
			single file is written. Print files carry real Pantone spot colors when you name them, so the
			PDFs and EPSs open in Illustrator as true spot swatches, not CMYK approximations.
		</p>
	</TextSection>

	<TextSection title="The Product">
		<p>
			The shell follows the studio&rsquo;s own philosophy: less noise. A black ground, one sidebar,
			and a wizard that moves in three steps — import, outputs, review. Palette pulls exact fills
			from an SVG or eyedrops any image, then exports the same colors as CSS and SCSS variables,
			design-tokens JSON for Figma, Adobe ASE swatches, and a printable swatch sheet with HEX, CMYK,
			and Pantone for every color. Specimen builds a brand typography page from your own styles, or
			a classic specimen with character set, weight waterfall, and size ladder, with a live preview
			as you work.
		</p>
		<p>
			Every project saves to a home grid, so when the brand changes you reopen it and export again.
			Nothing leaves the machine: the app never connects to the internet.
		</p>
	</TextSection>

	<ResultsList
		title="Engineering"
		items={[
			'Started life as a native Swift/SwiftUI macOS app, then pivoted to Electron + Svelte 5 to ship on macOS, Windows, and Linux',
			'The entire vector engine was ported from Swift to TypeScript with byte-identical output, proven against shared golden fixtures',
			'All 90 web SVGs and all 56 print PDFs/EPSs regenerate byte-for-byte — including the Pantone separation colorspaces',
			'The export plan matches the shipped 187-file and 153-file package manifests file-for-file',
			'The Swift sources stay in the repo as the parity reference and executable spec for the port',
			'Headless end-to-end verification: the app regenerates both golden fixture packages in CI and every output must match'
		]}
	/>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/gridform-studio/lockup-review.png',
				alt: 'GRIDFORM Studio Lockup export review: the full deliverable folder tree before export'
			},
			{
				type: 'image',
				src: '/images/gridform-studio/palette.png',
				alt: 'GRIDFORM Studio Palette tool: poster artwork with extracted swatches and token export formats'
			},
			{
				type: 'image',
				src: '/images/gridform-studio/specimen.png',
				alt: 'GRIDFORM Studio Specimen tool: brand typography sheet with live display, heading, and body styles'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			The tool that started as a way to stop hand-assembling GRIDFORM&rsquo;s own deliverables
			became a product: a cross-platform studio that packages for the Mac App Store and ships
			installers for Windows and Linux. It is the studio&rsquo;s design philosophy applied to its
			own workflow — the noise removed from the last mile of brand work.
		</p>
	</TextSection>
</CaseStudy>
