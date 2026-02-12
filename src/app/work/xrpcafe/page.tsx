import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, ResultsList } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";

export const metadata: Metadata = {
  title: "xrp.cafe — Brand Identity & Motion Design",
  description:
    "Visual identity, mascot system, and marketing design for the #1 NFT marketplace on the XRP Ledger.",
};

export default function XrpCafePage() {
  return (
    <CaseStudyLayout
      header={{
        title: "xrp.cafe",
        category: "Brand Identity & Motion Design",
        year: "2022–present",
        role: "Cofounder / Designer",
        tools: "Illustrator, After Effects",
        overview:
          "xrp.cafe is the #1 NFT marketplace on the XRP Ledger. As cofounder and one of the designers on the team, I led the brand's implementation across marketing, events, and content — taking the visual identity and extending it into social campaigns, motion graphics, event booths, and community touchpoints. In a space dominated by dark, aggressive crypto aesthetics, we positioned xrp.cafe as warm, friendly, and approachable — a cozy place for NFTs.",
        heroImage: "/images/xrpcafe/logo_16x9.png",
        heroVideo: "/videos/CAFE_EXPLORE_CREATE_TRADE.mp4",
        heroAlt: "xrp.cafe Explore Create Trade motion graphic",
      }}
      nextProject={{ title: "First Ledger", slug: "firstledger" }}
    >
      {/* Copy */}
      <TextSection title="The Mascot System">
        <p>
          The heart of the brand is its mascot: a simple, expressive coffee mug
          character with stick-figure limbs and a warm smile. What started as a
          logo mark evolved into a full cast of characters — each with its own
          personality and accessories — that became the face of the brand across
          every touchpoint.
        </p>
        <p>
          I extended the mascot system into marketing and event materials,
          creating new character variations and scenes tailored to campaigns,
          seasonal moments, and community milestones.
        </p>
      </TextSection>

      <TextSection title="Motion Graphics">
        <p>
          The &ldquo;Explore, Create, Trade&rdquo; promo distills the entire
          xrp.cafe value proposition into a fast-paced animated piece — bold
          kinetic typography, smooth character animation, and the brand&apos;s
          signature blue palette throughout. Designed for social media: vertical
          format, instantly legible on a phone screen while scrolling.
        </p>
        <p>
          Beyond the hero promo, I produced animated content across product
          launches, feature announcements, and event recaps — building a library
          of motion assets that gave the brand a consistent, energetic presence
          in feeds. Each piece balanced speed with clarity, communicating complex
          platform features in seconds.
        </p>
      </TextSection>

      <TextSection title="Social Media & Community">
        <p>
          I produced a continuous stream of social content for Twitter/X,
          Instagram, and Discord — product announcements, feature launches,
          community events, seasonal posts, partnerships, and milestone
          celebrations. The cadence was relentless: multiple posts per week,
          each requiring custom graphics, copy, and an understanding of what
          the community actually cared about.
        </p>
        <p>
          Beyond scheduled content, I designed assets for real-time moments —
          partnership announcements, trending conversations, and community
          milestones — keeping the brand visible and responsive in a market
          that moves around the clock.
        </p>
      </TextSection>

      <ResultsList
        items={[
          "#1 NFT marketplace on the XRP Ledger by secondary sales volume",
          "11,800+ secondary sales in a single 30-day period at peak (Nov 2023)",
          "Top 3 XRPL NFT marketplaces controlled 80%+ of all on-chain NFT volume",
          "Featured on the official XRPL developer blog",
          "Profiled by Messari as one of the most established touchpoints on XRPL",
          "XRPL Accelerator backed — institutional support from the network",
          "Consensus 2023 & 2024 — booth presence at the largest crypto conference",
          "Permissionless 2024 — booth within the Ripple X section",
          "ETH Denver — attended annually since 2022",
        ]}
      />

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/xrpcafe/logo_16x9.png", alt: "xrp.cafe logo" },
          { type: "video", src: "/videos/CAFE_EXPLORE_CREATE_TRADE.mp4", alt: "Explore Create Trade motion graphic" },
          { type: "image", src: "/images/xrpcafe/1.png", alt: "Super Saiyan mug character" },
          { type: "image", src: "/images/xrpcafe/2.png", alt: "Marketplace UI with characters" },
          { type: "image", src: "/images/xrpcafe/3.png", alt: "BBQ beach mug character" },
          { type: "image", src: "/images/xrpcafe/7.png", alt: "Halloween pumpkin mug" },
          { type: "image", src: "/images/xrpcafe/6.png", alt: "JUST MINT NFTs graphic" },
          { type: "image", src: "/images/xrpcafe/4.png", alt: "Jeopardy event" },
          { type: "image", src: "/images/xrpcafe/5.png", alt: "VeSea charity event" },
          { type: "image", src: "/images/xrpcafe/XLS20_1Y-04.png", alt: "XLS-20 one year anniversary" },
        ]}
      />
    </CaseStudyLayout>
  );
}
