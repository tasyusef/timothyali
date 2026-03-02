"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface TextSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function TextSection({ title, children }: TextSectionProps) {
  return (
    <ScrollReveal className="mb-section">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0">
        {title && (
          <h2 className="label-swiss md:col-span-3">{title}</h2>
        )}
        <div
          className="md:col-span-5 md:col-start-7 leading-body space-y-4"
        >
          {children}
        </div>
      </div>
    </ScrollReveal>
  );
}

interface FullWidthImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
}

export function FullWidthImage({
  src,
  alt,
}: FullWidthImageProps) {
  return (
    <ScrollReveal className="mb-section">
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        className="w-full h-auto"
        sizes="100vw"
      />
    </ScrollReveal>
  );
}

interface ImageGridProps {
  images: { src: string; alt: string }[];
  columns?: 2 | 3 | 4;
}

export function ImageGrid({ images, columns = 2 }: ImageGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <ScrollReveal className="mb-section">
      <div
        className={`grid ${gridCols[columns]} items-start`}
        style={{ gap: "var(--spacing-section)" }}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            src={img.src}
            alt={img.alt}
            width={1920}
            height={1080}
            className="w-full h-auto block"
            sizes={`(max-width: 768px) 100vw, ${Math.floor(100 / columns)}vw`}
          />
        ))}
      </div>
    </ScrollReveal>
  );
}

interface ImageRowProps {
  images: { src: string; alt: string; aspect?: number }[];
}

export function ImageRow({ images }: ImageRowProps) {
  const aspects = images.map((img) => img.aspect ?? 16 / 9);
  const totalAspect = aspects.reduce((sum, a) => sum + a, 0);

  return (
    <ScrollReveal className="mb-section">
      <div className="flex gap-gallery-tight">
        {images.map((img, i) => (
          <div
            key={i}
            style={{ flex: `${aspects[i] / totalAspect}`, minWidth: 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={Math.round(1200 * aspects[i])}
              height={1200}
              className="w-full h-auto block"
              sizes={`${Math.round((aspects[i] / totalAspect) * 100)}vw`}
            />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}

interface VideoEmbedProps {
  src: string;
  poster?: string;
}

export function VideoEmbed({ src, poster }: VideoEmbedProps) {
  return (
    <ScrollReveal className="mb-section">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-background)]">
        <video
          src={src}
          poster={poster}
          controls
          muted
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    </ScrollReveal>
  );
}

interface LiveEmbedProps {
  label: string;
  description: string;
  href: string;
  src: string;
  title: string;
  iframeBg?: string;
}

export function LiveEmbed({
  label,
  description,
  href,
  src,
  title,
  iframeBg = "bg-white",
}: LiveEmbedProps) {
  return (
    <ScrollReveal className="mb-section mt-section">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 mb-8">
        <p className="label-swiss md:col-span-3">{label}</p>
        <div className="md:col-span-5 md:col-start-7">
          <p className="leading-body">{description}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="label-swiss hover-swiss underline underline-offset-4 inline-block mt-4"
          >
            Open full site &rarr;
          </a>
        </div>
      </div>
      <div className="border border-[var(--color-border)] overflow-hidden">
        <iframe
          src={src}
          title={title}
          className={`w-full ${iframeBg} h-[70vh] md:h-[90vh]`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </ScrollReveal>
  );
}

interface ResultItemProps {
  items: string[];
}

export function ResultsList({ items }: ResultItemProps) {
  return (
    <ScrollReveal className="mb-section">
      <div className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] pt-6 gap-4 md:gap-0">
        <h2 className="label-swiss md:col-span-3">Results</h2>
        <ul className="md:col-span-5 md:col-start-7 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="bullet-swiss" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}
