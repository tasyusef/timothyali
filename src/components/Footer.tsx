import Link from "next/link";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="px-swiss pb-8">
      <div className="border-t border-[var(--color-border)] py-8">
        <div className="grid grid-cols-2 md:grid-cols-12 items-center gap-y-4">
          <div className="md:col-span-3">
            <p className="label-swiss text-[var(--color-foreground)]">Timothy Ali</p>
          </div>
          {links.map((link, i) => {
            const colClass = [
              "md:col-start-5",
              "md:col-start-7",
              "md:col-start-9",
              "md:col-start-11",
            ][i];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hidden md:inline-flex label-swiss hover-swiss ${colClass} md:col-span-1`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="hidden md:flex md:col-start-12 md:col-span-1 justify-end">
            <span className="label-swiss">&copy; {new Date().getFullYear()}</span>
          </div>
          {/* Mobile links */}
          <div className="md:hidden flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label-swiss hover-swiss"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <span className="label-swiss">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
