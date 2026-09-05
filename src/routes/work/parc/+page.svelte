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
		'Rebranding Pixel Ape Rowboat Club from one 5×5 grid: the box logo, a five-color palette, a pixel world, and an extended pixel typeface in three weights.';
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
			Pixel Ape Rowboat Club is an NFT project I cofounded on the XRP Ledger in November 2021, to
			make interesting art and to support the ledger&rsquo;s ecosystem with software. I have drawn
			its graphics and run its online presence since; xrp.cafe, the marketplace I cofounded the next
			summer, started with members from the club. Four years on, PARC is four collections, the $OAR
			token, a Twitch show, an arcade, and merch: more than 19,000 pieces minted and about 196,000
			XRP traded. The brand looked like the era it came from. It was due to grow up: more tasteful,
			still playful. The only fixed asset was the box logo, four letters drawn by hand on a
			5&times;5 pixel grid. Everything in the rebrand came out of that grid, including the typeface.
		</p>
		<ul class="space-y-2">
			<li>&mdash; The box logo, its stacked mark, and a full print and web logo library</li>
			<li>&mdash; A five-color palette with one rule: one color per block</li>
			<li>&mdash; A pixel world of sky, clouds, and island for every surface</li>
			<li>
				&mdash; PARC Pixel: an extended typeface in three weights, grown from the four letters
			</li>
		</ul>
	{/snippet}

	<TextSection title="Fixing the Logo First">
		<p>
			The box logo was hand-drawn in Illustrator&rsquo;s grid tool: 266 little squares sitting edge
			to edge. At any size that did not land on whole device pixels, every square anti-aliased and
			the mark filled with hairline seams. Overlapping the squares still showed. The real fix was a
			tracer that walks the outline of each shape, so each master became five merged paths: one
			white badge silhouette and one solid path per letter. Seams became impossible rather than
			unlikely, and that principle, merged shapes and never abutting cells, carried into the
			typeface and every sprite after it.
		</p>
		<p>
			The mark reads as a signboard in the world rather than a logo pasted on top of it: four
			letters, each in its own color, on a white sign with notched corners and a hard one-cell
			shadow. The four-color cycling is the logo&rsquo;s alone. A stacked 2&times;2 version carries
			the profile pictures. I tried five rowboat marks for a secondary mark; all of them either read
			as a smile or fought the letters. What the system needed was quieter: a single horizontal oar
			on the same notched box. It became the favicon, the inline ornament, and, in the typeface, the
			equals key. Both lockups and the oar ship as a complete logo library: black, CMYK, Pantone
			spot, and white for print; black, RGB, and white for web, each at three sizes.
		</p>
	</TextSection>

	<TextSection title="The Thesis">
		<p>
			The brief for the first type specimen was one line: one color per block of text, no
			alternating letters. That line turned out to be the entire rebrand. The pixel was never what
			made NFT-era branding feel juvenile; the maximalism was. The pixel is the heritage. Restraint
			is the maturity. Keep the grid sacred and govern it with editorial rules.
		</p>
		<p>
			One color per element: text, icons, textures each get one flat brand color. Five colors, no
			tints, no gradients: orange, blue, green, yellow, white. Texture as the luxury signal: pixel
			scatter is the only permitted texture, at three to six percent density for everyday use and up
			to forty percent on drop days. And the grid is law: margins, crops, spacing and type sizes
			land on multiples of the pixel cell, and corners always notch exactly one cell. Nobody has to
			see the grid to feel it. All of it went into a one-page brand sheet, set in the system it
			describes, with a do-and-don&rsquo;t pair for each rule. The sheet is rebuilt below, live, in
			the real fonts and the real marks.
		</p>
	</TextSection>

	<BrandSystem />

	<TextSection title="The World">
		<p>
			The colors live in a pixel world. A sky gradient with clouds is the default ground; the island
			with its sand, water, and boathouse is where the club lives; and dark green is the reverse for
			type-led surfaces. Social banners, OG cards, the PARCade arcade panels, the $OAR token card,
			and the CRT-glitch teasers all draw from the same handful of parts.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc/banner-island.png',
				alt: 'PARC profile banner: the sign over the island beach with a rowboat on the water'
			},
			{
				type: 'image',
				src: '/images/parc/glitch-story.png',
				alt: 'PARC CRT-glitch teaser in story format: a boathouse terminal readout in PARC Pixel'
			},
			{
				type: 'image',
				src: '/images/parc/og-club.png',
				alt: 'PARC share card: the box logo above Pixel Ape Rowboat Club, rowing on the XRP Ledger'
			},
			{
				type: 'image',
				src: '/images/parc/glitch-square.png',
				alt: 'PARC CRT-glitch teaser: the wordmark breaking up over a boathouse terminal readout'
			},
			{
				type: 'image',
				src: '/images/parc/og-parcade.png',
				alt: 'PARCade share card: a wooden plank panel reading Insert coin, row fast'
			}
		]}
	/>

	<TextSection title="Four Letters Become an Alphabet">
		<p>
			I wanted the rebrand&rsquo;s type to come out of the logo instead of importing a typeface, and
			I wanted a real font file at the end, not a folder of lettering. The P, A, R and C were copied
			exactly as bitmaps and treated as a style guide. Reading them gave four rules: one-cell
			strokes, hollow counters, a corner inset by one cell wherever a curve would be, diagonals
			stepped cell by cell. The rest of A&ndash;Z, the digits and punctuation were drawn to those
			rules on the same grid.
		</p>
		<p>
			Letters and digits are all five cells wide, so the face is extended and monospaced by nature.
			Punctuation was narrowed for headlines, then a strict mono cut was added for the things a
			pixel brand leans on: countdowns, prices, scoreboards. Every glyph is exported as one merged
			path, never a pile of squares, so nothing can anti-alias into hairline seams. The family is
			caps only; lowercase input maps to the capitals. The font is single-color, so the logo stays
			the only thing that cycles through all four.
		</p>
	</TextSection>

	<TextSection title="Weights Without Borrowing">
		<p>
			Could PARC Pixel carry a whole site, or would headlines need a &ldquo;real&rdquo; font beside
			it? On a pixel grid, weight is stroke cells over cap-height cells. Light reduces each letter
			to a one-cell skeleton on a 9-row grid (1/9). Regular is the exact 2&times; of the master
			(2/10). Bold stamps a 3&times;3 pixel on every skeleton cell on an 11-row grid (3/11).
		</p>
		<p>
			The first Bold was wrong in a way that taught me the typeface&rsquo;s real law. It smeared
			stems one cell sideways, the way old bitmap system fonts did, which made it out of 3&times;2
			rectangles while the other weights were square pixels. The module broke and the letters read
			like pixels sliding over each other. That set the rule: every weight is made of square pixels.
			Bold was rebuilt by thickening the Light skeleton evenly on all sides.
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

	<TextSection title="The 2">
		<p>
			The digit 2 did not read as a 2 in any weight. The right first fix was at the source: one
			bitmap change to the 5&times;5 master propagated to all six fonts. Then Light looked absurd,
			Bold&rsquo;s steps were ragged, and an afternoon of hand-drawn replacements got worse.
			Straight descenders read as Z, curves clogged the counter, one version turned into an 8. The
			version that shipped was the derivation minus exactly four cells.
		</p>
		<p>
			The honest diagnosis was that the derived 2 shared its curve language with the 3, 5, 6, 8 and
			9, so every from-scratch attempt looked alien beside them. That settled how the rest of the
			family got finished: derive first, then place the pixels that matter by hand, cell by cell,
			judged inside a real row of digits at the size it would be read. That set grew to 29 glyphs,
			including the bold N and Z with unbroken diagonals, the question mark, the at-sign in all
			three weights, and the oar.
		</p>
	</TextSection>

	<TextSection title="The Hard Glyphs">
		<p>
			The at-sign is the hardest glyph in any pixel font, and it had to exist because the
			team&rsquo;s handles live on the site. Five constructions were laid out large, inside a live
			handle, and at the tiny size where it would be read. The one that shipped in Bold, a rounded
			ring with a spiral interior, is the strongest glyph in the punctuation row.
		</p>
		<p>
			The dollar sign was first drawn as its own angular S with a bar. That was the wrong instinct.
			It now reuses the S bitmap from each weight, so it follows if the S ever changes, and the bar
			extends two rows above the cap and two below the baseline. The equals key holds the oar, the
			club&rsquo;s mark drawn as a glyph in all three weights. It is the one joke the typeface is
			allowed.
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
			For social, sixteen layouts in four formats: story, 16:9, 4:3 and square, in green, sky and
			white colorways. Each was designed to differ from the others rather than restate one layout: a
			ROW ROW ROW waterfall through the weights, a size ramp, a glyph mosaic, a giant-letter weight
			trio, an anatomy sheet, the mono numerals, and the character set on the island sky. The
			&ldquo;type specimen&rdquo; labels and footers came off at the end. They cluttered the
			layouts, and the type could carry the page alone.
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
			'The club in September 2026: 10,000 PARC apes with 1,250+ holders, 4,618 Monkey Phunks, 27 one-of-one Customs, and 4,540 Mysterious Bananas minted so far',
			'About 196,000 XRP traded across the four collections, and $OAR held by 400+ wallets since February 2022',
			'One grid, one system: logo, palette, world, and typeface all derive from the same 5×5 module',
			'A complete logo library for both lockups: black, CMYK, Pantone spot, and white for print; black, RGB, and white for web',
			'PARC Pixel is the only typeface on the new PARC site: headlines, body, buttons, the arcade cabinet, the game cover art, and the stats page',
			'57 characters per weight: A–Z, 0–9, punctuation, symbols, and the oar',
			'Three weights (Light 1/9, Regular 2/10, Bold 3/11) in proportional and strict mono families: 6 TTFs plus WOFF2 for the web',
			'29 glyphs finished by hand across the family, cell by cell'
		]}
	/>
</CaseStudy>
