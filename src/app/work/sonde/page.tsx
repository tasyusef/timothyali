import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, LiveEmbed } from "@/components/CaseStudySection";
import { getNextProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Sonde — Product Design & Development",
  description:
    "A real-time XRPL block explorer and analytics platform — network insights, DEX analytics, portfolio tracking, OHLCV price charts, and live on-chain data, designed and built from scratch.",
  openGraph: {
    title: "Sonde — Product Design & Development — Timothy Ali",
    description:
      "A real-time XRPL block explorer and analytics platform — network insights, DEX analytics, portfolio tracking, OHLCV price charts, and live on-chain data, designed and built from scratch.",
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
          "A real-time XRPL block explorer and analytics platform — network insights, DEX analytics, portfolio tracking, OHLCV price charts, and live on-chain data, designed and built from scratch.",
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
        tools: "Figma, Next.js, TypeScript, Tailwind CSS, Recharts, PostgreSQL, WebSockets, SSE",
        overview:
          "Sonde is a real-time block explorer and analytics platform for the XRP Ledger — a self-initiated product designed and built from scratch. What started as a block explorer grew into a full analytics suite: network insights with OHLCV price charting, DEX volume and AMM liquidity tracking, a token directory with 1,000+ assets, wallet-connected portfolio tracking, payment corridor analysis, and deep account exploration — all powered by live WebSocket connections, Server-Sent Events, and a PostgreSQL database. Every design decision was made to turn dense, fast-moving blockchain data into something clear and navigable.",
      }}
      nextProject={getNextProject("sonde")}
    >
      <TextSection title="Brand Identity">
        <p>
          The brand starts with the name — Sonde, from the French word for
          &ldquo;probe.&rdquo; Something that goes deep and reports back. The
          visual identity follows: a salmon accent color (#E8856C) against dark
          surfaces, giving the interface warmth without sacrificing the
          seriousness blockchain data demands.
        </p>
        <p>
          The type system uses three fonts with distinct roles. Satoshi handles
          display headings — geometric and confident. DM Sans covers body
          text and navigation — clean and readable at any size. IBM Plex Mono
          renders every address, hash, and amount — because blockchain data
          needs to be monospaced or it&apos;s unreadable. Every transaction type
          gets its own color family: blue for payments, gold for offers, purple
          for NFT operations, green for trust lines, pink for AMM actions.
        </p>
      </TextSection>

      <TextSection title="Information Architecture">
        <p>
          The XRP Ledger produces a ledger every 3–5 seconds, each containing
          hundreds of transactions across dozens of types. The architecture
          challenge was organizing this into pages that feel browsable rather
          than overwhelming. The primary navigation covers eight sections:
          Search, Portfolio, Network, DEX, Tokens, NFTs, Docs, and About —
          each serving a distinct analytical purpose.
        </p>
        <p>
          A universal search bar handles any input: paste an address,
          a transaction hash, a CTID, a ledger index, or a token name — it
          detects the type and routes you to the right page. Account pages use
          progressive disclosure through twelve tabs: transactions, holdings,
          trust lines, NFTs, AMM pools, offers, escrows, channels, MPTokens,
          objects, settings, activations, and ancestry. React Suspense streams
          each section independently so the page is usable before all data loads.
        </p>
      </TextSection>

      <TextSection title="Network Analytics & Data Visualization">
        <p>
          The network insights page is the most data-dense view — a full OHLCV
          candlestick chart powered by TradingView with multi-timeframe support
          (1m to All), live XRP price and market cap, 24-hour activity metrics,
          circulating supply data, a fee monitor, live transaction type
          distribution, and an amendment voting tracker. Three sub-tabs —
          Overview, Analytics, and Amendment Voting — organize the depth.
        </p>
        <p>
          The analytics tab goes deeper with configurable time-series charts:
          fee burn tracking, transaction volume by type, payment corridor flows
          showing cross-currency throughput ranked by XRP volume, and ledger
          performance metrics. All rendered with Recharts and updating in
          real time via Server-Sent Events, with 7-day, 30-day, 90-day, and
          all-time period selectors on every chart.
        </p>
      </TextSection>

      <TextSection title="DEX & Portfolio">
        <p>
          The DEX analytics page tracks the XRP Ledger&apos;s built-in
          decentralized exchange — trade volume over time, AMM liquidity with
          total value locked across 60+ pools, fee revenue estimates broken
          down by pool, and market movers. The data refreshes every 30 seconds
          with time-period filtering (7D, 30D, 90D, All) and pool-level
          granularity.
        </p>
        <p>
          The portfolio tracker lets users connect their XRPL wallet — via
          Joey or Xaman — to view holdings and track historical performance.
          The token directory catalogs over 1,000 XRPL-issued assets with
          price, market cap, 24-hour volume, holder count, and trust line data,
          all sortable and filterable with a dedicated analytics sub-tab for
          deeper token-level exploration.
        </p>
      </TextSection>

      <TextSection title="Real-time Engineering & Data Layer">
        <p>
          Sonde maintains a persistent WebSocket connection to the XRP Ledger
          mainnet via Honeycluster infrastructure with automatic failover. A
          singleton client pattern ensures one connection serves the entire
          application. On the server side, a Live Data Manager broadcasts
          real-time events — new ledgers, fee updates, price changes — to all
          connected clients via Server-Sent Events.
        </p>
        <p>
          A PostgreSQL database handles persistent storage — historical
          analytics, aggregated DEX metrics, fee burn data, and token snapshots
          that would be too expensive to compute on every request. Every API
          response is cached with an LRU strategy: immutable data like
          completed transactions and closed ledgers are cached indefinitely,
          while mutable data like account balances and market prices expire
          after short intervals. Account history pages fully paginate through
          XRPL markers with per-loop error handling, ensuring no transactions
          are missed even for accounts with thousands of entries.
        </p>
      </TextSection>

      <LiveEmbed
        label="Live Explorer"
        description="Explore the live Sonde block explorer. Browse accounts, tokens, DEX analytics, network insights, and real-time on-chain data directly."
        href="https://sondelab.com/"
        src="https://sondelab.com/"
        title="Sonde XRPL Block Explorer"
        iframeBg="bg-page"
      />

      <TextSection title="Outcome">
        <p>
          Sonde is a fully functional analytics platform covering nine feature
          areas — network insights, DEX analytics, price charting, payment
          corridors, live ledger feeds, account exploration, transaction
          decoding, token analytics, and portfolio tracking — all with
          real-time data. What started as a design exercise in information
          density became a complete product at sondelab.com: a modern,
          typographically driven interface for the XRP Ledger that treats
          blockchain data with the same clarity and structure as any
          well-designed financial tool.
        </p>
      </TextSection>

    </CaseStudyLayout>
  );
}
