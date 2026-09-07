<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import SkyGround from '../parc/SkyGround.svelte';
	import HangingSign from '../parc/HangingSign.svelte';
	import ParcBand from '../parc/ParcBand.svelte';
	import PxButton from '../parc/PxButton.svelte';
	import Quotes from '../parc/Quotes.svelte';
	import '../parc/parc-theme.css';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'The Pixel Ape Rowboat Club website, built as an island you walk down: hanging signs, pixel buttons, live stats, a gallery on clotheslines, and an arcade with its own game.';
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
		dateCreated: '2026-09-04',
		url: `${SITE_URL}/work/parc-site`,
		image: imageUrl('/images/parc-site/home-hero.png', SITE_URL)
	}}
/>

<SkyGround />

<CaseStudy
	title="PARC Website"
	category="Web & Code"
	year="2026"
	role="Design & Code"
	timeline="Live since September 2026"
	tools="SvelteKit, Svelte 5, TypeScript, Canvas, Vercel, Neon, Claude Code"
	nextProject={getNextProject('parc-site')}
>
	{#snippet heading()}
		<HangingSign title="PARC Website" hint="Web & Code · 2026" />
		<p class="mt-8"><PxButton href="/" color="green">Back to work</PxButton></p>
	{/snippet}

	{#snippet overview()}
		<p class="mb-4">
			The rebrand needed somewhere to live. The old site was a default Squarespace template, and it
			could not hold what the club had become: four collections, a token, a Twitch show, an arcade,
			and merch.
		</p>
		<p class="mb-4">
			I built the new one alone. Claude Code wrote most of the code; I could not have typed it by
			hand. I designed it, judged every screen by eye, and tweaked by hand until it was right.
		</p>
		<p class="mb-4">
			Two rules from the start. The site is the brand in use, so everything comes out of the same
			grid as the logo. And it is a place, not a page: you arrive on an island and walk down it.
		</p>
		<ul class="space-y-2">
			<li>&mdash; Home, Gallery, Clubhouse, PARCade, Merch, Stats, LARC, and the error pages</li>
			<li>&mdash; One typeface, PARC Pixel, in three weights</li>
			<li>&mdash; Every number on it is live</li>
		</ul>
	{/snippet}

	<TextSection title="A Place, Not a Page">
		<p>
			Every page opens on the same sky: a gradient from azure to seafoam, two layers of pixel clouds
			drifting at different speeds, a jungle canopy across the top. The title hangs from it on a
			wooden sign with the lead and the buttons on the same plank, so each page has one object to
			look at first. Pages are named as places. The Clubhouse, the Gallery, the PARCade. Every tile
			in the world is generated, and every cell rolls a little grain of its own, so nothing is a
			flat fill and nothing reads as a repeat.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/home-hero.png',
				alt: 'parcxrpl.com home: the Pixel Ape Rowboat Club sign on a notched paper card over the scatter texture, under the green nav'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-collections.png',
				alt: 'parcxrpl.com collections: PARC, Monkey Phunks, and PARC Customs as paper cards on the sky'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-home.png',
				alt: 'parcxrpl.com home on a phone: the hero card with stacked pixel buttons'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-collections.png',
				alt: 'parcxrpl.com collection cards on a phone'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-oar.png',
				alt: 'parcxrpl.com: the Buy $OAR and Set Trustline cards at the foot of the sky'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-crew.png',
				alt: 'parcxrpl.com crew row: five ape avatars, each under its own color bar, above the green footer'
			},
			{
				type: 'image',
				src: '/images/parc-site/not-found.png',
				alt: 'parcxrpl.com 404: a hanging sign reading Rowed off the map'
			}
		]}
	/>

	<TextSection title="The Notch">
		<p>
			One primitive is under everything: a corner cut by a single square cell, drawn as a stepped
			polygon that reads each element&rsquo;s own cell size. Buttons notch at 6px, cards at 10px,
			panels at 12px. A button is a notched face floating over a darker slab. Hover lifts it, press
			drops it flush, and nothing on the site eases: buttons move in two steps, water ticks one cell
			at a time, dropdowns unroll a line at a time. The same parts build this page.
		</p>
		<p class="flex flex-wrap gap-3">
			<PxButton href="https://parcxrpl.com" color="green" external>Green</PxButton>
			<PxButton href="https://parcxrpl.com" color="orange" external>Orange</PxButton>
			<PxButton href="https://parcxrpl.com" color="blue" external>Blue</PxButton>
			<PxButton href="https://parcxrpl.com" color="yellow" external>Yellow</PxButton>
		</p>
	</TextSection>

	<TextSection title="Stats First">
		<p>
			Stats is the first link in the nav. After the landing page, it is what holders come for: how
			the collections are doing. Floor, all-time volume, holders, and listings for all four
			collections, and the $OAR token&rsquo;s price, market cap, holders, and liquidity, read live
			from the ledger, xrp.cafe, and the AMM. A daily snapshot feeds pixel bar charts whose history
			starts the day the site launched. I did not backfill.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/stats-top.png',
				alt: 'parcxrpl.com Club Stats: the $OAR card with price, volume, market cap, holders, and two pixel bar charts'
			},
			{
				type: 'image',
				src: '/images/parc-site/stats-cards.png',
				alt: 'parcxrpl.com Club Stats: four collection cards with floor, volume, holders, listed, and a 30-day floor chart'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-stats.png',
				alt: 'parcxrpl.com Club Stats on a phone'
			}
		]}
	/>

	<TextSection title="The Two That Took Longest">
		<p>
			The Gallery and the Clubhouse took more hands-on adjustment than the rest of the site put
			together. The Gallery hangs every ape on slack clotheslines strung between two tall trees,
			with generated foliage that never repeats a silhouette, over a shoreline whose water cycles
			through twenty-four palette frames the way a SNES did it. Tap a frame and a plaque names the
			ape. The first version scrolled sideways and hijacked the wheel. It looked good and felt
			wrong, so it was rebuilt on plain vertical scroll at half the code.
		</p>
		<p>
			The Clubhouse is where the club hangs out, so it is a scene: a grey TV with the Twitch stream
			in it, a trophy shelf, and a cork notice board with the club&rsquo;s events pinned to it, all
			swinging from generated branches. It took three layouts to find that. The ropes are clamped to
			the branches so they cannot detach at any width.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/gallery-top.png',
				alt: 'parcxrpl.com Gallery: the hanging sign with collection chips, and the generative apes on clotheslines between two trees'
			},
			{
				type: 'image',
				src: '/images/parc-site/gallery-customs.png',
				alt: 'parcxrpl.com Gallery: the PARC Customs one-of-ones on clotheslines'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-gallery.png',
				alt: 'parcxrpl.com Gallery on a phone: one portrait per clothesline'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-community.png',
				alt: 'parcxrpl.com Clubhouse on a phone: the sign, the On Air plaque, and the branches'
			},
			{
				type: 'image',
				src: '/images/parc-site/community-top.png',
				alt: 'parcxrpl.com Clubhouse: the hanging sign, the TV on its branch, and the cork notice board'
			},
			{
				type: 'image',
				src: '/images/parc-site/community-mid.png',
				alt: 'parcxrpl.com Clubhouse: the trophy shelf and event cards beside the notice board'
			},
			{
				type: 'image',
				src: '/images/parc-site/community-low.png',
				alt: 'parcxrpl.com Clubhouse: the last event cards above the grass and sand at the foot of the page'
			}
		]}
	/>

	<TextSection title="PARCade">
		<p>
			The arcade is a cabinet. The content lives inside a phosphor-green CRT with scanlines, and the
			joystick and buttons on the deck drive the screen. It boots when you arrive, badge first. On
			the landing page PARCade gets its own band: the game&rsquo;s island painted from its own
			sprites, the cover on a small CRT, live high scores from the leaderboard, and a river along
			the bottom drawn exactly the way the game draws water.
		</p>
		<p>
			The game in it is Rowboat Racer. An ape rows down an endless river, five lanes wide, dodging
			ziggurats, logs, and reefs. I drew the sprites on a 3px grid in the brand&rsquo;s own pixel
			language, the banks generate their own beach, jungle, rock, and village biomes from each
			run&rsquo;s seed, and the leaderboard replays every run on the server before a score counts.
			It is the brand as a toy, and the community plays it.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/home-arcade.png',
				alt: 'parcxrpl.com PARCade band: the Rowboat Racer cover on a CRT and live high scores over the game’s island'
			},
			{
				type: 'image',
				src: '/images/parc-site/parcade-boot.png',
				alt: 'parcxrpl.com PARCade booting: the PARC badge assembling on the green CRT above the deck'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-arcade.png',
				alt: 'parcxrpl.com PARCade band on a phone'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-parcade.png',
				alt: 'parcxrpl.com PARCade on a phone: the game library on the CRT'
			},
			{
				type: 'image',
				src: '/images/parc-site/parcade-library.png',
				alt: 'parcxrpl.com PARCade booted: the game library with Rowboat Racer live and two cabinets coming soon'
			},
			{
				type: 'image',
				src: '/images/parc-site/game-run.png',
				alt: 'Rowboat Racer mid-run: the boat between a beach bank and a jungle bank, coins ahead, obstacles in their lanes'
			},
			{
				type: 'image',
				src: '/images/parc-site/game-banks.png',
				alt: 'Rowboat Racer banks: rocky, village, jungle, and beach biomes with clustered props and a wandering shoreline'
			},
			{
				type: 'image',
				src: '/images/parc-site/game-sprites.png',
				alt: 'Rowboat Racer sprite sheet: the boat, obstacles, pickups, and bank props on the 3px grid'
			}
		]}
	/>

	<TextSection title="Everything Else Is Also Somewhere">
		<p>
			Merch was going to be a link out. The storefront had an API, so the catalog renders as pixel
			product cards with a photo carousel and unrolling dropdowns, and checkout is the only step
			that leaves the brand. After Darc and Discord each get a band in their own color with a living
			background: broadcast static for the show, drifting chat bubbles for the server. LARC, the
			teaser for the next collection, is a boathouse terminal that boots, corrupts, loses signal,
			and lets you type. The 404 is a sign that says you rowed off the map.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/parc-site/merch.png',
				alt: 'parcxrpl.com Merch: the PARC Vibes tee and hoodie as pixel product cards with carousels and dropdowns'
			},
			{
				type: 'image',
				src: '/images/parc-site/larc.png',
				alt: 'parcxrpl.com LARC teaser: the boathouse terminal mid-corruption, an unknown vessel detected'
			},
			{
				type: 'image',
				src: '/images/parc-site/phone-merch.png',
				alt: 'parcxrpl.com Merch on a phone'
			},
			{
				type: 'image',
				src: '/images/parc-site/home-bands.png',
				alt: 'parcxrpl.com After Darc band in Twitch purple and Discord band in blurple'
			}
		]}
	/>

	<TextSection title="How It Was Built">
		<p>
			Claude Code wrote the code and I directed it, screen by screen. Every unit of work ended the
			same way: a screenshot diff against the deployed site, a pass at phone width, and a type check
			at zero errors. Color, type, and spacing are all custom properties, so the audits at the end
			ran over one file. Fonts ship as WOFF2, the animated art became WebP, and the domain moved
			from Squarespace DNS to Vercel the night the old site kept reappearing.
		</p>
	</TextSection>

	<Quotes
		title="The Reaction"
		quotes={[
			{
				text: 'Love it, great website update, looks amazing',
				who: '@BrandoWoodz',
				where: 'X',
				color: 'blue'
			},
			{ text: 'loOkn goOd', who: '@Uga589', where: 'X', color: 'yellow' }
		]}
	/>

	<ParcBand flush>
		<ResultsList
			title="Outcome"
			items={[
				'Seven pages plus the error pages, live at parcxrpl.com since September 2026',
				'Designed and built alone, with Claude Code',
				'About 11,000 lines of Svelte and TypeScript, 13 shared components, one stylesheet of tokens',
				'Live data throughout: the ledger, xrp.cafe, the AMM, the Fourthwall storefront, and the game leaderboard',
				'PARC Pixel is the only typeface on the site'
			]}
		/>
	</ParcBand>
</CaseStudy>
