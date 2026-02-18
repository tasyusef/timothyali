"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { transition } from "@/lib/motion";
import ProjectIndex from "@/components/ProjectIndex";
import ScrollReveal from "@/components/ScrollReveal";
import { projects } from "@/lib/projects";
import { posts } from "@/lib/posts";
import Image from "next/image";
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

function useDenverTime() {
  const fmt = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Denver",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    []
  );
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(fmt.format(new Date()));
    const id = setInterval(() => setTime(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, [fmt]);

  return time;
}

export default function Home() {
  const denverTime = useDenverTime();

  return (
    <>
      {/* Hero Section */}
      <section className="px-swiss pt-[4vh] md:pt-[6vh] pb-[8vh] md:pb-[14vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition.slow}
          className="border-t border-[var(--color-border)] pt-6"
        >
          {/* Mobile: headshot + key info side-by-side, then details below */}
          {/* Desktop: 12-col grid as before */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-y-6">
            <div className="hidden md:block md:col-span-3">
              <div className="w-1/2 aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/about/headshot.jpg"
                  alt="Timothy Ali"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover object-[center_80%]"
                  sizes="8vw"
                  priority
                />
              </div>
            </div>
            <div className="md:col-span-2 md:col-start-5">
              <p className="label-swiss mb-2">Discipline</p>
              <p className="leading-body">Product, Brand & Motion</p>
            </div>
            <div className="md:col-span-2 md:col-start-7">
              <p className="label-swiss mb-2">Experience</p>
              <p className="leading-body">Since 2019</p>
            </div>
            <div className="md:col-span-2 md:col-start-9">
              <p className="label-swiss mb-2">Location / Time</p>
              <p className="leading-body">Denver, CO — {denverTime}</p>
            </div>
            <div className="md:col-span-2 md:col-start-11">
              <p className="label-swiss mb-2">Connect</p>
              <div className="flex flex-col gap-1">
                <Link href="mailto:tas.yusef@gmail.com" className="group/link leading-body hover-swiss flex items-center gap-2">Email <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
                <Link href="https://github.com/tasyusef" target="_blank" rel="noopener noreferrer" className="group/link leading-body hover-swiss flex items-center gap-2">GitHub <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
                <Link href="https://linkedin.com/in/timothyali" target="_blank" rel="noopener noreferrer" className="group/link leading-body hover-swiss flex items-center gap-2">LinkedIn <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
                <Link href="https://substack.com/@timothyali" target="_blank" rel="noopener noreferrer" className="group/link leading-body hover-swiss flex items-center gap-2">Substack <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
                <Link href="https://x.com/twocakeS__" target="_blank" rel="noopener noreferrer" className="group/link leading-body hover-swiss flex items-center gap-2">X <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
                <Link href="/timothyali-resume.pdf" target="_blank" rel="noopener noreferrer" className="group/link leading-body hover-swiss flex items-center gap-2">Resume <span className="arrow-reveal arrow-reveal-sm">&rarr;</span></Link>
              </div>
            </div>
          </div>
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
      <section className="px-swiss border-t border-[var(--color-border)]">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)]">
            <Link href="/about" className="group flex flex-col gap-4 bg-[var(--color-background)] py-row md:pr-8">
              <p className="label-swiss">About</p>
              <p className="leading-body">
                I&apos;m a designer who works across product, brand, and motion
                for startups and tech companies. I bring a modernist,
                &ldquo;less noise&rdquo; approach to everything I make.
              </p>
              <span className="label-swiss hover-swiss mt-auto overflow-hidden">
                <span className="arrow-reveal arrow-reveal-lg">
                  &rarr;
                </span>
              </span>
            </Link>

            <Link href={`/blog/${posts[0].slug}`} className="group flex flex-col gap-4 bg-[var(--color-background)] border-t md:border-t-0 border-[var(--color-border)] py-row md:px-8">
              <p className="label-swiss">Latest Writing</p>
              <p className="leading-body">
                {posts[0].title}
              </p>
              <span className="label-swiss hover-swiss mt-auto overflow-hidden">
                <span className="arrow-reveal arrow-reveal-lg">
                  Read full article &rarr;
                </span>
              </span>
            </Link>

            <Link href="/contact" className="group flex flex-col gap-4 bg-[var(--color-background)] border-t md:border-t-0 border-[var(--color-border)] py-row md:pl-8">
              <p className="label-swiss">Contact</p>
              <p className="leading-body">
                I&apos;m open to full-time opportunities and freelance projects. Let&apos;s talk.
              </p>
              <span className="label-swiss hover-swiss mt-auto overflow-hidden">
                <span className="arrow-reveal arrow-reveal-lg">
                  Reach out &rarr;
                </span>
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
