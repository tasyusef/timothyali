import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, LiveEmbed } from "@/components/CaseStudySection";
import CaseStudyGallery from "@/components/CaseStudyGallery";
import { getNextProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "FirstStrike Research — Brand Identity & Product Design",
  description:
    "Brand identity and prediction market research platform for a veteran-owned financial research company.",
  openGraph: {
    title: "FirstStrike Research — Brand Identity & Product Design — Timothy Ali",
    description:
      "Brand identity and prediction market research platform for a veteran-owned financial research company.",
    url: "https://www.timothyali.com/work/firststrike",
  },
};

export default function FirstStrikePage() {
  return (
    <CaseStudyLayout
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "FirstStrike Research — Brand Identity & Product Design",
        description:
          "Brand identity and prediction market research platform for a veteran-owned financial research company.",
        author: { "@type": "Person", name: "Timothy Ali", url: "https://www.timothyali.com" },
        dateCreated: "2025-01-01",
        url: "https://www.timothyali.com/work/firststrike",
        image: "https://www.timothyali.com/images/firststrike/hero.png",
      }}
      header={{
        title: "FirstStrike Research",
        category: "Brand Identity & Product Design",
        year: "2025",
        role: "Lead Designer (sole designer)",
        timeline: "~3 months",
        tools: "Illustrator, Figma",
        overview:
          "FirstStrike Research is a veteran-owned financial research company covering American markets. The first month was brand — logo, color system, typography, and guidelines built from a rough mood board. The following two months were product — designing a prediction market research platform with real-time dashboards, AI-driven analysis, portfolio tracking, and market trading. The core challenge was making the brand credible enough for finance while building a product that gives everyday investors institutional-grade tools.",
        heroImage: "/images/firststrike/hero.png",
        heroAlt: "FirstStrike Research brand identity",
      }}
      nextProject={getNextProject("firststrike")}
    >
      <TextSection title="Logo & Wordmark">
        <p>
          The FirstStrike wordmark is set in heavy italic type — the forward lean
          gives it momentum and urgency matching the speed of financial markets.
          The defining element is the halftone dot-matrix pattern trailing from
          the &ldquo;F,&rdquo; a nod to retro print media that suggests impact
          radiating outward.
        </p>
        <p>
          Multiple configurations: horizontal for headers, stacked vertical for
          tight spaces, and a standalone icon mark for favicons and avatars. Each
          works across both light and dark backgrounds.
        </p>
      </TextSection>

      <TextSection title="Color System">
        <p>
          Electric Blue (#003DFF) anchors the entire brand — bold enough to stand
          out in financial media, serious enough to convey authority. Paired with
          Midnight Black for body text and Ice White for secondary surfaces.
          Three accent colors — Soft Mint, Signal Coral, and Amber Pulse — were
          designed specifically for data visualization and UI states.
        </p>
      </TextSection>

      <TextSection title="The Signature Look">
        <p>
          The brand&apos;s most recognizable visual element is the
          gradient-plus-grain treatment: a deep blue-to-cyan gradient overlaid
          with subtle noise texture. This gives digital surfaces a tactile,
          almost printed quality that reinforces the retro personality without
          feeling dated.
        </p>
      </TextSection>

      <TextSection title="Research Platform">
        <p>
          After the brand shipped, the scope expanded into a full product —
          a prediction market research tool built for retail investors.
          I designed the entire application: real-time market dashboards
          with live price feeds, AI-driven analysis summaries, portfolio
          tracking with P&amp;L visualization, and prediction market
          trading interfaces. The challenge was density — packing
          institutional-grade data into layouts that feel approachable
          rather than overwhelming.
        </p>
      </TextSection>

      <LiveEmbed
        label="Live Platform"
        description="Interactive prototype of the FirstStrike research platform. Explore the dashboards, market data, and trading interfaces."
        href="https://effervescent-semifreddo-de1ae5.netlify.app/"
        src="https://effervescent-semifreddo-de1ae5.netlify.app/"
        title="FirstStrike Research Platform"
      />

      {/* Gallery */}
      <CaseStudyGallery
        items={[
          { type: "image", src: "/images/firststrike/hero.png", alt: "FirstStrike Research brand identity" },
          { type: "image", src: "/images/firststrike/firststrike_pres-02.png", alt: "Mission statement — veteran-owned financial research blog" },
          { type: "image", src: "/images/firststrike/firststrike_pres-03.png", alt: "Billboard mockup — Real News. Real Research. Real Insights." },
          { type: "image", src: "/images/firststrike/firststrike_pres-04.png", alt: "Brand pillars — Retro. Strong. Versatile." },
          { type: "image", src: "/images/firststrike/firststrike_pres-05.png", alt: "Primary logo lockup — horizontal wordmark" },
          { type: "image", src: "/images/firststrike/firststrike_pres-06.png", alt: "Secondary logo lockup — stacked wordmark" },
          { type: "image", src: "/images/firststrike/firststrike_pres-07.png", alt: "Logo construction on blue grid" },
          { type: "image", src: "/images/firststrike/firststrike_pres-08.png", alt: "Color system — Electric Blue, Soft Mint, Signal Coral, Amber Pulse" },
          { type: "image", src: "/images/firststrike/firststrike_pres-09.png", alt: "Business card mockup on concrete" },
          { type: "image", src: "/images/firststrike/firststrike_pres-10.png", alt: "Typography system — Helvetica Heavy and Medium" },
        ]}
      />

      <TextSection title="Outcome">
        <p>
          What started as a one-month brand project became a three-month
          engagement spanning identity and product. FirstStrike launched
          with a cohesive system across every touchpoint — from the brand
          guidelines to a fully designed research platform — giving everyday
          investors tools that were previously only available to professionals.
        </p>
      </TextSection>
    </CaseStudyLayout>
  );
}
