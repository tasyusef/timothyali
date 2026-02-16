import Link from "next/link";
import { NAV_LINKS, NAV_LINK_COLUMNS } from "@/lib/layout";

export default function Footer() {
  return (
    <footer className="px-swiss pb-8">
      <div className="border-t border-[var(--color-border)] py-8">
        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-12 items-center">
          <div className="md:col-span-3">
            <p className="label-swiss text-[var(--color-foreground)]">Timothy Ali</p>
          </div>
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`label-swiss hover-swiss ${NAV_LINK_COLUMNS[i]} md:col-span-1`}
            >
              {link.label}
            </Link>
          ))}
          <div className="md:col-start-12 md:col-span-1 flex justify-end">
            <span className="label-swiss">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="label-swiss text-[var(--color-foreground)]">Timothy Ali</p>
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="label-swiss hover-swiss"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <span className="label-swiss">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
