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
        role: "Cofounder / Creative Lead",
        tools: "Illustrator, After Effects",
        overview:
          "xrp.cafe is the #1 NFT marketplace on the XRP Ledger. I cofounded the company and owned the entire creative output — from the brand's visual identity and mascot system to every social post, video, event graphic, and conference booth we shipped. In a space dominated by dark, aggressive crypto aesthetics, I positioned xrp.cafe as warm, friendly, and approachable — a cozy place for NFTs.",
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
          This wasn&apos;t just illustration — it was world-building. The mascot
          system gave xrp.cafe a visual personality that no competitor could
          replicate.
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
      </TextSection>

      <TextSection title="Social Media & Community">
        <p>
          As the sole designer, I created a continuous stream of social content
          for Twitter/X, Instagram, and Discord — product announcements, feature
          launches, community events, seasonal posts, partnerships, and
          milestone celebrations.
        </p>
      </TextSection>

      <ResultsList
        items={[
          "#1 NFT marketplace on the XRP Ledger by volume and user adoption",
          "100,000+ secondary sales — 47% of all NFT secondary sales on the XRPL",
          "Ranked #19 NFT marketplace globally on DappRadar at peak",
          "Featured on the official XRPL developer blog",
          "ETH Denver 2024 booth — physical brand presence at a major conference",
          "XRPL Accelerator backed — institutional support from the network",
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
