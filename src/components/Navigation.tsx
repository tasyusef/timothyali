"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transition } from "@/lib/motion";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 py-6 md:py-8 px-swiss">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="label-swiss text-[var(--color-foreground)]"
        >
          Timothy Ali
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/work")
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`label-swiss hover-swiss ${
                  isActive
                    ? "text-[var(--color-foreground)]"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-px bg-[var(--color-foreground)]"
            animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
            transition={transition.fast}
          />
          <motion.span
            className="block w-5 h-px bg-[var(--color-foreground)]"
            animate={mobileOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
            transition={transition.fast}
          />
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="fixed inset-0 z-40 bg-[var(--color-background)] flex flex-col justify-center px-swiss"
          >
            <button
              className="absolute top-6 right-[var(--spacing-section)] flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <motion.span
                className="block w-5 h-px bg-[var(--color-foreground)]"
                animate={{ rotate: 45, y: 3.5 }}
              />
              <motion.span
                className="block w-5 h-px bg-[var(--color-foreground)]"
                animate={{ rotate: -45, y: -3.5 }}
              />
            </button>
            <div className="flex flex-col gap-6">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/" || pathname.startsWith("/work")
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`heading-swiss hover-swiss ${
                      isActive
                        ? "text-[var(--color-foreground)]"
                        : "text-[var(--color-muted)]"
                    }`}
                    style={{ fontSize: "var(--text-headline)" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
