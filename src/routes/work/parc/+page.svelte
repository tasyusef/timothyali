<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import BrandSystem from './BrandSystem.svelte';
	import LogoStory from './LogoStory.svelte';
	import World from './World.svelte';
	import Quotes from './Quotes.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Rebranding Pixel Ape Rowboat Club, the 2021 joke about Bored Apes that grew a world: a pixel logo, five colors, a typeface, and an island, live on every surface.';
</script>

<Seo
	title="PARC — Brand & Art Direction"
	{description}
	ogKey="parc"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'PARC — Brand & Art Direction',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-08-01',
		url: `${SITE_URL}/work/parc`,
		image: imageUrl('/images/parc/sign-sky.png', SITE_URL)
	}}
/>

<CaseStudy
	title="PARC"
	category="Brand & Art Direction"
	year="2021–2026"
	role="Cofounder, Brand & Art Direction"
	timeline="Ongoing"
	tools="Illustrator, Python (fontTools)"
	heroImage="/images/parc/sign-sky.png"
	heroAlt="PARC logo: the four-color pixel letters on a white notched sign, floating in a pixel-cloud sky"
	nextProject={getNextProject('parc')}
>
	{#snippet overview()}
		<p class="mb-4">
			Pixel Ape Rowboat Club started in November 2021 as a joke. People were treating pixel apes as
			status symbols, and we thought that was ridiculous. Bored Apes had yachts. Ours had rowboats.
			10,000 pixel apes on the XRP Ledger, no clout included.
		</p>
		<p class="mb-4">
			People stayed anyway. Partly because they believed in the network, mostly because we treated
			the community as the point: we streamed, we did giveaways, they helped us market, and nobody
			on the team was out of reach. Four years later PARC is four collections, a Twitch show, an
			arcade, merch, its own lore, and about 196,000 XRP traded.
		</p>
		<p class="mb-4">
			I cofounded it with xrpl_adam on the build, sloppy on marketing, and stove drawing the apes
			with me. Branding and art direction have been mine throughout. The 2026 rebrand is the brand
			catching up to the community, the world, and the story.
		</p>
		<ul class="space-y-2">
			<li>&mdash; A pixel logo on the apes&rsquo; own grid, with a full logo library</li>
			<li>&mdash; Five colors, one per element</li>
			<li>&mdash; PARC Pixel, a typeface in three weights</li>
			<li>&mdash; Generated backgrounds for every surface</li>
		</ul>
	{/snippet}

	<TextSection title="The World">
		<p>
			The apes were retro from day one. The reference was the Game Boy Advance Pok&eacute;mon games:
			the pixel size, the flat color, a sprite that reads at a glance. The world grew from there:
			islands, rowboats, volcanoes, wooden huts, tropical and unserious. That world is what the
			community actually cares about, and it is what the rebrand had to serve.
		</p>
	</TextSection>

	<World />

	<TextSection title="Same People, Better Brand">
		<p>
			The art was always retro. The logo never was: a cartoon ape with thick outlines and a bubbly
			wordmark, fine on its own and from a different product. In 2026 it was time. The new logo is
			drawn on the same 5&times;5 grid as the apes, on a white sign with notched corners.
		</p>
		<p>
			The hard part wasn&rsquo;t drawing it. The team was attached to the old brand and worried
			people would hate a change, which is what people do with rebrands at first. I asked them to
			trust that this is what I do for a living. It shipped, and the response was the opposite of
			what they feared.
		</p>
	</TextSection>

	<LogoStory />

	<Quotes />

	<BrandSystem />

	<TextSection title="The Typeface">
		<p>
			PARC Pixel was the first thing made after the logo. The four letters became the style guide
			for an alphabet: one-cell strokes, hollow counters, stepped diagonals, every letter five cells
			wide. Three weights, each in square pixels, plus a mono cut for scores and prices. Twenty-nine
			glyphs were finished by hand, the 2 and the at-sign among them, judged in real words at
			reading size. The oar lives on the equals key.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/club-masthead-sky.png',
				alt: 'PARC Pixel 16:9 specimen on the sky colorway: Pixel Ape Rowboat Club set across the three weights'
			},
			{
				type: 'image',
				src: '/images/parc/three-weights-a.png',
				alt: 'PARC Pixel 4:3 specimen on white: the letter A in Bold 700, Regular 400, and Light 300'
			},
			{
				type: 'image',
				src: '/images/parc/anatomy-sheet.png',
				alt: 'PARC Pixel 4:3 specimen on white: the Bold R on its 11 by 11 cell grid'
			},
			{
				type: 'image',
				src: '/images/parc/mono-numerals-sky.png',
				alt: 'PARC Pixel Mono numerals 0 to 9 on the sky colorway'
			},
			{
				type: 'image',
				src: '/images/parc/glyph-grid-green.png',
				alt: 'PARC Pixel Bold: 40 glyphs in a grid, one color per glyph, on the green colorway'
			},
			{
				type: 'image',
				src: '/images/parc/square-ampersand-sky.png',
				alt: 'PARC Pixel Bold ampersand at giant size on the sky colorway'
			}
		]}
	/>

	<TextSection title="In the Wild">
		<p>
			Everything PARC puts out now runs on the system: the site, Discord, X, the Twitch show every
			other Friday, merch, and the arcade. The site is the main event. The hero sign hangs in the
			sky, the collections float on the island, the arcade band is the game&rsquo;s own island with
			live high scores, and After Darc and Discord get their own bands. The stream opens on its own
			starting-soon loop.
			<a href="/work/parc-site" class="hover-swiss underline underline-offset-4"
				>The build is its own case study.</a
			>
		</p>
		<p>
			<a
				href="https://parcxrpl.com"
				target="_blank"
				rel="noopener noreferrer"
				class="label-swiss hover-swiss inline-block underline underline-offset-4"
				>Open parcxrpl.com &rarr;</a
			>
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/site-hero.png',
				alt: 'parcxrpl.com hero: Pixel Ape Rowboat Club on the notched sign over the scatter texture, with the green nav bar'
			},
			{
				type: 'image',
				src: '/images/parc/site-collections.png',
				alt: 'parcxrpl.com collections: PARC, Monkey Phunks, and PARC Customs cards floating on the pixel-cloud sky'
			},
			{
				type: 'image',
				src: '/images/parc/site-arcade.png',
				alt: 'parcxrpl.com arcade band: the Rowboat Racer cover on a CRT and live high scores over the island'
			},
			{
				type: 'image',
				src: '/images/parc/phone-hero.png',
				alt: 'parcxrpl.com hero on a phone'
			},
			{
				type: 'image',
				src: '/images/parc/site-bands.png',
				alt: 'parcxrpl.com After Darc band in Twitch purple and Discord band in blurple'
			},
			{
				type: 'image',
				src: '/images/parc/phone-arcade.png',
				alt: 'parcxrpl.com arcade band on a phone: the Rowboat Racer cover over the island'
			},
			{
				type: 'image',
				src: '/images/parc/site-crew.png',
				alt: 'parcxrpl.com crew row and green footer with the stacked mark'
			}
		]}
	/>

	<Gallery
		items={[
			{
				type: 'video',
				src: '/videos/parc-after-darc-intro.mp4',
				alt: 'PARC After Darc starting-soon screen: a pixel sun over the sea with a rowboat drifting past, looped before the stream'
			},
			{
				type: 'image',
				src: '/images/parc/after-darc-announce.png',
				alt: 'PARC After Darc new-stream graphic: the wordmark over a pixel sunset, Saturday 9pm UTC on Twitch'
			},
			{
				type: 'image',
				src: '/images/parc/after-darc-live.png',
				alt: 'PARC After Darc live-now graphic: the wordmark over a pixel night sky and moon'
			},
			{
				type: 'image',
				src: '/images/parc/after-darc-today.png',
				alt: 'PARC After Darc tonight graphic'
			},
			{
				type: 'image',
				src: '/images/parc/after-darc-reminder.png',
				alt: 'PARC After Darc tomorrow graphic'
			},
			{
				type: 'image',
				src: '/images/parc/twitter-banner.png',
				alt: 'PARC X header: the box logo on the pixel-cloud sky'
			},
			{
				type: 'image',
				src: '/images/parc/larc-teaser.png',
				alt: 'LARC teaser: glitched terminal text on black announcing the next collection'
			}
		]}
	/>

	<ResultsList
		title="Outcome"
		items={[
			'One logo library for both lockups and the oar: black, CMYK, Pantone, and white for print; black, RGB, and white for web',
			'Five colors and one typeface on every surface: site, Discord, X, Twitch, merch, and the arcade',
			'PARC Pixel: 57 characters per weight, three weights, proportional and mono',
			'Four generated backgrounds, one per band of the site, and the game island drawn from its own sprites',
			'Live since September 2026, to a community that is active and growing'
		]}
	/>
</CaseStudy>
