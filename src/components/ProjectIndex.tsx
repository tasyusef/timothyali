"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";
import { transition } from "@/lib/motion";

interface ProjectIndexProps {
  projects: Project[];
}

export default function ProjectIndex({ projects }: ProjectIndexProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = stripRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return (
    <div className="border-t border-[var(--color-border)]">
      {projects.map((project, index) => {
        const num = String(index + 1).padStart(2, "0");
        const isHovered = hoveredIndex === index;

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block border-b border-[var(--color-border)]"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="grid grid-cols-12 items-center py-4 md:py-5 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1 }}
            >
              <span className="col-span-1 label-swiss">{num}</span>
              <span
                className="col-span-5 heading-swiss"
                style={{ fontSize: "var(--text-subhead)" }}
              >
                {project.title}
              </span>
              <span className="md:col-span-3 md:col-start-7 label-swiss hidden sm:block relative overflow-hidden">
                <span
                  className="block transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transform: isHovered ? "translateY(-100%)" : "translateY(0)",
                    opacity: isHovered ? 0 : 1,
                  }}
                >
                  {project.category}
                </span>
                <span
                  className="absolute inset-0 block transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(100%)",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  View case study &rarr;
                </span>
              </span>
              <span className="col-span-6 sm:col-span-2 sm:col-start-11 label-swiss text-right">
                {project.year}
              </span>
            </div>

            {/* Inline image strip on hover */}
            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "40vh", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition.page}
                  className="overflow-hidden relative"
                >
                  <div
                    ref={stripRef}
                    onScroll={updateScrollState}
                    onMouseEnter={updateScrollState}
                    className="flex gap-[2px] h-[40vh] pb-4 md:pb-5 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {project.videos?.map((src, i) => (
                      <div key={`v-${i}`} className="h-full shrink-0">
                        <video
                          src={src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-auto"
                        />
                      </div>
                    ))}
                    {project.images.map((img, i) => (
                      <div key={`i-${i}`} className="h-full shrink-0">
                        <Image
                          src={img.src}
                          alt={`${project.title} ${i + 1}`}
                          width={Math.round(1200 * img.aspect)}
                          height={1200}
                          className="h-full w-auto block"
                          sizes="auto"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Scroll arrows */}
                  <AnimatePresence>
                    {canScrollLeft && (
                      <motion.button
                        key="arrow-left"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={transition.fast}
                        onClick={(e) => { e.preventDefault(); scroll("left"); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] hover:opacity-70"
                      >
                        &larr;
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {canScrollRight && (
                      <motion.button
                        key="arrow-right"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={transition.fast}
                        onClick={(e) => { e.preventDefault(); scroll("right"); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] hover:opacity-70"
                      >
                        &rarr;
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
}
