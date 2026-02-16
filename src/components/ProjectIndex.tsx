"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";
import { transition } from "@/lib/motion";

interface ProjectIndexProps {
  projects: Project[];
}

function ImageStrip({ project }: { project: Project }) {
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

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    // Re-check scroll state after images load and layout settles
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    // Also check after a short delay for images that load quickly
    const timer = setTimeout(updateScrollState, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [updateScrollState]);

  return (
    <>
      <div
        ref={stripRef}
        onScroll={updateScrollState}
        className="flex gap-gallery-tight h-[40vh] pb-4 md:pb-5 overflow-x-auto scrollbar-hide"
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
              onLoad={updateScrollState}
            />
          </div>
        ))}
      </div>

      {/* Scroll arrows — always mounted, visibility controlled via opacity/pointer-events */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll("left"); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-dropdown cursor-pointer border-0 flex items-center justify-center w-8 h-8 bg-black/30 text-white text-sm hover:bg-black/50 transition-all duration-fast ease-swiss"
        style={{
          opacity: canScrollLeft ? 1 : 0,
          transform: `translateY(-50%) translateX(${canScrollLeft ? "0px" : "20px"})`,
          pointerEvents: canScrollLeft ? "auto" : "none",
        }}
      >
        &larr;
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll("right"); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-dropdown cursor-pointer border-0 flex items-center justify-center w-8 h-8 bg-black/30 text-white text-sm hover:bg-black/50 transition-all duration-fast ease-swiss"
        style={{
          opacity: canScrollRight ? 1 : 0,
          transform: `translateY(-50%) translateX(${canScrollRight ? "0px" : "-20px"})`,
          pointerEvents: canScrollRight ? "auto" : "none",
        }}
      >
        &rarr;
      </button>
    </>
  );
}

export default function ProjectIndex({ projects }: ProjectIndexProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const wasTouchRef = useRef(false);
  const router = useRouter();

  const handleRowClick = useCallback(
    (e: React.MouseEvent, index: number, slug: string) => {
      // Read and reset the touch flag — set by onTouchEnd on the same element
      const isTouch = wasTouchRef.current;
      wasTouchRef.current = false;

      // Desktop: always navigate (hover already handles expand)
      if (!isTouch) return;

      // Mobile: first tap expands, second tap navigates
      if (hoveredIndex === index) {
        router.push(`/work/${slug}`);
      } else {
        e.preventDefault();
        setHoveredIndex(index);
      }
    },
    [hoveredIndex, router],
  );

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
            onTouchEnd={() => { wasTouchRef.current = true; }}
            onClick={(e) => handleRowClick(e, index, project.slug)}
          >
            <div
              className="grid grid-cols-12 items-center py-4 md:py-5 transition-opacity duration-fast ease-swiss"
              style={{ opacity: hoveredIndex !== null && !isHovered ? "var(--opacity-dim)" : 1 }}
            >
              <span className="col-span-1 label-swiss">{num}</span>
              <span
                className="col-span-5 heading-swiss"
                style={{ fontSize: "var(--text-subhead)" }}
              >
                {project.title}
              </span>
              <span className="md:col-span-3 md:col-start-7 label-swiss hidden md:block relative overflow-hidden">
                <span
                  className="block transition-all duration-fast ease-swiss"
                  style={{
                    transform: isHovered ? "translateY(-100%)" : "translateY(0)",
                    opacity: isHovered ? 0 : 1,
                  }}
                >
                  {project.category}
                </span>
                <span
                  className="absolute inset-0 block transition-all duration-fast ease-swiss"
                  style={{
                    transform: isHovered ? "translateY(0)" : "translateY(100%)",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  View case study &rarr;
                </span>
              </span>
              <span className="col-span-6 md:col-span-2 md:col-start-11 label-swiss text-right">
                {project.year}
              </span>
            </div>

            {/* Inline image strip — hover on desktop, tap-to-expand on mobile */}
            <AnimatePresence initial={false}>
              {isHovered && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "40vh", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition.page}
                  className="overflow-hidden relative"
                >
                  <ImageStrip project={project} />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );
}
