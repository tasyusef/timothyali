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
		'The Pixel Ape Rowboat Club website, built as an island you can walk through: one notch primitive, pixel buttons you can press, and pages named as places.';
</script>

<Seo
	title="PARC Website — Web & Code"
	{description}
	ogKey="parc-site"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'PARC Website — Web & Code',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2026-09-01',
		url: `${SITE_URL}/work/parc-site`,
		image: imageUrl('/images/parc-site/home-hero.png', SITE_URL)
	}}
/>

<CaseStudy
	title="PARC Website"
	category="Web & Code"
	year="2026"
	role="Designer & Developer (sole creator)"
	timeline="Live in six days, refined over the two weeks after"
	tools="SvelteKit 2, Svelte 5, TypeScript, Canvas, Vercel, Neon Postgres"
	heroImage="/images/parc-site/home-hero.png"
	heroAlt="parcxrpl.com home: the four-word wordmark in the logo colors on a notched paper card, pixel scatter behind it"
	nextProject={getNextProject('parc-site')}
>
	{#snippet overview()}
		<p class="mb-4">
			Pixel Ape Rowboat Club had four collections, a club token, a Twitch show, an arcade game, and
			merch, all sitting on a Squarespace site that could not carry any of it. The new site had two
			rules from the start: everything comes out of the pixel grid the logo was drawn on, so no
			borrowed typeface, no stock illustration, no rounded corners; and I would own the whole stack
			this time: source, hosting, domain, and data.
		</p>
		<ul class="space-y-2">
			<li>&mdash; Home, Gallery, Clubhouse, PARCade, Merch, Stats, LARC, and the error pages</li>
			<li>&mdash; One typeface: PARC Pixel, in three weights</li>
			<li>&mdash; One primitive, the notch, behind every button, card, sign, and screen</li>
			<li>
				&mdash; <a
					href="https://parcxrpl.com"
					target="_blank"
					rel="noopener noreferrer"
					class="hover-swiss underline underline-offset-4">Live at parcxrpl.com</a
				>
			</li>
		</ul>
	{/snippet}

	<TextSection title="A Physical Language for the Screen">
		<p>
			Every corner on the site is cut by one square cell, drawn with a stepped clip-path, never a
			diagonal chamfer. It is one shared polygon that reads a per-element cell size, so a button
			notches at 6px, a card at 10px and a panel at 12px, all from the same rule.
		</p>
		<p>
			The buttons are real pixel buttons: a notched face floating over a darker notched slab in its
			own hand-picked shade. Hover lifts the face; press drops it flush. The hover ring took an
			evening to land, from white, to bevelled, to a highlight in the button&rsquo;s own hue, and
			two laws came out of it that now govern everything. A highlight ring means interactive and a
			shadow ring means container. Ring thickness equals the notch cell, so a bigger element
			automatically gets a proportionally heavier frame.
		</p>
		<p>
			Nothing on the site eases. Buttons lift in two steps, water ticks one cell at a time,
			dropdowns unroll scanline by scanline, the terminal cursor blinks in two frames. It is the
			motion language of the hardware the aesthetic remembers, and it is cheaper to run. Collection
			cards, product cards, the hero panel and the stats board all share the buttons&rsquo;
			face-over-slab construction, so anything raised is something you can act on.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/home-hero.png',
				alt: 'parcxrpl.com home: the four-word wordmark in the logo colors on a notched paper card, pixel scatter behind it'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-mobile.png',
				alt: 'parcxrpl.com home on a phone: the notched hero card with stacked pixel buttons'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-collections.png',
				alt: 'parcxrpl.com collection cards on the island sky: face over slab, notched corners, one accent color per collection'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-mobile-menu.png',
				alt: 'parcxrpl.com mobile menu: the nav links stacked on club green above the hero card'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-oar-cards.png',
				alt: 'parcxrpl.com: Buy $OAR and Set Trustline as their own cards at the foot of the sky, the PARCade band starting below'
			},
			{
				type: 'image',
				src: '/images/parc-site/island-tiles.png',
				alt: 'parcxrpl.com island tile set: sand, water, jungle fringe, trunk, clouds, branches, cork, and a foliage clump, all generated'
			},
			{
				type: 'image',
				src: '/images/parc-site/not-found.png',
				alt: 'parcxrpl.com 404: a hanging sign reading Rowed off the map, with a giant pixel 404 drifting in the sky'
			}
		]}
	/>

	<TextSection title="Pages as Places">
		<p>
			The first pages were competent and flat: a title, a paragraph, a grid. What changed the site
			was a naming exercise. The strong page titles named a place (The Boathouse, PARCade) and the
			weak ones named a category (Community). So every page became somewhere on an island: an azure
			sky easing to seafoam, two layers of drifting pixel clouds, a jungle canopy fringing the top
			of every page, and hanging wooden signs on twisted ropes carrying each page&rsquo;s title,
			lead and buttons as one object. Every tile in the world is generated by a script, and every
			cell rolls its own one to two percent lightness grain, so nothing is a flat fill and nothing
			reads as a tile.
		</p>
		<p>
			The Gallery began as a horizontal boathouse with a wheel-hijacking scroll. It looked cool and
			fought physics. It was rebuilt on native vertical scroll at half the code, with the portraits
			strung on slack clotheslines between two tall trees and generated foliage that never repeats a
			silhouette, over a shoreline whose water animates the SNES way: twenty-four palette-cycled
			frames at a lazy lap. Tap a frame and a lightbox plaque names the ape. The Clubhouse took
			three layouts to find; the one that worked is a composed scene where the grey TV with the
			stream in it, the trophy shelves and the cork notice board all swing from generated branches,
			clamped so the ropes can never detach at any width.
		</p>
		<p>
			PARCade is an arcade cabinet: the content lives inside a phosphor-green CRT with chunky
			scanlines, and the joystick and buttons on the deck drive the screen. When you first arrive it
			boots, and the badge assembles pixel by pixel. On the landing page PARCade gets its own band,
			and it became the most worked section of the site: the game&rsquo;s island as a backdrop,
			painted with the renderer&rsquo;s own ground, bank props and shoreline, the cover on a CRT,
			live high scores from the leaderboard, and a river along the bottom drawn exactly the way the
			game draws its water, with the game&rsquo;s obstacles anchored in it. The game inside the
			cabinet has <a href="/work/rowboat-racer" class="hover-swiss underline underline-offset-4"
				>its own case study</a
			>.
		</p>
		<p>
			Merch was going to be a link to a storefront; the storefront&rsquo;s API meant it did not have
			to be, so the catalog renders as pixel product cards with a photo carousel, unrolling
			dropdowns for sizes, and a checkout hand-off that keeps the brand until the last step. Stats
			came late and became the first thing in the nav: floors, volumes, holders and listings for
			four collections, the token&rsquo;s price and market cap from a DEX indexer and the ledger
			itself, and a daily snapshot feeding pixel bar charts whose history starts at launch. I
			refused to backfill. LARC, the teaser for the next collection, is a haunted boathouse terminal
			that boots, corrupts, loses signal and then lets you type. Even the error pages are somewhere.
		</p>
		<p>
			Two bands borrow colors from outside the palette, each earned by the brand it points at: After
			Darc, the club&rsquo;s Twitch show, in a muted Twitch purple, and Discord in its own blurple.
			Each has a living background on the game&rsquo;s 3px grid. After Darc is a broadcast signal:
			sparse static, interference bars rolling down like a weak CRT, a band that locks onto your
			cursor row, and a click that switches the set off. Discord is a channel: pixel chat bubbles
			drifting up like messages landing, a typing indicator under the cursor, and a click that posts
			one.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/gallery.png',
				alt: 'parcxrpl.com Gallery: ape portraits hung on clotheslines between two pixel trees over the island sky'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-parcade-band.png',
				alt: 'parcxrpl.com PARCade band: the game’s island painted from its own sprites, the cover on a CRT, live high scores'
			},
			{
				type: 'image',
				src: '/images/parc-site/parcade-boot.png',
				alt: 'parcxrpl.com PARCade: the arcade cabinet booting, the PARC badge assembling pixel by pixel on a green CRT'
			},
			{
				type: 'image',
				src: '/images/parc-site/clubhouse.png',
				alt: 'parcxrpl.com Clubhouse: a pixel TV, trophy shelves, and a cork notice board hanging from branches'
			},
			{
				type: 'image',
				src: '/images/parc-site/parcade-library.png',
				alt: 'parcxrpl.com PARCade booted: the game library on the glass, one cabinet live and two coming soon'
			},
			{
				type: 'image',
				src: '/images/parc-site/gallery-lightbox.png',
				alt: 'parcxrpl.com Gallery lightbox: PARC #01 on a white plaque with its name and collection chip'
			},
			{
				type: 'image',
				src: '/images/parc-site/stats.png',
				alt: 'parcxrpl.com Club Stats: $OAR token figures and four collection cards with pixel bar charts'
			},
			{
				type: 'image',
				src: '/images/parc-site/parcade-settings.png',
				alt: 'parcxrpl.com PARCade settings panel: sound toggle, music and effects on pixel sliders, opened from the deck’s cog'
			},
			{
				type: 'image',
				src: '/images/parc-site/larc.png',
				alt: 'parcxrpl.com LARC teaser: a corrupted boathouse terminal on a dark CRT'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-live-band.png',
				alt: 'parcxrpl.com live bands: the PARCade river above After Darc in Twitch purple and Discord in blurple'
			},
			{
				type: 'image',
				src: '/images/parc-site/gallery-mobile.png',
				alt: 'parcxrpl.com Gallery on a phone: portraits on clotheslines in a single column'
			},
			{
				type: 'image',
				src: '/images/parc-site/merch.png',
				alt: 'parcxrpl.com Merch: pixel product cards for a tee, a hoodie, and mugs with unrolling size dropdowns'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-crew.png',
				alt: 'parcxrpl.com crew section: five ape avatars shown whole and notched, each under its own color bar'
			},
			{
				type: 'image',
				src: '/images/parc-site/merch-card.png',
				alt: 'parcxrpl.com product cards: photo carousel with pixel arrows, custom dropdowns, and the buy button'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-discord-band.png',
				alt: 'parcxrpl.com Discord band with drifting chat bubbles, the crew row beginning below'
			}
		]}
	/>

	<TextSection title="The Discipline Underneath">
		<p>
			A world this decorative only holds if the engineering is boring in the right ways. Every
			color, type size, spacing step and notch size is a custom property. After the first burst of
			building, color, type and spacing audits ran over the whole source, and their findings were
			argued down before anything was implemented; one catch was a global heading line-height fix
			that would have shrunk every vertical gallery sign by ten pixels. Every unit of work ends with
			a screenshot diff against the deployed baseline, a mobile pass at phone width with touch
			emulation, and a type check at zero errors and zero warnings.
		</p>
		<p>
			Fonts ship as WOFF2 with preloads, animated GIFs became WebP, assets carry immutable caching
			with versioned URLs when art changes, and every page has JSON-LD, a sitemap entry and a social
			card. The domain moved from Squarespace DNS to Vercel DNS the night the old site kept
			reappearing on the apex. A dev branch has its own subdomain for previews, and production only
			moves when I say push.
		</p>
	</TextSection>

	<ResultsList
		title="Outcome"
		items={[
			'Seven pages plus error pages, live at parcxrpl.com: Home, Gallery, Clubhouse, PARCade, Merch, Stats, LARC',
			'SvelteKit 2 and Svelte 5, TypeScript, canvas, Vercel, Neon Postgres, the Fourthwall Storefront API, and XRPL public nodes',
			'86 design tokens in one stylesheet and 13 shared components, from the pixel button to the shore scene',
			'About 11,000 lines of Svelte and TypeScript across 290 commits: six days of building, eight of refinement',
			'PARC Pixel is the only typeface on the site'
		]}
	/>
</CaseStudy>
