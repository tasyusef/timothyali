import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, ResultsList } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "First Ledger — Brand Identity System",
  description:
    "Complete visual identity system for a token trading platform on the XRP Ledger.",
  openGraph: {
    title: "First Ledger — Brand Identity System — Timothy Ali",
    description:
      "Complete visual identity system for a token trading platform on the XRP Ledger.",
    url: "https://www.timothyali.com/work/firstledger",
  },
};

export default function FirstLedgerPage() {
  return (
    <CaseStudyLayout
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "First Ledger — Brand Identity System",
        description:
          "Complete visual identity system for a token trading platform on the XRP Ledger.",
        author: { "@type": "Person", name: "Timothy Ali", url: "https://www.timothyali.com" },
        dateCreated: "2024",
        url: "https://www.timothyali.com/work/firstledger",
        image: "https://www.timothyali.com/images/firstledger/FL2_FOLIO_HERO.png",
      }}
      header={{
        title: "First Ledger",
        category: "Brand Identity System",
        year: "2024",
        role: "Brand Designer",
        timeline: "~1 year",
        tools: "Illustrator",
        overview:
          "First Ledger is a token trading platform on the XRP Ledger — offering a Telegram bot and a full web trading interface at firstledger.net for fast, self-custody access to the XRPL's native DEX and AMM pools. Built by the same team behind xrp.cafe, it has grown into one of the top 2–3 DEX gateways on the network by trading volume. I designed the complete visual identity over a year-long engagement — from logo concept through full brand guidelines with co-branding specifications — giving the platform a brand system that could scale alongside the product.",
        heroImage: "/images/firstledger/FL2_FOLIO_HERO.png",
        heroAlt: "First Ledger billboard mockup — The fastest way to trade",
      }}
      nextProject={{ title: "Do Androids Dream", slug: "do-androids-dream" }}
    >
      {/* Copy */}
      <TextSection title="Pencil + Paper = Ledger">
        <p>
          The First Ledger mark is built from two elemental shapes. A diagonal
          form represents a pencil — the act of recording. A rounded square
          represents paper — the surface that holds the record. Combined, they
          create a single icon that reads as a ledger: a record of transactions.
        </p>
        <p>
          Two shapes, one idea, no decoration. The mark works at any scale — from
          a 16px favicon to a billboard — because there&apos;s nothing extraneous
          to lose at small sizes. For a product that spans Telegram chats, a
          full web trading interface, and compact mobile UIs, that scalability
          was a hard requirement from day one.
        </p>
      </TextSection>

      <TextSection title="Logo Lockups">
        <p>
          The primary logo pairs the icon with &ldquo;FIRST LEDGER&rdquo; in a
          heavy extended typeface — confident, wide, and engineered to feel fast.
          The secondary lockup abbreviates to &ldquo;FL&rdquo; for compact
          contexts. Both are specified with clear-space rules measured in multiples
          of the icon&apos;s own width.
        </p>
        <p>
          The extended letterforms were a deliberate choice to differentiate from
          the condensed, aggressive type that dominates crypto branding. Width
          signals confidence and stability — qualities that matter when you&apos;re
          asking people to trade real money through your platform.
        </p>
      </TextSection>

      <TextSection title="Brand Pillars">
        <p>
          Fun — &ldquo;a lil meme never hurt anyone.&rdquo; Reliable — &ldquo;passion
          and years of experience.&rdquo; Fast — &ldquo;we&apos;re first for a
          reason.&rdquo; The identity threads the needle between trader credibility
          and community personality.
        </p>
        <p>
          These pillars directly informed every visual decision. The playful
          tone kept the brand approachable in a space full of overly serious
          competitors, while the emphasis on speed and reliability ensured
          the identity could hold up in professional contexts — exchange
          listings, partnership materials, and ecosystem reports.
        </p>
      </TextSection>

      <TextSection title="Typography">
        <p>
          Three weights of an extended grotesque: Heavy Extended for headlines,
          Medium Extended for subheads, and Roman for body text. The extended
          widths give the brand a wide, confident stance that reinforces the
          &ldquo;fast&rdquo; positioning.
        </p>
      </TextSection>

      <TextSection title="Collaboration Guidelines">
        <p>
          Because First Ledger emerged from the same ecosystem as xrp.cafe, the
          brand guidelines include specific co-branding rules — exact spacing
          relationships for how the two logos sit together. Pre-built co-branding
          rules mean every collaboration looks intentional rather than improvised.
        </p>
        <p>
          As the platform grew into partnerships and ecosystem integrations,
          these guidelines became essential — ensuring the brand appeared
          consistently across CoinGecko listings, DappRadar profiles, Messari
          reports, and co-marketing materials with other XRPL projects.
        </p>
      </TextSection>

      <ResultsList
        items={[
          "First Telegram-based trading bot on the XRP Ledger",
          "Consistently ranked top 2\u20133 DEX gateway on XRPL by trading volume (Messari)",
          "Credited by Ripple for driving Q4 2024 XRPL growth \u2014 daily CLOB volume surged 1,140% QoQ",
          "Listed on CoinGecko, DappRadar, and GeckoTerminal as a tracked exchange",
          "Featured in every Messari \u201CState of XRP Ledger\u201D report since Q2 2024",
        ]}
      />

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/firstledger/FL2_FOLIO_HERO.png", alt: "First Ledger billboard mockup — The fastest way to trade" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-01.png", alt: "First Ledger logo white on black" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-04.png", alt: "Logo construction — Pencil + Paper = Ledger diagram" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-03.png", alt: "Primary and secondary logo lockups" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-05.png", alt: "Primary logo spacing" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-02.png", alt: "Brand pillars — Fun, Reliable, Fast" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-10.png", alt: "Typography system spread" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-07.png", alt: "Co-branding guidelines primary" },
          { type: "image", src: "/images/firstledger/FL2_BRAND_GUIDELINES-08.png", alt: "Co-branding guidelines secondary" },
        ]}
      />
    </CaseStudyLayout>
  );
}
