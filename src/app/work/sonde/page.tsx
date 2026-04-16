import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, LiveEmbed } from "@/components/CaseStudySection";
import { getNextProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Sonde — Product Design & Development",
  description:
    "A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite — polyglot data architecture, wallet-based auth, smart money scoring, fund tracing, and AI-powered investigations. Designed and built from scratch.",
  openGraph: {
    title: "Sonde — Product Design & Development — Timothy Ali",
    description:
      "A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite — polyglot data architecture, wallet-based auth, smart money scoring, fund tracing, and AI-powered investigations. Designed and built from scratch.",
    url: "https://www.timothyali.com/work/sonde",
  },
};

export default function SondePage() {
  return (
    <CaseStudyLayout
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "Sonde — Product Design & Development",
        description:
          "A real-time XRPL block explorer, analytics platform, and on-chain intelligence suite — polyglot data architecture, wallet-based auth, smart money scoring, fund tracing, and AI-powered investigations. Designed and built from scratch.",
        author: { "@type": "Person", name: "Timothy Ali", url: "https://www.timothyali.com" },
        dateCreated: "2026-01-01",
        url: "https://www.timothyali.com/work/sonde",
        image: "https://www.timothyali.com/images/sonde/hero.png",
      }}
      header={{
        title: "Sonde",
        category: "Product Design & Development",
        year: "2026",
        role: "Designer & Developer (sole creator)",
        timeline: "Ongoing",
        tools: "Figma, Next.js, TypeScript, Tailwind CSS, Recharts, PostgreSQL, ClickHouse, Neo4j, WebSockets, SSE, Claude Haiku 4.5",
        overview: (
          <>
            <p className="mb-4">
              A real-time block explorer, analytics platform, and on-chain
              intelligence suite for the XRP Ledger — self-initiated,
              designed and built from scratch. Running live at sondelab.com.
            </p>
            <ul className="space-y-2">
              <li>— Network analytics and a trading-focused portfolio dashboard</li>
              <li>— Token directory with 1,000+ assets</li>
              <li>— Intelligence layer: smart money scoring, fund tracing, AI investigations, risk scoring</li>
              <li>— Polyglot stack (Postgres, ClickHouse, Neo4j)</li>
              <li>— Three dedicated XRPL WebSocket connections</li>
              <li>— Wallet-based auth and a live subscription product</li>
            </ul>
          </>
        ),
      }}
      nextProject={getNextProject("sonde")}
    >
      <TextSection title="Design Philosophy">
        <p>
          Sonde started from a specific frustration. Almost every
          blockchain explorer I used was hard to understand and not nice
          to look at — dense grids of raw hex, nothing prioritized,
          designed as if opacity was a feature. I didn&rsquo;t want Sonde
          to be scary. A new user should land on an address and understand
          what they&rsquo;re looking at without feeling like they
          stumbled into a terminal.
        </p>
        <p>
          The fix was to let type do the work. Blockchain data is
          inherently dense, so the hierarchy has to be rigorous: display
          type for context, body type for narrative, monospace for every
          on-chain identifier, tabular numbers so columns align, muted
          uppercase labels. The page reads before color is introduced.
          Color then works as reinforcement — one warm accent for what
          matters, a quiet semantic palette for transaction types — never
          as the primary signal.
        </p>
        <p>
          The product has to serve three users without compromising for
          any of them. The non-crypto-native wants plain English — what
          does this account hold, is any of this unusual. The trader wants
          a proper dashboard: P&amp;L, cost basis, allocation, realized
          gains, performance versus XRP, AMM positions. The developer or
          forensics analyst wants depth — raw blobs, CTIDs, six-hop fund
          tracing, risk scoring, multi-turn investigations. Every screen
          serves the newcomer at the surface while deeper tabs unfold for
          the specialist. Progressive disclosure, not two different
          products. The natural-language query layer is the bridge: a
          trader can ask &ldquo;show this wallet&rsquo;s biggest winners
          this month,&rdquo; a forensics user can ask to trace funds back
          six hops — same interface, different depth.
        </p>
        <p>
          Motion follows the same rule as color — subtle, intentional,
          mostly invisible. Eased page transitions, slow pulses on live
          indicators, numbers that fade rather than snap, hover states
          that shift opacity instead of color. Most users will never
          notice the animations; they&rsquo;ll just notice the product
          feels calm. That&rsquo;s the broader principle: less noise.
          Dense data is not an excuse for dense UI. Every surface has to
          earn its place, and the measure isn&rsquo;t how much Sonde
          shows — it&rsquo;s how quickly the right information surfaces.
        </p>
      </TextSection>

      <TextSection title="Brand Identity">
        <p>
          The name comes first. Sonde — French for probe. A sonde is an
          instrument you send into something to measure what&rsquo;s
          happening inside and report back. Weather sondes go up into the
          atmosphere; oceanographic sondes go down into the water column;
          medical sondes enter the body. The product does the same for the
          XRP Ledger: it goes in, takes measurements, and reports back in a
          way a human can act on.
        </p>
        <p>
          The color system is deliberately narrow. A cool slate foundation —
          near-black surfaces, muted neutrals — so the interface reads as
          calm even when it&rsquo;s showing ten thousand transactions a
          minute. Against that, one warm accent: salmon #E8856C. It&rsquo;s
          the only saturated color that appears anywhere in the core chrome.
          That scarcity is the point. When salmon shows up — on a live
          indicator, an active nav item, a key metric — you know it matters.
          Dark mode is the primary theme because traders and analysts spend
          hours in the product; light mode is the option, not the default.
        </p>
        <p>
          The type system uses three fonts with distinct, non-overlapping
          roles. Satoshi carries display and marketing headings — geometric,
          confident, the voice of the brand. DM Sans handles product UI,
          body text, labels, and navigation — clean, readable at any size,
          optimized for dense layouts. IBM Plex Mono renders every address,
          transaction hash, ledger index, and raw amount — because financial
          identifiers have to be monospaced or they stop being scannable.
          Pairing a geometric sans with a humanist sans with a technical
          monospace gives the product three clear registers, and every
          string in the UI belongs to exactly one of them.
        </p>
        <p>
          Within that restrained palette, transaction types get a semantic
          color system. Payments are blue. Offers and DEX fills are gold.
          NFT operations are purple. Trust lines are green. AMM actions are
          pink. These are always subordinate to the grayscale — they
          appear as small colored dots or single-word tags, never as full
          colored rows or backgrounds — but they let a trained eye scan a
          thousand-row activity feed and spot the pattern without reading
          every line. Color does the work that an icon system would do
          elsewhere, and it does it without adding visual weight.
        </p>
      </TextSection>

      <TextSection title="Information Architecture">
        <p>
          The XRP Ledger produces a ledger every 3–5 seconds, each containing
          hundreds of transactions across dozens of types. The architecture
          challenge was organizing this into pages that feel browsable rather
          than overwhelming. The primary navigation covers the explorer
          (Search, Portfolio, Network, DEX, Tokens, NFTs) and the intelligence
          layer (Intel overview, Trace, Investigate, Smart Money, Risk,
          Alerts, Watchlist) — each serving a distinct analytical purpose,
          with Docs and About rounding out the surface.
        </p>
        <p>
          A universal search bar handles any input: paste an address, a
          transaction hash, a CTID, a ledger index, or a token name — it
          detects the type and routes you to the right page. Account pages
          use progressive disclosure through twelve tabs: transactions,
          holdings, trust lines, NFTs, AMM pools, offers, escrows, channels,
          MPTokens, objects, settings, activations, and ancestry. React
          Suspense streams each section independently so the page is usable
          before all data loads.
        </p>
      </TextSection>

      <TextSection title="Network Analytics & Markets">
        <p>
          The network page is the most data-dense view — a full OHLCV
          candlestick chart with multi-timeframe support, live XRP price and
          market cap, 24-hour activity metrics, circulating supply, fee
          monitor, live transaction type distribution, and an amendment
          voting tracker. A deeper analytics tab adds configurable
          time-series charts for fee burn, transaction volume by type,
          payment corridor flows ranked by XRP volume, and ledger
          performance — all rendered with Recharts and updating in real time
          via Server-Sent Events.
        </p>
        <p>
          The DEX page tracks the XRP Ledger&rsquo;s built-in decentralized
          exchange — trade volume, AMM liquidity with total value locked
          across 60+ pools, fee revenue by pool, and market movers. The
          portfolio tracker lets users connect their wallet via Joey or
          Xaman to view holdings, cost basis (weighted-average), realized
          PnL per sale, historical balance snapshots, AMM positions, and
          performance versus XRP. The token directory catalogs over 1,000
          XRPL-issued assets with price, market cap, 24-hour volume, holder
          counts, and trust line data — all sortable, filterable, and
          drillable into per-token analytics.
        </p>
      </TextSection>

      <TextSection title="Intelligence Layer">
        <p>
          The intelligence layer is what turns Sonde from an explorer into
          an analytical product. It answers the questions a raw transaction
          feed can&rsquo;t: who are the wallets that consistently make
          money, where did these funds come from, is this activity
          organic or wash trading, and what&rsquo;s happening on this
          account I&rsquo;ve never heard of before.
        </p>
        <p>
          Smart money scoring ingests every DEX trade and scores wallets on
          profitability, timing, and consistency — surfacing the top
          performers in a leaderboard with drill-down into holdings, trade
          feeds, and trend history. Fund tracing runs Neo4j pathfinding
          across payment and DEX-trade edges to show how value moved between
          accounts across up to six hops — the kind of graph traversal that
          would be prohibitively slow in SQL. Account labels classify
          addresses (exchanges, issuers, market makers, known entities)
          with confidence scores and cited evidence, and those labels feed
          back into every other view. A risk scoring module combines wash
          trading heuristics with behavioral features to flag addresses
          that need a second look.
        </p>
        <p>
          On top of all of that sits an AI investigation layer, built on
          Claude Haiku 4.5 with scoped tool access. Natural-language query
          routes questions to the right data source. Investigation mode is
          a multi-turn, tool-calling agent: it can pull DEX trades, trace
          fund flows, fetch account labels, and generate structured risk
          reports across a single conversation thread, with every turn
          persisted to Postgres so an investigation can be resumed or
          reviewed later. Power users who prefer a stronger model can
          bring their own API key via a header and bypass rate limits
          entirely.
        </p>
      </TextSection>

      <TextSection title="Polyglot Data Architecture">
        <p>
          Sonde is a polyglot persistence system — three databases, each
          chosen for what it&rsquo;s actually good at. Trying to run the
          whole product on Postgres would have been possible for the
          explorer alone, but it would have collapsed the moment the
          intelligence layer needed to aggregate hundreds of millions of
          DEX trades or traverse a payment graph six hops deep.
        </p>
        <p>
          Postgres handles OLTP — app data, sessions, subscriptions,
          wallet-tracked portfolios, cost basis, realized PnL, smart money
          scores, account labels, investigation threads, and the hourly/daily
          aggregation tables (volume, fees, tx counts, payment corridors,
          holder snapshots). It&rsquo;s the source of truth for everything
          that needs transactional guarantees and indexed lookups.
          ClickHouse handles OLAP — the raw firehose of transactions, DEX
          fills, and trust line events, partitioned by month and ordered
          for the analytical queries the intelligence layer actually runs.
          Materialized views roll up hourly tx volume, daily active
          accounts, daily DEX pair volume, and trust line counts so
          dashboards hit pre-aggregated data instead of scanning cold
          partitions. Neo4j handles graph — accounts as nodes, payments
          and DEX trades as edges — making shortest-path, counterparty, and
          fund-tracing queries cheap in a way SQL can&rsquo;t match.
        </p>
        <p>
          Ownership is strict: each data type has exactly one authoritative
          store, and cross-store queries resolve IDs in Postgres first
          (smaller, indexed), then filter ClickHouse or Neo4j with the
          result set. Two ingestion pipelines feed the system. The main
          pipeline subscribes to XRPL ledger closes, extracts aggregations,
          and batch-upserts them to Postgres in a single transaction per
          ledger — no raw transactions stored here, which keeps Postgres
          lean at roughly 100MB/month. The intel pipeline polls
          `ingested_ledgers` every five seconds and writes the raw layer
          to ClickHouse and Neo4j with independent pointers, so a failure
          in one store doesn&rsquo;t block the other. Both pipelines are
          idempotent and resumable, with backfill scripts for historical
          catch-up.
        </p>
      </TextSection>

      <TextSection title="Real-time Infrastructure">
        <p>
          Sonde maintains three separate persistent WebSocket connections
          to the XRP Ledger mainnet, each with its own workload. xrplClient
          serves user-facing requests and the Live Data Manager;
          ingestionClient handles the heavy expanded-ledger fetches for the
          main ingestion pipeline; intelligenceClient runs background intel
          jobs. Separating them means a slow ingestion fetch can never
          block a user loading an account page, and a background scoring
          job can never starve the real-time feed. Total capacity is
          roughly 3,000 messages per minute across the three connections,
          with round-robin across four upstream nodes and automatic
          failover.
        </p>
        <p>
          The Live Data Manager sits on the server and fans out real-time
          events — new ledgers, fee updates, price changes, transaction
          bursts — to connected clients via Server-Sent Events. Caching
          is layered: a server-side LRU caches finalized transactions
          indefinitely (immutable), with short TTLs for account data,
          ledger data, fees, orderbooks, and token detail pages. On the
          client, SWR dedupes fetches and keeps previous data during
          refetches so pages never flash empty. Account history pages
          paginate through XRPL markers with per-loop error handling,
          ensuring no transactions are missed even for accounts with
          thousands of entries.
        </p>
      </TextSection>

      <TextSection title="Auth & Monetization">
        <p>
          Sonde has no passwords, no emails, and no sign-up form. Users
          authenticate by proving they own an XRPL wallet. The primary flow
          is Joey via WalletConnect v2: the client generates a single-use
          nonce, embeds it in a dummy AccountSet transaction, and asks the
          wallet to sign. The server decodes the signed blob, verifies the
          cryptographic signature, validates the nonce, derives the address
          from the signing pubkey, and issues a JWT in an HttpOnly cookie
          with a seven-day TTL. Xaman is supported as a legacy path with
          the same session model. Subscription tier is looked up fresh
          from Postgres with a short cache — not embedded in the JWT — so
          tier changes take effect immediately without re-authentication.
        </p>
        <p>
          The commercial model is two tiers: Free and Pro. Free covers the
          full explorer, network analytics, DEX views, token and NFT
          browsing, anomaly feed, and a limited smart money leaderboard.
          Pro ($9/month or $79/year via Stripe; $8/month or $75/year via
          crypto) unlocks the portfolio suite, full smart money drill-down,
          alerts, watchlists, and the entire intelligence layer — fund
          tracing, risk scoring, AI-powered investigations. Managed AI
          runs on Claude Haiku 4.5 with per-user monthly buckets for
          queries and investigations; users who bring their own API key
          bypass the limits and pay their own compute. Crypto payments are
          monitored by a real-time watcher that verifies incoming XRP or
          RLUSD against expected subscription amounts.
        </p>
      </TextSection>

      <LiveEmbed
        label="Live Explorer"
        description="Explore the live Sonde block explorer and intelligence suite. Browse accounts, trace fund flows, run investigations, and see real-time on-chain data directly."
        href="https://sondelab.com/"
        src="https://sondelab.com/"
        title="Sonde XRPL Block Explorer"
        iframeBg="bg-page"
      />

      <TextSection title="Outcome">
        <p>
          Sonde runs in production at sondelab.com as a three-part product:
          a public block explorer, a network analytics suite, and an
          intelligence layer — all of it on a polyglot data architecture,
          wallet-based auth, and a subscription model that&rsquo;s live and
          taking payments in both fiat and crypto. What started as a design
          exercise in information density became a complete, commercially
          operating product: a real-time window into the XRP Ledger that
          treats blockchain data with the same clarity and structure as
          any well-designed financial tool, and that keeps its promise even
          as the scope expanded from explorer to analytics to on-chain
          intelligence.
        </p>
      </TextSection>

    </CaseStudyLayout>
  );
}
