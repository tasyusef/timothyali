<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import { getNextProject } from '$lib/projects';
	import { imageUrl } from '$lib/images';
	import { SITE_URL } from '$lib/site';

	const description =
		'A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite — designed, built, and shipped to production from scratch.';
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
	heroAlt="Sonde — Decode the XRPL. Real-time intelligence, analytics, and portfolio tracking for the XRP Ledger"
	nextProject={getNextProject('sonde')}
>
	{#snippet overview()}
		<p class="mb-4">
			A real-time block explorer, analytics platform, and on-chain intelligence suite for the XRP
			Ledger — a self-initiated product I designed, built, and ran solo end to end.
		</p>
		<ul class="space-y-2">
			<li>— Block explorer, network analytics, and a trading portfolio dashboard</li>
			<li>— Intelligence layer: smart money scoring, fund tracing, AI investigations</li>
			<li>— Polyglot data stack across three parallel XRPL WebSocket connections</li>
			<li>— Wallet-based auth and a commercial subscription product</li>
		</ul>
	{/snippet}

	<TextSection title="Design Philosophy">
		<p>
			Sonde started from a frustration: almost every blockchain explorer I used was dense, hostile,
			and ugly — grids of raw hex with nothing prioritized, as if opacity were a feature. A new user
			should land on an address and understand what they&rsquo;re looking at without feeling like
			they wandered into a terminal. The fix was to let type do the work. Blockchain data is
			inherently dense, so the hierarchy had to be rigorous — display type for context, body for
			narrative, monospace for every on-chain identifier, muted uppercase labels — and the page had
			to read before color was ever introduced. Color then worked as reinforcement: one warm accent
			for what mattered, never the primary signal.
		</p>
		<p>
			The product served three users without compromising for any of them. The newcomer wanted plain
			English — what did this account hold, was any of it unusual. The trader wanted a real
			dashboard: PnL, cost basis, allocation, performance versus XRP. The analyst wanted depth — raw
			blobs, six-hop fund tracing, risk scoring. Every screen served the newcomer at the surface
			while deeper tabs unfolded for the specialist — progressive disclosure, not two different
			products — and the natural-language query layer was the bridge between them. Motion followed
			the same rule as color: eased transitions, slow pulses on live indicators, numbers that faded
			rather than snapped. Most users never noticed it; they just noticed the product felt calm.
			That was the principle — less noise.
		</p>
	</TextSection>

	<TextSection title="Brand Identity">
		<p>
			The name came first. Sonde — French for probe — is an instrument you send into something to
			measure what&rsquo;s happening inside and report back. The product did the same for the XRP
			Ledger: it went in, took measurements, and reported back in a way a human could act on. The
			color system was deliberately narrow — a cool slate foundation of near-black surfaces and
			muted neutrals, so the interface read as calm even while showing ten thousand transactions a
			minute. Against that, one warm accent: salmon #E8856C, the only saturated color in the core
			chrome. That scarcity was the point. When salmon appeared on a live indicator or a key metric,
			you knew it mattered.
		</p>
		<p>
			The type system ran three fonts with non-overlapping roles — Satoshi for display and headings,
			DM Sans for product UI and body, IBM Plex Mono for every address, hash, and amount, because
			financial identifiers have to be monospaced or they stop being scannable. Within that
			restrained palette, transaction types carried a quiet semantic color system: payments blue,
			DEX fills gold, NFT operations purple, trust lines green, AMM actions pink — always as small
			dots or single-word tags, never full colored rows. It let a trained eye scan a thousand-row
			activity feed and spot the pattern without reading every line.
		</p>
	</TextSection>

	<TextSection title="The Product">
		<p>
			The XRP Ledger closes a ledger every 3–5 seconds, each carrying hundreds of transactions
			across dozens of types. The challenge was organizing that into pages that felt browsable
			rather than overwhelming. A universal search bar took any input — an address, a transaction
			hash, a CTID, a ledger index, or a token name — detected the type, and routed accordingly.
			Account pages ran twelve tabs that unfolded in order of depth (transactions, holdings, trust
			lines, NFTs, AMM pools, offers, escrows, and more), with React Suspense streaming each section
			independently so the page was usable before all data loaded.
		</p>
		<p>
			The explorer spanned network analytics — OHLCV candlesticks, live price and market cap, a fee
			monitor, transaction-type distribution, and amendment voting — the DEX with AMM liquidity
			across 60+ pools, a wallet-connected portfolio tracker (cost basis, realized PnL, performance
			versus XRP), and a directory of 1,000+ XRPL assets. On top sat the intelligence layer, which
			was what turned Sonde from an explorer into an analytical product. Smart money scoring ranked
			wallets by profitability and consistency; Neo4j pathfinding traced how value moved across up
			to six hops; account labels classified addresses with cited evidence; a risk module flagged
			wash trading. A Claude Sonnet agent with scoped tool access ran multi-turn investigations
			across all of it — pulling trades, tracing flows, and generating structured risk reports in a
			single thread.
		</p>
	</TextSection>

	<TextSection title="Architecture">
		<p>
			Sonde was a polyglot persistence system — three databases, each chosen for what it was
			actually good at. Postgres handled OLTP: app data, sessions, subscriptions, wallet portfolios,
			smart money scores, account labels, and the hourly and daily aggregation tables. ClickHouse
			handled OLAP: the raw firehose of transactions, DEX fills, and trust line events, with
			materialized views rolling up volume and active accounts so dashboards hit pre-aggregated data
			instead of cold partitions. Neo4j handled graph: accounts as nodes, payments and trades as
			edges, making fund-tracing queries cheap in a way SQL can&rsquo;t match. Each data type had
			exactly one authoritative store, and cross-store queries resolved IDs in Postgres first, then
			filtered the others.
		</p>
		<p>
			Three separate XRPL WebSocket connections kept the workloads isolated — one for user-facing
			requests, one for the ingestion pipeline&rsquo;s heavy fetches, one for background intel jobs
			— so a slow ingest could never block someone loading an account page. A server-side Live Data
			Manager fanned real-time events out to clients over Server-Sent Events, layered behind an LRU
			cache and SWR on the client so pages never flashed empty. Auth had no passwords and no emails:
			users signed in by proving they owned a wallet — the client embedded a single-use nonce in a
			dummy transaction, and the server verified the signature and issued a JWT. The commercial
			model was two tiers, Free and Pro, with Pro unlocking the portfolio suite and the full
			intelligence layer; managed AI ran on per-user limits, and power users could bring their own
			API key to bypass them.
		</p>
	</TextSection>

	<Gallery
		items={[
			{
				type: 'image',
				src: '/images/sonde/network.png',
				frame: true,
				alt: 'Sonde network insights — live XRP price, market cap, TradingView chart, and latest ledgers'
			},
			{
				type: 'image',
				src: '/images/sonde/markets.png',
				frame: true,
				alt: 'Sonde markets — XRPL token rankings by price, market cap, volume, and holders'
			},
			{
				type: 'image',
				src: '/images/sonde/account.png',
				frame: true,
				alt: 'Sonde account page — balance, smart money score, risk profile, and counterparty graph'
			},
			{
				type: 'image',
				src: '/images/sonde/transaction.png',
				frame: true,
				alt: 'Sonde transaction detail — identifiers, outcome, balance changes, and affected ledger nodes'
			},
			{
				type: 'image',
				src: '/images/sonde/portfolio.png',
				frame: true,
				alt: 'Sonde portfolio — total value, performance chart, allocation, and watchlist'
			},
			{
				type: 'image',
				src: '/images/sonde/smart-money.png',
				frame: true,
				alt: 'Sonde Smart Money leaderboard — scored wallets ranked by PnL, win rate, and Sharpe'
			},
			{
				type: 'image',
				src: '/images/sonde/smart-money-detail.png',
				frame: true,
				alt: 'Sonde Smart Money detail — score factors, score history, and tokens traded'
			},
			{
				type: 'image',
				src: '/images/sonde/ask-the-ledger.png',
				frame: true,
				alt: 'Ask the Ledger — natural-language queries over the XRP Ledger'
			}
		]}
	/>

	<TextSection title="Outcome">
		<p>
			Sonde shipped to production as a three-part product — a public block explorer, a network
			analytics suite, and an intelligence layer — on a polyglot data architecture with wallet-based
			auth and a subscription model that took payments in both fiat and crypto. What began as a
			design exercise in information density became a complete, commercially operating product: a
			real-time window into the XRP Ledger that treated on-chain data with the same clarity and
			structure as any well-designed financial tool. I ran it end to end — design, engineering, and
			operations — before sunsetting the hosted instance.
		</p>
	</TextSection>
</CaseStudy>
