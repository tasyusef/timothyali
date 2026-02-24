"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { transition, delay } from "@/lib/motion";

const capabilities = [
  "Product Design",
  "Brand Design",
  "Layout Design",
  "Motion Design",
  "Web Design",
  "User Experience",
  "Interaction Design",
];

const tools = ["Figma", "Adobe Creative Suite", "Framer", "Claude Code", "Cursor"];

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition.normal}
        className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] pb-row"
      >
        <p className="label-swiss md:col-span-3">About</p>
      </motion.div>

      {/* Bio + Photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.stagger }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 pt-[4vh] md:pt-[6vh] pb-[8vh] md:pb-[14vh]"
      >
        <div className="md:col-span-5 md:col-start-1">
          <div className="w-1/2 aspect-[3/4] overflow-hidden">
            <Image
              src="/images/about/headshot.jpg"
              alt="Timothy Ali"
              width={400}
              height={400}
              className="w-full h-full object-cover object-[center_80%]"
              sizes="(max-width: 768px) 50vw, 20vw"
              priority
            />
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-7">
          <div className="space-y-6 leading-body" >
            <p>
              I&apos;m a designer working across product, brand, and motion. I
              design and build products, brand systems, and websites for
              startups and tech companies — from early-stage to growth.
            </p>
            <p>
              Most I&apos;ve worked with FirstStrike Research, where I owned the
              entire creative output — product design, visual identity, motion,
              and marketing. Before that I worked primarily in the crypto
              industry and freelance work spanning from local businesses like
              luxury med spas and gyms to online communities and esports teams.
            </p>
            <p>
              I bring a modernist, &ldquo;less noise&rdquo; approach to
              everything I make — rooted in Swiss design principles: clarity,
              structure, and purpose.
            </p>
            <p>
              Based in Denver, Colorado. Open to full-time
              opportunities and freelance projects.
            </p>
          </div>
          <div className="flex gap-6 mt-8">
            <Link
              href="https://github.com/tasyusef"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/timothyali"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              LinkedIn
            </Link>
            <Link
              href="https://substack.com/@timothyali"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              Substack
            </Link>
            <Link
              href="https://x.com/twocakeS__"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              X
            </Link>
            <Link
              href="/timothyali-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              Resume
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Capabilities */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row">
          <p className="label-swiss md:col-span-3 mb-4 md:mb-0">Capabilities</p>
          <div className="md:col-span-5 md:col-start-7">
            {capabilities.map((skill) => (
              <p key={skill} className="leading-body">
                {skill}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Tools */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row">
          <p className="label-swiss md:col-span-3 mb-4 md:mb-0">Tools</p>
          <div className="md:col-span-5 md:col-start-7">
            {tools.map((tool) => (
              <p key={tool} className="leading-body">
                {tool}
              </p>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Location */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row">
          <p className="label-swiss md:col-span-3 mb-4 md:mb-0">Location</p>
          <div className="md:col-span-5 md:col-start-7">
            <p className="leading-body">
              Denver, Colorado
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Status */}
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-b border-[var(--color-border)] py-row">
          <p className="label-swiss md:col-span-3 mb-4 md:mb-0">Status</p>
          <div className="md:col-span-5 md:col-start-7">
            <p className="leading-body">
              Available for new projects
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <ScrollReveal>
        <div className="border-t border-[var(--color-border)] py-row">
          <p className="label-swiss mb-8">Experience</p>
          <dl className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[var(--color-border)]">
            <div className="flex flex-col gap-3 bg-[var(--color-background)] md:pr-6 py-4 md:py-0">
              <dt className="label-swiss">2019 — Now</dt>
              <dd className="leading-body" style={{ fontSize: "var(--text-subhead)" }}>Freelance</dd>
              <dd className="label-swiss">Graphic Designer</dd>
              <dd className="leading-body mt-auto" style={{ fontSize: "var(--text-caption)" }}>
                Created brand identities, miscellaneous graphics, and designed apps and websites for startups and local businesses including med-spas, gyms, and online communities.
              </dd>
            </div>
            <div className="flex flex-col gap-3 bg-[var(--color-background)] md:px-6 py-4 md:py-0">
              <dt className="label-swiss">2021 — Now</dt>
              <dd className="leading-body" style={{ fontSize: "var(--text-subhead)" }}>xrp.cafe</dd>
              <dd className="label-swiss">Founding Graphic Designer</dd>
              <dd className="leading-body mt-auto" style={{ fontSize: "var(--text-caption)" }}>
                Led the development of XRP.CAFE&apos;s brand identity and design system, producing website wireframes, event collateral, motion graphics, and 10+ social campaigns that grew the community to 29,000+ members, helped raise $32K for St. Jude&apos;s, and over $5 million USD in revenue.
              </dd>
            </div>
            <div className="flex flex-col gap-3 bg-[var(--color-background)] md:px-6 py-4 md:py-0">
              <dt className="label-swiss">2024 — 2025</dt>
              <dd className="leading-body" style={{ fontSize: "var(--text-subhead)" }}>firstledger.net</dd>
              <dd className="label-swiss">Senior Brand Designer</dd>
              <dd className="leading-body mt-auto" style={{ fontSize: "var(--text-caption)" }}>
                Designed and led the visual identity system for First Ledger, delivering animated promotional campaigns and social content that grew the audience to 42,000+ followers while supporting a platform that has surpassed $1B in trading volume.
              </dd>
            </div>
            <div className="flex flex-col gap-3 bg-[var(--color-background)] md:pl-6 py-4 md:py-0">
              <dt className="label-swiss">2025 — Now</dt>
              <dd className="leading-body" style={{ fontSize: "var(--text-subhead)" }}>firststrike research</dd>
              <dd className="label-swiss">Brand Designer</dd>
              <dd className="leading-body mt-auto" style={{ fontSize: "var(--text-caption)" }}>
                Developed a high-contrast brand identity and product design for FirstStrike Research, a veteran-owned financial platform. Designed a responsive web application featuring real-time market dashboards, AI-driven analysis, portfolio tracking with P&amp;L visualization, and prediction market trading—empowering everyday investors with institutional-grade research tools.
              </dd>
            </div>
          </dl>
        </div>
      </ScrollReveal>

    </div>
  );
}
