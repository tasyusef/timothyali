"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { transition } from "@/lib/motion";

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
    <section className="page-wrapper">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition.normal}
        className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] pb-row mb-section"
      >
        <p className="label-swiss md:col-span-3">About</p>
      </motion.div>

      {/* Bio + Photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 mb-section"
      >
        <div className="md:col-span-5 md:col-start-1">
          <Image
            src="/images/about/headshot.jpg"
            alt="Timothy Ali Yusef"
            width={800}
            height={1200}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>
        <div className="md:col-span-5 md:col-start-7">
          <div className="space-y-6 leading-[1.6]" >
            <p>
              I&apos;m a designer working across product, brand, and motion. I
              design and build products, brand systems, and websites for
              startups and tech companies — from early-stage to growth.
            </p>
            <p>
              Most recently I cofounded xrp.cafe, where I owned the entire
              creative output — product design, visual identity, motion, and
              marketing. Before that I worked across fintech, SaaS, and
              consumer products.
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
              href="https://linkedin.com/in/timothyali"
              target="_blank"
              rel="noopener noreferrer"
              className="label-swiss hover-swiss underline underline-offset-4"
            >
              LinkedIn
            </Link>
            <Link
              href="/SMITHYUSEF_RESUME.PDF"
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
              <p key={skill} className="leading-[1.6]">
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
              <p key={tool} className="leading-[1.6]">
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
            <p className="leading-[1.6]">
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
            <p className="leading-[1.6]">
              Available for new projects
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="mt-[8vh] md:mt-[12vh]">
          <h2
            className="heading-swiss"
            style={{ fontSize: "var(--text-headline)" }}
          >
            Let&apos;s work together
          </h2>
          <Link
            href="/contact"
            className="label-swiss hover-swiss underline underline-offset-4 inline-block mt-6"
          >
            Get in touch
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
