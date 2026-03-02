import { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { TextSection, ResultsList, LiveEmbed } from "@/components/CaseStudySection";
import { getNextProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Jade Aesthetics — Web Design & Development",
  description:
    "Two complete websites designed and built from scratch for a premium medical spa in Wheaton, IL — from Framer launch site to SEO-architected Next.js application with 30+ pages.",
  openGraph: {
    title: "Jade Aesthetics — Web Design & Development — Timothy Ali",
    description:
      "Two complete websites designed and built from scratch for a premium medical spa in Wheaton, IL — from Framer launch site to SEO-architected Next.js application with 30+ pages.",
    url: "https://www.timothyali.com/work/jade-aesthetics",
  },
};

export default function JadeAestheticsPage() {
  return (
    <CaseStudyLayout
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "Jade Aesthetics — Web Design & Development",
        description:
          "Two complete websites designed and built from scratch for a premium medical spa in Wheaton, IL — from Framer launch site to SEO-architected Next.js application with 30+ pages.",
        author: {
          "@type": "Person",
          name: "Timothy Ali",
          url: "https://www.timothyali.com",
        },
        dateCreated: "2025-01-01",
        url: "https://www.timothyali.com/work/jade-aesthetics",
      }}
      header={{
        title: "Jade Aesthetics",
        category: "Web Design & Development",
        year: "2025–2026",
        role: "Designer & Developer",
        timeline: "~4 months (two phases)",
        tools: "Framer (V1), Next.js, Tailwind CSS, Vercel, Claude Code (V2)",
        overview:
          "Jade Aesthetics is a premium medical spa in Wheaton, Illinois offering facials, injectables, body contouring, and wellness treatments. I designed and built their entire web presence from scratch — twice. The first version was a Framer site I created to launch the brand online, developing the full visual identity from only an existing logo. When the business outgrew the platform, I rebuilt everything as a server-rendered Next.js application with 30+ pages, structured data on every route, and a content architecture designed for long-term SEO growth. Two complete builds, one continuous design vision.",
      }}
      nextProject={getNextProject("jade-aesthetics")}
    >
      <TextSection title="Version One">
        <p>
          I designed and built the original Jade Aesthetics website on Framer
          from scratch. Starting with only the existing logo mark, I developed
          the entire digital design language — jade greens, warm golds, cream
          backgrounds, and the Dream Avenue serif typeface — to match the
          warmth and sophistication of the physical space. Every color choice,
          layout decision, and typographic pairing was made to communicate
          luxury and clinical trust before a visitor reads a single word.
        </p>
        <p>
          The V1 site gave Jade Aesthetics a polished digital presence that
          reflected the quality of the in-person experience. It served its
          purpose well as a launch platform — establishing the brand online
          and giving potential clients a clear picture of the services,
          philosophy, and aesthetic that define the practice.
        </p>
      </TextSection>

      <TextSection title="Why the Rebuild">
        <p>
          Framer was the right tool for getting the site live, but as the
          business grew, the platform became the bottleneck. No semantic HTML
          meant screen readers and search engines struggled to parse the
          content. No structured data, no sitemap control, and minimal
          indexable body copy left Google with almost nothing to work with.
          For a local medical spa competing in DuPage County on high-intent
          queries like &ldquo;Botox Wheaton IL&rdquo; or &ldquo;med spa near
          me,&rdquo; that invisibility was costing the business real traffic.
        </p>
        <p>
          The content model was also a constraint. Jade Aesthetics offers
          dozens of individual treatments across multiple categories — each
          one deserving its own optimized page. Framer&apos;s visual editor
          wasn&apos;t built for content-heavy sites with that many routes. The
          business needed an architecture that could scale: one service, one
          page, one entry point from search.
        </p>
      </TextSection>

      <TextSection title="Version Two">
        <p>
          I rebuilt the site from scratch as a Next.js application using the
          App Router, Tailwind CSS, and server-side rendering throughout.
          Every page delivers full HTML to the browser — no client-side
          rendering dependency for content. The architecture was designed
          SEO-first: unique metadata on every route, JSON-LD structured data
          (MedicalBusiness, MedicalProcedure, FAQPage schemas), auto-generated
          sitemaps, and breadcrumb navigation with schema markup.
        </p>
        <p>
          The site ships over 30 pages: a content-rich homepage, four service
          category pages, 16 individual treatment pages, product pages for two
          skincare lines, an about page with team bios, FAQ, financing, blog
          infrastructure, and a contact page. Every service page follows a
          consistent template — what the treatment is, who it&apos;s for, what
          to expect, results and recovery, and localized FAQs — giving Google
          rich, indexable content for each procedure.
        </p>
      </TextSection>

      <TextSection title="Design Language">
        <p>
          I designed Jade Aesthetics&apos; entire digital visual language from
          scratch. The jade green and warm gold palette, cream backgrounds,
          Dream Avenue typeface, and the interplay of photography with clean
          negative space — all of it was developed for V1 to translate the
          feel of the physical store into a digital experience. The only
          element I inherited was the logo mark. Everything else was original.
        </p>
        <p>
          V2 carries that same design language forward, but systematized for
          scale. What started as page-level decisions in Framer became a
          component-based design system in Next.js — service cards, FAQ
          accordions, testimonial carousels, and CTA blocks, all built as
          reusable pieces with consistent spacing and hierarchy. The visual
          identity I created on day one now lives in an architecture designed
          to maintain that consistency across 30+ pages and growing.
        </p>
      </TextSection>

      <TextSection title="AI-Assisted Development">
        <p>
          Version two was built almost entirely with Claude Code —
          Anthropic&apos;s agentic coding tool. I used it to scaffold the
          Next.js application, generate the SEO infrastructure, write
          structured data schemas, build reusable components, and handle the
          content architecture across 30+ pages. The workflow was
          collaborative: I directed the design decisions, content strategy,
          and architecture while Claude handled the implementation at speed.
          What would have been weeks of templating and content entry
          compressed into days.
        </p>
      </TextSection>

      <LiveEmbed
        label="Live Site"
        description="The current Jade Aesthetics website — V2, built on Next.js. Browse the full service catalog, team page, and SEO-optimized content architecture."
        href="https://www.jadeaesthetics.co/"
        src="https://www.jadeaesthetics.co/"
        title="Jade Aesthetics Website — Version Two"
      />

      <ResultsList
        items={[
          "Two complete websites designed and built from scratch for a single client",
          "30+ pages of SEO-optimized content across services, products, and blog infrastructure",
          "Perfect 100 Lighthouse accessibility score",
          "Structured data (JSON-LD) on every route — MedicalBusiness, MedicalProcedure, FAQPage, and BreadcrumbList schemas",
          "Server-rendered Next.js application with zero client-side content dependencies",
          "URL redirect strategy preserving all search equity through the V1-to-V2 platform migration",
          "V2 built and launched in approximately 2 months using Claude Code for AI-assisted development",
        ]}
      />

      <TextSection title="Outcome">
        <p>
          Jade Aesthetics now has a website built to the same standard as the
          experience inside the treatment rooms. The content architecture
          gives every procedure its own optimized page — each one a potential
          entry point from Google for someone searching for that specific
          treatment in the Wheaton area. The design language I created from
          day one now lives in a system built to scale with the business, and
          the server-rendered infrastructure means the site is fast,
          accessible, and compounding organic traffic over time. Two builds,
          one vision, zero compromises.
        </p>
      </TextSection>
    </CaseStudyLayout>
  );
}
