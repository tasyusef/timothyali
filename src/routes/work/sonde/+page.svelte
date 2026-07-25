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
		'A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite. Designed, built, and shipped to production solo.';
</script>

<Seo
	title="Sonde — Product Design & Development"
	{description}
	ogKey="sonde"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: 'Sonde — Product Design & Development',
		description,
		author: { '@type': 'Person', name: 'Timothy Ali', url: SITE_URL },
		dateCreated: '2025-01-01',
		url: `${SITE_URL}/work/sonde`,
		image: imageUrl('/images/sonde/hero.png', SITE_URL)
	}}
/>

<CaseStudy
	title="Sonde"
	category="Product, Code & Art Direction"
	year="2025–2026"
	role="Designer & Developer (sole creator)"
	tools="Figma, Next.js, TypeScript, Tailwind CSS, Recharts, PostgreSQL, ClickHouse, Neo4j, WebSockets, SSE"
	heroImage="/images/sonde/hero.png"
	heroAlt="Sonde: Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking for the XRP Ledger"
	nextProject={getNextProject('sonde')}
>
	{#snippet overview()}
		<p class="mb-4">
			A real-time block explorer, analytics platform, and on-chain intelligence suite for the XRP
			Ledger: a self-initiated product I designed, built, and ran solo, end to end.
		</p>
		<ul class="space-y-2">
			<li>— Block explorer, network analytics, and a trading portfolio dashboard</li>
			<li>— Intelligence layer: smart money scoring, fund tracing, AI investigations</li>
			<li>— Three databases fed by three parallel XRPL WebSocket connections</li>
			<li>— Wallet-based auth and a commercial subscription product</li>
		</ul>
	{/snippet}

	<TextSection title="Design Philosophy">
		<p>
			Sonde started from a frustration: most blockchain explorers are grids of raw hex with nothing
			prioritized, as if opacity were a feature. A new user should land on an address and understand
			it without feeling they wandered into a terminal. So type carried the hierarchy, and the page
			had to read before any color arrived.
		</p>
		<p>
			Three users had to be served at once. The newcomer wanted plain English: what does this
			account hold, is any of it unusual. The trader wanted a dashboard: PnL, cost basis,
			allocation, performance versus XRP. The analyst wanted depth: raw blobs, six-hop fund tracing,
			risk scoring. Every screen answered the newcomer at the surface and unfolded for the
			specialist in deeper tabs. Motion followed the same restraint as color: eased transitions,
			slow pulses on live indicators, numbers that faded rather than snapped. Most people never
			noticed it. They noticed the product felt calm.
		</p>
	</TextSection>

	<TextSection title="Brand Identity">
		<p>
			The name came first. Sonde, French for probe, is an instrument you send into something to
			measure what&rsquo;s happening inside and report back. The color system was narrow: a cool
			slate foundation of near-black surfaces and muted neutrals, so the interface read as calm even
			while showing ten thousand transactions a minute. Against that, one warm accent: salmon
			#E8856C, the only saturated color in the core chrome. That scarcity was the point. When salmon
			appeared on a live indicator or a key metric, you knew it mattered.
		</p>
		<p>
			Three fonts had three jobs: Satoshi for display, DM Sans for product UI and body, IBM Plex
			Mono for every address, hash, and amount, because financial identifiers must be monospaced to
			stay scannable. Transaction types carried a quiet semantic color system: payments blue, DEX
			fills gold, NFT operations purple, trust lines green, AMM actions pink, always as small dots
			or single-word tags, never full colored rows. A trained eye could scan a thousand-row feed and
			spot the pattern without reading every line.
		</p>
	</TextSection>

	<TextSection title="The Product">
		<p>
			The XRP Ledger closes a ledger every 3–5 seconds, each carrying hundreds of transactions
			across dozens of types. A universal search bar took any input (an address, a transaction hash,
			a CTID, a ledger index, or a token name), detected the type, and routed accordingly. Account
			pages ran twelve tabs ordered by depth, from transactions and holdings out to trust lines,
			NFTs, AMM pools, offers, and escrows, with React Suspense streaming each section so the page
			was usable before all the data arrived.
		</p>
		<p>
			The explorer covered network analytics (live price and market cap, candlestick charts, a fee
			monitor, amendment voting), the DEX with AMM liquidity across 60+ pools, a wallet-connected
			portfolio tracker, and a directory of 1,000+ XRPL assets. On top sat the intelligence layer,
			which turned an explorer into an analytical product: smart money scoring ranked wallets by
			profitability and consistency, Neo4j pathfinding traced value across up to six hops, account
			labels classified addresses with cited evidence, and a risk module flagged wash trading. A
			Claude Sonnet agent with scoped tool access ran multi-turn investigations across all of it in
			a single thread.
		</p>
	</TextSection>

	<ResultsList
		title="Architecture"
		items={[
			'Postgres for OLTP: app data, sessions, subscriptions, wallet portfolios, smart money scores, account labels, and rollup tables',
			'ClickHouse for OLAP: the raw stream of transactions, DEX fills, and trust line events, with materialized views so dashboards hit pre-aggregated data',
			'Neo4j for the graph: accounts as nodes, payments and trades as edges, which made six-hop fund tracing cheap in a way SQL cannot match',
			'Three separate XRPL WebSocket connections for user requests, ingestion, and background intel jobs, so a slow ingest never blocked an account page',
			'Real-time events fanned out over Server-Sent Events behind an LRU cache, so pages never flashed empty',
			'No passwords and no emails: users proved wallet ownership with a single-use nonce in a dummy transaction and got a JWT back',
			'Two tiers, Free and Pro: Pro unlocked the portfolio suite and the full intelligence layer, with per-user AI limits and bring-your-own-key for power users'
		]}
	/>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/sonde/network.png',
				alt: 'Sonde network insights: live XRP price, market cap, TradingView chart, and latest ledgers'
			},
			{
				type: 'image',
				src: '/images/sonde/markets.png',
				alt: 'Sonde markets: XRPL token rankings by price, market cap, volume, and holders'
			},
			{
				type: 'image',
				src: '/images/sonde/account.png',
				alt: 'Sonde account page: balance, smart money score, risk profile, and counterparty graph'
			},
			{
				type: 'image',
				src: '/images/sonde/transaction.png',
				alt: 'Sonde transaction detail: identifiers, outcome, balance changes, and affected ledger nodes'
			},
			{
				type: 'image',
				src: '/images/sonde/portfolio.png',
				alt: 'Sonde portfolio: total value, performance chart, allocation, and watchlist'
			},
			{
				type: 'image',
				src: '/images/sonde/smart-money.png',
				alt: 'Sonde Smart Money leaderboard: scored wallets ranked by PnL, win rate, and Sharpe'
			},
			{
				type: 'image',
				src: '/images/sonde/smart-money-detail.png',
				alt: 'Sonde Smart Money detail: score factors, score history, and tokens traded'
			},
			{
				type: 'image',
				src: '/images/sonde/ask-the-ledger.png',
				alt: 'Ask the Ledger: natural-language queries over the XRP Ledger'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			Sonde shipped to production as a three-part product: a public block explorer, a network
			analytics suite, and an intelligence layer, with wallet-based auth and a subscription that
			took payment in both fiat and crypto. What began as a design exercise in information density
			became a commercial product that gave on-chain data the clarity of a well-made financial tool.
			I ran it end to end, design, engineering, and operations, until I shut down the hosted
			instance.
		</p>
	</TextSection>
</CaseStudy>
