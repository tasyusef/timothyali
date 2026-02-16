"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import { ease, duration, delay, viewport } from "@/lib/motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport.card}
      transition={{
        duration: duration.entrance,
        delay: index * delay.stagger,
        ease: ease.swiss,
      }}
    >
      <Link href={`/work/${project.slug}`} className="group block hover:opacity-muted transition-opacity duration-fast ease-swiss">
        <div className="overflow-hidden">
          {project.heroVideo ? (
            <video
              src={project.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          ) : (
            <Image
              src={project.heroImage}
              alt={project.title}
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className="pt-3 flex items-baseline justify-between gap-4">
          <h3
            className="heading-swiss"
            style={{ fontSize: "var(--text-subhead)" }}
          >
            {project.title}
          </h3>
          <span
            className="shrink-0"
            style={{ fontSize: "var(--text-caption)", color: "var(--color-muted)" }}
          >
            {project.category} — {project.year}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
