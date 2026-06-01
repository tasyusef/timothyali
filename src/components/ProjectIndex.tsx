"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/projects";
import { transition, spring } from "@/lib/motion";

interface ProjectIndexProps {
  projects: Project[];
}

function StatsCard({ stats }: { stats: NonNullable<Project["stats"]> }) {
  return (
    <div className="h-full shrink-0 flex items-stretch" role="group" aria-label="Key metrics">
      <div className="h-full aspect-[3/4] border border-[var(--color-border)] flex flex-col justify-between px-6 py-5 md:px-8 md:py-6">
        <p className="label-swiss">Key Metrics</p>
        <dl className="flex flex-col gap-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="label-swiss">{stat.label}</dt>
              <dd className="heading-swiss">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
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
        className="flex gap-gallery-tight h-[30vh] md:h-[40vh] min-h-[180px] pb-4 md:pb-5 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {project.stats && <StatsCard stats={project.stats} />}
        {project.videos?.map((src, i) => (
          <div key={`v-${i}`} className="h-full shrink-0">
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="h-full w-auto"
            />
          </div>
        ))}
        {project.images.map((img, i) => (
          <div key={`i-${i}`} className="h-full shrink-0">
            <Image
              src={img.src}
              alt={img.alt ?? `${project.title} – image ${i + 1}`}
              width={Math.round(1200 * img.aspect)}
              height={1200}
              className="h-full w-auto block"
              sizes="(max-width: 768px) 80vw, 40vw"
              onLoad={updateScrollState}
            />
          </div>
        ))}
      </div>

      {/* Scroll arrows — always mounted, visibility controlled via opacity/pointer-events */}
      <button
        type="button"
        aria-label="Scroll left"
        aria-hidden={!canScrollLeft}
        tabIndex={canScrollLeft ? 0 : -1}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll("left"); }}
        className="absolute left-2 top-1/2 z-dropdown cursor-pointer border-0 flex items-center justify-center w-11 h-11 bg-[var(--color-background)]/60 text-[var(--color-foreground)] text-sm hover:bg-[var(--color-background)]/80 transition-all duration-fast ease-swiss"
        style={{
          opacity: canScrollLeft ? 1 : 0,
          transform: `translateY(-50%) translateX(${canScrollLeft ? "0px" : "20px"})`,
          pointerEvents: canScrollLeft ? "auto" : "none",
        }}
      >
        <span aria-hidden="true">&larr;</span>
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        aria-hidden={!canScrollRight}
        tabIndex={canScrollRight ? 0 : -1}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll("right"); }}
        className="absolute right-2 top-1/2 z-dropdown cursor-pointer border-0 flex items-center justify-center w-11 h-11 bg-[var(--color-background)]/60 text-[var(--color-foreground)] text-sm hover:bg-[var(--color-background)]/80 transition-all duration-fast ease-swiss"
        style={{
          opacity: canScrollRight ? 1 : 0,
          transform: `translateY(-50%) translateX(${canScrollRight ? "0px" : "-20px"})`,
          pointerEvents: canScrollRight ? "auto" : "none",
        }}
      >
        <span aria-hidden="true">&rarr;</span>
      </button>
    </>
  );
}

/**
 * Desktop-only floating preview that springs after the cursor while hovering
 * the project list. Portaled to <body> so no transformed ancestor (ScrollReveal)
 * breaks its fixed positioning. Hidden entirely on touch / below md.
 */
function CursorPreview({
  project,
  visible,
  x,
  y,
  cardRef,
  reduced,
}: {
  project: Project | null;
  visible: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  cardRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && project && (
        <motion.div
          key="cursor-preview"
          ref={cardRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          style={{ x, y }}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={transition.fast}
        >
          <div className="relative w-80 lg:w-96 aspect-[16/10] overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] shadow-2xl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={project.slug}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition.fast}
              >
                {project.heroVideo ? (
                  <video
                    src={project.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={project.heroImage}
                    alt=""
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                    sizes="384px"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function ProjectIndex({ projects }: ProjectIndexProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // desktop mouse
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // mobile touch
  const wasTouchRef = useRef(false);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Cursor-following preview position (desktop)
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const restSpring = { stiffness: 1200, damping: 90, mass: 0.5 };
  const x = useSpring(mvX, prefersReducedMotion ? restSpring : spring.cursor);
  const y = useSpring(mvY, prefersReducedMotion ? restSpring : spring.cursor);

  // Place the preview to the side of the cursor, clamped to the viewport.
  const positionPreview = useCallback(
    (clientX: number, clientY: number, jump: boolean) => {
      const cardW = cardRef.current?.offsetWidth ?? 360;
      const cardH = cardRef.current?.offsetHeight ?? 225;
      const gap = 28;
      let tx = clientX + gap;
      if (tx + cardW > window.innerWidth - 12) tx = clientX - gap - cardW;
      const ty = Math.max(12, Math.min(clientY - cardH / 2, window.innerHeight - cardH - 12));
      mvX.set(tx);
      mvY.set(ty);
      if (jump) {
        x.jump(tx);
        y.jump(ty);
      }
    },
    [mvX, mvY, x, y],
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent, index: number, slug: string) => {
      // Read and reset the touch flag — set by onTouchEnd on the same element
      const isTouch = wasTouchRef.current;
      wasTouchRef.current = false;

      // Desktop: always navigate (cursor preview already handled the hover)
      if (!isTouch) return;

      // Mobile: first tap expands, second tap navigates
      if (expandedIndex === index) {
        router.push(`/work/${slug}`);
      } else {
        e.preventDefault();
        setExpandedIndex(index);
      }
    },
    [expandedIndex, router],
  );

  const activeRow = hoveredIndex !== null ? hoveredIndex : expandedIndex;
  const previewProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  return (
    <div
      className="border-t border-[var(--color-border)]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || hoveredIndex === null) return;
        positionPreview(e.clientX, e.clientY, false);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setHoveredIndex(null);
      }}
    >
      {projects.map((project, index) => {
        const num = String(index + 1).padStart(2, "0");
        const isActive = activeRow === index;

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group block border-b border-[var(--color-border)]"
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              positionPreview(e.clientX, e.clientY, hoveredIndex === null);
              setHoveredIndex(index);
            }}
            onTouchEnd={() => { wasTouchRef.current = true; }}
            onClick={(e) => handleRowClick(e, index, project.slug)}
          >
            <div
              className="grid grid-cols-12 items-center py-4 md:py-5 transition-opacity duration-fast ease-swiss"
              style={{ opacity: activeRow !== null && !isActive ? "var(--opacity-dim)" : undefined }}
            >
              <span className="col-span-1 label-swiss">{num}</span>
              <span
                className="col-span-5 heading-swiss text-subhead"
              >
                {project.title}
              </span>
              <span className="md:col-span-3 md:col-start-7 label-swiss hidden md:block relative overflow-hidden">
                <span
                  className="block transition-all duration-fast ease-swiss"
                  style={{
                    transform: isActive ? "translateY(-100%)" : "translateY(0)",
                    opacity: isActive ? 0 : 1,
                  }}
                >
                  {project.category}
                </span>
                <span
                  className="absolute inset-0 block transition-all duration-fast ease-swiss"
                  style={{
                    transform: isActive ? "translateY(0)" : "translateY(100%)",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  View case study &rarr;
                </span>
              </span>
              <span className="col-span-6 md:col-span-2 md:col-start-11 label-swiss text-right">
                {project.year}
              </span>
            </div>

            {/* Mobile-only inline image strip — tap to expand, tap again to open */}
            <AnimatePresence initial={false}>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition.page}
                  className="overflow-hidden relative md:hidden"
                >
                  <ImageStrip project={project} />
                  <motion.span
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...transition.fast, delay: 0.2 }}
                    className="absolute bottom-5 right-0 label-swiss bg-[var(--color-background)]/60 text-[var(--color-foreground)] px-3 py-2 flex items-center gap-1.5"
                  >
                    View case study &rarr;
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}

      <CursorPreview
        project={previewProject}
        visible={hoveredIndex !== null}
        x={x}
        y={y}
        cardRef={cardRef}
        reduced={prefersReducedMotion}
      />
    </div>
  );
}
