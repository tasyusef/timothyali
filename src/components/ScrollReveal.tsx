"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ease, duration, viewport } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "none",
}: ScrollRevealProps) {
  const directionOffset = {
    up: { y: 12, x: 0 },
    down: { y: -12, x: 0 },
    left: { x: 12, y: 0 },
    right: { x: -12, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={viewport.default}
      transition={{
        duration: duration.slow,
        delay,
        ease: ease.swiss,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
