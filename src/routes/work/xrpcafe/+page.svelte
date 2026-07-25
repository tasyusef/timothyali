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
		'Visual identity, mascot system, motion design, and marketing for the #1 NFT marketplace on the XRP Ledger, which I cofounded and designed from the start.';
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
	category="Brand & Motion"
	year="2021–2024"
	role="Cofounder & Founding Designer"
	tools="Illustrator, After Effects"
	heroImage="/images/xrpcafe/logo_16x9.png"
	heroVideo="/videos/CAFE_EXPLORE_CREATE_TRADE.mp4"
	heroAlt="xrp.cafe Explore Create Trade motion graphic"
	nextProject={getNextProject('xrpcafe')}
>
	{#snippet overview()}
		<p class="mb-4">
			xrp.cafe is the #1 NFT marketplace on the XRP Ledger. As cofounder and founding designer, I
			built the brand from nothing and led its rollout across marketing, events, and content: 10+
			social campaigns, motion graphics, event booths, and community touchpoints.
		</p>
		<p>
			The positioning ran against the whole field. Crypto branding in 2021 was dark, aggressive, and
			self-serious. We went warm, friendly, and approachable: a cozy place for NFTs. That warmth set
			us apart and kept people with us.
		</p>
	{/snippet}

	<TextSection title="The Mascot System">
		<p>
			The brand centers on its mascot: a simple, expressive coffee mug with stick-figure limbs and a
			warm smile. It began as a logo mark and grew into a full cast of characters, each with its own
			personality and accessories, that fronted the brand on every touchpoint.
		</p>
		<p>
			A mascot system works when it can vary without drifting. I drew new characters and scenes for
			campaigns, seasonal moments, and community milestones: a Halloween pumpkin mug, a beach-BBQ
			mug, a Super Saiyan mug. Each read as xrp.cafe at a glance, and none needed a brand guideline
			to feel right.
		</p>
	</TextSection>

	<TextSection title="Motion Graphics">
		<p>
			The &ldquo;Explore, Create, Trade&rdquo; promo compresses the whole pitch into one fast
			animated piece: kinetic typography, smooth character animation, and the brand&rsquo;s
			signature blue throughout. I made it for the feed, not the film festival: vertical format,
			legible on a phone mid-scroll, message delivered in seconds.
		</p>
		<p>
			Around the hero promo I built a library of motion assets for product launches, feature
			announcements, and event recaps, which gave the brand a steady, energetic presence in feeds.
			Each piece had one job: show one platform feature, fast, in character.
		</p>
	</TextSection>

	<TextSection title="Community as a Channel">
		<p>
			An NFT marketplace depends on its community, so the brand&rsquo;s main medium was the daily
			feed. I produced a steady stream of content for Twitter/X, Instagram, and Discord: product
			announcements, feature launches, community events, seasonal posts, partnerships, milestone
			celebrations. The pace never let up: several posts a week, each needing custom graphics, copy,
			and a read on what the community cared about that day.
		</p>
		<p>
			The same system carried into the physical world, with booth designs, backdrops, banners, and
			merch for Consensus, Permissionless, and ETH Denver. On a conference floor full of
			black-and-neon, a warm, recognizable brand stood out.
		</p>
	</TextSection>

	<ResultsList
		items={[
			'#1 NFT marketplace on the XRP Ledger by secondary sales volume',
			'$5M+ in marketplace revenue',
			'Community grown to 32,000+ members',
			'11,800+ secondary sales in a single 30-day period at peak (Nov 2023)',
			"Helped raise $32K for St. Jude's with VeSea",
			'Profiled by Messari as one of the most established touchpoints on XRPL, featured on the official XRPL developer blog, and backed by the XRPL Accelerator',
			'Booth and brand presence at Consensus (2023, 2024), Permissionless 2024 in the Ripple X section, and ETH Denver (2022–2024)'
		]}
	/>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/xrpcafe/logo_16x9.png',
				alt: 'xrp.cafe coffee-mug logo lockup'
			},
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
				alt: 'xrp.cafe team at NFT event display wall'
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

	<TextSection title="Live">
		<a
			href="https://xrp.cafe/"
			target="_blank"
			rel="noopener noreferrer"
			class="label-swiss hover-swiss inline-block underline underline-offset-4"
		>
			Visit xrp.cafe &rarr;
		</a>
	</TextSection>
</CaseStudy>
