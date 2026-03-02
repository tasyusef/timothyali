import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, LiveEmbed } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "Sonde — Product Design & Development",
  description:
    "A real-time XRPL block explorer designed and built from scratch — live WebSocket data, account exploration, and a typographically driven dark-mode interface.",
  openGraph: {
    title: "Sonde — Product Design & Development — Timothy Ali",
    description:
      "A real-time XRPL block explorer designed and built from scratch — live WebSocket data, account exploration, and a typographically driven dark-mode interface.",
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
          "A real-time XRPL block explorer designed and built from scratch — live WebSocket data, account exploration, and a typographically driven dark-mode interface.",
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
        tools: "Figma, Next.js, TypeScript, Tailwind CSS",
        overview:
          "Sonde is a real-time block explorer for the XRP Ledger — a self-initiated product designed and built from scratch. The core challenge was making dense, fast-moving blockchain data feel clear and navigable. Every design decision, from the three-font type system to the transaction-type color coding, was made to turn raw ledger data into something you can actually read. The stack is Next.js 16 with live WebSocket connections and Server-Sent Events for real-time data streaming.",
        heroImage: "/images/sonde/hero.png",
        heroAlt: "Sonde XRPL block explorer — dashboard with real-time price chart and network stats",
      }}
      nextProject={{ title: "xrp.cafe", slug: "xrpcafe" }}
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
          display and headings — geometric and confident. DM Sans covers body
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
          than overwhelming. The dashboard serves as the entry point — live
          price, network stats, recent ledgers, and trending tokens all visible
          without scrolling.
        </p>
        <p>
          From there, a universal search bar handles any input: paste an address,
          a transaction hash, a ledger index, or a token name — it detects the
          type and routes you to the right page. Account pages use progressive
          disclosure through tabs: holdings first (what most people want), then
          transactions, trust lines, NFTs, offers, and escrows. React Suspense
          streams each section independently so the page is usable before all
          data loads.
        </p>
      </TextSection>

      <TextSection title="Data Visualization">
        <p>
          The network health dashboard is the most data-dense page — 30-day
          price history with OHLCV candlestick data, live fee monitoring, server
          health indicators, transaction type distribution, and ledger
          performance metrics. All rendered with Recharts and updating in
          real time via Server-Sent Events.
        </p>
        <p>
          Token detail pages show orderbook depth charts and live market data.
          The challenge was density without clutter — every chart earns its
          space by answering a specific question. What&apos;s the price doing?
          Where&apos;s the liquidity? How active is this market? No decorative
          elements, no chartjunk.
        </p>
      </TextSection>

      <TextSection title="Real-time Engineering">
        <p>
          Sonde maintains a persistent WebSocket connection to the XRP Ledger
          mainnet with automatic failover across three nodes. A singleton client
          pattern ensures one connection serves the entire application. On the
          server side, a Live Data Manager broadcasts real-time events — new
          ledgers, fee updates, price changes — to all connected clients via
          Server-Sent Events.
        </p>
        <p>
          Every API response is cached with an LRU strategy: immutable data like
          completed transactions and closed ledgers are cached indefinitely,
          while mutable data like account balances expire after 10 seconds.
          Account history pages fully paginate through XRPL markers with
          per-loop error handling, ensuring no transactions are missed even for
          accounts with thousands of entries.
        </p>
      </TextSection>

      <LiveEmbed
        label="Live Explorer"
        description="Explore the live Sonde block explorer. Browse accounts, tokens, NFTs, and real-time network data directly."
        href="https://sonde-production.up.railway.app/"
        src="https://sonde-production.up.railway.app/"
        title="Sonde XRPL Block Explorer"
        iframeBg="bg-[var(--color-background)]"
      />

      <TextSection title="Outcome">
        <p>
          Sonde is a fully functional block explorer covering accounts,
          transactions, tokens, NFTs, and network health — all with real-time
          data. What started as a design exercise in information density became
          a complete product: a modern, typographically driven interface for
          the XRP Ledger that treats blockchain data with the same clarity and
          structure as any well-designed financial tool.
        </p>
      </TextSection>

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/sonde/hero.png", alt: "Sonde dashboard — real-time XRP price chart with network stats and live ledger feed" },
          { type: "image", src: "/images/sonde/landing.png", alt: "Sonde landing page — Built for power users" },
          { type: "image", src: "/images/sonde/account.png", alt: "Account explorer — balance, holdings, and transaction history with tabbed navigation" },
          { type: "image", src: "/images/sonde/tokens.png", alt: "Token explorer — top XRPL tokens by market cap with price, volume, and holder data" },
          { type: "image", src: "/images/sonde/nfts.png", alt: "NFT explorer — top marketplaces, collections, and recent mints with image previews" },
          { type: "image", src: "/images/sonde/network.png", alt: "Network health dashboard — 30-day price history, fee monitoring, and transaction distribution" },
        ]}
      />
    </CaseStudyLayout>
  );
}
