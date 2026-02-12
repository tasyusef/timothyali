"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { ReactNode } from "react";
import { transition } from "@/lib/motion";

interface CaseStudyHeader {
  title: string;
  category: string;
  year: string;
  role: string;
  timeline?: string;
  tools?: string;
  overview: string;
  heroImage?: string;
  heroVideo?: string;
  heroAlt?: string;
}

interface CaseStudyLayoutProps {
  header: CaseStudyHeader;
  children: ReactNode;
  nextProject?: {
    title: string;
    slug: string;
  };
}

export default function CaseStudyLayout({
  header,
  children,
  nextProject,
}: CaseStudyLayoutProps) {
  const metaItems: { label: string; value: string }[] = [
    { label: "Category", value: header.category },
    { label: "Year", value: header.year },
    { label: "Role", value: header.role },
  ];
  if (header.timeline) metaItems.push({ label: "Timeline", value: header.timeline });
  if (header.tools) metaItems.push({ label: "Tools", value: header.tools });

  return (
    <article>
      {/* Header */}
      <section className="px-swiss pt-6 md:pt-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition.normal}
        >
          {/* Back link row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] pb-row mb-section">
            <Link href="/" className="label-swiss hover-swiss md:col-span-3">
              Back to work
            </Link>
          </div>

          {/* Title + Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 mb-section">
            <div className="md:col-span-5 md:col-start-1">
              <h1
                className="heading-swiss"
                style={{ fontSize: "var(--text-headline)" }}
              >
                {header.title}
              </h1>
            </div>
            <div className="md:col-span-5 md:col-start-7">
              <p className="leading-[1.6]">
                {header.overview}
              </p>
            </div>
          </div>

          {/* Metadata rows */}
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-4 md:py-5 gap-1 md:gap-0"
            >
              <p className="label-swiss md:col-span-3">{item.label}</p>
              <p className="md:col-span-5 md:col-start-7">
                {item.value}
              </p>
            </div>
          ))}
          <div className="border-b border-[var(--color-border)]" />
        </motion.div>
      </section>

      {/* Hero */}
      {(header.heroImage || header.heroVideo) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.slow, delay: 0.25 }}
          className="px-swiss py-[8vh] md:py-[12vh]"
        >
          {header.heroVideo && header.heroImage ? (
            <div className="grid grid-cols-12 gap-[2px] w-full">
              <video
                src={header.heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="col-span-3 w-full h-full object-cover"
              />
              <Image
                src={header.heroImage}
                alt={header.heroAlt ?? ""}
                width={1920}
                height={1080}
                className="col-span-9 w-full h-full object-cover"
                sizes="75vw"
                priority
              />
            </div>
          ) : header.heroImage ? (
            <Image
              src={header.heroImage}
              alt={header.heroAlt ?? ""}
              width={1920}
              height={1080}
              className="w-full h-auto"
              sizes="100vw"
              priority
            />
          ) : null}
        </motion.div>
      )}

      {/* Body Content */}
      <div className="px-swiss">{children}</div>

      {/* Next Project */}
      {nextProject && (
        <section className="px-swiss mt-[8vh] md:mb-[12vh] pb-8">
          <ScrollReveal>
            <Link
              href={`/work/${nextProject.slug}`}
              className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row hover-swiss gap-4 md:gap-0"
            >
              <p className="label-swiss md:col-span-3">Next Project</p>
              <span
                className="md:col-span-5 md:col-start-7 heading-swiss"
                style={{ fontSize: "var(--text-subhead)" }}
              >
                {nextProject.title}
              </span>
            </Link>
          </ScrollReveal>
        </section>
      )}
    </article>
  );
}
