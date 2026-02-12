"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { transition } from "@/lib/motion";

const posts = [
  {
    slug: "starting-with-less",
    title: "Starting With Less: A Foundation-First Approach to Design",
    date: "January 27, 2026",
    excerpt:
      "Effective design must originate from structural and conceptual rigor — visual expression is not the origin of meaning but the manifestation of prior analytical decisions.",
  },
];

export default function BlogPage() {
  return (
    <section className="page-wrapper">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition.normal}
        className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] pb-row"
      >
        <p className="label-swiss md:col-span-3">Writing</p>
      </motion.div>

      {/* Posts */}
      {posts.map((post, index) => (
        <motion.div
          key={post.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition.normal, delay: 0.1 * (index + 1) }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group block border-b border-[var(--color-border)] hover-swiss"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 py-row gap-4 md:gap-0">
              <div className="md:col-span-3">
                <p className="label-swiss">{post.date}</p>
              </div>
              <div className="md:col-span-5 md:col-start-7">
                <h2
                  className="heading-swiss"
                  style={{ fontSize: "var(--text-subhead)" }}
                >
                  {post.title}
                </h2>
                <p
                  className="mt-3 leading-[1.6]"
                  style={{ fontSize: "var(--text-caption)" }}
                >
                  {post.excerpt}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
