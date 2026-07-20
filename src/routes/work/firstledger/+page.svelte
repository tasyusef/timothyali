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
		'Complete visual identity for a token trading platform on the XRP Ledger, from logo concept to full brand guidelines with co-branding rules.';
</script>

<Seo
	title="First Ledger — Brand Identity System"
	{description}
	ogKey="firstledger"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'First Ledger — Brand Identity System',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2024-01-01',
		url: `${SITE_URL}/work/firstledger`,
		image: imageUrl('/images/firstledger/FL2_FOLIO_HERO.png', SITE_URL)
	}}
/>

<CaseStudy
	title="First Ledger"
	category="Brand & Art Direction"
	year="2024–2025"
	role="Senior Brand Designer"
	timeline="~1 year"
	tools="Illustrator"
	heroImage="/images/firstledger/FL2_FOLIO_HERO.png"
	heroAlt="First Ledger billboard mockup: The fastest way to trade"
	nextProject={getNextProject('firstledger')}
>
	{#snippet overview()}
		<p class="mb-4">
			First Ledger is a token trading platform on the XRP Ledger: a Telegram bot and a full web
			interface at firstledger.net for fast, self-custody access to the XRPL&rsquo;s native DEX and
			AMM pools. The team behind xrp.cafe built it, and it has grown into one of the top DEX
			gateways on the network by trading volume.
		</p>
		<p>
			I designed the complete visual identity over a year-long engagement, from logo concept through
			full brand guidelines with co-branding rules: a system built to grow with the product.
		</p>
	{/snippet}

	<TextSection title="Pencil + Paper = Ledger">
		<p>
			Two elemental shapes make the mark. A diagonal form is the pencil: the act of recording. A
			rounded square is the paper: the surface that holds the record. Together they read as a single
			icon: a ledger, a record of transactions.
		</p>
		<p>
			Two shapes, one idea, no decoration. The mark survives any scale, 16px favicon to billboard,
			because there&rsquo;s nothing extra to lose at small sizes. For a product that lives in
			Telegram chats, a web trading interface, and small mobile screens, that scalability was the
			core requirement. I designed the whole identity around it.
		</p>
	</TextSection>

	<TextSection title="Lockups & Typography">
		<p>
			The primary lockup pairs the icon with &ldquo;FIRST LEDGER&rdquo; in a heavy extended
			grotesque; the secondary shortens it to &ldquo;FL&rdquo; for compact contexts. Both carry
			clear-space rules measured in multiples of the icon&rsquo;s own width, so spacing never
			depends on anyone&rsquo;s eye.
		</p>
		<p>
			I chose extended letterforms to counter the condensed, aggressive type that dominates crypto.
			Width signals confidence and stability, and both matter when you ask people to route real
			money through your platform. The type system runs three weights of the same extended family:
			Heavy for headlines, Medium for subheads, Roman for body.
		</p>
	</TextSection>

	<TextSection title="Brand Pillars">
		<p>
			Fun: &ldquo;a lil meme never hurt anyone.&rdquo; Reliable: &ldquo;passion and years of
			experience.&rdquo; Fast: &ldquo;we&rsquo;re first for a reason.&rdquo;
		</p>
		<p>
			Those three words governed every visual call. The playful register kept the brand human in a
			field of self-serious competitors. The stress on speed and reliability let the same identity
			work in professional contexts, exchange listings, partnership decks, ecosystem reports,
			without a redesign.
		</p>
	</TextSection>

	<TextSection title="Co-Branding Guidelines">
		<p>
			First Ledger shares an ecosystem (and a team) with xrp.cafe, so the guidelines set exact
			co-branding rules: spacing for how the two logos sit together. With the rules written in
			advance, every collaboration looks planned, not improvised.
		</p>
		<p>
			As the platform grew into partnerships and integrations, those rules got the heaviest use.
			They kept the brand consistent across CoinGecko listings, DappRadar profiles, Messari reports,
			and co-marketing with other XRPL projects.
		</p>
	</TextSection>

	<ResultsList
		items={[
			'The identity held unchanged across every exchange listing, ecosystem report, and co-branded surface as the platform grew',
			'First Telegram-based trading bot on the XRP Ledger',
			'Consistently ranked top 2–3 DEX gateway on XRPL by trading volume (Messari)',
			'Ripple credited it with driving Q4 2024 XRPL growth: daily CLOB volume rose 1,140% QoQ',
			'Listed on CoinGecko, DappRadar, and GeckoTerminal as a tracked exchange',
			'Featured in every Messari “State of XRP Ledger” report since Q2 2024'
		]}
	/>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/firstledger/FL2_FOLIO_HERO.png',
				alt: 'First Ledger billboard mockup: The fastest way to trade'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-01.png',
				alt: 'First Ledger logo white on black'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-04.png',
				alt: 'First Ledger logo construction: Pencil + Paper = Ledger diagram'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-03.png',
				alt: 'First Ledger primary and secondary logo lockups'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-05.png',
				alt: 'First Ledger primary logo clear-space rules'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-02.png',
				alt: 'First Ledger brand pillars: Fun, Reliable, Fast'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-10.png',
				alt: 'First Ledger typography system spread'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-07.png',
				alt: 'First Ledger and xrp.cafe co-branding guidelines, primary lockup'
			},
			{
				type: 'image',
				src: '/images/firstledger/FL2_BRAND_GUIDELINES-08.png',
				alt: 'First Ledger and xrp.cafe co-branding guidelines, secondary lockup'
			}
		]}
	/>
</CaseStudy>
