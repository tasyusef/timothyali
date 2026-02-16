"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { transition, delay } from "@/lib/motion";

export default function ContactPage() {
  return (
    <section className="page-wrapper">
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition.normal}
        className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] pb-row mb-section"
      >
        <p className="label-swiss md:col-span-3">Contact</p>
      </motion.div>

      {/* Intro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.stagger }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 mb-section"
      >
        <div className="md:col-span-5 md:col-start-1">
          <h1
            className="heading-swiss"
            style={{ fontSize: "var(--text-headline)" }}
          >
            Get in touch
          </h1>
        </div>
        <div className="md:col-span-5 md:col-start-7">
          <p className="leading-body">
            I&apos;m open to full-time product and brand design roles, as well as
            freelance projects. Let&apos;s talk.
          </p>
        </div>
      </motion.div>

      {/* Email */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.section }}
      >
        <a
          href="mailto:tas.yusef@gmail.com"
          className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row hover-swiss gap-2 md:gap-0"
        >
          <p className="label-swiss md:col-span-3">Email</p>
          <p
            className="md:col-span-5 md:col-start-7"
          >
            tas.yusef@gmail.com
          </p>
        </a>
      </motion.div>

      {/* GitHub */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.hero }}
      >
        <Link
          href="https://github.com/tasyusef"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row hover-swiss gap-2 md:gap-0"
        >
          <p className="label-swiss md:col-span-3">GitHub</p>
          <p
            className="md:col-span-5 md:col-start-7"
          >
            github.com/tasyusef
          </p>
        </Link>
      </motion.div>

      {/* LinkedIn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.hero }}
      >
        <Link
          href="https://linkedin.com/in/timothyali"
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-1 md:grid-cols-12 border-t border-[var(--color-border)] py-row hover-swiss gap-2 md:gap-0"
        >
          <p className="label-swiss md:col-span-3">LinkedIn</p>
          <p
            className="md:col-span-5 md:col-start-7"
          >
            linkedin.com/in/timothyali
          </p>
        </Link>
      </motion.div>

      {/* Availability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition.normal, delay: delay.stagger * 3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 border-t border-b border-[var(--color-border)] py-row gap-2 md:gap-0">
          <p className="label-swiss md:col-span-3">Availability</p>
          <p
            className="md:col-span-5 md:col-start-7"
          >
            Open to new projects
          </p>
        </div>
      </motion.div>
    </section>
  );
}
