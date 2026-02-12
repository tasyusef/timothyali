"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { transition } from "@/lib/motion";

interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface CaseStudyGalleryProps {
  items: GalleryItem[];
}

export default function CaseStudyGallery({ items }: CaseStudyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  /* keyboard & scroll-lock */
  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, prev, next]);

  return (
    <>
      {/* Thumbnail grid */}
      <ScrollReveal>
        <div
          className="grid grid-cols-2 md:block md:columns-4"
          style={{ columnGap: "var(--gap-gallery)", rowGap: "var(--gap-gallery)" }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="relative block w-full overflow-hidden cursor-pointer bg-transparent border-0 p-0 self-start break-inside-avoid md:mb-[var(--gap-gallery)]"
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
                  className="w-full h-auto block"
                />
              )}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={close}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 md:top-6 md:right-6 label-swiss hover-swiss text-[var(--color-foreground)] z-10 bg-transparent border-0 cursor-pointer p-2"
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
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 label-swiss hover-swiss text-[var(--color-foreground)] z-10 bg-transparent border-0 cursor-pointer p-2"
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
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 label-swiss hover-swiss text-[var(--color-foreground)] z-10 bg-transparent border-0 cursor-pointer p-2"
              >
                &rarr;
              </button>
            )}

            {/* Media */}
            <div
              className="w-full h-full p-4 md:p-20 flex items-center justify-center"
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
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
