<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import BrandSystem from './BrandSystem.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'Rebranding Pixel Ape Rowboat Club, a parody of Bored Apes and CryptoPunks that grew a community: logo, palette, world, and a pixel typeface, all from one 5×5 grid.';
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
	role="Cofounder, Brand & Type Designer"
	timeline="Ongoing"
	tools="Illustrator, Python (fontTools)"
	heroImage="/images/parc/sign-sky.png"
	heroAlt="PARC logo: the four-color pixel letters on a white notched sign, floating in a pixel-cloud sky"
	nextProject={getNextProject('parc')}
>
	{#snippet overview()}
		<p class="mb-4">
			Pixel Ape Rowboat Club started in November 2021 as a joke about Bored Apes and CryptoPunks:
			10,000 pixel apes in rowboats on the XRP Ledger. People stayed. Four years later and PARC has
			grown into four collections, the $OAR token, a Twitch show, an arcade, merch, its own lore,
			and about 196,000 XRP traded. I cofounded it and have drawn everything it puts out since. The
			2026 rebrand is an effort to give PARC a proper logo, a palette, a world, and a typeface.
		</p>
		<ul class="space-y-2">
			<li>&mdash; The box logo, its stacked mark, and a print and web logo library</li>
			<li>&mdash; Five colors, one per element</li>
			<li>&mdash; A pixel world of sky, clouds, and island for every surface</li>
			<li>&mdash; PARC Pixel: a typeface in three weights, grown from the four letters</li>
		</ul>
	{/snippet}

	<TextSection title="Old Logo, New Logo">
		<p>
			The first logo was a cartoon: an ape&rsquo;s head with a big grin, thick black outlines, and a
			bubbly PARC wordmark tilted across the top. On its own it was fine. Next to the actual art it
			was the wrong brand. The apes are pixel art, and the logo looked like it belonged to a
			different product.
		</p>
		<p>
			So the rebrand embraces the pixel. The new logo is the four letters drawn on the same
			5&times;5 grid as the apes, on a white sign with notched corners, so the brand and the art are
			one thing. It is also built properly: each master is merged paths instead of 266 stacked
			squares, so it stays sharp at any size. The four-color letters belong to the logo alone. A
			stacked version is the profile picture, and a single oar on the same sign is the secondary
			mark, the favicon, and the equals key in the typeface.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/old-mascot.png',
				alt: 'The old PARC logo: a cartoon ape head with a wide grin and thick outlines, a bubbly PARC wordmark across the top'
			},
			{
				type: 'image',
				src: '/images/parc/old-wordmark.png',
				alt: 'The old PARC secondary logo: the bubbly outlined PARC wordmark in black'
			}
		]}
	/>

	<TextSection title="One Rule">
		<p>
			The brief for the first type specimen was one line: one color per block of text, no
			alternating letters. That turned out to be the whole rebrand. The pixel was never the problem
			with 2021 NFT branding; everything happening at once was. Five colors, one per element, on a
			grid that decides every margin and corner. Still not serious. Just neater.
		</p>
		<p>
			The colors live in a small world: sky and clouds as the default ground, the island where the
			club lives, dark green for type-led surfaces. The brand sheet below is the rule and what
			follows from it, set live in the real fonts and marks.
		</p>
	</TextSection>

	<BrandSystem />

	<TextSection title="Four Letters Become an Alphabet">
		<p>
			The P, A, R and C were treated as the style guide: one-cell strokes, hollow counters, a
			one-cell inset wherever a curve would be, diagonals stepped cell by cell. The rest of
			A&ndash;Z, the digits, and punctuation were drawn to those rules. Every letter is five cells
			wide, so the face is extended and monospaced by nature, and a strict mono cut followed for
			countdowns, prices, and scoreboards. Caps only, one color, every glyph a single merged path.
		</p>
	</TextSection>

	<TextSection title="Three Weights">
		<p>
			On a pixel grid, weight is stroke cells over cap-height cells: Light is 1/9, Regular 2/10,
			Bold 3/11. The first Bold smeared stems one cell sideways, the way old system fonts did, and
			the square module broke. The rule since: every weight is square pixels. Bold was rebuilt by
			thickening the Light skeleton evenly on all sides.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/three-weights-a.png',
				alt: 'PARC Pixel 4:3 specimen on white: the letter A in Bold 700, Regular 400, and Light 300'
			},
			{
				type: 'image',
				src: '/images/parc/story-row-your-boat.png',
				alt: 'PARC Pixel story-format specimen on green: ROW in Bold, Regular, and Light, then Your boat'
			},
			{
				type: 'image',
				src: '/images/parc/pangram-weights.png',
				alt: 'PARC Pixel 16:9 specimen on white: the quick brown fox pangram in Bold, Regular, and Light'
			},
			{
				type: 'image',
				src: '/images/parc/ramp-green.png',
				alt: 'PARC Pixel Bold size ramp from 24px to 256px on the green colorway'
			}
		]}
	/>

	<TextSection title="The Hard Glyphs">
		<p>
			The 2 did not read as a 2 in any weight, and every hand-drawn replacement looked wrong next to
			the 3, 5, 6, 8 and 9. The version that shipped is the derived shape minus four cells. That
			became the method for the rest: derive first, then place the cells that matter by hand, judged
			in a real row of digits at reading size. 29 glyphs got that treatment.
		</p>
		<p>
			The at-sign had to exist because the team&rsquo;s handles are on the site; five constructions
			were tested inside a live handle at the size it is read. The dollar sign reuses each
			weight&rsquo;s S, so it follows if the S ever changes. The equals key holds the oar in all
			three weights.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/mono-numerals-sky.png',
				alt: 'PARC Pixel Mono numerals 0 to 9 on the sky colorway: tabular, chunky, honest'
			},
			{
				type: 'image',
				src: '/images/parc/square-ampersand-sky.png',
				alt: 'PARC Pixel Bold ampersand at giant size on the sky colorway'
			},
			{
				type: 'image',
				src: '/images/parc/square-oar.png',
				alt: 'PARC Pixel Mono square specimen: the oar glyph on the equals key'
			}
		]}
	/>

	<TextSection title="Specimens">
		<p>
			Sixteen social layouts in four formats and three colorways, each a different idea: a size
			ramp, a glyph mosaic, an anatomy sheet, the mono numerals, the character set on the island
			sky. The &ldquo;type specimen&rdquo; labels came off at the end. The type carries the page on
			its own.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/glyph-grid-green.png',
				alt: 'PARC Pixel Bold: 40 glyphs in a grid, one color per glyph, on the green colorway'
			},
			{
				type: 'image',
				src: '/images/parc/club-masthead-sky.png',
				alt: 'PARC Pixel 16:9 specimen on the sky colorway: Pixel Ape Rowboat Club set across the three weights'
			},
			{
				type: 'image',
				src: '/images/parc/story-grab-an-oar.png',
				alt: 'PARC Pixel story-format specimen on green: Grab an oar and row, one color per word'
			},
			{
				type: 'image',
				src: '/images/parc/square-mosaic-green.png',
				alt: 'PARC Pixel square specimen on green: a mosaic of club words cycling through weights and colors'
			},
			{
				type: 'image',
				src: '/images/parc/anatomy-sheet.png',
				alt: 'PARC Pixel 4:3 specimen on white: the Bold R on its 11 by 11 cell grid'
			},
			{
				type: 'image',
				src: '/images/parc/grab-an-oar-sky.png',
				alt: 'PARC Pixel 16:9 specimen on the sky colorway: Grab an oar and row, with the alphabet in three weights'
			},
			{
				type: 'image',
				src: '/images/parc/story-sky.png',
				alt: 'PARC Pixel story-format specimen on the sky colorway: the full character set in every weight'
			},
			{
				type: 'image',
				src: '/images/parc/square-mono-white.png',
				alt: 'PARC Pixel Mono square specimen on white: numerals, alphabet, and a price line'
			},
			{
				type: 'image',
				src: '/images/parc/story-white.png',
				alt: 'PARC Pixel story-format specimen on white: the PARC letters stacked in the logo colors'
			}
		]}
	/>

	<ResultsList
		title="Outcome"
		items={[
			'September 2026: 10,000 PARC apes with 1,250+ holders, 4,618 Monkey Phunks, 27 one-of-one Customs, and 4,540 Mysterious Bananas minted so far',
			'About 196,000 XRP traded across the four collections; $OAR held by 400+ wallets since February 2022',
			'Logo, palette, world, and typeface all come from the same 5×5 grid',
			'A full logo library for both lockups and the oar: black, CMYK, Pantone spot, and white for print; black, RGB, and white for web',
			'PARC Pixel is the only typeface on the PARC site: headlines, body, buttons, the arcade cabinet, the game cover art, and the stats page',
			'57 characters per weight, three weights, proportional and mono: 6 TTFs plus WOFF2',
			'29 glyphs finished by hand, cell by cell'
		]}
	/>
</CaseStudy>
