"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transition, spring } from "@/lib/motion";
import { NAV_LINKS, NAV_LINK_COLUMNS } from "@/lib/layout";

function ThemeToggle({
  theme,
  toggle,
}: {
  theme: "dark" | "light";
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="label-swiss hover-swiss p-2"
    >
      {theme === "dark" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="3.5" />
          <line x1="8" y1="1" x2="8" y2="2.5" />
          <line x1="8" y1="13.5" x2="8" y2="15" />
          <line x1="1" y1="8" x2="2.5" y2="8" />
          <line x1="13.5" y1="8" x2="15" y2="8" />
          <line x1="3.05" y1="3.05" x2="4.1" y2="4.1" />
          <line x1="11.9" y1="11.9" x2="12.95" y2="12.95" />
          <line x1="3.05" y1="12.95" x2="4.1" y2="11.9" />
          <line x1="11.9" y1="4.1" x2="12.95" y2="3.05" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 9.5A6.5 6.5 0 0 1 6.5 2 5.5 5.5 0 1 0 14 9.5Z" />
        </svg>
      )}
    </button>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as
      | "dark"
      | "light"
      | null;
    const initial = stored || "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Close mobile nav on Escape + trap focus within overlay
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.addEventListener("keydown", handleEscape);
    // Trap focus within overlay
    const overlay = mobileNavRef.current;
    if (overlay) {
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      first?.focus();
      const trapFocus = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      };
      document.addEventListener("keydown", trapFocus);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", trapFocus);
      };
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, handleEscape]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  return (
    <nav aria-label="Main navigation" className="relative z-nav py-6 md:py-8 px-swiss">
      <div className="flex md:grid md:grid-cols-12 items-center justify-between">
        <Link
          href="/"
          className="label-swiss text-[var(--color-foreground)] md:col-span-3"
        >
          Timothy Ali
        </Link>

        {/* Desktop nav */}
        {NAV_LINKS.map((link, i) => {
          const isActive =
            link.href === "/"
              ? pathname === "/" || pathname.startsWith("/work")
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`hidden md:inline-flex label-swiss hover-swiss relative ${NAV_LINK_COLUMNS[i]} md:col-span-1 ${
                isActive
                  ? "text-[var(--color-foreground)]"
                  : ""
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-foreground)]"
                  transition={spring.nav}
                />
              )}
              <span className="relative z-dropdown">{link.label}</span>
            </Link>
          );
        })}
        <div className="hidden md:flex md:col-start-12 md:col-span-1 justify-end">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>

        {/* Mobile hamburger + theme toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
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
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="fixed inset-0 z-nav bg-[var(--color-background)] flex flex-col justify-center px-swiss"
          >
            <button
              type="button"
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
            <div className="flex flex-col gap-6 items-end text-right">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/" || pathname.startsWith("/work")
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`heading-swiss hover-swiss inline-block text-headline pb-[0.1em] ${
                      isActive
                        ? "text-[var(--color-foreground)] border-b border-[var(--color-foreground)]"
                        : "text-[var(--color-muted)] border-b border-transparent"
                    }`}
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
