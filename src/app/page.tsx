"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { transition } from "@/lib/motion";
import ProjectIndex from "@/components/ProjectIndex";
import ScrollReveal from "@/components/ScrollReveal";
import { projects } from "@/lib/projects";
import Link from "next/link";

function FitText({ children, className, as: Tag = "div" }: { children: string; className?: string; as?: "h1" | "div" | "span" | "p" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState(10);

  const fit = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const containerWidth = container.clientWidth;
    let low = 10;
    let high = 1000;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      text.style.fontSize = `${mid}px`;
      if (text.scrollWidth > containerWidth) {
        high = mid;
      } else {
        low = mid;
      }
    }
    setFontSize(low);
  }, []);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <Tag
        ref={textRef as React.RefObject<never>}
        className={`whitespace-nowrap ${className ?? ""}`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </Tag>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-swiss pt-2 md:pt-4 pb-[4vh] md:pb-[6vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition.normal}
          className="mb-1"
        >
          <span className="label-swiss">
            Product design, brand identity & motion for startups and tech companies
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.slow, delay: 0.2 }}
        >
          <FitText as="h1" className="font-[var(--font-sans)] font-light tracking-[-0.03em] leading-[0.9]">
            Timothy Ali
          </FitText>
        </motion.div>
      </section>

      {/* Selected Work */}
      <section className="px-swiss">
        <ScrollReveal>
          <p className="label-swiss mb-8">Selected Work</p>
        </ScrollReveal>
        <ScrollReveal>
          <ProjectIndex projects={projects} />
        </ScrollReveal>
      </section>

      {/* About / Writing / Contact */}
      <section className="px-swiss">
        <ScrollReveal>
          <Link href="/about" className="group grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row gap-4 md:gap-0">
            <p className="label-swiss md:col-span-3">About</p>
            <p
              className="md:col-span-5 md:col-start-7 leading-[1.6]"
            >
              I&apos;m a designer who works across product, brand, and motion
              for startups and tech companies. I bring a modernist,
              &ldquo;less noise&rdquo; approach to everything I make.
            </p>
            <span className="hidden md:flex md:col-span-1 md:col-start-12 items-center justify-end overflow-hidden">
              <span className="inline-block translate-x-[-20px] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0 group-hover:opacity-100">
                &rarr;
              </span>
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal>
          <Link href="/blog/starting-with-less" className="group grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row gap-4 md:gap-0">
            <p className="label-swiss md:col-span-3">Latest Writing</p>
            <p
              className="md:col-span-5 md:col-start-7 leading-[1.6]"
            >
              Starting With Less: A Foundation-First Approach to Design
            </p>
            <span className="hidden md:flex md:col-span-1 md:col-start-12 items-center justify-end overflow-hidden">
              <span className="inline-block translate-x-[-20px] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0 group-hover:opacity-100">
                &rarr;
              </span>
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal>
          <Link href="/contact" className="group grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row gap-4 md:gap-0">
            <p className="label-swiss md:col-span-3">Contact</p>
            <p
              className="md:col-span-5 md:col-start-7 leading-[1.6]"
            >
              I&apos;m open to full-time opportunities and freelance projects. Let&apos;s talk.
            </p>
            <span className="hidden md:flex md:col-span-1 md:col-start-12 items-center justify-end overflow-hidden">
              <span className="inline-block translate-x-[-20px] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0 group-hover:opacity-100">
                &rarr;
              </span>
            </span>
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
