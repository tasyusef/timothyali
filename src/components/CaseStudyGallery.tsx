"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { transition } from "@/lib/motion";

interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt: string;
}

interface CaseStudyGalleryProps {
  items: GalleryItem[];
}

const DESKTOP_COLS = 4;

function GalleryThumb({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (i: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={
        item.alt
          ? `Open ${item.type} ${index + 1}: ${item.alt}`
          : `Open ${item.type} ${index + 1}`
      }
      className="relative block w-full overflow-hidden cursor-pointer bg-transparent border-0 p-0 focus-visible:ring-2 focus-visible:ring-[var(--color-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
    >
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt={item.alt ?? ""}
          width={1920}
          height={1080}
          className="w-full h-auto block"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <video
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          tabIndex={-1}
          className="w-full h-auto block"
        />
      )}
    </button>
  );
}

export default function CaseStudyGallery({ items }: CaseStudyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Distribute items round-robin into columns for desktop masonry
  const columns = useMemo(() => {
    const cols: { item: GalleryItem; index: number }[][] = Array.from(
      { length: DESKTOP_COLS },
      () => [],
    );
    items.forEach((item, i) => {
      cols[i % DESKTOP_COLS].push({ item, index: i });
    });
    return cols;
  }, [items]);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(
    () =>
      setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    [],
  );

  const next = useCallback(
    () =>
      setActiveIndex((i) =>
        i !== null && i < items.length - 1 ? i + 1 : i,
      ),
    [items.length],
  );

  /* Scroll lock — only toggles on open/close */
  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex !== null]);

  /* Focus management — move to close button on open */
  useEffect(() => {
    if (activeIndex === null) return;
    closeButtonRef.current?.focus();
  }, [activeIndex]);

  /* Keyboard — arrows, escape, and focus trap */
  useEffect(() => {
    if (activeIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();

      // Focus trap: keep Tab within the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, prev, next]);

  const lightboxLabel =
    activeIndex !== null
      ? items[activeIndex].alt
        ? `${items[activeIndex].type === "video" ? "Video" : "Image"} lightbox: ${items[activeIndex].alt}`
        : `${items[activeIndex].type === "video" ? "Video" : "Image"} lightbox`
      : "Lightbox";

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">Gallery</h2>
      {/* Thumbnail grid — mobile: 2-col flat grid */}
      <ScrollReveal>
        <div className="grid grid-cols-2 gap-gallery md:hidden">
          {items.map((item, i) => (
            <GalleryThumb
              key={i}
              item={item}
              index={i}
              onOpen={setActiveIndex}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* Thumbnail grid — desktop: JS-distributed masonry columns */}
      <ScrollReveal>
        <div className="hidden md:grid md:grid-cols-4 gap-gallery items-start">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-gallery">
              {col.map(({ item, index }) => (
                <GalleryThumb
                  key={index}
                  item={item}
                  index={index}
                  onOpen={setActiveIndex}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            ref={dialogRef}
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxLabel}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="fixed inset-0 z-lightbox flex items-center justify-center bg-black/90"
            onClick={close}
          >
            {/* Screen reader position */}
            <span className="sr-only" aria-live="polite">
              {`${items[activeIndex].type === "video" ? "Video" : "Image"} ${activeIndex + 1} of ${items.length}${items[activeIndex].alt ? `: ${items[activeIndex].alt}` : ""}`}
            </span>

            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 md:top-6 md:right-6 label-swiss hover-swiss active:opacity-50 text-[var(--color-foreground)] z-[1] bg-transparent border-0 cursor-pointer p-2"
            >
              Close
            </button>

            {/* Previous arrow */}
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 label-swiss hover-swiss active:opacity-50 text-[var(--color-foreground)] z-[1] bg-transparent border-0 cursor-pointer p-2"
              >
                &larr;
              </button>
            )}

            {/* Next arrow */}
            {activeIndex < items.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 label-swiss hover-swiss active:opacity-50 text-[var(--color-foreground)] z-[1] bg-transparent border-0 cursor-pointer p-2"
              >
                &rarr;
              </button>
            )}

            {/* Media */}
            <div
              className="w-full h-full p-4 md:p-10 lg:p-20 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {items[activeIndex].type === "image" ? (
                <Image
                  src={items[activeIndex].src}
                  alt={items[activeIndex].alt ?? ""}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <video
                  key={items[activeIndex].src}
                  src={items[activeIndex].src}
                  controls
                  autoPlay
                  playsInline
                  aria-label={items[activeIndex].alt ?? `Video ${activeIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
