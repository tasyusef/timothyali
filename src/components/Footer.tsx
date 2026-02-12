import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-swiss pb-8">
      <div className="border-t border-[var(--color-border)] py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="label-swiss text-[var(--color-foreground)]">Timothy Ali Yusef</p>
          <p className="label-swiss mt-1">
            Product Design, Brand Identity & Motion
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="https://linkedin.com/in/timothyali"
            target="_blank"
            rel="noopener noreferrer"
            className="label-swiss hover-swiss"
          >
            LinkedIn
          </Link>
          <Link
            href="/contact"
            className="label-swiss hover-swiss"
          >
            Contact
          </Link>
          <span className="label-swiss">&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
