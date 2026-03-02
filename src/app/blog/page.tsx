"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { transition, delay } from "@/lib/motion";
import { posts } from "@/lib/posts";

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
          transition={{ ...transition.normal, delay: delay.stagger * (index + 1) }}
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
                  className="heading-swiss text-subhead"
                >
                  {post.title}
                </h2>
                <p
                  className="mt-3 leading-body text-caption-size"
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
