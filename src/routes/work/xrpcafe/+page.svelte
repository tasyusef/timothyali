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
		'Visual identity, mascot system, motion design, and marketing for the #1 NFT marketplace on the XRP Ledger — cofounded and designed from day one.';
</script>

<Seo
	title="xrp.cafe — Brand Identity & Motion Design"
	{description}
	ogKey="xrpcafe"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'xrp.cafe — Brand Identity & Motion Design',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2021-01-01',
		url: `${SITE_URL}/work/xrpcafe`,
		image: imageUrl('/images/xrpcafe/logo_16x9.png', SITE_URL)
	}}
/>

<CaseStudy
	title="xrp.cafe"
	category="Brand Identity & Motion Design"
	year="2021–2024"
	role="Cofounder / Founding Designer"
	tools="Illustrator, After Effects"
	heroImage="/images/xrpcafe/logo_16x9.png"
	heroVideo="/videos/CAFE_EXPLORE_CREATE_TRADE.mp4"
	heroAlt="xrp.cafe Explore Create Trade motion graphic"
	nextProject={getNextProject('xrpcafe')}
>
	{#snippet overview()}
		<p class="mb-4">
			xrp.cafe is the #1 NFT marketplace on the XRP Ledger. As cofounder and founding designer, I
			led the design of a 0&rarr;1 marketplace — the brand&rsquo;s rollout across marketing, events,
			and content, extending the visual identity into 10+ social campaigns, motion graphics, event
			booths, and community touchpoints.
		</p>
		<p>
			The positioning was a deliberate contrarian bet. Crypto branding in 2021 was dark, aggressive,
			and self-serious; we went warm, friendly, and approachable instead — a cozy place for NFTs.
			That warmth became the moat.
		</p>
	{/snippet}

	<TextSection title="The Mascot System">
		<p>
			The heart of the brand is its mascot: a simple, expressive coffee mug with stick-figure limbs
			and a warm smile. What started as a logo mark grew into a full cast of characters — each with
			its own personality and accessories — that became the face of the brand on every touchpoint.
		</p>
		<p>
			A mascot system earns its keep through variety without drift. I produced new character
			variations and scenes for campaigns, seasonal moments, and community milestones — a Halloween
			pumpkin mug, a beach-BBQ mug, a Super Saiyan mug — each instantly recognizable as xrp.cafe,
			none requiring a brand guideline lookup to feel right.
		</p>
	</TextSection>

	<TextSection title="Motion Graphics">
		<p>
			The &ldquo;Explore, Create, Trade&rdquo; promo distills the entire value proposition into a
			fast-paced animated piece — kinetic typography, smooth character animation, and the
			brand&rsquo;s signature blue throughout. It was designed for the feed, not the film festival:
			vertical format, legible on a phone mid-scroll, message delivered in seconds.
		</p>
		<p>
			Around the hero promo I built a library of motion assets — product launches, feature
			announcements, event recaps — that gave the brand a consistent, energetic presence in feeds.
			Each piece had the same job: communicate a platform feature in seconds, in character.
		</p>
	</TextSection>

	<TextSection title="Community as a Channel">
		<p>
			NFT marketplaces live and die by their communities, so the brand&rsquo;s primary medium was
			the daily feed. I produced a continuous stream of content for Twitter/X, Instagram, and
			Discord — product announcements, feature launches, community events, seasonal posts,
			partnerships, milestone celebrations. The cadence was relentless: multiple posts a week, each
			needing custom graphics, copy, and a read on what the community actually cared about that day.
		</p>
		<p>
			The same system extended into the physical world — booth designs, backdrops, banners, and
			merch for Consensus, Permissionless, and ETH Denver — where a warm, recognizable brand stood
			out on a conference floor full of black-and-neon.
		</p>
	</TextSection>

	<ResultsList
		items={[
			'#1 NFT marketplace on the XRP Ledger by secondary sales volume',
			'11,800+ secondary sales in a single 30-day period at peak (Nov 2023)',
			'Top 3 XRPL NFT marketplaces controlled 80%+ of all on-chain NFT volume',
			'Featured on the official XRPL developer blog',
			'Profiled by Messari as one of the most established touchpoints on XRPL',
			'XRPL Accelerator backed — institutional support from the network',
			'Consensus 2023 & 2024 — booth presence at the largest crypto conference',
			'Permissionless 2024 — booth within the Ripple X section',
			'ETH Denver — attended annually since 2022'
		]}
	/>

	<Gallery
		items={[
			{ type: 'image', src: '/images/xrpcafe/logo_16x9.png', alt: 'xrp.cafe logo' },
			{
				type: 'video',
				src: '/videos/CAFE_EXPLORE_CREATE_TRADE.mp4',
				alt: 'Explore Create Trade motion graphic'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/1.png',
				alt: 'xrp.cafe Super Saiyan mug mascot character'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/2.png',
				alt: 'xrp.cafe marketplace UI with mascot characters'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/3.png',
				alt: 'xrp.cafe beach-BBQ mug mascot character'
			},
			{ type: 'image', src: '/images/xrpcafe/7.png', alt: 'xrp.cafe Halloween pumpkin mug mascot' },
			{
				type: 'image',
				src: '/images/xrpcafe/6.png',
				alt: 'xrp.cafe JUST MINT NFTs campaign graphic'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/4.png',
				alt: 'xrp.cafe community Jeopardy event graphic'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/5.png',
				alt: 'xrp.cafe and VeSea charity event graphic'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/XLS20_1Y-04.png',
				alt: 'xrp.cafe XLS-20 one year anniversary artwork'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/booth_team.jpg',
				alt: 'xrp.cafe team at Consensus booth'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/booth_setup.jpg',
				alt: 'xrp.cafe booth setup at Permissionless'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/booth_table.jpg',
				alt: 'xrp.cafe booth table with stickers and merch'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/booth_tablet.jpg',
				alt: 'xrp.cafe website demo at Consensus 2023'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/event_nft_display.jpg',
				alt: 'Team at NFT event with display wall'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/xrpl_group.jpg',
				alt: 'XRP Ledger community group photo at Consensus'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/backdrop_mockup.png',
				alt: 'xrp.cafe event backdrop mockup'
			},
			{
				type: 'image',
				src: '/images/xrpcafe/banner_mockup.png',
				alt: 'xrp.cafe retractable banner mockups'
			}
		]}
	/>
</CaseStudy>
